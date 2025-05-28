import { adminStatus } from "@prisma/client";
import prisma from "../prisma/client.prisma.js";

/**
 * 챌린지 등록 및 자동 신청
 */
async function save(challenge, userId) {
  return await prisma.$transaction(async (tx) => {
    const createdChallenge = await tx.challenge.create({
      data: {
        authorId: userId,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        docType: challenge.docType,
        originalUrl: challenge.originalUrl,
        deadline: challenge.deadline,
        maxParticipant: challenge.maxParticipant,
      },
    });

    const createdApplication = await tx.application.create({
      data: {
        authorId: userId,
        challengeId: createdChallenge.id,
        appliedAt: new Date(),
      },
    });

    return { createdChallenge, createdApplication };
  });
}

// 승인된 챌린지 전체 조회 (추후 사용 예정)
const findAllChallenges = async () => {
  return await prisma.challenge.findMany({
    where: {
      application: {
        adminStatus: "ACCEPTED",
      },
    },
    include: {
      participants: true,
    },
  });
};

// 특정 challenge 조회 (상세 조회에 활용)
const findChallengeDetailById = async (challengeId) => {
  return await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      docType: true,
      originalUrl: true,
      deadline: true,
      maxParticipant: true,
      authorId: true, // 필요 시
    },
  });
};

// 특정 challenge 조회  (수정, 삭제에 활용)
const findChallengeById = async (challengeId) => {
  return await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { id: true, authorId: true, title: true },
  });
};

// 사용자 역할 조회
const findUserRoleById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
};

// challenge update
const updateChallenge = async (challengeId, updateData) => {
  return await prisma.challenge.update({
    where: { id: challengeId },
    data: updateData,
  });
};

// 관리자 - 신청 상태 업데이트
const updateApplication = async (challengeId, updateData) => {
  const data = { ...updateData };

  if (["REJECTED", "DELETED"].includes(updateData.adminStatus)) {
    data.invalidatedAt = new Date();
  }

  return await prisma.application.update({
    where: { challengeId },
    data,
  });
};

const deleteChallengeById = async (challengeId) => {
  await prisma.application.deleteMany({
    where: {
      challengeId: challengeId, // 해당 챌린지를 참조하는 모든 신청 삭제
    },
  });

  await prisma.challenge.delete({
    where: { id: challengeId },
  });
};

//챌린지 목록 가져오기
async function getChallenges(options) {
  const { page = 1, pageSize = 10, category, docType, keyword } = options;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const keywordWithoutSpaces = keyword ? keyword.replace(/\s+/g, "") : ""; //띄어쓰기도 인식하도록

  let categoryCondition = "";
  if (category) categoryCondition = `AND category = '${category}'`;
  let docTypeCondition = "";
  if (docType) docTypeCondition = `AND docType = '${docType}'`;

  //데이터 갯수 세는 쿼리
  const countResult = await prisma.$queryRawUnsafe(`
  SELECT COUNT(DISTINCT c.id) as count
  FROM "Challenge" c
  LEFT JOIN "Participant" p ON p."challengeId" = c.id
  LEFT JOIN "Application" a ON a."challengeId" = c.id
  WHERE 
    (
      REPLACE(c.title, ' ', '') ILIKE '%${keywordWithoutSpaces}%'
      OR REPLACE(c.description, ' ', '') ILIKE '%${keywordWithoutSpaces}%'
    )
    ${categoryCondition}
    ${docTypeCondition}
`);
  const totalCount = Number(countResult[0]?.count || 0);

  // 데이터 조회 쿼리
  const challenges = await prisma.$queryRawUnsafe(`
  SELECT 
    c.*, 
    json_agg(DISTINCT jsonb_build_object(
      'id', p."id",
      'userId', p."userId",
      'challengeId', p."challengeId"
    )) AS participants,
    json_agg(DISTINCT jsonb_build_object(
      'adminStatus', a."adminStatus",
      'appliedAt', a."appliedAt"
    )) FILTER (WHERE a."adminStatus" IS NOT NULL) AS application
  FROM "Challenge" c
  LEFT JOIN "Participant" p ON p."challengeId" = c."id"
  LEFT JOIN "Application" a ON a."challengeId" = c."id"
  WHERE 
    (
      REPLACE(c."title", ' ', '') ILIKE '%${keywordWithoutSpaces}%'
      OR REPLACE(c."description", ' ', '') ILIKE '%${keywordWithoutSpaces}%'
    )
    ${categoryCondition}
    ${docTypeCondition}
  GROUP BY c."id"
  ORDER BY c."createdAt" DESC
  LIMIT ${take} OFFSET ${skip};
`);

  return {
    totalCount,
    currentPage: Number(page),
    pageSize: Number(pageSize),
    data: challenges,
  };
}

export default {
  save,
  getChallenges,
  findAllChallenges,
  findUserRoleById,
  findChallengeById,
  updateChallenge,
  updateApplication,
  deleteChallengeById,
  findChallengeDetailById,
};

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
  const {
    page = 1,
    pageSize = 10,
    category,
    docType,
    keyword,
    status,
  } = options;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = {};

  if (category) {
    where.category = category;
  }

  if (docType) {
    where.docType = docType;
  }

  if (keyword) {
    const keywordWithoutSpaces = keyword.replace(/\s/g, "");
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
      { title: { contains: keywordWithoutSpaces, mode: "insensitive" } },
      { description: { contains: keywordWithoutSpaces, mode: "insensitive" } },
    ];
  }

  //데이터의 총 갯수(챌린지 상태는 제외되어있음)
  const allChallenges = await prisma.challenge.findMany({
    where,
    include: {
      participants: true,
      application: {
        select: {
          adminStatus: true,
          appliedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date(); //deadline과 비교를 위해

  // status(챌린지의 진행 중, 마감 상태)를 포함하여 필터링
  const challengesWithStatus = allChallenges.map((challenge) => {
    let status = "open";

    if (new Date(challenge.deadline) < now) {
      status = "expired";
    } else if (challenge.participants.length > challenge.maxParticipant) {
      status = "closed";
    }

    return {
      ...challenge,
      status,
    };
  });

  //최종적인 챌린지 데이터
  const statusFilterdChallenges = status
    ? challengesWithStatus.filter((c) => c.status === status)
    : challengesWithStatus;

  //모든 챌린지 데이터에서 페이지네이션으로 자르기
  const pagedChallenges = statusFilterdChallenges.slice(skip, skip + take);

  return {
    totalCount: statusFilterdChallenges.length,
    currentPage: Number(page),
    pageSize: Number(pageSize),
    data: pagedChallenges,
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

import prisma from "../prisma/client.prisma.js";

async function save(challenge, userId) {
  return await prisma.challenge.create({
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
}

// 모든 challenge 조회
const findAllChallenges = async () => {
  return await prisma.challenge.findMany ({})
}
// 특정 challenge 조회 (상세 조회에 활용)
const findChallengeDetailById = async (challengeId) => {
  return await prisma.challenge.findUnique ( {
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
  })
}

// 특정 challenge 조회  (수정, 삭제에 활용)
const findChallengeById = async (challengeId) => {
  return await prisma.challenge.findUnique ( {
    where: { id: challengeId },
    select: { id: true, authorId: true },
  })
}

// challenge update
const updateChallenge = async (challengeId, updateData) => {
  return await prisma.challenge.update({
    where: { id: challengeId },
    data: updateData,
  })
}

const deleteChallengeById = async (challengeId) => {  
  await prisma.application.deleteMany({
    where: {
      challengeId : challengeId, // 해당 챌린지를 참조하는 모든 신청 삭제
      },
  });
  
  await prisma.challenge.delete({
    where: { id: challengeId },
  });

};

async function getChallenges(options) {
  //디버깅 쿼리 객체
  console.log("options", options);

  const { page = 1, pageSize = 10, category, docType, keyword } = options;

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
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const challenges = await prisma.challenge.findMany({
    where,
    skip,
    take,
  });

  return challenges;
}

export default {
  save,
  getChallenges,
  findAllChallenges,
  findChallengeById,
  updateChallenge,
  deleteChallengeById,
  findChallengeDetailById
};

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
};

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

async function getAll() {
  const challenges = await prisma.challenge.findMany();
  return challenges;
}

export default {
  save,
  getAll,
};

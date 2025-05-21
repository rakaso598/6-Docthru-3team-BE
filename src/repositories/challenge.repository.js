import prisma from "../prisma/client.prisma.js";

async function save(challenge, userId) {
  // 디버깅
  console.log("challenge", challenge);

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

export default {
  save,
};

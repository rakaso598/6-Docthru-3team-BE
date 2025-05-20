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


// 모든 challenge 조회
const findAllChallenges = async () => {
  return await prisma.challenge.findMany ({})
}

// 특정 challenge 조회
const findChallengeById = async (challengeId) => {
  return await prisma.challenge.findUnique ( {
    where: { id: challengeId },
  })
}

// challenge update
const updateChallenge = async (challengeId, updateData) => {
  return await prisma.challenge.update({
    where: { id: challengeId },
    data: updateData,
  })
}

const deleteChallenge = async (challengeId) => {  
  await prisma.application.deleteMany({
    where: {
      challengeId : challengeId, // 해당 챌린지를 참조하는 모든 신청 삭제
      },
  });
  
  await prisma.challenge.delete({
    where: { id: challengeId },
  });

};

export default {
  save,
  findAllChallenges,
  findChallengeById,
  updateChallenge,
  deleteChallenge
};

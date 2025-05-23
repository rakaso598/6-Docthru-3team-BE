import prisma from "../prisma/client.prisma.js";

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      grade: true,
      createdAt: true,
    },
  });
};

export const findParticipatedChallenges = async (
  userId,
  now,
  keywordFilter
) => {
  return await prisma.participant.findMany({
    where: {
      userId,
      challenge: {
        deadline: { gt: now },
        ...keywordFilter,
      },
    },
    include: { challenge: true },
  });
};

export const findCompletedChallenges = async (userId, now, keywordFilter) => {
  return await prisma.participant.findMany({
    where: {
      userId,
      challenge: {
        deadline: { lte: now },
        ...keywordFilter,
      },
    },
    include: { challenge: true },
  });
};

export const findMyCreatedChallenges = async (userId, keywordFilter) => {
  return await prisma.challenge.findMany({
    where: {
      authorId: userId,
      ...keywordFilter,
    },
  });
};

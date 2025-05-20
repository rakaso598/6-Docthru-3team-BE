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

export const findPendingApplications = async (userId, keywordFilter) => {
  return await prisma.application.findMany({
    where: {
      authorId: userId,
      status: "PENDING",
      challenge: keywordFilter,
    },
    include: {
      challenge: true,
    },
  });
};

export const findParticipatedChallenges = async (
  userId,
  afterDate,
  keywordFilter
) => {
  return await prisma.participant.findMany({
    where: {
      userId,
      challenge: {
        deadline: { gt: afterDate },
        ...keywordFilter,
      },
    },
    include: {
      challenge: true,
    },
  });
};

export const findCompletedChallenges = async (
  userId,
  beforeDate,
  keywordFilter
) => {
  return await prisma.participant.findMany({
    where: {
      userId,
      challenge: {
        deadline: { lte: beforeDate },
        ...keywordFilter,
      },
    },
    include: {
      challenge: true,
    },
  });
};

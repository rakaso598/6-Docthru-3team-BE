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

export const findMyCreatedChallenges = async (
  userId,
  keywordFilter,
  options = {}
) => {
  const { page = 1, pageSize = 10, category, docType, keyword } = options;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = {
    authorId: userId,
    ...keywordFilter,
  };

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

  const [totalCount, challenges] = await Promise.all([
    prisma.challenge.count({ where }),
    prisma.challenge.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
      include: {
        participants: true, // 관계 포함
        application: {
          select: {
            adminStatus: true,
            appliedAt: true,
          },
        },
      },
    }),
  ]);

  return {
    data: challenges,
    totalCount,
    currentPage: Number(page),
    pageSize: Number(pageSize),
  };
};

export const findMyApplication = async (applicationId) => {
  return await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });
};

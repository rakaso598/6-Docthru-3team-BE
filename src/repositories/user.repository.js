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

export async function findMyChallenges(where, take, cursor, userId) {
  return await prisma.challenge.findMany({
    take: take + 1,
    ...(cursor && {
      cursor: {
        id: Number(cursor),
      },
      skip: 1,
    }),
    where,
    include: {
      works: {
        where: { authorId: userId },
        select: {
          id: true,
          challengeId: true,
          authorId: true,
        },
      },
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
}

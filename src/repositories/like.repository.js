import prisma from "../prisma/client.prisma.js";

const createLike = async (workId, userId) => {
  const like = await prisma.like.create({
    data: {
      workId,
      userId,
    },
  });

  return like;
};

const deleteLike = async (workId, userId) => {
  const deletedLike = await prisma.like.delete({
    where: {
      userId_workId: { userId, workId },
    },
  });

  return deletedLike;
};

export default {
  createLike,
  deleteLike,
};

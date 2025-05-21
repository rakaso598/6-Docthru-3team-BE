import prisma from "../prisma/client.prisma.js";

// 전체 work 조회
const findAllWorks = async () => {
  const works = await prisma.work.findMany({
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  // _count를 likeCount로 변환
  return works.map((work) => ({
    ...work,
    likeCount: work._count.likes,
    _count: undefined,
  }));
};

// 특정 work 조회
const findWorkById = async (workId) => {
  const work = await prisma.work.findUnique({
    where: { id: workId },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!work) return null;

  // _count를 likeCount로 변환
  return {
    ...work,
    likeCount: work._count.likes,
    _count: undefined,
  };
};

// 특정 챌린지에서 특정 작업물 조회
const findWorkByChallengeIdAndAuthorId = async (challengeId, authorId) => {
  const work = await prisma.work.findFirst({
    where: { challengeId, authorId },
  });
  return work;
};

// work 생성
const createWork = async (content, challengeId, authorId) => {
  const work = await prisma.work.create({
    data: {
      content,
      challengeId,
      authorId,
    },
  });
  return work;
};

// work 수정
const updateWork = async (workId, { content }) => {
  const updatedWork = await prisma.work.update({
    where: { id: workId },
    data: { content },
  });
  return updatedWork;
};

// work 삭제
const deleteWork = async (workId) => {
  await prisma.work.delete({
    where: { id: workId },
  });
};

// 작성자 id & title 조회회
const findIdAndTitle = async (workId) => {
  return prisma.work.findUnique({
    where: { id: Number(workId) },
    include: {
      challenge: {
        select: {
          title: true,
        },
      },
    },
  });
};

export default {
  findAllWorks,
  findWorkById,
  findWorkByChallengeIdAndAuthorId,
  createWork,
  updateWork,
  deleteWork,
  findIdAndTitle,
};

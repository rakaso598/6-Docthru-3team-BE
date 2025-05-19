import prisma from "../prisma/client.prisma.js";

// 전체 work 조회
const findAllWorks = async () => {
  const works = await prisma.work.findMany();
  return works;
};

// 특정 work 조회
const findWorkById = async (workId) => {
  const work = await prisma.work.findUnique({
    where: { id: workId },
  });
  return work;
};

// 특정 챌린지에서 특정 작업물 조회
const findWorkByChallengeIdAndAuthorId = async (challengeId, authorId) => {
  const work = await prisma.work.findFirst({
    where: { challengeId, authorId },
  });
  return work;
};

// work 생성
const createWork = async ({ title, content, challengeId, authorId }) => {
  const work = await prisma.work.create({
    data: {
      title,
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

export default {
  findAllWorks,
  findWorkById,
  findWorkByChallengeIdAndAuthorId,
  createWork,
  updateWork,
  deleteWork,
};

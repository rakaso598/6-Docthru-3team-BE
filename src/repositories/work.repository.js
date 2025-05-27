import prisma from "../prisma/client.prisma.js";

// 현재 챌린지의 모든 work 조회
const findAllWorks = async (challengeId, page, pageSize) => {
  const works = await prisma.work.findMany({
    where: { challengeId },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
      challenge: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      likes: {
        _count: "desc", // 좋아요 수를 기준으로 내림차순 정렬
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return works.map((work) => ({
    workId: work.id,
    author: {
      authorId: work.user.id,
      authorNickname: work.user.nickname,
    },
    challengeId: work.challengeId,
    challengeTitle: work.challenge.title,
    content: work.content,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
    likeCount: work._count.likes,
    isLiked: false, // 로그인 유저 정보 기반으로 나중에 처리
  }));
};

// 특정 work 조회
const findWorkById = async (workId) => {
  const work = await prisma.work.findUnique({
    where: { id: workId },
    include: {
      challenge: {
        select: {
          title: true,
          originalUrl: true,
        },
      },
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
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
    workId: work.id,
    challengeTitle: work.challenge.title,
    content: work.content,
    author: {
      authorId: work.user.id,
      authorNickname: work.user.nickname,
    },
    originalUrl: work.challenge.originalUrl,
    createdAt: work.createdAt,
    likeCount: work._count.likes,
    updatedAt: work.updatedAt,
  };
};

// 특정 챌린지에서 특정 작업물 조회
const findWorkByChallengeIdAndAuthorId = async (challengeId, authorId) => {
  const work = await prisma.work.findFirst({
    where: { challengeId, authorId },
  });
  return work;
};

// work 생성 및 참여자 추가
const createWork = async (challengeId, authorId) => {
  // 트랜잭션으로 작업물 생성과 참여자 추가를 동시에 처리
  const result = await prisma.$transaction(async (tx) => {
    // 작업물 생성
    const work = await tx.work.create({
      data: {
        challengeId,
        authorId,
      },
    });

    // 참여자 추가
    await tx.participant.create({
      data: {
        challengeId,
        userId: authorId,
      },
    });

    return work;
  });

  return result;
};

// work 수정
const updateWork = async (workId, content) => {
  const updatedWork = await prisma.work.update({
    where: { id: workId },
    data: { content },
  });
  return updatedWork;
};

// work 하드삭제 및 참여자 삭제
const hardDeleteWork = async (workId) => {
  const result = await prisma.$transaction(async (tx) => {
    const work = await tx.work.findUnique({
      where: { id: workId },
    });

    if (!work) {
      const error = new Error("해당 작업을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    // 참여자 삭제 (복합 유니크 키 사용)
    await tx.participant.delete({
      where: {
        userId_challengeId: {
          userId: work.authorId,
          challengeId: work.challengeId,
        },
      },
    });

    // 작업물 삭제
    await tx.work.delete({
      where: { id: workId },
    });

    return work;
  });

  return result;
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

// 작성자 확인
const isAuthor = async (workId, userId) => {
  const work = await prisma.work.findUnique({
    where: { id: workId },
  });
  return work.authorId === userId;
};

export default {
  findAllWorks,
  findWorkById,
  findWorkByChallengeIdAndAuthorId,
  createWork,
  updateWork,
  hardDeleteWork,
  findIdAndTitle,
  isAuthor,
};

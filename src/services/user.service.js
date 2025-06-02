import * as userRepository from "../repositories/user.repository.js";
import prisma from "../prisma/client.prisma.js";

// 유저 정보 조회
export const getMyInfo = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return user;
};

// 유저 챌린지 조회 - 참여중/완료한
export const getMyChallenges = async (query, userId) => {
  const { pageSize, cursor, category, docType, keyword, status } = query;
  const statusList = status
    ? Array.isArray(status)
      ? status
      : status.split(",")
    : null;

  return await userRepository.findMyChallenges(
    {
      pageSize,
      cursor,
      category,
      docType,
      keyword,
      statusList,
    },
    userId
  );
};

// 유저 등급 업데이트 함수
export const tryUpgradeUserGrade = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { works: true },
  });

  if (!user || user.grade === "EXPERT") return;

  const workCount = user.works.length;
  const mostRecommendedCount = user.mostRecommendedCount;

  const isExpert =
    (mostRecommendedCount >= 5 && workCount >= 5) ||
    mostRecommendedCount >= 10 ||
    workCount >= 10;

  if (isExpert) {
    await prisma.user.update({
      where: { id: userId },
      data: { grade: "EXPERT" },
    });
  }
};

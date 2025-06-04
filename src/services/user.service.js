import * as userRepository from "../repositories/user.repository.js";
import prisma from "../prisma/client.prisma.js";
import { getInitial } from "../utils/initial.utils.js";

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
  const { pageSize = 4, cursor, category, docType, keyword, status } = query;

  const statusList = status
    ? Array.isArray(status)
      ? status
      : status.split(",")
    : null;

  const where = {
    application: {
      adminStatus: "ACCEPTED",
    },
    participants: {
      some: {
        userId: userId,
      },
    },
    ...(category && { category }),
    ...(docType && { docType }),
  };

  const take = Number(pageSize) + 3;
  let challenges = await userRepository.findMyChallenges(
    where,
    take,
    cursor,
    userId
  );

  // 키워드 필터링
  if (keyword) {
    const keywordNoSpace = keyword.replace(/\s/g, "").toLowerCase();
    const keywordInitial = getInitial(keywordNoSpace);

    challenges = challenges.filter((challenge) => {
      const title = challenge.title || "";
      const desc = challenge.description || "";
      const normalizedTitle = title.replace(/\s/g, "").toLowerCase();
      const normalizedDesc = desc.replace(/\s/g, "").toLowerCase();
      const titleChosung = getInitial(normalizedTitle);
      const descChosung = getInitial(normalizedDesc);

      return (
        normalizedTitle.includes(keywordNoSpace) ||
        normalizedDesc.includes(keywordNoSpace) ||
        titleChosung.includes(keywordInitial) ||
        descChosung.includes(keywordInitial)
      );
    });
  }

  // status 계산 후 필터링
  const now = new Date();
  const challengesWithStatus = challenges.map((challenge) => {
    const isDeadlinePassed = new Date(challenge.deadline) <= now;
    const participantCount = Array.isArray(challenge.participants)
      ? challenge.participants.length
      : 0;
    const isFull = participantCount >= challenge.maxParticipant;

    let status;
    if (isDeadlinePassed) {
      status = "closed";
    } else if (isFull) {
      status = "full";
    } else {
      status = "open";
    }

    return {
      ...challenge,
      status,
    };
  });

  const filtered = statusList
    ? challengesWithStatus.filter((c) => statusList.includes(c.status))
    : challengesWithStatus;

  const hasNextPage = filtered.length > pageSize;
  const slicedData = filtered.slice(0, pageSize);

  return {
    challenges: slicedData,
    nextCursor: hasNextPage ? slicedData[slicedData.length - 1].id : null,
  };
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

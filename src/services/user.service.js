import * as userRepository from "../repositories/user.repository.js";

export const getMyInfo = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }
  return user;
};

export const getMyChallenges = async (userId, myChallengeStatus, keyword) => {
  const now = new Date();

  const keywordFilter = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  if (myChallengeStatus === "applied") {
    const applications = await userRepository.findPendingApplications(
      userId,
      keywordFilter
    );
    return applications.map((a) => a.challenge);
  }

  if (myChallengeStatus === "participated") {
    const participants = await userRepository.findParticipatedChallenges(
      userId,
      now,
      keywordFilter
    );
    return participants.map((p) => p.challenge);
  }

  if (myChallengeStatus === "completed") {
    const participants = await userRepository.findCompletedChallenges(
      userId,
      now,
      keywordFilter
    );
    return participants.map((p) => p.challenge);
  }

  // 잘못된 status
  const error = new Error("잘못된 챌린지 상태입니다.");
  error.status = 400;
  throw error;
};

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

export const getMyChallenges = async (userId, myChallengeStatus, keyword, options = {}) => {
  const now = new Date();
  const keywordFilter = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const page = options.page || 1;
  const pageSize = options.pageSize || 10;

  if (myChallengeStatus === "participated") {
    const participants = await userRepository.findParticipatedChallenges(
      userId,
      now,
      keywordFilter,
      { page, pageSize }
    );
    return participants.map((p) => p.challenge);
  }

  if (myChallengeStatus === "completed") {
    const participants = await userRepository.findCompletedChallenges(
      userId,
      now,
      keywordFilter,
      { page, pageSize }
    );
    return participants.map((p) => p.challenge);
  }

  if (myChallengeStatus === "applied") {
    const createdChallenges = await userRepository.findMyCreatedChallenges(
      userId,
      keywordFilter,
      { page, pageSize }
    );
    return createdChallenges;
  }

  const error = new Error("잘못된 챌린지 상태입니다.");
  error.status = 400;
  throw error;
};

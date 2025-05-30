import * as userRepository from "../repositories/user.repository.js";

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
export const getMyChallenges = async (options, userId) => {
  return await userRepository.findMyChallenges(options, userId);
};

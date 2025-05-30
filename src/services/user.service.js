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

export const getMyChallenges = async (
  userId,
  myChallengeStatus,
  keyword,
  options = {}
) => {
  const now = new Date();
  const keywordFilter = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  const validStatuses = ["applied", "participated", "completed"];
  const { page = 1, pageSize = 10 } = options;
  if (!validStatuses.includes(myChallengeStatus)) {
    const error = new Error("잘못된 챌린지 상태입니다.");
    error.status = 400;
    throw error;
  }

  if (myChallengeStatus === "applied") {
    // applied는 findMyChallengesByStatus가 totalCount, data 포함 객체를 반환한다고 가정
    const { data, totalCount } = await userRepository.findMyChallengesByStatus(
      userId,
      myChallengeStatus,
      keywordFilter,
      { page, pageSize }
    );
    return {
      data,
      totalCount,
      currentPage: page,
      pageSize,
    };
  } else {
    // participated, completed 등 상태
    const { data, totalCount } = await userRepository.findMyChallengesByStatus(
      userId,
      myChallengeStatus,
      keywordFilter,
      { page, pageSize }
    );

    return {
      data,
      totalCount,
      currentPage: page,
      pageSize,
    };
  }
};

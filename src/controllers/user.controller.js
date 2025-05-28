import * as userService from "../services/user.service.js";

export const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getMyInfo(userId);
    res.status(200).json(user);
  } catch (error) {
    const status = error.status || 500;
    console.error("유저 조회 실패:", error);
    res.status(status).json({ message: error.message || "서버 내부 오류" });
  }
};

export const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { myChallengeStatus, keyword } = req.query;

    const pageInt = parseInt(req.query.page, 10);
    const pageSizeInt = parseInt(req.query.pageSize, 10);

    const currentPage = Number.isNaN(pageInt) ? 1 : pageInt;
    const pageSize = Number.isNaN(pageSizeInt) ? 10 : pageSizeInt;

    const { data, totalCount } = await userService.getMyChallenges(
      userId,
      myChallengeStatus,
      keyword,
      { page: currentPage, pageSize }
    );

    res.status(200).json({
      data,
      totalCount,
      currentPage,
      pageSize,
    });
  } catch (error) {
    const status = error.status || 500;
    console.error("나의 챌린지 조회 실패:", error);
    res.status(status).json({ message: error.message || "서버 내부 오류" });
  }
};

export const getMyApplication = async (req, res) => {
  const applicationId = Number(req.params.applicationId);
  try {
    const data = await userService.getApplication(applicationId);
    const { challenge, ...rest } = data;
    res.json({ application: rest, challenge });
  } catch (error) {
    console.error("신청한 챌린지 조회 실패:", error);
  }
};

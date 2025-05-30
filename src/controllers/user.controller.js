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

export const getMyChallenges = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const challenges = await userService.getMyChallenges(req.query, userId);
    return res.json(challenges);
  } catch (err) {
    next(err);
  }
};

import express from "express";
import * as feedbackController from "../controllers/feedback.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const feedbackRouter = express.Router();

// 목록 조회
feedbackRouter.get("/works/:workId/feedbacks", feedbackController.getFeedbacks);

// 등록
feedbackRouter.post(
  "/works/:workId/feedbacks",
  verifyAccessToken,
  feedbackController.addFeedback
);

// 수정
feedbackRouter.patch(
  "/:feedbackId",
  verifyAccessToken,
  feedbackController.editFeedback
);

// 삭제
feedbackRouter.delete(
  "/:feedbackId",
  verifyAccessToken,
  feedbackController.deleteFeedback
);

export default feedbackRouter;

import express from "express";
import {
  getFeedbacksByWorkId,
  createFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const feedbackRouter = express.Router({ mergeParams: true });

// 피드백 목록 조회
feedbackRouter.get("/", getFeedbacksByWorkId);

// 피드백 등록
// (인증 및 권한 미들웨어 필요)
feedbackRouter.post("/", createFeedback);

// 피드백 상세 조회
feedbackRouter.get("/:feedbackId", getFeedbackById);

// 피드백 수정
// (인증 및 권한 미들웨어 필요)
feedbackRouter.patch("/:feedbackId", /* authMiddleware, */ updateFeedback);

// 피드백 삭제
// (인증 및 권한 미들웨어 필요)
feedbackRouter.delete("/:feedbackId", /* authMiddleware, */ deleteFeedback);

export default feedbackRouter;

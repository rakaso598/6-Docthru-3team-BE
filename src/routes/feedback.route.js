import express from "express";
import * as feedbackController from "../controllers/feedback.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const feedbackRouter = express.Router();

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

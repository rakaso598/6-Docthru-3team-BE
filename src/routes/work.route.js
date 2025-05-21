import express from "express";
import {
  getAllWorks,
  getWorkById,
  createWork,
  updateWork,
  hardDeleteWork,
  likeWork,
  unlikeWork,
} from "../controllers/work.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import {
  getFeedbacks,
  addFeedback,
  editFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";

const workRouter = express.Router({ mergeParams: true });

// --- Work 관련 라우트 ---
workRouter.get("/", getAllWorks);
workRouter.get("/:workId", getWorkById);
workRouter.post("/", verifyAccessToken, createWork);
workRouter.patch("/:workId", verifyAccessToken, updateWork);
workRouter.delete("/:workId", verifyAccessToken, hardDeleteWork);
workRouter.post("/:workId/like", verifyAccessToken, likeWork);
workRouter.delete("/:workId/like", verifyAccessToken, unlikeWork);

// --- Work에 종속된 Feedback 관련 라우트 ---
workRouter.get("/:workId/feedbacks", getFeedbacks);
workRouter.post("/:workId/feedbacks", verifyAccessToken, addFeedback);
workRouter.patch(
  "/:workId/feedbacks/:feedbackId",
  verifyAccessToken,
  editFeedback
);
workRouter.delete(
  "/:workId/feedbacks/:feedbackId",
  verifyAccessToken,
  deleteFeedback
);

export default workRouter;

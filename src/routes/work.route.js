import express from "express";
import {
  getAllWorks,
  getWorkById,
  createWork,
  updateWork,
  hardDeleteWork,
  likeWork,
  unlikeWork,
  getWorkByIdAtForm,
} from "../controllers/work.controller.js";
import {
  getFeedbacks,
  addFeedback,
  editFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const workRouter = express.Router({ mergeParams: true });

// --- Work 관련 라우트 ---
workRouter.get("/", verifyAccessToken, getAllWorks);
workRouter.get("/:workId", verifyAccessToken, getWorkById);
workRouter.get("/:workId/form", verifyAccessToken, getWorkByIdAtForm);
workRouter.post("/", verifyAccessToken, createWork);
workRouter.patch("/:workId", verifyAccessToken, updateWork);
workRouter.delete("/:workId", verifyAccessToken, hardDeleteWork);
workRouter.post("/:workId/like", verifyAccessToken, likeWork);
workRouter.delete("/:workId/like", verifyAccessToken, unlikeWork);

// --- Work에 종속된 Feedback 관련 라우트 ---
workRouter.get("/:workId/feedbacks", verifyAccessToken, getFeedbacks);
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

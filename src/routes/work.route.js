import express from "express";
import {
  getAllWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
  likeWork,
  unlikeWork,
} from "../controllers/work.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import {
  getFeedbacks,
  addFeedback,
} from "../controllers/feedback.controller.js";

// 중첩 라우팅에서 상위 라우터의 파라미터를 이용하기 위해 mergeParams 옵션 사용
const workRouter = express.Router({ mergeParams: true });

// 모든 작업물 조회
workRouter.get("/", getAllWorks);

// 특정 작업물 조회
workRouter.get("/:workId", getWorkById);

// 작업물 생성
workRouter.post("/", verifyAccessToken, createWork);

// 작업물 수정
workRouter.patch("/:workId", verifyAccessToken, updateWork);

// 작업물 삭제
workRouter.delete("/:workId", verifyAccessToken, deleteWork);

// 작업물 좋아요
workRouter.post("/:workId/like", verifyAccessToken, likeWork);

// 작업물 좋아요 취소
workRouter.delete("/:workId/like", verifyAccessToken, unlikeWork);

// 피드백 목록 조회
workRouter.get("/:workId/feedbacks", getFeedbacks);

// 피드백 등록
workRouter.post("/:workId/feedbacks", verifyAccessToken, addFeedback);

export default workRouter;

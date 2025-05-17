import express from "express";
import {
  getAllWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
} from "../controllers/work.controller.js";

const workRouter = express.Router();

// 모든 작업물 조회
workRouter.get("/", getAllWorks);

// 특정 작업물 조회
workRouter.get("/:id", getWorkById);

// 작업물 생성
workRouter.post("/", createWork);

// 작업물 정보 수정
workRouter.put("/:id", updateWork);

// 작업물 삭제
workRouter.delete("/:id", deleteWork);

export default workRouter;

import express from "express";
import {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challenge.controller.js";
import workRouter from "./work.route.js";

const challengeRouter = express.Router();

// 모든 챌린지 조회
challengeRouter.get("/", getAllChallenges);

// 특정 챌린지 조회
challengeRouter.get("/:challengeId", getChallengeById);

// 챌린지 생성
challengeRouter.post("/", createChallenge);

// 챌린지 정보 수정
challengeRouter.put("/:challengeId", updateChallenge);

// 챌린지 삭제
challengeRouter.delete("/:challengeId", deleteChallenge);

// 챌린지 작업물 관련 라우터
challengeRouter.use("/:challengeId/works", workRouter);

export default challengeRouter;

import express from "express";
import {
  getChallenges,
  createChallenge,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challenge.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import workRouter from "./work.route.js";
import { adminValidator } from "../middlewares/validator.js";

const challengeRouter = express.Router();

// 챌린지 목록 조회
challengeRouter.get("/", getChallenges);

// 챌린지 생성
challengeRouter.post("/", verifyAccessToken, createChallenge);

// 챌린지 상세 조회
challengeRouter.get("/:challengeId", getChallengeById);

// 챌린지 수정
challengeRouter.put(
  "/:challengeId",
  verifyAccessToken,
  adminValidator,
  updateChallenge
);

// 챌린지 삭제
challengeRouter.delete("/:challengeId", verifyAccessToken, deleteChallenge);

// 챌린지 작업물 관련 라우터
challengeRouter.use("/:challengeId/works", workRouter);

export default challengeRouter;

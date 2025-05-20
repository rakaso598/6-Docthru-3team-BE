import express from "express";
import { createChallenge } from "../controllers/challenge.controller.js";
import auth from "../middlewares/auth.js";

const challengeRouter = express.Router();

// // 모든 챌린지 조회
// challengeRouter.get("/", getAllChallenges);

// // 특정 챌린지 조회
// challengeRouter.get("/:challengeId", getChallengeById);

// 챌린지 생성
challengeRouter.post("/", auth.verifyAccessToken, createChallenge);

// // 챌린지 정보 수정
// challengeRouter.put("/:challengeId", updateChallenge);

// // 챌린지 삭제
// challengeRouter.delete("/:challengeId", deleteChallenge);

export default challengeRouter;

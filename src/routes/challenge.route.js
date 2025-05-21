import express from "express";
import auth from "../middlewares/auth.js";
import {
   createChallenge,
  getChallenges,
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challenge.controller.js";
import workRouter from "./work.route.js";
import auth from "../middlewares/auth.js";


const challengeRouter = express.Router();

// 모든 챌린지 조회
challengeRouter.get("/", getAllChallenges);

// 특정 챌린지 조회
challengeRouter.get("/:challengeId", getChallengeById);

const challengeRouter = express.Router();

// 챌린지 생성
challengeRouter.post("/", auth.verifyAccessToken, createChallenge);

// 챌린지 정보 수정
challengeRouter.put("/:challengeId", auth.verifyAccessToken, updateChallenge);

// 챌린지 삭제
challengeRouter.delete("/:challengeId", auth.verifyAccessToken, deleteChallenge);

//챌린지 목록 조회
challengeRouter.get("/", getChallenges);

// 챌린지 작업물 관련 라우터
challengeRouter.use("/:challengeId/works", workRouter);

export default challengeRouter;

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


const challengeRouter = express.Router();

// 챌린지 생성
challengeRouter.post("/", auth.verifyAccessToken, createChallenge);

//챌린지 목록 조회
challengeRouter.get("/", getChallenges);

// 챌린지 작업물 관련 라우터
challengeRouter.use("/:challengeId/works", workRouter);

export default challengeRouter;

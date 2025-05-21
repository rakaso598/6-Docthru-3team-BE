import express from "express";
import {
  createChallenge,
  getChallenges,
} from "../controllers/challenge.controller.js";
import auth from "../middlewares/auth.js";

const challengeRouter = express.Router();

// 챌린지 생성
challengeRouter.post("/", auth.verifyAccessToken, createChallenge);

//챌린지 목록 조회
challengeRouter.get("/", getChallenges);

export default challengeRouter;

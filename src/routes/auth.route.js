import express from "express";
import { createUser, getUser } from "../controllers/auth.controller.js";
import verify from "../middlewares/verify.js";

const authRouter = express.Router();

// 회원가입
authRouter.post("/sign-up", verify.signUpReqVerify, createUser);

// 로그인
authRouter.post("/sign-in", verify.signInReqVerify, getUser);

// 구글 로그인
// authRouter.get("/:userId", getUserById);

// 토큰 갱신
// authRouter.delete("/:userId", deleteUser);

export default authRouter;

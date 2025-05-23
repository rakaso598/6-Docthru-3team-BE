import express from "express";
import {
  signUp,
  signIn,
  refreshToken,
  socialLogin,
} from "../controllers/auth.controller.js";
import { signInValidator, signUpValidator } from "../middlewares/validator.js";
import passport from "passport";

const authRouter = express.Router();

// 회원가입
authRouter.post("/sign-up", signUpValidator, signUp);

// 로그인
authRouter.post("/sign-in", signInValidator, signIn);

// 토큰 갱신
authRouter.post("/refresh-token", refreshToken);

/**
 * 클라이언트가 구글 로그인 시 호출하는 엔드포인트 (구글 로그인 페이지로 리디렉션)
 * 개발환경: http://localhost:8080/auth/google로 테스트
 * 배포환경: https://six-docthru-3team-be.onrender.com/auth/google
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent select_account", // 항상 계정 선택 및 동의 화면 표시
  })
);

// 구글 로그인 성공 후 리디렉션되는 콜백 엔드포인트 (access/refresh 토큰 발급)
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/sign-in", // 로그인 실패 시 이동할 경로
    session: false, // 세션 대신 JWT 사용
  }),
  socialLogin // 로그인 성공 후 토큰 발급 및 리디렉션 처리
);

export default authRouter;

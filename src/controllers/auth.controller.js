// controllers/auth.controller.js
import authService from "../services/auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/accessToken.utils.js";
// 이 파일은 컨트롤러이므로 아래 라우터 관련 import 및 정의는 제거합니다.
// import express from "express";
// import passport from "passport";
// import { signInValidator, signUpValidator } from "../middlewares/validator.js";

// const authRouter = express.Router(); // 이 라인 제거

// 쿠키 설정을 위한 공통 옵션 함수
const getCookieOptions = (maxAgeSeconds) => ({
  httpOnly: process.env.NODE_ENV === "production" ? true : false, // 프로덕션 환경에서만 true
  sameSite: process.env.NODE_ENV === "production" ? "lax" : "none", // 프로덕션 환경에서만 lax, 개발 환경에서는 none
  // NODE_ENV가 'production'일 때만 secure: true (HTTPS 필요)
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: maxAgeSeconds * 1000, // 밀리초 단위로 변환
  // 'domain' 옵션을 명시적으로 undefined로 설정하여 브라우저가 현재 도메인에 맞추도록 합니다.
  // 이 방식이 'localhost' 환경에서 크로스-포트 문제를 피하고 프로덕션에서도 가장 유연합니다.
  domain: undefined,
});

export const signUp = async (req, res, next) => {
  console.log("[signUp] Starting signUp process...");
  try {
    console.log("[signUp] Calling authService.createUser with body:", req.body);
    const { accessToken, refreshToken, user } = await authService.createUser(
      req.body
    );
    console.log("[signUp] User created:", user.id, "Tokens generated.");

    console.log("[signUp] Attempting to set accessToken cookie.");
    res.cookie("accessToken", accessToken, getCookieOptions(1 * 60 * 60)); // 1시간 (3600초)

    console.log("[signUp] Attempting to set refreshToken cookie.");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(14 * 24 * 60 * 60)
    ); // 14일 (1209600초)

    console.log("[signUp] Sending JSON response with user data.");
    return res.json(user);
  } catch (error) {
    console.error("[signUp] Error caught:", error.message, error.stack);
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  console.log("[signIn] Starting signIn process...");
  try {
    console.log(
      "[signIn] Calling authService.getByEmail with body:",
      req.body.email
    );
    const { accessToken, refreshToken, user } = await authService.getByEmail(
      req.body
    );
    console.log("[signIn] User retrieved:", user.id, "Tokens generated.");

    console.log("[signIn] Attempting to set accessToken cookie.");
    res.cookie("accessToken", accessToken, getCookieOptions(1 * 60 * 60)); // 1시간

    console.log("[signIn] Attempting to set refreshToken cookie.");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(14 * 24 * 60 * 60)
    ); // 14일

    console.log("[signIn] Sending JSON response with user data.");
    return res.json(user);
  } catch (error) {
    console.error("[signIn] Error caught:", error.message, error.stack);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  console.log("[refreshToken] Starting refreshToken process...");
  try {
    console.log("[refreshToken] Checking for refreshToken in cookies.");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      console.log("[refreshToken] No refreshToken found in cookies.");
      return res.status(401).json({ message: "No refresh token provided" });
    }

    console.log("[refreshToken] Calling authService.refreshedToken.");
    const newAccessToken = await authService.refreshedToken(refreshToken);
    console.log("[refreshToken] New accessToken generated.");

    res.set("etag", false); // 캐싱 방지
    res.setHeader("Cache-Control", "no-store"); // 캐싱 방지

    console.log("[refreshToken] Attempting to set new accessToken cookie.");
    res.cookie("accessToken", newAccessToken, getCookieOptions(1 * 60 * 60)); // 1시간

    console.log(
      "[refreshToken] Sending JSON response: Access token refreshed and included in body."
    );
    // Next.js 프론트엔드 fetchClient의 tokenFetch 로직과 일치시키기 위해
    // 새 accessToken을 응답 본문에 포함하여 보냅니다.
    return res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken, // <-- 이 부분이 변경되었습니다!
    });
  } catch (error) {
    console.error("[refreshToken] Error caught:", error.message, error.stack);
    next(error);
  }
};

export function socialLogin(req, res, next) {
  console.log("[socialLogin] Starting socialLogin process...");
  try {
    if (!req.user) {
      console.error(
        "[socialLogin] req.user is not defined. Passport authentication failed."
      );
      return res.redirect("/sign-in?error=auth_failed");
    }
    console.log("[socialLogin] Generating accessToken for user:", req.user.id);
    const accessToken = generateAccessToken(req.user);
    console.log("[socialLogin] Generating refreshToken for user:", req.user.id);
    const refreshToken = generateRefreshToken(req.user);

    console.log("[socialLogin] Attempting to set accessToken cookie.");
    res.cookie("accessToken", accessToken, getCookieOptions(1 * 60 * 60)); // 1시간

    console.log("[socialLogin] Attempting to set refreshToken cookie.");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(14 * 24 * 60 * 60)
    ); // 14일

    const redirectUrl = process.env.FRONTEND_URL;
    console.log(`[socialLogin] Redirecting to: ${redirectUrl}/challenges`);
    res.redirect(`${redirectUrl}/challenges`);
  } catch (error) {
    console.error("[socialLogin] Error caught:", error.message, error.stack);
    next(error);
  }
}

// 이 파일은 컨트롤러이므로 아래 라우터 정의는 제거합니다.
// authRouter.post("/sign-up", signUpValidator, signUp);
// authRouter.post("/sign-in", signInValidator, signIn);
// authRouter.post("/refresh-token", refreshToken);
// authRouter.get("/google", ...);
// authRouter.get("/google/callback", ...);
// export default authRouter; // 이 라인도 제거합니다.

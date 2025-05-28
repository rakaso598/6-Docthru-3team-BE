import authService from "../services/auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/accessToken.utils.js";

const getCookieOptions = (maxAgeSeconds) => ({
  httpOnly: true,
  sameSite: "none",
  secure: false, // 테스트 하기 설정하면 http, https 상관없이 쿠키를 통과시킴
  path: "/",
  maxAge: maxAgeSeconds * 1000,
  // 이건 기본값 쓰기
  // domain: undefined,
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
    res.cookie("accessToken", accessToken, getCookieOptions(1 * 60 * 60));

    console.log("[signUp] Attempting to set refreshToken cookie.");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(14 * 24 * 60 * 60)
    );

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
    res.cookie("accessToken", accessToken, getCookieOptions(1 * 60 * 60));

    console.log("[signIn] Attempting to set refreshToken cookie.");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(14 * 24 * 60 * 60)
    );

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

    res.set("etag", false);
    res.setHeader("Cache-Control", "no-store");

    console.log("[refreshToken] Attempting to set new accessToken cookie.");
    res.cookie("accessToken", newAccessToken, getCookieOptions(1 * 60 * 60));

    console.log(
      "[refreshToken] Sending JSON response: Access token refreshed and included in body."
    );
    return res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
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
    res.cookie("accessToken", accessToken, getCookieOptions(1 * 60 * 60));

    console.log("[socialLogin] Attempting to set refreshToken cookie.");
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(14 * 24 * 60 * 60)
    );

    const redirectUrl = process.env.FRONTEND_URL;
    console.log(`[socialLogin] Redirecting to: ${redirectUrl}/challenges`);
    res.redirect(`${redirectUrl}/challenges`);
  } catch (error) {
    console.error("[socialLogin] Error caught:", error.message, error.stack);
    next(error);
  }
}

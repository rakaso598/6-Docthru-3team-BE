import authService from "../services/auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/accessToken.utils.js";

/**
 * 시간 단위를 초(seconds) 기준으로 정의한 상수
 *
 * 사용 예시:
 * - TIME.SECOND: 1초
 * - TIME.MINUTE: 60초 (1분)
 * - TIME.HOUR: 3600초 (1시간)
 * - TIME.DAY: 86400초 (24시간)
 * - TIME.WEEK: 604800초 (7일)
 *
 * 쿠키 만료시간 설정 시:
 * - 1시간 설정: getCookieOptions(TIME.HOUR)
 * - 2주 설정: getCookieOptions(2 * TIME.WEEK)
 */
const TIME = {
  SECOND: 1,
  MINUTE: 60, // 60 * SECOND
  HOUR: 60 * 60, // 60 * MINUTE
  DAY: 24 * 60 * 60, // 24 * HOUR
  WEEK: 7 * 24 * 60 * 60, // 7 * DAY
};

const getCookieOptions = (maxAgeSeconds) => ({
  httpOnly: true,
  sameSite: "none",
  secure: false, // 테스트 하기 설정하면 http, https 상관없이 쿠키를 통과시킴
  path: "/",
  maxAge: maxAgeSeconds * 1000,
});

export const signUp = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.createUser(
      req.body
    );

    // Access Token: 15분
    res.cookie("accessToken", accessToken, getCookieOptions(15 * TIME.MINUTE));

    // Refresh Token: 2주
    res.cookie("refreshToken", refreshToken, getCookieOptions(2 * TIME.WEEK));

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.getByEmail(
      req.body
    );

    // Access Token: 15분
    res.cookie("accessToken", accessToken, getCookieOptions(15 * TIME.MINUTE));

    // Refresh Token: 2주
    res.cookie("refreshToken", refreshToken, getCookieOptions(2 * TIME.WEEK));

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const newAccessToken = await authService.refreshedToken(refreshToken);

    res.set("etag", false);
    res.setHeader("Cache-Control", "no-store");

    // Access Token: 1시간
    res.cookie(
      "accessToken",
      newAccessToken,
      getCookieOptions(15 * TIME.MINUTE)
    );

    return res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export function socialLogin(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/sign-in?error=auth_failed");
    }

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Access Token: 15분
    res.cookie("accessToken", accessToken, getCookieOptions(15 * TIME.MINUTE));

    // Refresh Token: 2주
    res.cookie("refreshToken", refreshToken, getCookieOptions(2 * TIME.WEEK));

    const redirectUrl = process.env.FRONTEND_URL;
    res.redirect(`${redirectUrl}/challenges`);
  } catch (error) {
    next(error);
  }
}

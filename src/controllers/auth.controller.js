import authService from "../services/auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/accessToken.utils.js";
import authRepository from "../repositories/auth.repository.js";
import { TOKEN_EXPIRES } from "../constants/time.constants.js";

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

    console.log("씨 이발 토큰 받아오는거 맞아?", accessToken, refreshToken);

    // Access Token: 15분
    res.cookie(
      "accessToken",
      accessToken,
      getCookieOptions(TOKEN_EXPIRES.ACCESS_TOKEN_COOKIE)
    );

    // Refresh Token: 1주
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(TOKEN_EXPIRES.REFRESH_TOKEN_COOKIE)
    );

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
    res.cookie(
      "accessToken",
      accessToken,
      getCookieOptions(TOKEN_EXPIRES.ACCESS_TOKEN_COOKIE)
    );

    // Refresh Token: 1주
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(TOKEN_EXPIRES.REFRESH_TOKEN_COOKIE)
    );

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

    const tokens = await authService.refreshedToken(refreshToken);

    res.set("etag", false);
    res.setHeader("Cache-Control", "no-store");

    // Access Token: 15분
    res.cookie(
      "accessToken",
      tokens.accessToken,
      getCookieOptions(TOKEN_EXPIRES.ACCESS_TOKEN_COOKIE)
    );

    // 새로운 리프레시 토큰이 발급된 경우에만 쿠키 업데이트
    if (tokens.refreshToken) {
      res.cookie(
        "refreshToken",
        tokens.refreshToken,
        getCookieOptions(TOKEN_EXPIRES.REFRESH_TOKEN_COOKIE)
      );
    }

    return res.status(200).json({
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.log(error);
    if (
      error.message.includes("Invalid") ||
      error.message.includes("expired")
    ) {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export async function socialLogin(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect("/sign-in?error=auth_failed");
    }

    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // 리프레시 토큰을 데이터베이스에 저장
    await authRepository.updateRefreshToken(req.user.id, refreshToken);

    // Access Token: 15분
    res.cookie(
      "accessToken",
      accessToken,
      getCookieOptions(TOKEN_EXPIRES.ACCESS_TOKEN_COOKIE)
    );

    // Refresh Token: 1주
    res.cookie(
      "refreshToken",
      refreshToken,
      getCookieOptions(TOKEN_EXPIRES.REFRESH_TOKEN_COOKIE)
    );

    const redirectUrl = process.env.FRONTEND_URL;
    res.redirect(`${redirectUrl}/challenges`);
  } catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {
  try {
    // verifyAccessToken 미들웨어를 통과했다면 req.user는 { userId, email, nickname }
    const userId = req.user.userId;

    // 데이터베이스에서 리프레시 토큰 삭제
    await authRepository.updateRefreshToken(userId, null);

    // 쿠키 삭제 - 설정 시와 동일한 옵션 사용
    const cookieOptions = {
      ...getCookieOptions(0),
      maxAge: 0, // 즉시 만료
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Successfully signed out",
    });
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};

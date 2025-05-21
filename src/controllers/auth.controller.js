import authService from "../services/auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/accessToken.utils.js";

export const createUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.create(
      req.body
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, //http 사용중
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000, //1시간
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //http 사용중
      sameSite: "None",
      maxAge: 14 * 24 * 60 * 60 * 1000, //2주
      path: "/",
    });

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.getByEmail(
      req.body
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, //http 사용중
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000, //1시간
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //http 사용중
      sameSite: "None",
      maxAge: 14 * 24 * 60 * 60 * 1000, //2주
      path: "/",
    });

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    //디버깅
    console.log("리프레쉬 토큰 유무 확인");

    const newAccessToken = await authService.refreshedToken(refreshToken);

    res.set("etag", false);
    res.setHeader("Cache-Control", "no-store");

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, //http 사용중
      sameSite: "None",
      maxAge: 1 * 60 * 60 * 1000, //1시간
      path: "/",
    });

    //디버깅
    console.log("응답에 쿠키 포함");
    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 소셜 로그인
 */
export function socialLogin(req, res, next) {
  try {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user, "refresh");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/auth/refresh-token",
    });
    const redirectUrl = process.env.FRONTEND_URL;
    res.redirect(`${redirectUrl}/oauth-success`);
  } catch (error) {
    next(error);
  }
}

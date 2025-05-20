import { generateAccessToken } from "../middlewares/accessToken.utils.js";
import authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

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

    if (!refreshToken)
      return res.status(401).json({ message: "There's no refreshToken" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      (err, decodedPayload) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Invalid or Expired refresh token" });

        const accessToken = generateAccessToken(decodedPayload);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false, //http 사용중
          sameSite: "None",
          maxAge: 1 * 60 * 60 * 1000, //1시간
          path: "/",
        });
      }
    );

    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    next(error);
  }
};

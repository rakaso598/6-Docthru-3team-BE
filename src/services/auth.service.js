import authRepository from "../repositories/auth.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/accessToken.utils.js";
import jwt from "jsonwebtoken";
import {
  filterSensitiveUserData,
  hashPassword,
  verifyPassword,
} from "../utils/auth.utils.js";
import { BadRequestError, NotFoundError } from "../exceptions/exceptions.js";
import { ExceptionMessage } from "../exceptions/ExceptionMessage.js";

async function createUser(user) {
  const existingEmail = await authRepository.findUserByEmail(user.email);
  if (existingEmail) {
    throw new BadRequestError(ExceptionMessage.ALREADY_EXISTED_EMAIL);
  }
  const existingNickname = await authRepository.findUserByNickname(
    user.nickname
  );
  if (existingNickname) {
    throw new BadRequestError(ExceptionMessage.ALREADY_EXISTED_NICKNAME);
  }

  const hashedPassword = await hashPassword(user.password);
  const createdUser = await authRepository.saveUser(user, hashedPassword);

  const accessToken = generateAccessToken(createdUser);
  const refreshToken = generateRefreshToken(createdUser);

  return {
    accessToken,
    refreshToken,
    user: {
      id: createdUser.id,
      email: createdUser.email,
      nickname: createdUser.nickname,
    },
  };
}

async function getByEmail(user) {
  //비밀번호는 문자열만 가능(bcrypt 문법)
  if (typeof user.password !== "string") {
    throw new Error(`password must be a string.`);
  }

  const existedUser = await authRepository.findUserByEmail(user.email);

  if (!existedUser) throw new NotFoundError(ExceptionMessage.USER_NOT_FOUND);

  //사용자가 입력한 PW와 데이터상의 PW가 일치하는지 확인
  let isMatched = await verifyPassword(
    user.password,
    existedUser.hashedPassword
  );

  // 관리자인 경우 plain text로 비밀번호 비교
  if (!isMatched && existedUser.role === "ADMIN") {
    isMatched = user.password === existedUser.hashedPassword;
  }

  if (!isMatched)
    throw new BadRequestError(ExceptionMessage.PASSWORD_NOT_MATCH);

  const accessToken = generateAccessToken(existedUser);
  const refreshToken = generateRefreshToken(existedUser);

  return {
    accessToken,
    refreshToken,
    user: {
      id: existedUser.id,
      email: existedUser.email,
      nickname: existedUser.nickname,
    },
  };
}

async function refreshedToken(refreshToken) {
  try {
    //디버깅
    console.log("refreshToken", refreshToken);

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    //디버깅
    console.log("payload", payload);

    const userId = payload.userId;

    const user = await authRepository.findUserById(userId);

    //디버깅
    console.log("유저 유무 확인");

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    if (!newAccessToken) {
      throw new Error("Failed to generate access token");
    }

    //디버깅
    console.log("액세스토큰 리프레쉬 완료");

    return newAccessToken;
  } catch (error) {
    throw new Error("Faild to refresh access-token");
  }
}

/**
 * 구글 로그인
 */
async function oauthUser(provider, providerId, email, name) {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    const updatedUser = await authRepository.updateUser(existingUser.id, {
      nickname: name,
      provider,
      providerId,
    });
    return filterSensitiveUserData(updatedUser);
  } else {
    const createdUser = await authRepository.saveUser({
      email,
      nickname: name,
      provider,
      providerId,
    });
    return filterSensitiveUserData(createdUser);
  }
}

export default {
  createUser,
  getByEmail,
  refreshedToken,
  oauthUser,
};

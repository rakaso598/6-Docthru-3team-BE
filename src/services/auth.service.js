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
import { TIME, TOKEN_EXPIRES } from "../constants/time.constants.js";

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

  // 리프레시 토큰을 데이터베이스에 저장
  await authRepository.updateRefreshToken(createdUser.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: createdUser.id,
      email: createdUser.email,
      nickname: createdUser.nickname,
      role: createdUser.role,
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

  // 리프레시 토큰을 데이터베이스에 저장
  await authRepository.updateRefreshToken(existedUser.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: filterSensitiveUserData(existedUser),
  };
}

async function refreshedToken(refreshToken) {
  try {
    // 데이터베이스에서 리프레시 토큰으로 사용자 찾기
    const userWithToken = await authRepository.findUserByRefreshToken(
      refreshToken
    );

    if (!userWithToken) {
      throw new Error("Invalid refresh token");
    }

    // 토큰 검증
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    if (payload.userId !== userWithToken.id) {
      throw new Error("Token mismatch");
    }

    // 새로운 액세스 토큰 생성
    const newAccessToken = jwt.sign(
      {
        userId: userWithToken.id,
        email: userWithToken.email,
        nickname: userWithToken.nickname,
        role: userWithToken.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRES.ACCESS_TOKEN }
    );

    // 리프레시 토큰 만료 시간이 1주일 이하로 남았다면 새로운 리프레시 토큰 발급
    // TODO : 현재는 테스트로 발급도 1주일로 설정해 무조건 재발급 되게함
    const tokenExp = new Date(payload.exp * 1000);
    const now = new Date();
    const remainingTime = tokenExp.getTime() - now.getTime();
    const oneWeekInMs = TIME.WEEK * 1000;

    if (remainingTime <= oneWeekInMs) {
      const newRefreshToken = generateRefreshToken(userWithToken);

      // DB 업데이트 로그
      console.log("리프레시 토큰 DB 업데이트 시작", {
        userId: userWithToken.id,
        tokenExp: new Date(jwt.decode(newRefreshToken).exp * 1000),
      });

      await authRepository.updateRefreshToken(
        userWithToken.id,
        newRefreshToken
      );

      console.log("리프레시 토큰 DB 업데이트 완료");

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new Error("Invalid or expired refresh token");
    }
    throw error;
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

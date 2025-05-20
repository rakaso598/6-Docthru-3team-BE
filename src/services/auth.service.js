import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/accessToken.utils.js";
import jwt from "jsonwebtoken";

async function create(user) {
  //비밀번호는 문자열만 가능(bcrypt 문법)
  ["password", "passwordConfirmation"].forEach((field) => {
    if (typeof user[field] !== "string") {
      throw new Error(`${field} must be a string.`);
    }
  });

  //password와 passwordConfirmation의 일치 여부 확인
  if (user.password !== user.passwordConfirmation) {
    throw new Error("Password and password confirmation do not match.");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const createdUser = await authRepository.save(user, hashedPassword);

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

  const existedUser = await authRepository.getByEmail(user.email);

  if (!existedUser) throw new Error("Please sign-up first");

  //사용자가 입력한 PW와 데이터상의 PW가 일치하는지 확인
  const isMatched = await bcrypt.compare(
    user.password,
    existedUser.hashedPassword
  );

  if (!isMatched) throw new Error("Wrong password");

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

export default {
  create,
  getByEmail,
  refreshedToken,
};

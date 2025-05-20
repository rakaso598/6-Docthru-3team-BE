import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/accessToken.utils.js";

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

export default {
  create,
  getByEmail,
};

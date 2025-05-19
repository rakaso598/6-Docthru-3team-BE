import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../middlewares/accessToken.utils.js";

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

  return {
    accessToken,
    user: {
      id: createdUser.id,
      email: createdUser.email,
      nickname: createdUser.nickname,
    },
  };
}

export default {
  create,
};

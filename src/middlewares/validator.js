import { ExceptionMessage } from "../exceptions/ExceptionMessage.js";
import { BadRequestError, ForbiddenError } from "../exceptions/exceptions.js";
import authRepository from "../repositories/auth.repository.js";
import { verifyEmail } from "../utils/auth.utils.js";

// 회원가입 유효성 검증 함수
export async function signUpValidator(req, res, next) {
  try {
    const { email, nickname, password, passwordConfirmation } = req.body;

    if (!email || !nickname || !password || !passwordConfirmation) {
      throw new BadRequestError(ExceptionMessage.INVALID_INPUT);
    }

    // 이메일 형식 유효성 검사
    const isValidEmail = verifyEmail(email);
    if (!isValidEmail) {
      throw new BadRequestError(ExceptionMessage.INVALID_EMAIL);
    }

    // 비밀번호는 문자열만 가능(bcrypt 문법)
    if (
      typeof password !== "string" ||
      typeof passwordConfirmation !== "string"
    ) {
      throw new BadRequestError(
        "Password and password confirmation must be strings."
      );
    }

    // password와 passwordConfirmation의 일치 여부 확인
    if (password !== passwordConfirmation) {
      throw new BadRequestError(
        ExceptionMessage.PASSWORD_CONFIRMATION_NOT_MATCH
      );
    }
    next();
  } catch (e) {
    next(e);
  }
}

// 로그인 유효성 검증 함수
export async function signInValidator(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError(ExceptionMessage.INVALID_INPUT);
    }
    next();
  } catch (e) {
    next(e);
  }
}

// 관리자 검증 함수
export async function adminValidator(req, res, next) {
  try {
    const { userId } = req.user;
    const user = await authRepository.findUserById(userId);
    if (user?.role !== "ADMIN") {
      throw new ForbiddenError(ExceptionMessage.FORBIDDEN);
    }
    next();
  } catch (e) {
    next(e);
  }
}

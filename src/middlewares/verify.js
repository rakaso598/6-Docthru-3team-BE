import { ExceptionMessage } from "../exceptions/ExceptionMessage.js";
import { ForbiddenError } from "../exceptions/exceptions.js";
import authRepository from "../repositories/auth.repository.js";

//throw 400 error
function throwBadRequestError() {
  const error = new Error("Bad Request, 필수 정보가 누락되었습니다.");
  error.code = 400;
  throw error;
}

//회원가입 request 유효성 확인
async function signUpReqVerify(req, res, next) {
  const { email, nickname, password, passwordConfirmation } = req.body;

  if (!email || !nickname || !password || !passwordConfirmation) {
    throwBadRequestError();
  }

  next();
}

//로그인 request 유효성 확인
async function signInReqVerify(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    throwBadRequestError();
  }

  next();
}

// 관리자 인증 함수
export async function verifyAdmin(req, res, next) {
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

export default {
  throwBadRequestError,
  signUpReqVerify,
  signInReqVerify,
};

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

export default {
  signUpReqVerify,
  signInReqVerify,
};

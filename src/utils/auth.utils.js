import bcrypt from "bcrypt";

/**
 * 민감한 정보 필터링 함수
 */
function filterSensitiveUserData(user) {
  const { hashedPassword, refreshToken, ...rest } = user;
  return rest;
}

/**
 * 비밀번호 해싱 함수
 */
function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * 입력된 비밀번호가 해시된 비밀번호와 일치하는지 확인
 * (로그인 시 사용)
 */
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

/**
 * 이메일 검증 함수
 */
function verifyEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export { filterSensitiveUserData, hashPassword, verifyPassword, verifyEmail };

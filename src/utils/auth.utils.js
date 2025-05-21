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
 * 비밀번호 검증 함수
 */
async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export { filterSensitiveUserData, hashPassword, verifyPassword };

import { expressjwt } from "express-jwt";

//인증된 사용자인지 검증
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"],
});

export default {
  verifyAccessToken,
};

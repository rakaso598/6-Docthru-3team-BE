import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  };

  const accessSecret = `${process.env.JWT_SECRET_KEY}`;

  if (!accessSecret) {
    console.error("There's no Secret Key in .env");
    throw new Error("check Secret Key");
  }

  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1h" });

  return accessToken;
}

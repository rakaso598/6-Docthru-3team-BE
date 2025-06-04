import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Access token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // { userId, email, nickname, role }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Access token이 유효하지 않습니다." });
  }
};

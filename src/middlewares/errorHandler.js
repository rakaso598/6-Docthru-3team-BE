import { HttpError, UnauthorizedError } from "../exceptions/exceptions.js";

export default function errorHandler(err, req, res, next) {
  const httpError = toHttpError(err);
  res.status(httpError.status).json({
    message: httpError.message,
  });
}

// 예외를 HttpError 형태로 변환
function toHttpError(error) {
  if (error instanceof HttpError) return error;
  if (error.name === "UnauthorizedError") {
    return new UnauthorizedError(error.message);
  }
  return new HttpError({
    status: 500,
    message: error.message || "Internal server error",
  });
}

export class HttpError extends Error {
  constructor({ status = 500, message, details }) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", details) {
    super({ status: 400, message, details });
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details) {
    super({ status: 401, message, details });
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details) {
    super({ status: 403, message, details });
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not found", details) {
    super({ status: 404, message, details });
  }
}

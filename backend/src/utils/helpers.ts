export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 404, details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 403, details);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(message, 500, details);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 409, details);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Service Unavailable', details?: any) {
    super(message, 503, details);
  }
}
// middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/helpers';
import logger from '../utils/logger';

const errorMiddleware = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    stack: err.stack,
  });

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  // Generic error response
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export default errorMiddleware;
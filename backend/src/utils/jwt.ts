// @ts-nocheck
import jwt from "jsonwebtoken";
import { UnauthorizedError, BadRequestError, InternalServerError } from "./helpers";
import logger from "./logger";

interface TokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface VerifyTokenResult {
  id: string;
  role: string;
}

/**
 * Generates a JWT token
 * @param payload - Object containing userId and role
 * @returns Generated JWT token
 * @throws {InternalServerError} If JWT secret is not configured
 */
export const generateToken = (payload: { userId: string; role: string }): string => {
  const { userId, role } = payload;

  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET is not configured');
    throw new InternalServerError('Server configuration error');
  }

  if (!process.env.JWT_EXPIRES_IN) {
    logger.error('JWT_EXPIRES_IN is not configured');
    throw new InternalServerError('Server configuration error');
  }

  try {
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  } catch (error) {
    logger.error('Failed to generate token', { error });
    throw new InternalServerError('Failed to generate authentication token');
  }
};

/**
 * Verifies a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 * @throws {UnauthorizedError} If token is invalid or expired
 * @throws {BadRequestError} If token is malformed
 * @throws {InternalServerError} For unexpected errors
 */
export const verifyToken = (token: string): VerifyTokenResult => {
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET is not configured');
    throw new InternalServerError('Server configuration error');
  }

  if (!token) {
    throw new BadRequestError('Authentication token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
    
    if (!decoded.id || !decoded.role) {
      throw new UnauthorizedError('Invalid token payload');
    }

    return {
      id: decoded.id,
      role: decoded.role
    };
  } catch (error) {
    logger.error('Token verification failed', { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      // Handle specific JWT errors
      if (error.message.includes('jwt malformed')) {
        throw new BadRequestError('Malformed token');
      }
      if (error.message.includes('invalid signature')) {
        throw new UnauthorizedError('Invalid token signature');
      }
      throw new UnauthorizedError('Invalid token');
    }

    // For any other unexpected errors
    throw new InternalServerError('Failed to verify token');
  }
};

/**
 * Decodes a JWT token without verification (for inspection only)
 * @param token - JWT token to decode
 * @returns Decoded token payload or null if malformed
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    logger.error('Token decoding failed', { error });
    return null;
  }
};


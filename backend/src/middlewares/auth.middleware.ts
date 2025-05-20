// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/helpers';
import { Role } from '@prisma/client';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token required');
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = verifyToken(token);
    
    // Set user information on request object
    req.user = {
      id: decoded.id,
      role: decoded.role as Role,
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Not authorized to access this resource'));
    }
    
    next();
  };
};

export default {
  authenticate,
  authorize,
};
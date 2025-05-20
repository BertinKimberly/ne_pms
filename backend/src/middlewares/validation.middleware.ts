import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestError } from '../utils/helpers';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Create DTO instance from request body
      const dtoObject = plainToClass(dtoClass, req.body);
      
      // Validate the object
      const errors = await validate(dtoObject);
      
      if (errors.length > 0) {
        // Format validation errors
        const errorMessages = errors
          .map((error: ValidationError) => {
            const constraints = error.constraints || {};
            return Object.values(constraints).join(', ');
          })
          .join('; ');
        
        next(new BadRequestError(`Validation error: ${errorMessages}`));
      } else {
        // Attach validated object to request
        req.body = dtoObject;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};
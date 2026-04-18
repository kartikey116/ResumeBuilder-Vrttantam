import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate the body against the schema
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Collect all validation errors into a single string
        const errorMessages = error.errors.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
        return next(new AppError(`Validation Error: ${errorMessages}`, 400));
      }
      next(error);
    }
  };
};

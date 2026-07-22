import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodRawShape, ZodError } from 'zod';

/**
 * Middleware to validate request data against a Zod schema.
 * If validation fails, it returns a 400 with a flattened error object.
 */
export const validateRequest = (schema: ZodObject<ZodRawShape>) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error: any) {
            // Check if it is a Zod validation error
            if (error instanceof ZodError) {
                // flatten() turns the complex Zod structure into a clean object
                // e.g., { fieldErrors: { email: ["Invalid email"] } }
                const formattedErrors = error.flatten().fieldErrors;
                
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Validation failed',
                    errors: formattedErrors 
                });
            }
            
            // Pass internal/server errors to the global error handler
            next(error);
        }
    };
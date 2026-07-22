import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../error/customErrors';

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log the error to the terminal for debugging
    console.error('--- Server Error ---');
    console.error(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Default 500 error for unhandled exceptions
    res.status(500).json({
        status: 'error',
        message: 'An unexpected server error occurred.'
    });
};
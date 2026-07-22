import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../config/jwt.config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        // Attach user info to request
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};

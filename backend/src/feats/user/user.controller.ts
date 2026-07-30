import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { verifyToken } from '../../config/jwt.config';
import { sanitizeUserProfile } from './user.sanitizer';

// Helper to extract user ID from auth token
const getUserIdFromToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        return decoded?.id || null;
    } catch {
        return null;
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id || getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const profile = await userService.getProfile(userId);
        
        res.status(200).json({
            status: 'success',
            success: true,
            data: profile // might be null if they haven't created it yet
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id || getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const sanitized = sanitizeUserProfile(req.body);

        const updatedProfile = await userService.upsertProfile({
            userId,
            name: sanitized.name,
            studentId: sanitized.student_id,
            batchSession: sanitized.batch_session,
            phoneNumber: sanitized.phone_number
        });

        res.status(200).json({
            status: 'success',
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        next(error);
    }
};

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sanitizeAuthInput } from './auth.sanitizer';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Sanitize the inputs before sending to service
        const sanitizedData = sanitizeAuthInput(req.body);
        
        const user = await authService.registerUser(sanitizedData);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'User registered successfully', 
            data: user 
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Sanitize inputs
        const { email, password } = sanitizeAuthInput(req.body);
        
        // Validate presence after sanitization
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required' });
        }
        
        const authData = await authService.loginUser(email, password);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Logged in successfully',
            token: authData.token,
            data: authData.user 
        });
    } catch (error) {
        next(error);
    }
};

import { verifyToken } from '../../config/jwt.config';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        const userId = decoded?.id;
        const role = decoded?.role;

        if (!userId || !role) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const profile = await authService.getMe(userId, role);

        res.status(200).json({
            status: 'success',
            data: profile
        });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error);
    }
};
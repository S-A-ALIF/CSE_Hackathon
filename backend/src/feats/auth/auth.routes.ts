import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register', 
    validateRequest(registerSchema), 
    authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post(
    '/login', 
    validateRequest(loginSchema), 
    authController.login
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
    '/me',
    authController.getMe
);

export default router;
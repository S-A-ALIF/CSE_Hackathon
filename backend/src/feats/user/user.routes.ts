import { Router } from 'express';
import * as userController from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { userProfileSchema } from './user.validator';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get the current user's profile info
 * @access  Private
 */
router.get(
    '/profile',
    userController.getProfile
);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update or create the current user's profile info
 * @access  Private
 */
router.put(
    '/profile',
    validateRequest(userProfileSchema),
    userController.updateProfile
);

/**
 * @route   GET /api/v1/users/search
 * @desc    Search users by name, email, or student ID
 * @access  Private
 */
router.get(
    '/search',
    userController.searchUsers
);

export default router;

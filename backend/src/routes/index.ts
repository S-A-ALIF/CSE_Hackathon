import { Router } from 'express';
import authRoutes from '../feats/auth/auth.routes';
import userRoutes from '../feats/user/user.routes';
import notificationRoutes from '../feats/notification/notification.routes';
import teamRoutes from '../feats/team/team.routes';

const router = Router();

/**
 * API Route Definition
 * Routes are grouped by their respective feature modules
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/teams', teamRoutes);

export default router;
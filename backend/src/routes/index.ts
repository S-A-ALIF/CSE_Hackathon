import { Router } from 'express';
import authRoutes from '../feats/auth/auth.routes';
import userRoutes from '../feats/user/user.routes';

const router = Router();

/**
 * API Route Definition
 * Routes are grouped by their respective feature modules
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
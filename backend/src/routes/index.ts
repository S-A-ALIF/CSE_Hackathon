import { Router } from 'express';
import authRoutes from '../feats/auth/auth.routes';

const router = Router();

/**
 * API Route Definition
 * Routes are grouped by their respective feature modules
 */
router.use('/auth', authRoutes);

export default router;
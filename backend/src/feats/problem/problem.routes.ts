import { Router } from 'express';
import { getAllProblems, createProblem, updateProblem, deleteProblem } from './problem.controller';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';

const router = Router();

// Publicly accessible to fetch problems (or you could lock it behind authMiddleware if preferred, but since they are public to registered users, authMiddleware is good)
router.get('/', authMiddleware, getAllProblems);

// Admin-only routes for managing problems
router.post('/admin', authMiddleware, adminMiddleware, createProblem);
router.put('/admin/:id', authMiddleware, adminMiddleware, updateProblem);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteProblem);

export default router;

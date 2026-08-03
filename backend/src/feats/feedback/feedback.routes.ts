import { Router } from 'express';
import { submitFeedback, getAllFeedback, resolveFeedback } from './feedback.controller';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { feedbackSchemas } from './feedback.validator';

const router = Router();

// User facing route to submit feedback
router.post('/', authMiddleware, validateRequest(feedbackSchemas.createFeedback), submitFeedback);

// Admin facing routes to manage feedback
router.get('/admin', authMiddleware, adminMiddleware, getAllFeedback);
router.patch('/admin/:id/resolve', authMiddleware, adminMiddleware, resolveFeedback);

export default router;

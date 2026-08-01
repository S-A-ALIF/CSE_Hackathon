import { Router } from 'express';
import { getAllRules, createRule, updateRule, deleteRule } from './rules.controller';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';

const router = Router();

// Publicly accessible to fetch rules
router.get('/', getAllRules);

// Admin-only routes for managing rules & regulations
router.post('/admin', authMiddleware, adminMiddleware, createRule);
router.put('/admin/:id', authMiddleware, adminMiddleware, updateRule);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteRule);

export default router;

import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import {
    getStats,
    getAllTeams,
    updateTeam,
    deleteTeam,
    getAllMembers,
    updateMember,
    deleteMember,
    getSettings,
    toggleRegistration
} from './admin.controller';

const router = Router();

// Enforce authentication and admin privileges on all admin routes
router.use(authMiddleware, adminMiddleware);

// Dashboard Statistics
router.get('/stats', getStats);

// Teams Management
router.get('/teams', getAllTeams);
router.patch('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

// Members Management
router.get('/members', getAllMembers);
router.patch('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);

// Platform Settings
router.get('/settings', getSettings);
router.post('/settings/toggle-registration', toggleRegistration);

export default router;

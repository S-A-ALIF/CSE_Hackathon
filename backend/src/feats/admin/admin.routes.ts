import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../auth/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { adminSchemas } from './admin.validator';
import {
    getStats,
    getAllTeams,
    updateTeam,
    deleteTeam,
    getAllMembers,
    updateMember,
    deleteMember,
    getSettings,
    toggleRegistration,
    toggleWorkspace,
    toggleProblems,
    updateTeamLimits,
    updateRegistrationTimeline
} from './admin.controller';

const router = Router();

// Enforce authentication and admin privileges on all admin routes
router.use(authMiddleware, adminMiddleware);

// Dashboard Statistics
router.get('/stats', getStats);

// Teams Management
router.get('/teams', getAllTeams);
router.patch('/teams/:id', validateRequest(adminSchemas.updateTeam), updateTeam);
router.delete('/teams/:id', deleteTeam);

// Members Management
router.get('/members', getAllMembers);
router.patch('/members/:id', validateRequest(adminSchemas.updateMember), updateMember);
router.delete('/members/:id', deleteMember);

// Platform Settings
router.get('/settings', getSettings);
router.post('/settings/toggle-registration', toggleRegistration);
router.post('/settings/toggle-workspace', toggleWorkspace);
router.post('/settings/toggle-problems', toggleProblems);
router.post('/settings/team-limits', validateRequest(adminSchemas.teamLimits), updateTeamLimits);
router.post('/settings/registration-timeline', updateRegistrationTimeline);

export default router;

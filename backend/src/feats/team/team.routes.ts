import { Router } from 'express';
import { createTeam, inviteToTeam, joinTeam, requestToJoinByCode, getMyTeam, removeMember, leaveTeam, disbandTeam, updateTeamName, transferLeadership, updateTeamStatus } from './team.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

// Apply auth middleware to all team routes
router.use(authMiddleware);

router.get('/my-team', getMyTeam);
router.post('/create', createTeam);
router.post('/invite', inviteToTeam);
router.post('/join', joinTeam);
router.post('/join-by-code', requestToJoinByCode);
router.patch('/name', updateTeamName);
router.patch('/status', updateTeamStatus);
router.post('/transfer-leadership', transferLeadership);
router.delete('/members/:userId', removeMember);
router.post('/leave', leaveTeam);
router.delete('/', disbandTeam);

export default router;

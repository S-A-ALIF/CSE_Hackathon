import { Router } from 'express';
import { inviteToTeam, joinTeam, getMyTeam, removeMember, leaveTeam, disbandTeam } from './team.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

// Apply auth middleware to all team routes
router.use(authMiddleware);

router.get('/my-team', getMyTeam);
router.post('/invite', inviteToTeam);
router.post('/join', joinTeam);
router.delete('/members/:userId', removeMember);
router.post('/leave', leaveTeam);
router.delete('/', disbandTeam);

export default router;

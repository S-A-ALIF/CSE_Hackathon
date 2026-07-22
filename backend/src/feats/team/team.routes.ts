import { Router } from 'express';
import { inviteToTeam, joinTeam, getMyTeam } from './team.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

// Apply auth middleware to all team routes
router.use(authMiddleware);

router.get('/my-team', getMyTeam);
router.post('/invite', inviteToTeam);
router.post('/join', joinTeam);

export default router;

import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { getMentorsList, inviteMentor, getInvitations, respondToInvitation, getMentoredTeams, resignMentorship } from './mentor.controller';

const router = Router();

// All mentor endpoints require authentication
router.use(authMiddleware);

// Open to all authenticated users (leaders need this to invite)
router.get('/list', getMentorsList);
router.post('/invite', inviteMentor);

// Open only to mentors (enforced in controller)
router.get('/invitations', getInvitations);
router.post('/invitations/:id/respond', respondToInvitation);
router.get('/teams', getMentoredTeams);
router.delete('/teams/:id/resign', resignMentorship);

export default router;

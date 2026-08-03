import { Router } from 'express';
import { createTeam, inviteToTeam, joinTeam, requestToJoinByCode, getMyTeam, removeMember, leaveTeam, disbandTeam, updateTeamName, transferLeadership, updateTeamStatus, getActiveInvitations, cancelInvitation, updateSubmissionLinks, submitProject, checkRepoReadme } from './team.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { teamSchemas } from './team.validator';

const router = Router();

// Apply auth middleware to all team routes
router.use(authMiddleware);

router.get('/my-team', getMyTeam);
router.get('/check-readme', checkRepoReadme);
router.get('/invitations', getActiveInvitations);
router.delete('/invitations/:id', validateRequest(teamSchemas.paramId), cancelInvitation);
router.post('/create', validateRequest(teamSchemas.create), createTeam);
router.post('/invite', validateRequest(teamSchemas.invite), inviteToTeam);
router.post('/join', validateRequest(teamSchemas.joinWithPin), joinTeam);
router.post('/join-by-code', validateRequest(teamSchemas.requestJoinByCode), requestToJoinByCode);
router.patch('/name', validateRequest(teamSchemas.updateName), updateTeamName);
router.patch('/status', validateRequest(teamSchemas.updateStatus), updateTeamStatus);
router.patch('/repo', updateSubmissionLinks);
router.post('/submit', submitProject);
router.post('/transfer-leadership', validateRequest(teamSchemas.transferLeadership), transferLeadership);
router.delete('/members/:userId', removeMember);
router.post('/leave', leaveTeam);
router.delete('/', disbandTeam);

export default router;

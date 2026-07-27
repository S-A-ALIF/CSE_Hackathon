import { Router } from 'express';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteMyNotification, rejectInvitationNotification, acceptInvitationNotification } from './notification.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllNotificationsAsRead);
router.patch('/:id/read', markNotificationAsRead);
router.post('/:id/reject-invite', rejectInvitationNotification);
router.post('/:id/accept-invite', acceptInvitationNotification);
router.delete('/:id', deleteMyNotification);

export default router;

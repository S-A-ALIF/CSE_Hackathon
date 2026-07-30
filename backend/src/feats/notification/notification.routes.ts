import { Router } from 'express';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteMyNotification, rejectInvitationNotification, acceptInvitationNotification } from './notification.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { notificationSchemas } from './notification.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllNotificationsAsRead);
router.patch('/:id/read', validateRequest(notificationSchemas.paramId), markNotificationAsRead);
router.post('/:id/reject-invite', validateRequest(notificationSchemas.paramId), rejectInvitationNotification);
router.post('/:id/accept-invite', validateRequest(notificationSchemas.paramId), acceptInvitationNotification);
router.delete('/:id', validateRequest(notificationSchemas.paramId), deleteMyNotification);

export default router;

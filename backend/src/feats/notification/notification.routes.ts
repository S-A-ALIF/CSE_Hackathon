import { Router } from 'express';
import { getMyNotifications, markNotificationAsRead } from './notification.controller';

const router = Router();

router.get('/', getMyNotifications);
router.patch('/:id/read', markNotificationAsRead);

export default router;

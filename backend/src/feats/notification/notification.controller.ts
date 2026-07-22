import { Request, Response } from 'express';
import { notificationService } from './notification.service';

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.query;

        if (!email || typeof email !== 'string') {
            res.status(400).json({ success: false, message: 'Email query parameter is required' });
            return;
        }

        const notifications = await notificationService.getNotificationsByEmail(email);
        res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
        console.error('[NotificationController] Error in getMyNotifications:', error);
        res.status(500).json({ success: false, message: 'Internal server error fetching notifications' });
    }
};

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ success: false, message: 'Notification ID is required' });
            return;
        }

        await notificationService.markAsRead(id);
        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error: any) {
        console.error('[NotificationController] Error in markNotificationAsRead:', error);
        res.status(500).json({ success: false, message: 'Internal server error marking notification as read' });
    }
};

import { pool } from '../../config/db.config';

export const notificationService = {
    /**
     * Get all notifications for a specific email
     */
    async getNotificationsByEmail(email: string) {
        try {
            const result = await pool.query(
                'SELECT * FROM notifications WHERE recipient_email = $1 ORDER BY created_at DESC',
                [email]
            );
            return result.rows;
        } catch (error) {
            console.error('[NotificationService] Error getting notifications:', error);
            throw error;
        }
    },

    /**
     * Mark a specific notification as read
     */
    async markAsRead(id: string) {
        try {
            const result = await pool.query(
                'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('[NotificationService] Error marking notification as read:', error);
            throw error;
        }
    },

    /**
     * Create a new notification
     */
    async createNotification(email: string, message: string) {
        try {
            const result = await pool.query(
                'INSERT INTO notifications (recipient_email, message) VALUES ($1, $2) RETURNING *',
                [email, message]
            );
            return result.rows[0];
        } catch (error) {
            console.error('[NotificationService] Error creating notification:', error);
            throw error;
        }
    }
};

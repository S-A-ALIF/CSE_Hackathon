import { pool } from '../../config/db.config';

export const notificationService = {
    /**
     * Get all notifications for a specific email
     */
    async getNotificationsByEmail(email: string) {
        try {
            await pool.query(
                `UPDATE notifications
                 SET action_status = 'expired'
                 WHERE LOWER(recipient_email) = LOWER($1)
                   AND message LIKE '%You received a team invitation%'
                   AND (action_status IS NULL OR action_status = 'pending')
                   AND (
                       created_at < NOW() - INTERVAL '48 hours'
                       OR NOT EXISTS (
                           SELECT 1 FROM team_invitations 
                           WHERE LOWER(email) = LOWER($1) AND is_used = false AND expires_at > NOW()
                       )
                   )`,
                [email]
            );

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
    },

    /**
     * Mark all notifications as read for an email
     */
    async markAllAsRead(email: string) {
        try {
            const result = await pool.query(
                'UPDATE notifications SET is_read = true WHERE recipient_email = $1 RETURNING *',
                [email]
            );
            return result.rows;
        } catch (error) {
            console.error('[NotificationService] Error marking all notifications as read:', error);
            throw error;
        }
    },

    /**
     * Delete a specific notification by ID
     */
    async deleteNotification(id: string) {
        try {
            const result = await pool.query(
                'DELETE FROM notifications WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('[NotificationService] Error deleting notification:', error);
            throw error;
        }
    },

    /**
     * Reject a team invitation notification and invalidate the invitation
     */
    async rejectTeamInvitation(id: string, userEmail: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // 1. Invalidate any pending invitation in team_invitations for this email
            await client.query(
                'UPDATE team_invitations SET is_used = true WHERE email = $1 AND is_used = false',
                [userEmail]
            );
            // 2. Mark the notification as rejected and read
            const result = await client.query(
                "UPDATE notifications SET action_status = 'rejected', is_read = true WHERE id = $1 RETURNING *",
                [id]
            );
            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[NotificationService] Error rejecting invitation:', error);
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Accept a team invitation notification
     */
    async acceptTeamInvitation(id: string) {
        try {
            const result = await pool.query(
                "UPDATE notifications SET action_status = 'accepted', is_read = true WHERE id = $1 RETURNING *",
                [id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('[NotificationService] Error accepting invitation:', error);
            throw error;
        }
    }
};

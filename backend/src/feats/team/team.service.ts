import { pool } from '../../config/db.config';
import { sendEmail } from '../email/email.service';
import { notificationService } from '../notification/notification.service';

// Utility to generate a random 6-character alphanumeric PIN
const generatePin = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const teamService = {
    /**
     * Get a user's current team details including members.
     */
    async getMyTeamDetails(userId: string) {
        // 1. Get the team ID for this user
        const memberRes = await pool.query('SELECT team_id FROM team_members WHERE user_id = $1', [userId]);
        const teamId = memberRes.rows[0]?.team_id;
        
        if (!teamId) return null;

        // 2. Get team details
        const teamRes = await pool.query('SELECT id, name, leader_id, created_at FROM teams WHERE id = $1', [teamId]);
        const team = teamRes.rows[0];

        // 3. Get team members (joining with users table)
        const membersQuery = `
            SELECT u.id, u.email, u.role
            FROM team_members tm
            JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = $1
        `;
        const membersRes = await pool.query(membersQuery, [teamId]);

        return {
            ...team,
            members: membersRes.rows
        };
    },

    /**
     * Get a user's current team ID, if any.
     */
    async getUserTeam(userId: string) {
        const res = await pool.query('SELECT team_id FROM team_members WHERE user_id = $1', [userId]);
        return res.rows[0]?.team_id || null;
    },

    /**
     * Create a new team and add the creator as the first member.
     */
    async createTeam(userId: string, teamName: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Check if already in a team
            const existing = await client.query('SELECT team_id FROM team_members WHERE user_id = $1', [userId]);
            if (existing.rows.length > 0) {
                throw new Error('User is already in a team.');
            }

            // Create team
            const teamRes = await client.query(
                'INSERT INTO teams (name, leader_id) VALUES ($1, $2) RETURNING id',
                [teamName, userId]
            );
            const teamId = teamRes.rows[0].id;

            // Add leader as member
            await client.query(
                'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
                [teamId, userId]
            );

            await client.query('COMMIT');
            return teamId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Generate an invitation and send an email + notification
     */
    async inviteMember(inviterId: string, inviterEmail: string, teamId: string, inviteeEmail: string) {
        const pinCode = generatePin();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48); // Expires in 48 hours

        // Store invitation in DB
        await pool.query(
            'INSERT INTO team_invitations (team_id, email, pin_code, expires_at) VALUES ($1, $2, $3, $4)',
            [teamId, inviteeEmail, pinCode, expiresAt]
        );

        // Send Email
        const emailSent = await sendEmail({
            to: inviteeEmail,
            subject: "You've been invited to join a Hackathon Team!",
            html: `
                <div style="font-family: sans-serif; text-align: center;">
                    <h2>Team Invitation</h2>
                    <p>User <b>${inviterEmail}</b> has invited you to join their team for the GSTU Hackathon.</p>
                    <p>Use the following 6-digit PIN code to join the team via the Dashboard:</p>
                    <h1 style="background: #f1f5f9; padding: 20px; letter-spacing: 5px; color: #0f172a; border-radius: 8px; display: inline-block;">${pinCode}</h1>
                    <p>This code expires in 48 hours.</p>
                </div>
            `
        });

        // Send Notification
        await notificationService.createNotification(
            inviteeEmail,
            `You received a team invitation from ${inviterEmail}. Check your email for the PIN code!`
        );

        return { success: true, emailSent };
    },

    /**
     * Join a team using a PIN code
     */
    async joinTeamWithPin(userId: string, pinCode: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Check if user is already in a team
            const existing = await client.query('SELECT team_id FROM team_members WHERE user_id = $1', [userId]);
            if (existing.rows.length > 0) {
                throw new Error('You are already in a team.');
            }

            // 2. Validate PIN
            const inviteRes = await client.query(
                'SELECT * FROM team_invitations WHERE pin_code = $1 AND is_used = false AND expires_at > NOW()',
                [pinCode]
            );

            if (inviteRes.rows.length === 0) {
                throw new Error('Invalid or expired PIN code.');
            }

            const invitation = inviteRes.rows[0];

            // 3. Add to team
            await client.query(
                'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
                [invitation.team_id, userId]
            );

            // 4. Mark PIN as used
            await client.query(
                'UPDATE team_invitations SET is_used = true WHERE id = $1',
                [invitation.id]
            );

            await client.query('COMMIT');
            return { success: true, teamId: invitation.team_id };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
};

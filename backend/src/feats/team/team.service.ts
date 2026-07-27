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
        // 1. Check if invitee is already in a team
        const targetUserRes = await pool.query('SELECT id FROM users WHERE email = $1', [inviteeEmail]);
        if (targetUserRes.rows.length > 0) {
            const inviteeUserId = targetUserRes.rows[0].id;
            const existingMember = await pool.query('SELECT team_id FROM team_members WHERE user_id = $1', [inviteeUserId]);
            if (existingMember.rows.length > 0) {
                throw new Error(`${inviteeEmail} is already a member of a team.`);
            }
        }

        // 2. Check for an active, unexpired invitation for this email from this team
        const existingInviteRes = await pool.query(
            'SELECT id, pin_code, created_at FROM team_invitations WHERE team_id = $1 AND email = $2 AND is_used = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [teamId, inviteeEmail]
        );

        let pinCode: string;
        let isNewInvite = true;
        const now = Date.now();

        if (existingInviteRes.rows.length > 0) {
            const existingInvite = existingInviteRes.rows[0];
            const createdTime = new Date(existingInvite.created_at).getTime();
            // Cooldown: prevent sending again within 60 seconds
            if (now - createdTime < 60000) {
                throw new Error(`An invitation was just sent to ${inviteeEmail}. Please wait 60 seconds before sending another.`);
            }
            // Reuse existing PIN code without creating duplicate database entries
            pinCode = existingInvite.pin_code;
            isNewInvite = false;
        } else {
            pinCode = generatePin();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 48); // Expires in 48 hours

            await pool.query(
                'INSERT INTO team_invitations (team_id, email, pin_code, expires_at) VALUES ($1, $2, $3, $4)',
                [teamId, inviteeEmail, pinCode, expiresAt]
            );
        }

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

        // Only send an in-app notification if this is a new invitation (prevent spamming duplicate notifications)
        if (isNewInvite) {
            await notificationService.createNotification(
                inviteeEmail,
                `You received a team invitation from ${inviterEmail}. Check your email inbox for the 6-digit PIN code to join!`
            );
        }

        return { success: true, emailSent, pinCode };
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

            // 5. Query team leader email and joining user email to send acceptance confirmation notification
            const leaderRes = await client.query(
                `SELECT t.name as team_name, u.email as leader_email 
                 FROM teams t 
                 JOIN users u ON t.leader_id = u.id 
                 WHERE t.id = $1`,
                [invitation.team_id]
            );

            const userRes = await client.query('SELECT email FROM users WHERE id = $1', [userId]);

            if (leaderRes.rows.length > 0 && userRes.rows.length > 0) {
                const leaderEmail = leaderRes.rows[0].leader_email;
                const teamName = leaderRes.rows[0].team_name;
                const joiningEmail = userRes.rows[0].email;

                await client.query(
                    'INSERT INTO notifications (recipient_email, message) VALUES ($1, $2)',
                    [leaderEmail, `${joiningEmail} has accepted your invitation and joined team "${teamName}"!`]
                );

                await client.query(
                    "UPDATE notifications SET action_status = 'accepted', is_read = true WHERE recipient_email = $1 AND message LIKE '%You received a team invitation%' AND (action_status IS NULL OR action_status = 'pending')",
                    [joiningEmail]
                );
            }

            await client.query('COMMIT');
            return { success: true, teamId: invitation.team_id };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Remove a member from the team (Leader only)
     */
    async removeMember(leaderId: string, memberIdToRemove: string) {
        if (leaderId === memberIdToRemove) {
            throw new Error('Team leader cannot remove themselves. Use leave or disband instead.');
        }

        const teamRes = await pool.query('SELECT id, leader_id FROM teams WHERE leader_id = $1', [leaderId]);
        const team = teamRes.rows[0];
        if (!team) {
            throw new Error('Only the team leader can remove members.');
        }

        const res = await pool.query(
            'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2 RETURNING *',
            [team.id, memberIdToRemove]
        );

        if (res.rowCount === 0) {
            throw new Error('Member not found in team.');
        }

        return { success: true };
    },

    /**
     * Leave a team (Member or Leader if only member)
     */
    async leaveTeam(userId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const memberRes = await client.query('SELECT team_id FROM team_members WHERE user_id = $1', [userId]);
            const teamId = memberRes.rows[0]?.team_id;
            if (!teamId) {
                throw new Error('You are not in any team.');
            }

            const teamRes = await client.query('SELECT id, leader_id FROM teams WHERE id = $1', [teamId]);
            const team = teamRes.rows[0];

            if (team.leader_id === userId) {
                const countRes = await client.query('SELECT COUNT(*) as count FROM team_members WHERE team_id = $1', [teamId]);
                const count = parseInt(countRes.rows[0].count, 10);
                if (count > 1) {
                    // Transfer leadership to another member
                    const nextMemberRes = await client.query(
                        'SELECT user_id FROM team_members WHERE team_id = $1 AND user_id != $2 LIMIT 1',
                        [teamId, userId]
                    );
                    const newLeaderId = nextMemberRes.rows[0].user_id;
                    await client.query('UPDATE teams SET leader_id = $1 WHERE id = $2', [newLeaderId, teamId]);
                } else {
                    // Leader was only member; disband team
                    await client.query('DELETE FROM teams WHERE id = $1', [teamId]);
                    await client.query('COMMIT');
                    return { success: true, disbanded: true };
                }
            }

            await client.query('DELETE FROM team_members WHERE team_id = $1 AND user_id = $2', [teamId, userId]);
            await client.query('COMMIT');
            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Disband the entire team (Leader only)
     */
    async disbandTeam(leaderId: string) {
        const teamRes = await pool.query('SELECT id FROM teams WHERE leader_id = $1', [leaderId]);
        const team = teamRes.rows[0];
        if (!team) {
            throw new Error('Only the team leader can disband the team.');
        }

        await pool.query('DELETE FROM teams WHERE id = $1', [team.id]);
        return { success: true };
    }
};

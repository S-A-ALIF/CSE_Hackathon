import { Request, Response } from 'express';
import { pool } from '../../config/db.config';
import { CustomError } from '../../error/customErrors';

/**
 * GET /api/v1/admin/stats
 * Get overview statistics for Admin Dashboard
 */
export const getStats = async (req: Request, res: Response) => {
    try {
        const [usersCountRes, teamsCountRes, settingsRes] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM users WHERE role != 'admin'"),
            pool.query('SELECT COUNT(*) FROM teams'),
            pool.query('SELECT key, value FROM platform_settings')
        ]);

        const settingsMap: Record<string, string> = {};
        settingsRes.rows.forEach(r => {
            settingsMap[r.key] = r.value;
        });

        res.status(200).json({
            status: 'success',
            success: true,
            data: {
                totalUsers: parseInt(usersCountRes.rows[0].count, 10) || 0,
                totalTeams: parseInt(teamsCountRes.rows[0].count, 10) || 0,
                settings: settingsMap
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to load statistics' });
    }
};

/**
 * GET /api/v1/admin/teams
 * Get all teams with leader and member details
 */
export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                t.id,
                t.name,
                t.leader_id,
                t.created_at,
                t.is_banned,
                t.ban_reason,
                u.email as leader_email,
                ui.name as leader_name,
                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'id', m_user.id,
                                'email', m_user.email,
                                'role', m_user.role,
                                'name', COALESCE(m_info.name, ''),
                                'student_id', COALESCE(m_info.student_id, ''),
                                'batch_session', COALESCE(m_info.batch_session, ''),
                                'phone_number', COALESCE(m_info.phone_number, '')
                            )
                        )
                        FROM team_members tm
                        JOIN users m_user ON tm.user_id = m_user.id
                        LEFT JOIN user_info m_info ON m_user.id = m_info.user_id
                        WHERE tm.team_id = t.id
                    ),
                    '[]'::json
                ) as members
            FROM teams t
            LEFT JOIN users u ON t.leader_id = u.id
            LEFT JOIN user_info ui ON u.id = ui.user_id
            ORDER BY t.created_at DESC
        `;
        const result = await pool.query(query);

        res.status(200).json({
            status: 'success',
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching admin teams:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to load teams' });
    }
};

/**
 * PATCH /api/v1/admin/teams/:id
 * Edit team name, ban or unban team
 */
export const updateTeam = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, is_banned, ban_reason } = req.body;

    try {
        const query = `
            UPDATE teams
            SET 
                name = COALESCE($1, name),
                is_banned = COALESCE($2, is_banned),
                ban_reason = $3
            WHERE id = $4
            RETURNING *
        `;
        const result = await pool.query(query, [
            name !== undefined ? name : null,
            is_banned !== undefined ? is_banned : null,
            ban_reason !== undefined ? ban_reason : null,
            id
        ]);

        if (result.rows.length === 0) {
            throw new CustomError('Team not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            data: result.rows[0],
            message: 'Team updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating team:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            success: false,
            message: error.message || 'Failed to update team'
        });
    }
};

/**
 * DELETE /api/v1/admin/teams/:id
 * Delete a team permanently
 */
export const deleteTeam = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM teams WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new CustomError('Team not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting team:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            success: false,
            message: error.message || 'Failed to delete team'
        });
    }
};

/**
 * GET /api/v1/admin/members
 * Get all registered members with profile info and team
 */
export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT 
                u.id,
                u.email,
                u.role,
                u.created_at,
                u.is_banned,
                u.ban_reason,
                COALESCE(ui.name, '') as name,
                COALESCE(ui.student_id, '') as student_id,
                COALESCE(ui.batch_session, '') as batch_session,
                COALESCE(ui.phone_number, '') as phone_number,
                t.name as team_name,
                t.id as team_id
            FROM users u
            LEFT JOIN user_info ui ON u.id = ui.user_id
            LEFT JOIN team_members tm ON u.id = tm.user_id
            LEFT JOIN teams t ON tm.team_id = t.id
            ORDER BY u.created_at DESC
        `;
        const result = await pool.query(query);

        res.status(200).json({
            status: 'success',
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching admin members:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to load registered members' });
    }
};

/**
 * PATCH /api/v1/admin/members/:id
 * Edit member role, profile info, or ban status
 */
export const updateMember = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, is_banned, ban_reason, name, student_id, batch_session, phone_number } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update users table
        const userQuery = `
            UPDATE users
            SET 
                role = COALESCE($1, role),
                is_banned = COALESCE($2, is_banned),
                ban_reason = $3
            WHERE id = $4
            RETURNING *
        `;
        const userRes = await client.query(userQuery, [
            role !== undefined ? role : null,
            is_banned !== undefined ? is_banned : null,
            ban_reason !== undefined ? ban_reason : null,
            id
        ]);

        if (userRes.rows.length === 0) {
            throw new CustomError('User not found', 404);
        }

        // Update user_info table if profile fields provided
        if (name !== undefined || student_id !== undefined || batch_session !== undefined || phone_number !== undefined) {
            const upsertQuery = `
                INSERT INTO user_info (user_id, name, student_id, batch_session, phone_number)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (user_id) DO UPDATE SET
                    name = COALESCE($2, user_info.name),
                    student_id = COALESCE($3, user_info.student_id),
                    batch_session = COALESCE($4, user_info.batch_session),
                    phone_number = COALESCE($5, user_info.phone_number),
                    updated_at = CURRENT_TIMESTAMP
            `;
            await client.query(upsertQuery, [
                id,
                name || null,
                student_id || null,
                batch_session || null,
                phone_number || null
            ]);
        }

        await client.query('COMMIT');

        res.status(200).json({
            status: 'success',
            success: true,
            data: userRes.rows[0],
            message: 'Member updated successfully'
        });
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error updating member:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            success: false,
            message: error.message || 'Failed to update member'
        });
    } finally {
        client.release();
    }
};

/**
 * DELETE /api/v1/admin/members/:id
 * Delete a user permanently
 */
export const deleteMember = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new CustomError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            success: true,
            message: 'Member deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting member:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            success: false,
            message: error.message || 'Failed to delete member'
        });
    }
};

/**
 * GET /api/v1/admin/settings
 * Get platform settings
 */
export const getSettings = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT key, value FROM platform_settings');
        const settings: Record<string, string> = {};
        result.rows.forEach(r => {
            settings[r.key] = r.value;
        });

        res.status(200).json({
            status: 'success',
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to load settings' });
    }
};

/**
 * POST /api/v1/admin/settings/toggle-registration
 * Toggle registration_open open/close
 */
export const toggleRegistration = async (req: Request, res: Response) => {
    try {
        const currentRes = await pool.query("SELECT value FROM platform_settings WHERE key = 'registration_open'");
        const currentVal = currentRes.rows.length > 0 ? currentRes.rows[0].value : 'true';
        const newVal = currentVal === 'true' ? 'false' : 'true';

        await pool.query(
            "INSERT INTO platform_settings (key, value) VALUES ('registration_open', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [newVal]
        );

        res.status(200).json({
            status: 'success',
            success: true,
            data: { registration_open: newVal },
            message: `Registration is now ${newVal === 'true' ? 'OPEN' : 'CLOSED'}`
        });
    } catch (error) {
        console.error('Error toggling registration:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to toggle registration' });
    }
};

/**
 * POST /api/v1/admin/settings/toggle-workspace
 * Toggle workspace_open open/close
 */
export const toggleWorkspace = async (req: Request, res: Response) => {
    try {
        const currentRes = await pool.query("SELECT value FROM platform_settings WHERE key = 'workspace_open'");
        const currentVal = currentRes.rows.length > 0 ? currentRes.rows[0].value : 'false';
        const newVal = currentVal === 'true' ? 'false' : 'true';

        await pool.query(
            "INSERT INTO platform_settings (key, value) VALUES ('workspace_open', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [newVal]
        );

        res.status(200).json({
            status: 'success',
            success: true,
            data: { workspace_open: newVal },
            message: `Project Workspace is now ${newVal === 'true' ? 'OPEN' : 'CLOSED'}`
        });
    } catch (error) {
        console.error('Error toggling workspace:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to toggle workspace access' });
    }
};

/**
 * POST /api/v1/admin/settings/toggle-problems
 * Toggle problems_open open/close
 */
export const toggleProblems = async (req: Request, res: Response) => {
    try {
        const currentRes = await pool.query("SELECT value FROM platform_settings WHERE key = 'problems_open'");
        const currentVal = currentRes.rows.length > 0 ? currentRes.rows[0].value : 'false';
        const newVal = currentVal === 'true' ? 'false' : 'true';

        await pool.query(
            "INSERT INTO platform_settings (key, value) VALUES ('problems_open', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [newVal]
        );

        res.status(200).json({
            status: 'success',
            success: true,
            data: { problems_open: newVal },
            message: `Problem Statements are now ${newVal === 'true' ? 'OPEN' : 'CLOSED'}`
        });
    } catch (error) {
        console.error('Error toggling problems:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to toggle problems access' });
    }
};


/**
 * POST /api/v1/admin/settings/team-limits
 * Update min_team_members and max_team_members
 */
export const updateTeamLimits = async (req: Request, res: Response) => {
    try {
        const { min_team_members, max_team_members } = req.body;
        if (min_team_members !== undefined) {
            const val = min_team_members === '' || min_team_members === null || min_team_members === 'none' ? 'none' : String(min_team_members);
            await pool.query(
                "INSERT INTO platform_settings (key, value) VALUES ('min_team_members', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
                [val]
            );
        }
        if (max_team_members !== undefined) {
            const val = max_team_members === '' || max_team_members === null || max_team_members === 'none' ? 'none' : String(max_team_members);
            await pool.query(
                "INSERT INTO platform_settings (key, value) VALUES ('max_team_members', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
                [val]
            );
        }

        const result = await pool.query('SELECT key, value FROM platform_settings');
        const settings: Record<string, string> = {};
        result.rows.forEach(r => {
            settings[r.key] = r.value;
        });

        res.status(200).json({
            status: 'success',
            success: true,
            data: settings,
            message: 'Team size limits updated successfully'
        });
    } catch (error) {
        console.error('Error updating team limits:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to update team size limits' });
    }
};

/**
 * POST /api/v1/admin/settings/registration-timeline
 * Update reg_start_time and reg_end_time
 */
export const updateRegistrationTimeline = async (req: Request, res: Response) => {
    try {
        const { reg_start_time, reg_end_time } = req.body;

        await pool.query(
            "INSERT INTO platform_settings (key, value) VALUES ('reg_start_time', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [reg_start_time || '']
        );
        await pool.query(
            "INSERT INTO platform_settings (key, value) VALUES ('reg_end_time', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [reg_end_time || '']
        );

        res.status(200).json({
            status: 'success',
            success: true,
            data: { reg_start_time: reg_start_time || '', reg_end_time: reg_end_time || '' },
            message: 'Registration timeline updated successfully'
        });
    } catch (error) {
        console.error('Error updating registration timeline:', error);
        res.status(500).json({ status: 'error', success: false, message: 'Failed to update registration timeline' });
    }
};

/**
 * DELETE /api/v1/admin/members/bulk-delete
 * Bulk delete members with admin protection
 */
export const deleteMultipleMembers = async (req: Request, res: Response) => {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new CustomError('No members selected', 400);
    }

    try {
        const result = await pool.query("DELETE FROM users WHERE id = ANY($1) AND role != 'admin' RETURNING id", [ids]);
        
        res.status(200).json({
            status: 'success',
            success: true,
            message: `Successfully deleted ${result.rowCount} member(s).`,
            deletedCount: result.rowCount
        });
    } catch (error: any) {
        console.error('Error in bulk delete members:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            success: false,
            message: error.message || 'Failed to bulk delete members'
        });
    }
};

/**
 * DELETE /api/v1/admin/teams/bulk-delete
 * Bulk delete teams
 */
export const deleteMultipleTeams = async (req: Request, res: Response) => {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new CustomError('No teams selected', 400);
    }

    try {
        const result = await pool.query('DELETE FROM teams WHERE id = ANY($1) RETURNING id', [ids]);
        
        res.status(200).json({
            status: 'success',
            success: true,
            message: `Successfully deleted ${result.rowCount} team(s).`,
            deletedCount: result.rowCount
        });
    } catch (error: any) {
        console.error('Error in bulk delete teams:', error);
        res.status(error.statusCode || 500).json({
            status: 'error',
            success: false,
            message: error.message || 'Failed to bulk delete teams'
        });
    }
};

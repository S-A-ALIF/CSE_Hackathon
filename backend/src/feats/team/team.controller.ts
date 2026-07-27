import { Request, Response } from 'express';
import { teamService } from './team.service';
import { pool } from '../../config/db.config';

export const inviteToTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { emailToInvite } = req.body;

        if (!emailToInvite) {
            res.status(400).json({ success: false, message: 'Email to invite is required' });
            return;
        }

        // Fetch user's email from DB since it's not in the token
        const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
        if (userRes.rows.length === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const userEmail = userRes.rows[0].email;

        // 1. Get or Create Team for this user
        let teamId = await teamService.getUserTeam(userId);
        if (!teamId) {
            // Auto-create a team if they don't have one
            const defaultTeamName = `${userEmail.split('@')[0]}'s Team`;
            teamId = await teamService.createTeam(userId, defaultTeamName);
        }

        // 2. Generate PIN and send invite
        const result = await teamService.inviteMember(userId, userEmail, teamId, emailToInvite);

        const msg = result.emailSent 
            ? `Invitation sent to ${emailToInvite}` 
            : `Invitation sent to ${emailToInvite} (In-app notification delivered; email skipped or blocked by server)`;

        res.status(200).json({ 
            success: true, 
            message: msg, 
            emailSent: result.emailSent,
            pinCode: result.pinCode 
        });
    } catch (error: any) {
        console.error('[TeamController] Error inviting to team:', error);
        res.status(400).json({ success: false, message: error.message || 'Error sending invitation' });
    }
};

export const joinTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { pinCode } = req.body;

        if (!pinCode || pinCode.length !== 6) {
            res.status(400).json({ success: false, message: 'A valid 6-digit PIN is required' });
            return;
        }

        await teamService.joinTeamWithPin(userId, pinCode.toUpperCase());

        res.status(200).json({ success: true, message: 'Successfully joined the team!' });
    } catch (error: any) {
        console.error('[TeamController] Error joining team:', error);
        res.status(400).json({ success: false, message: error.message || 'Error joining team' });
    }
};

export const getMyTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        
        const teamDetails = await teamService.getMyTeamDetails(userId);
        
        if (!teamDetails) {
            res.status(200).json({ success: true, data: null });
            return;
        }

        res.status(200).json({ success: true, data: teamDetails });
    } catch (error: any) {
        console.error('[TeamController] Error getting team details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const removeMember = async (req: Request, res: Response): Promise<void> => {
    try {
        const leaderId = (req as any).user.id;
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ success: false, status: 'error', message: 'User ID to remove is required' });
            return;
        }

        await teamService.removeMember(leaderId, userId);
        res.status(200).json({ success: true, status: 'success', message: 'Member removed from team' });
    } catch (error: any) {
        console.error('[TeamController] Error removing member:', error);
        res.status(400).json({ success: false, status: 'error', message: error.message || 'Error removing member' });
    }
};

export const leaveTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const result = await teamService.leaveTeam(userId);

        res.status(200).json({ success: true, status: 'success', message: 'Left team successfully', data: result });
    } catch (error: any) {
        console.error('[TeamController] Error leaving team:', error);
        res.status(400).json({ success: false, status: 'error', message: error.message || 'Error leaving team' });
    }
};

export const disbandTeam = async (req: Request, res: Response): Promise<void> => {
    try {
        const leaderId = (req as any).user.id;
        await teamService.disbandTeam(leaderId);

        res.status(200).json({ success: true, status: 'success', message: 'Team disbanded successfully' });
    } catch (error: any) {
        console.error('[TeamController] Error disbanding team:', error);
        res.status(400).json({ success: false, status: 'error', message: error.message || 'Error disbanding team' });
    }
};

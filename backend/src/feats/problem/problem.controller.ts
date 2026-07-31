import { Request, Response } from 'express';
import { pool } from '../../config/db.config';

export const getAllProblems = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM problems ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error: any) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch problems' });
    }
};

export const createProblem = async (req: Request, res: Response) => {
    try {
        const { title, track, difficulty, description, criteria, prize } = req.body;
        
        if (!title || !track || !difficulty || !description || !criteria || !prize) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }

        const criteriaJson = JSON.stringify(Array.isArray(criteria) ? criteria : criteria.split(',').map((s: string) => s.trim()));

        const query = `
            INSERT INTO problems (title, track, difficulty, description, criteria, prize)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [title, track, difficulty, description, criteriaJson, prize];
        
        const result = await pool.query(query, values);
        
        res.status(201).json({
            success: true,
            message: 'Problem created successfully',
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error creating problem:', error);
        res.status(500).json({ success: false, message: 'Failed to create problem' });
    }
};

export const updateProblem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, track, difficulty, description, criteria, prize } = req.body;
        
        const criteriaJson = criteria ? JSON.stringify(Array.isArray(criteria) ? criteria : criteria.split(',').map((s: string) => s.trim())) : null;

        const query = `
            UPDATE problems
            SET 
                title = COALESCE($1, title),
                track = COALESCE($2, track),
                difficulty = COALESCE($3, difficulty),
                description = COALESCE($4, description),
                criteria = COALESCE($5, criteria),
                prize = COALESCE($6, prize)
            WHERE id = $7
            RETURNING *
        `;
        const values = [title, track, difficulty, description, criteriaJson, prize, id];
        
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Problem not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Problem updated successfully',
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error updating problem:', error);
        res.status(500).json({ success: false, message: 'Failed to update problem' });
    }
};

export const deleteProblem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM problems WHERE id = $1 RETURNING id', [id]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Problem not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting problem:', error);
        res.status(500).json({ success: false, message: 'Failed to delete problem' });
    }
};

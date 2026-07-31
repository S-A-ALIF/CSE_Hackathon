import { pool } from '../../config/db.config';
import { CustomError } from '../../error/customErrors';

export interface UserInfo {
    userId: string;
    name: string;
    studentId: string;
    batchSession: string;
    phoneNumber: string;
}

export const getProfile = async (userId: string) => {
    try {
        const result = await pool.query('SELECT * FROM user_info WHERE user_id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return {
            id: row.id,
            userId: row.user_id,
            name: row.name,
            studentId: row.student_id,
            batchSession: row.batch_session,
            phoneNumber: row.phone_number
        };
    } catch (error: any) {
        console.error('Service Error [getProfile]:', error);
        throw new CustomError('Failed to fetch user profile', 500);
    }
};

export const upsertProfile = async (data: UserInfo) => {
    try {
        const query = `
            INSERT INTO user_info (user_id, name, student_id, batch_session, phone_number)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                name = EXCLUDED.name,
                student_id = EXCLUDED.student_id,
                batch_session = EXCLUDED.batch_session,
                phone_number = EXCLUDED.phone_number,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;
        
        const result = await pool.query(query, [
            data.userId,
            data.name,
            data.studentId,
            data.batchSession,
            data.phoneNumber
        ]);

        const row = result.rows[0];
        return {
            id: row.id,
            userId: row.user_id,
            name: row.name,
            studentId: row.student_id,
            batchSession: row.batch_session,
            phoneNumber: row.phone_number
        };
    } catch (error: any) {
        console.error('Service Error [upsertProfile]:', error);
        throw new CustomError('Failed to update user profile', 500);
    }
};

export const searchUsers = async (searchQuery: string) => {
    try {
        const query = `
            SELECT 
                u.id as user_id, 
                u.email, 
                COALESCE(ui.name, '') as name, 
                COALESCE(ui.student_id, '') as student_id
            FROM users u
            LEFT JOIN user_info ui ON u.id = ui.user_id
            WHERE 
                u.email ILIKE $1 
                OR ui.name ILIKE $1 
                OR ui.student_id ILIKE $1
            LIMIT 10;
        `;
        const result = await pool.query(query, [`%${searchQuery}%`]);
        return result.rows;
    } catch (error: any) {
        console.error('Service Error [searchUsers]:', error);
        throw new CustomError('Failed to search users', 500);
    }
};

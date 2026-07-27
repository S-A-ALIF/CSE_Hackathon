import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { pool } from '../../config/db.config';
import { CustomError } from '../../error/customErrors';
import { generateToken } from '../../config/jwt.config';
import { User } from './user.model';

export const registerUser = async (userData: any): Promise<User> => {
    const { email, password, role } = userData;

    try {
        // 1. Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            throw new CustomError('User with this email already exists', 409);
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Generate UUID
        const id = crypto.randomUUID();

        // 4. Insert user
        const query = `
            INSERT INTO users (id, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, email, role
        `;
        const result = await pool.query(query, [id, email, hashedPassword, role]);

        return result.rows[0];
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [registerUser]:', error);
        throw new CustomError('Database operation failed during registration', 500);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        // 1. Fetch user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // 2. Validate user existence
        if (!user) {
            throw new CustomError('Invalid email or password', 401);
        }

        // 3. Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new CustomError('Invalid email or password', 401);
        }

        // 4. Generate JWT
        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                // Profile will now be fetched dynamically via /me endpoint
            }
        };
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        
        console.error('Service Error [loginUser]:', error);
        throw new CustomError('Database operation failed during login', 500);
    }
};

export const getMe = async (userId: string, role?: string) => {
    try {
        const userQuery = `
            SELECT u.id, u.email, u.role, u.created_at,
                   ui.name, ui.student_id, ui.batch_session, ui.phone_number,
                   t.id as team_id, t.name as team_name, t.leader_id
            FROM users u
            LEFT JOIN user_info ui ON u.id = ui.user_id
            LEFT JOIN team_members tm ON u.id = tm.user_id
            LEFT JOIN teams t ON tm.team_id = t.id
            WHERE u.id = $1
        `;
        const userResult = await pool.query(userQuery, [userId]);
        const profile = userResult.rows[0];

        if (!profile) {
            throw new CustomError('User not found', 404);
        }

        return profile;
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [getMe]:', error);
        throw new CustomError('Failed to fetch user profile', 500);
    }
};
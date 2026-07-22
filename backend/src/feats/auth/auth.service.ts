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
        const token = generateToken({ id: user.id, role: user.role });

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

export const getMe = async (userId: string, role: string) => {
    try {
        let profile = null;
        
        if (role === 'admin') {
            const instQuery = `
                SELECT i.* FROM institutions i 
                JOIN user_institutions ui ON i.id = ui.inst_id 
                WHERE ui.user_id = $1
            `;
            const instResult = await pool.query(instQuery, [userId]);
            profile = instResult.rows[0] || null;
            
        } else if (role === 'tutor') {
            const tutorQuery = `
                SELECT t.*, i.name as institution_name, i.id as inst_id 
                FROM tutors t 
                JOIN user_tutors ut ON t.id = ut.tutor_id 
                LEFT JOIN tutor_institutions ti ON t.id = ti.tutor_id
                LEFT JOIN institutions i ON ti.inst_id = i.id
                WHERE ut.user_id = $1
                LIMIT 1
            `;
            const tutorResult = await pool.query(tutorQuery, [userId]);
            profile = tutorResult.rows[0] || null;
            
        } else if (role === 'student') {
            const studentQuery = `
                SELECT s.*, i.name as institution_name, i.id as inst_id
                FROM students s 
                JOIN user_students us ON s.id = us.student_id 
                LEFT JOIN student_enrollments se ON s.id = se.student_id AND se.status = 'active'
                LEFT JOIN institution_enrollments ie ON se.enrollment_id = ie.enrollment_id
                LEFT JOIN institutions i ON ie.inst_id = i.id
                WHERE us.user_id = $1
                LIMIT 1
            `;
            const studentResult = await pool.query(studentQuery, [userId]);
            profile = studentResult.rows[0] || null;
        }

        return profile;
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [getMe]:', error);
        throw new CustomError('Failed to fetch user profile', 500);
    }
};
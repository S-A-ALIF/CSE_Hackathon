import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
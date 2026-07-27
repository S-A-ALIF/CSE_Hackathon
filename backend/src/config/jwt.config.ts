import jwt from 'jsonwebtoken';
import { envConfig } from './env.config';

const JWT_SECRET = envConfig.jwt.secret;
const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
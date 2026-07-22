/**
 * User Model
 * Defines the structure for the User entity.
 */
export interface User {
    id: string;
    email: string;
    password?: string; // Hashed password, exclude from sensitive responses
    role: 'student' | 'tutor' | 'admin';
    createdAt?: Date;
}
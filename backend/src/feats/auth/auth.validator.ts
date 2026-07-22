import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        role: z.enum(['student', 'tutor', 'admin']).optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password is required" })
    })
});
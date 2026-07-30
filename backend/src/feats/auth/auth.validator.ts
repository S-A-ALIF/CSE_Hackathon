import { z } from 'zod';

const STUDENT_ID_REGEX = /^\d{2}[A-Za-z]{2,3}\d{3}$/;
const STUDENT_ID_ERROR = "Student ID must be 2 session digits + 2 or 3 department letters + 3 roll digits (e.g. 22CSE020 or 22CE005)";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        role: z.enum(['student', 'tutor', 'admin']).optional(),
        name: z.string().min(1, { message: "Name is required" }).max(100),
        student_id: z.string().regex(STUDENT_ID_REGEX, { message: STUDENT_ID_ERROR }),
        batch_session: z.string().min(1, { message: "Batch/Session is required" }).max(50)
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password is required" })
    })
});
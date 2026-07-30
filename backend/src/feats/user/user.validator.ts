import { z } from 'zod';

const STUDENT_ID_REGEX = /^\d{2}[A-Za-z]{2,3}\d{3}$/;
const STUDENT_ID_ERROR = "Student ID must be 2 session digits + 2 or 3 department letters + 3 roll digits (e.g. 22CSE020 or 22CE005)";

export const userProfileSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }).max(100),
        student_id: z.string().regex(STUDENT_ID_REGEX, { message: STUDENT_ID_ERROR }),
        batch_session: z.string().min(1, { message: "Batch/Session is required" }).max(50),
        phone_number: z.string().max(20).optional().or(z.literal('')),
    })
});

import { z } from 'zod';

export const userProfileSchema = z.object({
    body: z.object({
        name: z.string().min(1, { message: "Name is required" }).max(100),
        student_id: z.string().min(1, { message: "Student ID is required" }).max(50),
        batch_session: z.string().min(1, { message: "Batch/Session is required" }).max(50),
        phone_number: z.string().min(1, { message: "Phone Number is required" }).max(20),
    })
});

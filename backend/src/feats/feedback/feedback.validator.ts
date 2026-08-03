import { z } from 'zod';

export const feedbackSchemas = {
    createFeedback: z.object({
        body: z.object({
            subject: z.string().min(1, 'Subject is required').max(255),
            type: z.string().min(1, 'Type is required').max(50),
            description: z.string().min(1, 'Description is required')
        })
    })
};

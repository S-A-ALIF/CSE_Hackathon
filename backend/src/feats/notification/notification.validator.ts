import { z } from 'zod';

export const notificationSchemas = {
    paramId: z.object({
        params: z.object({
            id: z.string().uuid({ message: "Invalid notification UUID format" })
        })
    })
};

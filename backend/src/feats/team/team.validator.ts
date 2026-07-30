import { z } from 'zod';

export const teamSchemas = {
    create: z.object({
        body: z.object({
            name: z.string().min(1, { message: "Team name is required" }).max(100, { message: "Team name cannot exceed 100 characters" })
        })
    }),
    invite: z.object({
        body: z.object({
            emailToInvite: z.string().email({ message: "Valid email address is required to invite" })
        })
    }),
    joinWithPin: z.object({
        body: z.object({
            pinCode: z.string().length(6, { message: "A valid 6-character PIN code is required" })
        })
    }),
    requestJoinByCode: z.object({
        body: z.object({
            teamCode: z.string().min(1, { message: "Team code is required" })
        })
    }),
    updateName: z.object({
        body: z.object({
            name: z.string().min(1, { message: "Team name is required" }).max(100)
        })
    }),
    transferLeadership: z.object({
        body: z.object({
            newLeaderId: z.string().uuid({ message: "Valid user ID is required for new leader" })
        })
    }),
    updateStatus: z.object({
        body: z.object({
            is_full: z.boolean().optional()
        })
    }),
    paramId: z.object({
        params: z.object({
            id: z.string().uuid({ message: "Invalid invitation ID format" })
        })
    })
};

import { z } from 'zod';

export const profileSchema = z.object({
    firstName: z.string().min(2, {
        message: 'First name must be at least 2 characters long'
    }),
    lastName: z.string().min(2, {
        message: 'Last name must be at least 2 characters long'
    }),
    fullName: z.string().min(5, {
        message: 'Full name must be at least 5 characters long'
    }).max(50, {
        message: 'Full name must not exceed 50 characters'
    }),
    phone: z.string().min(10, {
        message: 'Phone number must be at least 10 characters long'
    }).max(15, {
        message: 'Phone number must not exceed 15 characters'
    }),
    email: z.string().email({
        message: 'Invalid email address'
    }),
});

export type TProfileSchema = z.infer<typeof profileSchema>;
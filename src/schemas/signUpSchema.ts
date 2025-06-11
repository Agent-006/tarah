import { z } from 'zod';

export const signUpSchema = z.object({
    firstName: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' }),
    lastName: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' }),
    phone: z
            .string()
            .min(10, { message: 'Phone number must be at least 10 characters long' })
            .max(15, { message: 'Phone number must not exceed 15 characters' }),
    email: z
            .string()
            .email({ message: 'Invalid email address' }),
    password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(20, { message: 'Password must not exceed 20 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }),
})
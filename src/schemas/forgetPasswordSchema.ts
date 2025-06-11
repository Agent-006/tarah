import { z } from 'zod';

export const forgetPasswordSchema = z.object({
    email: z
            .string()
            .email({ message: 'Invalid email address' })
            .min(1, { message: 'Email is required' })
            .max(100, { message: 'Email must not exceed 100 characters' }),
})
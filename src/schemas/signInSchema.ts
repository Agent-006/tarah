import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }), 
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must not exceed 20 characters' })
});

export type TSignInSchema = z.infer<typeof signInSchema>;
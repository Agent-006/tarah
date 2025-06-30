import { z } from 'zod';

export const signUpSchema = z.object({
        firstName: z
                .string()
                .min(2, { message: 'Name must be at least 2 characters long' }),
        lastName: z
                .string()
                .min(2, { message: 'Name must be at least 2 characters long' }),
        fullName: z
                .string()
                .min(5, { message: 'Full name must be at least 5 characters long' })
                .max(50, { message: 'Full name must not exceed 50 characters' }),
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
        confirmPassword: z
        .string(),
}).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
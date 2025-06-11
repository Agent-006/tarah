import { z } from 'zod';

export const resetPasswordSchema = z.object({
    verificationCode: z
                        .string()
                        .length(6, { message: 'Verification code must be exactly 6 characters long' }),
    newPassword: z
                    .string()
                    .min(8, { message: 'New password must be at least 8 characters long' })
                    .max(20, { message: 'New password must not exceed 20 characters' })
                    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                    }),
    confirmPassword: z
                        .string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
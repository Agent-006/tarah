import { z } from 'zod';

export interface IProfileSchema {
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export const profileSchema: z.ZodType<IProfileSchema> = z.object({
    firstName: z
        .string()
        .min(2, {
            message: 'First name must be at least 2 characters long'
        }),
    lastName: z
        .string()
        .min(2, {
            message: 'Last name must be at least 2 characters long'
        }),
    fullName: z
        .string()
        .min(5, {
            message: 'Full name must be at least 5 characters long'
        }).max(50, {
            message: 'Full name must not exceed 50 characters'
        }),
    phone: z
        .string()
        .min(10, {
            message: 'Phone number must be at least 10 characters long'
        })
        .max(15, {
            message: 'Phone number must not exceed 15 characters'
        }),
    email: z
        .string()
        .email({
            message: 'Invalid email address'
        }),
    // currentPassword: z
    //     .string()
    //     .optional(),
    // newPassword: z
    //     .string()
    //     .min(8, {
    //         message: 'New password must be at least 8 characters long'
    //     })
    //     .max(20, { message: 'Password must not exceed 20 characters' })
    //     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    //             message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    //         })
    //     .optional(),
    // confirmPassword: z
    //     .string()
    //     .min(8, {
    //         message: 'Confirm password must be at least 8 characters long'
    //     })
    //     .optional()
});
// .refine((data) => data.newPassword === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"]
//     }
// );

export type TProfileSchema = z.infer<typeof profileSchema>;
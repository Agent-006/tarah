import { z } from 'zod';

export const addressSchema = z.object({
    street: z.string().min(1, 'Street address is required').max(255, 'Street address must be at most 255 characters long'),
    city: z.string().min(1, 'City is required').max(100, 'City must be at most 100 characters long'),
    state: z.string().min(1, 'State is required').max(50, 'State must be at most 100 characters long'),
    postalCode: z.string().min(1, 'Postal code is required').regex(/^\d+$/, "Must be numeric"),
    country: z.string().min(1, 'Country is required').default("India").optional(),
    isDefault: z.boolean().default(false).optional(),
});

export type TAddressSchema = z.infer<typeof addressSchema>;
import { z } from 'zod';

export const adminProductsSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Product name is required' })
        .max(150, { message: 'Product name must not exceed 100 characters' }),
    slug: z
        .string()
        .min(1, { message: 'Slug is required' })
        .max(100, { message: 'Slug must not exceed 100 characters' })
        .regex(/^[a-z0-9]+(?:-[a-z0-9?]+)*$/, {
            message: 'Slug must be lowercase and can only contain letters, numbers, hyphens, and question marks',
        }),
    description: z
        .string()
        .min(1, { message: 'Description is required' })
        .max(500, { message: 'Description must not exceed 500 characters' }),
    basePrice: z
        .number()
        .min(0, { message: 'Base price must be a positive number' })
        .max(100000, { message: 'Base price must not exceed 100000' }),
    discountedPrice: z
        .number()
        .min(0, { message: 'Discounted price must be a positive number' })
        .max(100000, { message: 'Discounted price must not exceed 100000' })
        .optional(),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    images: z
        .array(
            z.string()
        )
        .min(1, { message: 'At least one image is required' })
        .max(10, { message: 'A maximum of 10 images is allowed' }),
})

export type TAdminProductsSchema = z.infer<typeof adminProductsSchema>;
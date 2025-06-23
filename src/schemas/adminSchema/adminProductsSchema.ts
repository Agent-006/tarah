import { z } from 'zod';

export const adminProductImageSchema = z.object({
    url: z
        .string()
        .url(),
    altText: z
        .string()
        .optional(),
    isPrimary: z
        .boolean()
        .default(false),
    order: z
        .number()
        .int()
        .default(0)
});

export const adminVariantAttributeSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Attribute name is required' }),
    value: z
        .string()
        .min(1, { message: 'Attribute value is required' })
});

export const adminInventorySchema = z.object({
    stock: z
        .number()
        .min(0, { message: 'Stock must be a non-negative number' }),
    lowStockThreshold: z
        .number()
        .int()
        .min(0, { message: 'Low stock threshold must be a non-negative number' })
        .default(5)
});

export const adminProductVariantSchema = z.object({
    id: z
        .string()
        .optional(),
    name: z
        .string()
        .min(1, { message: 'Variant name is required' }),
    sku: z
        .string()
        .min(1, { message: 'SKU is required' }),
    priceOffset: z
        .number()
        .default(0),
    attributes: z
        .array(adminVariantAttributeSchema)
        .default([]),
    images: z
        .array(adminProductImageSchema)
        .min(1, { message: 'At least one variant image is required' }),
    inventory: adminInventorySchema,
});

export const adminProductsSchema = z.object({
    id: z
        .string()
        .optional(),
    name: z
        .string()
        .min(1, { message: 'Product name is required' }),
    slug: z
        .string()
        .min(1, { message: 'Slug is required' }),
    description: z
        .string()
        .min(1, { message: 'Description is required' }),
    basePrice: z
        .number()
        .min(0, { message: 'Base price must be a positive number' }),
    discountedPrice: z
        .number()
        .min(0)
        .optional(),
    categories: z
        .array(z.string())
        .min(1, { message: 'At least one category is required' }),
    variants: z
        .array(adminProductVariantSchema)
        .min(1, { message: 'At least one variant is required' }),
    attributes: z
        .array(z.object({
            name: z.string().min(1),
            value: z.string().min(1)
        }))
        .default([]),
    published: z
        .boolean()
        .default(false),
    featured: z
        .boolean()
        .default(false),
});

export type TAdminProductsSchema = z.infer<typeof adminProductsSchema>;
import { z } from "zod";

export const adminProductImageSchema = z.object({
  url: z.string().url(),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const adminVariantAttributeSchema = z.object({
  name: z.string().min(1, { message: "Attribute name is required" }),
  value: z.string().min(1, { message: "Attribute value is required" }),
});

export const adminInventorySchema = z.object({
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Stock must be a non-negative number",
    }),
  lowStockThreshold: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Low stock threshold must be a non-negative number",
    })
    .default(5),
});

export const adminProductVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Variant name is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  priceOffset: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val), { message: "Price offset must be a number" })
    .default(0),
  attributes: z.array(adminVariantAttributeSchema).default([]),
  images: z
    .array(adminProductImageSchema)
    .refine((images) => images.some((img) => img.url && img.url.length > 0), {
      message: "At least one variant image with URL is required",
    }),
  inventory: adminInventorySchema,
});

export const adminProductsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Product name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  basePrice: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Base price must be a positive number",
    }),
  discountedPrice: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Discounted price must be a positive number",
    })
    .optional(),
  categories: z
    .array(z.string())
    .min(1, { message: "At least one category is required" }),
  variants: z
    .array(adminProductVariantSchema)
    .min(1, { message: "At least one variant is required" }),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type TAdminProductsSchema = z.infer<typeof adminProductsSchema>;

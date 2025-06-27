import { z } from 'zod';

export const blogCategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1, 'Category slug is required'),
    description: z.string().optional(),
});

export const blogTagSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Tag name is required'),
    slug: z.string().min(1, 'Tag slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tag slug must be lowercase and hyphen-separated'),
});

export const blogPostSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must be at most 100 characters long'),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(100, 'Slug must be at most 100 characters long')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and hyphen-separated'),
    excerpt: z
        .string()
        .min(1, 'Excerpt is required')
        .max(300, 'Excerpt must be at most 300 characters long')
        .optional(),
    content: z
        .record(z.any()), // For JSON content
    coverImage: z
        .string()
        .url('Cover image must be a valid URL')
        .optional(),
    published: z
        .boolean()
        .default(false),
    publishedAt: z
        .date()
        .optional(),
    categories: z
        .array(z.string().uuid())
        .optional(),
    tags: z
        .array(z.string().uuid())
        .optional(),
    seoTitle: z
        .string()
        .max(100, 'SEO title must be at most 60 characters long')
        .optional(),
    seoDescription: z
        .string()
        .max(200, 'SEO description must be at most 160 characters long')
        .optional(),
});
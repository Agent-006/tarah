import { z } from 'zod';

export const SlugSchema = z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .max(100, "Slug must be less than 100 characters long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");

// if you want to accept array or string for keywords in admin form
const KeywordsAsCSV = z.preprocess((val) => {
    if (Array.isArray(val)) return val.join(", ");
    return val;
}, z.string().max(300, "Too many keywords").optional());


// backlinks: list of { url, text }
export const BacklinkItemSchema = z.object({
    url: z.string().url("Invalid URL"),
    text: z.string().min(1, "Anchor text is required").max(120, "Anchor text is too long"),
});

export const BacklinksSchema = z.array(BacklinkItemSchema).optional();


// SEO fields
export const SEOFieldsSchema = z.object({
    seoTitle: z.string().max(70, "SEO title should be <= 70 characters").optional(),
    seoDescription: z.string().max(160, "SEO description should be <= 160 characters").optional(),
    seoKeywords: KeywordsAsCSV,
    ogImage: z.string().url("Invalid OG image URL").optional(),
});


// Editor content: keep flexible (Tiptap/Editor.js JSON)
export const ContentJsonSchema = z.unknown(); // or z.record(z.string(), z.any()) if you want stricter typing


// Base post fields used by both create & update
const BasePostFields = z.object({
    title: z.string().min(3, "Title too short").max(120, "Title too long"),
    slug: SlugSchema,
    excerpt: z.string().max(200, "Excerpt should be <= 200 characters").optional(),
    content: ContentJsonSchema,
    authorId: z.string().uuid("Invalid author ID"),
    published: z.boolean().optional(),
    publishedAt: z.coerce.date().optional(),

    backlinks: BacklinksSchema,

    categorySlugs: z.array(SlugSchema).optional(),
    tagSlugs: z.array(SlugSchema).optional(),
}).merge(SEOFieldsSchema);


// Create
export const BlogPostCreateSchema = BasePostFields.superRefine((data, ctx) => {
    if (data.published) {
        // if published = true and no publishedAt provided, it’s okay; API will default it to now.
        // If you want to require publishedAt, uncomment below:
        if (!data.publishedAt) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "publishedAt is required when publishing" });
    }
});


// Update
export const BlogPostUpdateSchema = BasePostFields.partial().extend({
    id: z.string().uuid().optional(),
}).superRefine((data, ctx) => {
    if (data.published) {
        if (!data.publishedAt) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "publishedAt is required when publishing" });
    }
});


// List query for /api/blog/posts
export const BlogPostListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(9),
    category: z.string().optional(),
    tag: z.string().optional(),
    sort: z.enum(["latest", "views"]).default("latest"),
    published: z.enum(["true", "false"]).optional(),
});


// Category/Tag create (admin)
export const BlogCategoryCreateSchema = z.object({
    name: z.string().min(2).max(50),
    slug: SlugSchema,
    description: z.string().max(200).optional(),
});

export const BlogTagCreateSchema = z.object({
    name: z.string().min(2).max(50),
    slug: SlugSchema,
});


// blogView
export const BlogViewSchema = z.object({
    postId: z.string().uuid("Invalid post ID"),
    ipAddess: z.string().min(1).ip("Invalid IP address"),
    userAgent: z.string().optional()
})

// Responses
export const BlogViewCounterResponseSchema = z.object({
    views: z.number().int().nonnegative(),
});


// Small util to Generate slugs on client/admin
export const slugify = (s: string) => 
    s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
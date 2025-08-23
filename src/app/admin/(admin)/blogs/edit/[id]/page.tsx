"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
    FileText,
    Globe,
    Loader2,
    Save,
    User,
    Wand2,
    Eye,
    ImageIcon,
    Plus,
    X,
    Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Editor } from "@/components/admin/blog/rte/editor-x/editor";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/image-upload";
import { useUploadThing } from "@/lib/uploadthing";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Enhanced Schema definition matching Prisma schema
const formSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        ),
    content: z.any().refine((value) => {
        // Accept either string, SerializedEditorState, or null (for initial state)
        return value !== undefined && value !== "" && value !== null;
    }, "Content is required"),
    excerpt: z
        .string()
        .max(500, "Excerpt must be less than 500 characters")
        .optional(),
    coverImage: z.string().optional().or(z.literal("")),
    coverImageAlt: z.string().optional().or(z.literal("")),
    ogImage: z.string().optional().or(z.literal("")),
    ogImageAlt: z.string().optional().or(z.literal("")),

    // SEO fields
    seoTitle: z
        .string()
        .max(60, "SEO title should be less than 60 characters")
        .optional(),
    seoDescription: z
        .string()
        .max(160, "SEO description should be less than 160 characters")
        .optional(),
    seoKeywords: z.string().optional(),
    canonicalUrl: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),

    // Relationships
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    authorName: z.string().min(1, "Author is required"),

    // Publishing
    published: z.boolean(),
    publishedAt: z.string().optional(),
});

type BlogFormData = z.infer<typeof formSchema>;

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: any;
    coverImage?: string;
    coverImageAlt?: string;
    ogImage?: string;
    ogImageAlt?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    canonicalUrl?: string;
    published: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    authorName: string;
    author?: {
        name: string;
        bio?: string;
        avatarUrl?: string;
    };
    categories: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    tags: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
}

export default function EditBlogPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("content");
    const [availableCategories, setAvailableCategories] = useState<string[]>(
        []
    );
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [availableAuthors, setAvailableAuthors] = useState<
        { name: string; bio?: string }[]
    >([]);
    const [newCategory, setNewCategory] = useState("");
    const [newTag, setNewTag] = useState("");
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [newAuthor, setNewAuthor] = useState({
        name: "",
        bio: "",
        avatarUrl: "",
    });
    const [originalSlug, setOriginalSlug] = useState("");

    // Redirect customers to home page
    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "CUSTOMER") {
            router.replace("/");
        }
    }, [status, session?.user?.role, router]);

    // Fetch categories, tags, and authors
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, tagsRes, authorsRes] = await Promise.all([
                    axios.get("/api/admin/blog-categories"),
                    axios.get("/api/admin/blog-tags"),
                    axios.get("/api/admin/authors"),
                ]);
                setAvailableCategories(
                    categoriesRes.data.map((cat: { slug: string }) => cat.slug)
                );
                setAvailableTags(
                    tagsRes.data.map((tag: { slug: string }) => tag.slug)
                );
                setAvailableAuthors(
                    authorsRes.data.map(
                        (author: { name: string; bio?: string }) => author
                    )
                );
            } catch (error) {
                console.error("Failed to fetch categories and tags:", error);
            }
        };

        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchData();
        }
    }, [status, session?.user?.role]);

    const form = useForm<BlogFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: null,
            excerpt: "",
            coverImage: "",
            coverImageAlt: "",
            ogImage: "",
            ogImageAlt: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
            canonicalUrl: "",
            categories: [],
            tags: [],
            authorName: "",
            published: false,
            publishedAt: "",
        },
    });

    // State for image uploads
    const [coverImageFile, setCoverImageFile] = useState<string[]>([]);
    const [ogImageFile, setOgImageFile] = useState<string[]>([]);

    // UploadThing hooks
    const { startUpload } = useUploadThing("imageUploader");

    // Fetch blog post data
    useEffect(() => {
        const fetchPost = async () => {
            if (!params?.id) return;

            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/api/admin/blog/posts/${params.id}`
                );
                const post: BlogPost = response.data.post;

                // Format publishedAt date for input
                const formattedPublishedAt = post.publishedAt
                    ? new Date(post.publishedAt).toISOString().split("T")[0]
                    : "";

                // Set form values
                form.reset({
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt || "",
                    coverImage: post.coverImage || "",
                    coverImageAlt: post.coverImageAlt || "",
                    ogImage: post.ogImage || "",
                    ogImageAlt: post.ogImageAlt || "",
                    seoTitle: post.seoTitle || "",
                    seoDescription: post.seoDescription || "",
                    seoKeywords: post.seoKeywords || "",
                    canonicalUrl: post.canonicalUrl || "",
                    categories: post.categories.map((cat) => cat.slug),
                    tags: post.tags.map((tag) => tag.slug),
                    authorName: post.authorName,
                    published: post.published,
                    publishedAt: formattedPublishedAt,
                });

                // Set image files
                if (post.coverImage) {
                    setCoverImageFile([post.coverImage]);
                }
                if (post.ogImage) {
                    setOgImageFile([post.ogImage]);
                }

                setOriginalSlug(post.slug);
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
                toast.error("Failed to load blog post");
                router.push("/admin/blogs");
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated" && session?.user?.role === "ADMIN") {
            fetchPost();
        }
    }, [params?.id, status, session?.user?.role, router, form]);

    // Image upload handlers
    const handleCoverImageUpload = async (urls: string[]) => {
        setCoverImageFile(urls);
        form.setValue("coverImage", urls[0] || "");
    };

    const handleOgImageUpload = async (urls: string[]) => {
        setOgImageFile(urls);
        form.setValue("ogImage", urls[0] || "");
    };

    // File upload handlers for ImageUpload component
    const handleCoverImageFileSelect = async (files: File[]) => {
        if (files.length > 0) {
            try {
                const uploadedFiles = await startUpload(files);
                if (uploadedFiles && uploadedFiles.length > 0) {
                    const urls = uploadedFiles.map((file) => file.url);
                    await handleCoverImageUpload(urls);
                }
            } catch (error) {
                console.error("Error uploading cover image:", error);
                toast.error("Failed to upload image");
            }
        }
    };

    const handleOgImageFileSelect = async (files: File[]) => {
        if (files.length > 0) {
            try {
                const uploadedFiles = await startUpload(files);
                if (uploadedFiles && uploadedFiles.length > 0) {
                    const urls = uploadedFiles.map((file) => file.url);
                    await handleOgImageUpload(urls);
                }
            } catch (error) {
                console.error("Error uploading OG image:", error);
                toast.error("Failed to upload image");
            }
        }
    };

    // Auto-generate slug from title (only if it matches the original or is empty)
    const watchTitle = form.watch("title");
    const watchSlug = form.watch("slug");
    const watchCoverImage = form.watch("coverImage");
    const watchOgImage = form.watch("ogImage");

    useEffect(() => {
        if (watchTitle && originalSlug) {
            const generatedSlug = watchTitle
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim()
                .replace(/^-|-$/g, "");

            // Only auto-generate if current slug is empty or matches original
            if (!watchSlug || watchSlug === originalSlug) {
                form.setValue("slug", generatedSlug, { shouldValidate: true });
            }
        }
    }, [watchTitle, watchSlug, originalSlug, form]);

    // Sync form image values with state
    useEffect(() => {
        if (watchCoverImage && watchCoverImage !== coverImageFile[0]) {
            setCoverImageFile(watchCoverImage ? [watchCoverImage] : []);
        }
    }, [watchCoverImage, coverImageFile]);

    useEffect(() => {
        if (watchOgImage && watchOgImage !== ogImageFile[0]) {
            setOgImageFile(watchOgImage ? [watchOgImage] : []);
        }
    }, [watchOgImage, ogImageFile]);

    const onSubmit = async (values: BlogFormData) => {
        try {
            setIsSubmitting(true);
            console.log("Updating blog post with values:", values);

            const blogData = {
                ...values,
                content: values.content,
                publishedAt: values.publishedAt || null,
            };

            console.log("Updating blog data:", blogData);

            const response = await axios.put(
                `/api/admin/blog/posts/${params.id}`,
                blogData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Blog updated:", response.data);
            toast.success("Blog post updated successfully!");
            router.push("/admin/blogs");
        } catch (error) {
            console.error("Failed to update blog post:", error);
            let errorMessage = "Failed to update blog post";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.error || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addCategory = (category: string) => {
        const currentCategories = form.getValues("categories");
        if (category && !currentCategories.includes(category)) {
            form.setValue("categories", [...currentCategories, category]);
        }
    };

    const removeCategory = (category: string) => {
        const currentCategories = form.getValues("categories");
        form.setValue(
            "categories",
            currentCategories.filter((c) => c !== category)
        );
    };

    const addTag = (tag: string) => {
        const currentTags = form.getValues("tags");
        if (tag && !currentTags.includes(tag)) {
            form.setValue("tags", [...currentTags, tag]);
        }
    };

    const removeTag = (tag: string) => {
        const currentTags = form.getValues("tags");
        form.setValue(
            "tags",
            currentTags.filter((t) => t !== tag)
        );
    };

    const createNewCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            const response = await axios.post("/api/admin/blog-categories", {
                name: newCategory,
                slug: newCategory.toLowerCase().replace(/\s+/g, "-"),
            });

            const categorySlug = response.data.slug;
            setAvailableCategories([...availableCategories, categorySlug]);
            addCategory(categorySlug);
            setNewCategory("");
            toast.success("Category created successfully!");
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error("Failed to create category");
        }
    };

    const createNewTag = async () => {
        if (!newTag.trim()) return;

        try {
            const response = await axios.post("/api/admin/blog-tags", {
                name: newTag,
                slug: newTag.toLowerCase().replace(/\s+/g, "-"),
            });

            const tagSlug = response.data.slug;
            setAvailableTags([...availableTags, tagSlug]);
            addTag(tagSlug);
            setNewTag("");
            toast.success("Tag created successfully!");
        } catch (error) {
            console.error("Failed to create tag:", error);
            toast.error("Failed to create tag");
        }
    };

    const createNewAuthor = async () => {
        if (!newAuthor.name.trim()) return;

        try {
            const response = await axios.post("/api/admin/authors", {
                name: newAuthor.name,
                bio: newAuthor.bio || null,
                avatarUrl: newAuthor.avatarUrl || null,
            });

            const author = response.data;
            setAvailableAuthors([...availableAuthors, author]);
            form.setValue("authorName", author.name);
            setNewAuthor({ name: "", bio: "", avatarUrl: "" });
            setIsAuthorModalOpen(false);
            toast.success("Author created successfully!");
        } catch (error) {
            console.error("Failed to create author:", error);
            toast.error("Failed to create author");
        }
    };

    // Show loading or redirect if not authenticated
    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-600 mb-2">
                    Access Denied
                </h1>
                <p className="text-gray-600">
                    You don&apos;t have permission to access this page.
                </p>
                <Button onClick={() => router.push("/")} className="mt-4">
                    Go Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Edit Blog Post
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Update and manage your blog content with
                                advanced controls
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/blogs")}
                                className="flex items-center gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                View All Posts
                            </Button>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content Area */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Blog Content
                                        </CardTitle>
                                        <CardDescription>
                                            Update your blog post content with
                                            our advanced editor
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <Tabs
                                            value={activeTab}
                                            onValueChange={setActiveTab}
                                            className="w-full"
                                        >
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger
                                                    value="content"
                                                    className="flex items-center gap-2"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Content
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="seo"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Globe className="h-4 w-4" />
                                                    SEO
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="media"
                                                    className="flex items-center gap-2"
                                                >
                                                    <ImageIcon className="h-4 w-4" />
                                                    Media
                                                </TabsTrigger>
                                            </TabsList>

                                            {/* Content Tab */}
                                            <TabsContent
                                                value="content"
                                                className="space-y-6 mt-6"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-base font-semibold">
                                                                    Blog Title *
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter an engaging blog title..."
                                                                        className="text-lg"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    This will be
                                                                    the main
                                                                    headline of
                                                                    your blog
                                                                    post
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="slug"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-base font-semibold">
                                                                    URL Slug *
                                                                </FormLabel>
                                                                <div className="flex gap-2">
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="blog-post-url-slug"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const title =
                                                                                form.getValues(
                                                                                    "title"
                                                                                );
                                                                            if (
                                                                                title
                                                                            ) {
                                                                                const generatedSlug =
                                                                                    title
                                                                                        .toLowerCase()
                                                                                        .replace(
                                                                                            /[^\w\s-]/g,
                                                                                            ""
                                                                                        )
                                                                                        .replace(
                                                                                            /\s+/g,
                                                                                            "-"
                                                                                        )
                                                                                        .replace(
                                                                                            /-+/g,
                                                                                            "-"
                                                                                        )
                                                                                        .trim()
                                                                                        .replace(
                                                                                            /^-|-$/g,
                                                                                            ""
                                                                                        );
                                                                                form.setValue(
                                                                                    "slug",
                                                                                    generatedSlug,
                                                                                    {
                                                                                        shouldValidate:
                                                                                            true,
                                                                                    }
                                                                                );
                                                                            }
                                                                        }}
                                                                        disabled={
                                                                            !form.watch(
                                                                                "title"
                                                                            )
                                                                        }
                                                                        title="Generate slug from title"
                                                                    >
                                                                        <Wand2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <FormDescription>
                                                                    URL-friendly
                                                                    version of
                                                                    the title
                                                                    (auto-generated
                                                                    from title)
                                                                </FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="excerpt"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base font-semibold">
                                                                Excerpt
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Write a compelling summary of your blog post..."
                                                                    className="min-h-[100px] resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Brief summary
                                                                that appears in
                                                                blog listings
                                                                and previews
                                                                (max 500
                                                                characters)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="content"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base font-semibold">
                                                                Blog Content *
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Editor
                                                                    editorSerializedState={
                                                                        field.value
                                                                    }
                                                                    onSerializedChange={(
                                                                        serializedState
                                                                    ) => {
                                                                        field.onChange(
                                                                            serializedState
                                                                        );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Write your blog
                                                                content using
                                                                the advanced
                                                                editor with
                                                                formatting
                                                                options
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TabsContent>

                                            {/* SEO Tab */}
                                            <TabsContent
                                                value="seo"
                                                className="space-y-6 mt-6"
                                            >
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">
                                                        Search Engine
                                                        Optimization
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Optimize your blog post
                                                        for search engines
                                                    </p>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="seoTitle"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                SEO Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="SEO-optimized title for search engines..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Title that
                                                                appears in
                                                                search engine
                                                                results
                                                                (recommended:
                                                                50-60
                                                                characters)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="seoDescription"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Meta Description
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Brief description that appears in search engine results..."
                                                                    className="min-h-[80px] resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Description
                                                                shown in search
                                                                results
                                                                (recommended:
                                                                150-160
                                                                characters)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="seoKeywords"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Keywords
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="keyword1, keyword2, keyword3..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Comma-separated
                                                                keywords related
                                                                to your blog
                                                                post
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="canonicalUrl"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Canonical URL
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="https://example.com/canonical-url"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Canonical URL
                                                                for this blog
                                                                post to avoid
                                                                duplicate
                                                                content issues
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TabsContent>

                                            {/* Media Tab */}
                                            <TabsContent
                                                value="media"
                                                className="space-y-6 mt-6"
                                            >
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">
                                                        Media & Images
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Update cover image and
                                                        social media preview
                                                        image
                                                    </p>
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="coverImage"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Cover Image
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ImageUpload
                                                                    onChange={
                                                                        handleCoverImageUpload
                                                                    }
                                                                    value={
                                                                        coverImageFile
                                                                    }
                                                                    onFilesSelected={
                                                                        handleCoverImageFileSelect
                                                                    }
                                                                    maxFiles={1}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Main image that
                                                                represents your
                                                                blog post
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="coverImageAlt"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Cover Image Alt
                                                                Text
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Describe the cover image for accessibility..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Alt text for
                                                                cover image
                                                                accessibility
                                                                (screen readers)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="ogImage"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Social Share
                                                                Image (OG Image)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ImageUpload
                                                                    onChange={
                                                                        handleOgImageUpload
                                                                    }
                                                                    value={
                                                                        ogImageFile
                                                                    }
                                                                    onFilesSelected={
                                                                        handleOgImageFileSelect
                                                                    }
                                                                    maxFiles={1}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Image that
                                                                appears when
                                                                sharing on
                                                                social media
                                                                (recommended:
                                                                1200x630px)
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="ogImageAlt"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                OG Image Alt
                                                                Text
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Describe the OG image for accessibility..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Alt text for
                                                                social media
                                                                image
                                                                accessibility
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Author Dropdown */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Author & Publishing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="authorName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Author
                                                    </FormLabel>
                                                    <div className="flex gap-2">
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={field.value}
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select author" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {availableAuthors.map(
                                                                    (
                                                                        author
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                author.name
                                                                            }
                                                                            value={
                                                                                author.name
                                                                            }
                                                                        >
                                                                            {
                                                                                author.name
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        {field.value && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    field.onChange(
                                                                        ""
                                                                    );
                                                                    form.setValue(
                                                                        "authorName",
                                                                        ""
                                                                    );
                                                                }}
                                                                className="text-red-500 hover:text-red-700"
                                                                title="Clear selected author"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Dialog
                                                            open={
                                                                isAuthorModalOpen
                                                            }
                                                            onOpenChange={
                                                                setIsAuthorModalOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[525px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Manage
                                                                        Authors
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Create a
                                                                        new
                                                                        author
                                                                        profile
                                                                        or
                                                                        select
                                                                        from
                                                                        existing
                                                                        ones.
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                {/* Existing Authors */}
                                                                {availableAuthors.length >
                                                                    0 && (
                                                                    <div className="border rounded-lg p-4">
                                                                        <h4 className="font-medium mb-3">
                                                                            Existing
                                                                            Authors
                                                                        </h4>
                                                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                                                            {availableAuthors.map(
                                                                                (
                                                                                    author
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            author.name
                                                                                        }
                                                                                        className="flex items-center gap-3 text-sm"
                                                                                    >
                                                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                            {author.name
                                                                                                .charAt(
                                                                                                    0
                                                                                                )
                                                                                                .toUpperCase()}
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                            <div className="font-medium">
                                                                                                {
                                                                                                    author.name
                                                                                                }
                                                                                            </div>
                                                                                            {author.bio && (
                                                                                                <div className="text-gray-500 text-xs truncate">
                                                                                                    {
                                                                                                        author.bio
                                                                                                    }
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={async () => {
                                                                                                try {
                                                                                                    await axios.delete(
                                                                                                        `/api/admin/authors/${encodeURIComponent(
                                                                                                            author.name
                                                                                                        )}`
                                                                                                    );
                                                                                                    setAvailableAuthors(
                                                                                                        availableAuthors.filter(
                                                                                                            (
                                                                                                                a
                                                                                                            ) =>
                                                                                                                a.name !==
                                                                                                                author.name
                                                                                                        )
                                                                                                    );
                                                                                                    // If the removed author was selected, clear the selection
                                                                                                    if (
                                                                                                        form.getValues(
                                                                                                            "authorName"
                                                                                                        ) ===
                                                                                                        author.name
                                                                                                    ) {
                                                                                                        form.setValue(
                                                                                                            "authorName",
                                                                                                            ""
                                                                                                        );
                                                                                                    }
                                                                                                    toast.success(
                                                                                                        "Author removed successfully!"
                                                                                                    );
                                                                                                } catch (error) {
                                                                                                    console.error(
                                                                                                        "Failed to remove author:",
                                                                                                        error
                                                                                                    );
                                                                                                    toast.error(
                                                                                                        "Failed to remove author"
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                                                        >
                                                                                            <X className="h-3 w-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <Separator />

                                                                <div className="space-y-4">
                                                                    <h4 className="font-medium">
                                                                        Add New
                                                                        Author
                                                                    </h4>
                                                                    <div className="grid gap-4">
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="author-name">
                                                                                Author
                                                                                Name
                                                                                *
                                                                            </Label>
                                                                            <Input
                                                                                id="author-name"
                                                                                placeholder="Enter author name"
                                                                                value={
                                                                                    newAuthor.name
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setNewAuthor(
                                                                                        {
                                                                                            ...newAuthor,
                                                                                            name: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="author-bio">
                                                                                Bio
                                                                            </Label>
                                                                            <Textarea
                                                                                id="author-bio"
                                                                                placeholder="Brief bio about the author (optional)"
                                                                                value={
                                                                                    newAuthor.bio
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setNewAuthor(
                                                                                        {
                                                                                            ...newAuthor,
                                                                                            bio: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="resize-none"
                                                                            />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <Label htmlFor="author-avatar">
                                                                                Avatar
                                                                                URL
                                                                            </Label>
                                                                            <Input
                                                                                id="author-avatar"
                                                                                placeholder="https://example.com/avatar.jpg (optional)"
                                                                                value={
                                                                                    newAuthor.avatarUrl
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setNewAuthor(
                                                                                        {
                                                                                            ...newAuthor,
                                                                                            avatarUrl:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setIsAuthorModalOpen(
                                                                                false
                                                                            );
                                                                            setNewAuthor(
                                                                                {
                                                                                    name: "",
                                                                                    bio: "",
                                                                                    avatarUrl:
                                                                                        "",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={
                                                                            createNewAuthor
                                                                        }
                                                                        disabled={
                                                                            !newAuthor.name.trim()
                                                                        }
                                                                    >
                                                                        Create
                                                                        Author
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                    <FormDescription>
                                                        Choose the author for
                                                        this blog post or create
                                                        a new one
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Selected Author Display */}
                                        {form.watch("authorName") && (
                                            <div className="space-y-2">
                                                <Label>Selected Author</Label>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium">
                                                            {form.watch(
                                                                "authorName"
                                                            )}
                                                        </div>
                                                        {availableAuthors.find(
                                                            (author) =>
                                                                author.name ===
                                                                form.watch(
                                                                    "authorName"
                                                                )
                                                        )?.bio && (
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    availableAuthors.find(
                                                                        (
                                                                            author
                                                                        ) =>
                                                                            author.name ===
                                                                            form.watch(
                                                                                "authorName"
                                                                            )
                                                                    )?.bio
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "authorName",
                                                                ""
                                                            );
                                                        }}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                        title="Deselect author"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* PublishedAt Date Picker */}
                                        <FormField
                                            control={form.control}
                                            name="publishedAt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Published At
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="published"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base font-semibold">
                                                            Publish Post
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Make this blog post
                                                            visible to the
                                                            public
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="pt-4 space-y-3">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Updating Post...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Update Blog Post
                                                    </>
                                                )}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.back()}
                                                className="w-full"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Categories */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Hash className="h-5 w-5" />
                                            Categories
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Category Dropdown Selector */}
                                        <div className="space-y-2">
                                            <Label>Select Category</Label>
                                            <div className="flex gap-2">
                                                <Select
                                                    onValueChange={(value) => {
                                                        if (
                                                            value &&
                                                            !form
                                                                .watch(
                                                                    "categories"
                                                                )
                                                                .includes(value)
                                                        ) {
                                                            addCategory(value);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableCategories
                                                            .filter(
                                                                (cat) =>
                                                                    !form
                                                                        .watch(
                                                                            "categories"
                                                                        )
                                                                        .includes(
                                                                            cat
                                                                        )
                                                            )
                                                            .map((category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category
                                                                    }
                                                                    value={
                                                                        category
                                                                    }
                                                                >
                                                                    {category}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                {form.watch("categories")
                                                    .length > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "categories",
                                                                []
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Clear all categories"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[525px]">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Manage
                                                                Categories
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Create new
                                                                categories or
                                                                remove existing
                                                                ones.
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        {/* Existing Categories */}
                                                        {availableCategories.length >
                                                            0 && (
                                                            <div className="border rounded-lg p-4">
                                                                <h4 className="font-medium mb-3">
                                                                    Existing
                                                                    Categories
                                                                </h4>
                                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                                    {availableCategories.map(
                                                                        (
                                                                            category
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    category
                                                                                }
                                                                                className="flex items-center gap-3 text-sm"
                                                                            >
                                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                    <Hash className="h-3 w-3 text-blue-600" />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <div className="font-medium">
                                                                                        {
                                                                                            category
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={async () => {
                                                                                        try {
                                                                                            await axios.delete(
                                                                                                `/api/admin/blog-categories?slug=${encodeURIComponent(
                                                                                                    category
                                                                                                )}`
                                                                                            );
                                                                                            setAvailableCategories(
                                                                                                availableCategories.filter(
                                                                                                    (
                                                                                                        c
                                                                                                    ) =>
                                                                                                        c !==
                                                                                                        category
                                                                                                )
                                                                                            );
                                                                                            // Remove from selected categories if selected
                                                                                            const currentCategories =
                                                                                                form.getValues(
                                                                                                    "categories"
                                                                                                );
                                                                                            if (
                                                                                                currentCategories.includes(
                                                                                                    category
                                                                                                )
                                                                                            ) {
                                                                                                form.setValue(
                                                                                                    "categories",
                                                                                                    currentCategories.filter(
                                                                                                        (
                                                                                                            c
                                                                                                        ) =>
                                                                                                            c !==
                                                                                                            category
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                            toast.success(
                                                                                                "Category removed successfully!"
                                                                                            );
                                                                                        } catch (error) {
                                                                                            console.error(
                                                                                                "Failed to remove category:",
                                                                                                error
                                                                                            );
                                                                                            const errorMessage =
                                                                                                error instanceof
                                                                                                Error
                                                                                                    ? error.message
                                                                                                    : "Failed to remove category";
                                                                                            toast.error(
                                                                                                errorMessage
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <Separator />

                                                        <div className="space-y-4">
                                                            <h4 className="font-medium">
                                                                Add New Category
                                                            </h4>
                                                            <div className="grid gap-4">
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="category-name">
                                                                        Category
                                                                        Name *
                                                                    </Label>
                                                                    <Input
                                                                        id="category-name"
                                                                        placeholder="Enter category name"
                                                                        value={
                                                                            newCategory
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewCategory(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setNewCategory(
                                                                        ""
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                onClick={
                                                                    createNewCategory
                                                                }
                                                                disabled={
                                                                    !newCategory.trim()
                                                                }
                                                            >
                                                                Create Category
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>

                                        {/* Selected Categories */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>
                                                    Selected Categories (
                                                    {
                                                        form.watch("categories")
                                                            .length
                                                    }
                                                    )
                                                </Label>
                                                {form.watch("categories")
                                                    .length > 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "categories",
                                                                []
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 h-6 text-xs"
                                                    >
                                                        Clear All
                                                    </Button>
                                                )}
                                            </div>
                                            {form.watch("categories").length ===
                                            0 ? (
                                                <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md text-center">
                                                    No categories selected
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {form
                                                        .watch("categories")
                                                        .map((category) => (
                                                            <div
                                                                key={category}
                                                                className="flex items-center gap-3 p-3 bg-blue-50 rounded-md"
                                                            >
                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <Hash className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-blue-800">
                                                                        {
                                                                            category
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-blue-600">
                                                                        Category
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeCategory(
                                                                            category
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                                    title="Remove category"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Tags */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Hash className="h-5 w-5" />
                                            Tags
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Tag Dropdown Selector */}
                                        <div className="space-y-2">
                                            <Label>Select Tag</Label>
                                            <div className="flex gap-2">
                                                <Select
                                                    onValueChange={(value) => {
                                                        if (
                                                            value &&
                                                            !form
                                                                .watch("tags")
                                                                .includes(value)
                                                        ) {
                                                            addTag(value);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose a tag" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableTags
                                                            .filter(
                                                                (tag) =>
                                                                    !form
                                                                        .watch(
                                                                            "tags"
                                                                        )
                                                                        .includes(
                                                                            tag
                                                                        )
                                                            )
                                                            .map((tag) => (
                                                                <SelectItem
                                                                    key={tag}
                                                                    value={tag}
                                                                >
                                                                    {tag}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                {form.watch("tags").length >
                                                    0 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "tags",
                                                                []
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Clear all tags"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[525px]">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Manage Tags
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Create new tags
                                                                or remove
                                                                existing ones.
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        {/* Existing Tags */}
                                                        {availableTags.length >
                                                            0 && (
                                                            <div className="border rounded-lg p-4">
                                                                <h4 className="font-medium mb-3">
                                                                    Existing
                                                                    Tags
                                                                </h4>
                                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                                    {availableTags.map(
                                                                        (
                                                                            tag
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    tag
                                                                                }
                                                                                className="flex items-center gap-3 text-sm"
                                                                            >
                                                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                                                    <Hash className="h-3 w-3 text-green-600" />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <div className="font-medium">
                                                                                        {
                                                                                            tag
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={async () => {
                                                                                        try {
                                                                                            await axios.delete(
                                                                                                `/api/admin/blog-tags?slug=${encodeURIComponent(
                                                                                                    tag
                                                                                                )}`
                                                                                            );
                                                                                            setAvailableTags(
                                                                                                availableTags.filter(
                                                                                                    (
                                                                                                        t
                                                                                                    ) =>
                                                                                                        t !==
                                                                                                        tag
                                                                                                )
                                                                                            );
                                                                                            // Remove from selected tags if selected
                                                                                            const currentTags =
                                                                                                form.getValues(
                                                                                                    "tags"
                                                                                                );
                                                                                            if (
                                                                                                currentTags.includes(
                                                                                                    tag
                                                                                                )
                                                                                            ) {
                                                                                                form.setValue(
                                                                                                    "tags",
                                                                                                    currentTags.filter(
                                                                                                        (
                                                                                                            t
                                                                                                        ) =>
                                                                                                            t !==
                                                                                                            tag
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                            toast.success(
                                                                                                "Tag removed successfully!"
                                                                                            );
                                                                                        } catch (error) {
                                                                                            console.error(
                                                                                                "Failed to remove tag:",
                                                                                                error
                                                                                            );
                                                                                            const errorMessage =
                                                                                                error instanceof
                                                                                                Error
                                                                                                    ? error.message
                                                                                                    : "Failed to remove tag";
                                                                                            toast.error(
                                                                                                errorMessage
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <Separator />

                                                        <div className="space-y-4">
                                                            <h4 className="font-medium">
                                                                Add New Tag
                                                            </h4>
                                                            <div className="grid gap-4">
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="tag-name">
                                                                        Tag Name
                                                                        *
                                                                    </Label>
                                                                    <Input
                                                                        id="tag-name"
                                                                        placeholder="Enter tag name"
                                                                        value={
                                                                            newTag
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewTag(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setNewTag(
                                                                        ""
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                onClick={
                                                                    createNewTag
                                                                }
                                                                disabled={
                                                                    !newTag.trim()
                                                                }
                                                            >
                                                                Create Tag
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>

                                        {/* Selected Tags */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>
                                                    Selected Tags (
                                                    {form.watch("tags").length})
                                                </Label>
                                                {form.watch("tags").length >
                                                    0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "tags",
                                                                []
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 h-6 text-xs"
                                                    >
                                                        Clear All
                                                    </Button>
                                                )}
                                            </div>
                                            {form.watch("tags").length === 0 ? (
                                                <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md text-center">
                                                    No tags selected
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {form
                                                        .watch("tags")
                                                        .map((tag) => (
                                                            <div
                                                                key={tag}
                                                                className="flex items-center gap-3 p-3 bg-green-50 rounded-md"
                                                            >
                                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                                    <Hash className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-green-800">
                                                                        {tag}
                                                                    </div>
                                                                    <div className="text-xs text-green-600">
                                                                        Tag
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeTag(
                                                                            tag
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                                    title="Remove tag"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/blogs")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {form.watch("published")
                                            ? "Update & Publish"
                                            : "Save Changes"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

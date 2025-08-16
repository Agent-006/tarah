"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter as HighlightIcon,
  Undo,
  Redo,
  Eye,
  Plus,
  X,
  Upload,
  Hash,
  FileText,
  Globe,
  Calendar,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

// Enhanced Schema definition matching Prisma schema
const backlinkSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  text: z.string().min(1, "Link text is required"),
});

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
  content: z.string().min(1, "Content is required"),
  excerpt: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  coverImage: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),

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

  // Relationships
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  backlinks: z.array(backlinkSchema),

  // Publishing
  published: z.boolean(),
  publishedAt: z.string().optional(),
});

type BlogFormData = z.infer<typeof formSchema>;

// Advanced Tiptap Editor Component
const AdvancedTiptapEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Bold,
      Italic,
      Strike,
      Underline,
      Code,
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-4 rounded-md font-mono text-sm",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-300 pl-4 italic",
        },
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter link URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  if (!editor) {
    return (
      <div className="animate-pulse bg-gray-100 h-96 rounded-md flex items-center justify-center">
        <span>Loading advanced editor...</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Advanced Toolbar */}
      <div className="bg-gray-50 border-b p-3">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Select
              value={
                editor.isActive("heading", { level: 1 })
                  ? "h1"
                  : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : editor.isActive("heading", { level: 3 })
                  ? "h3"
                  : editor.isActive("paragraph")
                  ? "p"
                  : "p"
              }
              onValueChange={(value) => {
                if (value === "p") {
                  editor.chain().focus().setParagraph().run();
                } else if (value === "h1") {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                } else if (value === "h2") {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                } else if (value === "h3") {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                }
              }}
            >
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p">Paragraph</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Style */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bold") ? "bg-gray-200" : ""
              }`}
            >
              <BoldIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("italic") ? "bg-gray-200" : ""
              }`}
            >
              <ItalicIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("underline") ? "bg-gray-200" : ""
              }`}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("strike") ? "bg-gray-200" : ""
              }`}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("highlight") ? "bg-gray-200" : ""
              }`}
            >
              <HighlightIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bulletList") ? "bg-gray-200" : ""
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("orderedList") ? "bg-gray-200" : ""
              }`}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("blockquote") ? "bg-gray-200" : ""
              }`}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("code") ? "bg-gray-200" : ""
              }`}
            >
              <CodeIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
              }`}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`h-8 w-8 p-0 ${
                editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
              }`}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
              }`}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Media & Links */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addLink}
              className={`h-8 w-8 p-0 ${
                editor.isActive("link") ? "bg-gray-200" : ""
              }`}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addImage}
              className="h-8 w-8 p-0"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTable}
              className="h-8 w-8 p-0"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default function CreateBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  // Redirect customers to home page
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "CUSTOMER") {
      router.replace("/");
    }
  }, [status, session?.user?.role, router]);

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          axios.get("/api/admin/blog-categories"),
          axios.get("/api/admin/blog-tags"),
        ]);
        setAvailableCategories(
          categoriesRes.data.map((cat: { slug: string }) => cat.slug)
        );
        setAvailableTags(tagsRes.data.map((tag: { slug: string }) => tag.slug));
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
      content: "<p>Start writing your blog content here...</p>",
      excerpt: "",
      coverImage: "",
      ogImage: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      categories: [],
      tags: [],
      backlinks: [],
      published: false,
    },
  });

  const {
    fields: backlinkFields,
    append: appendBacklink,
    remove: removeBacklink,
  } = useFieldArray({
    control: form.control,
    name: "backlinks",
  });

  // State for image uploads
  const [coverImageFile, setCoverImageFile] = useState<string[]>([]);
  const [ogImageFile, setOgImageFile] = useState<string[]>([]);

  // UploadThing hooks
  const { startUpload } = useUploadThing("imageUploader");

  // Image upload handlers
  const handleCoverImageUpload = async (urls: string[]) => {
    setCoverImageFile(urls);
    form.setValue("coverImage", urls[0] || ""); // Take first URL for single image
  };

  const handleOgImageUpload = async (urls: string[]) => {
    setOgImageFile(urls);
    form.setValue("ogImage", urls[0] || ""); // Take first URL for single image
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

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  const watchCoverImage = form.watch("coverImage");
  const watchOgImage = form.watch("ogImage");

  useEffect(() => {
    if (watchTitle && !form.getValues("slug")) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, form]);

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

      const blogData = {
        ...values,
        content: JSON.parse(JSON.stringify(values.content)), // Ensure JSON serializable
        publishedAt: values.published ? new Date().toISOString() : null,
        authorId: session?.user?.id,
      };

      console.log("Submitting blog data:", blogData);

      const response = await axios.post("/api/admin/blogs", blogData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Blog created:", response.data);
      toast.success("Blog post created successfully!");
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Failed to create blog post:", error);
      let errorMessage = "Failed to create blog post";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
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

  // Show loading or redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
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
                Create New Blog Post
              </h1>
              <p className="text-gray-600 text-lg">
                Write and publish professional blog content with advanced
                controls
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      Create your blog post content with our advanced editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-4">
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
                        <TabsTrigger
                          value="links"
                          className="flex items-center gap-2"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Backlinks
                        </TabsTrigger>
                      </TabsList>

                      {/* Content Tab */}
                      <TabsContent value="content" className="space-y-6 mt-6">
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
                                  This will be the main headline of your blog
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
                                <FormControl>
                                  <Input
                                    placeholder="blog-post-url-slug"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  URL-friendly version of the title
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
                                Brief summary that appears in blog listings and
                                previews (max 500 characters)
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
                                <AdvancedTiptapEditor
                                  content={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormDescription>
                                Write your blog content using the advanced
                                editor with formatting options
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      {/* SEO Tab */}
                      <TabsContent value="seo" className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            Search Engine Optimization
                          </h3>
                          <p className="text-gray-600">
                            Optimize your blog post for search engines
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="seoTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SEO Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="SEO-optimized title for search engines..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Title that appears in search engine results
                                (recommended: 50-60 characters)
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
                              <FormLabel>Meta Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Brief description that appears in search engine results..."
                                  className="min-h-[80px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Description shown in search results
                                (recommended: 150-160 characters)
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
                              <FormLabel>Keywords</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="keyword1, keyword2, keyword3..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Comma-separated keywords related to your blog
                                post
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      {/* Media Tab */}
                      <TabsContent value="media" className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            Media & Images
                          </h3>
                          <p className="text-gray-600">
                            Add cover image and social media preview image
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="coverImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Image</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  onChange={handleCoverImageUpload}
                                  value={coverImageFile}
                                  onFilesSelected={handleCoverImageFileSelect}
                                  maxFiles={1}
                                />
                              </FormControl>
                              <FormDescription>
                                Main image that represents your blog post
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ogImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Social Share Image (OG Image)
                              </FormLabel>
                              <FormControl>
                                <ImageUpload
                                  onChange={handleOgImageUpload}
                                  value={ogImageFile}
                                  onFilesSelected={handleOgImageFileSelect}
                                  maxFiles={1}
                                />
                              </FormControl>
                              <FormDescription>
                                Image that appears when sharing on social media
                                (recommended: 1200x630px)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      {/* Backlinks Tab */}
                      <TabsContent value="links" className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">
                                Backlinks
                              </h3>
                              <p className="text-gray-600">
                                Manage external links and references
                              </p>
                            </div>
                            <Button
                              type="button"
                              onClick={() =>
                                appendBacklink({
                                  url: "",
                                  text: "",
                                })
                              }
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Backlink
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {backlinkFields.map((field, index) => (
                            <Card key={field.id} className="p-4">
                              <div className="flex gap-4 items-end">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                  <FormField
                                    control={form.control}
                                    name={`backlinks.${index}.url`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="https://example.com"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`backlinks.${index}.text`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Link Text</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Link description"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeBacklink(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}

                          {backlinkFields.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No backlinks added yet</p>
                              <p className="text-sm">
                                Click &quot;Add Backlink&quot; to add external
                                references
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Publishing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                              Make this blog post visible to the public
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
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
                            Creating Post...
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            Create Blog Post
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
                    <div className="flex flex-wrap gap-2">
                      {form.watch("categories").map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {category}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeCategory(category)}
                          />
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Add Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableCategories
                          .filter(
                            (cat) => !form.watch("categories").includes(cat)
                          )
                          .map((category) => (
                            <Button
                              key={category}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addCategory(category)}
                            >
                              {category}
                            </Button>
                          ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Create New Category</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Category name"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={createNewCategory}
                          size="sm"
                          disabled={!newCategory.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
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
                    <div className="flex flex-wrap gap-2">
                      {form.watch("tags").map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Add Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableTags
                          .filter((tag) => !form.watch("tags").includes(tag))
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTag(tag)}
                            >
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Create New Tag</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tag name"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={createNewTag}
                          size="sm"
                          disabled={!newTag.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

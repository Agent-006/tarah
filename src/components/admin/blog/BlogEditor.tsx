"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getImageUrl } from "@/lib/uploadthing";
import { ImageUploader } from "./ImageUploader";
import { PortableText } from "@/components/blog/PortableTextComponents";
import {
    BlogPostWithRelations,
    useAdminBlogStore,
} from "@/store/admin/adminBlogStore";

export function BlogEditor({ post }: { post?: BlogPostWithRelations }) {
    const { createPost, updatePost, isLoading } = useAdminBlogStore();
    const [title, setTitle] = useState(post?.title || "");
    const [content, setContent] = useState(post?.content || []);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [removeCoverImage, setRemoveCoverImage] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            coverImage: coverImage || undefined,
            ...(post && removeCoverImage && { removeCoverImage: true }),
        };

        if (post) {
            await updatePost(post.id, postData);
        } else {
            await createPost(postData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>Cover Image</Label>
                <ImageUploader
                    onUpload={(file) => setCoverImage(file)}
                    currentImage={
                        post?.coverImageKey
                            ? getImageUrl(post.coverImageKey)
                            : undefined
                    }
                    onRemove={() => {
                        if (post?.coverImageKey) {
                            setRemoveCoverImage(true);
                        }
                        setCoverImage(null);
                    }}
                />
            </div>

            <div>
                <Label>Content</Label>
                {/* Replace with your actual rich text editor component */}
                <div className="border rounded-md p-4 min-h-[300px]">
                    <PortableText value={content} />
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Post"}
            </Button>
        </form>
    );
}

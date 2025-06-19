"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    adminProductsSchema,
    TAdminProductsSchema,
} from "@/schemas/adminSchema/adminProductsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageUpload } from "../image-upload";
import { useUploadThing } from "@/lib/uploadthing";

export function ProductForm({
    initialData,
    onSubmit,
}: {
    initialData?: Partial<TAdminProductsSchema>;
    onSubmit: (value: TAdminProductsSchema) => Promise<void>;
}) {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const { startUpload } = useUploadThing("imageUploader");

    const form = useForm<TAdminProductsSchema>({
        resolver: zodResolver(
            adminProductsSchema
        ) as Resolver<TAdminProductsSchema>,
        defaultValues: {
            published: false,
            featured: false,
            ...initialData,
            images: initialData?.images || [],
        },
    });

    const handleImageUpload = async (files: File[]) => {
        setUploading(true);
        try {
            const res = await startUpload(files);
            if (res) {
                const newUrls = res.map((file) => file.url);
                const currentUrls = form.getValues("images") || [];
                form.setValue("images", [...currentUrls, ...newUrls]);
                toast.success("Images uploaded successfully!");
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Image upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (url: string) => {
        form.setValue(
            "images",
            form.getValues().images.filter((img) => img !== url)
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter product name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="product-slug"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Product description"
                                        rows={5}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="discountedPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discounted Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value)
                                            )
                                        }
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
                                    <FormLabel>Published</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Featured</FormLabel>
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
                </div>

                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onUpload={(urls) => field.onChange(urls)}
                                    onRemove={(url) => {
                                        const newUrls = field.value.filter(
                                            (u) => u !== url
                                        );
                                        field.onChange(newUrls);
                                    }}
                                    disabled={
                                        uploading ||
                                        form.formState.isSubmitting
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <span className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </span>
                        ) : initialData ? (
                            "Update Product"
                        ) : (
                            "Create Product"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

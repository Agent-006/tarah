// components/admin/products/product-form.tsx
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
import { useCategories } from "@/hooks/use-categories";
import axios from "axios";
import { MultiSelect } from "@/components/ui/multi-select";
import { VariantForm } from "./variant-form";

interface ProductFormProps {
    initialData?: TAdminProductsSchema;
    onSubmit: (data: TAdminProductsSchema) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
    const router = useRouter();
    const [uploading, setUploading] = useState<{
        variantIndex: number;
        imageIndex: number;
    } | null>(null);
    const { startUpload } = useUploadThing("imageUploader");

    const { data: categories = [], isLoading: categoriesLoading } =
        useCategories();

    const form = useForm<TAdminProductsSchema>({
        resolver: zodResolver(
            adminProductsSchema
        ) as Resolver<TAdminProductsSchema>,
        defaultValues: initialData || {
            name: "",
            slug: "",
            description: "",
            basePrice: 0,
            discountedPrice: undefined,
            categories: [],
            attributes: [],
            variants: [
                {
                    name: "Default",
                    sku: "",
                    priceOffset: 0,
                    attributes: [],
                    images: [
                        { url: "", altText: "", isPrimary: true, order: 0 },
                        { url: "", altText: "", isPrimary: false, order: 1 },
                        { url: "", altText: "", isPrimary: false, order: 2 },
                        { url: "", altText: "", isPrimary: false, order: 3 },
                    ],
                    inventory: {
                        stock: 0,
                        lowStockThreshold: 5,
                    },
                },
            ],
            published: false,
            featured: false,
        },
    });

    const handleImageUpload = async (
        files: File[],
        variantIndex: number,
        imageIndex: number
    ) => {
        setUploading({ variantIndex, imageIndex });
        try {
            const res = await startUpload(files);
            if (res && res[0]) {
                const currentVariants = [...form.getValues("variants")];
                currentVariants[variantIndex].images[imageIndex] = {
                    ...currentVariants[variantIndex].images[imageIndex],
                    url: res[0].url,
                    // Add alt text if you want
                    altText:
                        files[0].name.split(".")[0] ||
                        `Variant Image ${imageIndex + 1}`,
                };
                form.setValue("variants", currentVariants);
                toast.success("Image uploaded successfully!");
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Image upload failed. Please try again.");
        } finally {
            setUploading(null);
        }
    };

    const removeImage = async (variantIndex: number, imageIndex: number) => {
        try {
            const currentVariants = [...form.getValues("variants")];
            const imageToRemove =
                currentVariants[variantIndex].images[imageIndex];

            if (imageToRemove.url) {
                // Extract file key from URL
                const url = new URL(imageToRemove.url);
                const fileKey = url.pathname.split("/").pop() || "";

                // Call our deletion endpoint
                await axios.post("/api/delete-image", { fileKey });

                // Update local state
                currentVariants[variantIndex].images[imageIndex] = {
                    ...imageToRemove,
                    url: "",
                };

                form.setValue("variants", currentVariants);
                toast.success("Image removed successfully!");
            }
        } catch (error) {
            console.error("Failed to remove image:", error);
            toast.error("Failed to remove image. Please try again.");
        }
    };

    const handleSubmit = async (data: TAdminProductsSchema) => {
        try {
            await onSubmit(data);
            toast.success(
                initialData
                    ? "Product updated successfully!"
                    : "Product created successfully!"
            );
            router.push("/admin/products");
        } catch (error) {
            toast.error("Failed to save product. Please try again.");
            console.error(error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                {form.formState.errors.root && (
                    <div className="text-red-500 text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Basic Fields */}
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
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === ""
                                                    ? undefined
                                                    : parseFloat(e.target.value)
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
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === ""
                                                    ? undefined
                                                    : parseFloat(e.target.value)
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
                        name="categories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categories</FormLabel>
                                <FormControl>
                                    {categoriesLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Loading categories...</span>
                                        </div>
                                    ) : (
                                        <MultiSelect
                                            options={categories.map(
                                                (category) => ({
                                                    value: category.id,
                                                    label: category.name,
                                                })
                                            )}
                                            selected={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select categories..."
                                        />
                                    )}
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

                {/* Variants Section */}
                <VariantForm
                    onImageUpload={handleImageUpload}
                    onImageRemove={removeImage}
                    uploading={uploading}
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

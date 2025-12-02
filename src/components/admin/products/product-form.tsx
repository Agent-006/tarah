// components/admin/products/product-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { MultiSelect } from "@/components/ui/multi-select";
import { CategoryMultiSelect } from "./category-multi-select";
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
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { useCategories } from "@/hooks/use-categories";
import {
  adminProductsSchema,
  TAdminProductsSchema,
} from "@/schemas/adminSchema/adminProductsSchema";
import { Switch } from "@/components/ui/switch";

import { ImageUpload } from "../image-upload";

import { VariantForm } from "./variant-form";
import { ProductAttributeForm } from "./product-attribute-form";

interface ProductFormProps {
  initialData?: TAdminProductsSchema;
  onSubmit: (data: TAdminProductsSchema) => Promise<void>;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingVariant, setUploadingVariant] = useState<{
    variantIndex: number;
    imageIndex: number;
  } | null>(null);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<TAdminProductsSchema>({
    resolver: zodResolver(
      adminProductsSchema
    ) as Resolver<TAdminProductsSchema>,
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      coverImage: [],
      basePrice: 0,
      discountedPrice: 0,
      categories: [],
      variants: [
        {
          name: "",
          sku: "",
          priceOffset: 0,
          variantAttributes: [],
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
      attributes: [],
      published: false,
      featured: false,
    },
    mode: "onSubmit", // Change to onSubmit to avoid immediate validation
  });

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    if (!initialData) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  };

  const handleCoverImageUpload = async (files: File[]) => {
    if (!files.length) return;

    try {
      setUploadingCoverImage(true);
      const uploadedFiles = await startUpload(files);

      if (uploadedFiles && uploadedFiles[0]) {
        const newImage = {
          url: uploadedFiles[0].url,
          altText: form.getValues("name") || "Product cover image",
          isPrimary: true,
          order: 0,
        };

        // Put the new image at the first position
        const currentCoverImages = form.getValues("coverImage") || [];
        const updatedCoverImages = [newImage, ...currentCoverImages.slice(1)];

        form.setValue("coverImage", updatedCoverImages);
        toast.success("Cover image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload cover image");
      console.error("Upload error:", error);
    } finally {
      setUploadingCoverImage(false);
    }
  };

  const handleCoverImageRemove = async () => {
    const currentCoverImages = form.getValues("coverImage") || [];
    // Remove the first image (cover image)
    const updatedCoverImages = currentCoverImages.slice(1);
    form.setValue("coverImage", updatedCoverImages);
    toast.success("Cover image removed");
  };

  const handleImageUpload = async (
    files: File[],
    variantIndex: number,
    imageIndex: number
  ) => {
    if (!files.length) return;

    try {
      setUploadingVariant({ variantIndex, imageIndex });
      const uploadedFiles = await startUpload(files);

      if (uploadedFiles && uploadedFiles[0]) {
        const currentVariants = form.getValues("variants");
        currentVariants[variantIndex].images[imageIndex] = {
          ...currentVariants[variantIndex].images[imageIndex],
          url: uploadedFiles[0].url,
        };
        form.setValue("variants", currentVariants);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    } finally {
      setUploadingVariant(null);
    }
  };

  const handleImageRemove = async (
    variantIndex: number,
    imageIndex: number
  ) => {
    const currentVariants = form.getValues("variants");
    currentVariants[variantIndex].images[imageIndex] = {
      ...currentVariants[variantIndex].images[imageIndex],
      url: "",
    };
    form.setValue("variants", currentVariants);
    toast.success("Image removed");
  };

  const handleSubmit = async (data: TAdminProductsSchema) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting product data:", data);
      await onSubmit(data);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create hierarchical category options with better formatting
  const categoryOptions = (categories || [])
    .map((category) => {
      // Format the display label with hierarchy
      const label = category.parent
        ? `${category.parent.name} → ${category.name}`
        : category.name;

      return {
        value: category.id,
        label: label,
        description: category.description || undefined,
        parent: category.parent?.name,
        featured: category.featured,
      };
    })
    .sort((a, b) => {
      // Sort by parent first, then by name
      if (a.parent && b.parent) {
        if (a.parent !== b.parent) {
          return a.parent.localeCompare(b.parent);
        }
      } else if (a.parent && !b.parent) {
        return 1;
      } else if (!a.parent && b.parent) {
        return -1;
      }
      return a.label.localeCompare(b.label);
    });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(handleSubmit)(e);
        }}
        className="space-y-8"
      >
        {/* Basic Product Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter product name"
                    onChange={(e) => {
                      field.onChange(e);
                      handleNameChange(e.target.value);
                    }}
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
                    {...field}
                    placeholder="product-slug"
                    disabled={!!initialData}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter product description"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image *</FormLabel>
              <FormControl>
                <ImageUpload
                  value={
                    field.value && field.value[0]?.url
                      ? [field.value[0].url]
                      : []
                  }
                  onChange={(urls) => {
                    if (urls.length > 0) {
                      const newImage = {
                        url: urls[0],
                        altText:
                          form.getValues("name") || "Product cover image",
                        isPrimary: true,
                        order: 0,
                      };
                      // Put the new image at the first position
                      const currentImages = field.value || [];
                      const updatedImages = [
                        newImage,
                        ...currentImages.slice(1),
                      ];
                      field.onChange(updatedImages);
                    } else {
                      // Remove the first image if no URL
                      const currentImages = field.value || [];
                      const updatedImages = currentImages.slice(1);
                      field.onChange(updatedImages);
                    }
                  }}
                  onRemove={handleCoverImageRemove}
                  disabled={uploadingCoverImage}
                  maxFiles={1}
                  onFilesSelected={handleCoverImageUpload}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Upload a cover image for this product. This will be displayed as
                the main product image.{" "}
                <span className="text-red-500">*Required</span>
              </p>
            </FormItem>
          )}
        />

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="1" placeholder="0" />
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
                <FormLabel>Discounted Price (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="1" placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Categories */}
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Product Categories
              </FormLabel>
              <FormControl>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading categories...
                  </div>
                ) : categoriesError ? (
                  <div className="flex items-center p-4 border border-red-200 rounded-md bg-red-50">
                    <span className="text-red-600 text-sm">
                      {categoriesError?.includes("sign in") ? (
                        <>
                          <strong>Authentication Required:</strong>
                          <br />
                          Please sign in as an admin to load categories.
                        </>
                      ) : (
                        <>Error loading categories: {categoriesError}</>
                      )}
                    </span>
                  </div>
                ) : (
                  <CategoryMultiSelect
                    options={categoryOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select categories for this product"
                  />
                )}
              </FormControl>
              <div className="text-sm text-muted-foreground">
                Choose one or more categories to help customers find this
                product. Featured categories are marked with a tag icon.
                {categories.length === 0 && !categoriesLoading && (
                  <span className="block mt-1 text-amber-600">
                    No categories available. Please create categories first in
                    the admin panel.
                  </span>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Make this product visible to customers
                  </div>
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
                  <FormLabel className="text-base">Featured</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Show this product in featured sections
                  </div>
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

        {/* Debug: Show form errors if any */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-semibold mb-2">
              Form Validation Errors:
            </h4>
            <pre className="text-red-700 text-sm overflow-auto">
              {JSON.stringify(form.formState.errors, null, 2)}
            </pre>
          </div>
        )}

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ProductAttributeForm control={form.control as any} />
        {/* Variants Section */}
        <div className="space-y-4">
          <VariantForm
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            uploading={uploadingVariant}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
            onClick={() => {}}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Product" : "Create Product"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash } from "lucide-react";
import { ImageUpload } from "../image-upload";
import { ProductAttributeForm } from "./variant-attribute-form";
import { TAdminProductsSchema } from "@/schemas/adminSchema/adminProductsSchema";

interface VariantFormProps {
  onImageUpload: (
    files: File[],
    variantIndex: number,
    imageIndex: number
  ) => Promise<void>;
  onImageRemove: (variantIndex: number, imageIndex: number) => Promise<void>;
  uploading?: { variantIndex: number; imageIndex: number } | null;
}

export const VariantForm: React.FC<VariantFormProps> = ({
  onImageUpload,
  onImageRemove,
  uploading,
}) => {
  const { control } = useFormContext<TAdminProductsSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const addNewVariant = () => {
    append({
      name: "",
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
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Variants</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewVariant}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {fields.map((field, variantIndex) => {
        // Get the current variant data
        const variant = control._formValues.variants[variantIndex];

        return (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Variant {variantIndex + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(variantIndex)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`variants.${variantIndex}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Size, Color"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${variantIndex}.sku`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Unique stock keeping unit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${variantIndex}.priceOffset`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Adjustment</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${variantIndex}.inventory.stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`variants.${variantIndex}.inventory.lowStockThreshold`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <h4 className="font-medium text-sm">Variant Atributes</h4>
            <ProductAttributeForm control={control} /> */}

            {/* Variant Images */}
            <div className="space-y-4">
              <FormLabel>Variant Images</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {variant.images.map((_: any, imageIndex: number) => (
                  <FormField
                    key={imageIndex}
                    control={control}
                    name={`variants.${variantIndex}.images.${imageIndex}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {imageIndex === 0
                            ? "Primary Image (Required)"
                            : `Additional Image ${imageIndex}`}
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value?.url ? [field.value.url] : []}
                            onChange={(urls) => {
                              const updatedValue = {
                                ...field.value,
                                url: urls[0] || "",
                              };
                              field.onChange(updatedValue);
                            }}
                            onRemove={async () => {
                              await onImageRemove(variantIndex, imageIndex);
                            }}
                            disabled={
                              uploading?.variantIndex === variantIndex &&
                              uploading?.imageIndex === imageIndex
                            }
                            maxFiles={1}
                            onFilesSelected={async (files) => {
                              if (files.length > 0) {
                                await onImageUpload(
                                  files,
                                  variantIndex,
                                  imageIndex
                                );
                              }
                            }}
                          />
                        </FormControl>
                        {imageIndex === 0 && !field.value?.url && (
                          <FormMessage>Primary image is required</FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

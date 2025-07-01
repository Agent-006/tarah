// components/admin/products/product-attribute-form.tsx
"use client";

import { useFieldArray } from "react-hook-form";
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

interface ProductAttributeFormProps {
    control: any;
}

export const ProductAttributeForm: React.FC<ProductAttributeFormProps> = ({
    control,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "attributes",
    });

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <FormField
                        control={control}
                        name={`attributes.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Material, Brand"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`attributes.${index}.value`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Cotton, Nike"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-end">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", value: "" })}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Product Attribute
            </Button>
        </div>
    );
};


"use client";
import { useFieldArray, Control, FieldValues } from "react-hook-form";
import { Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface VariantAttributeFormProps<T extends FieldValues = FieldValues> {
    control: Control<T>;
    namePrefix: string;
}

export const VariantAttributeForm = <T extends FieldValues = FieldValues>({
    control,
    namePrefix,
}: VariantAttributeFormProps<T>) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: namePrefix as import("react-hook-form").ArrayPath<T>,
    });


    const addNewAttribute = () => {
        append({ name: "", value: "" } as any);
    };

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <FormField
                        control={control}
                        name={`${namePrefix}.${index}.name` as import("react-hook-form").Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Size, Color"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`${namePrefix}.${index}.value` as import("react-hook-form").Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. M, Red"
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
                onClick={addNewAttribute}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant Attribute
            </Button>
        </div>
    );
};

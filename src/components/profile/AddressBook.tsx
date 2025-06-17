"use client";

import {
    addressSchema,
    TAddressSchema,
} from "@/schemas/userSchema/addressSchema";
import { useAddressStore } from "@/store/addressStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const AddressBook = () => {
    const {
        addresses,
        isLoading,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        fetchAddresses,
    } = useAddressStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<{
        id: string;
        data: TAddressSchema;
    } | null>(null);

    const form = useForm<TAddressSchema>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            isDefault: false,
        },
    });

    useEffect(() => {
        if (editingAddress) {
            form.reset(editingAddress.data);
        }

        form.reset({
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            isDefault: false,
        });
    }, [editingAddress, form]);

    const handleSubmit = async (data: TAddressSchema) => {
        try {
            if (editingAddress) {
                await updateAddress(editingAddress.id, data);
                toast.success("Address updated successfully!");
            } else {
                await addAddress(data);
                toast.success("Address added successfully!");
            }
            setIsDialogOpen(false);
            setEditingAddress(null);
        } catch (error) {
            toast.error(
                "An error occurred while saving the address. Please try again."
            );
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAddress(id);
            toast.success("Address deleted successfully!");
        } catch (error) {
            toast.error(
                "An error occurred while deleting the address. Please try again."
            );
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultAddress(id);
            toast.success("Default address updated successfully!");
        } catch (error) {
            toast.error(
                "An error occurred while setting the default address. Please try again."
            );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Address Book</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Add New Address</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress
                                    ? "Edit Address"
                                    : "Add New Address"}
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Street address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="City"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="State"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="postalCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Postal Code
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Postal code"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Country"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="isDefault"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                            </FormControl>
                                            <FormLabel className="!mt-0">
                                                Set as default address
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            setEditingAddress(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading
                                            ? "Saving..."
                                            : "Save Address"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {addresses.map((address) => (
                        <TableRow key={address.id}>
                            <TableCell>
                                <div className="font-medium">
                                    {address.street}, {address.city},{" "}
                                    {address.state} {address.postalCode},{" "}
                                    {address.country}
                                </div>
                            </TableCell>
                            <TableCell>
                                {address.isDefault ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Default
                                    </span>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleSetDefault(address.id)
                                        }
                                        disabled={isLoading}
                                    >
                                        Set as Default
                                    </Button>
                                )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEditingAddress({
                                            id: address.id,
                                            data: {
                                                street: address.street,
                                                city: address.city,
                                                state: address.state,
                                                postalCode: address.postalCode,
                                                country: address.country,
                                                isDefault: address.isDefault,
                                            },
                                        });
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(address.id)}
                                    disabled={isLoading || address.isDefault}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {addresses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No addresses found. Add your first address.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AddressBook;

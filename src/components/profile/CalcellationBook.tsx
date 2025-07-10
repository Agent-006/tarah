// components/profile/CancellationBook.tsx
"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useOrderStore } from "@/store/user/orderStore";

const CancellationBook = () => {
    const { orders, isLoading, error, fetchOrders } = useOrderStore();

    React.useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const cancelledOrders = orders.filter(
        (order) => order.status === "CANCELLED"
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchOrders}>Retry</Button>
            </div>
        );
    }

    if (cancelledOrders.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">
                    You haven&apos;t cancelled any orders yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {cancelledOrders.map((order) => (
                <Card key={order.id}>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>
                                Order #{order.id.slice(0, 8).toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                {format(
                                    new Date(order.createdAt),
                                    "MMMM d, yyyy"
                                )}
                            </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            CANCELLED
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-20">
                                        <Image
                                            src={
                                                item.variant.product.images[0]
                                                    ?.url ||
                                                "/placeholder-product.jpg"
                                            }
                                            alt={item.variant.product.name}
                                            fill
                                            className="rounded-md object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">
                                            {item.variant.product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x Rs.{" "}
                                            {item.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Variant: {item.variant.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                        <p className="font-medium">
                            Total: Rs. {order.totalAmount.toFixed(2)}
                        </p>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default CancellationBook;

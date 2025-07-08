// components/profile/ReturnBook.tsx
"use client";

import React from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStore } from "@/store/user/orderStore";

const ReturnBook = () => {
    const { returns, isLoading, error, fetchReturns } = useOrderStore();

    React.useEffect(() => {
        fetchReturns();
    }, [fetchReturns]);

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
                <Button onClick={fetchReturns}>Retry</Button>
            </div>
        );
    }

    if (returns.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">
                    You haven&apos;t requested any returns yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {returns.map((refund) => (
                <Card key={refund.id}>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>
                                Return #{refund.id.slice(0, 8).toUpperCase()}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                {format(
                                    new Date(refund.createdAt),
                                    "MMMM d, yyyy"
                                )}
                            </p>
                        </div>
                        <span
                            className={`px-2 py-1 text-xs rounded-full ${
                                refund.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : refund.status === "SUCCESS"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {refund.status}
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Product:</span>{" "}
                                {
                                    refund.transaction.order.items[0].variant
                                        .product.name
                                }
                            </p>
                            <p>
                                <span className="font-medium">Quantity:</span>{" "}
                                {refund.transaction.order.items[0].quantity}
                            </p>
                            <p>
                                <span className="font-medium">Amount:</span> Rs.{" "}
                                {refund.amount.toFixed(2)}
                            </p>
                            {refund.reason && (
                                <p>
                                    <span className="font-medium">Reason:</span>{" "}
                                    {refund.reason}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ReturnBook;

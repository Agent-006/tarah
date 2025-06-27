// components/order/OrderDetails.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutOrder } from "@/types/checkout";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

interface OrderDetailsProps {
    order: CheckoutOrder;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
    const getStatusBadge = () => {
        switch (order.status) {
            case "PENDING":
                return <Badge variant="secondary">Pending</Badge>;
            case "PROCESSING":
                return <Badge variant="secondary">Processing</Badge>;
            case "SHIPPED":
                return <Badge className="bg-blue-500">Shipped</Badge>;
            case "DELIVERED":
                return <Badge className="bg-green-500">Delivered</Badge>;
            case "CANCELLED":
                return <Badge variant="destructive">Cancelled</Badge>;
            case "RETURNED":
                return <Badge variant="outline">Returned</Badge>;
            default:
                return <Badge variant="outline">{order.status}</Badge>;
        }
    };

    const getPaymentStatusBadge = () => {
        switch (order.paymentStatus) {
            case "PENDING":
                return <Badge variant="secondary">Pending</Badge>;
            case "AUTHORIZED":
                return <Badge className="bg-blue-500">Authorized</Badge>;
            case "CAPTURED":
                return <Badge className="bg-green-500">Paid</Badge>;
            case "FAILED":
                return <Badge variant="destructive">Failed</Badge>;
            case "REFUNDED":
                return <Badge variant="outline">Refunded</Badge>;
            default:
                return <Badge variant="outline">{order.paymentStatus}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>
                        Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {getStatusBadge()}
                        {getPaymentStatusBadge()}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Order Date
                        </span>
                        <span className="text-sm">
                            {format(new Date(order.createdAt), "MMMM d, yyyy")}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Subtotal
                        </span>
                        <span className="text-sm">
                            ₹{order.subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Shipping
                        </span>
                        <span className="text-sm">
                            {Number(order.shippingFee) === 0
                                ? "Free"
                                : `₹${order.shippingFee.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                            Tax
                        </span>
                        <span className="text-sm">
                            ₹{order.taxAmount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p>{order.address.street}</p>
                        <p>
                            {order.address.city}, {order.address.state}{" "}
                            {order.address.postalCode}
                        </p>
                        <p>{order.address.country}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                            <div className="relative w-16 h-16">
                                <Image
                                    src={
                                        item.variant.product.images[0]?.url ||
                                        "/placeholder-product.jpg"
                                    }
                                    alt={item.variant.product.name}
                                    fill
                                    className="rounded object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">
                                    {item.variant.product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Variant: {item.variant.name}
                                </p>
                            </div>
                            <div className="font-medium">
                                ₹{(Number(item.price) * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/orders">Back to Orders</Link>
                </Button>
                {order.status === "PENDING" && (
                    <Button variant="destructive">Cancel Order</Button>
                )}
                {order.status === "DELIVERED" && (
                    <Button variant="outline">Request Return</Button>
                )}
            </div>
        </div>
    );
};

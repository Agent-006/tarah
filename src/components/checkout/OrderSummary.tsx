// components/checkout/OrderSummary.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/user/cartStore";
import Image from "next/image";
import Link from "next/link";

export const OrderSummary = () => {
    const { items } = useCartStore();

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const delivery = subtotal > 1000 ? 0 : 50; // Free delivery over ₹1000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + delivery + tax;

    return (
        <Card className="border rounded-lg p-6 space-y-4">
            <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold">
                    Order Summary
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                    <div
                        key={`${item.productId}-${item.variantId}`}
                        className="flex gap-4 border-b pb-4"
                    >
                        <div className="relative w-16 h-16">
                            <Image
                                src={item.image || "/placeholder-product.jpg"}
                                alt={item.name}
                                fill
                                className="rounded object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {item.quantity} × ₹{item.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Size: {item.size}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Color: {item.color}
                            </p>
                        </div>
                        <div className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </CardContent>

            <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                        {delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>

            <Button asChild variant="outline" className="w-full">
                <Link href="/cart">Back to Cart</Link>
            </Button>
        </Card>
    );
};

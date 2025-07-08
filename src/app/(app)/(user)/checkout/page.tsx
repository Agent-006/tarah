
"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Step, Stepper } from "@/components/ui/stepper";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store/user/cartStore";

const steps: Step[] = [
    { id: "cart", name: "Cart", status: "complete" },
    { id: "checkout", name: "Checkout", status: "current" },
    { id: "payment", name: "Payment", status: "upcoming" },
    { id: "confirmation", name: "Confirmation", status: "upcoming" },
];

export default function CheckoutPage() {
    const { items, isLoading: isCartLoading } = useCartStore();
    const { status: sessionStatus } = useSession();

    if (sessionStatus === "loading" || isCartLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (sessionStatus === "unauthenticated") {
        return (
            <div className="max-w-2xl mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <p className="mb-4">Please sign in to proceed to checkout</p>
                <Button asChild>
                    <Link href="/auth/signin">Sign In</Link>
                </Button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Checkout</h1>
                <p className="mb-4">Your cart is empty</p>
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 flex justify-center">
                <div className="w-full max-w-2xl">
                    <Stepper steps={steps} />
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <CheckoutForm />
                </div>
                <div className="space-y-8">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}

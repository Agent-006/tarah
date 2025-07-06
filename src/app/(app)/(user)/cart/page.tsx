"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Minus, Plus, Trash, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/user/cartStore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

// First, define the CartItem type based on your store's CartItem
type CartItemType = {
    id: string;
    slug: string;
    productId: string;
    variantId: string;
    name: string;
    price: number;
    size: string;
    color: string;
    image: string;
    quantity: number;
};

// Define props for CartItem component
interface CartItemProps {
    item: CartItemType;
    isProcessing: boolean;
    handleRemove: (productId: string, variantId: string) => void;
    handleQuantityChange: (
        productId: string,
        variantId: string,
        change: number
    ) => void;
}

// Define props for OrderSummary component
interface OrderSummaryProps {
    subtotal: number;
    discount: number;
    discountApplied: boolean;
    delivery: number;
    total: number;
    promoCode: string;
    setPromoCode: (code: string) => void;
    handleApplyPromo: () => void;
}

// Define the CartItem component first
const CartItem = ({
    item,
    isProcessing,
    handleRemove,
    handleQuantityChange,
}: CartItemProps) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border p-4">
        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
            <Image
                src={item.image || "/assets/insta1.png"}
                alt={item.name}
                width={80}
                height={80}
                className="rounded"
            />
        </Link>
        <div className="flex-1">
            <Link href={`/product/${item.slug}`} className="block mb-2">
                <h2 className="font-semibold text-lg hover:underline transition-all duration-200">
                    {item.name}
                </h2>
            </Link>
            <p className="text-sm text-gray-500">Size: {item.size}</p>
            <p className="text-sm text-gray-500">Color: {item.color}</p>
            <p className="text-lg font-medium mt-1">₹{item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    handleQuantityChange(item.productId, item.variantId, -1)
                }
                disabled={isProcessing || item.quantity <= 1}
                className="rounded-none"
            >
                {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Minus className="w-4 h-4" />
                )}
            </Button>
            <span>{item.quantity}</span>
            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    handleQuantityChange(item.productId, item.variantId, 1)
                }
                disabled={isProcessing}
                className="rounded-none"
            >
                {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Plus className="w-4 h-4" />
                )}
            </Button>
        </div>
        <Button
            variant="ghost"
            className="text-red-500"
            onClick={() => handleRemove(item.productId, item.variantId)}
            disabled={isProcessing}
        >
            {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash className="w-5 h-5" />
            )}
        </Button>
    </div>
);

// Define the OrderSummary component
const OrderSummary = ({
    subtotal,
    discount,
    discountApplied,
    delivery,
    total,
    promoCode,
    setPromoCode,
    handleApplyPromo,
}: OrderSummaryProps) => (
    <>
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
            <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-red-500">-${discount.toFixed(2)}</span>
            </div>
        )}
        <div className="flex justify-between">
            <span>Delivery</span>
            <span>₹{delivery.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
            <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Add promo code"
                className="rounded-none flex-1"
            />
            <Button className="rounded-none" onClick={handleApplyPromo}>
                {discountApplied ? "Applied" : "Apply"}
            </Button>
        </div>
        <Button className="w-full rounded-none" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
    </>
);

// Now define the main CartPage component
const CartPage = () => {
    const { data: session, status: sessionStatus } = useSession();
    const {
        items,
        isLoading,
        error,
        initializeCart,
        syncWithDatabase,
        removeItem,
        updateQuantity,
        clearCart,
    } = useCartStore();

    console.log(items);

    const [promoCode, setPromoCode] = useState("");
    const [discountApplied, setDiscountApplied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate cart totals
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const discount = discountApplied ? subtotal * 0.2 : 0;
    const delivery = subtotal === 0 ? 0 : 15;
    const total = subtotal - discount + delivery;

    // Initialize cart when session is available
    useEffect(() => {
        if (sessionStatus === "authenticated") {
            initializeCart();
        }
    }, [sessionStatus, initializeCart]);

    const handleApplyPromo = () => {
        if (promoCode.toLowerCase() === "save20") {
            setDiscountApplied(true);
            toast.success("Promo code applied successfully!");
        } else {
            toast.error("Invalid promo code");
        }
    };

    const handleRemove = async (productId: string, variantId: string) => {
        setIsProcessing(true);
        try {
            await removeItem(productId, variantId);
            await syncWithDatabase();
            toast.success("Item removed from cart");
        } catch (err) {
            toast.error("Failed to remove item");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQuantityChange = async (
        productId: string,
        variantId: string,
        change: number
    ) => {
        setIsProcessing(true);
        try {
            await updateQuantity(productId, variantId, change);
            await syncWithDatabase();
        } catch (err) {
            toast.error("Failed to update quantity");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClearCart = async () => {
        setIsProcessing(true);
        try {
            await clearCart();
            await syncWithDatabase();
            toast.success("Cart cleared successfully");
        } catch (err) {
            toast.error("Failed to clear cart");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRefreshCart = async () => {
        setIsProcessing(true);
        try {
            await syncWithDatabase();
            toast.success("Cart refreshed");
        } catch (err) {
            toast.error("Failed to refresh cart");
        } finally {
            setIsProcessing(false);
        }
    };

    if (sessionStatus === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    if (sessionStatus === "unauthenticated") {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 text-center">
                <h1 className="text-3xl font-semibold mb-6">Your cart</h1>
                <p className="mb-4">Please sign in to view your cart</p>
                <Button className="rounded-none" asChild>
                    <Link href="/sign-in">Sign In</Link>
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 text-center">
                <h1 className="text-3xl font-semibold mb-6">Your cart</h1>
                <p className="text-red-500 mb-4">{error}</p>
                <Button className="rounded-none" onClick={syncWithDatabase}>
                    Retry
                </Button>
            </div>
        );
    }

    if (items.length === 0 && !isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 text-center">
                <h1 className="text-3xl font-semibold mb-6">
                    Your cart is empty
                </h1>
                <p className="mb-4">
                    Looks like you haven't added anything to your cart yet
                </p>
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-secondary text-gray-900 min-h-screen flex flex-col">
            {/* Mobile Cart Sheet */}
            <div className="lg:hidden px-4 mt-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full rounded-none bg-primary text-secondary transition-colors duration-200"
                        >
                            View Cart Summary ({items.length} items)
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="p-6 space-y-4">
                        <SheetHeader>
                            <SheetTitle className="text-xl text-center font-semibold">
                                Cart Summary
                            </SheetTitle>
                        </SheetHeader>
                        <OrderSummary
                            subtotal={subtotal}
                            discount={discount}
                            discountApplied={discountApplied}
                            delivery={delivery}
                            total={total}
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            handleApplyPromo={handleApplyPromo}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-10 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">
                        Your cart ({items.length})
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefreshCart}
                            disabled={isProcessing}
                            className="bg-secondary rounded-none"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Refresh Cart"
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-secondary text-red-500 rounded-none"
                            onClick={handleClearCart}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Clear Cart"
                            )}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-6">
                        {items.map((item) => (
                            <CartItem
                                key={`${item.productId}-${item.variantId}`}
                                item={item}
                                isProcessing={isProcessing}
                                handleRemove={handleRemove}
                                handleQuantityChange={handleQuantityChange}
                            />
                        ))}
                    </div>

                    {/* Order Summary - Desktop */}
                    <div className="hidden lg:block lg:w-1/3 border p-6 space-y-4 bg-secondary h-fit sticky top-4">
                        <OrderSummary
                            subtotal={subtotal}
                            discount={discount}
                            discountApplied={discountApplied}
                            delivery={delivery}
                            total={total}
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            handleApplyPromo={handleApplyPromo}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CartPage;

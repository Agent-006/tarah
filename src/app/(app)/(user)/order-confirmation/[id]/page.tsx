// app/order-confirmation/[id]/page.tsx

"use client";


import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";

import { CheckoutOrder } from "@/types/checkout";
import { Button } from "@/components/ui/button";
import { OrderDetails } from "@/components/order/OrderDetails";

export default function OrderConfirmationPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<CheckoutOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/user/orders/${id}`);
                setOrder(response.data);
            } catch (err) {
                const errorMsg = (err instanceof Error) ? err.message : "Failed to load order details";
                setError(errorMsg);
                toast.error("Failed to load order details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();

        // const verifyOrder = async () => {
        //     try {
        //         const order = await useOrderStore.getState().verifyOrderPayment(id);
        //         setOrder(order);
        //     } catch (error) {
        //         setError(
        //             axios.isAxiosError(error)
        //                 ? error.response?.data?.message || error.message
        //                 : "Failed to verify order payment"
        //         );
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
        

        // verifyOrder();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <p className="mb-4">We couldn&apos;t find your order details</p>
                <Button asChild>
                    <Link href="/orders">View Your Orders</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold text-green-800 mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-green-700">
                    Thank you for your order #
                    {order?.id.slice(0, 8).toUpperCase()}
                </p>
            </div>

            {order && <OrderDetails order={order} />}

            <div className="mt-8 flex justify-end">
                <Button asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
}

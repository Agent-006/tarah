import { checkoutFormSchema } from "@/schemas/userSchema/checkoutSchema";
import { useCartStore } from "@/store/user/cartStore";
import { useOrderStore } from "@/store/user/orderStore";
import { CheckoutFormValues, PaymentOption } from "@/types/checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ContactSection } from "./ContactSection";
import { ShippingSection } from "./ShippingSection";
import { BillingSection } from "./BillingSection";
import { PaymentSection } from "./PaymentSection";

export function CheckoutForm() {
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(
            checkoutFormSchema
        ) as Resolver<CheckoutFormValues>,
        defaultValues: {
            contact: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
            },
            shipping: {
                address: "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
            },
            billing: {
                sameAsShipping: true,
            },
            payment: {
                method: "",
            },
        },
    });

    const [paymentMethods, setPaymentMethods] = useState<PaymentOption[]>([]);
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

    const { handleSubmit } = form;
    const { items } = useCartStore();
    const { createOrder } = useOrderStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);
        // try {
        //     // create order draft
        //     const order = await useOrderStore.getState().createOrder(data);

        //     // handle payment based on method
        //     if (data.payment.method === "stripe") {
        //         const { url } = await useOrderStore
        //             .getState()
        //             .createStripePaymentIntent(order.id, order.totalAmount); // we don't have this in checkoutFormValues (order.totalAmount)

        //         if (!url) {
        //             toast.error("Failed to create payment intent");
        //         }

        //         toast.success("Redirecting to payment gateway...");
        //         window.location.href = url; // redirect to Stripe checkout
        //     }
        //     router.push(`/order-confirmation/${order.id}`);
        //     toast.success("Order placed successfully!");
        // } catch (error) {
        //     toast.error("Failed to place order");
        // } finally {
        //     setIsSubmitting(false);
        // }
    };

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get("/api/user/payment-methods");
                setPaymentMethods([
                    ...response.data,
                    { id: "cash_on_delivery", type: "COD" }, // Add Cash on Delivery option
                ]);
                toast.success("Payment methods loaded successfully");
            } catch (error) {
                console.error("Error fetching payment methods:", error);
                toast.error("Failed to load payment methods");
            } finally {
                setLoadingPaymentMethods(false);
            }
        };

        if (!fetchPaymentMethods) {
            toast.error(
                "No payment methods found you can add one in your profile"
            );
        }

        // fetchPaymentMethods();
    }, []);

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <ContactSection />
                <ShippingSection />
                <BillingSection />
                <PaymentSection
                    paymentMethods={paymentMethods}
                    isLoading={loadingPaymentMethods}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || loadingPaymentMethods}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Place Order"
                    )}
                </Button>
            </form>
        </FormProvider>
    );
}

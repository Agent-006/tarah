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
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get("/api/user/payment-methods");
                setPaymentMethods([
                    ...response.data,
                    { id: "cash_on_delivery", type: "COD" }, // Add Cash on Delivery option
                ]);
            } catch (error) {
                console.error("Error fetching payment methods:", error);
                toast.error("Failed to load payment methods");
            } finally {
                setLoadingPaymentMethods(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    const { handleSubmit } = form;
    const { items } = useCartStore();
    const { createOrder } = useOrderStore();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);
        try {
            const order = await createOrder(data);

            toast.success("Order placed successfully!");
            router.push(`/order-confirmation/${order.id}`);
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

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

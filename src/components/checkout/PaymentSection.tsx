// components/checkout/PaymentSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { PaymentOption } from "@/types/checkout";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";

interface PaymentSectionProps {
    paymentMethods: PaymentOption[];
    isLoading: boolean;
}

export const PaymentSection = ({
    paymentMethods,
    isLoading,
}: PaymentSectionProps) => {
    const { register, watch, setValue } = useFormContext();
    const selectedMethod = watch("payment.method");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Payment Method</h3>

            <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => setValue("payment.method", value)}
                className="space-y-3"
            >
                {paymentMethods.map((method) => (
                    <Card key={method.id}>
                        <CardHeader className="flex flex-row items-center space-y-0 p-4">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <CardTitle className="ml-2">
                                <Label htmlFor={method.id}>
                                    {method.type === "CREDIT_CARD" &&
                                        `Card ending in ${method.cardLast4}`}
                                    {method.type === "UPI" &&
                                        `UPI ID: ${method.upiId}`}
                                    {method.type === "COD" &&
                                        "Cash on Delivery"}
                                </Label>
                            </CardTitle>
                        </CardHeader>
                        {method.type === "CREDIT_CARD" && (
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-gray-500">
                                    {method.cardBrand} • Expires{" "}
                                    {method.expiresAt
                                        ? new Date(
                                              method.expiresAt
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </RadioGroup>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        Add New Payment Method
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                    </DialogHeader>
                    <AddPaymentMethodForm />
                </DialogContent>
            </Dialog>
        </div>
    );
};

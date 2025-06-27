import { Order as PrismaOrder, OrderItem as PrismaOrderItem, Address, PaymentMethod }  from '@prisma/client';

export interface CheckoutOrder extends Omit<PrismaOrder, 'status' | 'paymentStatus'> {
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    paymentStatus: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'REFUNDED' | 'FAILED';

    items: Array<
        PrismaOrderItem & {
            variant: {
                product: {
                    name: string;
                    images: { url: string }[];
                };
                name: string;
            };
        }
    >;
    address: Address;
}

export type PaymentOption = PaymentMethod | { id: 'cash_on_delivery', type: 'COD' };

export interface CheckoutFormValues {
    contact: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shipping: {
        address: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    billing: {
        sameAsShipping: boolean;
        address?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    payment: {
        method: string;
    };
}
import { z } from 'zod';

export const checkoutFormSchema = z.object({
    contact: z.object({
        firstName: z
            .string()
            .min(1, 'First name is required')
            .max(50, 'First name must be less than 50 characters'),
        lastName: z
            .string()
            .min(1, 'Last name is required')
            .max(50, 'Last name must be less than 50 characters'),
        email: z
            .string()
            .min(1, 'Email is required')
            .max(100, 'Email must be less than 100 characters')
            .email('Invalid email address'),
        phone: z
            .string()
            .min(1, 'Phone number is required')
            .max(15, 'Phone number must be less than 15 characters')
            .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    }),
    shipping: z.object({
        address: z
            .string()
            .min(1, 'Shipping address is required')
            .max(200, 'Shipping address must be less than 200 characters'),
        street: z
            .string()
            .min(1, 'Street is required')
            .max(100, 'Street must be less than 100 characters'),
        city: z
            .string()
            .min(1, 'City is required')
            .max(50, 'City must be less than 50 characters'),
        state: z
            .string()
            .min(1, 'State is required')
            .max(50, 'State must be less than 50 characters'),
        postalCode: z
            .string()
            .min(1, 'Postal code is required')
            .max(20, 'Postal code must be less than 20 characters'),
        country: z
            .string()
            .min(1, 'Country is required')
            .max(50, 'Country must be less than 50 characters'),
    }),
    billing: z.object({
        sameAsShipping: z.boolean(),
        address: z
            .string()
            .optional(),
        city: z
            .string()
            .optional(),
        state: z
            .string()
            .optional(),
        postalCode: z
            .string()
            .optional(),
        country: z
            .string()
            .optional(),        
    }).superRefine((data, ctx) => {
        if (!data.sameAsShipping) {
            if (!data.address){ 
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Billing address is required when not same as shipping',
                    path: ["address",]
                });
            }
            if (!data.city) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Billing city is required when not same as shipping',
                    path: ["city",]
                });
            }
            if (!data.state) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Billing state is required when not same as shipping',
                    path: ["state",]
                });
            }
            if (!data.postalCode) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Billing postal code is required when not same as shipping',
                    path: ["postalCode",]
                });
            }
            if (!data.country) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Billing country is required when not same as shipping',
                    path: ["country",]
                });
            }
        }
    }),
    payment: z.object({
        method: z
            .enum(['credit_card', 'paypal', 'cash_on_delivery']),
        cardNumber: z
            .string()
            .optional(),
        cardExpiry: z
            .string()
            .optional(),
        cardCVC: z
            .string()
            .optional(),
    }).superRefine((data, ctx) => {
        if (data.method === 'credit_card') {
            if (!data.cardNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Card number is required for credit card payments',
                    path: ["cardNumber",]
                });
            }
            if (!data.cardExpiry) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Card expiry date is required for credit card payments',
                    path: ["cardExpiry",]
                });
            }
            if (!data.cardCVC) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Card CVC is required for credit card payments',
                    path: ["cardCVC",]
                });
            }
        }
    }),
});

export type TCheckoutFormValues = z.infer<typeof checkoutFormSchema>;
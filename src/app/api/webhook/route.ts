import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const sig = request.headers.get("stripe-signature")!;
    const body = await request.text();

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log('Webhook event received:', event);
    } catch (error) {
        return NextResponse.json(
            { error: 'Webhook Error: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 400 }
        );
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { cartId, userId, addressId } = session.metadata as { cartId: string; userId: string; addressId: string };

            //1. Create order in the database
            const order = await prisma.order.create({
                data: {
                    userId, 
                    addressId,
                    totalAmount: (session.amount_total ?? 0) / 100, // Convert from cents to actual amount, fallback to 0 if null
                    subtotal: (session.amount_subtotal ?? 0) / 100, // Convert from cents to actual amount, fallback to 0 if null
                    taxAmount: 0, // Assuming no tax for simplicity (adjust as needed)
                    shippingFee: 0, // Assuming no shipping fee for simplicity (adjust as needed)
                    status: 'PROCESSING', // Initial status
                    paymentStatus: 'CAPTURED', // Assuming payment is captured
                    items: {
                        createMany: {
                            data: await Promise.all(
                                // fetch cart items to map orders items
                                (await prisma.cartItem.findMany({
                                    where: { cartId },
                                    include: { variant: true },
                                })).map((item) => ({
                                    variantId: item.variantId,
                                    quantity: item.quantity,
                                    price: Number(item.variant.priceOffset),
                                }))
                            ),
                        },
                    },
                },
            });

            //2. Record the transaction in the database
            await prisma.transaction.create({
                data: {
                    orderId: order.id,
                    amount: (session.amount_subtotal ?? 0) / 100, // Convert from cents to actual amount, fallback to 0 if null
                    // currency: session.currency,
                    currency: 'inr', // Assuming INR for simplicity
                    provider: 'STRIPE',
                    providerId: session.payment_intent as string, // Use payment intent ID as provider ID
                    status: 'SUCCESS', // Assuming successful payment
                    type: 'CHARGE', // Assuming this is a charge transaction
                },
            });
            
            //3. Optionally, you can clear the cart after successful order creation
            await prisma.cart.deleteMany({
                where: { id: cartId },
            });

            return NextResponse.json(
                { received: true }
            );
        }
    } catch (error) {
        console.error('Error processing webhook event:', error);
        return NextResponse.json(
            { error: 'Webhook processing error: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
}
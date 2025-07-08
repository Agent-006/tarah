import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    const { cartId, addressId, userId } = await request.json();

    if (!cartId || !addressId || !userId) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        // fetch cart items
        const cart = await prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        variant: true,
                    }
                }
            },
        });

        console.log('Cart:', cart);

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        // calculate total amount
        const totalAmount = cart.items.reduce(
            (sum, item) => sum + (Number(item.variant.priceOffset)) * item.quantity,
            0
        );

        console.log('Total Amount:', totalAmount);
        
        // create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cart.items.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.variant.name 
                    },
                    unit_amount: Math.round(Number(item.variant.priceOffset) * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
            metadata: {
                cartId,
                addressId,
                userId,
            }, // Link to your DB
        });
        
        console.log('Session Created:', session);

        // // Optionally, you can save the session ID to your database for future reference
        // await prisma.payment.create({
        //     data: {
        //         sessionId: session.id,
        //         cartId,
        //         userId,
        //         amount: totalAmount,
        //         addressId,
        //     },
        // });

        // // Return the session ID to the client
        // console.log('Payment Session ID:', session.id);

        // // Return the session ID in the response
        
        return NextResponse.json({ sessionId: session.id });
        
    } catch (error) {
        console.error('Error creating payment intent:', error);
        NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
    
}
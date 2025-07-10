import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { OrderStatus, PaymentStatus, TransactionStatus, PaymentProvider, TransactionType } from '@prisma/client';

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const resolvedParams = await params;
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        // Verify the payment session with Stripe
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

        if (stripeSession.payment_status !== 'paid') {
            return NextResponse.json(
                { error: 'Payment not completed' },
                { status: 400 }
            );
        }

        // Find the order
        const order = await prisma.order.findUnique({
            where: {
                id: resolvedParams.orderId,
                userId: session.user.id,
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order status to paid
        const updatedOrder = await prisma.order.update({
            where: {
                id: resolvedParams.orderId,
            },
            data: {
                status: OrderStatus.PROCESSING,
                paymentStatus: PaymentStatus.CAPTURED,
                updatedAt: new Date(),
            },
        });

        // Create transaction record
        await prisma.transaction.create({
            data: {
                orderId: updatedOrder.id,
                amount: stripeSession.amount_total ? stripeSession.amount_total / 100 : 0,
                currency: stripeSession.currency || 'inr',
                status: TransactionStatus.SUCCESS,
                provider: PaymentProvider.STRIPE,
                providerId: stripeSession.payment_intent as string,
                type: TransactionType.CHARGE,
            },
        });

        return NextResponse.json(
            { message: 'Payment verified successfully', order: updatedOrder },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}

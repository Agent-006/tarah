import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { paymentIntentId, amount, reason } = await request.json();

        if (!paymentIntentId) {
            return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 });
        }

        // Create refund in Stripe
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if specified
            reason: reason || 'requested_by_customer',
        });

        // TODO: Update your database with refund information
        // await prisma.refund.create({
        //     data: {
        //         stripeRefundId: refund.id,
        //         paymentIntentId,
        //         amount: refund.amount / 100, // Convert back to dollars
        //         reason: refund.reason,
        //         status: refund.status,
        //     },
        // });

        return NextResponse.json({
            success: true,
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status,
                reason: refund.reason,
            },
        });
    } catch (error) {
        console.error('Error processing refund:', error);
        return NextResponse.json(
            { error: 'Failed to process refund' },
            { status: 500 }
        );
    }
}

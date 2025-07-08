import { NextResponse } from 'next/server';

import prisma from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug: params.slug,
            },
            include: {
                variants: {
                    include: {
                        variantAttributes: true,
                        inventory: true,
                        images: true,
                    }
                },
                coverImage: true,
                categories: true,
                inventory: true,
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
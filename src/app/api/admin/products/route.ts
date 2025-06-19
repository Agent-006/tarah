import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            include: {
                categories: true,
                variants: true,
                images: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, slug, description, basePrice, discountedPrice, published, featured, images } = await request.json();

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                basePrice,
                discountedPrice,
                published,
                featured,
                images: {
                    create: images.map((url: string, index: number) => ({
                        url,
                        order: index,
                        isPrimary: index === 0
                    }))
                }
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to create product' },
            { status: 500 }
        );
    }
}
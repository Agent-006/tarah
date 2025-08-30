import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        select: {
            name: true,
            description: true,
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });

    if (!category) {
        notFound();
    }

    const title = `${category.name} - Tarah by Meena`;
    const description = category.description || 
        `Shop ${category.name} collection at Tarah by Meena. Discover ${category._count.products} products in this category.`;

    return {
        title,
        description,
        keywords: [category.name, 'fashion', 'clothing', 'Tarah by Meena', 'online shopping'],
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'en_US',
            siteName: 'Tarah by Meena',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export async function generateStaticParams() {
    const categories = await prisma.category.findMany({
        select: {
            slug: true,
        },
    });

    return categories.map((category) => ({
        slug: category.slug,
    }));
}

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
// Clear existing data (optional)
await prisma.wishlistItem.deleteMany();
await prisma.product.deleteMany();
await prisma.category.deleteMany();
await prisma.user.deleteMany();

// Create test user
const user = await prisma.user.create({
data: {
    email: 'test@example.com',
    password: await hash('password123', 12),
    firstName: 'Test',
    lastName: 'User',
    role: 'CUSTOMER'
    }
});

// Create categories
const categories = await prisma.category.createMany({
data: [
        { name: 'Men', slug: 'men', description: 'Men\'s clothing' },
        { name: 'Women', slug: 'women', description: 'Women\'s clothing' },
        { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories' },
        { name: 'New Arrivals', slug: 'new-arrivals', featured: true },
        { name: 'Best Sellers', slug: 'best-sellers', featured: true }
    ]
});

// Get created categories
const categoryRecords = await prisma.category.findMany();

// Create products with variants
const products = await Promise.all([
    prisma.product.create({
            data: {
                name: 'Cotton cable-knit short-sleeve POLO',
                slug: 'cotton-cable-knit-polo',
                description: 'Premium quality cotton polo shirt',
                basePrice: 5400,
                discountedPrice: 4800,
                published: true,
                categories: {
                connect: [
                    { id: categoryRecords.find(c => c.slug === 'men')?.id },
                    { id: categoryRecords.find(c => c.slug === 'new-arrivals')?.id }
                    ]
                },
                images: {
                create: [
                    { url: '/assets/n1.png', altText: 'Cotton polo front view', order: 1, isPrimary: true },
                    { url: '/assets/n2.png', altText: 'Cotton polo side view', order: 2 }
                ]
            },
            variants: {
                create: [
                    {
                    name: 'Small',
                    sku: 'POLO-SM',
                    priceOffset: 0,
                    attributes: {
                        create: [
                        { name: 'size', value: 'S' },
                        { name: 'color', value: 'Navy' }
                        ]
                    },
                    inventory: {
                        create: {
                        stock: 10,
                        lowStockThreshold: 5
                        }
                    },
                    images: {
                        create: [
                        { url: '/assets/n1.png', order: 1 }
                        ]
                    }
                },
                // Add more variants...
                ]
            }
        }
    }),
// Add more products...
]);

    console.log('Database seeded successfully!');
}

main()
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
// // app/api/admin/products/[id]/route.ts
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/options';
// import prisma from '@/lib/db';

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user || session.user.role !== 'ADMIN') {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const body = await req.json();
//     const productId = params.id;

//     if (!body || !productId) {
//       return new NextResponse("Bad Request", { status: 400 });
//     }

//     // Update product and its relations
//     const updatedProduct = await prisma.$transaction(async (tx) => {
//       // First update the product
//       const product = await tx.product.update({
//         where: { id: productId },
//         data: {
//           name: body.name,
//           slug: body.slug,
//           description: body.description,
//           basePrice: body.basePrice,
//           discountedPrice: body.discountedPrice,
//           published: body.published,
//           featured: body.featured,
//           // Handle categories
//           categories: {
//             set: body.categories?.map((catId: string) => ({ id: catId })) || [],
//           },
//         },
//       });

//       // Handle variants with nested updates
//       await Promise.all(
//         body.variants.map(async (variant: any) => {
//           return tx.productVariant.upsert({
//             where: { id: variant.id || '' },
//             update: {
//               name: variant.name,
//               sku: variant.sku,
//               priceOffset: variant.priceOffset,
//               inventory: {
//                 update: {
//                   stock: variant.inventory.stock,
//                   lowStockThreshold: variant.inventory.lowStockThreshold,
//                 },
//               },
//               // Handle images
//               images: {
//                 deleteMany: {},
//                 create: variant.images.map((img: any) => ({
//                   url: img.url,
//                   altText: img.altText,
//                   isPrimary: img.isPrimary,
//                   order: img.order,
//                 })),
//               },
//             },
//             create: {
//               name: variant.name,
//               sku: variant.sku,
//               priceOffset: variant.priceOffset,
//               inventory: {
//                 create: {
//                   stock: variant.inventory.stock,
//                   lowStockThreshold: variant.inventory.lowStockThreshold,
//                 },
//               },
//               images: {
//                 create: variant.images.map((img: any) => ({
//                   url: img.url,
//                   altText: img.altText,
//                   isPrimary: img.isPrimary,
//                   order: img.order,
//                 })),
//               },
//               product: { connect: { id: product.id } },
//             },
//           });
//         })
//       );

//       return tx.product.findUnique({
//         where: { id: product.id },
//         include: {
//           variants: {
//             include: {
//               images: true,
//               inventory: true,
//             },
//           },
//           categories: true,
//         },
//       });
//     });

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     console.error('[PRODUCT_PUT]', error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
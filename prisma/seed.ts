import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
    // const adminEmail = 'admin@example.com';
    // const adminPassword = await hash('SecurePassword123!', 12);

    // const adminUser = await prisma.user.upsert({
    //     where: { email: adminEmail },
    //     update: {},
    //     create: {
    //         email: adminEmail,
    //         password: adminPassword,
    //         firstName: 'Admin',
    //         lastName: 'User',
    //         fullName: 'Admin User',
    //         role: 'ADMIN'
    //     }
    // });

    // console.log('Seeded admin user:', adminUser);

    console.log('🌱 Seeding categories...');

  // // Clear existing categories (optional - remove if you want to keep existing data)
  // await prisma.category.deleteMany();

  // // Create parent categories
  // const newArrivals = await prisma.category.create({
  //   data: {
  //     name: 'New Arrivals',
  //     slug: 'new-arrivals',
  //     featured: true,
  //     description: 'Our latest fashion arrivals'
  //   }
  // });

  // const jewellery = await prisma.category.create({
  //   data: {
  //     name: 'Jewellery & Accessories',
  //     slug: 'jewellery-accessories',
  //     description: 'Beautiful jewellery and fashion accessories'
  //   }
  // });

  // const indian = await prisma.category.create({
  //   data: {
  //     name: 'Indian',
  //     slug: 'indian',
  //     description: 'Traditional Indian clothing and wear'
  //   }
  // });

  // const western = await prisma.category.create({
  //   data: {
  //     name: 'Western',
  //     slug: 'western',
  //     description: 'Contemporary western fashion'
  //   }
  // });

  // const nightDress = await prisma.category.create({
  //   data: {
  //     name: 'Night Dress',
  //     slug: 'night-dress',
  //     description: 'Comfortable nightwear and sleepwear'
  //   }
  // });

  // const maaBeti = await prisma.category.create({
  //   data: {
  //     name: 'माँ + Beti',
  //     slug: 'maa-beti',
  //     description: 'Matching outfits for mothers and daughters'
  //   }
  // });

  // // Create Plus Size category with subcategories
  // const plusSize = await prisma.category.create({
  //   data: {
  //     name: 'Plus Size',
  //     slug: 'plus-size',
  //     description: 'Fashion for plus size women',
  //     children: {
  //       create: [
  //         {
  //           name: 'Indian',
  //           slug: 'plus-size-indian',
  //           description: 'Traditional Indian wear in plus sizes'
  //         },
  //         {
  //           name: 'Western',
  //           slug: 'plus-size-western',
  //           description: 'Western fashion in plus sizes'
  //         }
  //       ]
  //     }
  //   }
  // });

  // console.log('Successfully seeded categories:');
  // console.log('- New Arrivals');
  // console.log('- Jewellery & Accessories');
  // console.log('- Indian');
  // console.log('- Western');
  // console.log('- Night Dress');
  // console.log('- माँ + Beti');
  // console.log('- Plus Size');
  // console.log('  - Indian');
  // console.log('  - Western');
  

  // Clear existing data
  // await prisma.productImage.deleteMany();
  // await prisma.variantAttribute.deleteMany();
  // await prisma.productAttribute.deleteMany();
  // await prisma.inventory.deleteMany();
  // await prisma.productVariant.deleteMany();
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.productCategory.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();

  // // Create categories one by one to handle nested relations
  // const newArrivals = await prisma.category.create({
  //   data: {
  //     name: 'New Arrivals',
  //     slug: 'new-arrivals',
  //     featured: true
  //   }
  // });

  // const jewellery = await prisma.category.create({
  //   data: {
  //     name: 'Jewellery & Accessories',
  //     slug: 'jewellery-accessories'
  //   }
  // });

  // const indian = await prisma.category.create({
  //   data: {
  //     name: 'Indian',
  //     slug: 'indian'
  //   }
  // });

  // const western = await prisma.category.create({
  //   data: {
  //     name: 'Western',
  //     slug: 'western'
  //   }
  // });

  // const nightDress = await prisma.category.create({
  //   data: {
  //     name: 'Night Dress',
  //     slug: 'night-dress'
  //   }
  // });

  // const maaBeti = await prisma.category.create({
  //   data: {
  //     name: 'माँ + Beti',
  //     slug: 'maa-beti'
  //   }
  // });

  // // Create Plus Size parent category first
  // const plusSize = await prisma.category.create({
  //   data: {
  //     name: 'Plus Size',
  //     slug: 'plus-size'
  //   }
  // });

  // // Then create its subcategories
  // const plusSizeIndian = await prisma.category.create({
  //   data: {
  //     name: 'Indian',
  //     slug: 'plus-size-indian',
  //     parentId: plusSize.id
  //   }
  // });

  // const plusSizeWestern = await prisma.category.create({
  //   data: {
  //     name: 'Western',
  //     slug: 'plus-size-western',
  //     parentId: plusSize.id
  //   }
  // });

  // // Sample products data
  // const products = [
  //   // New Arrivals
  //   {
  //     name: 'Floral Print Maxi Dress',
  //     slug: 'floral-print-maxi-dress',
  //     description: 'Beautiful floral print maxi dress with comfortable fit',
  //     basePrice: 1999,
  //     discountedPrice: 1499,
  //     categories: [newArrivals.id, western.id],
  //     variants: [
  //       {
  //         name: 'Small',
  //         sku: 'FLORAL-MAXI-S',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'S' },
  //           { name: 'Color', value: 'Multicolor' }
  //         ],
  //         inventory: { stock: 50, lowStockThreshold: 5 }
  //       },
  //       {
  //         name: 'Medium',
  //         sku: 'FLORAL-MAXI-M',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'M' },
  //           { name: 'Color', value: 'Multicolor' }
  //         ],
  //         inventory: { stock: 30, lowStockThreshold: 5 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Fabric', value: 'Cotton Blend' },
  //       { name: 'Pattern', value: 'Floral' },
  //       { name: 'Sleeve Length', value: 'Half Sleeve' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Floral Print Maxi Dress', isPrimary: true, order: 0 }
  //     ],
  //     featured: true,
  //     published: true
  //   },

  //   // Jewellery & Accessories
  //   {
  //     name: 'Traditional Kundan Necklace Set',
  //     slug: 'traditional-kundan-necklace-set',
  //     description: 'Elegant kundan necklace set with matching earrings',
  //     basePrice: 2999,
  //     discountedPrice: 2499,
  //     categories: [jewellery.id],
  //     variants: [
  //       {
  //         name: 'One Size',
  //         sku: 'KUNDAN-SET-OS',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Color', value: 'Gold' }
  //         ],
  //         inventory: { stock: 20, lowStockThreshold: 3 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Material', value: 'Alloy, Kundan Stones' },
  //       { name: 'Occasion', value: 'Wedding, Party' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Traditional Kundan Necklace Set', isPrimary: true, order: 0 }
  //     ],
  //     published: true
  //   },

  //   // Indian
  //   {
  //     name: 'Silk Saree with Blouse',
  //     slug: 'silk-saree-with-blouse',
  //     description: 'Pure silk saree with matching blouse piece',
  //     basePrice: 3999,
  //     discountedPrice: 3499,
  //     categories: [indian.id],
  //     variants: [
  //       {
  //         name: 'Free Size',
  //         sku: 'SILK-SAREE-FS',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Color', value: 'Red' }
  //         ],
  //         inventory: { stock: 15, lowStockThreshold: 2 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Fabric', value: 'Pure Silk' },
  //       { name: 'Work', value: 'Zari Work' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Silk Saree with Blouse', isPrimary: true, order: 0 }
  //     ],
  //     featured: true,
  //     published: true
  //   },

  //   // Western
  //   {
  //     name: 'Denim Jacket',
  //     slug: 'denim-jacket',
  //     description: 'Classic denim jacket for women',
  //     basePrice: 2499,
  //     discountedPrice: 1999,
  //     categories: [western.id],
  //     variants: [
  //       {
  //         name: 'Small',
  //         sku: 'DENIM-JKT-S',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'S' },
  //           { name: 'Color', value: 'Blue' }
  //         ],
  //         inventory: { stock: 25, lowStockThreshold: 5 }
  //       },
  //       {
  //         name: 'Medium',
  //         sku: 'DENIM-JKT-M',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'M' },
  //           { name: 'Color', value: 'Blue' }
  //         ],
  //         inventory: { stock: 20, lowStockThreshold: 5 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Material', value: '100% Cotton Denim' },
  //       { name: 'Closure', value: 'Button Front' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Denim Jacket', isPrimary: true, order: 0 }
  //     ],
  //     published: true
  //   },

  //   // Night Dress
  //   {
  //     name: 'Silk Nightgown',
  //     slug: 'silk-nightgown',
  //     description: 'Comfortable silk nightgown for relaxing sleep',
  //     basePrice: 1299,
  //     discountedPrice: 999,
  //     categories: [nightDress.id],
  //     variants: [
  //       {
  //         name: 'Free Size',
  //         sku: 'SILK-NIGHT-FS',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Color', value: 'Pink' }
  //         ],
  //         inventory: { stock: 30, lowStockThreshold: 5 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Fabric', value: 'Silk Blend' },
  //       { name: 'Style', value: 'Nightgown' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Silk Nightgown', isPrimary: true, order: 0 }
  //     ],
  //     published: true
  //   },

  //   // माँ + Beti
  //   {
  //     name: 'Mother Daughter Matching Kurtas',
  //     slug: 'mother-daughter-matching-kurtas',
  //     description: 'Beautiful matching kurtas for mother and daughter',
  //     basePrice: 2999,
  //     discountedPrice: 2499,
  //     categories: [maaBeti.id, indian.id],
  //     variants: [
  //       {
  //         name: 'Mother (L) + Daughter (S)',
  //         sku: 'MOM-DAU-LS',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Set', value: 'Mother (L) + Daughter (S)' },
  //           { name: 'Color', value: 'Blue' }
  //         ],
  //         inventory: { stock: 10, lowStockThreshold: 2 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Fabric', value: 'Cotton' },
  //       { name: 'Pattern', value: 'Printed' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Mother Daughter Matching Kurtas', isPrimary: true, order: 0 }
  //     ],
  //     published: true
  //   },

  //   // Plus Size - Indian
  //   {
  //     name: 'Plus Size Anarkali Suit',
  //     slug: 'plus-size-anarkali-suit',
  //     description: 'Elegant plus size anarkali suit with dupatta',
  //     basePrice: 3499,
  //     discountedPrice: 2999,
  //     categories: [plusSizeIndian.id],
  //     variants: [
  //       {
  //         name: 'XL',
  //         sku: 'ANARKALI-XL',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'XL' },
  //           { name: 'Color', value: 'Green' }
  //         ],
  //         inventory: { stock: 12, lowStockThreshold: 3 }
  //       },
  //       {
  //         name: 'XXL',
  //         sku: 'ANARKALI-XXL',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'XXL' },
  //           { name: 'Color', value: 'Green' }
  //         ],
  //         inventory: { stock: 8, lowStockThreshold: 2 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Fabric', value: 'Georgette' },
  //       { name: 'Work', value: 'Embroidered' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Plus Size Anarkali Suit', isPrimary: true, order: 0 }
  //     ],
  //     published: true
  //   },

  //   // Plus Size - Western
  //   {
  //     name: 'Plus Size Wrap Dress',
  //     slug: 'plus-size-wrap-dress',
  //     description: 'Flattering wrap dress for plus size women',
  //     basePrice: 2299,
  //     discountedPrice: 1899,
  //     categories: [plusSizeWestern.id],
  //     variants: [
  //       {
  //         name: 'XL',
  //         sku: 'WRAP-DRESS-XL',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'XL' },
  //           { name: 'Color', value: 'Black' }
  //         ],
  //         inventory: { stock: 15, lowStockThreshold: 3 }
  //       },
  //       {
  //         name: 'XXL',
  //         sku: 'WRAP-DRESS-XXL',
  //         priceOffset: 0,
  //         attributes: [
  //           { name: 'Size', value: 'XXL' },
  //           { name: 'Color', value: 'Black' }
  //         ],
  //         inventory: { stock: 10, lowStockThreshold: 2 }
  //       }
  //     ],
  //     attributes: [
  //       { name: 'Fabric', value: 'Polyester Blend' },
  //       { name: 'Style', value: 'Wrap' }
  //     ],
  //     images: [
  //       { url: 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e', altText: 'Plus Size Wrap Dress', isPrimary: true, order: 0 }
  //     ],
  //     published: true
  //   }
  // ];

  // // Create products with all their relations
  // for (const productData of products) {
  //   const { categories, variants, attributes, images, ...product } = productData;

  //   // Create product
  //   const createdProduct = await prisma.product.create({
  //     data: {
  //       ...product,
  //       categories: {
  //         create: categories.map(categoryId => ({
  //           category: { connect: { id: categoryId } }
  //         }))
  //       },
  //       variants: {
  //         create: variants.map(variantData => {
  //           const { attributes, inventory, ...variant } = variantData;
  //           return {
  //             ...variant,
  //             attributes: {
  //               create: attributes.map(attr => ({
  //                 name: attr.name,
  //                 value: attr.value
  //               }))
  //             },
  //             inventory: {
  //               create: {
  //                 stock: inventory.stock,
  //                 lowStockThreshold: inventory.lowStockThreshold
  //               }
  //             }
  //           };
  //         })
  //       },
  //       attributes: {
  //         create: attributes.map(attr => ({
  //           name: attr.name,
  //           value: attr.value
  //         }))
  //       },
  //       images: {
  //         create: images.map(img => ({
  //           url: img.url,
  //           altText: img.altText,
  //           isPrimary: img.isPrimary,
  //           order: img.order
  //         }))
  //       }
  //     }
  //   });

  //   console.log(`Created product: ${createdProduct.name}`);
  // }
  
  console.log('✅ Categories seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
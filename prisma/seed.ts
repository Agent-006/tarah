import {
  PrismaClient,
  PaymentProvider,
  PaymentStatus,
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  // const adminEmail = "admin@example.com";
  // const adminPassword = await hash("SecurePassword123!", 12);

  // const adminUser = await prisma.user.upsert({
  //   where: { email: adminEmail },
  //   update: {},
  //   create: {
  //     email: adminEmail,
  //     password: adminPassword,
  //     firstName: "Admin",
  //     lastName: "User",
  //     fullName: "Admin User",
  //     role: "ADMIN",
  //   },
  // });

    // --- Authors ---
  const author1 = await prisma.author.upsert({
    where: { name: "Sagar Gope" },
    update: {},
    create: {
      name: "Sagar Gope",
      bio: "Full Stack Developer and blogger sharing insights on tech.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  });

  const author2 = await prisma.author.upsert({
    where: { name: "Sneha Roy" },
    update: {},
    create: {
      name: "Sneha Roy",
      bio: "Tech writer passionate about web dev and AI.",
      avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  });

  // --- Categories ---
  const categoryWeb = await prisma.blogCategory.upsert({
    where: { slug: "web-development" },
    update: {},
    create: {
      name: "Web Development",
      slug: "web-development",
      description: "Articles about modern web technologies and frameworks.",
    },
  });

  const categoryAI = await prisma.blogCategory.upsert({
    where: { slug: "artificial-intelligence" },
    update: {},
    create: {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "AI, ML, and everything in between.",
    },
  });

  // --- Tags ---
  const tagNextjs = await prisma.blogTag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: { name: "Next.js", slug: "nextjs" },
  });

  const tagPrisma = await prisma.blogTag.upsert({
    where: { slug: "prisma" },
    update: {},
    create: { name: "Prisma", slug: "prisma" },
  });

  const tagAI = await prisma.blogTag.upsert({
    where: { slug: "ai" },
    update: {},
    create: { name: "AI", slug: "ai" },
  });

  // --- Blog Posts ---
  await prisma.blogPost.create({
    data: {
      title: "Getting Started with Next.js and Prisma",
      slug: "getting-started-nextjs-prisma",
      excerpt: "A beginner-friendly guide to building full-stack apps with Next.js and Prisma.",
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "This is a seeded blog post about Next.js and Prisma." }] },
        ],
      },
      coverImage: "https://source.unsplash.com/800x400/?code",
      coverImageAlt: "Laptop with code editor open",
      ogImage: "https://source.unsplash.com/1200x630/?developer",
      ogImageAlt: "Developer coding",
      published: true,
      publishedAt: new Date(),
      authorName: author1.name,
      seoTitle: "Next.js and Prisma Guide",
      seoDescription: "Learn how to integrate Next.js with Prisma for scalable full-stack development.",
      seoKeywords: "Next.js, Prisma, Full Stack, Database",
      canonicalUrl: "https://example.com/blog/getting-started-nextjs-prisma",
      categories: { connect: [{ id: categoryWeb.id }] },
      tags: { connect: [{ id: tagNextjs.id }, { id: tagPrisma.id }] },
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "The Future of AI in Web Development",
      slug: "future-of-ai-web-development",
      excerpt: "Exploring how AI is transforming the way we build for the web.",
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "This is a seeded blog post about AI in web dev." }] },
        ],
      },
      coverImage: "https://source.unsplash.com/800x400/?artificial-intelligence",
      coverImageAlt: "AI brain concept illustration",
      ogImage: "https://source.unsplash.com/1200x630/?machine-learning",
      ogImageAlt: "AI neural network visualization",
      published: true,
      publishedAt: new Date(),
      authorName: author2.name,
      seoTitle: "AI in Web Development",
      seoDescription: "How artificial intelligence is shaping the future of web apps.",
      seoKeywords: "AI, Web Development, Machine Learning",
      canonicalUrl: "https://example.com/blog/future-of-ai-web-development",
      categories: { connect: [{ id: categoryAI.id }] },
      tags: { connect: [{ id: tagAI.id }] },
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Why You Should Care About Database Indexing",
      slug: "importance-of-database-indexing",
      excerpt: "Database indexing is key for performance. Here’s why you should care.",
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Indexes make queries faster by reducing scan times." }] },
        ],
      },
      coverImage: "https://source.unsplash.com/800x400/?database",
      coverImageAlt: "Database server racks",
      ogImage: "https://source.unsplash.com/1200x630/?data",
      ogImageAlt: "Data visualization",
      published: false, // draft example
      authorName: author1.name,
      seoTitle: "Database Indexing Explained",
      seoDescription: "Learn why database indexing improves query performance.",
      seoKeywords: "Database, Indexing, Performance",
      canonicalUrl: "https://example.com/blog/importance-of-database-indexing",
      categories: { connect: [{ id: categoryWeb.id }] },
      tags: { connect: [{ id: tagPrisma.id }] },
    },
  });

  console.log("✅ Blog data seeded successfully!");

  // console.log("Seeded admin user:", adminUser);

  // console.log("🌱 Seeding categories...");

  // Clear existing categories (optional - remove if you want to keep existing data)
  // await prisma.category.deleteMany();

  // Create parent categories
  // const newArrivals = await prisma.category.create({
  //   data: {
  //     name: "New Arrivals",
  //     slug: "new-arrivals",
  //     featured: true,
  //     description: "Our latest fashion arrivals",
  //   },
  // });

  // const jewellery = await prisma.category.create({
  //   data: {
  //     name: "Jewellery & Accessories",
  //     slug: "jewellery-accessories",
  //     description: "Beautiful jewellery and fashion accessories",
  //   },
  // });

  // const indian = await prisma.category.create({
  //   data: {
  //     name: "Indian",
  //     slug: "indian",
  //     description: "Traditional Indian clothing and wear",
  //   },
  // });

  // const western = await prisma.category.create({
  //   data: {
  //     name: "Western",
  //     slug: "western",
  //     description: "Contemporary western fashion",
  //   },
  // });

  // const nightDress = await prisma.category.create({
  //   data: {
  //     name: "Night Dress",
  //     slug: "night-dress",
  //     description: "Comfortable nightwear and sleepwear",
  //   },
  // });

  // const maaBeti = await prisma.category.create({
  //   data: {
  //     name: "माँ + Beti",
  //     slug: "maa-beti",
  //     description: "Matching outfits for mothers and daughters",
  //   },
  // });

  // // Create Plus Size category with subcategories
  // const plusSize = await prisma.category.create({
  //   data: {
  //     name: "Plus Size",
  //     slug: "plus-size",
  //     description: "Fashion for plus size women",
  //     children: {
  //       create: [
  //         {
  //           name: "Indian",
  //           slug: "plus-size-indian",
  //           description: "Traditional Indian wear in plus sizes",
  //         },
  //         {
  //           name: "Western",
  //           slug: "plus-size-western",
  //           description: "Western fashion in plus sizes",
  //         },
  //       ],
  //     },
  //   },
  // });

  // console.log("Successfully seeded categories:");
  // console.log("- New Arrivals");
  // console.log("- Jewellery & Accessories");
  // console.log("- Indian");
  // console.log("- Western");
  // console.log("- Night Dress");
  // console.log("- माँ + Beti");
  // console.log("- Plus Size");
  // console.log("  - Indian");
  // console.log("  - Western");

  // // Clear existing data
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

  // const customer = await prisma.user.findUnique({
  //   where: { email: 'sagarghosh0610@gmail.com' }
  // });

  // if (!customer) {
  //   throw new Error('Required users not found in database');
  // }

  // // Get some existing products with their variants
  // const demoProducts = await prisma.product.findMany({
  //   include: {
  //     variants: {
  //       include: {
  //         inventory: true
  //       }
  //     }
  //   },
  //   take: 5 // Get first 5 products for demo
  // });

  // if (demoProducts.length === 0) {
  //   throw new Error('No products found in database');
  // }

  // // Create sample addresses for the customer
  // const addresses = await Promise.all([
  //   prisma.address.create({
  //     data: {
  //       userId: customer.id,
  //       street: '123 Fashion Street',
  //       city: 'Mumbai',
  //       state: 'Maharashtra',
  //       postalCode: '400001',
  //       country: 'India',
  //       isDefault: true
  //     }
  //   }),
  //   prisma.address.create({
  //     data: {
  //       userId: customer.id,
  //       street: '456 Style Avenue',
  //       city: 'Bangalore',
  //       state: 'Karnataka',
  //       postalCode: '560001',
  //       country: 'India',
  //       isDefault: false
  //     }
  //   })
  // ]);

  // // Create sample payment methods
  // const paymentMethods = await Promise.all([
  //   prisma.paymentMethod.create({
  //     data: {
  //       userId: customer.id,
  //       type: 'DEBIT_CARD',
  //       provider: PaymentProvider.RAZORPAY,
  //       cardLast4: '4242',
  //       cardBrand: 'VISA',
  //       isDefault: true,
  //       providerToken: 'card_' + Math.random().toString(36).substring(2, 15)
  //     }
  //   }),
  //   prisma.paymentMethod.create({
  //     data: {
  //       userId: customer.id,
  //       type: 'UPI',
  //       provider: PaymentProvider.RAZORPAY,
  //       upiId: 'customer@upi',
  //       isDefault: false,
  //       providerToken: 'upi_' + Math.random().toString(36).substring(2, 15)
  //     }
  //   })
  // ]);

  // // Create sample orders with different statuses
  // const orders = [
  //   // Completed order
  //   {
  //     userId: customer.id,
  //     totalAmount: 7498.0,
  //     subtotal: 6998.0,
  //     taxAmount: 500.0,
  //     shippingFee: 0,
  //     status: OrderStatus.DELIVERED,
  //     paymentStatus: PaymentStatus.CAPTURED,
  //     addressId: addresses[0].id,
  //     paymentMethodId: paymentMethods[0].id,
  //     items: [
  //       {
  //         variantId: demoProducts[0].variants[0].id,
  //         quantity: 1,
  //         price: 4999.0
  //       },
  //       {
  //         variantId: demoProducts[1].variants[0].id,
  //         quantity: 1,
  //         price: 1999.0
  //       }
  //     ],
  //     transactions: [
  //       {
  //         amount: 7498.0,
  //         currency: 'INR',
  //         provider: PaymentProvider.RAZORPAY,
  //         providerId: 'pay_' + Math.random().toString(36).substring(2, 15),
  //         status: TransactionStatus.SUCCESS,
  //         type: TransactionType.CHARGE
  //       }
  //     ],
  //     createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  //     updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  //   },
  //   // Processing order
  //   {
  //     userId: customer.id,
  //     totalAmount: 3499.0,
  //     subtotal: 3499.0,
  //     taxAmount: 0,
  //     shippingFee: 0,
  //     status: OrderStatus.PROCESSING,
  //     paymentStatus: PaymentStatus.AUTHORIZED,
  //     addressId: addresses[1].id,
  //     paymentMethodId: paymentMethods[1].id,
  //     items: [
  //       {
  //         variantId: demoProducts[2].variants[0].id,
  //         quantity: 1,
  //         price: 3499.0
  //       }
  //     ],
  //     transactions: [
  //       {
  //         amount: 3499.0,
  //         currency: 'INR',
  //         provider: PaymentProvider.RAZORPAY,
  //         providerId: 'pay_' + Math.random().toString(36).substring(2, 15),
  //         status: TransactionStatus.PENDING,
  //         type: TransactionType.AUTHORIZE
  //       }
  //     ],
  //     createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  //   },
  //   // Cancelled order
  //   {
  //     userId: customer.id,
  //     totalAmount: 2499.0,
  //     subtotal: 2499.0,
  //     taxAmount: 0,
  //     shippingFee: 0,
  //     status: OrderStatus.CANCELLED,
  //     paymentStatus: PaymentStatus.FULLY_REFUNDED,
  //     addressId: addresses[0].id,
  //     paymentMethodId: paymentMethods[0].id,
  //     items: [
  //       {
  //         variantId: demoProducts[3].variants[0].id,
  //         quantity: 1,
  //         price: 2499.0
  //       }
  //     ],
  //     transactions: [
  //       {
  //         amount: 2499.0,
  //         currency: 'INR',
  //         provider: PaymentProvider.RAZORPAY,
  //         providerId: 'pay_' + Math.random().toString(36).substring(2, 15),
  //         status: TransactionStatus.REFUNDED,
  //         type: TransactionType.CHARGE
  //       },
  //       {
  //         amount: 2499.0,
  //         currency: 'INR',
  //         provider: PaymentProvider.RAZORPAY,
  //         providerId: 'ref_' + Math.random().toString(36).substring(2, 15),
  //         status: TransactionStatus.SUCCESS,
  //         type: TransactionType.REFUND
  //       }
  //     ],
  //     createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  //     updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  //   },
  //   // Shipped order
  //   {
  //     userId: customer.id,
  //     totalAmount: 1299.0,
  //     subtotal: 999.0,
  //     taxAmount: 300.0,
  //     shippingFee: 0,
  //     status: OrderStatus.SHIPPED,
  //     paymentStatus: PaymentStatus.CAPTURED,
  //     addressId: addresses[1].id,
  //     paymentMethodId: paymentMethods[1].id,
  //     items: [
  //       {
  //         variantId: demoProducts[4].variants[0].id,
  //         quantity: 1,
  //         price: 999.0
  //       }
  //     ],
  //     transactions: [
  //       {
  //         amount: 1299.0,
  //         currency: 'INR',
  //         provider: PaymentProvider.RAZORPAY,
  //         providerId: 'pay_' + Math.random().toString(36).substring(2, 15),
  //         status: TransactionStatus.SUCCESS,
  //         type: TransactionType.CHARGE
  //       }
  //     ],
  //     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  //     updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  //   }
  // ];

  // // Create the orders
  // for (const orderData of orders) {
  //   const { items, transactions, ...orderFields } = orderData;
  //   const createdOrder = await prisma.order.create({
  //     data: {
  //       ...orderFields,
  //       items: {
  //         create: items.map(item => ({
  //           variantId: item.variantId,
  //           quantity: item.quantity,
  //           price: item.price
  //         }))
  //       },
  //       transactions: {
  //         create: transactions.map(txn => ({
  //           amount: txn.amount,
  //           currency: txn.currency,
  //           provider: txn.provider,
  //           providerId: txn.providerId,
  //           status: txn.status,
  //           type: txn.type
  //         }))
  //       }
  //     }
  //   });
  //   console.log(`Created order: ${createdOrder.id}`);
  // }

  // // Add the same image for every product variant
  // const allVariants = await prisma.productVariant.findMany();
  // const variantImageUrl = 'https://z5bvwccrbg.ufs.sh/f/7FPxzmKwOTy2jVVgycC9PhBXKD76wcRzQnUoCmfg38lJ5S0e';
  // await Promise.all(
  //   allVariants.map(variant =>
  //     prisma.productImage.create({
  //       data: {
  //         variantId: variant.id,
  //         url: variantImageUrl,
  //         altText: variant.name,
  //         isPrimary: true,
  //         order: 0
  //       }
  //     })
  //   )
  // );

  // console.log("✅ Categories seeded successfully!");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


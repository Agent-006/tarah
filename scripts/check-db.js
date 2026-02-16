require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('\n📊 Checking database connection...');
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}\n`);

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length > 0) {
      console.log('📋 Users in database:');
      console.table(users);
    } else {
      console.log('⚠️  No users found in database');
    }

    // Check other tables
    const cartCount = await prisma.cart.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();

    console.log('\n📈 Database Statistics:');
    console.log(`   Carts: ${cartCount}`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Orders: ${orderCount}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearTestUsers() {
  try {
    // You can specify the email you want to delete or delete all test users
    const emailToDelete = process.argv[2];

    if (emailToDelete) {
      // Delete specific user and all related data
      const user = await prisma.user.findUnique({
        where: { email: emailToDelete },
        include: {
          addresses: true,
          cart: {
            include: {
              items: true
            }
          },
          orders: true,
          wishlistItems: true,
          paymentMethods: true,
          blogViews: true
        }
      });

      if (!user) {
        console.log(`❌ User with email ${emailToDelete} not found`);
        return;
      }

      // Delete in order to respect foreign key constraints
      console.log('🗑️  Deleting user data...');
      
      // Delete cart items
      if (user.cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: user.cart.id }
        });
        console.log('   ✓ Deleted cart items');
      }

      // Delete cart
      if (user.cart) {
        await prisma.cart.delete({
          where: { id: user.cart.id }
        });
        console.log('   ✓ Deleted cart');
      }

      // Delete wishlist items
      await prisma.wishlistItem.deleteMany({
        where: { userId: user.id }
      });
      console.log('   ✓ Deleted wishlist items');

      // Delete addresses
      await prisma.address.deleteMany({
        where: { userId: user.id }
      });
      console.log('   ✓ Deleted addresses');

      // Delete payment methods
      await prisma.paymentMethod.deleteMany({
        where: { userId: user.id }
      });
      console.log('   ✓ Deleted payment methods');

      // Delete blog views
      await prisma.blogView.deleteMany({
        where: { userId: user.id }
      });
      console.log('   ✓ Deleted blog views');

      // Delete orders (Note: might need to handle order items separately)
      await prisma.order.deleteMany({
        where: { userId: user.id }
      });
      console.log('   ✓ Deleted orders');

      // Finally delete the user
      const deleted = await prisma.user.delete({
        where: { email: emailToDelete }
      });
      console.log(`✅ Deleted user: ${deleted.email}`);
    } else {
      // List all users first
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
      
      console.log('\n📋 All users in database:');
      console.table(users);
      console.log('\nTo delete a specific user, run:');
      console.log('node scripts/clear-test-users.js user@example.com');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearTestUsers();

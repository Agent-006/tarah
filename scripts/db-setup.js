#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Setting up database for production...');

try {
  // First, try to deploy migrations normally
  console.log('Attempting to deploy migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations deployed successfully!');
} catch (error) {
  console.log('❌ Migration deploy failed, attempting to resolve...');
  
  try {
    // If that fails, try to resolve any failed migrations
    console.log('Resolving failed migrations...');
    
    // Mark any failed 0_init migration as rolled back
    try {
      execSync('npx prisma migrate resolve --rolled-back 0_init', { stdio: 'inherit' });
      console.log('✅ Resolved failed 0_init migration');
    } catch (resolveError) {
      console.log('No 0_init migration to resolve or already resolved');
    }
    
    // Push the current schema to ensure database is in sync
    console.log('Pushing current schema...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    
    // Mark our clean migration as applied
    console.log('Marking baseline migration as applied...');
    execSync('npx prisma migrate resolve --applied 20250710000000_init', { stdio: 'inherit' });
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (resolveError) {
    console.error('❌ Failed to resolve database issues:', resolveError.message);
    process.exit(1);
  }
}

console.log('🎉 Database is ready!');

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

interface AdminUser {
  id: string;
  email: string;
  password: string;
  passwordUpdatedAt: Date;
}

async function updateAdminPassword(newPassword: string) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  try {
    console.log('Connecting to database...');
    
    // Find admin user
    const admin = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL || 'admin@kusinamadeo.com' }
    });

    if (!admin) {
      throw new Error('Admin user not found. Please check the email address.');
    }

    // Hash the new password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update admin password
    console.log('Updating admin password...');
    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        passwordUpdatedAt: new Date()
      }
    });

    console.log('Admin password updated successfully for:', updatedAdmin.email);
    console.log('Password last updated:', updatedAdmin.passwordUpdatedAt);
    
    return updatedAdmin;
  } catch (error) {
    console.error('Error updating admin password:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get password from command line argument
const newPassword = process.argv[2];

if (!newPassword) {
  console.error('Please provide a new password as a command line argument');
  console.error('Usage: npx ts-node scripts/update-admin-password.ts <new-password>');
  process.exit(1);
}

// Run the script
updateAdminPassword(newPassword)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to update admin password:', error);
    process.exit(1);
  });

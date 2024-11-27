import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@kusinamadeo.com' }
    });

    if (!existingAdmin) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Create admin user
      const admin = await prisma.user.create({
        data: {
          email: 'admin@kusinamadeo.com',
          password: hashedPassword,
          name: 'Admin',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('Admin user created successfully:', admin.email);
    } else {
      console.log('Admin user already exists:', existingAdmin.email);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminUser();

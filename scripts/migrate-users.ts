import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();

// Connect to MongoDB using Mongoose
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Get the User model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  address: String,
  phone: String,
  lastLogin: Date,
  loginCount: Number,
  passwordUpdatedAt: Date,
  failedLoginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
});

const User = mongoose.model('User', UserSchema);

async function migrateUsers() {
  try {
    // Get all users from Mongoose
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    // Migrate each user to Prisma
    for (const user of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || '' }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email || '',
            password: user.password || '',
            name: user.name || '',
            role: (user.role as 'admin' | 'user') || 'user',
            address: user.address || undefined,
            phone: user.phone || undefined,
            lastLogin: user.lastLogin || undefined,
            loginCount: user.loginCount || 0,
            passwordUpdatedAt: user.passwordUpdatedAt || undefined,
            failedLoginAttempts: user.failedLoginAttempts || 0,
            lockUntil: user.lockUntil || undefined,
            createdAt: user.createdAt || new Date(),
            updatedAt: user.updatedAt || new Date()
          }
        });
        console.log(`Migrated user: ${user.email}`);
      } else {
        console.log(`User already exists in Prisma: ${user.email}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
  }
}

// Run the migration
connectToMongoDB()
  .then(() => migrateUsers())
  .catch(console.error);

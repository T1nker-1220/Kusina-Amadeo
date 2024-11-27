import dbConnect from '../src/lib/mongodb';
import User from '../src/models/user';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables
config();

async function createTestUser() {
  try {
    await dbConnect();
    
    const testUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('Test@123', 12),
      name: 'Test User',
      role: 'user',
    };

    // Check if user exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create new user
    await User.create(testUser);
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();

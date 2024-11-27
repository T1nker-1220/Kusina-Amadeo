require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testMongoDBConnection() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log('MongoDB Connected Successfully!');
    console.log('Connection Details:', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });

    // Test creating a temporary collection
    const db = mongoose.connection.db;
    await db.createCollection('test_connection');
    console.log('Successfully created test collection');
    await db.dropCollection('test_connection');
    console.log('Successfully dropped test collection');

    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

testMongoDBConnection();

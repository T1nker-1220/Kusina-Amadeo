const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected Successfully!');
    console.log('Connection Details:', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
    });
    process.exit(0);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

testConnection();

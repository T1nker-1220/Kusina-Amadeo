require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    // Test querying the products collection
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products in the database`);
    console.log('Sample product:', products[0]);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();

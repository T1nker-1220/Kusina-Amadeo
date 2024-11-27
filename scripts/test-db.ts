import { connectToDatabase } from '../src/lib/db';
import Product from '../src/models/Product';

async function testConnection() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB successfully');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testConnection();

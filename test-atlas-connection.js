const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://kusinadeamadeo:kusina1234@kusinacluster.lxq4c.mongodb.net/kusina-amadeo?retryWrites=true&w=majority';

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');

    // Get database and collection information
    const db = client.db('kusina-amadeo');
    const collections = await db.listCollections().toArray();
    
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Test reading from users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`\nNumber of users in database: ${usersCount}`);

    // Test reading from products collection
    const productsCount = await db.collection('products').countDocuments();
    console.log(`Number of products in database: ${productsCount}`);

  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('\nConnection closed.');
  }
}

testConnection();

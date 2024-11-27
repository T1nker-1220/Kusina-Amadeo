const { MongoClient } = require('mongodb');

async function main() {
    const uri = 'mongodb+srv://kusina-admin:BonszPIT5RhwZgjx@kusinacluster.lxq4c.mongodb.net/?retryWrites=true&w=majority&appName=KusinaCluster';
    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected successfully!');
        
        // List databases to verify connection
        const dbs = await client.db().admin().listDatabases();
        console.log('Available databases:');
        dbs.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (err) {
        console.error('Connection error:', err);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

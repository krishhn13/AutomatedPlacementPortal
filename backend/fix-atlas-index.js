const mongoose = require('mongoose');
require('dotenv').config();

async function fixCompanyCollection() {
    try {
        console.log('🔗 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Get the native MongoDB client
        const client = mongoose.connection.getClient();
        const db = client.db();
        const companiesCollection = db.collection('companies');
        
        console.log('📋 Checking current indexes...');
        
        // Correct method for getting indexes
        const indexes = await companiesCollection.indexes();
        
        console.log('Current indexes in companies collection:');
        indexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, index.key);
        });

        // Drop the problematic id_1 index if it exists
        const idIndex = indexes.find(index => index.name === 'id_1');
        if (idIndex) {
            console.log('🗑️  Dropping id_1 index...');
            await companiesCollection.dropIndex('id_1');
            console.log('✅ Successfully dropped id_1 index');
        } else {
            console.log('ℹ️  id_1 index not found - might already be removed');
        }

        // Check for any other indexes on 'id' field
        const problematicIndexes = indexes.filter(index => 
            index.key && index.key.id && index.name !== '_id_'
        );
        
        if (problematicIndexes.length > 0) {
            console.log('⚠️  Found other problematic indexes:');
            problematicIndexes.forEach(index => {
                console.log(`   - ${index.name}:`, index.key);
            });
            
            // Drop all problematic indexes
            for (const index of problematicIndexes) {
                console.log(`🗑️  Dropping ${index.name} index...`);
                await companiesCollection.dropIndex(index.name);
                console.log(`✅ Dropped ${index.name}`);
            }
        }

        // Create only the necessary indexes
        console.log('🔧 Ensuring proper indexes...');
        try {
            await companiesCollection.createIndex({ email: 1 }, { unique: true });
            console.log('✅ Email index created/verified');
        } catch (e) {
            if (e.code === 85) { // Index already exists
                console.log('ℹ️  Email index already exists');
            } else {
                console.log('⚠️  Error creating email index:', e.message);
            }
        }

        // Final verification
        console.log('📋 Final index state:');
        const finalIndexes = await companiesCollection.indexes();
        finalIndexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, index.key);
        });

        console.log('🎉 Company collection fixed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing company collection:', error);
        
        if (error.codeName === 'IndexNotFound') {
            console.log('ℹ️  Index already removed');
        } else if (error.message.includes('unauthorized')) {
            console.log('❌ Authentication failed. Check your MongoDB Atlas credentials in .env file');
        } else if (error.code === 13) {
            console.log('❌ Permission denied. Check your Atlas user permissions.');
        } else {
            console.log('❌ Error details:', error.message);
        }
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
}

// Run if called directly
if (require.main === module) {
    fixCompanyCollection().then(() => process.exit(0));
}

module.exports = { fixCompanyCollection };
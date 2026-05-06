const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ai-travel-planner')
  .then(async () => {
    console.log('Connected to MongoDB (ai-travel-planner)');
    
    // Explicitly reference the collections without requiring the models
    // to avoid potential errors if we don't have the exact model file paths.
    const db = mongoose.connection.db;
    
    // Get collections
    const collections = await db.listCollections().toArray();
    console.log('\n--- COLLECTIONS ---');
    collections.forEach(c => console.log(`- ${c.name}`));
    
    // For each collection, print up to 5 documents
    for (let c of collections) {
      console.log(`\n--- CONTENTS OF ${c.name.toUpperCase()} ---`);
      const docs = await db.collection(c.name).find({}).limit(5).toArray();
      if (docs.length === 0) {
        console.log('(No documents found)');
      } else {
        console.log(JSON.stringify(docs, null, 2));
      }
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkCollections = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결 성공\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 MongoDB 컬렉션 목록:\n');
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name}: ${count}개 문서`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
};

checkCollections();

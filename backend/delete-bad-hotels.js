const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Hotel = require('./src/models/Hotel');
const Room = require('./src/models/Room');

const deleteBadImageHotels = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/hotelhub';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결 성공\n');

    // 문제의 이미지 URL
    const badImageUrl = 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c';

    // 해당 이미지를 포함한 호텔 찾기
    const hotelsToDelete = await Hotel.find({
      images: { $regex: badImageUrl }
    });

    console.log(`🔍 찾은 호텔: ${hotelsToDelete.length}개`);
    hotelsToDelete.forEach(hotel => {
      console.log(`   - ${hotel.name} (${hotel.location.city})`);
    });

    if (hotelsToDelete.length > 0) {
      // 해당 호텔들의 객실도 삭제
      const hotelIds = hotelsToDelete.map(h => h._id);
      const deletedRooms = await Room.deleteMany({ hotel: { $in: hotelIds } });
      console.log(`\n🗑️  삭제된 객실: ${deletedRooms.deletedCount}개`);

      // 호텔 삭제
      const deletedHotels = await Hotel.deleteMany({
        images: { $regex: badImageUrl }
      });
      console.log(`🗑️  삭제된 호텔: ${deletedHotels.deletedCount}개\n`);

      console.log('✅ 삭제 완료!');
    } else {
      console.log('\n✅ 삭제할 호텔이 없습니다.');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
};

deleteBadImageHotels();

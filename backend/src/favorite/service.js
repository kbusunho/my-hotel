const Favorite = require('./model');
const Room = require('../room/model');

class FavoriteService {
  // 내 찜 목록
  async getMyFavorites(userId) {
    return await Favorite.find({ user: userId })
      .populate({
        path: 'hotel',
        populate: { path: 'owner', select: 'name' }
      })
      .sort('-createdAt');
  }

  // 찜 추가
  async addFavorite(userId, hotelId) {
    // 이미 찜했는지 확인
    const existing = await Favorite.findOne({ 
      user: userId, 
      hotel: hotelId 
    });

    if (existing) {
      throw new Error('이미 찜한 호텔입니다.');
    }

    const favorite = new Favorite({
      user: userId,
      hotel: hotelId
    });

    await favorite.save();
    await favorite.populate('hotel');

    return favorite;
  }

  // 찜 삭제
  async removeFavorite(userId, hotelId) {
    await Favorite.findOneAndDelete({
      user: userId,
      hotel: hotelId
    });

    return { message: '찜이 삭제되었습니다.' };
  }

  // 가격 알림 설정
  async setPriceAlert(userId, hotelId, alertData) {
    const { enabled, targetPrice } = alertData;

    const favorite = await Favorite.findOneAndUpdate(
      { user: userId, hotel: hotelId },
      {
        'priceAlert.enabled': enabled,
        'priceAlert.targetPrice': targetPrice
      },
      { new: true }
    ).populate('hotel');

    if (!favorite) {
      throw new Error('찜을 찾을 수 없습니다.');
    }

    return favorite;
  }

  // 가격 알림 확인 (스케줄러용)
  async checkPriceAlerts() {
    const favorites = await Favorite.find({
      'priceAlert.enabled': true
    }).populate('hotel');

    const alerts = [];

    for (const favorite of favorites) {
      if (!favorite.hotel) continue;

      // 호텔의 최저가 객실 찾기
      const cheapestRoom = await Room.findOne({ 
        hotel: favorite.hotel._id,
        availableRooms: { $gt: 0 }
      }).sort('price');

      if (cheapestRoom && cheapestRoom.price <= favorite.priceAlert.targetPrice) {
        const lastNotified = favorite.priceAlert.lastNotified;
        const hoursSinceLastNotified = lastNotified 
          ? (Date.now() - lastNotified.getTime()) / (1000 * 60 * 60)
          : 999;

        // 24시간에 한 번만 알림
        if (hoursSinceLastNotified >= 24) {
          alerts.push({
            userId: favorite.user,
            hotelId: favorite.hotel._id,
            hotelName: favorite.hotel.name,
            currentPrice: cheapestRoom.price,
            targetPrice: favorite.priceAlert.targetPrice
          });

          // 알림 시간 업데이트
          favorite.priceAlert.lastNotified = new Date();
          await favorite.save();
        }
      }
    }

    return alerts;
  }
}

module.exports = new FavoriteService();

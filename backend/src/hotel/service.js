const Hotel = require('./model');
const Room = require('../room/model');

class HotelService {
  // 호텔 검색
  async searchHotels(filters) {
    const {  city, checkIn, checkOut, guests, hotelType, amenities, rating,
      roomType, bedType, viewType
    } = filters;
    
    const query = { status: 'active' };
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (hotelType) query.hotelType = hotelType;
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $all: amenitiesArray };
    }
    if (rating) query.rating = { $gte: parseFloat(rating) };

    const hotels = await Hotel.find(query)
      .populate('owner', 'name email')
      .sort('-rating');

    const hotelsWithPrice = await Promise.all(
      hotels.map(async (hotel) => {
        const roomQuery = { 
          hotel: hotel._id, 
          status: 'available',
          availableRooms: { $gt: 0 }
        };
        if (roomType) roomQuery.roomType = roomType;
        if (bedType) roomQuery.bedType = bedType;
        if (viewType) roomQuery.viewType = viewType;

        const rooms = await Room.find(roomQuery).sort('price').limit(1);
        if (!rooms || rooms.length === 0) return null;

        return {
          ...hotel.toObject(),
          minPrice: rooms[0].price
        };
      })
    );

    return hotelsWithPrice.filter(hotel => hotel !== null);
  }

  // 호텔 상세 정보
  async getHotelById(hotelId) {
    const hotel = await Hotel.findById(hotelId).populate('owner', 'name email');
    if (!hotel) throw new Error('호텔을 찾을 수 없습니다.');

    const rooms = await Room.find({ hotel: hotel._id, status: 'available' });
    return { hotel, rooms };
  }

  // 추천 호텔
  async getFeaturedHotels() {
    const hotels = await Hotel.find({ status: 'active' }).sort('-rating').limit(8);

    const hotelsWithPrice = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ 
          hotel: hotel._id, 
          status: 'available',
          availableRooms: { $gt: 0 }
        }).sort('price').limit(1);
        
        return {
          ...hotel.toObject(),
          minPrice: rooms.length > 0 ? rooms[0].price : null
        };
      })
    );

    return hotelsWithPrice;
  }
}

module.exports = new HotelService();

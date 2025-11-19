const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// 호텔 검색
router.get('/search', async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests } = req.query;
    
    const query = { status: 'active' };
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const hotels = await Hotel.find(query)
      .populate('owner', 'name email')
      .sort('-rating');

    // 각 호텔의 최저가 정보 추가
    const hotelsWithPrice = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ 
          hotel: hotel._id, 
          status: 'available',
          availableRooms: { $gt: 0 }
        }).sort('price').limit(1);
        
        return {
          ...hotel.toObject(),
          minPrice: rooms.length > 0 ? rooms[0].price : 0
        };
      })
    );

    res.json(hotelsWithPrice);
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ message: '호텔 검색 중 오류가 발생했습니다.', error: error.message });
  }
});

// 호텔 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }

    // 객실 정보 가져오기
    const rooms = await Room.find({ hotel: hotel._id, status: 'available' });

    res.json({ hotel, rooms });
  } catch (error) {
    console.error('Hotel detail error:', error);
    res.status(500).json({ message: '호텔 정보를 불러오는 중 오류가 발생했습니다.', error: error.message });
  }
});

// 추천 호텔
router.get('/featured/list', async (req, res) => {
  try {
    const hotels = await Hotel.find({ status: 'active' })
      .sort('-rating')
      .limit(8);

    // 각 호텔의 최저가 정보 추가
    const hotelsWithPrice = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ 
          hotel: hotel._id, 
          status: 'available',
          availableRooms: { $gt: 0 }
        }).sort('price').limit(1);
        
        return {
          ...hotel.toObject(),
          minPrice: rooms.length > 0 ? rooms[0].price : 0
        };
      })
    );

    res.json(hotelsWithPrice);
  } catch (error) {
    res.status(500).json({ message: '추천 호텔을 불러오는 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

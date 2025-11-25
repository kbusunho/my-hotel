const express = require('express');
const router = express.Router();
const hotelController = require('./controller');

// 호텔 검색
router.get('/search', hotelController.searchHotels);

// 추천 호텔
router.get('/featured/list', hotelController.getFeaturedHotels);

// 호텔 상세 정보
router.get('/:id', hotelController.getHotelById);

module.exports = router;

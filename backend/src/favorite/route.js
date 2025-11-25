const express = require('express');
const router = express.Router();
const favoriteController = require('./controller');
const { authenticate } = require('../common/authMiddleware');

// 내 찜 목록
router.get('/my', authenticate, favoriteController.getMyFavorites);

// 찜 추가
router.post('/', authenticate, favoriteController.addFavorite);

// 찜 삭제
router.delete('/:hotelId', authenticate, favoriteController.removeFavorite);

// 가격 알림 설정
router.put('/:hotelId/price-alert', authenticate, favoriteController.setPriceAlert);

// 가격 알림 확인 (스케줄러용)
router.get('/check-price-alerts', favoriteController.checkPriceAlerts);

module.exports = router;

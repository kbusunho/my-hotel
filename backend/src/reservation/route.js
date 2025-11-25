const express = require('express');
const router = express.Router();
const reservationController = require('./controller');
const { authenticate } = require('../common/authMiddleware');

// 예약 생성
router.post('/', authenticate, reservationController.createBooking);

// 내 예약 목록
router.get('/my', authenticate, reservationController.getMyBookings);

// 사업자 예약 목록
router.get('/business/my', authenticate, reservationController.getBusinessBookings);

// 예약 상세
router.get('/:id', authenticate, reservationController.getBookingById);

// 예약 취소
router.put('/:id/cancel', authenticate, reservationController.cancelBooking);

module.exports = router;

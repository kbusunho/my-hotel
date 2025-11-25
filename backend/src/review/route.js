const express = require('express');
const router = express.Router();
const reviewController = require('./controller');
const { authenticate } = require('../common/authMiddleware');

// 리뷰 작성
router.post('/', authenticate, reviewController.createReview);

// 호텔 리뷰 목록
router.get('/hotel/:hotelId', reviewController.getHotelReviews);

// 리뷰 수정
router.put('/:id', authenticate, reviewController.updateReview);

// 리뷰 삭제
router.delete('/:id', authenticate, reviewController.deleteReview);

// 리뷰 신고
router.post('/:id/report', authenticate, reviewController.reportReview);

module.exports = router;

const express = require('express');
const router = express.Router();
const couponController = require('./controller');
const { authenticate, authorize } = require('../common/authMiddleware');

// 쿠폰 목록 (호텔별 필터링)
router.get('/', couponController.getCoupons);

// 쿠폰 코드로 조회 (호텔별 검증)
router.get('/code/:code', couponController.getCouponByCode);

// 쿠폰 생성 (관리자)
router.post('/', authenticate, authorize('admin'), couponController.createCoupon);

// 쿠폰 수정 (관리자)
router.put('/:id', authenticate, authorize('admin'), couponController.updateCoupon);

// 쿠폰 삭제 (관리자)
router.delete('/:id', authenticate, authorize('admin'), couponController.deleteCoupon);

module.exports = router;

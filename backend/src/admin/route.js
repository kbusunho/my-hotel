const express = require('express');
const router = express.Router();
const adminController = require('./controller');
const { authenticate, authorize } = require('../common/authMiddleware');

// 모든 라우트에 관리자 권한 체크
router.use(authenticate, authorize('admin'));

// 대시보드
router.get('/dashboard/stats', adminController.getDashboardStats);

// 사업자 관리
router.get('/business', adminController.getBusinessUsers);
router.put('/business/:id/approve', adminController.approveBusiness);
router.put('/business/:id/reject', adminController.rejectBusiness);
router.put('/business/:id/block', adminController.blockBusiness);

// 회원 관리
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/unblock', adminController.unblockUser);
router.delete('/users/:id', adminController.deleteUser);

// 신고된 리뷰 관리
router.get('/reviews/reported', adminController.getReportedReviews);
router.put('/reviews/:id/approve', adminController.approveReportedReview);
router.put('/reviews/:id/reject', adminController.rejectReportedReview);

// 전체 리뷰 관리
router.get('/reviews/all', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// 예약 관리
router.get('/bookings', adminController.getBookings);

// 호텔 관리
router.get('/hotels', adminController.getHotels);
router.delete('/hotels/:id', adminController.deleteHotel);

// 호텔 태그 관리
router.put('/hotels/:id/tags/add', adminController.addHotelTags);
router.put('/hotels/:id/tags/remove', adminController.removeHotelTags);

module.exports = router;

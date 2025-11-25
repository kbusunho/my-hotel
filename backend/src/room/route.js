const express = require('express');
const router = express.Router();
const roomController = require('./controller');
const { authenticate, authorize, checkBusinessApproval } = require('../common/authMiddleware');

// 객실 목록 (호텔별)
router.get('/hotel/:hotelId', roomController.getRoomsByHotel);

// 객실 상세
router.get('/:id', roomController.getRoomById);

// 객실 등록 (사업자)
router.post('/', authenticate, authorize('business'), checkBusinessApproval, roomController.createRoom);

// 객실 수정 (사업자)
router.put('/:id', authenticate, authorize('business'), checkBusinessApproval, roomController.updateRoom);

// 객실 삭제 (사업자)
router.delete('/:id', authenticate, authorize('business'), checkBusinessApproval, roomController.deleteRoom);

module.exports = router;

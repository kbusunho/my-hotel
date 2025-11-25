const express = require('express');
const router = express.Router();
const userController = require('./controller');
const { authenticate } = require('../common/authMiddleware');

// 내 정보 조회
router.get('/me', authenticate, userController.getMe);

// 내 정보 수정
router.put('/me', authenticate, userController.updateMe);

// 비밀번호 변경
router.put('/me/password', authenticate, userController.changePassword);

// 찜 목록 추가/제거
router.post('/favorites/:hotelId', authenticate, userController.toggleFavorite);

// 회원탈퇴
router.delete('/me', authenticate, userController.deleteAccount);

module.exports = router;

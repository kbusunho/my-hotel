const express = require('express');
const router = express.Router();
const paymentController = require('./controller');
const { authenticate } = require('../common/authMiddleware');

// 결제 카드 등록
router.post('/cards', authenticate, paymentController.registerCard);

// 등록된 카드 목록 조회
router.get('/cards', authenticate, paymentController.getCards);

// 카드 삭제
router.delete('/cards/:cardId', authenticate, paymentController.deleteCard);

// 기본 카드 설정
router.patch('/cards/:cardId/default', authenticate, paymentController.setDefaultCard);

// Toss Payments 결제 승인
router.post('/confirm', authenticate, paymentController.confirmPayment);

// 결제 취소 (환불)
router.post('/cancel', authenticate, paymentController.cancelPayment);

module.exports = router;

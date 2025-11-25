const express = require('express');
const router = express.Router();
const authController = require('./controller');

// 회원가입
router.post('/register', authController.register);

// 로그인
router.post('/login', authController.login);

// 이메일 찾기
router.post('/find-email', authController.findEmail);

// 비밀번호 찾기 (이메일 발송)
router.post('/forgot-password', authController.forgotPassword);

// 비밀번호 재설정
router.post('/reset-password', authController.resetPassword);

module.exports = router;

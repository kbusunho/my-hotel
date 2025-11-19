const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: '올바른 이메일 형식이 아닙니다.' });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    // 사용자 생성
    const user = new User({
      email,
      password,
      name,
      phone,
      role: role || 'user',
      businessStatus: role === 'business' ? 'pending' : null
    });

    await user.save();

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.', error: error.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('로그인 시도:', email);

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      console.log('사용자를 찾을 수 없음:', email);
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    console.log('사용자 찾음:', user.email, '저장된 비밀번호:', user.password);

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    console.log('비밀번호 일치 여부:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessStatus: user.businessStatus,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
});

// 카카오 로그인 콜백
router.get('/kakao/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // 카카오 토큰 받기
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code
      }
    });

    const { access_token } = tokenResponse.data;

    // 카카오 사용자 정보 받기
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const kakaoUser = userResponse.data;
    const email = kakaoUser.kakao_account.email;

    // 사용자 찾기 또는 생성
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        password: Math.random().toString(36),
        name: kakaoUser.properties.nickname,
        phone: '',
        role: 'user'
      });
      await user.save();
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 프론트엔드로 리다이렉트
    res.redirect(`${process.env.FRONT_ORIGIN}/auth/kakao/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONT_ORIGIN}/login?error=kakao_login_failed`);
  }
});

module.exports = router;

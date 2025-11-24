const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');

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

// 이메일 찾기 (이름과 전화번호로)
router.post('/find-email', async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: '이름과 전화번호를 입력해주세요.' });
    }

    const user = await User.findOne({ name, phone });
    
    if (!user) {
      return res.status(404).json({ message: '일치하는 회원 정보를 찾을 수 없습니다.' });
    }

    // 이메일 일부 마스킹 (앞 3자리만 표시)
    const email = user.email;
    const [localPart, domain] = email.split('@');
    const maskedEmail = localPart.length > 3 
      ? localPart.slice(0, 3) + '*'.repeat(localPart.length - 3) + '@' + domain
      : email;

    res.json({ 
      email: user.email,
      maskedEmail: maskedEmail,
      message: '이메일을 찾았습니다.' 
    });
  } catch (error) {
    console.error('Find email error:', error);
    res.status(500).json({ message: '이메일 찾기 중 오류가 발생했습니다.' });
  }
});

// 비밀번호 찾기 (이메일 발송)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // 보안상 이유로 사용자가 존재하지 않아도 성공 메시지 반환
      return res.json({ message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' });
    }

    // 재설정 토큰 생성 (1시간 유효)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1시간

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // 이메일 발송
    const resetUrl = `${process.env.FRONT_ORIGIN}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: '[HotelHub] 비밀번호 재설정 요청',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">비밀번호 재설정</h2>
          <p>안녕하세요, ${user.name}님</p>
          <p>비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              비밀번호 재설정
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            이 링크는 1시간 동안만 유효합니다.<br>
            비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시해주세요.
          </p>
        </div>
      `
    });

    res.json({ message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: '이메일 발송 중 오류가 발생했습니다.' });
  }
});

// 비밀번호 재설정
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // 토큰으로 사용자 찾기
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: '유효하지 않거나 만료된 링크입니다.' });
    }

    // 비밀번호 업데이트
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 확인 이메일 발송
    await sendEmail({
      to: user.email,
      subject: '[HotelHub] 비밀번호가 변경되었습니다',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">비밀번호 변경 완료</h2>
          <p>안녕하세요, ${user.name}님</p>
          <p>비밀번호가 성공적으로 변경되었습니다.</p>
          <p style="color: #666; font-size: 14px;">
            만약 본인이 변경하지 않았다면 즉시 고객센터로 연락해주세요.
          </p>
        </div>
      `
    });

    res.json({ message: '비밀번호가 재설정되었습니다.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: '비밀번호 재설정 중 오류가 발생했습니다.' });
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

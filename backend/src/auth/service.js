const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./model');
const { sendEmail } = require('../utils/emailService');

class AuthService {
  // 회원가입
  async register(userData) {
    const { email, password, name, phone, role } = userData;

    // 필수 필드 검증
    if (!email || !password || !name || !phone) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('올바른 이메일 형식이 아닙니다.');
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('이미 등록된 이메일입니다.');
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
    return { message: '회원가입이 완료되었습니다.' };
  }

  // 로그인
  async login(email, password) {
    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // 차단된 계정 확인
    if (user.isBlocked) {
      throw new Error('차단된 계정입니다.');
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessStatus: user.businessStatus,
        points: user.points
      }
    };
  }

  // 이메일 찾기
  async findEmail(name, phone) {
    if (!name || !phone) {
      throw new Error('이름과 전화번호를 입력해주세요.');
    }

    const user = await User.findOne({ name, phone });
    
    if (!user) {
      throw new Error('일치하는 회원 정보를 찾을 수 없습니다.');
    }

    // 이메일 일부 마스킹
    const email = user.email;
    const [localPart, domain] = email.split('@');
    const maskedEmail = localPart.length > 3 
      ? localPart.slice(0, 3) + '*'.repeat(localPart.length - 3) + '@' + domain
      : email;

    return { 
      email: user.email,
      maskedEmail,
      message: '이메일을 찾았습니다.' 
    };
  }

  // 비밀번호 재설정 요청
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // 보안상 이유로 사용자가 없어도 성공 메시지 반환
      return { message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' };
    }

    // 재설정 토큰 생성 (1시간 유효)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

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

    return { message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' };
  }

  // 비밀번호 재설정
  async resetPassword(token, password) {
    if (!token || !password) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    if (password.length < 6) {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
    }

    // 토큰으로 사용자 찾기
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('유효하지 않거나 만료된 링크입니다.');
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

    return { message: '비밀번호가 재설정되었습니다.' };
  }
}

module.exports = new AuthService();

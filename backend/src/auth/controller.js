const authService = require('./service');
const { logActivity } = require('../utils/activityLogger');

class AuthController {
  // 회원가입
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Register error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // 로그인
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      // 로그인 활동 로그 기록
      await logActivity({
        userId: result.user.id,
        action: 'login',
        details: { email },
        req
      });
      
      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: error.message });
    }
  }

  // 이메일 찾기
  async findEmail(req, res) {
    try {
      const { name, phone } = req.body;
      const result = await authService.findEmail(name, phone);
      res.json(result);
    } catch (error) {
      console.error('Find email error:', error);
      res.status(404).json({ message: error.message });
    }
  }

  // 비밀번호 찾기
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: '이메일 발송 중 오류가 발생했습니다.' });
    }
  }

  // 비밀번호 재설정
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      res.json(result);
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();

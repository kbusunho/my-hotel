const userService = require('./service');

class UserController {
  // 내 정보 조회
  async getMe(req, res) {
    try {
      const user = await userService.getMe(req.user._id);
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(404).json({ message: error.message });
    }
  }

  // 내 정보 수정
  async updateMe(req, res) {
    try {
      const user = await userService.updateMe(req.user._id, req.body);
      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: '사용자 정보 수정 중 오류가 발생했습니다.' });
    }
  }

  // 비밀번호 변경
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.user._id, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // 찜 목록 토글
  async toggleFavorite(req, res) {
    try {
      const favorites = await userService.toggleFavorite(req.user._id, req.params.hotelId);
      res.json(favorites);
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ message: '찜 목록 업데이트 중 오류가 발생했습니다.' });
    }
  }

  // 회원탈퇴
  async deleteAccount(req, res) {
    try {
      const { password } = req.body;
      const result = await userService.deleteAccount(req.user._id, password);
      res.json(result);
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();

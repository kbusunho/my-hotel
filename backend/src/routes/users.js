const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// 내 정보 조회
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favorites', 'name images location rating');

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: '사용자 정보를 불러오는 중 오류가 발생했습니다.', error: error.message });
  }
});

// 내 정보 수정
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '사용자 정보 수정 중 오류가 발생했습니다.' });
  }
});

// 비밀번호 변경
router.put('/me/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: '비밀번호가 변경되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '비밀번호 변경 중 오류가 발생했습니다.' });
  }
});

// 찜 목록 추가/제거
router.post('/favorites/:hotelId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const hotelId = req.params.hotelId;

    const index = user.favorites.indexOf(hotelId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(hotelId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: '찜 목록 업데이트 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

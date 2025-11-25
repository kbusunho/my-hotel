const express = require('express');
const router = express.Router();
const ViewHistory = require('../common/ViewHistoryModel');
const { authenticate } = require('../middleware/auth');

// 조회 이력 추가
router.post('/', authenticate, async (req, res) => {
  try {
    const { hotelId } = req.body;

    // 기존 이력이 있으면 업데이트, 없으면 생성
    const existingView = await ViewHistory.findOne({
      user: req.user._id,
      hotel: hotelId
    });

    if (existingView) {
      existingView.viewedAt = new Date();
      await existingView.save();
      return res.json(existingView);
    }

    const viewHistory = new ViewHistory({
      user: req.user._id,
      hotel: hotelId
    });

    await viewHistory.save();
    res.status(201).json(viewHistory);
  } catch (error) {
    console.error('Add view history error:', error);
    res.status(500).json({ message: '조회 이력 저장 중 오류가 발생했습니다.' });
  }
});

// 최근 본 호텔 목록
router.get('/recent', authenticate, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const viewHistory = await ViewHistory.find({ user: req.user._id })
      .populate('hotel')
      .sort('-viewedAt')
      .limit(limit);

    res.json(viewHistory);
  } catch (error) {
    res.status(500).json({ message: '조회 이력 조회 중 오류가 발생했습니다.' });
  }
});

// 조회 이력 삭제
router.delete('/:hotelId', authenticate, async (req, res) => {
  try {
    await ViewHistory.findOneAndDelete({
      user: req.user._id,
      hotel: req.params.hotelId
    });

    res.json({ message: '조회 이력이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '조회 이력 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

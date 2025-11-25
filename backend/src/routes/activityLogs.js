const express = require('express');
const router = express.Router();
const ActivityLog = require('../common/ActivityLogModel');
const { authenticate, authorize } = require('../middleware/auth');

// 활동 로그 목록 (관리자 전용)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { action, user, startDate, endDate, limit = 100 } = req.query;

    const query = {};
    if (action) query.action = action;
    if (user) query.user = user;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email role')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json(logs);
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({ message: '활동 로그 조회 중 오류가 발생했습니다.' });
  }
});

// 특정 사용자의 활동 로그
router.get('/user/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId })
      .sort('-createdAt')
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: '사용자 활동 로그 조회 중 오류가 발생했습니다.' });
  }
});

// 활동 로그 통계
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const stats = await ActivityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Activity stats error:', error);
    res.status(500).json({ message: '활동 통계 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { authenticate, authorize, checkBusinessApproval } = require('../middleware/auth');

// 객실 목록 (호텔별)
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const rooms = await Room.find({ 
      hotel: req.params.hotelId,
      status: 'available'
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: '객실 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 객실 상세
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hotel');

    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }

    res.json(room);
  } catch (error) {
    console.error('Room detail error:', error);
    res.status(500).json({ message: '객실 정보를 불러오는 중 오류가 발생했습니다.', error: error.message });
  }
});

// 객실 등록 (사업자)
router.post('/', authenticate, authorize('business'), checkBusinessApproval, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: '객실 등록 중 오류가 발생했습니다.' });
  }
});

// 객실 수정 (사업자)
router.put('/:id', authenticate, authorize('business'), checkBusinessApproval, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: '객실 수정 중 오류가 발생했습니다.' });
  }
});

// 객실 삭제 (사업자)
router.delete('/:id', authenticate, authorize('business'), checkBusinessApproval, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: '객실이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '객실 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

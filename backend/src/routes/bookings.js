const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// 예약 생성
router.post('/', authenticate, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, usedCoupons, usedPoints, specialRequests } = req.body;

    // 객실 확인
    const room = await Room.findById(roomId).populate('hotel');
    if (!room || room.availableRooms < 1) {
      return res.status(400).json({ message: '예약 가능한 객실이 없습니다.' });
    }

    // 날짜 계산
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    // 할인 계산
    let discountAmount = usedPoints || 0;
    const finalPrice = totalPrice - discountAmount;

    // 예약 생성
    const booking = new Booking({
      user: req.user._id,
      hotel: room.hotel._id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      discountAmount,
      finalPrice,
      usedCoupons,
      usedPoints,
      specialRequests: specialRequests || '',
      tossOrderId: `ORDER_${Date.now()}_${req.user._id}`
    });

    await booking.save();

    // 객실 재고 감소
    room.availableRooms -= 1;
    await room.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: '예약 생성 중 오류가 발생했습니다.', error: error.message });
  }
});

// 내 예약 목록
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name images location')
      .populate('room', 'name type')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '예약 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 예약 상세
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: '예약 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 예약 취소
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    // 예약 상태 변경
    booking.bookingStatus = 'cancelled';
    await booking.save();

    // 객실 재고 복구
    const room = await Room.findById(booking.room);
    room.availableRooms += 1;
    await room.save();

    // 포인트 환불
    if (booking.usedPoints > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: booking.usedPoints }
      });
    }

    res.json({ message: '예약이 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예약 취소 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const { authenticate } = require('../middleware/auth');
const { sendBookingConfirmation, sendCancellationConfirmation } = require('../utils/emailService');

// 예약 생성
router.post('/', authenticate, async (req, res) => {
  try {
    const { hotel, room, checkIn, checkOut, guests, usedCoupons, usedPoints, specialRequests, totalPrice, finalPrice } = req.body;

    // 객실 확인
    const roomData = await Room.findById(room).populate('hotel');
    if (!roomData || roomData.availableRooms < 1) {
      return res.status(400).json({ message: '예약 가능한 객실이 없습니다.' });
    }

    // 날짜 유효성 검사
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: '체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.' });
    }

    // 가격 계산 (프론트엔드에서 전달받거나 재계산)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const calculatedPrice = totalPrice || (roomData.price * nights);
    const calculatedFinal = finalPrice || calculatedPrice;

    // 예약 생성
    const booking = new Booking({
      user: req.user._id,
      hotel: hotel || roomData.hotel._id,
      room: room,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 2, children: 0 },
      totalPrice: calculatedPrice,
      discountAmount: usedPoints || 0,
      finalPrice: calculatedFinal,
      usedCoupons: usedCoupons || [],
      usedPoints: usedPoints || 0,
      specialRequests: specialRequests || '',
      tossOrderId: `ORDER_${Date.now()}_${req.user._id}`
    });

    await booking.save();

    // 객실 재고 감소
    roomData.availableRooms -= 1;
    await roomData.save();

    // 이메일 발송 (비동기로 처리, 실패해도 예약은 유지)
    try {
      const user = await User.findById(req.user._id);
      const hotel = roomData.hotel;
      await sendBookingConfirmation(booking, user, hotel, roomData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // 이메일 발송 실패는 로그만 남기고 예약은 계속 진행
    }

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

// 사업자 예약 목록 (캘린더용)
router.get('/business/my', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ message: '사업자만 접근 가능합니다.' });
    }

    const { year, month } = req.query;
    
    // 사업자의 호텔 찾기
    const hotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = hotels.map(h => h._id);

    // 쿼리 조건 구성
    const query = { hotel: { $in: hotelIds } };
    
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.checkIn = { $gte: startDate, $lte: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('hotel', 'name')
      .populate('room', 'name type')
      .populate('user', 'name email')
      .sort('checkIn');

    res.json(bookings);
  } catch (error) {
    console.error('Business bookings error:', error);
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
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'business') {
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

    // 취소 이메일 발송
    try {
      const user = await User.findById(req.user._id);
      const hotel = await Hotel.findById(booking.hotel);
      await sendCancellationConfirmation(booking, user, hotel);
    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
    }

    res.json({ message: '예약이 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '예약 취소 중 오류가 발생했습니다.' });
  }
});

// 예약 변경
router.put('/:id/modify', authenticate, async (req, res) => {
  try {
    const { checkIn, checkOut, guests, specialRequests } = req.body;
    const booking = await Booking.findById(req.params.id).populate('room');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    // 변경 이력 저장
    const changes = {};
    if (checkIn && checkIn !== booking.checkIn.toISOString()) {
      changes.checkIn = { from: booking.checkIn, to: new Date(checkIn) };
      booking.checkIn = new Date(checkIn);
    }
    if (checkOut && checkOut !== booking.checkOut.toISOString()) {
      changes.checkOut = { from: booking.checkOut, to: new Date(checkOut) };
      booking.checkOut = new Date(checkOut);
    }
    if (guests) {
      changes.guests = { from: booking.guests, to: guests };
      booking.guests = guests;
    }
    if (specialRequests !== undefined) {
      changes.specialRequests = { from: booking.specialRequests, to: specialRequests };
      booking.specialRequests = specialRequests;
    }

    // 가격 재계산
    if (changes.checkIn || changes.checkOut) {
      const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24));
      booking.totalPrice = booking.room.price * nights;
      booking.finalPrice = booking.totalPrice - booking.discountAmount;
      changes.price = { nights, totalPrice: booking.totalPrice, finalPrice: booking.finalPrice };
    }

    booking.modificationHistory.push({
      modifiedBy: req.user._id,
      changes,
      reason: req.body.reason || '사용자 요청'
    });

    await booking.save();

    res.json({ message: '예약이 변경되었습니다.', booking });
  } catch (error) {
    console.error('Booking modification error:', error);
    res.status(500).json({ message: '예약 변경 중 오류가 발생했습니다.' });
  }
});

// 예약 삭제 (사업자 전용 - 취소된 예약만 삭제 가능)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotel');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 사업자 권한 체크 (자신의 호텔 예약만 삭제 가능)
    if (req.user.role !== 'business' && req.user.role !== 'admin') {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    // 사업자인 경우 자신의 호텔 예약인지 확인
    if (req.user.role === 'business') {
      const hotelOwnerId = booking.hotel.owner?.toString() || booking.hotel.owner;
      if (hotelOwnerId !== req.user._id.toString()) {
        return res.status(403).json({ message: '본인 호텔의 예약만 삭제할 수 있습니다.' });
      }
    }

    // 취소된 예약만 삭제 가능
    if (booking.bookingStatus !== 'cancelled') {
      return res.status(400).json({ message: '취소된 예약만 삭제할 수 있습니다.' });
    }

    // 예약 삭제
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: '예약이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: '예약 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

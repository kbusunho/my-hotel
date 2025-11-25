const Booking = require('./model');
const Room = require('../room/model');
const User = require('../user/model');
const Hotel = require('../hotel/model');
const { sendBookingConfirmation, sendCancellationConfirmation } = require('../utils/emailService');

class ReservationService {
  // 예약 생성
  async createBooking(userId, bookingData, req) {
    const { hotel, room, checkIn, checkOut, guests, usedCoupons, usedPoints, specialRequests, totalPrice, finalPrice } = bookingData;

    // 객실 확인
    const roomData = await Room.findById(room).populate('hotel');
    if (!roomData || roomData.availableRooms < 1) {
      throw new Error('예약 가능한 객실이 없습니다.');
    }

    // 날짜 유효성 검사
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      throw new Error('체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.');
    }

    // 가격 계산
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const calculatedPrice = totalPrice || (roomData.price * nights);
    const calculatedFinal = finalPrice || calculatedPrice;

    // 예약 생성
    const booking = new Booking({
      user: userId,
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
      tossOrderId: `ORDER_${Date.now()}_${userId}`
    });

    await booking.save();

    // 객실 재고 감소
    roomData.availableRooms -= 1;
    await roomData.save();

    // 이메일 발송
    try {
      const user = await User.findById(userId);
      const hotelData = roomData.hotel;
      await sendBookingConfirmation(booking, user, hotelData, roomData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return { booking, roomData };
  }

  // 내 예약 목록
  async getMyBookings(userId) {
    return await Booking.find({ user: userId })
      .populate('hotel', 'name images location')
      .populate('room', 'name type')
      .sort('-createdAt');
  }

  // 사업자 예약 목록
  async getBusinessBookings(userId, filters) {
    const { year, month } = filters;
    
    const hotels = await Hotel.find({ owner: userId });
    const hotelIds = hotels.map(h => h._id);

    const query = { hotel: { $in: hotelIds } };
    
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.$or = [
        { checkIn: { $gte: startDate, $lte: endDate } },
        { checkOut: { $gte: startDate, $lte: endDate } }
      ];
    }

    return await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('hotel', 'name')
      .populate('room', 'name type')
      .sort('checkIn');
  }

  // 예약 상세
  async getBookingById(bookingId) {
    const booking = await Booking.findById(bookingId)
      .populate('hotel')
      .populate('room')
      .populate('user', 'name email phone');

    if (!booking) {
      throw new Error('예약을 찾을 수 없습니다.');
    }

    return booking;
  }

  // 예약 취소
  async cancelBooking(bookingId, userId, userRole) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error('예약을 찾을 수 없습니다.');
    }

    if (booking.user.toString() !== userId.toString() && userRole !== 'business') {
      throw new Error('권한이 없습니다.');
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
      await User.findByIdAndUpdate(userId, {
        $inc: { points: booking.usedPoints }
      });
    }

    // 취소 이메일 발송
    try {
      const user = await User.findById(userId);
      const hotel = await Hotel.findById(booking.hotel);
      await sendCancellationConfirmation(booking, user, hotel);
    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
    }

    return { message: '예약이 취소되었습니다.', refundedPoints: booking.usedPoints };
  }
}

module.exports = new ReservationService();

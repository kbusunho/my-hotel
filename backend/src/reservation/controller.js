const reservationService = require('./service');
const { logActivity } = require('../utils/activityLogger');

class ReservationController {
  // 예약 생성
  async createBooking(req, res) {
    try {
      const { booking, roomData } = await reservationService.createBooking(req.user._id, req.body, req);

      // 활동 로그 기록
      await logActivity({
        userId: req.user._id,
        action: 'booking_created',
        targetModel: 'Booking',
        targetId: booking._id,
        details: {
          hotelName: roomData.hotel.name,
          checkIn: req.body.checkIn,
          checkOut: req.body.checkOut,
          finalPrice: booking.finalPrice
        },
        req
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // 내 예약 목록
  async getMyBookings(req, res) {
    try {
      const bookings = await reservationService.getMyBookings(req.user._id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: '예약 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  }

  // 사업자 예약 목록
  async getBusinessBookings(req, res) {
    try {
      if (req.user.role !== 'business') {
        return res.status(403).json({ message: '사업자만 접근 가능합니다.' });
      }

      const bookings = await reservationService.getBusinessBookings(req.user._id, req.query);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: '예약 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  // 예약 상세
  async getBookingById(req, res) {
    try {
      const booking = await reservationService.getBookingById(req.params.id);
      res.json(booking);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // 예약 취소
  async cancelBooking(req, res) {
    try {
      const result = await reservationService.cancelBooking(req.params.id, req.user._id, req.user.role);

      // 활동 로그 기록
      await logActivity({
        userId: req.user._id,
        action: 'booking_cancelled',
        targetModel: 'Booking',
        targetId: req.params.id,
        details: {
          refundedPoints: result.refundedPoints
        },
        req
      });

      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ReservationController();

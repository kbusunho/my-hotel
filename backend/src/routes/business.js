const express = require('express');
const router = express.Router();
const Hotel = require('../hotel/model');
const Room = require('../room/model');
const Booking = require('../reservation/model');
const Review = require('../review/model');
const Coupon = require('../coupon/model');
const { authenticate, authorize, checkBusinessApproval } = require('../middleware/auth');

// 모든 라우트에 사업자 권한 체크
router.use(authenticate, authorize('business'), checkBusinessApproval);

// 대시보드 통계
router.get('/dashboard/stats', async (req, res) => {
  try {
    // 내 호텔 목록
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    // 총 예약 수
    const totalBookings = await Booking.countDocuments({ 
      hotel: { $in: hotelIds } 
    });

    // 총 매출
    const revenue = await Booking.aggregate([
      { 
        $match: { 
          hotel: { $in: hotelIds },
          paymentStatus: 'completed'
        } 
      },
      { $group: { _id: null, total: { $sum: '$finalPrice' } } }
    ]);
    const totalRevenue = revenue[0]?.total || 0;

    // 리뷰 수
    const totalReviews = await Review.countDocuments({ 
      hotel: { $in: hotelIds },
      status: 'active'
    });

    // 호텔 수
    const totalHotels = myHotels.length;

    res.json({
      totalBookings,
      totalRevenue,
      totalReviews,
      totalHotels
    });
  } catch (error) {
    res.status(500).json({ message: '통계 조회 중 오류가 발생했습니다.' });
  }
});

// 내 호텔 목록
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id })
      .sort('-createdAt');

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: '호텔 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 호텔 등록
router.post('/hotels', async (req, res) => {
  try {
    const hotel = new Hotel({
      ...req.body,
      owner: req.user._id,
      status: 'pending'
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: '호텔 등록 중 오류가 발생했습니다.' });
  }
});

// 호텔 수정
router.put('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ 
      _id: req.params.id,
      owner: req.user._id
    });

    if (!hotel) {
      return res.status(404).json({ message: '호텔을 찾을 수 없습니다.' });
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: '호텔 수정 중 오류가 발생했습니다.' });
  }
});

// 호텔 삭제
router.delete('/hotels/:id', async (req, res) => {
  try {
    await Hotel.findOneAndDelete({ 
      _id: req.params.id,
      owner: req.user._id
    });

    res.json({ message: '호텔이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '호텔 삭제 중 오류가 발생했습니다.' });
  }
});

// 내 객실 목록
router.get('/rooms', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const rooms = await Room.find({ hotel: { $in: hotelIds } })
      .populate('hotel', 'name')
      .sort('-createdAt');

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: '객실 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 예약 관리
router.get('/bookings', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate('user', 'name email phone')
      .populate('hotel', 'name')
      .populate('room', 'name type')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '예약 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 리뷰 관리
router.get('/reviews', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const reviews = await Review.find({ hotel: { $in: hotelIds } })
      .populate('user', 'name')
      .populate('hotel', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: '리뷰 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 매출 통계 (월별)
router.get('/revenue/monthly', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const revenue = await Booking.aggregate([
      {
        $match: {
          hotel: { $in: hotelIds },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$finalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: '매출 통계 조회 중 오류가 발생했습니다.' });
  }
});

// 예약 승인
router.put('/bookings/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotel');
    
    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 권한 체크
    if (booking.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    booking.approvalStatus = 'approved';
    booking.bookingStatus = 'confirmed';
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    await booking.save();

    res.json({ message: '예약이 승인되었습니다.', booking });
  } catch (error) {
    console.error('Booking approval error:', error);
    res.status(500).json({ message: '예약 승인 중 오류가 발생했습니다.' });
  }
});

// 예약 거부
router.put('/bookings/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('hotel');
    
    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 권한 체크
    if (booking.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    booking.approvalStatus = 'rejected';
    booking.bookingStatus = 'rejected';
    booking.rejectionReason = reason || '사업자 승인 거부';
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();
    await booking.save();

    // 객실 재고 복구
    const Room = require('../room/model');
    await Room.findByIdAndUpdate(booking.room, {
      $inc: { availableRooms: 1 }
    });

    res.json({ message: '예약이 거부되었습니다.', booking });
  } catch (error) {
    console.error('Booking rejection error:', error);
    res.status(500).json({ message: '예약 거부 중 오류가 발생했습니다.' });
  }
});

// ==================== 쿠폰 관리 ====================

// 내 쿠폰 목록 조회
router.get('/coupons', async (req, res) => {
  try {
    const myHotels = await Hotel.find({ owner: req.user._id });
    const hotelIds = myHotels.map(h => h._id);

    const coupons = await Coupon.find({
      couponType: 'business',
      hotel: { $in: hotelIds }
    })
      .populate('hotel', 'name')
      .sort('-createdAt');

    res.json(coupons);
  } catch (error) {
    console.error('쿠폰 조회 오류:', error);
    res.status(500).json({ message: '쿠폰 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 생성
router.post('/coupons', async (req, res) => {
  try {
    const { code, name, description, discountType, discountValue, minPurchase, maxDiscount, validFrom, validTo, usageLimit, hotel } = req.body;

    // 호텔 소유권 확인
    const hotelDoc = await Hotel.findOne({
      _id: hotel,
      owner: req.user._id
    });

    if (!hotelDoc) {
      return res.status(403).json({ message: '해당 호텔에 대한 권한이 없습니다.' });
    }

    // 쿠폰 코드 중복 확인
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: '이미 존재하는 쿠폰 코드입니다.' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      name,
      description,
      discountType,
      discountValue,
      minPurchase: minPurchase || 0,
      maxDiscount,
      validFrom,
      validTo,
      usageLimit: usageLimit || 999,
      hotel,
      couponType: 'business',
      createdBy: req.user._id
    });

    await coupon.save();

    res.status(201).json({
      message: '쿠폰이 생성되었습니다.',
      coupon
    });
  } catch (error) {
    console.error('쿠폰 생성 오류:', error);
    res.status(500).json({ message: '쿠폰 생성 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 수정
router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('hotel');

    if (!coupon) {
      return res.status(404).json({ message: '쿠폰을 찾을 수 없습니다.' });
    }

    // 권한 체크
    if (coupon.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    const { name, description, discountType, discountValue, minPurchase, maxDiscount, validFrom, validTo, usageLimit, status } = req.body;

    if (name !== undefined) coupon.name = name;
    if (description !== undefined) coupon.description = description;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minPurchase !== undefined) coupon.minPurchase = minPurchase;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (validFrom !== undefined) coupon.validFrom = validFrom;
    if (validTo !== undefined) coupon.validTo = validTo;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (status !== undefined) coupon.status = status;

    await coupon.save();

    res.json({
      message: '쿠폰이 수정되었습니다.',
      coupon
    });
  } catch (error) {
    console.error('쿠폰 수정 오류:', error);
    res.status(500).json({ message: '쿠폰 수정 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 삭제
router.delete('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('hotel');

    if (!coupon) {
      return res.status(404).json({ message: '쿠폰을 찾을 수 없습니다.' });
    }

    // 권한 체크
    if (coupon.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.json({ message: '쿠폰이 삭제되었습니다.' });
  } catch (error) {
    console.error('쿠폰 삭제 오류:', error);
    res.status(500).json({ message: '쿠폰 삭제 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 활성화/비활성화
router.put('/coupons/:id/toggle', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('hotel');

    if (!coupon) {
      return res.status(404).json({ message: '쿠폰을 찾을 수 없습니다.' });
    }

    // 권한 체크
    if (coupon.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
    await coupon.save();

    res.json({
      message: `쿠폰이 ${coupon.status === 'active' ? '활성화' : '비활성화'}되었습니다.`,
      coupon
    });
  } catch (error) {
    console.error('쿠폰 상태 변경 오류:', error);
    res.status(500).json({ message: '쿠폰 상태 변경 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

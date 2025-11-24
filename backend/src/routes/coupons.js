const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { authenticate, authorize } = require('../middleware/auth');

// 쿠폰 목록 (호텔별 필터링 추가)
router.get('/', async (req, res) => {
  try {
    const { hotelId } = req.query;
    
    const query = {
      status: 'active',
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    };

    // 호텔 ID가 제공된 경우, 해당 호텔 쿠폰 + 전체 쿠폰 조회
    if (hotelId) {
      query.$or = [
        { hotel: hotelId },
        { hotel: null, couponType: 'admin' }
      ];
    } else {
      // 호텔 ID가 없으면 전체 쿠폰만 조회
      query.hotel = null;
      query.couponType = 'admin';
    }

    const coupons = await Coupon.find(query).populate('hotel', 'name');

    res.json(coupons);
  } catch (error) {
    console.error('쿠폰 목록 조회 오류:', error);
    res.status(500).json({ message: '쿠폰 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 코드로 조회 (호텔별 검증 추가)
router.get('/code/:code', async (req, res) => {
  try {
    const { hotelId } = req.query;
    
    const query = {
      code: req.params.code.toUpperCase(),
      status: 'active',
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() }
    };

    // 호텔 ID가 제공된 경우
    if (hotelId) {
      query.$or = [
        { hotel: hotelId },
        { hotel: null, couponType: 'admin' }
      ];
    } else {
      query.hotel = null;
      query.couponType = 'admin';
    }

    const coupon = await Coupon.findOne(query).populate('hotel', 'name');

    if (!coupon) {
      return res.status(404).json({ message: '유효하지 않은 쿠폰이거나 해당 호텔에서 사용할 수 없는 쿠폰입니다.' });
    }

    // 사용 횟수 체크
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: '쿠폰 사용 가능 횟수가 초과되었습니다.' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('쿠폰 조회 오류:', error);
    res.status(500).json({ message: '쿠폰 조회 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 생성 (관리자)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const coupon = new Coupon({
      ...req.body,
      createdBy: req.user._id
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: '쿠폰 생성 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 수정 (관리자)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: '쿠폰 수정 중 오류가 발생했습니다.' });
  }
});

// 쿠폰 삭제 (관리자)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ message: '쿠폰이 비활성화되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '쿠폰 삭제 중 오류가 발생했습니다.' });
  }
});

// 최적 쿠폰 자동 선택 (호텔별 적용)
router.post('/calculate-best', authenticate, async (req, res) => {
  try {
    const { totalPrice, hotelId } = req.body;

    // 사용 가능한 쿠폰 조회 (호텔 쿠폰 + 전체 쿠폰)
    const query = {
      status: 'active',
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() },
      $or: [
        { hotel: hotelId, couponType: 'business' },
        { hotel: null, couponType: 'admin' }
      ]
    };

    const coupons = await Coupon.find(query);

    let bestCoupon = null;
    let maxDiscount = 0;

    for (const coupon of coupons) {
      // 사용 횟수 체크
      if (coupon.usedCount >= coupon.usageLimit) {
        continue;
      }

      // 최소 구매 금액 체크
      if (coupon.minPurchase && totalPrice < coupon.minPurchase) {
        continue;
      }

      let discount = 0;

      if (coupon.discountType === 'percentage') {
        discount = (totalPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else if (coupon.discountType === 'fixed') {
        discount = coupon.discountValue;
      }

      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestCoupon = coupon;
      }
    }

    res.json({
      bestCoupon,
      discount: maxDiscount,
      finalPrice: totalPrice - maxDiscount
    });
  } catch (error) {
    console.error('Calculate best coupon error:', error);
    res.status(500).json({ message: '최적 쿠폰 계산 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

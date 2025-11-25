const Coupon = require('./model');

class CouponService {
  // 쿠폰 목록 (호텔별 필터링)
  async getCoupons(filters) {
    const { hotelId } = filters;
    
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

    return await Coupon.find(query).populate('hotel', 'name');
  }

  // 쿠폰 코드로 조회 (호텔별 검증)
  async getCouponByCode(code, hotelId) {
    const query = {
      code: code.toUpperCase(),
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
      throw new Error('유효하지 않은 쿠폰이거나 해당 호텔에서 사용할 수 없는 쿠폰입니다.');
    }

    // 사용 횟수 체크
    if (coupon.usedCount >= coupon.usageLimit) {
      throw new Error('쿠폰 사용 가능 횟수가 초과되었습니다.');
    }

    return coupon;
  }

  // 쿠폰 생성 (관리자)
  async createCoupon(userId, couponData) {
    const coupon = new Coupon({
      ...couponData,
      createdBy: userId
    });

    await coupon.save();
    return coupon;
  }

  // 쿠폰 수정 (관리자)
  async updateCoupon(couponId, updateData) {
    const coupon = await Coupon.findByIdAndUpdate(
      couponId,
      updateData,
      { new: true }
    );

    if (!coupon) {
      throw new Error('쿠폰을 찾을 수 없습니다.');
    }

    return coupon;
  }

  // 쿠폰 삭제 (관리자)
  async deleteCoupon(couponId) {
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      throw new Error('쿠폰을 찾을 수 없습니다.');
    }

    return { message: '쿠폰이 삭제되었습니다.' };
  }

  // 쿠폰 사용
  async useCoupon(couponId) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new Error('쿠폰을 찾을 수 없습니다.');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new Error('쿠폰 사용 가능 횟수가 초과되었습니다.');
    }

    coupon.usedCount += 1;
    await coupon.save();

    return coupon;
  }
}

module.exports = new CouponService();

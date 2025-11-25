const couponService = require('./service');

class CouponController {
  // 쿠폰 목록
  async getCoupons(req, res) {
    try {
      const coupons = await couponService.getCoupons(req.query);
      res.json(coupons);
    } catch (error) {
      console.error('쿠폰 목록 조회 오류:', error);
      res.status(500).json({ message: '쿠폰 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  }

  // 쿠폰 코드로 조회
  async getCouponByCode(req, res) {
    try {
      const coupon = await couponService.getCouponByCode(req.params.code, req.query.hotelId);
      res.json(coupon);
    } catch (error) {
      console.error('쿠폰 조회 오류:', error);
      if (error.message.includes('유효하지')) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('횟수')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: '쿠폰 조회 중 오류가 발생했습니다.' });
    }
  }

  // 쿠폰 생성
  async createCoupon(req, res) {
    try {
      const coupon = await couponService.createCoupon(req.user._id, req.body);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(500).json({ message: '쿠폰 생성 중 오류가 발생했습니다.' });
    }
  }

  // 쿠폰 수정
  async updateCoupon(req, res) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.json(coupon);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // 쿠폰 삭제
  async deleteCoupon(req, res) {
    try {
      const result = await couponService.deleteCoupon(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new CouponController();

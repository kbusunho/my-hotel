const reviewService = require('./service');
const { logActivity } = require('../utils/activityLogger');

class ReviewController {
  // 리뷰 작성
  async createReview(req, res) {
    try {
      const review = await reviewService.createReview(req.user._id, req.body);

      // 활동 로그 기록
      await logActivity({
        userId: req.user._id,
        action: 'review_created',
        targetModel: 'Review',
        targetId: review._id,
        details: {
          hotelId: req.body.hotel,
          rating: req.body.rating
        },
        req
      });

      res.status(201).json(review);
    } catch (error) {
      console.error('Review creation error:', error);
      res.status(500).json({ message: '리뷰 작성 중 오류가 발생했습니다.' });
    }
  }

  // 호텔 리뷰 목록
  async getHotelReviews(req, res) {
    try {
      const reviews = await reviewService.getHotelReviews(req.params.hotelId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: '리뷰 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  }

  // 리뷰 수정
  async updateReview(req, res) {
    try {
      const review = await reviewService.updateReview(req.params.id, req.user._id, req.body);
      res.json(review);
    } catch (error) {
      console.error('Review update error:', error);
      if (error.message.includes('권한')) {
        return res.status(403).json({ message: error.message });
      }
      res.status(404).json({ message: error.message });
    }
  }

  // 리뷰 삭제
  async deleteReview(req, res) {
    try {
      const result = await reviewService.deleteReview(req.params.id, req.user._id);
      res.json(result);
    } catch (error) {
      console.error('Review delete error:', error);
      if (error.message.includes('권한')) {
        return res.status(403).json({ message: error.message });
      }
      res.status(404).json({ message: error.message });
    }
  }

  // 리뷰 신고
  async reportReview(req, res) {
    try {
      const review = await reviewService.reportReview(req.params.id, req.user._id, req.body.reason);
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: '리뷰 신고 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = new ReviewController();

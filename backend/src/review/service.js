const Review = require('./model');
const Hotel = require('../hotel/model');

class ReviewService {
  // 리뷰 생성
  async createReview(userId, reviewData) {
    const { hotel, rating, comment, images } = reviewData;

    const review = new Review({
      user: userId,
      hotel,
      rating,
      comment,
      images: images || []
    });

    await review.save();

    // 호텔 평점 업데이트
    await this.updateHotelRating(hotel);

    return review;
  }

  // 호텔 리뷰 목록
  async getHotelReviews(hotelId) {
    return await Review.find({ 
      hotel: hotelId,
      status: 'active'
    })
    .populate('user', 'name')
    .sort('-createdAt');
  }

  // 리뷰 수정
  async updateReview(reviewId, userId, updateData) {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    if (review.user.toString() !== userId.toString()) {
      throw new Error('리뷰를 수정할 권한이 없습니다.');
    }

    const { rating, comment, images } = updateData;
    review.rating = rating;
    review.comment = comment;
    if (images !== undefined) review.images = images;
    
    await review.save();

    // 호텔 평점 업데이트
    await this.updateHotelRating(review.hotel);

    return review;
  }

  // 리뷰 삭제
  async deleteReview(reviewId, userId) {
    const review = await Review.findById(reviewId);
    
    if (!review) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    if (review.user.toString() !== userId.toString()) {
      throw new Error('리뷰를 삭제할 권한이 없습니다.');
    }

    const hotelId = review.hotel;
    await Review.findByIdAndDelete(reviewId);

    // 호텔 평점 업데이트
    await this.updateHotelRating(hotelId);

    return { message: '리뷰가 삭제되었습니다.' };
  }

  // 리뷰 신고
  async reportReview(reviewId, userId, reason) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        reported: true,
        reportReason: reason,
        reportedBy: userId,
        reportStatus: 'pending'
      },
      { new: true }
    );

    if (!review) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }

    return review;
  }

  // 호텔 평점 업데이트 헬퍼 메서드
  async updateHotelRating(hotelId) {
    const reviews = await Review.find({ hotel: hotelId, status: 'active' });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    } else {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: 0,
        reviewCount: 0
      });
    }
  }
}

module.exports = new ReviewService();

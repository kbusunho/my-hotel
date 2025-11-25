const User = require('../user/model');
const Hotel = require('../hotel/model');
const Room = require('../room/model');
const Booking = require('../reservation/model');
const Review = require('../review/model');

class AdminService {
  // 대시보드 통계
  async getDashboardStats() {
    const totalBookings = await Booking.countDocuments({ 
      bookingStatus: { $ne: 'cancelled' } 
    });
    
    const revenue = await Booking.aggregate([
      { 
        $match: { 
          bookingStatus: { $ne: 'cancelled' },
          paymentStatus: 'completed' 
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenue[0]?.total || 0;

    const totalBusiness = await User.countDocuments({ role: 'business' });
    const totalHotels = await Hotel.countDocuments();

    return {
      totalBookings,
      totalRevenue,
      totalBusiness,
      totalHotels
    };
  }

  // 사업자 관리
  async getBusinessUsers(filters) {
    const { status, search } = filters;
    
    const query = { role: 'business' };
    if (status) query.businessStatus = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    return await User.find(query).select('-password').sort('-createdAt');
  }

  async approveBusiness(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { businessStatus: 'approved' },
      { new: true }
    ).select('-password');
  }

  async rejectBusiness(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { businessStatus: 'rejected' },
      { new: true }
    ).select('-password');
  }

  async blockBusiness(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { businessStatus: 'blocked' },
      { new: true }
    ).select('-password');

    await Hotel.updateMany(
      { owner: userId },
      { status: 'inactive' }
    );

    return user;
  }

  // 회원 관리
  async getUsers(filters) {
    const { role, search, blocked } = filters;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }
    if (blocked !== undefined) {
      query.isBlocked = blocked === 'true';
    }

    return await User.find(query).select('-password').sort('-createdAt');
  }

  async getUserDetail(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }

    const bookings = await Booking.find({ user: userId })
      .populate('hotel', 'name')
      .populate('room', 'name')
      .sort('-createdAt')
      .limit(10);

    const reviews = await Review.find({ user: userId })
      .populate('hotel', 'name')
      .sort('-createdAt')
      .limit(10);

    let hotels = [];
    if (user.role === 'business') {
      hotels = await Hotel.find({ owner: userId });
    }

    return { user, bookings, reviews, hotels };
  }

  async blockUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }

    if (user.role === 'business') {
      await Hotel.updateMany(
        { owner: userId },
        { status: 'inactive' }
      );
    }

    return user;
  }

  async unblockUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }

    if (user.role === 'business' && user.businessStatus === 'approved') {
      await Hotel.updateMany(
        { owner: userId },
        { status: 'active' }
      );
    }

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }

    if (user.role === 'admin') {
      throw new Error('관리자 계정은 삭제할 수 없습니다.');
    }

    if (user.role === 'business') {
      const hotels = await Hotel.find({ owner: userId });
      for (const hotel of hotels) {
        await Room.deleteMany({ hotel: hotel._id });
      }
      await Hotel.deleteMany({ owner: userId });
    }

    await Booking.deleteMany({ user: userId });
    await Review.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    return { message: '회원이 삭제되었습니다.' };
  }

  // 신고된 리뷰 관리
  async getReportedReviews() {
    return await Review.find({ 
      reported: true,
      reportStatus: 'pending'
    })
    .populate('user', 'name email')
    .populate('hotel', 'name')
    .populate('reportedBy', 'name email')
    .sort('-createdAt');
  }

  async approveReportedReview(reviewId) {
    return await Review.findByIdAndUpdate(
      reviewId,
      { 
        reportStatus: 'approved',
        status: 'hidden'
      },
      { new: true }
    );
  }

  async rejectReportedReview(reviewId) {
    return await Review.findByIdAndUpdate(
      reviewId,
      { reportStatus: 'rejected' },
      { new: true }
    );
  }

  // 전체 리뷰 관리
  async getAllReviews(filters) {
    const { status, search } = filters;
    
    const query = {};
    if (status) query.status = status;
    if (search) {
      const hotels = await Hotel.find({ 
        name: new RegExp(search, 'i') 
      }).select('_id');
      
      query.$or = [
        { comment: new RegExp(search, 'i') },
        { hotel: { $in: hotels.map(h => h._id) } }
      ];
    }

    return await Review.find(query)
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .sort('-createdAt');
  }

  async deleteReview(reviewId) {
    await Review.findByIdAndDelete(reviewId);
    return { message: '리뷰가 삭제되었습니다.' };
  }

  // 예약 관리
  async getBookings(filters) {
    const { status } = filters;
    
    const query = {};
    if (status) query.bookingStatus = status;

    return await Booking.find(query)
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('room', 'name type')
      .sort('-createdAt');
  }

  // 호텔 관리
  async getHotels(filters) {
    const { status } = filters;
    
    const query = {};
    if (status) query.status = status;

    return await Hotel.find(query)
      .populate('owner', 'name email')
      .sort('-createdAt');
  }

  async deleteHotel(hotelId) {
    await Hotel.findByIdAndDelete(hotelId);
    return { message: '호텔이 삭제되었습니다.' };
  }

  // 호텔 태그 관리
  async addHotelTags(hotelId, tags) {
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $addToSet: { tags: { $each: tags } } },
      { new: true }
    );

    if (!hotel) {
      throw new Error('호텔을 찾을 수 없습니다.');
    }

    return hotel;
  }

  async removeHotelTags(hotelId, tags) {
    const hotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { tags: { $in: tags } } },
      { new: true }
    );

    if (!hotel) {
      throw new Error('호텔을 찾을 수 없습니다.');
    }

    return hotel;
  }
}

module.exports = new AdminService();

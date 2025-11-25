const User = require('./model');
const Favorite = require('../favorite/model');
const Booking = require('../reservation/model');

class UserService {
  // 내 정보 조회
  async getMe(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('favorites', 'name images location rating');

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  // 내 정보 수정
  async updateMe(userId, updateData) {
    const { name, phone } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true }
    ).select('-password');

    return user;
  }

  // 비밀번호 변경
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new Error('현재 비밀번호가 일치하지 않습니다.');
    }

    user.password = newPassword;
    await user.save();

    return { message: '비밀번호가 변경되었습니다.' };
  }

  // 찜 목록 토글
  async toggleFavorite(userId, hotelId) {
    const user = await User.findById(userId);
    const index = user.favorites.indexOf(hotelId);
    
    if (index > -1) {
      // 찜 해제
      user.favorites.splice(index, 1);
      await Favorite.findOneAndDelete({ user: userId, hotel: hotelId });
    } else {
      // 찜 추가
      user.favorites.push(hotelId);
      
      const existingFavorite = await Favorite.findOne({ user: userId, hotel: hotelId });
      if (!existingFavorite) {
        await Favorite.create({ user: userId, hotel: hotelId });
      }
    }

    await user.save();
    return user.favorites;
  }

  // 회원탈퇴
  async deleteAccount(userId, password) {
    const user = await User.findById(userId);
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // 진행 중인 예약 확인
    const activeBookings = await Booking.countDocuments({
      user: userId,
      bookingStatus: 'confirmed',
      checkOut: { $gte: new Date() }
    });

    if (activeBookings > 0) {
      throw new Error('진행 중인 예약이 있어 탈퇴할 수 없습니다. 예약을 취소하거나 체크아웃 후 탈퇴해주세요.');
    }

    await User.findByIdAndDelete(userId);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }
}

module.exports = new UserService();

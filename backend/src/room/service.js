const Room = require('./model');

class RoomService {
  // 호텔별 객실 목록
  async getRoomsByHotel(hotelId) {
    return await Room.find({ 
      hotel: hotelId,
      status: 'available'
    });
  }

  // 객실 상세 정보
  async getRoomById(roomId) {
    const room = await Room.findById(roomId).populate('hotel');
    if (!room) {
      throw new Error('객실을 찾을 수 없습니다.');
    }
    return room;
  }

  // 객실 등록
  async createRoom(roomData) {
    const room = new Room(roomData);
    await room.save();
    return room;
  }

  // 객실 수정
  async updateRoom(roomId, updateData) {
    const room = await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    if (!room) {
      throw new Error('객실을 찾을 수 없습니다.');
    }
    return room;
  }

  // 객실 삭제
  async deleteRoom(roomId) {
    await Room.findByIdAndDelete(roomId);
    return { message: '객실이 삭제되었습니다.' };
  }
}

module.exports = new RoomService();

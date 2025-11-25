const roomService = require('./service');

class RoomController {
  // 호텔별 객실 목록
  async getRoomsByHotel(req, res) {
    try {
      const rooms = await roomService.getRoomsByHotel(req.params.hotelId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: '객실 목록을 불러오는 중 오류가 발생했습니다.' });
    }
  }

  // 객실 상세
  async getRoomById(req, res) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      res.json(room);
    } catch (error) {
      console.error('Room detail error:', error);
      res.status(404).json({ message: error.message });
    }
  }

  // 객실 등록
  async createRoom(req, res) {
    try {
      const room = await roomService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ message: '객실 등록 중 오류가 발생했습니다.' });
    }
  }

  // 객실 수정
  async updateRoom(req, res) {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);
      res.json(room);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // 객실 삭제
  async deleteRoom(req, res) {
    try {
      const result = await roomService.deleteRoom(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: '객실 삭제 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = new RoomController();

const hotelService = require('./service');

class HotelController {
  async searchHotels(req, res) {
    try {
      const hotels = await hotelService.searchHotels(req.query);
      res.json(hotels);
    } catch (error) {
      console.error('Hotel search error:', error);
      res.status(500).json({ message: '호텔 검색 중 오류가 발생했습니다.' });
    }
  }

  async getHotelById(req, res) {
    try {
      const result = await hotelService.getHotelById(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('Hotel detail error:', error);
      res.status(404).json({ message: error.message });
    }
  }

  async getFeaturedHotels(req, res) {
    try {
      const hotels = await hotelService.getFeaturedHotels();
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: '추천 호텔을 불러오는 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = new HotelController();

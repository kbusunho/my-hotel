const favoriteService = require('./service');

class FavoriteController {
  // 내 찜 목록
  async getMyFavorites(req, res) {
    try {
      const favorites = await favoriteService.getMyFavorites(req.user._id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: '찜 목록 조회 중 오류가 발생했습니다.' });
    }
  }

  // 찜 추가
  async addFavorite(req, res) {
    try {
      const favorite = await favoriteService.addFavorite(req.user._id, req.body.hotelId);
      res.status(201).json(favorite);
    } catch (error) {
      console.error('Add favorite error:', error);
      if (error.message.includes('이미')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: '찜 추가 중 오류가 발생했습니다.' });
    }
  }

  // 찜 삭제
  async removeFavorite(req, res) {
    try {
      const result = await favoriteService.removeFavorite(req.user._id, req.params.hotelId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: '찜 삭제 중 오류가 발생했습니다.' });
    }
  }

  // 가격 알림 설정
  async setPriceAlert(req, res) {
    try {
      const favorite = await favoriteService.setPriceAlert(req.user._id, req.params.hotelId, req.body);
      res.json({ message: '가격 알림이 설정되었습니다.', favorite });
    } catch (error) {
      console.error('Price alert error:', error);
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: '가격 알림 설정 중 오류가 발생했습니다.' });
    }
  }

  // 가격 알림 확인 (스케줄러용)
  async checkPriceAlerts(req, res) {
    try {
      const alerts = await favoriteService.checkPriceAlerts();
      res.json({ alerts });
    } catch (error) {
      console.error('Check price alerts error:', error);
      res.status(500).json({ message: '가격 알림 확인 중 오류가 발생했습니다.' });
    }
  }
}

module.exports = new FavoriteController();

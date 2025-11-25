const paymentService = require('./service');

class PaymentController {
  // 결제 카드 등록
  async registerCard(req, res) {
    try {
      const data = await paymentService.registerCard(req.user._id, req.body);
      res.json({
        success: true,
        message: '결제 카드가 등록되었습니다.',
        data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: '카드 등록 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  }

  // 등록된 카드 목록 조회
  async getCards(req, res) {
    try {
      const cards = await paymentService.getCards(req.user._id);
      res.json({
        success: true,
        data: cards
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: '카드 목록 조회 중 오류가 발생했습니다.' 
      });
    }
  }

  // 카드 삭제
  async deleteCard(req, res) {
    try {
      const result = await paymentService.deleteCard(req.user._id, req.params.cardId);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({ 
        success: false, 
        message: '카드 삭제 중 오류가 발생했습니다.' 
      });
    }
  }

  // 기본 카드 설정
  async setDefaultCard(req, res) {
    try {
      const result = await paymentService.setDefaultCard(req.user._id, req.params.cardId);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      if (error.message.includes('찾을 수 없습니다')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({ 
        success: false, 
        message: '기본 카드 설정 중 오류가 발생했습니다.' 
      });
    }
  }

  // Toss Payments 결제 승인
  async confirmPayment(req, res) {
    try {
      const data = await paymentService.confirmPayment(req.user._id, req.body);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: '결제 승인 중 오류가 발생했습니다.',
        error: error.response?.data || error.message
      });
    }
  }

  // 결제 취소 (환불)
  async cancelPayment(req, res) {
    try {
      const data = await paymentService.cancelPayment(req.body.paymentKey, req.body.cancelReason);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: '결제 취소 중 오류가 발생했습니다.' 
      });
    }
  }
}

module.exports = new PaymentController();

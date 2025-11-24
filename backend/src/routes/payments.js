const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');

// 카드번호 암호화 함수
const encryptCardNumber = (cardNumber) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.CARD_ENCRYPT_KEY || 'default-32-character-key-12345', 'utf8').slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(cardNumber.replace(/\s/g, ''), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// 카드번호 복호화 함수 (마지막 4자리만 표시용)
const maskCardNumber = (encryptedCard) => {
  try {
    const parts = encryptedCard.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.CARD_ENCRYPT_KEY || 'default-32-character-key-12345', 'utf8').slice(0, 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return '**** **** **** ' + decrypted.slice(-4);
  } catch (error) {
    return '**** **** **** ****';
  }
};

// 결제 카드 등록
router.post('/cards', authenticate, async (req, res) => {
  try {
    const { cardNumber, cardName, expiryDate, country, isDefault } = req.body;

    // 카드번호 암호화
    const encryptedCardNumber = encryptCardNumber(cardNumber);

    const user = await User.findById(req.user._id);
    
    // 기본 카드로 설정 시 기존 기본 카드 해제
    if (isDefault) {
      user.paymentCards.forEach(card => {
        card.isDefault = false;
      });
    }

    // 첫 번째 카드는 자동으로 기본 카드
    const setAsDefault = user.paymentCards.length === 0 ? true : isDefault;

    user.paymentCards.push({
      cardNumber: encryptedCardNumber,
      cardName,
      expiryDate,
      country: country || 'South Korea',
      isDefault: setAsDefault
    });

    await user.save();

    res.json({
      success: true,
      message: '결제 카드가 등록되었습니다.',
      data: {
        cardNumber: maskCardNumber(encryptedCardNumber),
        cardName,
        expiryDate,
        isDefault: setAsDefault
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '카드 등록 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 등록된 카드 목록 조회
router.get('/cards', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const cards = user.paymentCards.map(card => ({
      _id: card._id,
      cardNumber: maskCardNumber(card.cardNumber),
      cardName: card.cardName,
      expiryDate: card.expiryDate,
      country: card.country,
      isDefault: card.isDefault,
      addedAt: card.addedAt
    }));

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
});

// 카드 삭제
router.delete('/cards/:cardId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cardIndex = user.paymentCards.findIndex(card => card._id.toString() === req.params.cardId);

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '카드를 찾을 수 없습니다.'
      });
    }

    const wasDefault = user.paymentCards[cardIndex].isDefault;
    user.paymentCards.splice(cardIndex, 1);

    // 기본 카드를 삭제한 경우 첫 번째 카드를 기본으로 설정
    if (wasDefault && user.paymentCards.length > 0) {
      user.paymentCards[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: '카드가 삭제되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '카드 삭제 중 오류가 발생했습니다.' 
    });
  }
});

// 기본 카드 설정
router.patch('/cards/:cardId/default', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // 모든 카드의 기본 설정 해제
    user.paymentCards.forEach(card => {
      card.isDefault = false;
    });

    // 선택한 카드를 기본으로 설정
    const card = user.paymentCards.id(req.params.cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: '카드를 찾을 수 없습니다.'
      });
    }

    card.isDefault = true;
    await user.save();

    res.json({
      success: true,
      message: '기본 카드가 설정되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '기본 카드 설정 중 오류가 발생했습니다.' 
    });
  }
});

// Toss Payments 결제 승인
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body;

    // Toss Payments API 호출
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      { paymentKey, orderId, amount },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 예약 정보 업데이트
    const booking = await Booking.findOne({ tossOrderId: orderId });
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.tossPaymentKey = paymentKey;
      booking.paymentMethod = response.data.method;
      await booking.save();

      // 포인트 적립 (결제 금액의 1%)
      const earnedPoints = Math.floor(amount * 0.01);
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { points: earnedPoints }
      });
    }

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '결제 승인 중 오류가 발생했습니다.',
      error: error.response?.data || error.message
    });
  }
});

// 결제 취소 (환불)
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { paymentKey, cancelReason } = req.body;

    const response = await axios.post(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      { cancelReason },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 예약 정보 업데이트
    const booking = await Booking.findOne({ tossPaymentKey: paymentKey });
    if (booking) {
      booking.paymentStatus = 'refunded';
      await booking.save();
    }

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '결제 취소 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;

const axios = require('axios');
const crypto = require('crypto');
const Booking = require('../reservation/model');
const User = require('../user/model');

class PaymentService {
  // 카드번호 암호화
  encryptCardNumber(cardNumber) {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.CARD_ENCRYPT_KEY || 'default-32-character-key-12345', 'utf8').slice(0, 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(cardNumber.replace(/\s/g, ''), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // 카드번호 마스킹
  maskCardNumber(encryptedCard) {
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
  }

  // 결제 카드 등록
  async registerCard(userId, cardData) {
    const { cardNumber, cardName, expiryDate, country, isDefault } = cardData;

    const encryptedCardNumber = this.encryptCardNumber(cardNumber);
    const user = await User.findById(userId);
    
    if (isDefault) {
      user.paymentCards.forEach(card => {
        card.isDefault = false;
      });
    }

    const setAsDefault = user.paymentCards.length === 0 ? true : isDefault;

    user.paymentCards.push({
      cardNumber: encryptedCardNumber,
      cardName,
      expiryDate,
      country: country || 'South Korea',
      isDefault: setAsDefault
    });

    await user.save();

    return {
      cardNumber: this.maskCardNumber(encryptedCardNumber),
      cardName,
      expiryDate,
      isDefault: setAsDefault
    };
  }

  // 등록된 카드 목록 조회
  async getCards(userId) {
    const user = await User.findById(userId);
    
    return user.paymentCards.map(card => ({
      _id: card._id,
      cardNumber: this.maskCardNumber(card.cardNumber),
      cardName: card.cardName,
      expiryDate: card.expiryDate,
      country: card.country,
      isDefault: card.isDefault,
      addedAt: card.addedAt
    }));
  }

  // 카드 삭제
  async deleteCard(userId, cardId) {
    const user = await User.findById(userId);
    const cardIndex = user.paymentCards.findIndex(card => card._id.toString() === cardId);

    if (cardIndex === -1) {
      throw new Error('카드를 찾을 수 없습니다.');
    }

    const wasDefault = user.paymentCards[cardIndex].isDefault;
    user.paymentCards.splice(cardIndex, 1);

    if (wasDefault && user.paymentCards.length > 0) {
      user.paymentCards[0].isDefault = true;
    }

    await user.save();
    return { message: '카드가 삭제되었습니다.' };
  }

  // 기본 카드 설정
  async setDefaultCard(userId, cardId) {
    const user = await User.findById(userId);
    
    user.paymentCards.forEach(card => {
      card.isDefault = false;
    });

    const card = user.paymentCards.id(cardId);
    if (!card) {
      throw new Error('카드를 찾을 수 없습니다.');
    }

    card.isDefault = true;
    await user.save();

    return { message: '기본 카드가 설정되었습니다.' };
  }

  // Toss Payments 결제 승인
  async confirmPayment(userId, paymentData) {
    const { paymentKey, orderId, amount } = paymentData;

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

    const booking = await Booking.findOne({ tossOrderId: orderId });
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.tossPaymentKey = paymentKey;
      booking.paymentMethod = response.data.method;
      await booking.save();

      const earnedPoints = Math.floor(amount * 0.01);
      await User.findByIdAndUpdate(userId, {
        $inc: { points: earnedPoints }
      });
    }

    return response.data;
  }

  // 결제 취소 (환불)
  async cancelPayment(paymentKey, cancelReason) {
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

    const booking = await Booking.findOne({ tossPaymentKey: paymentKey });
    if (booking) {
      booking.paymentStatus = 'refunded';
      await booking.save();
    }

    return response.data;
  }
}

module.exports = new PaymentService();

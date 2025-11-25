const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  priceAlert: {
    enabled: {
      type: Boolean,
      default: false
    },
    targetPrice: {
      type: Number
    },
    lastNotified: {
      type: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 사용자당 호텔당 하나의 찜만 가능
favoriteSchema.index({ user: 1, hotel: 1 }, { unique: true });

module.exports = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);

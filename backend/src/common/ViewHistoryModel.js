const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema({
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
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// 최근 조회 순으로 정렬 인덱스
viewHistorySchema.index({ user: 1, viewedAt: -1 });

module.exports = mongoose.models.ViewHistory || mongoose.model('ViewHistory', viewHistorySchema);

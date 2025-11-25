const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_created', 'user_deleted', 'user_blocked', 'user_unblocked',
      'business_approved', 'business_rejected', 'business_blocked',
      'hotel_created', 'hotel_updated', 'hotel_deleted', 'hotel_approved',
      'booking_created', 'booking_cancelled', 'booking_approved', 'booking_rejected',
      'review_created', 'review_deleted', 'review_reported', 'review_approved',
      'coupon_created', 'coupon_updated', 'coupon_deleted',
      'login', 'logout', 'password_changed'
    ]
  },
  targetModel: {
    type: String,
    enum: ['User', 'Hotel', 'Booking', 'Review', 'Coupon', 'Room']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 최근 활동 순으로 정렬 인덱스
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);

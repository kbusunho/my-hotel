const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  // 사이트 기본 설정
  siteName: {
    type: String,
    default: 'HotelHub'
  },
  siteEmail: {
    type: String,
    default: 'admin@hotelhub.com'
  },
  
  // 시스템 모드
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: '시스템 점검 중입니다. 잠시 후 다시 시도해주세요.'
  },
  
  // 기능 활성화 설정
  allowRegistration: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  
  // 포인트 정책
  pointsPerReservation: {
    type: Number,
    default: 1000
  },
  pointsExpirationDays: {
    type: Number,
    default: 365
  },
  
  // 예약 정책
  cancellationDeadlineHours: {
    type: Number,
    default: 24
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// settings는 항상 하나의 문서만 존재
systemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

systemSettingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    settings.updatedAt = Date.now();
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);

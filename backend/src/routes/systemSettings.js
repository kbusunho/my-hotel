const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const SystemSettings = require('../common/SystemSettingsModel');

// GET /api/system-settings - 시스템 설정 조회 (공개)
router.get('/', async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    // 공개 정보만 반환 (민감한 정보 제외)
    res.json({
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      allowRegistration: settings.allowRegistration,
      siteName: settings.siteName
    });
  } catch (error) {
    console.error('시스템 설정 조회 오류:', error);
    res.status(500).json({ error: '시스템 설정을 불러오지 못했습니다.' });
  }
});

// GET /api/system-settings/admin - 전체 시스템 설정 조회 (관리자)
router.get('/admin', authenticate, authorize('admin'), async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('시스템 설정 조회 오류:', error);
    res.status(500).json({ error: '시스템 설정을 불러오지 못했습니다.' });
  }
});

// PUT /api/system-settings - 시스템 설정 수정 (관리자)
router.put('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      siteName,
      siteEmail,
      maintenanceMode,
      maintenanceMessage,
      allowRegistration,
      emailNotifications,
      pointsPerReservation,
      pointsExpirationDays,
      cancellationDeadlineHours
    } = req.body;

    const updates = {};
    if (siteName !== undefined) updates.siteName = siteName;
    if (siteEmail !== undefined) updates.siteEmail = siteEmail;
    if (maintenanceMode !== undefined) updates.maintenanceMode = maintenanceMode;
    if (maintenanceMessage !== undefined) updates.maintenanceMessage = maintenanceMessage;
    if (allowRegistration !== undefined) updates.allowRegistration = allowRegistration;
    if (emailNotifications !== undefined) updates.emailNotifications = emailNotifications;
    if (pointsPerReservation !== undefined) updates.pointsPerReservation = pointsPerReservation;
    if (pointsExpirationDays !== undefined) updates.pointsExpirationDays = pointsExpirationDays;
    if (cancellationDeadlineHours !== undefined) updates.cancellationDeadlineHours = cancellationDeadlineHours;

    const settings = await SystemSettings.updateSettings(updates);

    res.json({
      message: '시스템 설정이 저장되었습니다.',
      settings
    });
  } catch (error) {
    console.error('시스템 설정 수정 오류:', error);
    res.status(500).json({ error: '시스템 설정 저장에 실패했습니다.' });
  }
});

module.exports = router;

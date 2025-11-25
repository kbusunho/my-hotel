const SystemSettings = require('../models/SystemSettings');

// 유지보수 모드 체크 미들웨어
const checkMaintenance = async (req, res, next) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    // 유지보수 모드가 활성화되어 있는지 확인
    if (settings.maintenanceMode) {
      // 관리자는 접근 허용
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      
      // 시스템 설정 조회 API는 허용 (유지보수 메시지 확인용)
      if (req.path === '/api/system-settings' && req.method === 'GET') {
        return next();
      }
      
      // 로그인 API는 허용 (관리자 로그인용)
      if (req.path === '/api/auth/login' && req.method === 'POST') {
        return next();
      }
      
      // 그 외 모든 요청 차단
      return res.status(503).json({
        error: 'maintenance',
        message: settings.maintenanceMessage || '시스템 점검 중입니다. 잠시 후 다시 시도해주세요.'
      });
    }
    
    next();
  } catch (error) {
    console.error('유지보수 모드 체크 오류:', error);
    next(); // 오류 시 통과 (서비스 중단 방지)
  }
};

module.exports = { checkMaintenance };

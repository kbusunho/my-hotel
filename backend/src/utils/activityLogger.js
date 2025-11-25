const ActivityLog = require('../common/ActivityLogModel');

/**
 * 활동 로그 기록 유틸리티
 * @param {Object} params - 로그 파라미터
 * @param {ObjectId} params.userId - 사용자 ID
 * @param {String} params.action - 액션 타입
 * @param {String} params.targetModel - 대상 모델명
 * @param {ObjectId} params.targetId - 대상 ID
 * @param {Object} params.details - 추가 정보
 * @param {Object} params.req - Express request 객체 (optional)
 */
async function logActivity({ userId, action, targetModel, targetId, details, req }) {
  try {
    const logData = {
      user: userId,
      action,
      targetModel,
      targetId,
      details
    };

    // request 객체가 있으면 IP와 UserAgent 추가
    if (req) {
      logData.ipAddress = req.ip || req.connection.remoteAddress;
      logData.userAgent = req.get('user-agent');
    }

    await ActivityLog.create(logData);
  } catch (error) {
    // 로그 기록 실패해도 메인 로직에 영향 주지 않도록
    console.error('Activity log error:', error);
  }
}

/**
 * 미들웨어: 특정 액션 자동 로깅
 */
function createActivityLogger(action, getTargetInfo) {
  return async (req, res, next) => {
    // 원래 res.json을 저장
    const originalJson = res.json.bind(res);
    
    // res.json을 오버라이드
    res.json = function(data) {
      // 성공 응답일 때만 로그 기록
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const targetInfo = getTargetInfo ? getTargetInfo(req, data) : {};
        
        logActivity({
          userId: req.user?._id,
          action,
          targetModel: targetInfo.targetModel,
          targetId: targetInfo.targetId,
          details: targetInfo.details,
          req
        });
      }
      
      return originalJson(data);
    };
    
    next();
  };
}

module.exports = {
  logActivity,
  createActivityLogger
};

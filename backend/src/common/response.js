// 통일된 API 응답 포맷

exports.success = (res, data, message = '성공', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.error = (res, message = '오류가 발생했습니다.', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

exports.validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: '입력값 검증 실패',
    errors
  });
};

exports.unauthorized = (res, message = '인증이 필요합니다.') => {
  return res.status(401).json({
    success: false,
    message
  });
};

exports.forbidden = (res, message = '접근 권한이 없습니다.') => {
  return res.status(403).json({
    success: false,
    message
  });
};

exports.notFound = (res, message = '요청한 리소스를 찾을 수 없습니다.') => {
  return res.status(404).json({
    success: false,
    message
  });
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 인증 미들웨어
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: '차단된 계정입니다.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '인증에 실패했습니다.' });
  }
};

// 역할 확인 미들웨어
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    next();
  };
};

// 사업자 승인 확인
exports.checkBusinessApproval = (req, res, next) => {
  if (req.user.role === 'business' && req.user.businessStatus !== 'approved') {
    return res.status(403).json({ message: '사업자 승인이 필요합니다.' });
  }
  next();
};

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { checkMaintenance } = require('./middleware/maintenance');

dotenv.config();

const app = express();

// Middleware
// CORS는 Nginx에서 처리하므로 제거
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 프록시 신뢰 설정 (Nginx를 통한 요청)
app.set('trust proxy', 1);

// 유지보수 모드 체크 (모든 라우트 전에 실행)
app.use(checkMaintenance);

// Routes - 새로운 도메인 기반 구조
app.use('/api/auth', require('./auth/route'));
app.use('/api/users', require('./user/route'));
app.use('/api/hotels', require('./hotel/route'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/business', require('./routes/business'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/view-history', require('./routes/viewHistory'));
app.use('/api/activity-logs', require('./routes/activityLogs'));
app.use('/api/system-settings', require('./routes/systemSettings'));

// MongoDB 연결
connectDB();

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '🏨 HotelHub API Server' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

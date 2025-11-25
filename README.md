# 🏨 HotelHub

> 스마트한 호텔 예약 플랫폼

HotelHub은 사용자, 사업자, 관리자를 위한 종합 호텔 예약 관리 시스템입니다. 직관적인 UI와 강력한 관리 기능으로 효율적인 호텔 예약 경험을 제공합니다.

## ✨ 주요 기능

### 👤 사용자 기능
- 🔍 **호텔 검색 및 필터링**: 지역, 가격, 평점, 편의시설 등 다양한 조건으로 검색
- ❤️ **찜 목록 관리**: 관심 호텔 저장 및 가격 알림 설정
- 📅 **실시간 예약**: 객실 재고 확인 및 즉시 예약
- 💳 **안전한 결제**: Toss Payments 연동 및 카드 정보 암호화 저장
- 🎟️ **쿠폰 & 포인트**: 할인 쿠폰 사용 및 예약 시 포인트 적립 (1%)
- ⭐ **리뷰 작성**: 숙박 후 리뷰 및 평점 작성
- 📊 **예약 내역 관리**: 예약 조회, 수정, 취소

### 🏢 사업자 기능
- 🏨 **호텔 등록 및 관리**: 호텔 정보, 이미지, 편의시설 관리
- 🛏️ **객실 관리**: 객실 타입, 가격, 재고 관리
- 📆 **예약 캘린더**: 월별 예약 현황 확인
- 💬 **리뷰 응답**: 고객 리뷰에 대한 답변 작성
- 📈 **통계 대시보드**: 매출, 예약 현황 통계

### 👨‍💼 관리자 기능
- 📊 **종합 대시보드**: 전체 예약, 매출, 사용자 통계
- ✅ **사업자 승인 관리**: 사업자 신청 검토 및 승인/거부
- 👥 **회원 관리**: 사용자 조회, 차단, 삭제
- 🏷️ **호텔 태그 관리**: 인기, 특가 등 호텔 태그 설정
- 🚨 **신고 리뷰 관리**: 부적절한 리뷰 검토 및 처리
- 🎟️ **쿠폰 생성**: 프로모션 쿠폰 생성 및 관리
- ⚙️ **시스템 설정**: 유지보수 모드, 예약/결제 설정

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **Payment**: Toss Payments API
- **Encryption**: crypto (AES-256-CBC)
- **Email**: Nodemailer
- **File Upload**: Multer
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Routing**: React Router
- **Date Handling**: date-fns
- **Charts**: Chart.js / Recharts

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Development**: nodemon, concurrently
- **Code Quality**: ESLint, Prettier

## 📁 프로젝트 구조

```
HotelHub-Team-Project/
├── backend/
│   ├── src/
│   │   ├── admin/              # 관리자 도메인
│   │   │   ├── controller.js
│   │   │   ├── service.js
│   │   │   └── route.js
│   │   ├── auth/               # 인증 도메인
│   │   ├── user/               # 사용자 도메인
│   │   ├── hotel/              # 호텔 도메인
│   │   ├── room/               # 객실 도메인
│   │   ├── reservation/        # 예약 도메인
│   │   ├── review/             # 리뷰 도메인
│   │   ├── payment/            # 결제 도메인
│   │   ├── coupon/             # 쿠폰 도메인
│   │   ├── favorite/           # 찜 도메인
│   │   ├── common/             # 공통 모듈
│   │   │   ├── authMiddleware.js
│   │   │   ├── response.js
│   │   │   ├── ActivityLogModel.js
│   │   │   ├── ViewHistoryModel.js
│   │   │   └── SystemSettingsModel.js
│   │   ├── config/             # 설정
│   │   │   └── db.js
│   │   ├── middleware/         # 미들웨어
│   │   │   ├── auth.js
│   │   │   └── maintenance.js
│   │   ├── utils/              # 유틸리티
│   │   │   ├── activityLogger.js
│   │   │   └── emailService.js
│   │   ├── routes/             # 레거시 라우트 (호환성)
│   │   └── server.js           # 서버 엔트리
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/         # 재사용 컴포넌트
    │   ├── pages/              # 페이지 컴포넌트
    │   │   ├── admin/          # 관리자 페이지
    │   │   ├── auth/           # 인증 페이지
    │   │   ├── business/       # 사업자 페이지
    │   │   ├── user/           # 사용자 페이지
    │   │   └── info/           # 정보 페이지
    │   ├── layouts/            # 레이아웃
    │   ├── context/            # Context API
    │   ├── hooks/              # Custom Hooks
    │   ├── api/                # API 설정
    │   ├── locales/            # 다국어 지원
    │   └── utils/              # 유틸리티
    ├── package.json
    └── vite.config.js
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- MongoDB 6.x 이상
- npm 또는 yarn

### 설치 및 실행

#### 1. 저장소 클론
```bash
git clone https://github.com/HotelHub-Team-Project/HotelHub-Team-Project.git
cd HotelHub-Team-Project
```

#### 2. 환경 변수 설정

**Backend (.env)**
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/hotelhub

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Toss Payments
TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Encryption
CARD_ENCRYPT_KEY=your_32_character_encryption_key

# Frontend
FRONT_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

#### 3. 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

#### 4. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

프론트엔드가 http://localhost:5173 에서 실행됩니다.

## 📖 API 문서

자세한 API 명세는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) 를 참조하세요.

### 주요 엔드포인트

```
🔐 인증
POST   /api/auth/register        # 회원가입
POST   /api/auth/login           # 로그인
POST   /api/auth/forgot-password # 비밀번호 찾기

👤 사용자
GET    /api/users/me             # 내 정보 조회
PUT    /api/users/me             # 내 정보 수정
DELETE /api/users/me             # 회원탈퇴

🏨 호텔
GET    /api/hotels/search        # 호텔 검색
GET    /api/hotels/featured/list # 추천 호텔
GET    /api/hotels/:id           # 호텔 상세

📅 예약
POST   /api/bookings             # 예약 생성
GET    /api/bookings/my          # 내 예약 목록
PUT    /api/bookings/:id/cancel  # 예약 취소

💳 결제
POST   /api/payments/cards       # 카드 등록
POST   /api/payments/confirm     # 결제 승인
POST   /api/payments/cancel      # 결제 취소

⭐ 리뷰
POST   /api/reviews              # 리뷰 작성
GET    /api/reviews/hotel/:id    # 호텔 리뷰 목록

👨‍💼 관리자
GET    /api/admin/dashboard/stats # 대시보드 통계
GET    /api/admin/business       # 사업자 목록
PUT    /api/admin/business/:id/approve # 사업자 승인
```

## 🎯 핵심 기능 구현

### 1. 도메인 기반 아키텍처 (DDD)
각 도메인은 독립적인 model, service, controller, route로 구성:
- **Model**: 데이터 스키마 정의 (Mongoose)
- **Service**: 비즈니스 로직 처리
- **Controller**: HTTP 요청/응답 처리
- **Route**: API 엔드포인트 정의

### 2. 보안
- JWT 기반 인증 및 역할별 권한 관리
- 비밀번호 bcrypt 암호화
- 카드 정보 AES-256-CBC 암호화
- CORS 설정 및 Rate Limiting

### 3. 결제 시스템
- Toss Payments API 연동
- 카드 정보 안전한 저장
- 포인트 적립 (결제 금액의 1%)
- 환불 처리

### 4. 실시간 재고 관리
- 예약 시 객실 재고 감소
- 취소 시 재고 복구
- 동시성 제어

### 5. 활동 로그
- 사용자 주요 활동 기록
- IP 주소 및 User Agent 저장
- 관리자 모니터링

## 🎨 주요 기능 상세

### 🔍 스마트 검색
- 지역별 호텔 검색
- 가격대, 평점, 호텔 타입 필터
- 편의시설 필터 (WiFi, 주차, 수영장 등)
- 정렬 (가격순, 평점순, 인기순)

### ❤️ 찜 & 가격 알림
- 관심 호텔 저장
- 목표 가격 설정
- 가격 하락 시 이메일 알림 (24시간 쿨다운)

### 📊 대시보드
- **사용자**: 예약 내역, 포인트, 쿠폰
- **사업자**: 월별 예약 현황, 매출 통계, 리뷰 관리
- **관리자**: 전체 통계, 사용자 관리, 신고 처리

### 🎟️ 쿠폰 시스템
- 비율 할인 / 고정 금액 할인
- 최소 구매 금액 설정
- 호텔별 적용 가능 쿠폰
- 사용 횟수 제한

## 🔄 개발 워크플로우

### Git Branch 전략
```
main        # 프로덕션
  ├── develop  # 개발
  │   ├── feature/user-auth
  │   ├── feature/booking-system
  │   └── feature/admin-panel
  └── hotfix   # 긴급 수정
```

### Commit Convention
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
npm test

# 프론트엔드 테스트
cd frontend
npm test
```

## 📦 배포

### 백엔드 배포 (예: Heroku)
```bash
heroku create hotelhub-api
git push heroku main
heroku config:set NODE_ENV=production
```

### 프론트엔드 배포 (예: Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License.

## 👥 팀

- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]
- **Project Manager**: [Your Name]

## 📧 문의

- **Email**: dev@hotelhub.com
- **GitHub Issues**: [이슈 페이지](https://github.com/HotelHub-Team-Project/HotelHub-Team-Project/issues)

## 🙏 감사의 글

- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Toss Payments](https://www.tosspayments.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!

**Last Updated**: 2025년 11월 25일
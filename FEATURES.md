# HotelHub 프로젝트 기능 명세서

## 📋 프로젝트 개요
- **프로젝트명**: HotelHub
- **목적**: 호텔 예약 및 관리 통합 플랫폼
- **기술 스택**: React + Vite, Node.js + Express, MongoDB
- **개발 기간**: 2025년 11월

---

## 👥 사용자 역할

### 1. 일반 사용자 (User)
- 호텔 검색 및 예약
- 리뷰 작성 및 관리
- 찜 목록 관리

### 2. 사업자 (Business)
- 호텔/객실 등록 및 관리
- 예약 관리
- 리뷰 응답

### 3. 관리자 (Admin)
- 사업자 승인
- 호텔 승인
- 쿠폰 관리
- 시스템 설정

---

## 🎯 핵심 기능

### 1. 인증 및 회원 관리
- **회원가입/로그인**
  - 이메일 기반 회원가입
  - JWT 토큰 인증
  - 역할별 접근 제어 (User/Business/Admin)
  
- **소셜 로그인**
  - 카카오 OAuth 연동
  - 자동 계정 생성

### 2. 호텔 검색 및 필터링
- **검색 기능**
  - 지역별 검색 (서울, 부산, 제주, 인천)
  - 날짜별 예약 가능 여부 확인
  - 인원수 기반 검색

- **고급 필터**
  - 호텔 타입: luxury, business, resort, boutique, pension
  - 객실 타입: standard, deluxe, suite, premium
  - 침대 타입: single, double, twin, queen, king
  - 뷰 타입: ocean, mountain, city, garden
  - 편의시설: WiFi, 주차, 수영장, 헬스장, 스파, 레스토랑 등
  - 평점 필터 (1~5성급)
  - 가격 범위 필터

- **호텔 태그**
  - 신규, 인기, 특가, 추천, 럭셔리, 가족, 비즈니스, 커플, 반려동물, 주말특가

### 3. 호텔 상세 정보
- **카카오 맵 API 통합**
  - 호텔 위치 지도 표시
  - 마커 및 인포 윈도우

- **이미지 갤러리**
  - 전체 화면 모달
  - 좌우 화살표 네비게이션
  - 키보드 지원 (ESC, Arrow keys)
  - 썸네일 네비게이션

- **호텔 정보**
  - 기본 정보 (이름, 주소, 평점)
  - 객실 목록 및 가격
  - 편의시설 목록
  - 리뷰 (평점, 댓글)

### 4. 예약 시스템
- **예약 프로세스**
  - 날짜 및 인원 선택
  - 객실 선택
  - 특별 요청사항 입력
  - 결제 정보 입력

- **Toss Payments 연동**
  - 신용카드 결제
  - 결제 성공/실패 처리

- **쿠폰 시스템**
  - 할인 쿠폰 적용
  - 포인트 사용
  - 최종 결제 금액 계산

- **예약 관리**
  - 예약 내역 조회
  - 예약 변경
  - 예약 취소
  - 환불 처리

### 5. 리뷰 시스템
- **리뷰 작성**
  - 별점 평가 (1~5점)
  - 텍스트 리뷰
  - 체크아웃 후 작성 가능

- **리뷰 관리**
  - 수정 및 삭제 (본인만)
  - 신고 기능
  - 사업자 응답

### 6. 찜(즐겨찾기) 기능
- 호텔 찜하기/해제
- 찜 목록 관리
- 찜한 호텔 바로가기

### 7. 사업자 기능
- **호텔 관리**
  - 호텔 등록 (승인 대기)
  - 호텔 정보 수정
  - 이미지 업로드 (AWS S3)

- **객실 관리**
  - 객실 등록/수정/삭제
  - 객실 타입 및 가격 설정
  - 재고 관리

- **예약 관리**
  - 예약 목록 조회
  - 예약 캘린더 뷰 (월별)
  - 예약 상태 변경

- **리뷰 관리**
  - 리뷰 조회
  - 리뷰 응답 작성

### 8. 관리자 기능
- **사업자 승인**
  - 사업자 등록 신청 목록
  - 승인/거부 처리

- **호텔 승인**
  - 호텔 등록 신청 목록
  - 승인/거부 처리

- **쿠폰 관리**
  - 쿠폰 생성
  - 할인율/금액 설정
  - 유효기간 설정
  - 쿠폰 활성화/비활성화

- **호텔 태그 관리**
  - 호텔에 태그 추가/제거

- **신고 리뷰 관리**
  - 신고된 리뷰 조회
  - 리뷰 삭제

- **활동 로그**
  - 시스템 활동 기록 조회

- **사용자 관리**
  - 사용자 목록 조회
  - 역할 변경
  - 계정 활성화/비활성화

---

## 🆕 최근 추가 기능 (8가지)

### 1. 다크 모드
- **기능**: 라이트/다크 테마 전환
- **구현**:
  - ThemeContext (Context API)
  - localStorage 저장
  - 시스템 설정 감지
  - 전역 토글 버튼

### 2. 다국어 지원 (i18n)
- **기능**: 한국어/영어 언어 전환
- **구현**:
  - LanguageContext (Context API)
  - translations.js (번역 파일)
  - t() 번역 함수
  - 중첩 키 지원

### 3. 인쇄용 예약 확인서
- **기능**: 예약 상세 정보 인쇄
- **구현**:
  - PrintableBooking 컴포넌트
  - 새 창 팝업 인쇄
  - A4 포맷 최적화
  - 호텔 정보, 투숙 일정, 결제 내역 포함

### 4. 이메일 알림 시스템
- **기능**: 자동 이메일 발송
- **구현**:
  - nodemailer 연동
  - Gmail SMTP
  - 예약 확인 이메일
  - 예약 취소 이메일
  - HTML 템플릿

### 5. 예약 캘린더 뷰
- **기능**: 사업자용 월별 예약 현황
- **구현**:
  - BookingCalendar 컴포넌트
  - 월별 그리드 뷰
  - 날짜별 예약 건수 표시
  - 예약 상태별 색상 구분
  - 날짜 클릭 시 상세 모달

### 6. 이미지 갤러리 모달
- **기능**: 전체 화면 이미지 뷰어
- **구현**:
  - ImageGalleryModal 컴포넌트
  - 좌우 화살표 네비게이션
  - 키보드 단축키 (ESC, Arrow)
  - 썸네일 네비게이션
  - 이미지 카운터

### 7. 최근 검색 저장
- **기능**: 검색 기록 저장 및 빠른 재검색
- **구현**:
  - useRecentSearches Hook
  - localStorage 저장 (최대 10개)
  - 검색 조건 표시 (도시, 날짜, 인원)
  - 개별/전체 삭제
  - 클릭 시 자동 재검색

### 8. FAQ 페이지 확장
- **기능**: 카테고리별 FAQ 및 검색
- **구현**:
  - 4개 카테고리 (예약/결제, 포인트/쿠폰, 호텔 이용, 회원정보)
  - 아코디언 UI
  - 검색 기능
  - "도움이 되었나요?" 버튼
  - 15개 이상의 FAQ

---

## 🗂️ 데이터베이스 스키마

### User (사용자)
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  role: String, // 'user' | 'business' | 'admin'
  businessInfo: {
    businessName: String,
    businessNumber: String,
    bankAccount: String
  },
  businessStatus: String, // 'pending' | 'approved' | 'rejected'
  favorites: [ObjectId], // Hotel IDs
  points: Number,
  createdAt: Date
}
```

### Hotel (호텔)
```javascript
{
  name: String,
  description: String,
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  hotelType: String, // 'luxury' | 'business' | 'resort' | 'boutique' | 'pension'
  tags: [String], // ['신규', '인기', '특가', ...]
  images: [String], // URLs
  amenities: [String],
  rating: Number,
  reviewCount: Number,
  owner: ObjectId, // User ID
  status: String, // 'pending' | 'approved' | 'rejected'
  createdAt: Date
}
```

### Room (객실)
```javascript
{
  hotel: ObjectId, // Hotel ID
  name: String,
  description: String,
  type: String,
  roomType: String, // 'standard' | 'deluxe' | 'suite' | 'premium'
  bedType: String, // 'single' | 'double' | 'twin' | 'queen' | 'king'
  viewType: String, // 'ocean' | 'mountain' | 'city' | 'garden'
  price: Number,
  maxGuests: Number,
  images: [String],
  amenities: [String],
  availableRooms: Number,
  createdAt: Date
}
```

### Booking (예약)
```javascript
{
  user: ObjectId,
  hotel: ObjectId,
  room: ObjectId,
  checkIn: Date,
  checkOut: Date,
  guests: {
    adults: Number,
    children: Number
  },
  totalPrice: Number,
  discountAmount: Number,
  finalPrice: Number,
  usedCoupons: [ObjectId],
  usedPoints: Number,
  specialRequests: String,
  bookingStatus: String, // 'confirmed' | 'cancelled' | 'completed'
  tossOrderId: String,
  tossPaymentKey: String,
  modificationHistory: [{
    modifiedAt: Date,
    changes: Object
  }],
  createdAt: Date
}
```

### Review (리뷰)
```javascript
{
  user: ObjectId,
  hotel: ObjectId,
  booking: ObjectId,
  rating: Number, // 1-5
  comment: String,
  response: String, // 사업자 응답
  isReported: Boolean,
  reportReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Coupon (쿠폰)
```javascript
{
  code: String (unique),
  name: String,
  description: String,
  discountType: String, // 'percentage' | 'fixed'
  discountValue: Number,
  minPurchase: Number,
  maxDiscount: Number,
  validFrom: Date,
  validTo: Date,
  isActive: Boolean,
  createdAt: Date
}
```

### Favorite (찜)
```javascript
{
  user: ObjectId,
  hotel: ObjectId,
  createdAt: Date
}
```

### ActivityLog (활동 로그)
```javascript
{
  user: ObjectId,
  action: String,
  target: String,
  targetId: ObjectId,
  details: Object,
  ipAddress: String,
  createdAt: Date
}
```

### ViewHistory (조회 기록)
```javascript
{
  user: ObjectId,
  hotel: ObjectId,
  viewedAt: Date
}
```

---

## 🛠️ 기술 상세

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.4
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Map**: Kakao Maps API

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + AWS S3
- **Payment**: Toss Payments API
- **Email**: nodemailer
- **OAuth**: Kakao Login

### Infrastructure
- **Storage**: AWS S3
- **Database**: MongoDB Atlas
- **Email**: Gmail SMTP

---

## 📁 프로젝트 구조

```
HotelHub-Team-Project/
├── backend/
│   ├── src/
│   │   ├── models/          # Mongoose 스키마
│   │   │   ├── User.js
│   │   │   ├── Hotel.js
│   │   │   ├── Room.js
│   │   │   ├── Booking.js
│   │   │   ├── Review.js
│   │   │   ├── Coupon.js
│   │   │   ├── Favorite.js
│   │   │   ├── ActivityLog.js
│   │   │   └── ViewHistory.js
│   │   ├── routes/          # API 라우트
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── hotels.js
│   │   │   ├── rooms.js
│   │   │   ├── bookings.js
│   │   │   ├── reviews.js
│   │   │   ├── payments.js
│   │   │   ├── admin.js
│   │   │   ├── business.js
│   │   │   ├── coupons.js
│   │   │   ├── favorites.js
│   │   │   ├── activityLogs.js
│   │   │   └── viewHistory.js
│   │   ├── middleware/      # 미들웨어
│   │   │   └── auth.js
│   │   ├── utils/           # 유틸리티
│   │   │   └── emailService.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # 재사용 컴포넌트
    │   │   ├── BookingCalendar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ImageGalleryModal.jsx
    │   │   └── PrintableBooking.jsx
    │   ├── context/         # Context API
    │   │   ├── AuthContext.jsx
    │   │   ├── ThemeContext.jsx
    │   │   └── LanguageContext.jsx
    │   ├── hooks/           # Custom Hooks
    │   │   └── useRecentSearches.jsx
    │   ├── layouts/         # 레이아웃
    │   │   ├── UserLayout.jsx
    │   │   ├── BusinessLayout.jsx
    │   │   └── AdminLayout.jsx
    │   ├── locales/         # 다국어 번역
    │   │   └── translations.js
    │   ├── pages/           # 페이지 컴포넌트
    │   │   ├── admin/
    │   │   ├── business/
    │   │   ├── user/
    │   │   ├── auth/
    │   │   └── info/
    │   ├── api/             # Axios 설정
    │   │   └── axios.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🔐 환경 변수

### Backend (.env)
```env
# Server
PORT=3000

# Database
MONGO_URI=mongodb+srv://...

# Frontend
FRONT_ORIGIN=http://localhost:5173

# Authentication
JWT_SECRET=...

# Toss Payments
TOSS_SECRET_KEY=...
TOSS_SECURITY_KEY=...

# Kakao OAuth
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback

# AWS S3
AWS_REGION=ap-northeast-2
S3_BUCKET=hotel-bucket-teamproject
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
VITE_S3_PUBLIC_BASE=https://hotel-bucket-teamproject.s3.ap-northeast-2.amazonaws.com

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🚀 실행 방법

### 개발 환경 실행

```bash
# Backend 실행
cd backend
npm install
npm run dev
# 서버: http://localhost:3000

# Frontend 실행
cd frontend
npm install
npm run dev
# 클라이언트: http://localhost:5173
```

### 프로덕션 빌드

```bash
# Frontend 빌드
cd frontend
npm run build

# Backend 프로덕션 실행
cd backend
npm start
```

---

## 📊 주요 통계
- **총 페이지 수**: 30+ 페이지
- **API 엔드포인트**: 50+ 개
- **데이터베이스 컬렉션**: 9개
- **컴포넌트 수**: 40+ 개
- **코드 라인 수**: 15,000+ 줄
- **지원 호텔 수**: 25개 (시드 데이터)
- **객실 수**: 150+ 개 (시드 데이터)

---

## ✅ 완료된 기능 체크리스트

### 인증 & 권한
- [x] 이메일 회원가입/로그인
- [x] JWT 토큰 인증
- [x] 카카오 OAuth 로그인
- [x] 역할 기반 접근 제어 (User/Business/Admin)

### 호텔 & 객실
- [x] 호텔 검색 (지역, 날짜, 인원)
- [x] 다중 필터링 (타입, 침대, 뷰, 편의시설, 가격)
- [x] 호텔 상세 페이지
- [x] 카카오 맵 연동
- [x] 이미지 갤러리 모달
- [x] 객실 목록 및 상세

### 예약 & 결제
- [x] 예약 생성
- [x] Toss Payments 결제 연동
- [x] 쿠폰 적용
- [x] 포인트 사용
- [x] 예약 조회/변경/취소
- [x] 예약 확인서 인쇄

### 리뷰 & 찜
- [x] 리뷰 작성/수정/삭제
- [x] 별점 평가
- [x] 리뷰 신고
- [x] 사업자 응답
- [x] 찜 기능

### 사업자 기능
- [x] 호텔 등록/수정
- [x] 객실 관리
- [x] 예약 관리
- [x] 예약 캘린더 뷰
- [x] 리뷰 관리

### 관리자 기능
- [x] 사업자 승인/거부
- [x] 호텔 승인/거부
- [x] 쿠폰 관리
- [x] 호텔 태그 관리
- [x] 신고 리뷰 관리
- [x] 사용자 관리
- [x] 활동 로그

### UI/UX 개선
- [x] 다크 모드
- [x] 다국어 지원 (한/영)
- [x] 반응형 디자인
- [x] 최근 검색 기록
- [x] FAQ 페이지

### 알림 & 커뮤니케이션
- [x] 예약 확인 이메일
- [x] 예약 취소 이메일
- [x] 체크인 리마인더 이메일

---

## 🔄 향후 개선 사항
- [ ] 실시간 채팅 지원
- [ ] 모바일 앱 개발
- [ ] 다양한 결제 수단 추가
- [ ] AI 기반 호텔 추천
- [ ] 소셜 미디어 공유 기능
- [ ] 예약 통계 대시보드
- [ ] 다국어 추가 (일본어, 중국어)

---

*마지막 업데이트: 2025년 11월 24일*

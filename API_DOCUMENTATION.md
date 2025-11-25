# HotelHub API 명세서

**버전**: 2.0  
**Base URL**: `http://localhost:3000/api`  
**인증 방식**: JWT Bearer Token  
**업데이트**: 2025년 11월 25일

---

## 📑 목차
1. [인증 (Auth)](#1-인증-auth)
2. [사용자 (Users)](#2-사용자-users)
3. [호텔 (Hotels)](#3-호텔-hotels)
4. [객실 (Rooms)](#4-객실-rooms)
5. [예약 (Bookings)](#5-예약-bookings)
6. [리뷰 (Reviews)](#6-리뷰-reviews)
7. [결제 (Payments)](#7-결제-payments)
8. [쿠폰 (Coupons)](#8-쿠폰-coupons)
9. [찜 (Favorites)](#9-찜-favorites)
10. [관리자 (Admin)](#10-관리자-admin)
11. [시스템 설정 (System Settings)](#11-시스템-설정-system-settings)
12. [활동 로그 (Activity Logs)](#12-활동-로그-activity-logs)
13. [조회 기록 (View History)](#13-조회-기록-view-history)

---

## 1. 인증 (Auth)

### 1.1 회원가입
```http
POST /api/auth/register
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "_id": "67412a...",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "points": 0
  }
}
```

---

### 1.2 로그인
```http
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "67412a...",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "points": 1000
  }
}
```

**Error Response** `401 Unauthorized`
```json
{
  "success": false,
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

**Error Response** `403 Forbidden` (계정 차단)
```json
{
  "success": false,
  "message": "차단된 계정입니다. 관리자에게 문의하세요."
}
```

---

### 1.3 이메일 찾기
```http
POST /api/auth/find-email
```

**Request Body**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "이메일을 찾았습니다.",
  "email": "use***@example.com",
  "createdAt": "2025-11-01"
}
```

---

### 1.4 비밀번호 찾기 (이메일 발송)
```http
POST /api/auth/forgot-password
```

**Request Body**
```json
{
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "비밀번호 재설정 링크가 이메일로 발송되었습니다."
}
```

---

### 1.5 비밀번호 재설정
```http
POST /api/auth/reset-password
```

**Request Body**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "비밀번호가 성공적으로 변경되었습니다."
}
```

---

## 2. 사용자 (Users)

### 2.1 내 정보 조회
```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "67412a...",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "role": "user",
    "points": 1000,
    "favorites": ["hotel_id_1", "hotel_id_2"],
    "paymentCards": [
      {
        "cardNumber": "****-****-****-1234",
        "cardType": "credit",
        "isDefault": true
      }
    ],
    "createdAt": "2025-11-01T00:00:00.000Z"
  }
}
```

---

### 2.2 내 정보 수정
```http
PUT /api/users/me
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "name": "홍길동",
  "phone": "010-9876-5432"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "회원 정보가 수정되었습니다.",
  "user": {
    "_id": "67412a...",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-9876-5432"
  }
}
```

---

### 2.3 비밀번호 변경
```http
PUT /api/users/me/password
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다."
}
```

---

### 2.4 찜 추가/제거 (토글)
```http
POST /api/users/favorites/:hotelId
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "찜 목록에 추가되었습니다.",
  "favorites": ["hotel_id_1", "hotel_id_2"]
}
```

또는

```json
{
  "success": true,
  "message": "찜 목록에서 제거되었습니다.",
  "favorites": ["hotel_id_1"]
}
```

---

### 2.5 회원탈퇴
```http
DELETE /api/users/me
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "password": "password123",
  "reason": "서비스가 필요 없어서"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "회원탈퇴가 완료되었습니다."
}
```

---

## 3. 호텔 (Hotels)

### 3.1 호텔 검색
```http
GET /api/hotels/search
```

**Query Parameters**
- `city` (string): 도시 (서울/부산/제주/인천/강릉/여수/경주/전주)
- `checkIn` (date): 체크인 날짜 (YYYY-MM-DD)
- `checkOut` (date): 체크아웃 날짜 (YYYY-MM-DD)
- `guests` (number): 투숙 인원
- `hotelType` (string): 호텔 타입 (luxury/business/resort/boutique/pension)
- `minPrice` (number): 최소 가격
- `maxPrice` (number): 최대 가격
- `minRating` (number): 최소 평점 (1-5)
- `amenities` (array): 편의시설 (WiFi,주차,수영장 등)
- `page` (number): 페이지 번호 (default: 1)
- `limit` (number): 페이지당 개수 (default: 20)
- `sortBy` (string): 정렬 기준 (price_asc, price_desc, rating, popular)

**Response** `200 OK`
```json
{
  "success": true,
  "hotels": [
    {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "description": "5성급 럭셔리 호텔...",
      "location": {
        "address": "서울특별시 중구 세종대로 100",
        "city": "서울",
        "coordinates": {
          "lat": 37.5665,
          "lng": 126.9780
        }
      },
      "hotelType": "luxury",
      "tags": ["인기", "럭셔리", "비즈니스"],
      "images": ["https://..."],
      "amenities": ["WiFi", "주차", "수영장"],
      "rating": 4.5,
      "reviewCount": 120,
      "minPrice": 150000,
      "maxPrice": 500000,
      "availableRooms": 5
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "totalPages": 2,
    "hasMore": true
  }
}
```

---

### 3.2 추천 호텔 목록
```http
GET /api/hotels/featured/list
```

**Query Parameters**
- `type` (string): 추천 타입 (popular/discount/new/luxury)
- `limit` (number): 개수 (default: 10)

**Response** `200 OK`
```json
{
  "success": true,
  "hotels": [
    {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "location": {
        "city": "서울",
        "address": "서울특별시 중구 세종대로 100"
      },
      "images": ["https://..."],
      "rating": 4.5,
      "reviewCount": 120,
      "minPrice": 150000,
      "tags": ["인기", "특가"]
    }
  ]
}
```

---

### 3.3 호텔 상세 조회
```http
GET /api/hotels/:id
```

**Query Parameters**
- `checkIn` (date): 체크인 날짜 (객실 가용성 확인용)
- `checkOut` (date): 체크아웃 날짜

**Response** `200 OK`
```json
{
  "success": true,
  "hotel": {
    "_id": "hotel_id_1",
    "name": "서울 그랜드 호텔",
    "description": "서울 중심부에 위치한 5성급 럭셔리 호텔...",
    "location": {
      "address": "서울특별시 중구 세종대로 100",
      "city": "서울",
      "coordinates": {
        "lat": 37.5665,
        "lng": 126.9780
      }
    },
    "hotelType": "luxury",
    "tags": ["인기", "럭셔리", "비즈니스"],
    "images": [
      "https://s3.../image1.jpg",
      "https://s3.../image2.jpg"
    ],
    "amenities": [
      "WiFi",
      "무료 주차",
      "수영장",
      "헬스장",
      "스파",
      "레스토랑"
    ],
    "rating": 4.5,
    "reviewCount": 120,
    "rooms": [
      {
        "_id": "room_id_1",
        "name": "디럭스 더블",
        "type": "deluxe",
        "bedType": "double",
        "viewType": "city",
        "price": 150000,
        "maxGuests": 2,
        "availableCount": 3,
        "images": ["https://..."]
      }
    ],
    "reviews": [
      {
        "_id": "review_id_1",
        "user": {
          "name": "홍길동"
        },
        "rating": 5,
        "comment": "정말 좋았어요!",
        "createdAt": "2025-11-20T00:00:00.000Z"
      }
    ],
    "nearbyAttractions": [
      {
        "name": "경복궁",
        "distance": "1.5km",
        "type": "관광지"
      }
    ]
  }
}
```

---

## 4. 객실 (Rooms)

### 4.1 호텔별 객실 목록 조회
```http
GET /api/rooms/hotel/:hotelId
```

**Query Parameters**
- `checkIn` (date): 체크인 날짜
- `checkOut` (date): 체크아웃 날짜
- `guests` (number): 투숙 인원
- `roomType` (string): 객실 타입 (standard/deluxe/suite/premium)
- `bedType` (string): 침대 타입 (single/double/twin/queen/king)

**Response** `200 OK`
```json
{
  "success": true,
  "rooms": [
    {
      "_id": "room_id_1",
      "hotel": "hotel_id_1",
      "name": "디럭스 더블룸",
      "description": "넓고 편안한 객실...",
      "type": "deluxe",
      "bedType": "double",
      "viewType": "city",
      "price": 150000,
      "discountRate": 10,
      "discountedPrice": 135000,
      "maxGuests": 2,
      "size": "32㎡",
      "images": ["https://..."],
      "amenities": ["WiFi", "TV", "미니바", "욕조"],
      "availableCount": 3
    }
  ]
}
```

---

### 4.2 객실 상세 조회
```http
GET /api/rooms/:id
```

**Response** `200 OK`
```json
{
  "success": true,
  "room": {
    "_id": "room_id_1",
    "hotel": {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "location": {
        "city": "서울",
        "address": "서울특별시 중구 세종대로 100"
      }
    },
    "name": "디럭스 더블룸",
    "description": "넓고 편안한 객실...",
    "type": "deluxe",
    "bedType": "double",
    "viewType": "city",
    "price": 150000,
    "discountRate": 10,
    "discountedPrice": 135000,
    "maxGuests": 2,
    "size": "32㎡",
    "images": ["https://..."],
    "amenities": ["WiFi", "TV", "미니바", "욕조", "에어컨"],
    "availableCount": 3,
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "createdAt": "2025-10-15T00:00:00.000Z"
  }
}
```

---

### 4.3 객실 등록 (사업자)
```http
POST /api/rooms
Authorization: Bearer {business_token}
Content-Type: multipart/form-data
```

**Request Body (form-data)**
```
hotel: "hotel_id_1"
name: "스위트룸"
description: "최고급 스위트..."
type: "suite"
bedType: "king"
viewType: "ocean"
price: 300000
discountRate: 15
maxGuests: 4
size: "64㎡"
availableCount: 2
amenities[]: "WiFi"
amenities[]: "욕조"
images: [File, File]
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "객실이 등록되었습니다.",
  "room": {
    "_id": "room_id_new",
    "name": "스위트룸",
    "price": 300000,
    "discountedPrice": 255000
  }
}
```

---

### 4.4 객실 수정 (사업자)
```http
PUT /api/rooms/:id
Authorization: Bearer {business_token}
```

**Request Body**
```json
{
  "price": 180000,
  "discountRate": 20,
  "availableCount": 5
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "객실 정보가 수정되었습니다.",
  "room": {
    "_id": "room_id_1",
    "price": 180000,
    "discountedPrice": 144000,
    "availableCount": 5
  }
}
```

---

### 4.5 객실 삭제 (사업자)
```http
DELETE /api/rooms/:id
Authorization: Bearer {business_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "객실이 삭제되었습니다."
}
```

---

## 5. 예약 (Bookings)

### 5.1 예약 생성
```http
POST /api/bookings
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1",
  "room": "room_id_1",
  "checkIn": "2025-12-01",
  "checkOut": "2025-12-03",
  "guests": {
    "adults": 2,
    "children": 0
  },
  "guestInfo": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "email": "user@example.com"
  },
  "specialRequests": "높은 층 배정 부탁드립니다.",
  "usedCoupons": ["coupon_id_1"],
  "usedPoints": 10000,
  "paymentMethod": "card",
  "totalPrice": 300000,
  "discountAmount": 40000,
  "finalPrice": 260000
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "예약이 완료되었습니다.",
  "booking": {
    "_id": "booking_id_1",
    "bookingNumber": "HH20251201001",
    "user": "user_id_1",
    "hotel": {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔"
    },
    "room": {
      "_id": "room_id_1",
      "name": "디럭스 더블룸"
    },
    "checkIn": "2025-12-01T00:00:00.000Z",
    "checkOut": "2025-12-03T00:00:00.000Z",
    "nights": 2,
    "guests": {
      "adults": 2,
      "children": 0
    },
    "totalPrice": 300000,
    "discountAmount": 40000,
    "finalPrice": 260000,
    "paymentStatus": "pending",
    "bookingStatus": "pending",
    "createdAt": "2025-11-24T00:00:00.000Z"
  }
}
```

---

### 5.2 내 예약 목록 조회
```http
GET /api/bookings/my
Authorization: Bearer {token}
```

**Query Parameters**
- `status` (string): 예약 상태 (pending/confirmed/cancelled/completed)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "booking_id_1",
      "bookingNumber": "HH20251201001",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔",
        "images": ["https://..."],
        "location": {
          "city": "서울"
        }
      },
      "room": {
        "_id": "room_id_1",
        "name": "디럭스 더블룸"
      },
      "checkIn": "2025-12-01T00:00:00.000Z",
      "checkOut": "2025-12-03T00:00:00.000Z",
      "nights": 2,
      "guests": {
        "adults": 2,
        "children": 0
      },
      "finalPrice": 260000,
      "paymentStatus": "completed",
      "bookingStatus": "confirmed",
      "createdAt": "2025-11-24T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "totalPages": 1
  }
}
```

---

### 5.3 사업자 예약 조회 (월별 캘린더)
```http
GET /api/bookings/business/my
Authorization: Bearer {business_token}
```

**Query Parameters**
- `year` (number): 연도 (required)
- `month` (number): 월 1-12 (required)
- `hotelId` (string): 특정 호텔 ID (optional)

**Response** `200 OK`
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "booking_id_1",
      "bookingNumber": "HH20251201001",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔"
      },
      "room": {
        "_id": "room_id_1",
        "name": "디럭스 더블룸"
      },
      "user": {
        "_id": "user_id_1",
        "name": "홍길동",
        "phone": "010-1234-5678"
      },
      "checkIn": "2025-12-01T00:00:00.000Z",
      "checkOut": "2025-12-03T00:00:00.000Z",
      "guests": {
        "adults": 2,
        "children": 0
      },
      "finalPrice": 260000,
      "bookingStatus": "confirmed"
    }
  ]
}
```

---

### 5.4 예약 상세 조회
```http
GET /api/bookings/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "booking": {
    "_id": "booking_id_1",
    "bookingNumber": "HH20251201001",
    "user": {
      "_id": "user_id_1",
      "name": "홍길동",
      "email": "user@example.com",
      "phone": "010-1234-5678"
    },
    "hotel": {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "location": {
        "address": "서울특별시 중구 세종대로 100",
        "city": "서울"
      },
      "phone": "02-1234-5678",
      "images": ["https://..."]
    },
    "room": {
      "_id": "room_id_1",
      "name": "디럭스 더블룸",
      "type": "deluxe",
      "price": 150000
    },
    "checkIn": "2025-12-01T00:00:00.000Z",
    "checkOut": "2025-12-03T00:00:00.000Z",
    "nights": 2,
    "guests": {
      "adults": 2,
      "children": 0
    },
    "guestInfo": {
      "name": "홍길동",
      "phone": "010-1234-5678",
      "email": "user@example.com"
    },
    "totalPrice": 300000,
    "discountAmount": 40000,
    "usedPoints": 10000,
    "finalPrice": 260000,
    "usedCoupons": [
      {
        "_id": "coupon_id_1",
        "code": "WELCOME10",
        "name": "신규 회원 10% 할인"
      }
    ],
    "specialRequests": "높은 층 배정 부탁드립니다.",
    "paymentStatus": "completed",
    "bookingStatus": "confirmed",
    "paymentMethod": "card",
    "createdAt": "2025-11-24T00:00:00.000Z",
    "updatedAt": "2025-11-24T00:00:00.000Z"
  }
}
```

---

### 5.5 예약 취소
```http
PUT /api/bookings/:id/cancel
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "reason": "일정 변경"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "예약이 취소되었습니다. 환불은 3-5일 소요됩니다.",
  "booking": {
    "_id": "booking_id_1",
    "bookingStatus": "cancelled",
    "cancelledAt": "2025-11-25T00:00:00.000Z",
    "cancelReason": "일정 변경",
    "refundAmount": 260000
  }
}
```

---

## 6. 리뷰 (Reviews)

### 6.1 리뷰 작성
```http
POST /api/reviews
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1",
  "booking": "booking_id_1",
  "rating": 5,
  "comment": "정말 훌륭한 호텔이었습니다! 직원분들도 친절하고 시설도 깨끗했어요."
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "리뷰가 작성되었습니다.",
  "review": {
    "_id": "review_id_1",
    "user": "user_id_1",
    "hotel": "hotel_id_1",
    "booking": "booking_id_1",
    "rating": 5,
    "comment": "정말 훌륭한 호텔이었습니다!",
    "createdAt": "2025-11-25T00:00:00.000Z"
  }
}
```

---

### 6.2 호텔 리뷰 목록 조회
```http
GET /api/reviews/hotel/:hotelId
```

**Query Parameters**
- `page` (number): 페이지 번호 (default: 1)
- `limit` (number): 페이지당 개수 (default: 10)
- `sort` (string): 정렬 (latest/rating_high/rating_low)

**Response** `200 OK`
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id_1",
      "user": {
        "_id": "user_id_1",
        "name": "홍길동"
      },
      "rating": 5,
      "comment": "정말 훌륭한 호텔이었습니다!",
      "response": {
        "content": "소중한 리뷰 감사합니다!",
        "createdAt": "2025-11-25T10:00:00.000Z"
      },
      "isReported": false,
      "createdAt": "2025-11-25T00:00:00.000Z"
    }
  ],
  "summary": {
    "averageRating": 4.5,
    "totalReviews": 120,
    "ratingDistribution": {
      "5": 80,
      "4": 25,
      "3": 10,
      "2": 3,
      "1": 2
    }
  },
  "pagination": {
    "page": 1,
    "totalPages": 12,
    "total": 120
  }
}
```

---

### 6.3 리뷰 수정
```http
PUT /api/reviews/:id
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "rating": 4,
  "comment": "수정된 리뷰 내용"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "리뷰가 수정되었습니다.",
  "review": {
    "_id": "review_id_1",
    "rating": 4,
    "comment": "수정된 리뷰 내용",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  }
}
```

---

### 6.4 리뷰 삭제
```http
DELETE /api/reviews/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "리뷰가 삭제되었습니다."
}
```

---

### 6.5 리뷰 신고
```http
POST /api/reviews/:id/report
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "reason": "부적절한 내용 포함",
  "details": "욕설이 포함되어 있습니다."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "리뷰가 신고되었습니다. 관리자가 검토할 예정입니다."
}
```

---

## 7. 결제 (Payments)

### 7.1 결제 카드 등록
```http
POST /api/payments/cards
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "cardNumber": "1234-5678-9012-3456",
  "cardType": "credit",
  "cardCompany": "신한",
  "expiryDate": "12/25",
  "isDefault": true
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "카드가 등록되었습니다.",
  "card": {
    "_id": "card_id_1",
    "cardNumber": "****-****-****-3456",
    "cardType": "credit",
    "cardCompany": "신한",
    "isDefault": true
  }
}
```

---

### 7.2 등록된 카드 목록 조회
```http
GET /api/payments/cards
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "cards": [
    {
      "_id": "card_id_1",
      "cardNumber": "****-****-****-3456",
      "cardType": "credit",
      "cardCompany": "신한",
      "isDefault": true,
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ]
}
```

---

### 7.3 카드 삭제
```http
DELETE /api/payments/cards/:cardId
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "카드가 삭제되었습니다."
}
```

---

### 7.4 기본 카드 설정
```http
PATCH /api/payments/cards/:cardId/default
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "기본 카드로 설정되었습니다.",
  "card": {
    "_id": "card_id_1",
    "isDefault": true
  }
}
```

---

### 7.5 Toss 결제 승인
```http
POST /api/payments/confirm
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "paymentKey": "payment_key_from_toss",
  "orderId": "order_123456",
  "amount": 260000,
  "bookingId": "booking_id_1"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "결제가 승인되었습니다.",
  "payment": {
    "paymentKey": "payment_key_from_toss",
    "orderId": "order_123456",
    "status": "DONE",
    "method": "카드",
    "totalAmount": 260000,
    "approvedAt": "2025-11-25T12:34:56.000Z"
  },
  "pointsEarned": 2600
}
```

---

### 7.6 결제 취소 (환불)
```http
POST /api/payments/cancel
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "paymentKey": "payment_key_from_toss",
  "cancelReason": "고객 변심",
  "cancelAmount": 260000
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "결제가 취소되었습니다. 환불은 3-5일 소요됩니다.",
  "cancellation": {
    "cancelAmount": 260000,
    "canceledAt": "2025-11-25T14:00:00.000Z",
    "cancelReason": "고객 변심"
  }
}
```

---

## 8. 쿠폰 (Coupons)

### 8.1 쿠폰 목록 조회
```http
GET /api/coupons
```

**Query Parameters**
- `hotelId` (string): 특정 호텔 ID (optional)
- `isActive` (boolean): 활성화 여부 (optional)

**Response** `200 OK`
```json
{
  "success": true,
  "coupons": [
    {
      "_id": "coupon_id_1",
      "code": "WELCOME10",
      "name": "신규 회원 10% 할인",
      "description": "첫 예약 시 사용 가능",
      "discountType": "percentage",
      "discountValue": 10,
      "minPurchaseAmount": 50000,
      "maxDiscountAmount": 50000,
      "applicableHotels": [],
      "issuedBy": "admin",
      "validFrom": "2025-11-01T00:00:00.000Z",
      "validTo": "2025-12-31T23:59:59.000Z",
      "usageLimit": 1,
      "isActive": true
    }
  ]
}
```

---

### 8.2 쿠폰 코드로 조회
```http
GET /api/coupons/code/:code
```

**Query Parameters**
- `hotelId` (string): 검증할 호텔 ID (optional)

**Response** `200 OK`
```json
{
  "success": true,
  "coupon": {
    "_id": "coupon_id_1",
    "code": "WELCOME10",
    "name": "신규 회원 10% 할인",
    "discountType": "percentage",
    "discountValue": 10,
    "minPurchaseAmount": 50000,
    "maxDiscountAmount": 50000,
    "isActive": true,
    "isApplicable": true
  }
}
```

**Error Response** `404 Not Found`
```json
{
  "success": false,
  "message": "유효하지 않은 쿠폰 코드입니다."
}
```

---

### 8.3 쿠폰 생성 (관리자)
```http
POST /api/coupons
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "code": "SUMMER2025",
  "name": "여름 특가 20% 할인",
  "description": "7-8월 예약 시 사용 가능",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchaseAmount": 100000,
  "maxDiscountAmount": 100000,
  "applicableHotels": [],
  "validFrom": "2025-07-01",
  "validTo": "2025-08-31",
  "usageLimit": 1,
  "isActive": true
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "쿠폰이 생성되었습니다.",
  "coupon": {
    "_id": "coupon_id_2",
    "code": "SUMMER2025",
    "name": "여름 특가 20% 할인",
    "discountType": "percentage",
    "discountValue": 20
  }
}
```

---

### 8.4 쿠폰 수정 (관리자)
```http
PUT /api/coupons/:id
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "isActive": false,
  "validTo": "2025-06-30"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "쿠폰이 수정되었습니다.",
  "coupon": {
    "_id": "coupon_id_1",
    "isActive": false
  }
}
```

---

### 8.5 쿠폰 삭제 (관리자)
```http
DELETE /api/coupons/:id
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "쿠폰이 삭제되었습니다."
}
```

---

## 9. 찜 (Favorites)

### 9.1 내 찜 목록 조회
```http
GET /api/favorites/my
Authorization: Bearer {token}
```

**Query Parameters**
- `page` (number): 페이지 번호 (default: 1)
- `limit` (number): 페이지당 개수 (default: 20)

**Response** `200 OK`
```json
{
  "success": true,
  "favorites": [
    {
      "_id": "favorite_id_1",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔",
        "images": ["https://..."],
        "rating": 4.5,
        "reviewCount": 120,
        "location": {
          "city": "서울",
          "address": "서울특별시 중구 세종대로 100"
        },
        "minPrice": 150000
      },
      "priceAlert": {
        "enabled": true,
        "targetPrice": 120000,
        "lastNotified": "2025-11-20T00:00:00.000Z"
      },
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "totalPages": 1
  }
}
```

---

### 9.2 찜 추가
```http
POST /api/favorites
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "찜 목록에 추가되었습니다.",
  "favorite": {
    "_id": "favorite_id_1",
    "user": "user_id_1",
    "hotel": "hotel_id_1",
    "createdAt": "2025-11-25T00:00:00.000Z"
  }
}
```

---

### 9.3 찜 삭제
```http
DELETE /api/favorites/:hotelId
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "찜 목록에서 제거되었습니다."
}
```

---

### 9.4 가격 알림 설정
```http
PUT /api/favorites/:hotelId/price-alert
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "enabled": true,
  "targetPrice": 120000
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "가격 알림이 설정되었습니다.",
  "priceAlert": {
    "enabled": true,
    "targetPrice": 120000
  }
}
```

---

### 9.5 가격 알림 확인 (시스템용)
```http
GET /api/favorites/check-price-alerts
```

이 엔드포인트는 스케줄러에서 주기적으로 호출하여 가격 알림을 확인합니다.

**Response** `200 OK`
```json
{
  "success": true,
  "message": "가격 알림 확인 완료",
  "notifiedCount": 5
}
```

---

## 10. 관리자 (Admin)

> 🔒 모든 관리자 API는 `admin` 역할의 인증 토큰이 필요합니다.

### 10.1 대시보드 통계
```http
GET /api/admin/dashboard/stats
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "stats": {
    "totalBookings": 1250,
    "totalRevenue": 325000000,
    "totalBusinessUsers": 45,
    "totalHotels": 128,
    "recentBookings": [
      {
        "_id": "booking_id_1",
        "user": { "name": "홍길동" },
        "hotel": { "name": "서울 그랜드 호텔" },
        "finalPrice": 260000,
        "createdAt": "2025-11-25T00:00:00.000Z"
      }
    ],
    "revenueByMonth": [
      { "month": "2025-11", "revenue": 45000000 },
      { "month": "2025-10", "revenue": 52000000 }
    ]
  }
}
```

---

### 10.2 사업자 사용자 목록
```http
GET /api/admin/business
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `status` (string): 승인 상태 (pending/approved/rejected/blocked)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id_1",
      "email": "business@example.com",
      "name": "김사장",
      "businessInfo": {
        "businessName": "호텔ABC",
        "businessNumber": "123-45-67890",
        "bankAccount": "우리은행 1002-123-456789"
      },
      "businessStatus": "pending",
      "hotelCount": 0,
      "createdAt": "2025-11-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

---

### 10.3 사업자 승인
```http
PUT /api/admin/business/:id/approve
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "사업자가 승인되었습니다.",
  "user": {
    "_id": "user_id_1",
    "role": "business",
    "businessStatus": "approved"
  }
}
```

---

### 10.4 사업자 거부
```http
PUT /api/admin/business/:id/reject
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "reason": "사업자등록번호 확인 불가"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "사업자 신청이 거부되었습니다.",
  "user": {
    "_id": "user_id_1",
    "businessStatus": "rejected"
  }
}
```

---

### 10.5 사업자 차단
```http
PUT /api/admin/business/:id/block
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "reason": "서비스 이용 약관 위반"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "사업자가 차단되었습니다.",
  "user": {
    "_id": "user_id_1",
    "businessStatus": "blocked",
    "isBlocked": true
  }
}
```

---

### 10.6 회원 목록 조회
```http
GET /api/admin/users
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `role` (string): 역할 필터 (user/business/admin)
- `isBlocked` (boolean): 차단 여부
- `search` (string): 이름/이메일 검색
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id_1",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user",
      "points": 1000,
      "isBlocked": false,
      "bookingCount": 5,
      "createdAt": "2025-11-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "totalPages": 8
  }
}
```

---

### 10.7 회원 상세 조회
```http
GET /api/admin/users/:id
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "user_id_1",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "role": "user",
    "points": 1000,
    "isBlocked": false,
    "favorites": ["hotel_id_1"],
    "recentBookings": [
      {
        "_id": "booking_id_1",
        "hotel": { "name": "서울 그랜드 호텔" },
        "checkIn": "2025-12-01",
        "finalPrice": 260000
      }
    ],
    "createdAt": "2025-11-01T00:00:00.000Z"
  }
}
```

---

### 10.8 회원 차단
```http
PUT /api/admin/users/:id/block
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "reason": "부적절한 리뷰 반복 작성"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "회원이 차단되었습니다.",
  "user": {
    "_id": "user_id_1",
    "isBlocked": true
  }
}
```

---

### 10.9 회원 차단 해제
```http
PUT /api/admin/users/:id/unblock
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "회원 차단이 해제되었습니다.",
  "user": {
    "_id": "user_id_1",
    "isBlocked": false
  }
}
```

---

### 10.10 회원 삭제
```http
DELETE /api/admin/users/:id
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "회원이 삭제되었습니다. 관련 데이터도 함께 삭제됩니다."
}
```

> ⚠️ 회원 삭제 시 해당 회원의 호텔, 객실, 예약, 리뷰 등 모든 데이터가 연쇄 삭제됩니다.

---

### 10.11 신고된 리뷰 목록
```http
GET /api/admin/reviews/reported
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id_1",
      "user": {
        "_id": "user_id_1",
        "name": "홍길동",
        "email": "user@example.com"
      },
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔"
      },
      "rating": 1,
      "comment": "최악입니다...",
      "reportInfo": {
        "reason": "부적절한 내용 포함",
        "reportedAt": "2025-11-24T00:00:00.000Z",
        "reportCount": 3
      },
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "totalPages": 2
  }
}
```

---

### 10.12 신고된 리뷰 승인 (유지)
```http
PUT /api/admin/reviews/:id/approve
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "리뷰가 승인되었습니다. 신고가 기각됩니다.",
  "review": {
    "_id": "review_id_1",
    "isReported": false
  }
}
```

---

### 10.13 신고된 리뷰 거부 (삭제)
```http
PUT /api/admin/reviews/:id/reject
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "리뷰가 삭제되었습니다."
}
```

---

### 10.14 전체 리뷰 목록
```http
GET /api/admin/reviews/all
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `hotel` (string): 호텔 ID
- `user` (string): 사용자 ID
- `minRating` (number): 최소 평점
- `maxRating` (number): 최대 평점
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id_1",
      "user": { "name": "홍길동" },
      "hotel": { "name": "서울 그랜드 호텔" },
      "rating": 5,
      "comment": "좋았습니다",
      "isReported": false,
      "createdAt": "2025-11-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "totalPages": 50
  }
}
```

---

### 10.15 리뷰 삭제
```http
DELETE /api/admin/reviews/:id
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "리뷰가 삭제되었습니다."
}
```

---

### 10.16 예약 목록 조회
```http
GET /api/admin/bookings
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `status` (string): 예약 상태
- `paymentStatus` (string): 결제 상태
- `startDate` (date): 시작 날짜
- `endDate` (date): 종료 날짜
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "booking_id_1",
      "bookingNumber": "HH20251201001",
      "user": { "name": "홍길동" },
      "hotel": { "name": "서울 그랜드 호텔" },
      "room": { "name": "디럭스 더블룸" },
      "checkIn": "2025-12-01",
      "checkOut": "2025-12-03",
      "finalPrice": 260000,
      "bookingStatus": "confirmed",
      "paymentStatus": "completed",
      "createdAt": "2025-11-24T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "totalPages": 63
  }
}
```

---

### 10.17 호텔 목록 조회
```http
GET /api/admin/hotels
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `city` (string): 도시 필터
- `status` (string): 상태 필터 (active/inactive)
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "hotels": [
    {
      "_id": "hotel_id_1",
      "name": "서울 그랜드 호텔",
      "owner": {
        "_id": "user_id_1",
        "name": "김사장"
      },
      "location": { "city": "서울" },
      "rating": 4.5,
      "reviewCount": 120,
      "roomCount": 50,
      "bookingCount": 230,
      "tags": ["인기", "럭셔리"],
      "status": "active",
      "createdAt": "2025-10-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 128,
    "page": 1,
    "totalPages": 7
  }
}
```

---

### 10.18 호텔 삭제
```http
DELETE /api/admin/hotels/:id
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "호텔이 삭제되었습니다."
}
```

---

### 10.19 호텔 태그 추가
```http
PUT /api/admin/hotels/:id/tags/add
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "tags": ["특가", "추천"]
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "호텔 태그가 추가되었습니다.",
  "hotel": {
    "_id": "hotel_id_1",
    "tags": ["인기", "럭셔리", "특가", "추천"]
  }
}
```

---

### 10.20 호텔 태그 제거
```http
PUT /api/admin/hotels/:id/tags/remove
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "tags": ["특가"]
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "호텔 태그가 제거되었습니다.",
  "hotel": {
    "_id": "hotel_id_1",
    "tags": ["인기", "럭셔리", "추천"]
  }
}
```

---

## 11. 시스템 설정 (System Settings)

> 🔒 시스템 설정 API는 `admin` 역할의 인증 토큰이 필요합니다.

### 11.1 시스템 설정 조회
```http
GET /api/system-settings
Authorization: Bearer {admin_token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "settings": {
    "_id": "settings_id",
    "maintenance": {
      "enabled": false,
      "message": "",
      "startTime": null,
      "endTime": null
    },
    "booking": {
      "maxAdvanceDays": 365,
      "minAdvanceHours": 2,
      "cancellationDeadlineHours": 24
    },
    "payment": {
      "pointEarnRate": 1,
      "maxPointUsage": 50000
    },
    "updatedAt": "2025-11-25T00:00:00.000Z"
  }
}
```

---

### 11.2 시스템 설정 수정
```http
PUT /api/system-settings
Authorization: Bearer {admin_token}
```

**Request Body**
```json
{
  "maintenance": {
    "enabled": true,
    "message": "시스템 점검 중입니다. 12월 1일 오전 2시까지 이용이 제한됩니다.",
    "startTime": "2025-12-01T00:00:00.000Z",
    "endTime": "2025-12-01T02:00:00.000Z"
  }
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "시스템 설정이 수정되었습니다.",
  "settings": {
    "maintenance": {
      "enabled": true,
      "message": "시스템 점검 중입니다..."
    }
  }
}
```

---

## 12. 활동 로그 (Activity Logs)

### 12.1 활동 로그 조회 (관리자)
```http
GET /api/activity-logs
Authorization: Bearer {admin_token}
```

**Query Parameters**
- `user` (string): 사용자 ID 필터
- `action` (string): 액션 타입 (login/logout/create_booking/cancel_booking/create_review/delete_review)
- `targetModel` (string): 대상 모델 (Booking/Review/Hotel/User)
- `startDate` (date): 시작 날짜
- `endDate` (date): 종료 날짜
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "logs": [
    {
      "_id": "log_id_1",
      "user": {
        "_id": "user_id_1",
        "name": "홍길동",
        "email": "user@example.com"
      },
      "action": "create_booking",
      "targetModel": "Booking",
      "targetId": "booking_id_1",
      "details": {
        "hotel": "서울 그랜드 호텔",
        "checkIn": "2025-12-01",
        "finalPrice": 260000
      },
      "ipAddress": "123.45.67.89",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-11-25T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5000,
    "page": 1,
    "totalPages": 250
  }
}
```

---

### 12.2 내 활동 로그 조회
```http
GET /api/activity-logs/my
Authorization: Bearer {token}
```

**Query Parameters**
- `action` (string): 액션 타입 필터
- `page` (number): 페이지 번호
- `limit` (number): 페이지당 개수

**Response** `200 OK`
```json
{
  "success": true,
  "logs": [
    {
      "_id": "log_id_1",
      "action": "create_booking",
      "targetModel": "Booking",
      "details": {
        "hotel": "서울 그랜드 호텔",
        "finalPrice": 260000
      },
      "createdAt": "2025-11-25T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "totalPages": 3
  }
}
```

---

## 13. 조회 기록 (View History)

### 13.1 조회 기록 저장
```http
POST /api/view-history
Authorization: Bearer {token}
```

**Request Body**
```json
{
  "hotel": "hotel_id_1"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "조회 기록이 저장되었습니다."
}
```

---

### 13.2 내 조회 기록 조회
```http
GET /api/view-history
Authorization: Bearer {token}
```

**Query Parameters**
- `limit` (number): 최대 개수 (default: 10, max: 50)

**Response** `200 OK`
```json
{
  "success": true,
  "history": [
    {
      "_id": "history_id_1",
      "hotel": {
        "_id": "hotel_id_1",
        "name": "서울 그랜드 호텔",
        "images": ["https://..."],
        "rating": 4.5,
        "location": {
          "city": "서울"
        },
        "minPrice": 150000
      },
      "viewedAt": "2025-11-25T12:00:00.000Z"
    }
  ],
  "total": 25
}
```

---

### 13.3 조회 기록 삭제
```http
DELETE /api/view-history/:id
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "조회 기록이 삭제되었습니다."
}
```

---

### 13.4 전체 조회 기록 삭제
```http
DELETE /api/view-history
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "모든 조회 기록이 삭제되었습니다."
}
```

---

## 📋 에러 코드 및 응답 형식

### HTTP 상태 코드

| Status Code | 의미 | 설명 |
|------------|------|------|
| 200 | OK | 요청 성공 |
| 201 | Created | 리소스 생성 성공 |
| 400 | Bad Request | 잘못된 요청 (필수 파라미터 누락, 유효성 검증 실패) |
| 401 | Unauthorized | 인증 필요 (토큰 없음, 만료, 유효하지 않음) |
| 403 | Forbidden | 권한 없음 (역할 부족, 계정 차단) |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 충돌 (중복된 이메일, 이미 존재하는 리소스) |
| 422 | Unprocessable Entity | 처리할 수 없는 엔티티 (비즈니스 로직 오류) |
| 500 | Internal Server Error | 서버 오류 |
| 503 | Service Unavailable | 서비스 이용 불가 (유지보수 모드) |

### 성공 응답 형식
```json
{
  "success": true,
  "message": "성공 메시지",
  "data": {
    /* 응답 데이터 */
  }
}
```

### 에러 응답 형식
```json
{
  "success": false,
  "message": "에러 메시지",
  "error": {
    "code": "ERROR_CODE",
    "details": "상세 에러 정보"
  }
}
```

### 주요 에러 메시지

**인증 관련**
- `토큰이 제공되지 않았습니다.` (401)
- `유효하지 않은 토큰입니다.` (401)
- `토큰이 만료되었습니다.` (401)
- `권한이 없습니다.` (403)
- `차단된 계정입니다. 관리자에게 문의하세요.` (403)

**유효성 검증**
- `이메일 형식이 올바르지 않습니다.` (400)
- `비밀번호는 최소 8자 이상이어야 합니다.` (400)
- `필수 항목을 입력해주세요.` (400)
- `날짜 형식이 올바르지 않습니다.` (400)

**리소스**
- `존재하지 않는 {리소스}입니다.` (404)
- `이미 존재하는 이메일입니다.` (409)
- `삭제된 {리소스}입니다.` (404)

**비즈니스 로직**
- `체크인 날짜는 오늘 이후여야 합니다.` (400)
- `체크아웃 날짜는 체크인 날짜 이후여야 합니다.` (400)
- `객실 재고가 부족합니다.` (422)
- `이미 예약된 객실입니다.` (409)
- `취소 기간이 지났습니다.` (422)
- `리뷰는 예약 완료 후 작성 가능합니다.` (422)

---

## 🔒 인증 헤더 형식

모든 인증이 필요한 API는 다음 헤더를 포함해야 합니다:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 토큰 만료 시간
- Access Token: 7일
- Password Reset Token: 1시간

---

## 📝 참고사항

### 날짜 형식
- ISO 8601 형식 사용
- 예: `2025-12-01` (날짜만) 또는 `2025-12-01T15:30:00.000Z` (날짜+시간)

### 페이지네이션
- 기본값: `page=1`, `limit=20`
- 최대 limit: 100

### 이미지 업로드
- Content-Type: `multipart/form-data`
- 지원 형식: JPG, PNG, WebP
- 최대 크기: 5MB per file
- 최대 개수: 10개 per request

### 가격 단위
- 모든 가격은 원화(KRW) 기준
- 정수형으로 전송 (예: 150000 = 15만원)

### 좌표 형식
- 위도(latitude): -90 ~ 90
- 경도(longitude): -180 ~ 180
- 소수점 6자리까지 지원

### 포인트 시스템
- 적립: 결제 금액의 1%
- 사용: 예약 시 최대 50% (50,000원 한도)
- 1포인트 = 1원

### 쿠폰 시스템
- 할인 타입: `percentage` (비율), `fixed` (고정 금액)
- 중복 사용: 불가
- 최소 구매 금액 확인 필요

### 예약 상태 (bookingStatus)
- `pending`: 예약 대기
- `confirmed`: 예약 확인
- `cancelled`: 예약 취소
- `completed`: 이용 완료
- `no_show`: 노쇼

### 결제 상태 (paymentStatus)
- `pending`: 결제 대기
- `completed`: 결제 완료
- `failed`: 결제 실패
- `refunded`: 환불 완료

### 사업자 상태 (businessStatus)
- `pending`: 승인 대기
- `approved`: 승인 완료
- `rejected`: 승인 거부
- `blocked`: 차단

### 호텔 타입 (hotelType)
- `luxury`: 럭셔리 호텔
- `business`: 비즈니스 호텔
- `resort`: 리조트
- `boutique`: 부티크 호텔
- `pension`: 펜션

### 객실 타입 (roomType)
- `standard`: 스탠다드
- `deluxe`: 디럭스
- `suite`: 스위트
- `premium`: 프리미엄

### 침대 타입 (bedType)
- `single`: 싱글
- `double`: 더블
- `twin`: 트윈
- `queen`: 퀸
- `king`: 킹

### 뷰 타입 (viewType)
- `ocean`: 오션뷰
- `mountain`: 마운틴뷰
- `city`: 시티뷰
- `garden`: 가든뷰
- `none`: 뷰 없음

### Rate Limiting
- 일반 사용자: 100 requests/minute
- 사업자: 200 requests/minute
- 관리자: 500 requests/minute

### CORS 설정
- 허용된 Origin: 프론트엔드 도메인
- Credentials: true
- 허용 메서드: GET, POST, PUT, PATCH, DELETE

---

## 🚀 API 변경 이력

### v2.0 (2025-11-25)
- ✨ 도메인 기반 아키텍처로 전면 재구성
- ✨ 결제 카드 관리 기능 추가
- ✨ 찜 목록 가격 알림 기능 추가
- ✨ 관리자 대시보드 통계 API 추가
- ✨ 활동 로그 상세 조회 기능 추가
- ✨ 시스템 설정 (유지보수 모드) API 추가
- 🔧 예약 번호 자동 생성 기능 추가
- 🔧 포인트 적립/사용 로직 개선
- 🔧 쿠폰 호텔별 적용 기능 추가
- 🔧 리뷰 신고 시스템 개선
- 📝 API 응답 형식 표준화
- 📝 에러 메시지 상세화

### v1.0 (2025-11-01)
- 🎉 초기 API 출시

---

*문의사항: dev@hotelhub.com*  
*마지막 업데이트: 2025년 11월 25일*

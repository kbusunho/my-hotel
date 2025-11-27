# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# 환경 변수를 빌드 인자로 받기
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_TOSS_CLIENT_KEY
ARG VITE_KAKAO_REST_API_KEY
ARG VITE_KAKAO_REDIRECT_URI
ARG VITE_KAKAO_MAP_KEY
ARG VITE_S3_PUBLIC_BASE

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 실행 (ARG를 직접 npm run build에 전달)
RUN VITE_API_URL="$VITE_API_URL" \
    VITE_API_BASE_URL="$VITE_API_BASE_URL" \
    VITE_TOSS_CLIENT_KEY="$VITE_TOSS_CLIENT_KEY" \
    VITE_KAKAO_REST_API_KEY="$VITE_KAKAO_REST_API_KEY" \
    VITE_KAKAO_REDIRECT_URI="$VITE_KAKAO_REDIRECT_URI" \
    VITE_KAKAO_MAP_KEY="$VITE_KAKAO_MAP_KEY" \
    VITE_S3_PUBLIC_BASE="$VITE_S3_PUBLIC_BASE" \
    npm run build
RUN npm run build

# Production stage
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 nginx 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

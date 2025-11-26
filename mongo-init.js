  // MongoDB 초기화 스크립트
db = db.getSiblingDB('hotelhub');

// 기본 관리자 계정 생성 (선택사항)
db.createUser({
  user: 'hotelhub_admin',
  pwd: 'hotelhub_password',
  roles: [
    {
      role: 'readWrite',
      db: 'hotelhub'
    }
  ]
});

print('MongoDB initialized successfully!');

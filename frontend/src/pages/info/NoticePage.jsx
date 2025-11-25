import { useState } from 'react';

export default function NoticePage() {
  const [notices] = useState([
    {
      id: 1,
      title: '[공지] 설연휴 고객센터 운영 안내',
      date: '2025.01.20',
      views: 1234,
      content: '안녕하세요. HotelHub입니다.\n\n설연휴 기간 동안 고객센터 운영 시간이 변경됩니다.\n\n운영 기간: 2025년 1월 28일 ~ 2월 2일\n운영 시간: 오전 10시 ~ 오후 5시\n\n고객 여러분의 양해 부탁드립니다.\n감사합니다.'
    },
    {
      id: 2,
      title: '[이벤트] 신규 회원 가입 시 10% 할인 쿠폰 증정!',
      date: '2025.01.15',
      views: 3456,
      content: 'HotelHub에 오신 것을 환영합니다!\n\n신규 회원 가입 시 첫 예약에 사용 가능한 10% 할인 쿠폰을 드립니다.\n\n- 할인율: 10% (최대 50,000원)\n- 유효기간: 가입일로부터 30일\n- 사용조건: 최소 주문금액 100,000원 이상\n\n지금 바로 회원가입하고 할인 혜택을 받으세요!'
    },
    {
      id: 3,
      title: '[안내] 개인정보처리방침 개정 안내',
      date: '2025.01.10',
      views: 892,
      content: 'HotelHub 개인정보처리방침이 개정되었습니다.\n\n주요 변경사항:\n- 개인정보 보유기간 명시\n- 제3자 제공 항목 추가\n- 개인정보 파기 절차 상세화\n\n시행일: 2025년 1월 15일\n\n자세한 내용은 사이트 하단의 개인정보처리방침을 확인해주세요.'
    },
    {
      id: 4,
      title: '[공지] 시스템 점검 안내 (1월 25일)',
      date: '2025.01.08',
      views: 2341,
      content: '안정적인 서비스 제공을 위한 시스템 점검이 진행됩니다.\n\n점검 일시: 2025년 1월 25일 (목) 02:00 ~ 06:00 (4시간)\n점검 내용: 서버 증설 및 보안 업데이트\n\n점검 시간 동안 서비스 이용이 일시 중단됩니다.\n이용에 불편을 드려 죄송합니다.'
    },
    {
      id: 5,
      title: '[안내] 포인트 적립 정책 변경 안내',
      date: '2025.01.05',
      views: 1567,
      content: '포인트 적립 정책이 다음과 같이 변경됩니다.\n\n변경 전: 결제금액의 1% 적립\n변경 후: 결제금액의 2% 적립\n\n적용 시작일: 2025년 2월 1일부터\n\n더 많은 혜택으로 보답하겠습니다.\n감사합니다.'
    },
    {
      id: 6,
      title: '[이벤트] 리뷰 작성하고 포인트 받자!',
      date: '2024.12.28',
      views: 4523,
      content: '여행 후기를 공유하고 포인트를 받으세요!\n\n이벤트 기간: 2025년 1월 1일 ~ 1월 31일\n리워드: 리뷰 1건당 5,000 포인트 적립\n참여 방법: 내 예약 > 이용완료 > 리뷰 작성\n\n※ 사진 포함 리뷰 작성 시 3,000 포인트 추가 적립!\n※ 중복 적립 불가, 1인 1회 한정'
    }
  ]);

  const [selectedNotice, setSelectedNotice] = useState(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">공지사항</h1>

        {selectedNotice ? (
          // 공지사항 상세
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b p-6">
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-sage-600 hover:text-sage-700 mb-4"
              >
                ← 목록으로
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedNotice.title}</h2>
              <div className="flex items-center text-gray-600 text-sm space-x-4">
                <span>작성일: {selectedNotice.date}</span>
                <span>조회수: {selectedNotice.views.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {selectedNotice.content}
              </div>
            </div>
          </div>
        ) : (
          // 공지사항 목록
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">번호</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">제목</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-32">작성일</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-24">조회수</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {notices.map((notice, index) => (
                  <tr
                    key={notice.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{notices.length - index}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 hover:text-sage-600">
                        {notice.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{notice.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{notice.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

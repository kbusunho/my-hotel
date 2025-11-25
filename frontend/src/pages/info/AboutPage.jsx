export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">회사 소개</h1>
        
        <div className="prose prose-lg">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">HotelHub 소개</h2>
            <p className="text-gray-700 mb-4">
              HotelHub은 2020년에 설립된 대한민국 최고의 호텔 예약 플랫폼입니다. 
              우리는 고객들에게 최상의 숙박 경험을 제공하기 위해 전국의 우수한 호텔들과 
              파트너십을 맺고 있습니다.
            </p>
            <p className="text-gray-700 mb-4">
              현재 서울, 부산, 제주, 인천 등 주요 도시의 500여 개 호텔과 협력하고 있으며, 
              매년 100만 명 이상의 고객들이 HotelHub을 통해 편리하고 안전한 예약 서비스를 
              이용하고 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">우리의 비전</h2>
            <p className="text-gray-700 mb-4">
              "모든 여행자가 완벽한 숙소를 찾을 수 있도록"
            </p>
            <p className="text-gray-700 mb-4">
              HotelHub은 단순한 예약 플랫폼을 넘어, 여행의 시작부터 끝까지 
              함께하는 동반자가 되고자 합니다. 최신 기술과 사용자 중심의 
              인터페이스를 통해 누구나 쉽고 빠르게 원하는 숙소를 찾을 수 있도록 
              지속적으로 발전하고 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">핵심 가치</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3">신뢰</h3>
                <p className="text-gray-700">
                  검증된 호텔 정보와 실제 이용 후기를 통해 
                  고객의 신뢰를 최우선으로 생각합니다.
                </p>
              </div>
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3">편리함</h3>
                <p className="text-gray-700">
                  직관적인 인터페이스와 간편한 예약 프로세스로 
                  누구나 쉽게 이용할 수 있습니다.
                </p>
              </div>
              <div className="bg-sage-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-3">혁신</h3>
                <p className="text-gray-700">
                  AI 기반 추천 시스템과 실시간 가격 비교로 
                  최고의 가치를 제공합니다.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">회사 정보</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-gray-600 mb-1">회사명</dt>
                  <dd className="text-gray-800">주식회사 호텔허브</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600 mb-1">설립일</dt>
                  <dd className="text-gray-800">2020년 3월 15일</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600 mb-1">대표이사</dt>
                  <dd className="text-gray-800">김호텔</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600 mb-1">사업자등록번호</dt>
                  <dd className="text-gray-800">123-45-67890</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600 mb-1">주소</dt>
                  <dd className="text-gray-800">서울특별시 강남구 테헤란로 123, 10층</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-600 mb-1">통신판매업신고</dt>
                  <dd className="text-gray-800">제2020-서울강남-00001호</dd>
                </div>
              </dl>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">연혁</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-sage-500 pl-4">
                <h3 className="font-bold">2024년</h3>
                <p className="text-gray-700">- 누적 예약 건수 200만 건 돌파</p>
                <p className="text-gray-700">- AI 기반 개인화 추천 시스템 도입</p>
              </div>
              <div className="border-l-4 border-sage-500 pl-4">
                <h3 className="font-bold">2023년</h3>
                <p className="text-gray-700">- 제주도 지역 호텔 100% 커버리지 달성</p>
                <p className="text-gray-700">- 포인트 적립 프로그램 론칭</p>
              </div>
              <div className="border-l-4 border-sage-500 pl-4">
                <h3 className="font-bold">2022년</h3>
                <p className="text-gray-700">- 모바일 앱 출시</p>
                <p className="text-gray-700">- 전국 500개 호텔 파트너십 체결</p>
              </div>
              <div className="border-l-4 border-sage-500 pl-4">
                <h3 className="font-bold">2020년</h3>
                <p className="text-gray-700">- HotelHub 서비스 정식 오픈</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

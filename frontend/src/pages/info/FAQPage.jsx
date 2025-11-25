import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaThumbsUp } from 'react-icons/fa';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [helpfulQuestions, setHelpfulQuestions] = useState([]);

  const faqs = [
    {
      category: '예약/결제',
      questions: [
        {
          q: '예약을 취소하고 싶어요. 환불이 가능한가요?',
          a: '체크인 24시간 전까지는 무료 취소가 가능하며, 전액 환불됩니다. 24시간 이내 취소 시에는 호텔별 취소 정책에 따라 위약금이 부과될 수 있습니다. 내 예약 페이지에서 취소 가능 여부를 확인하실 수 있습니다.'
        },
        {
          q: '예약 확인은 어떻게 하나요?',
          a: '예약 완료 후 등록하신 이메일로 예약 확인서가 발송됩니다. 또한 로그인 후 "내 예약" 메뉴에서 예약 내역을 확인하실 수 있습니다. 예약번호를 메모해두시면 호텔 체크인 시 편리합니다.'
        },
        {
          q: '결제는 어떤 방법으로 할 수 있나요?',
          a: '신용카드, 체크카드, 가상계좌 결제가 가능합니다. 모든 결제는 Toss Payments를 통해 안전하게 처리되며, 결제 정보는 암호화되어 보호됩니다.'
        },
        {
          q: '예약 후 날짜 변경이 가능한가요?',
          a: '예약 날짜 변경은 기존 예약을 취소하고 새로 예약하셔야 합니다. 취소 수수료가 발생할 수 있으니, 예약 전 날짜를 신중히 확인해주세요.'
        }
      ]
    },
    {
      category: '포인트/쿠폰',
      questions: [
        {
          q: '포인트는 어떻게 적립되나요?',
          a: '결제 완료 시 결제 금액의 2%가 자동으로 포인트로 적립됩니다. 적립된 포인트는 다음 예약 시 현금처럼 사용하실 수 있으며, 유효기간은 적립일로부터 1년입니다.'
        },
        {
          q: '쿠폰은 어떻게 사용하나요?',
          a: '결제 페이지에서 보유하신 쿠폰을 선택하여 사용하실 수 있습니다. 쿠폰은 중복 사용이 불가능하며, 쿠폰별 최소 결제 금액 조건이 있을 수 있습니다.'
        },
        {
          q: '포인트와 쿠폰을 함께 사용할 수 있나요?',
          a: '네, 가능합니다. 결제 시 쿠폰 할인을 먼저 적용한 후, 남은 금액에서 포인트를 사용하실 수 있습니다.'
        }
      ]
    },
    {
      category: '호텔 이용',
      questions: [
        {
          q: '체크인/체크아웃 시간은 언제인가요?',
          a: '일반적으로 체크인은 오후 3시, 체크아웃은 오전 11시입니다. 다만, 호텔마다 시간이 다를 수 있으니 예약 시 확인하신 정보를 참고해주세요. 얼리 체크인이나 레이트 체크아웃은 호텔에 직접 문의하셔야 합니다.'
        },
        {
          q: '추가 인원이 있는 경우 어떻게 하나요?',
          a: '예약 시 입력하신 인원수를 초과하는 경우, 호텔 정책에 따라 추가 요금이 발생할 수 있습니다. 가능하면 예약 시 정확한 인원수를 입력해주세요.'
        },
        {
          q: '주차가 가능한가요?',
          a: '호텔마다 주차 시설이 다릅니다. 호텔 상세페이지의 편의시설 정보에서 주차 가능 여부를 확인하실 수 있습니다. 일부 호텔은 주차 요금이 별도로 부과될 수 있습니다.'
        }
      ]
    },
    {
      category: '회원정보',
      questions: [
        {
          q: '비밀번호를 잊어버렸어요.',
          a: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면, 가입하신 이메일로 비밀번호 재설정 링크가 발송됩니다. 이메일을 받지 못하셨다면 스팸 메일함을 확인해주세요.'
        },
        {
          q: '회원 탈퇴는 어떻게 하나요?',
          a: '로그인 후 마이페이지 > 회원정보 수정 > 회원탈퇴 메뉴에서 탈퇴하실 수 있습니다. 탈퇴 시 보유하신 포인트와 쿠폰은 모두 소멸되며, 복구가 불가능합니다. 진행 중인 예약이 있는 경우 탈퇴가 제한될 수 있습니다.'
        },
        {
          q: '개인정보는 어떻게 관리되나요?',
          a: 'HotelHub은 개인정보보호법에 따라 고객님의 개인정보를 안전하게 관리합니다. 자세한 내용은 사이트 하단의 개인정보처리방침을 참고해주세요.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  const markHelpful = (categoryIndex, questionIndex) => {
    const id = `${categoryIndex}-${questionIndex}`;
    if (!helpfulQuestions.includes(id)) {
      setHelpfulQuestions([...helpfulQuestions, id]);
    }
  };

  // 검색 필터링
  const filteredFAQs = faqs.map((category, catIdx) => ({
    ...category,
    categoryIndex: catIdx,
    questions: category.questions.map((q, qIdx) => ({ ...q, questionIndex: qIdx }))
      .filter(q =>
        searchTerm === '' ||
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
        <p className="text-gray-600 mb-8">
          HotelHub 이용 중 궁금하신 점을 확인해보세요. 
          아래 목록에서 원하는 답변을 찾지 못하셨다면 고객센터(1588-0000)로 문의해주세요.
        </p>

        {/* 검색창 */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <p className="text-center mt-3 text-gray-600">
              "{searchTerm}"에 대한 검색 결과 {filteredFAQs.reduce((acc, cat) => acc + cat.questions.length, 0)}개
            </p>
          )}
        </div>

        <div className="space-y-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">검색 결과가 없습니다.</p>
              <p className="text-sm">다른 검색어로 다시 시도해주세요.</p>
            </div>
          ) : (
            filteredFAQs.map((category) => {
              const categoryIndex = category.categoryIndex;
              return (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold mb-4 text-sage-600">
                    {category.category} ({category.questions.length})
                  </h2>
                  <div className="space-y-3">
                    {category.questions.map((faq) => {
                      const questionIndex = faq.questionIndex;
                      const index = `${categoryIndex}-${questionIndex}`;
                      const isOpen = openIndex === index;
                      const isHelpful = helpfulQuestions.includes(index);

                      return (
                        <div
                          key={questionIndex}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          <button
                            onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                            className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-left font-semibold text-gray-900 pr-4">
                              Q. {faq.q}
                            </span>
                            {isOpen ? (
                              <FaChevronUp className="text-sage-600 mt-1 flex-shrink-0" />
                            ) : (
                              <FaChevronDown className="text-gray-400 mt-1 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 py-4 bg-sage-50 border-t">
                              <p className="text-gray-700 leading-relaxed mb-4">
                                A. {faq.a}
                              </p>
                              <button
                                onClick={() => markHelpful(categoryIndex, questionIndex)}
                                disabled={isHelpful}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                  isHelpful
                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <FaThumbsUp className="text-sm" />
                                <span className="text-sm">
                                  {isHelpful ? '도움이 되었습니다!' : '도움이 되었나요?'}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-3">찾으시는 답변이 없으신가요?</h3>
          <p className="text-gray-700 mb-4">
            고객센터를 통해 문의하시면 신속하게 도움을 드리겠습니다.
          </p>
          <div className="space-y-2 text-gray-700">
            <p>📞 고객센터: 1588-0000</p>
            <p>📧 이메일: support@hotelhub.com</p>
            <p>⏰ 운영시간: 평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

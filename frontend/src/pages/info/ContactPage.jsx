import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaUser, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    type: 'advertising',
    company: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제로는 백엔드 API로 전송
    console.log('문의 제출:', formData);
    setSubmitted(true);
    
    // 3초 후 초기화
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        type: 'advertising',
        company: '',
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">광고 및 제휴 문의</h1>
        <p className="text-gray-600 text-lg">
          HotelHub와 함께 성장할 파트너를 찾습니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          {/* 광고 문의 */}
          <div className="bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <FaEnvelope className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">광고 문의</h3>
                <p className="text-sm text-sage-100">배너 및 제휴 광고</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <FaEnvelope className="mr-2" />
                ad@hotelhub.com
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                02-1588-0001
              </p>
            </div>
          </div>

          {/* 제휴 문의 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <FaBuilding className="text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold">제휴 문의</h3>
                <p className="text-sm text-blue-100">사업 제휴 및 협력</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <FaEnvelope className="mr-2" />
                partnership@hotelhub.com
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                02-1588-0002
              </p>
            </div>
          </div>

          {/* 본사 위치 */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <FaMapMarkerAlt className="text-sage-600 mr-2" />
              본사 위치
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">(주)호텔허브</p>
              <p>서울특별시 강남구</p>
              <p>테헤란로 123, 10층</p>
              <p className="pt-2 border-t mt-2">
                평일 09:00 - 18:00<br />
                (주말 및 공휴일 휴무)
              </p>
            </div>
          </div>

          {/* 광고 상품 안내 */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-3">광고 상품</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">📱</span>
                <span>모바일 배너 광고</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💻</span>
                <span>PC 메인 배너 광고</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⭐</span>
                <span>추천 호텔 프로모션</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>뉴스레터 광고</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">문의하기</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                <p className="font-semibold">✅ 문의가 성공적으로 접수되었습니다!</p>
                <p className="text-sm mt-1">영업일 기준 2-3일 내로 답변 드리겠습니다.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 문의 유형 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  문의 유형 *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="advertising">광고 문의</option>
                  <option value="partnership">제휴 문의</option>
                  <option value="general">일반 문의</option>
                </select>
              </div>

              {/* 회사명 & 담당자명 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    회사명 *
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="(주)회사명"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    담당자명 *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="홍길동"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 이메일 & 전화번호 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    연락처 *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="010-1234-5678"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="문의 제목을 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>

              {/* 문의 내용 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  문의 내용 *
                </label>
                <textarea
                  required
                  rows="6"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="문의 내용을 상세히 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
                />
              </div>

              {/* 개인정보 동의 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
                  />
                  <span className="text-sm text-gray-600">
                    개인정보 수집 및 이용에 동의합니다. (필수)
                    <br />
                    <span className="text-xs text-gray-500">
                      수집 항목: 회사명, 담당자명, 이메일, 연락처 | 목적: 문의 답변 | 보유 기간: 문의 처리 후 1년
                    </span>
                  </span>
                </label>
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-sage-600 to-sage-500 text-white rounded-lg hover:from-sage-700 hover:to-sage-600 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
              >
                <FaPaperPlane />
                <span>문의하기</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="mt-12 bg-gradient-to-r from-sage-50 to-blue-50 rounded-lg p-8 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center">왜 HotelHub와 함께해야 할까요?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="bg-sage-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1M+
            </div>
            <h4 className="font-bold mb-2">월간 방문자</h4>
            <p className="text-sm text-gray-600">매월 100만명 이상의 사용자가 이용</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              5K+
            </div>
            <h4 className="font-bold mb-2">제휴 호텔</h4>
            <p className="text-sm text-gray-600">전국 5천개 이상의 호텔과 제휴</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              #1
            </div>
            <h4 className="font-bold mb-2">업계 1위</h4>
            <p className="text-sm text-gray-600">호텔 예약 플랫폼 선호도 1위</p>
          </div>
        </div>
      </div>
    </div>
  );
}

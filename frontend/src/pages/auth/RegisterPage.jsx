import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '../../api/axios';
import toast from '../../utils/toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: 'user',
    // 결제 정보
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
    country: 'South Korea',
    saveAsDefault: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false
  });

  // 전체 동의 핸들러
  const handleAllAgreements = (checked) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      marketing: checked
    });
  };

  // 개별 약관 동의 핸들러
  const handleAgreement = (key, checked) => {
    const newAgreements = { ...agreements, [key]: checked };
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
    setAgreements(newAgreements);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 필수 약관 체크
    if (!agreements.terms || !agreements.privacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 1. 회원가입
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: formData.role
      });

      // 2. 카드 등록 (선택사항)
      if (formData.cardNumber && formData.expiryDate && formData.cvc && formData.cardName) {
        try {
          const token = localStorage.getItem('token');
          await axios.post('/api/payments/cards', {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardName: formData.cardName,
            expiryDate: formData.expiryDate,
            country: formData.country,
            isDefault: formData.saveAsDefault
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (cardError) {
          console.error('카드 등록 실패:', cardError);
          // 카드 등록 실패해도 회원가입은 성공으로 처리
        }
      }

      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      toast.error(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <FaArrowLeft className="mr-2" />
            로그인으로 돌아가기
          </Link>
          <h2 className="text-4xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-sm text-gray-600">회원 가입</p>
        </div>

        {/* Sign Up Form with Payment Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 기본 정보 */}
            <div className="space-y-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>

              {/* 회원 유형 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  회원 유형
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'user'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.role === 'user'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <div className="font-semibold text-gray-900">일반 회원</div>
                      <div className="text-xs text-gray-500 mt-1">호텔 검색 및 예약</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'business'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.role === 'business'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold text-gray-900">사업자</div>
                      <div className="text-xs text-gray-500 mt-1">호텔 등록 및 관리</div>
                    </div>
                  </button>
                </div>
                
                {formData.role === 'business' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      ℹ️ 사업자 회원은 관리자 승인 후 호텔 등록이 가능합니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 약관 동의 */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="agree-all"
                    checked={agreements.all}
                    onChange={(e) => handleAllAgreements(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="agree-all" className="ml-3 text-base font-semibold text-gray-900">
                    전체 동의
                  </label>
                </div>

                <div className="space-y-3 pl-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="agree-terms"
                        checked={agreements.terms}
                        onChange={(e) => handleAgreement('terms', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="agree-terms" className="ml-3 text-sm text-gray-700">
                        이용약관 동의 <span className="text-red-500">(필수)</span>
                      </label>
                    </div>
                    <Link to="/terms" className="text-xs text-gray-500 hover:text-indigo-600 underline">
                      보기
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="agree-privacy"
                        checked={agreements.privacy}
                        onChange={(e) => handleAgreement('privacy', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="agree-privacy" className="ml-3 text-sm text-gray-700">
                        개인정보 처리방침 동의 <span className="text-red-500">(필수)</span>
                      </label>
                    </div>
                    <Link to="/privacy" className="text-xs text-gray-500 hover:text-indigo-600 underline">
                      보기
                    </Link>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="agree-marketing"
                        checked={agreements.marketing}
                        onChange={(e) => handleAgreement('marketing', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="agree-marketing" className="ml-3 text-sm text-gray-700">
                        마케팅 정보 수신 동의 <span className="text-gray-400">(선택)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  약관에 동의
                </label>
              </div>
            </div>

            {/* 결제 수단 추가 (선택사항) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">결제수단 추가</h3>
                <p className="text-sm text-gray-500 mt-1">선택사항입니다. 나중에도 추가할 수 있습니다.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카드번호
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16 && /^\d*$/.test(value)) {
                      setFormData({...formData, cardNumber: formatCardNumber(value)});
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    유효기간
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setFormData({...formData, expiryDate: formatExpiryDate(value)});
                      }
                    }}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={formData.cvc}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) {
                        setFormData({...formData, cvc: value});
                      }
                    }}
                    placeholder="123"
                    maxLength="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카드 소유자명
                </label>
                <input
                  type="text"
                  value={formData.cardName}
                  onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  국가 또는 지역
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="South Korea">대한민국</option>
                  <option value="United States">미국</option>
                  <option value="Japan">일본</option>
                  <option value="China">중국</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.saveAsDefault}
                  onChange={(e) => setFormData({...formData, saveAsDefault: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-600">
                  기본 결제수단으로 설정
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '회원가입 처리 중...' : '회원가입'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              로그인 하러가기
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-700">
              이미 계정이 있으신가요?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

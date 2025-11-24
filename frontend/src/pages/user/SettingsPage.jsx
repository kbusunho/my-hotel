import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // 프로필 수정
  const [profileData, setProfileData] = useState({
    name: '',
    phone: ''
  });

  // 비밀번호 변경
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 결제 카드 관리
  const [cards, setCards] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
    country: 'South Korea',
    isDefault: false
  });

  // 회원탈퇴
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 로딩 및 메시지
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || ''
      });
      fetchCards();
    }
  }, [user]);

  // 등록된 카드 목록 가져오기
  const fetchCards = async () => {
    try {
      const response = await axios.get('/payments/cards');
      setCards(response.data.data || []);
    } catch (error) {
      console.error('카드 목록 조회 실패:', error);
    }
  };

  // 프로필 수정 처리
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put('/users/me', profileData);
      setMessage({ type: 'success', text: '프로필이 업데이트되었습니다.' });
      // 3초 후 페이지 새로고침으로 AuthContext 갱신
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '프로필 업데이트에 실패했습니다.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경 처리
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // 유효성 검사
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '새 비밀번호는 최소 6자 이상이어야 합니다.' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      setLoading(false);
      return;
    }

    try {
      await axios.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: '비밀번호가 변경되었습니다. 다시 로그인해주세요.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // 3초 후 로그아웃
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '비밀번호 변경에 실패했습니다.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.delete('/users/me', {
        data: { password: deletePassword }
      });

      alert('회원탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
      logout();
      navigate('/');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '회원탈퇴에 실패했습니다.' 
      });
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
      setDeletePassword('');
    }
  };

  // 카드 추가
  const handleAddCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('/payments/cards', {
        cardNumber: newCard.cardNumber.replace(/\s/g, ''),
        cardName: newCard.cardName,
        expiryDate: newCard.expiryDate,
        country: newCard.country,
        isDefault: newCard.isDefault
      });

      setMessage({ type: 'success', text: '카드가 등록되었습니다.' });
      setShowCardModal(false);
      setNewCard({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardName: '',
        country: 'South Korea',
        isDefault: false
      });
      fetchCards();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '카드 등록에 실패했습니다.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 카드 삭제
  const handleDeleteCard = async (cardId) => {
    if (!confirm('이 카드를 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/payments/cards/${cardId}`);
      setMessage({ type: 'success', text: '카드가 삭제되었습니다.' });
      fetchCards();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '카드 삭제에 실패했습니다.' 
      });
    }
  };

  // 기본 카드 설정
  const handleSetDefaultCard = async (cardId) => {
    try {
      await axios.patch(`/payments/cards/${cardId}/default`);
      setMessage({ type: 'success', text: '기본 카드가 설정되었습니다.' });
      fetchCards();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '기본 카드 설정에 실패했습니다.' 
      });
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">계정 설정</h1>

      {/* 메시지 표시 */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* 프로필 수정 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">프로필 정보</h2>
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">이름</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">전화번호</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="010-1234-5678"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? '저장 중...' : '프로필 저장'}
          </button>
        </form>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">현재 비밀번호</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">새 비밀번호</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength="6"
              required
            />
            <p className="text-sm text-gray-500 mt-1">최소 6자 이상 입력해주세요.</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">새 비밀번호 확인</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>

      {/* 등록된 결제 카드 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">등록된 카드</h2>
          <button
            onClick={() => setShowCardModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            + 카드 추가
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>등록된 카드가 없습니다.</p>
            <p className="text-sm mt-2">카드를 추가하여 빠른 결제를 이용하세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <div key={card._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-lg">{card.cardNumber}</span>
                      {card.isDefault && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          기본 카드
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{card.cardName}</p>
                    <p className="text-sm text-gray-500">유효기간: {card.expiryDate}</p>
                  </div>
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefaultCard(card._id)}
                        className="px-3 py-1 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
                      >
                        기본 설정
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCard(card._id)}
                      className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 transition"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 회원탈퇴 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-600">회원탈퇴</h2>
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-800 font-semibold mb-2">⚠️ 주의사항</p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>탈퇴 시 모든 개인정보가 삭제됩니다.</li>
            <li>보유하신 포인트와 쿠폰은 모두 소멸됩니다.</li>
            <li>진행 중인 예약이 있으면 탈퇴할 수 없습니다.</li>
            <li>탈퇴 후 같은 이메일로 재가입이 불가능할 수 있습니다.</li>
          </ul>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          회원탈퇴
        </button>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-red-600">정말 탈퇴하시겠습니까?</h3>
            <p className="text-gray-700 mb-4">
              탈퇴를 원하시면 비밀번호를 입력해주세요.
            </p>

            {message.text && message.type === 'error' && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                {message.text}
              </div>
            )}

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setMessage({ type: '', text: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || !deletePassword}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {loading ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카드 추가 모달 */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">카드 추가</h3>
            
            <form onSubmit={handleAddCard}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">카드번호</label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16 && /^\d*$/.test(value)) {
                      setNewCard({...newCard, cardNumber: formatCardNumber(value)});
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">유효기간</label>
                  <input
                    type="text"
                    value={newCard.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setNewCard({...newCard, expiryDate: formatExpiryDate(value)});
                      }
                    }}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">CVC</label>
                  <input
                    type="text"
                    value={newCard.cvc}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) {
                        setNewCard({...newCard, cvc: value});
                      }
                    }}
                    placeholder="123"
                    maxLength="3"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">카드 소유자명</label>
                <input
                  type="text"
                  value={newCard.cardName}
                  onChange={(e) => setNewCard({...newCard, cardName: e.target.value})}
                  placeholder="홍길동"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">국가</label>
                <select
                  value={newCard.country}
                  onChange={(e) => setNewCard({...newCard, country: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="South Korea">대한민국</option>
                  <option value="United States">미국</option>
                  <option value="Japan">일본</option>
                  <option value="China">중국</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCard.isDefault}
                    onChange={(e) => setNewCard({...newCard, isDefault: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">기본 카드로 설정</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCardModal(false);
                    setNewCard({
                      cardNumber: '',
                      expiryDate: '',
                      cvc: '',
                      cardName: '',
                      country: 'South Korea',
                      isDefault: false
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {loading ? '등록 중...' : '카드 추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

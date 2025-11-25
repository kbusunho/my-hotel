import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function BusinessSettingsPage() {
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
    }
  }, [user]);

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

      alert('사업자 계정이 탈퇴되었습니다. 그동안 이용해주셔서 감사합니다.');
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">계정 설정</h1>

      {/* 사업자 정보 표시 */}
      {user?.businessStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="font-semibold text-blue-900 mb-1">사업자 계정</p>
          <p className="text-sm text-blue-700">
            승인 상태: {user.businessStatus === 'approved' ? '✅ 승인됨' : 
                       user.businessStatus === 'pending' ? '⏳ 승인 대기' : '❌ 거절됨'}
          </p>
        </div>
      )}

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
            <label className="block text-gray-700 mb-2">사업자명</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">연락처</label>
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

      {/* 회원탈퇴 */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-600">사업자 계정 탈퇴</h2>
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-800 font-semibold mb-2">⚠️ 주의사항</p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>탈퇴 시 모든 사업자 정보가 삭제됩니다.</li>
            <li>등록하신 호텔과 객실 정보가 모두 삭제됩니다.</li>
            <li>진행 중인 예약이 있으면 탈퇴할 수 없습니다.</li>
            <li>삭제된 데이터는 복구할 수 없습니다.</li>
          </ul>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          사업자 계정 탈퇴
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
    </div>
  );
}

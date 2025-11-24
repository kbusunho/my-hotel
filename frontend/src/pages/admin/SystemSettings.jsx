import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'HotelHub',
    siteEmail: 'admin@hotelhub.com',
    maintenanceMode: false,
    maintenanceMessage: '',
    allowRegistration: true,
    emailNotifications: true,
    pointsPerReservation: 1000,
    pointsExpirationDays: 365,
    cancellationDeadlineHours: 24
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 설정 불러오기
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/system-settings/admin');
      setSettings(response.data);
    } catch (error) {
      console.error('설정 불러오기 실패:', error);
      setMessage('설정을 불러오는데 실패했습니다.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      await axios.put('/system-settings', settings);
      setMessage('설정이 성공적으로 저장되었습니다.');
      
      // 3초 후 메시지 제거
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setMessage('설정 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">시스템 설정</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('성공') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* 사이트 기본 설정 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">사이트 설정</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">사이트 이름</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">관리자 이메일</label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 시스템 모드 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">시스템 모드</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-yellow-900">유지보수 모드</label>
                <p className="text-xs text-yellow-700 mt-1">
                  활성화 시 관리자를 제외한 모든 사용자의 접근이 차단됩니다.
                </p>
              </div>
            </div>

            {settings.maintenanceMode && (
              <div>
                <label className="block text-sm font-medium mb-2">유지보수 메시지</label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="사용자에게 표시할 메시지를 입력하세요."
                />
              </div>
            )}
          </div>
        </div>

        {/* 기능 활성화 설정 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">기능 설정</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
              />
              <label className="text-sm">회원 가입 허용</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              />
              <label className="text-sm">이메일 알림</label>
            </div>
          </div>
        </div>

        {/* 포인트 정책 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">포인트 정책</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                예약당 적립 포인트
              </label>
              <input
                type="number"
                value={settings.pointsPerReservation}
                onChange={(e) => setSettings({...settings, pointsPerReservation: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                포인트 유효기간 (일)
              </label>
              <input
                type="number"
                value={settings.pointsExpirationDays}
                onChange={(e) => setSettings({...settings, pointsExpirationDays: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* 예약 정책 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">예약 정책</h2>

          <div>
            <label className="block text-sm font-medium mb-2">
              취소 마감 시간 (체크인 기준, 시간)
            </label>
            <input
              type="number"
              value={settings.cancellationDeadlineHours}
              onChange={(e) => setSettings({...settings, cancellationDeadlineHours: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              체크인 {settings.cancellationDeadlineHours}시간 전까지 무료 취소 가능
            </p>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

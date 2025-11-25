import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaFilter, FaSearch, FaUser, FaExclamationTriangle } from 'react-icons/fa';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterAction) params.action = filterAction;
      
      const response = await api.get('/activity-logs', { params });
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
      alert('활동 로그 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      'user_created': '회원 가입',
      'user_deleted': '회원 삭제',
      'user_blocked': '회원 차단',
      'user_unblocked': '회원 차단 해제',
      'business_approved': '사업자 승인',
      'business_rejected': '사업자 거부',
      'hotel_created': '호텔 등록',
      'hotel_deleted': '호텔 삭제',
      'booking_cancelled': '예약 취소',
      'review_deleted': '리뷰 삭제'
    };
    return labels[action] || action;
  };

  const getActionColor = (action) => {
    if (action.includes('delete') || action.includes('block') || action.includes('cancel')) {
      return 'bg-red-100 text-red-700';
    }
    if (action.includes('create') || action.includes('approve')) {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-blue-100 text-blue-700';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.user?.name?.includes(searchTerm) ||
      log.user?.email?.includes(searchTerm);
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">활동 로그</h1>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              활동 유형
            </label>
            <select
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); loadLogs(); }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">전체</option>
              <option value="user_created">회원 가입</option>
              <option value="user_deleted">회원 삭제</option>
              <option value="user_blocked">회원 차단</option>
              <option value="business_approved">사업자 승인</option>
              <option value="hotel_created">호텔 등록</option>
              <option value="booking_cancelled">예약 취소</option>
              <option value="review_deleted">리뷰 삭제</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2" />
              사용자 검색
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름 또는 이메일"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 로그 목록 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">시간</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">사용자</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">활동</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IP 주소</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  활동 로그가 없습니다.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-semibold">{log.user?.name || '알 수 없음'}</div>
                        <div className="text-sm text-gray-500">{log.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.ipAddress || 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

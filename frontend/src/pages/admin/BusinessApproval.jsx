import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaBan, FaEye, FaSearch } from 'react-icons/fa';

export default function BusinessApproval() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, [filter]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/business?status=${filter}`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Failed to load businesses:', error);
      alert('사업자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (business) => {
    setSelectedBusiness(business);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedBusiness(null);
  };

  const handleApprove = async (id) => {
    if (!confirm('이 사업자를 승인하시겠습니까?')) return;

    try {
      await api.put(`/admin/business/${id}/approve`);
      alert('사업자가 승인되었습니다.');
      loadBusinesses();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to approve business:', error);
      alert('승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('이 사업자를 거부하시겠습니까?')) return;

    try {
      await api.put(`/admin/business/${id}/reject`);
      alert('사업자가 거부되었습니다.');
      loadBusinesses();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to reject business:', error);
      alert('거부 중 오류가 발생했습니다.');
    }
  };

  const handleBlock = async (id) => {
    if (!confirm('정말 차단하시겠습니까? 이 사업자의 모든 호텔이 비활성화됩니다.')) return;
    
    try {
      await api.put(`/admin/business/${id}/block`);
      alert('사업자가 차단되었습니다.');
      loadBusinesses();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to block business:', error);
      alert('차단 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">대기중</span>,
      approved: <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">승인됨</span>,
      rejected: <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">거부됨</span>,
      blocked: <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">차단됨</span>
    };
    return badges[status] || status;
  };

  const filteredBusinesses = businesses.filter(business => {
    if (searchTerm === '') return true;
    return (
      business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.phone?.includes(searchTerm)
    );
  });

  const stats = {
    pending: businesses.filter(b => b.businessStatus === 'pending').length,
    approved: businesses.filter(b => b.businessStatus === 'approved').length,
    rejected: businesses.filter(b => b.businessStatus === 'rejected').length,
    blocked: businesses.filter(b => b.businessStatus === 'blocked').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">사업자 승인 관리</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">대기중</p>
          <h3 className="text-3xl font-bold text-yellow-600">{stats.pending}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">승인됨</p>
          <h3 className="text-3xl font-bold text-green-600">{stats.approved}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">거부됨</p>
          <h3 className="text-3xl font-bold text-red-600">{stats.rejected}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">차단됨</p>
          <h3 className="text-3xl font-bold text-gray-600">{stats.blocked}</h3>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {['pending', 'approved', 'rejected', 'blocked'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status === 'pending' && '대기중'}
                {status === 'approved' && '승인됨'}
                {status === 'rejected' && '거부됨'}
                {status === 'blocked' && '차단됨'}
              </button>
            ))}
          </div>

          <div className="relative w-80">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름, 이메일, 전화번호로 검색"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 사업자 목록 */}
      {filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">
            {searchTerm ? '검색 결과가 없습니다.' : '사업자가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">사업자 정보</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">연락처</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">가입일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBusinesses.map((business) => (
                <tr key={business._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-lg">{business.name}</div>
                    <div className="text-sm text-gray-500">{business.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {business.phone || '미등록'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(business.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(business.businessStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(business)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="상세보기"
                      >
                        <FaEye size={18} />
                      </button>
                      
                      {business.businessStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(business._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center text-sm"
                          >
                            <FaCheck className="mr-1" /> 승인
                          </button>
                          <button
                            onClick={() => handleReject(business._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center text-sm"
                          >
                            <FaTimes className="mr-1" /> 거부
                          </button>
                        </>
                      )}
                      
                      {business.businessStatus === 'approved' && (
                        <button
                          onClick={() => handleBlock(business._id)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center text-sm"
                        >
                          <FaBan className="mr-1" /> 차단
                        </button>
                      )}

                      {(business.businessStatus === 'rejected' || business.businessStatus === 'blocked') && (
                        <button
                          onClick={() => handleApprove(business._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center text-sm"
                        >
                          <FaCheck className="mr-1" /> 재승인
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 사업자 상세 모달 */}
      {showDetailModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">사업자 상세 정보</h2>
              <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">이름</p>
                      <p className="font-semibold text-lg">{selectedBusiness.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">상태</p>
                      {getStatusBadge(selectedBusiness.businessStatus)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">이메일</p>
                    <p className="font-semibold">{selectedBusiness.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">전화번호</p>
                    <p className="font-semibold">{selectedBusiness.phone || '미등록'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">가입일</p>
                    <p className="font-semibold">
                      {new Date(selectedBusiness.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">포인트</p>
                    <p className="font-semibold text-indigo-600">
                      {selectedBusiness.points?.toLocaleString() || 0} P
                    </p>
                  </div>
                </div>
              </div>

              {/* 작업 버튼 */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                {selectedBusiness.businessStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedBusiness._id)}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                      <FaCheck className="mr-2" /> 승인하기
                    </button>
                    <button
                      onClick={() => handleReject(selectedBusiness._id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                    >
                      <FaTimes className="mr-2" /> 거부하기
                    </button>
                  </>
                )}
                
                {selectedBusiness.businessStatus === 'approved' && (
                  <button
                    onClick={() => handleBlock(selectedBusiness._id)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                  >
                    <FaBan className="mr-2" /> 차단하기
                  </button>
                )}

                {(selectedBusiness.businessStatus === 'rejected' || selectedBusiness.businessStatus === 'blocked') && (
                  <button
                    onClick={() => handleApprove(selectedBusiness._id)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <FaCheck className="mr-2" /> 재승인하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

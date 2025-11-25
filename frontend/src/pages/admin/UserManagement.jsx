import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaSearch, FaEye, FaBan, FaCheckCircle, FaTrash, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [filterBlocked, setFilterBlocked] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [filterRole, filterBlocked]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterBlocked !== 'all') params.blocked = filterBlocked;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleViewDetail = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUserDetails(response.data);
      setSelectedUser(response.data.user);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
      alert('회원 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleBlockUser = async (userId) => {
    if (!confirm('이 회원을 차단하시겠습니까?')) return;

    try {
      await api.put(`/admin/users/${userId}/block`);
      alert('회원이 차단되었습니다.');
      loadUsers();
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedUser(null);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Failed to block user:', error);
      alert(error.response?.data?.message || '회원 차단에 실패했습니다.');
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!confirm('이 회원의 차단을 해제하시겠습니까?')) return;

    try {
      await api.put(`/admin/users/${userId}/unblock`);
      alert('회원 차단이 해제되었습니다.');
      loadUsers();
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedUser(null);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Failed to unblock user:', error);
      alert(error.response?.data?.message || '회원 차단 해제에 실패했습니다.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('이 회원을 완전히 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없으며, 관련된 모든 예약 및 리뷰도 삭제됩니다.')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('회원이 삭제되었습니다.');
      loadUsers();
      if (showDetailModal) {
        setShowDetailModal(false);
        setSelectedUser(null);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.message || '회원 삭제에 실패했습니다.');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-600',
      business: 'bg-blue-100 text-blue-600',
      user: 'bg-green-100 text-green-600'
    };
    const labels = {
      admin: '관리자',
      business: '사업자',
      user: '일반 회원'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badges[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (user) => {
    if (user.isBlocked) {
      return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-600">차단됨</span>;
    }
    if (user.role === 'business') {
      const badges = {
        pending: 'bg-yellow-100 text-yellow-600',
        approved: 'bg-green-100 text-green-600',
        rejected: 'bg-gray-100 text-gray-600',
        blocked: 'bg-red-100 text-red-600'
      };
      const labels = {
        pending: '승인 대기',
        approved: '승인됨',
        rejected: '거부됨',
        blocked: '차단됨'
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${badges[user.businessStatus]}`}>
          {labels[user.businessStatus]}
        </span>
      );
    }
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-600">정상</span>;
  };

  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">회원 관리</h1>
        <div className="text-sm text-gray-600">
          총 {filteredUsers.length}명의 회원
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름, 이메일, 연락처로 검색..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="col-span-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">전체 회원 유형</option>
              <option value="user">일반 회원</option>
              <option value="business">사업자</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          <div className="col-span-3">
            <select
              value={filterBlocked}
              onChange={(e) => setFilterBlocked(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">전체 상태</option>
              <option value="false">정상</option>
              <option value="true">차단됨</option>
            </select>
          </div>

          <div className="col-span-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterBlocked('all');
                loadUsers();
              }}
              className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">포인트</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-indigo-600">
                      {user.points?.toLocaleString()}P
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(user._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="상세 보기"
                      >
                        <FaEye />
                      </button>
                      {user.role !== 'admin' && (
                        <>
                          {user.isBlocked ? (
                            <button
                              onClick={() => handleUnblockUser(user._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="차단 해제"
                            >
                              <FaCheckCircle />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockUser(user._id)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                              title="차단"
                            >
                              <FaBan />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="삭제"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              회원이 없습니다.
            </div>
          )}
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">회원 상세 정보</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              {/* 회원 기본 정보 */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">기본 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">이름</div>
                      <div className="font-semibold">{selectedUser.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">이메일</div>
                      <div className="font-semibold">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">연락처</div>
                      <div className="font-semibold">{selectedUser.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaCalendar className="text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">가입일</div>
                      <div className="font-semibold">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">회원 유형</div>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">상태</div>
                    {getStatusBadge(selectedUser)}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">포인트</div>
                    <div className="font-semibold text-indigo-600">
                      {selectedUser.points?.toLocaleString()}P
                    </div>
                  </div>
                </div>
              </div>

              {/* 사업자인 경우 호텔 정보 */}
              {selectedUser.role === 'business' && userDetails.hotels && userDetails.hotels.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">등록 호텔 ({userDetails.hotels.length}개)</h3>
                  <div className="space-y-2">
                    {userDetails.hotels.map((hotel) => (
                      <div key={hotel._id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{hotel.name}</div>
                          <div className="text-sm text-gray-600">{hotel.location?.address}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          hotel.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {hotel.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 예약 내역 */}
              {userDetails.bookings && userDetails.bookings.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">최근 예약 내역 ({userDetails.bookings.length}건)</h3>
                  <div className="space-y-2">
                    {userDetails.bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{booking.hotel?.name}</div>
                            <div className="text-sm text-gray-600">{booking.room?.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(booking.checkIn).toLocaleDateString()} ~ {new Date(booking.checkOut).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-indigo-600">
                              ₩{booking.finalPrice?.toLocaleString()}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-600' :
                              booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {booking.bookingStatus === 'confirmed' ? '예약 확정' :
                               booking.bookingStatus === 'cancelled' ? '취소됨' :
                               booking.bookingStatus === 'pending' ? '대기 중' : '완료'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 작성 리뷰 */}
              {userDetails.reviews && userDetails.reviews.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4">작성한 리뷰 ({userDetails.reviews.length}건)</h3>
                  <div className="space-y-2">
                    {userDetails.reviews.map((review) => (
                      <div key={review._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{review.hotel?.name}</div>
                            <div className="flex items-center text-yellow-500 mt-1">
                              {'⭐'.repeat(review.rating)}
                              <span className="ml-2 text-sm text-gray-600">{review.rating}.0</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            review.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {review.status === 'active' ? '활성' : '숨김'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 관리 버튼 */}
              {selectedUser.role !== 'admin' && (
                <div className="flex justify-end space-x-4 border-t pt-6">
                  {selectedUser.isBlocked ? (
                    <button
                      onClick={() => handleUnblockUser(selectedUser._id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <FaCheckCircle />
                      <span>차단 해제</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(selectedUser._id)}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                    >
                      <FaBan />
                      <span>차단</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(selectedUser._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>회원 삭제</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

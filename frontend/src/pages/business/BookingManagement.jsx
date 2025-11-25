import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaSearch, FaEye, FaTimes, FaDownload, FaTrash } from 'react-icons/fa';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      alert('예약 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('이 예약을 취소하시겠습니까?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      alert('예약이 취소되었습니다.');
      loadBookings();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('이 예약 기록을 완전히 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      alert('예약이 삭제되었습니다.');
      loadBookings();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert(error.response?.data?.message || '예약 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleApproveBooking = async (bookingId) => {
    if (!confirm('이 예약을 승인하시겠습니까?')) return;

    try {
      await api.put(`/business/bookings/${bookingId}/approve`);
      alert('예약이 승인되었습니다.');
      loadBookings();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to approve booking:', error);
      alert('예약 승인 중 오류가 발생했습니다.');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt('예약 거부 사유를 입력하세요:');
    if (!reason) return;

    try {
      await api.put(`/business/bookings/${bookingId}/reject`, { reason });
      alert('예약이 거부되었습니다.');
      loadBookings();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to reject booking:', error);
      alert('예약 거부 중 오류가 발생했습니다.');
    }
  };

  const exportToExcel = () => {
    // CSV 형식으로 다운로드
    const headers = ['예약번호', '호텔명', '객실', '고객명', '전화번호', '체크인', '체크아웃', '인원', '금액', '상태'];
    const data = filteredBookings.map(b => [
      b._id?.slice(-8) || 'N/A',
      b.hotel?.name || '정보 없음',
      b.room?.name || '정보 없음',
      b.user?.name || '고객 정보 없음',
      b.user?.phone || '전화번호 없음',
      b.checkIn ? new Date(b.checkIn).toLocaleDateString() : 'N/A',
      b.checkOut ? new Date(b.checkOut).toLocaleDateString() : 'N/A',
      typeof b.guests === 'object' ? `성인${b.guests?.adults || 0}/아동${b.guests?.children || 0}` : (b.guests || 0),
      b.finalPrice || 0,
      getStatusText(b.bookingStatus)
    ]);

    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `예약목록_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const getStatusText = (status) => {
    const statusMap = {
      confirmed: '확정',
      cancelled: '취소',
      completed: '완료',
      pending: '대기'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.bookingStatus === filterStatus;
    const searchMatch = searchTerm === '' ||
      booking.user?.name?.includes(searchTerm) ||
      booking.hotel?.name?.includes(searchTerm) ||
      booking._id?.includes(searchTerm);
    return statusMatch && searchMatch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.approvalStatus === 'pending' || b.bookingStatus === 'pending').length,
    confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
    revenue: bookings
      .filter(b => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + (b.finalPrice || 0), 0)
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">예약 관리</h1>
        <button
          onClick={exportToExcel}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <FaDownload />
          <span>엑셀 다운로드</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">총 예약</p>
          <h3 className="text-3xl font-bold text-indigo-600">{stats.total}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">승인 대기</p>
          <h3 className="text-3xl font-bold text-yellow-600">{stats.pending}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">확정 예약</p>
          <h3 className="text-3xl font-bold text-green-600">{stats.confirmed}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">취소 예약</p>
          <h3 className="text-3xl font-bold text-red-600">{stats.cancelled}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">총 매출</p>
          <h3 className="text-3xl font-bold text-blue-600">
            ₩{stats.revenue.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">상태 필터</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">전체</option>
            <option value="pending">대기중</option>
            <option value="confirmed">확정</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="고객명, 호텔명, 예약번호로 검색"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 예약 목록 */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' ? '검색 결과가 없습니다.' : '예약이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">예약번호</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔/객실</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">고객정보</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">체크인/아웃</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">인원</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">금액</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm">#{booking._id.slice(-8)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{booking.hotel?.name || '정보 없음'}</div>
                    <div className="text-sm text-gray-500">{booking.room?.name || '정보 없음'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{booking.user?.name || '고객 정보 없음'}</div>
                    <div className="text-sm text-gray-500">{booking.user?.phone || '전화번호 없음'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                    <div className="text-gray-500">{new Date(booking.checkOut).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold">
                    {typeof booking.guests === 'object' 
                      ? `성인 ${booking.guests?.adults || 0}명, 아동 ${booking.guests?.children || 0}명`
                      : `${booking.guests || 0}명`
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold">₩{booking.finalPrice?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {booking.paymentStatus === 'completed' ? '결제완료' : '미결제'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                      {getStatusText(booking.bookingStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewDetail(booking)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="상세보기"
                      >
                        <FaEye />
                      </button>
                      {(booking.approvalStatus === 'pending' || booking.bookingStatus === 'pending') && (
                        <>
                          <button
                            onClick={() => handleApproveBooking(booking._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                            title="승인"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                            title="거부"
                          >
                            거부
                          </button>
                        </>
                      )}
                      {booking.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-700"
                          title="예약취소"
                        >
                          취소
                        </button>
                      )}
                      {booking.bookingStatus === 'cancelled' && (
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-800"
                          title="예약삭제"
                        >
                          <FaTrash />
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

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">예약 상세 정보</h2>
              <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 예약 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">예약 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">예약번호</p>
                    <p className="font-semibold">#{selectedBooking._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">예약일시</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">상태</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.bookingStatus)}`}>
                      {getStatusText(selectedBooking.bookingStatus)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">결제상태</p>
                    <p className="font-semibold">
                      {selectedBooking.paymentStatus === 'completed' ? '결제완료' : '미결제'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 호텔 및 객실 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">호텔 및 객실</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">호텔</p>
                    <p className="font-semibold text-lg">{selectedBooking.hotel?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">객실</p>
                    <p className="font-semibold">{selectedBooking.room?.name}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-600">체크인</p>
                      <p className="font-semibold">
                        {new Date(selectedBooking.checkIn).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">체크아웃</p>
                      <p className="font-semibold">
                        {new Date(selectedBooking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">숙박일</p>
                      <p className="font-semibold">
                        {Math.ceil((new Date(selectedBooking.checkOut) - new Date(selectedBooking.checkIn)) / (1000 * 60 * 60 * 24))}박
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 고객 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">고객 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">이름</p>
                    <p className="font-semibold">{selectedBooking.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">이메일</p>
                    <p className="font-semibold">{selectedBooking.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">전화번호</p>
                    <p className="font-semibold">{selectedBooking.user?.phone || '미등록'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">투숙 인원</p>
                    <p className="font-semibold">
                      {typeof selectedBooking.guests === 'object'
                        ? `성인 ${selectedBooking.guests?.adults || 0}명, 아동 ${selectedBooking.guests?.children || 0}명`
                        : `${selectedBooking.guests || 0}명`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* 특별 요청사항 */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">특별 요청사항</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* 결제 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">기본 요금</p>
                    <p className="font-semibold">₩{selectedBooking.basePrice?.toLocaleString()}</p>
                  </div>
                  {selectedBooking.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <p>할인</p>
                      <p className="font-semibold">-₩{selectedBooking.discountAmount?.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <p className="text-lg font-bold">최종 금액</p>
                    <p className="text-lg font-bold text-indigo-600">
                      ₩{selectedBooking.finalPrice?.toLocaleString()}
                    </p>
                  </div>
                  {selectedBooking.paymentMethod && (
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">결제 수단</p>
                      <p>{selectedBooking.paymentMethod}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 작업 버튼 */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                {(selectedBooking.approvalStatus === 'pending' || selectedBooking.bookingStatus === 'pending') && (
                  <>
                    <button
                      onClick={() => handleApproveBooking(selectedBooking._id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      예약 승인
                    </button>
                    <button
                      onClick={() => handleRejectBooking(selectedBooking._id)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      예약 거부
                    </button>
                  </>
                )}
                {selectedBooking.bookingStatus === 'confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    예약 취소
                  </button>
                )}
                {selectedBooking.bookingStatus === 'cancelled' && (
                  <button
                    onClick={() => handleDeleteBooking(selectedBooking._id)}
                    className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>예약 기록 삭제</span>
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

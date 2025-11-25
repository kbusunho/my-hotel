import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PrintableBooking from '../../components/PrintableBooking';
import api from '../../api/axios';
import { FaCalendar, FaUsers, FaTimes, FaEdit } from 'react-icons/fa';
import toast from '../../utils/toast';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modifyData, setModifyData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    specialRequests: ''
  });

  useEffect(() => {
    if (user) {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('예약 목록을 불러오는데 실패했습니다.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('예약이 취소되었습니다.');
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || '예약 취소 중 오류가 발생했습니다.');
    }
  };

  const handleOpenModify = (booking) => {
    setSelectedBooking(booking);
    setModifyData({
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      adults: booking.guests?.adults || 2,
      children: booking.guests?.children || 0,
      specialRequests: booking.specialRequests || ''
    });
    setShowModifyModal(true);
  };

  const handleModifyBooking = async () => {
    if (!selectedBooking) return;

    try {
      await api.put(`/bookings/${selectedBooking._id}/modify`, {
        checkIn: modifyData.checkIn,
        checkOut: modifyData.checkOut,
        guests: {
          adults: modifyData.adults,
          children: modifyData.children
        },
        specialRequests: modifyData.specialRequests,
        reason: '사용자 요청'
      });
      toast.success('예약이 변경되었습니다.');
      setShowModifyModal(false);
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || '예약 변경 중 오류가 발생했습니다.');
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.bookingStatus === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 예약</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        {[
          { value: 'all', label: '전체' },
          { value: 'confirmed', label: '예약완료' },
          { value: 'completed', label: '이용완료' },
          { value: 'cancelled', label: '취소됨' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`pb-4 px-4 font-semibold transition-colors ${
              filter === tab.value
                ? 'border-b-2 border-sage-500 text-sage-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">예약 내역이 없습니다.</p>
            <Link to="/search" className="btn-primary">
              호텔 검색하기
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex">
                <img
                  src={booking.hotel?.images?.[0] || '/placeholder-hotel.jpg'}
                  alt={booking.hotel?.name}
                  className="w-48 h-48 object-cover"
                />
                
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{booking.hotel?.name}</h3>
                      <p className="text-gray-600">{booking.room?.name}</p>
                    </div>
                    
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      booking.bookingStatus === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.bookingStatus === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.bookingStatus === 'confirmed' && '예약완료'}
                      {booking.bookingStatus === 'completed' && '이용완료'}
                      {booking.bookingStatus === 'cancelled' && '취소됨'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">체크인</div>
                      <div className="font-semibold flex items-center">
                        <FaCalendar className="mr-2" />
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">체크아웃</div>
                      <div className="font-semibold flex items-center">
                        <FaCalendar className="mr-2" />
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">투숙객</div>
                      <div className="font-semibold flex items-center">
                        <FaUsers className="mr-2" />
                        성인 {booking.guests?.adults || 0}명
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-gray-600 text-sm">결제 금액</div>
                      <div className="text-2xl font-bold text-sage-600">
                        ₩{booking.finalPrice?.toLocaleString() || 0}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        to={`/hotels/${booking.hotel?._id || booking.hotel}`}
                        className="px-4 py-2 border border-sage-500 text-sage-600 rounded-lg hover:bg-sage-50"
                      >
                        상세보기
                      </Link>
                      
                      {booking.bookingStatus === 'confirmed' && (
                        <>
                          <PrintableBooking booking={booking} />
                          <button
                            onClick={() => handleOpenModify(booking)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                          >
                            <FaEdit className="mr-2" />
                            예약변경
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                          >
                            <FaTimes className="mr-2" />
                            예약취소
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 예약 변경 모달 */}
      {showModifyModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">예약 변경</h2>
              <button onClick={() => setShowModifyModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{selectedBooking.hotel?.name}</h3>
                <p className="text-sm text-gray-600">{selectedBooking.room?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    체크인
                  </label>
                  <input
                    type="date"
                    value={modifyData.checkIn}
                    onChange={(e) => setModifyData({ ...modifyData, checkIn: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    체크아웃
                  </label>
                  <input
                    type="date"
                    value={modifyData.checkOut}
                    onChange={(e) => setModifyData({ ...modifyData, checkOut: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성인
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={modifyData.adults}
                    onChange={(e) => setModifyData({ ...modifyData, adults: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    아동
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={modifyData.children}
                    onChange={(e) => setModifyData({ ...modifyData, children: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  특별 요청사항
                </label>
                <textarea
                  value={modifyData.specialRequests}
                  onChange={(e) => setModifyData({ ...modifyData, specialRequests: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="특별히 요청하실 사항이 있으시면 입력해주세요."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ 예약 변경 시 가격이 변동될 수 있습니다. 변경 후 최종 가격을 확인해주세요.
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => setShowModifyModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleModifyBooking}
                  className="px-6 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700"
                >
                  변경 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

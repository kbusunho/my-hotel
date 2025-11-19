import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaCalendar, FaUsers, FaTimes } from 'react-icons/fa';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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
      alert('예약 목록을 불러오는데 실패했습니다.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return;

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      alert('예약이 취소되었습니다.');
      loadBookings();
    } catch (error) {
      alert('예약 취소 중 오류가 발생했습니다.');
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
                        성인 {booking.guests?.adults}명
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-gray-600 text-sm">결제 금액</div>
                      <div className="text-2xl font-bold text-sage-600">
                        ₩{booking.finalPrice.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        to={`/hotels/${booking.hotel._id}`}
                        className="px-4 py-2 border border-sage-500 text-sage-600 rounded-lg hover:bg-sage-50"
                      >
                        상세보기
                      </Link>
                      
                      {booking.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                        >
                          <FaTimes className="mr-2" />
                          예약취소
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import api from '../api/axios';

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [currentDate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await api.get('/bookings/business/my', {
        params: {
          year,
          month
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getBookingsForDate = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];
    
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn).toISOString().split('T')[0];
      const checkOut = new Date(booking.checkOut).toISOString().split('T')[0];
      return dateStr >= checkIn && dateStr <= checkOut;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FaCalendarAlt className="mr-2 text-sage-600" />
          예약 캘린더
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaChevronLeft />
          </button>
          <div className="text-xl font-semibold min-w-[140px] text-center">
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {/* 요일 헤더 */}
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center font-semibold py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}

        {/* 빈 칸 (이전 달) */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {/* 날짜 */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayBookings = getBookingsForDate(day);
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                isToday ? 'border-sage-600 bg-sage-50' : 'border-gray-200'
              }`}
              onClick={() => dayBookings.length > 0 && setSelectedBooking({ day, bookings: dayBookings })}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-sage-600' : ''}`}>
                {day}
              </div>
              {dayBookings.length > 0 && (
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-1 py-0.5 rounded truncate ${
                        booking.bookingStatus === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.bookingStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      title={`${booking.user?.name} - ${booking.room?.name}`}
                    >
                      {booking.user?.name}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-600 text-center">
                      +{dayBookings.length - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-6 flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
          <span>확정 예약</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
          <span>대기 중</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
          <span>취소됨</span>
        </div>
      </div>

      {/* 선택된 날짜의 예약 모달 */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]} {selectedBooking.day}일 예약
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {selectedBooking.bookings.map((booking) => (
                <div key={booking._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{booking.user?.name}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        booking.bookingStatus === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.bookingStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {booking.bookingStatus === 'confirmed'
                        ? '확정'
                        : booking.bookingStatus === 'pending'
                        ? '대기'
                        : '취소'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>객실: {booking.room?.name}</div>
                    <div>
                      기간: {new Date(booking.checkIn).toLocaleDateString()} ~{' '}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                    <div>투숙객: 성인 {booking.guests?.adults}명, 아동 {booking.guests?.children}명</div>
                    <div>금액: ₩{booking.totalPrice?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaCalendar, FaUser } from 'react-icons/fa';

export default function BookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: { adults: 2, children: 0 },
    specialRequests: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadRoomDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user, navigate]);

  const loadRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rooms/${roomId}`);
      setRoom(response.data);
      setHotel(response.data.hotel);
    } catch (error) {
      console.error('Failed to load room:', error);
      alert('객실 정보를 불러오는데 실패했습니다.');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !room || !room.price) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return room.price * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('체크인 및 체크아웃 날짜를 선택해주세요.');
      return;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      alert('체크인 날짜는 오늘 이후여야 합니다.');
      return;
    }
    
    if (checkOut <= checkIn) {
      alert('체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.');
      return;
    }

    if (!room || !room.price) {
      alert('객실 정보를 불러올 수 없습니다. 다시 시도해주세요.');
      return;
    }
    
    try {
      const hotelId = hotel?._id || hotel;
      
      if (!hotelId) {
        alert('호텔 정보를 찾을 수 없습니다.');
        return;
      }
      
      const response = await api.post('/bookings', {
        hotel: hotelId,
        room: room._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests,
        totalPrice: calculateTotalPrice(),
        finalPrice: calculateTotalPrice()
      });

      navigate(`/payment/${response.data._id}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || '예약 생성 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = bookingData.checkIn && bookingData.checkOut
    ? Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">예약 정보</h1>

      <div className="grid grid-cols-12 gap-8">
        {/* Booking Form */}
        <div className="col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">예약 상세</h2>

            {/* Hotel & Room Info */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex">
                <img
                  src={hotel?.images?.[0] || '/placeholder-hotel.jpg'}
                  alt={hotel?.name}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{hotel?.name}</h3>
                  <p className="text-gray-600">{room?.name}</p>
                  <p className="text-sm text-gray-500">{room?.type}</p>
                </div>
              </div>
            </div>

            {/* Check-in/out Dates */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">체크인</label>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">체크아웃</label>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">투숙객</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">성인</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.guests.adults}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      guests: {...bookingData.guests, adults: parseInt(e.target.value)}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">어린이</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={bookingData.guests.children}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      guests: {...bookingData.guests, children: parseInt(e.target.value)}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">특별 요청사항</label>
              <textarea
                rows="4"
                placeholder="추가 요청사항을 입력하세요..."
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 font-semibold"
            >
              결제하기
            </button>
          </form>
        </div>

        {/* Price Summary */}
        <div className="col-span-4">
          <div className="bg-sage-50 rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">예약 요약</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">객실 요금</span>
                <span className="font-semibold">₩{room?.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">숙박 일수</span>
                <span className="font-semibold">{nights}박</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">세금 및 수수료</span>
                <span className="font-semibold">₩0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-sage-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">총 금액</span>
                <span className="text-2xl font-bold text-sage-600">
                  ₩{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">무료 취소</h4>
              <p className="text-sm text-gray-600">
                체크인 24시간 전까지 무료 취소 가능
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

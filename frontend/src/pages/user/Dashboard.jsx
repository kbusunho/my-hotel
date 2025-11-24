import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { BarChart, LineChart, DonutChart, StatCard } from '../../components/SimpleChart.jsx';
import { 
  FaHotel, 
  FaCalendarCheck, 
  FaHeart, 
  FaStar, 
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaWallet,
  FaCoins
} from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalFavorites: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 예약 목록 가져오기
      const bookingsRes = await api.get('/bookings/my');
      const bookings = bookingsRes.data;
      
      // 사용자 정보 (찜 목록 포함)
      const userRes = await api.get('/users/me');
      const userFavorites = userRes.data.favorites || [];
      
      // 통계 계산
      const now = new Date();
      const upcoming = bookings.filter(b => 
        b.bookingStatus === 'confirmed' && new Date(b.checkIn) > now
      );
      const completed = bookings.filter(b => 
        b.bookingStatus === 'completed' || (b.bookingStatus === 'confirmed' && new Date(b.checkOut) < now)
      );
      
      setStats({
        totalBookings: bookings.length,
        upcomingBookings: upcoming.length,
        completedBookings: completed.length,
        totalFavorites: userFavorites.length
      });
      
      // 최근 예약 5개
      setRecentBookings(bookings.slice(0, 5));
      
      // 찜한 호텔 4개
      setFavorites(userFavorites.slice(0, 4));
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    if (booking.bookingStatus === 'cancelled') {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">취소됨</span>;
    }
    if (booking.bookingStatus === 'confirmed' && checkIn > now) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">예약 확정</span>;
    }
    if (booking.bookingStatus === 'confirmed' && checkIn <= now && checkOut >= now) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">이용 중</span>;
    }
    if (booking.bookingStatus === 'completed' || (booking.bookingStatus === 'confirmed' && checkOut < now)) {
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">완료</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{booking.bookingStatus}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">안녕하세요, {user?.name}님!</h1>
        <p className="text-sage-100">HotelHub에 오신 것을 환영합니다.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCalendarCheck className="text-2xl text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">전체 예약</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">예정된 예약</p>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaTimesCircle className="text-2xl text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">완료된 예약</p>
          <p className="text-3xl font-bold text-gray-900">{stats.completedBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FaHeart className="text-2xl text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">찜한 호텔</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalFavorites}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">최근 예약</h2>
              <Link to="/my-bookings" className="text-sage-600 hover:text-sage-700 text-sm">
                전체 보기 →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaCalendarCheck className="text-4xl mx-auto mb-3 text-gray-300" />
                <p>예약 내역이 없습니다.</p>
                <Link to="/search" className="text-sage-600 hover:text-sage-700 mt-2 inline-block">
                  호텔 검색하기 →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4 flex-1">
                        <img
                          src={booking.hotel?.images?.[0] || '/placeholder-hotel.jpg'}
                          alt={booking.hotel?.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{booking.hotel?.name}</h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <FaMapMarkerAlt className="mr-1" />
                            <span>{booking.hotel?.location?.city}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm space-x-4">
                            <div className="flex items-center">
                              <FaClock className="mr-1" />
                              <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(booking)}
                        <p className="text-sage-600 font-bold mt-2">
                          ₩{booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile & Favorites */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">내 프로필</h2>
              <Link to="/settings" className="text-sage-600 hover:text-sage-700 text-sm">
                설정 →
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sage-100 rounded-lg">
                  <FaUser className="text-sage-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">이름</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sage-100 rounded-lg">
                  <FaEnvelope className="text-sage-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">이메일</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sage-100 rounded-lg">
                  <FaPhone className="text-sage-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">전화번호</p>
                  <p className="font-medium">{user?.phone || '미등록'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Hotels */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">찜한 호텔</h2>
              <Link to="/favorites" className="text-sage-600 hover:text-sage-700 text-sm">
                전체 보기 →
              </Link>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaHeart className="text-3xl mx-auto mb-2 text-gray-300" />
                <p className="text-sm">찜한 호텔이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((hotel) => (
                  <Link
                    key={hotel._id}
                    to={`/hotels/${hotel._id}`}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                      alt={hotel.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{hotel.name}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span>{hotel.rating?.toFixed(1) || '4.2'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

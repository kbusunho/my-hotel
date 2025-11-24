import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaHotel, FaBed, FaCalendar, FaStar, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import { BarChart, LineChart, DonutChart, StatCard } from '../../components/SimpleChart.jsx';

export default function BusinessDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/business/dashboard/stats'),
        api.get('/business/bookings?limit=5')
      ]);
      
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold mb-8 dark:text-white">사업자 대시보드</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="총 예약"
          value={stats?.totalBookings || 0}
          change={15}
          icon={FaCalendar}
          color="indigo"
        />
        <StatCard
          title="총 매출"
          value={`₩${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={23}
          icon={FaMoneyBillWave}
          color="green"
        />
        <StatCard
          title="호텔 관리"
          value={stats?.totalHotels || 0}
          icon={FaHotel}
          color="purple"
        />
        <StatCard
          title="리뷰 관리"
          value={stats?.totalReviews || 0}
          icon={FaStar}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart 
          data={chartData.monthlyRevenue}
          title="월별 매출 현황 (최근 6개월)"
          height={250}
        />
        <BarChart 
          data={chartData.monthlyBookings}
          title="월별 예약 현황 (최근 6개월)"
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DonutChart 
          data={chartData.roomOccupancy}
          title="객실 점유율"
        />
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">운영 현황</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">총 객실 수</span>
              <span className="text-xl font-bold dark:text-white">
                {(stats?.occupiedRooms || 45) + (stats?.availableRooms || 55)}개
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">평균 객실 가격</span>
              <span className="text-xl font-bold dark:text-white">
                ₩{((stats?.totalRevenue || 0) / (stats?.totalBookings || 1)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">평균 평점</span>
              <span className="text-xl font-bold text-yellow-500 flex items-center">
                <FaStar className="mr-1" /> 4.5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">매출 추이</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-600">차트가 여기에 표시됩니다</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">최근 예약</h2>
          <button className="text-indigo-600 hover:text-indigo-700">전체보기</button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">예약번호</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">호텔명</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">고객명</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">체크인</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">금액</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">상태</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  예약 내역이 없습니다.
                </td>
              </tr>
            ) : (
              recentBookings.map((booking, idx) => (
                <tr key={booking._id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">#{booking._id?.slice(-6) || 'N/A'}</td>
                  <td className="px-4 py-3">{booking.hotel?.name || '호텔명 없음'}</td>
                  <td className="px-4 py-3">{booking.user?.name || '사용자명 없음'}</td>
                  <td className="px-4 py-3">
                    {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₩{(booking.finalPrice || booking.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.bookingStatus === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.bookingStatus === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.bookingStatus === 'confirmed' ? '확정' : 
                       booking.bookingStatus === 'cancelled' ? '취소' : '대기'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-indigo-600 hover:text-indigo-700 mr-3">보기</button>
                    <button className="text-red-600 hover:text-red-700">취소</button>
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

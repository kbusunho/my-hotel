import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaUsers, FaHotel, FaCalendar, FaChartLine, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';
import { BarChart, LineChart, DonutChart, StatCard } from '../../components/SimpleChart.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({
    monthlyRevenue: [],
    monthlyBookings: [],
    monthlyUsers: [],
    userTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // 실제 데이터 가져오기
      const [statsRes, usersRes, hotelsRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/users'),
        api.get('/admin/hotels'),
        api.get('/admin/bookings')
      ]);
      
      const stats = statsRes.data;
      const allUsers = usersRes.data;
      const allHotels = hotelsRes.data;
      const allBookings = bookingsRes.data;

      // 실제 통계 계산
      const regularUsers = allUsers.filter(u => u.role === 'user').length;
      const businessUsers = allUsers.filter(u => u.role === 'business').length;
      const adminUsers = allUsers.filter(u => u.role === 'admin').length;
      
      // 월별 예약 데이터 (최근 6개월)
      const monthlyBookings = {};
      const monthlyRevenue = {};
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyBookings[key] = 0;
        monthlyRevenue[key] = 0;
      }
      
      allBookings.forEach(booking => {
        const bookingDate = new Date(booking.createdAt);
        const key = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyBookings.hasOwnProperty(key)) {
          monthlyBookings[key]++;
          if (booking.bookingStatus !== 'cancelled') {
            monthlyRevenue[key] += booking.totalPrice || 0;
          }
        }
      });

      // 월별 신규 사용자 데이터
      const monthlyUsers = {};
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyUsers[key] = 0;
      }
      
      allUsers.forEach(user => {
        const userDate = new Date(user.createdAt);
        const key = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyUsers.hasOwnProperty(key)) {
          monthlyUsers[key]++;
        }
      });

      // 차트 데이터 구성
      setChartData({
        monthlyRevenue: Object.keys(monthlyRevenue).map(key => ({
          label: key.substring(5) + '월',
          value: monthlyRevenue[key]
        })),
        monthlyBookings: Object.keys(monthlyBookings).map(key => ({
          label: key.substring(5) + '월',
          value: monthlyBookings[key]
        })),
        monthlyUsers: Object.keys(monthlyUsers).map(key => ({
          label: key.substring(5) + '월',
          value: monthlyUsers[key]
        })),
        userTypes: [
          { label: '일반 사용자', value: regularUsers },
          { label: '사업자', value: businessUsers },
          { label: '관리자', value: adminUsers }
        ]
      });

      // 실제 통계 설정
      setStats({
        totalBookings: allBookings.length,
        totalRevenue: allBookings
          .filter(b => b.bookingStatus !== 'cancelled')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        totalBusiness: businessUsers,
        totalHotels: allHotels.length,
        totalUsers: regularUsers
      });

    } catch (error) {
      console.error('Failed to load stats:', error);
      // 에러 시 기본값
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        totalBusiness: 0,
        totalHotels: 0,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">관리자 대시보드</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="총 예약"
          value={stats?.totalBookings || 0}
          icon={FaCalendar}
          color="indigo"
        />
        <StatCard
          title="총 매출"
          value={`₩${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={FaMoneyBillWave}
          color="green"
        />
        <StatCard
          title="사업자 수"
          value={stats?.totalBusiness || 0}
          icon={FaBuilding}
          color="purple"
        />
        <StatCard
          title="호텔 수"
          value={stats?.totalHotels || 0}
          icon={FaHotel}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineChart 
          data={chartData.monthlyRevenue}
          title="월별 플랫폼 매출 (최근 6개월)"
          height={250}
        />
        <BarChart 
          data={chartData.monthlyBookings}
          title="월별 예약 건수 (최근 6개월)"
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChart 
          data={chartData.monthlyUsers}
          title="월별 신규 사용자 (최근 6개월)"
          height={250}
        />
        <DonutChart 
          data={chartData.userTypes}
          title="사용자 유형 분포"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">플랫폼 통계</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {(stats?.totalUsers || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">일반 사용자</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {(stats?.totalBusiness || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">사업자</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {(stats?.totalHotels || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">등록 호텔</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              ₩{((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 매출</div>
          </div>
        </div>
      </div>
    </div>
  );
}

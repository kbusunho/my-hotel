import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaUsers, FaHotel, FaCalendar, FaChartLine, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';
import { BarChart, LineChart, DonutChart, StatCard } from '../../components/SimpleChart.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({
    monthlyRevenue: [],
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
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);

      // 월별 매출 데이터 (최근 6개월)
      const monthlyRevenue = [];
      const monthlyUsers = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthLabel = `${date.getMonth() + 1}월`;
        
        // 임시 데이터 (실제로는 API에서 가져와야 함)
        monthlyRevenue.push({
          label: monthLabel,
          value: Math.floor(Math.random() * 10000000) + 5000000
        });
        monthlyUsers.push({
          label: monthLabel,
          value: Math.floor(Math.random() * 100) + 50
        });
      }

      // 사용자 유형 분포
      const userTypes = [
        { label: '일반 사용자', value: response.data?.totalUsers || 150 },
        { label: '사업자', value: response.data?.totalBusiness || 30 },
        { label: '관리자', value: 5 }
      ];

      setChartData({
        monthlyRevenue,
        monthlyUsers,
        userTypes
      });

    } catch (error) {
      console.error('Failed to load stats:', error);
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
          change={12}
          icon={FaCalendar}
          color="indigo"
        />
        <StatCard
          title="총 매출"
          value={`₩${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={18}
          icon={FaMoneyBillWave}
          color="green"
        />
        <StatCard
          title="사업자 수"
          value={stats?.totalBusiness || 0}
          change={5}
          icon={FaBuilding}
          color="purple"
        />
        <StatCard
          title="호텔 수"
          value={stats?.totalHotels || 0}
          change={8}
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
          data={chartData.monthlyUsers}
          title="월별 신규 사용자 (최근 6개월)"
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DonutChart 
          data={chartData.userTypes}
          title="사용자 유형 분포"
        />
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">플랫폼 현황</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">전체 사용자</span>
              <span className="text-xl font-bold dark:text-white">
                {((stats?.totalUsers || 0) + (stats?.totalBusiness || 0)).toLocaleString()}명
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">전체 호텔</span>
              <span className="text-xl font-bold dark:text-white">
                {(stats?.totalHotels || 0).toLocaleString()}개
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">총 예약</span>
              <span className="text-xl font-bold dark:text-white">
                {(stats?.totalBookings || 0).toLocaleString()}건
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">총 매출</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                ₩{(stats?.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

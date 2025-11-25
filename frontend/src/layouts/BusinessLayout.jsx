import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaHotel, FaBed, FaCalendar, FaStar, FaSignOutAlt, FaChartBar, FaCog, FaHome, FaTicketAlt, FaMoon, FaSun } from 'react-icons/fa';

export default function BusinessLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { path: '/business', label: '대시보드', icon: FaChartBar },
    { path: '/business/hotels', label: '호텔 관리', icon: FaHotel },
    { path: '/business/rooms', label: '객실 관리', icon: FaBed },
    { path: '/business/bookings', label: '예약 관리', icon: FaCalendar },
    { path: '/business/calendar', label: '예약 캘린더', icon: FaCalendar },
    { path: '/business/coupons', label: '쿠폰 관리', icon: FaTicketAlt },
    { path: '/business/reviews', label: '리뷰 관리', icon: FaStar },
    { path: '/business/settings', label: '계정 설정', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 dark:bg-gray-800 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <FaHotel className="text-2xl" />
            <span className="text-xl font-bold">Hotel Admin</span>
          </div>

          <div className="space-y-2 mb-4">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaHome />
              <span>홈페이지로 이동</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center space-x-2 px-4 py-2 w-full bg-slate-700 dark:bg-gray-700 text-white rounded-lg hover:bg-slate-600 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              <span>{isDark ? '밝게' : '어둡게'}</span>
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-700 rounded-lg"
              title="로그아웃"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

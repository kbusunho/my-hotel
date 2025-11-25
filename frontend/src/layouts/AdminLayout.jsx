import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FaChartBar, FaUsers, FaHotel, FaExclamationTriangle, 
  FaTicketAlt, FaCog, FaSignOutAlt, FaHome, FaClipboardList, FaTags, FaMoon, FaSun
} from 'react-icons/fa';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: FaChartBar },
    { path: '/admin/users', label: '회원 관리', icon: FaUsers },
    { path: '/admin/business', label: '사업자 관리', icon: FaUsers },
    { path: '/admin/hotels', label: '호텔 관리', icon: FaHotel },
    { path: '/admin/hotel-tags', label: '호텔 태그', icon: FaTags },
    { path: '/admin/reviews', label: '리뷰 관리', icon: FaExclamationTriangle },
    { path: '/admin/coupons', label: '쿠폰 관리', icon: FaTicketAlt },
    { path: '/admin/activity-logs', label: '활동 로그', icon: FaClipboardList },
    { path: '/admin/settings', label: '설정', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 dark:bg-gray-800 text-white flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-8">
            <FaCog className="text-2xl" />
            <span className="text-xl font-bold">관리자 대시보드</span>
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

        {/* 하단 사용자 정보 - flex-shrink-0로 고정 */}
        <div className="flex-shrink-0 p-6 border-t border-slate-700 bg-slate-800 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-3">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-sm text-gray-400">관리자</p>
            </div>
            <button
              onClick={logout}
              className="flex-shrink-0 p-2 hover:bg-slate-700 dark:hover:bg-gray-700 rounded-lg transition-colors"
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

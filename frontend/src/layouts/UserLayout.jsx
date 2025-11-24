import { Outlet, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaHotel, FaHeart, FaUser, FaSignOutAlt, FaCog, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import Footer from '../components/Footer';

export default function UserLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <FaHotel className="text-sage-600 dark:text-sage-400 text-2xl" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">HotelHub</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link to="/search" className="text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400">호텔 검색</Link>
              
              {/* 다크모드 토글 버튼 */}
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                aria-label="테마 변경"
              >
                {isDark ? (
                  <>
                    <FaSun className="text-yellow-400" size={18} />
                    <span className="text-sm font-medium">밝게</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-gray-600 dark:text-gray-400" size={18} />
                    <span className="text-sm font-medium">어둡게</span>
                  </>
                )}
              </button>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
                      관리자 대시보드
                    </Link>
                  )}
                  {user.role === 'business' && (
                    <Link to="/business" className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                      사업자 대시보드
                    </Link>
                  )}
                  <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400">대시보드</Link>
                  <Link to="/my-bookings" className="text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400">예약 내역</Link>
                  <Link to="/favorites" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400">
                    <FaHeart />
                    <span>찜</span>
                  </Link>
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400 focus:outline-none"
                    >
                      <FaUser />
                      <span>{user.name}</span>
                      <FaChevronDown className={`text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          대시보드
                        </Link>
                        <Link 
                          to="/my-bookings" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          내 예약
                        </Link>
                        <Link 
                          to="/favorites" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          찜 목록
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                        >
                          <FaCog />
                          <span>설정</span>
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 dark:text-red-400"
                        >
                          <FaSignOutAlt />
                          <span>로그아웃</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400">로그인</Link>
                  <Link to="/register" className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700">회원가입</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

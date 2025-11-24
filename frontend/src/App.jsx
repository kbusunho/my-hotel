import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CompareProvider } from './context/CompareContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useState, useEffect } from 'react';
import axios from './api/axios';

// User Pages
import UserLayout from './layouts/UserLayout';
import HomePage from './pages/user/HomePage';
import Dashboard from './pages/user/Dashboard';
import SearchPage from './pages/user/SearchPage';
import HotelDetailPage from './pages/user/HotelDetailPage';
import BookingPage from './pages/user/BookingPage';
import PaymentPage from './pages/user/PaymentPage';
import PaymentSuccessPage from './pages/user/PaymentSuccessPage';
import PaymentFailPage from './pages/user/PaymentFailPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import FavoritesPage from './pages/user/FavoritesPage';
import SettingsPage from './pages/user/SettingsPage';
import CompareHotelsPage from './pages/user/CompareHotelsPage';

// Info Pages
import AboutPage from './pages/info/AboutPage';
import NoticePage from './pages/info/NoticePage';
import FAQPage from './pages/info/FAQPage';
import TermsPage from './pages/info/TermsPage';
import PrivacyPage from './pages/info/PrivacyPage';
import ContactPage from './pages/info/ContactPage';

// Business Pages
import BusinessLayout from './layouts/BusinessLayout';
import BusinessDashboard from './pages/business/Dashboard';
import HotelManagement from './pages/business/HotelManagement';
import RoomManagement from './pages/business/RoomManagement';
import BookingManagement from './pages/business/BookingManagement';
import ReviewManagement from './pages/business/ReviewManagement';
import BusinessSettingsPage from './pages/business/SettingsPage';
import BookingCalendar from './components/BookingCalendar';
import BusinessCouponManagement from './pages/business/CouponManagement';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import BusinessApproval from './pages/admin/BusinessApproval';
import HotelApproval from './pages/admin/HotelApproval';
import ReportedReviews from './pages/admin/ReportedReviews';
import CouponManagement from './pages/admin/CouponManagement';
import SystemSettings from './pages/admin/SystemSettings';
import ActivityLogs from './pages/admin/ActivityLogs';
import HotelTags from './pages/admin/HotelTags';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import FindEmailPage from './pages/auth/FindEmailPage';

// Maintenance Page
import MaintenancePage from './pages/MaintenancePage';

function App() {
  const { user } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 유지보수 모드 체크
  useEffect(() => {
    checkMaintenance();
  }, []);

  const checkMaintenance = async () => {
    try {
      const response = await axios.get('/system-settings');
      setMaintenanceMode(response.data.maintenanceMode);
      setMaintenanceMessage(response.data.maintenanceMessage);
    } catch (error) {
      console.error('유지보수 모드 확인 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 유지보수 모드 활성화 시 (관리자 제외)
  if (maintenanceMode && (!user || user.role !== 'admin')) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <CompareProvider>
            <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/find-email" element={<FindEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="hotels/:id" element={<HotelDetailPage />} />
        <Route path="booking/:roomId" element={<BookingPage />} />
        <Route path="payment/:bookingId" element={<PaymentPage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/fail" element={<PaymentFailPage />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="compare" element={<CompareHotelsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Info Pages */}
        <Route path="info/about" element={<AboutPage />} />
        <Route path="info/notice" element={<NoticePage />} />
        <Route path="info/faq" element={<FAQPage />} />
        <Route path="info/terms" element={<TermsPage />} />
        <Route path="info/privacy" element={<PrivacyPage />} />
        <Route path="info/contact" element={<ContactPage />} />
      </Route>

      {/* Business Routes */}
      <Route path="/business" element={<ProtectedRoute role="business"><BusinessLayout /></ProtectedRoute>}>
        <Route index element={<BusinessDashboard />} />
        <Route path="hotels" element={<HotelManagement />} />
        <Route path="rooms" element={<RoomManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="calendar" element={<BookingCalendar />} />
        <Route path="coupons" element={<BusinessCouponManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
        <Route path="settings" element={<BusinessSettingsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="business" element={<BusinessApproval />} />
        <Route path="hotels" element={<HotelApproval />} />
        <Route path="reviews" element={<ReportedReviews />} />
        <Route path="coupons" element={<CouponManagement />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="hotel-tags" element={<HotelTags />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
        </Routes>
          </CompareProvider>
      </LanguageProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

// Protected Route Component
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 사업자 승인 상태 체크
  if (role === 'business' && user.businessStatus !== 'approved') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">승인 대기 중</h2>
          <p className="text-gray-600 mb-4">
            사업자 계정 승인을 기다리고 있습니다.
          </p>
          <p className="text-sm text-gray-500">
            관리자 승인 후 이용 가능합니다.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default App;

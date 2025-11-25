import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaBell, FaCheckCircle, FaTimesCircle, FaGift, FaTrash, FaCheck } from 'react-icons/fa';
import toast from '../../utils/toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // 실제 API: const response = await api.get('/notifications');
      // 임시 데이터
      const mockNotifications = [
        {
          _id: '1',
          type: 'booking_confirmed',
          title: '예약이 확정되었습니다',
          message: '서울 그랜드 호텔 예약이 성공적으로 확정되었습니다.',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/my-bookings'
        },
        {
          _id: '2',
          type: 'coupon',
          title: '새로운 쿠폰이 도착했습니다',
          message: '가입 축하 10% 할인 쿠폰이 발급되었습니다.',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          link: null
        },
        {
          _id: '3',
          type: 'booking_cancelled',
          title: '예약이 취소되었습니다',
          message: '부산 해운대 호텔 예약이 취소되었습니다.',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          link: '/my-bookings'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('알림을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      // await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
      toast.success('읽음 처리되었습니다.');
    } catch (error) {
      toast.error('읽음 처리에 실패했습니다.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('모든 알림을 읽음 처리했습니다.');
    } catch (error) {
      toast.error('읽음 처리에 실패했습니다.');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      // await api.delete(`/notifications/${notificationId}`);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      toast.success('알림이 삭제되었습니다.');
    } catch (error) {
      toast.error('삭제에 실패했습니다.');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('모든 알림을 삭제하시겠습니까?')) return;

    try {
      // await api.delete('/notifications/all');
      setNotifications([]);
      toast.success('모든 알림이 삭제되었습니다.');
    } catch (error) {
      toast.error('삭제에 실패했습니다.');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'booking_cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'coupon':
        return <FaGift className="text-purple-500" />;
      default:
        return <FaBell className="text-blue-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center">
            <FaBell className="mr-3" />
            알림
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            읽지 않은 알림 {unreadCount}개
          </p>
        </div>

        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <FaCheck />
              <span>모두 읽음</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
            >
              <FaTrash />
              <span>전체 삭제</span>
            </button>
          )}
        </div>
      </div>

      {/* 필터 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-sage-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            전체 ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-sage-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            읽지 않음 ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'read'
                ? 'bg-sage-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            읽음 ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <FaBell className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold dark:text-white mb-2">
            {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            새로운 알림이 도착하면 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const content = (
              <div
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  !notification.read ? 'border-l-4 border-sage-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-3xl mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg dark:text-white mb-1">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 px-2 py-1 bg-sage-500 text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(notification.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkAsRead(notification._id);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
                        title="읽음 처리"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(notification._id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                      title="삭제"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );

            return notification.link ? (
              <Link key={notification._id} to={notification.link}>
                {content}
              </Link>
            ) : (
              <div key={notification._id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

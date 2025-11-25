import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import LazyImage from '../../components/LazyImage';
import { FaStar, FaMapMarkerAlt, FaClock, FaTrash } from 'react-icons/fa';
import toast from '../../utils/toast';

export default function RecentlyViewedPage() {
  const { user } = useAuth();
  const [viewHistory, setViewHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadViewHistory();
    }
  }, [user]);

  const loadViewHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/viewHistory/my');
      setViewHistory(response.data);
    } catch (error) {
      console.error('Failed to load view history:', error);
      toast.error('최근 본 호텔 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('전체 기록을 삭제하시겠습니까?')) return;

    try {
      await api.delete('/viewHistory/clear');
      setViewHistory([]);
      toast.success('모든 기록이 삭제되었습니다.');
    } catch (error) {
      toast.error('기록 삭제에 실패했습니다.');
    }
  };

  const handleDeleteItem = async (hotelId) => {
    try {
      await api.delete(`/viewHistory/${hotelId}`);
      setViewHistory(viewHistory.filter(item => item.hotel._id !== hotelId));
      toast.success('기록이 삭제되었습니다.');
    } catch (error) {
      toast.error('기록 삭제에 실패했습니다.');
    }
  };

  const groupByDate = (history) => {
    const grouped = {};
    history.forEach(item => {
      const date = new Date(item.viewedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  const groupedHistory = groupByDate(viewHistory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">최근 본 호텔</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            총 {viewHistory.length}개의 호텔을 조회했습니다
          </p>
        </div>
        
        {viewHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
          >
            <FaTrash />
            <span>전체 삭제</span>
          </button>
        )}
      </div>

      {viewHistory.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <FaClock className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold dark:text-white mb-2">최근 본 호텔이 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            호텔을 둘러보고 마음에 드는 곳을 찾아보세요
          </p>
          <Link
            to="/search"
            className="inline-block px-6 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
          >
            호텔 검색하기
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold dark:text-white mb-4 flex items-center">
                <FaClock className="mr-2 text-sage-500" />
                {date}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const hotel = item.hotel;
                  return (
                    <div
                      key={item._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
                    >
                      <button
                        onClick={() => handleDeleteItem(hotel._id)}
                        className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        <FaTrash className="text-red-500" />
                      </button>

                      <Link to={`/hotels/${hotel._id}`}>
                        <div className="relative h-48 overflow-hidden">
                          <LazyImage
                            src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs">
                            {new Date(item.viewedAt).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 dark:text-white">{hotel.name}</h3>
                          
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <FaMapMarkerAlt className="mr-1" />
                            {hotel.location?.city || '위치 정보 없음'}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex text-yellow-500 text-sm">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={i < (hotel.rating || 0) ? '' : 'text-gray-300 dark:text-gray-600'}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                ({hotel.reviewCount || 0})
                              </span>
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-gray-500 dark:text-gray-400">1박 기준</div>
                              <div className="text-lg font-bold text-sage-600 dark:text-sage-400">
                                ₩{(hotel.minPrice || 0).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

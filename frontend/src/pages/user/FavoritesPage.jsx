import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaHeart, FaStar, FaMapMarkerAlt, FaBell, FaTimes } from 'react-icons/fa';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites/my');
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      alert('찜 목록을 불러오는데 실패했습니다.');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (hotelId) => {
    try {
      await api.delete(`/favorites/${hotelId}`);
      setFavorites(favorites.filter(f => f.hotel?._id !== hotelId));
    } catch (error) {
      alert('찜 목록 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleOpenAlertModal = (favorite) => {
    setSelectedFavorite(favorite);
    setAlertPrice(favorite.priceAlert?.targetPrice || '');
    setShowAlertModal(true);
  };

  const handleSetPriceAlert = async () => {
    if (!selectedFavorite || !alertPrice) {
      alert('목표 가격을 입력해주세요.');
      return;
    }

    try {
      await api.put(`/favorites/${selectedFavorite.hotel._id}/price-alert`, {
        enabled: true,
        targetPrice: parseInt(alertPrice)
      });
      alert('가격 알림이 설정되었습니다.');
      setShowAlertModal(false);
      loadFavorites();
    } catch (error) {
      alert('가격 알림 설정 중 오류가 발생했습니다.');
    }
  };

  const handleDisableAlert = async (hotelId) => {
    try {
      await api.put(`/favorites/${hotelId}/price-alert`, {
        enabled: false
      });
      alert('가격 알림이 해제되었습니다.');
      loadFavorites();
    } catch (error) {
      alert('가격 알림 해제 중 오류가 발생했습니다.');
    }
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
      <h1 className="text-3xl font-bold mb-8">찜한 호텔</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">찜한 호텔이 없습니다.</p>
          <Link to="/search" className="btn-primary">
            호텔 검색하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {favorites.map((favorite) => {
            const hotel = favorite.hotel;
            if (!hotel) return null;
            
            return (
              <div key={favorite._id} className="card group relative">
                <button
                  onClick={() => handleRemoveFavorite(hotel._id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                >
                  <FaHeart className="text-red-500" />
                </button>

                {favorite.priceAlert?.enabled && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold flex items-center">
                    <FaBell className="mr-1" />
                    알림 ON
                  </div>
                )}

                <Link to={`/hotels/${hotel._id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{hotel.location?.city || '부산'}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-yellow-500">
                        <FaStar />
                        <span className="ml-1 text-gray-700">
                          {hotel.rating?.toFixed(1) || '4.2'}
                        </span>
                      </div>
                      <div className="text-sage-600 font-bold">
                        ₩{(hotel.minPrice || 150000).toLocaleString()}
                      </div>
                    </div>

                    {favorite.priceAlert?.enabled && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <p className="text-yellow-800">
                          목표가: ₩{favorite.priceAlert.targetPrice?.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="px-4 pb-4 space-y-2">
                  {favorite.priceAlert?.enabled ? (
                    <button
                      onClick={() => handleDisableAlert(hotel._id)}
                      className="w-full py-2 border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50"
                    >
                      알림 해제
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenAlertModal(favorite)}
                      className="w-full py-2 border border-sage-500 text-sage-600 rounded-lg hover:bg-sage-50 flex items-center justify-center"
                    >
                      <FaBell className="mr-2" />
                      가격 알림 설정
                    </button>
                  )}
                  
                  <Link
                    to={`/hotels/${hotel._id}`}
                    className="block w-full py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 text-center"
                  >
                    예약하기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 가격 알림 설정 모달 */}
      {showAlertModal && selectedFavorite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">가격 알림 설정</h2>
              <button onClick={() => setShowAlertModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="font-semibold mb-2">{selectedFavorite.hotel?.name}</p>
                <p className="text-sm text-gray-600">
                  목표 가격을 설정하시면 해당 가격 이하로 떨어질 때 알림을 받으실 수 있습니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 가격 (₩)
                </label>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="예: 100000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 24시간에 한 번씩 가격을 확인하여 알림을 보내드립니다.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSetPriceAlert}
                  className="flex-1 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700"
                >
                  설정 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

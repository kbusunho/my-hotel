import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/me');
      setFavorites(response.data.favorites || []);
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
      await api.post(`/users/favorites/${hotelId}`);
      setFavorites(favorites.filter(h => h._id !== hotelId));
    } catch (error) {
      alert('찜 목록 업데이트 중 오류가 발생했습니다.');
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
          {favorites.map((hotel) => (
            <div key={hotel._id} className="card group relative">
              <button
                onClick={() => handleRemoveFavorite(hotel._id)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
              >
                <FaHeart className="text-red-500" />
              </button>

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

                  <div className="flex items-center justify-between">
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

                  <button className="w-full mt-3 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600">
                    예약하기
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

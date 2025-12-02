import { useState, useEffect } from 'react';
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRecentSearches, RecentSearches } from '../../hooks/useRecentSearches.jsx';
import api from '../../api/axios';
import { FaStar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import LazyImage from '../../components/LazyImage';
import { mapAmenities } from '../../utils/amenityMapper';

export default function SearchPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addSearch } = useRecentSearches();
  const [hotels, setHotels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    rating: 0,
    hotelType: [],
    amenities: [],
    roomType: [],
    bedType: [],
    viewType: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchHotels();
    if (user) {
      loadFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filters, user]);

  const searchHotels = async () => {
    try {
      setLoading(true);
      const city = searchParams.get('city');
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      const guests = searchParams.get('guests');

      // 최근 검색 저장
      if (city || checkIn || checkOut) {
        addSearch({ city, checkIn, checkOut, guests });
      }
      
      // 필터 파라미터 구성
      const params = { city, checkIn, checkOut };
      
      if (filters.rating > 0) {
        params.rating = filters.rating;
      }

      if (filters.hotelType.length > 0) {
        params.hotelType = filters.hotelType[0]; // 단일 선택으로 처리
      }

      if (filters.amenities.length > 0) {
        params.amenities = filters.amenities;
      }

      if (filters.roomType.length > 0) {
        params.roomType = filters.roomType[0]; // 단일 선택으로 처리
      }

      if (filters.bedType.length > 0) {
        params.bedType = filters.bedType[0]; // 단일 선택으로 처리
      }

      if (filters.viewType.length > 0) {
        params.viewType = filters.viewType[0]; // 단일 선택으로 처리
      }
      
      const response = await api.get('/hotels/search', { params });
      
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to search hotels:', error);
      alert('호텔 검색에 실패했습니다. 다시 시도해주세요.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await api.get('/users/me');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const toggleFavorite = async (hotelId, e) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await api.post(`/users/favorites/${hotelId}`);
      const isFavorite = favorites.some(fav => fav._id === hotelId || fav === hotelId);
      if (isFavorite) {
        setFavorites(favorites.filter(fav => fav._id !== hotelId && fav !== hotelId));
      } else {
        setFavorites([...favorites, hotelId]);
      }
    } catch (error) {
      alert('찜 목록 업데이트 중 오류가 발생했습니다.');
    }
  };

  const isFavorite = (hotelId) => {
    return favorites.some(fav => fav._id === hotelId || fav === hotelId);
  };

  const filteredHotels = hotels.filter(hotel => {
    // 평점 필터
    if (filters.rating > 0 && (hotel.rating || 0) < filters.rating) return false;
    
    // 가격 필터 (minPrice가 있는 경우만)
    if (hotel.minPrice !== undefined && hotel.minPrice !== null) {
      if (hotel.minPrice < filters.priceRange[0] || hotel.minPrice > filters.priceRange[1]) return false;
    }
    
    // 편의시설 필터
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        hotel.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAllAmenities) return false;
    }
    
    return true;
  });

  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const current = prev[filterType];
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [filterType]: [...current, value] };
      }
    });
  };

  const handleRecentSearchSelect = (search) => {
    const params = new URLSearchParams();
    if (search.city) params.set('city', search.city);
    if (search.checkIn) params.set('checkIn', search.checkIn);
    if (search.checkOut) params.set('checkOut', search.checkOut);
    if (search.guests) params.set('guests', search.guests);
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">호텔 검색 결과</h1>

      {/* 최근 검색 */}
      <RecentSearches onSelectSearch={handleRecentSearchSelect} />

      <div className="grid grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold dark:text-white">필터</h2>
              <button
                onClick={() => setFilters({
                  priceRange: [0, 500000],
                  rating: 0,
                  hotelType: [],
                  amenities: [],
                  roomType: [],
                  bedType: []
                })}
                className="text-sm text-sage-600 dark:text-sage-400 hover:underline"
              >
                초기화
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 dark:text-white">가격 범위</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                    className="w-24 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="최소"
                  />
                  <span className="dark:text-gray-400">~</span>
                  <input
                    type="number"
                    min="0"
                    max="500000"
                    step="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                    className="w-24 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="최대"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                  className="w-full accent-sage-500"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>₩{filters.priceRange[0].toLocaleString()}</span>
                  <span>₩{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 dark:text-white">평점</h3>
              <div className="space-y-2">{[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => setFilters({...filters, rating})}
                      className="accent-sage-500"
                    />
                    <div className="flex items-center">
                      {[...Array(rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                      <span className="ml-2 text-sm dark:text-gray-300">{rating}+ stars</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 호텔 타입 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 dark:text-white">호텔 타입</h3>
              <div className="space-y-2">
                {[
                  { value: 'luxury', label: '럭셔리 호텔' },
                  { value: 'business', label: '비즈니스 호텔' },
                  { value: 'resort', label: '리조트' },
                  { value: 'boutique', label: '부티크 호텔' },
                  { value: 'pension', label: '펜션' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.hotelType.includes(type.value)}
                      onChange={() => toggleFilter('hotelType', type.value)}
                      className="accent-sage-500"
                    />
                    <span className="text-sm dark:text-gray-300">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 편의시설 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 dark:text-white">편의시설</h3>
              <div className="space-y-2">
                {[
                  { value: 'WiFi', label: '무료 WiFi', icon: '📶' },
                  { value: '주차', label: '무료 주차', icon: '🅿️' },
                  { value: '수영장', label: '수영장', icon: '🏊' },
                  { value: '피트니스', label: '피트니스', icon: '💪' },
                  { value: '레스토랑', label: '레스토랑', icon: '🍽️' },
                  { value: '스파', label: '스파', icon: '💆' },
                  { value: '바', label: '바/라운지', icon: '🍸' },
                  { value: '조식', label: '조식 포함', icon: '🍳' },
                  { value: '반려동물', label: '반려동물 동반', icon: '🐕' },
                  { value: '키즈클럽', label: '키즈클럽', icon: '👶' },
                  { value: '공항셔틀', label: '공항 셔틀', icon: '🚐' },
                  { value: '비즈니스', label: '비즈니스 센터', icon: '💼' }
                ].map((amenity) => (
                  <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.amenities.includes(amenity.value)}
                      onChange={() => toggleFilter('amenities', amenity.value)}
                      className="accent-sage-500"
                    />
                    <span className="text-sm dark:text-gray-300">{amenity.icon} {amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 객실 타입 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 dark:text-white">객실 타입</h3>
              <div className="space-y-2">
                {[
                  { value: 'standard', label: '스탠다드' },
                  { value: 'deluxe', label: '디럭스' },
                  { value: 'suite', label: '스위트' },
                  { value: 'premium', label: '프리미엄' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.roomType.includes(type.value)}
                      onChange={() => toggleFilter('roomType', type.value)}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 베드 타입 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">베드 타입</h3>
              <div className="space-y-2">
                {[
                  { value: 'single', label: '싱글' },
                  { value: 'double', label: '더블' },
                  { value: 'twin', label: '트윈' },
                  { value: 'queen', label: '퀸' },
                  { value: 'king', label: '킹' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.bedType.includes(type.value)}
                      onChange={() => toggleFilter('bedType', type.value)}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 뷰 타입 */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">뷰 타입</h3>
              <div className="space-y-2">
                {[
                  { value: 'ocean', label: '오션뷰' },
                  { value: 'mountain', label: '마운틴뷰' },
                  { value: 'city', label: '시티뷰' },
                  { value: 'garden', label: '가든뷰' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.viewType.includes(type.value)}
                      onChange={() => toggleFilter('viewType', type.value)}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setFilters({ 
                priceRange: [0, 500000], 
                rating: 0, 
                hotelType: [],
                amenities: [],
                roomType: [],
                bedType: [],
                viewType: []
              })}
              className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              필터 초기화
            </button>
          </div>
        </aside>

        {/* Hotels List */}
        <main className="col-span-9">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto"></div>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {hotels.length === 0 ? '검색 결과가 없습니다' : '필터 조건에 맞는 호텔이 없습니다'}
              </h3>
              <p className="text-gray-500 mb-4">
                {hotels.length === 0 
                  ? '다른 검색 조건으로 다시 시도해주세요.'
                  : '필터를 조정하거나 초기화해보세요.'}
              </p>
              {filteredHotels.length === 0 && hotels.length > 0 && (
                <button 
                  onClick={() => setFilters({ 
                    priceRange: [0, 500000], 
                    rating: 0, 
                    hotelType: [],
                    amenities: [],
                    roomType: [],
                    bedType: [],
                    viewType: []
                  })}
                  className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
                >
                  필터 초기화
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHotels.map((hotel) => (
                <Link
                  key={hotel._id}
                  to={`/hotels/${hotel._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <LazyImage
                      src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                      alt={hotel.name}
                      className="w-64 h-48 object-cover"
                    />
                    <button
                      onClick={(e) => toggleFavorite(hotel._id, e)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                    >
                      <FaHeart className={isFavorite(hotel._id) ? 'text-red-500' : 'text-gray-400'} />
                    </button>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{hotel.location?.address || '부산광역시'}</span>
                        </div>
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-500 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < Math.floor(hotel.rating || 4) ? '' : 'text-gray-300'} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {hotel.rating?.toFixed(1) || '4.2'} Very Good ({hotel.reviewCount || 0} Reviews)
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap">
                          {mapAmenities(hotel.amenities).slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center">
                              {React.createElement(amenity.icon, { className: "mr-1" })}
                              <span>{amenity.label}</span>
                            </div>
                          ))}
                          {hotel.amenities && hotel.amenities.length > 4 && (
                            <span className="text-sage-600">+{hotel.amenities.length - 4}개</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sage-600 mb-2">
                          {hotel.minPrice ? `₩${hotel.minPrice.toLocaleString()}` : '가격 문의'}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">{hotel.minPrice ? '/night' : ''}</div>
                        <button className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600">
                          View Place
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

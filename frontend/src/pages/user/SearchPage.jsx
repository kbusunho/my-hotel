import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool } from 'react-icons/fa';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    rating: 0,
    amenities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const searchHotels = async () => {
    try {
      setLoading(true);
      const city = searchParams.get('city');
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      
      const response = await api.get('/hotels/search', {
        params: { city, checkIn, checkOut }
      });
      
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to search hotels:', error);
      alert('호텔 검색에 실패했습니다. 다시 시도해주세요.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    if (filters.rating > 0 && hotel.rating < filters.rating) return false;
    if (hotel.minPrice < filters.priceRange[0] || hotel.minPrice > filters.priceRange[1]) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">호텔 검색 결과</h1>

      <div className="grid grid-cols-12 gap-8">
        {/* Filters Sidebar */}
        <aside className="col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Price</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₩0</span>
                  <span>₩{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => setFilters({...filters, rating})}
                    />
                    <div className="flex items-center">
                      {[...Array(rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                      <span className="ml-2 text-sm">{rating}+ stars</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="space-y-2">
                {['WiFi', 'Parking', 'Swimming Pool', 'Gym'].map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setFilters({ priceRange: [0, 500000], rating: 0, amenities: [] })}
              className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Hotels List */}
        <main className="col-span-9">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHotels.map((hotel) => (
                <Link
                  key={hotel._id}
                  to={`/hotels/${hotel._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-shadow"
                >
                  <img
                    src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    className="w-64 h-48 object-cover"
                  />
                  
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
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaWifi className="mr-1" />
                            <span>Free WiFi</span>
                          </div>
                          <div className="flex items-center">
                            <FaParking className="mr-1" />
                            <span>Parking</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sage-600 mb-2">
                          ₩{(hotel.minPrice || 200000).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">/night</div>
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

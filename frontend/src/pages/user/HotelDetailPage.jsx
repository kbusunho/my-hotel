import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaHeart } from 'react-icons/fa';

export default function HotelDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadHotelDetails();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const loadHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hotels/${id}`);
      setHotel(response.data.hotel);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Failed to load hotel:', error);
      alert('호텔 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await api.get(`/reviews/hotel/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get('/users/me');
      setIsFavorite(response.data.favorites?.some(fav => fav._id === id || fav === id));
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await api.post(`/users/favorites/${id}`);
      setIsFavorite(!isFavorite);
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

  if (!hotel) return <div>호텔을 찾을 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-sage-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/search" className="hover:text-sage-600">Hotels</Link>
        <span className="mx-2">/</span>
        <span>{hotel.name}</span>
      </nav>

      {/* Hotel Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
          <div className="flex items-center text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-2" />
            <span>{hotel.location?.address || '부산광역시'}</span>
          </div>
          <div className="flex items-center">
            <div className="bg-sage-600 text-white px-3 py-1 rounded-lg font-bold mr-3">
              {hotel.rating?.toFixed(1) || '4.2'}
            </div>
            <div>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(hotel.rating || 4) ? '' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({hotel.reviewCount || 0} Reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-sage-600 mb-2">
            ₩{((rooms[0]?.price || 200000)).toLocaleString()}
          </div>
          <div className="text-gray-600">/night</div>
          <button 
            onClick={toggleFavorite}
            className={`mt-4 px-6 py-2 border-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isFavorite
                ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
                : 'bg-white border-sage-500 text-sage-600 hover:bg-sage-50'
            }`}
          >
            <FaHeart className={isFavorite ? 'fill-current' : ''} />
            <span>{isFavorite ? '찜 해제' : '찜하기'}</span>
          </button>
        </div>
      </div>

      {/* Images Gallery */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-8">
          <img
            src={hotel.images?.[selectedImage] || '/placeholder-hotel.jpg'}
            alt={hotel.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-4">
          {hotel.images?.slice(0, 4).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${hotel.name} ${idx + 1}`}
              onClick={() => setSelectedImage(idx)}
              className={`w-full h-44 object-cover rounded-lg cursor-pointer ${
                selectedImage === idx ? 'ring-4 ring-sage-500' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Overview & Amenities */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        <div className="col-span-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-700 mb-6">{hotel.description}</p>

          <h3 className="text-xl font-bold mb-4">Amenities</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: FaWifi, label: 'Free WiFi' },
              { icon: FaParking, label: 'Free Parking' },
              { icon: FaSwimmingPool, label: 'Swimming Pool' },
            ].map((amenity, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <amenity.icon className="text-sage-600 text-xl" />
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-sage-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Your booking is protected by goibibo</h3>
            <p className="text-sm text-gray-600">
              If the hotel does not match the description or the amenities promised, 
              we will provide compensation.
            </p>
          </div>
        </div>
      </div>

      {/* Available Rooms */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">객실 유형</h2>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white border rounded-lg p-6 flex">
              <img
                src={room.images?.[0] || '/placeholder-room.jpg'}
                alt={room.name}
                className="w-48 h-32 object-cover rounded-lg"
              />
              
              <div className="flex-1 ml-6">
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-2">{room.type}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {room.capacity?.adults}명 · {room.beds} · {room.size}m²
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-sage-600">
                      ₩{room.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">/night</div>
                  </div>
                  
                  <Link
                    to={`/booking/${room._id}`}
                    className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location Map */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">지도보기</h2>
        <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">지도가 여기에 표시됩니다 (Kakao Map API)</p>
        </div>
      </section>

      {/* Reviews */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <button className="text-sage-600 hover:text-sage-700">Write a Review</button>
        </div>

        <div className="space-y-6">
          {reviews.slice(0, 3).map((review) => (
            <div key={review._id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold">{review.user?.name}</h4>
                  <div className="flex text-yellow-500 text-sm mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? '' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {reviews.length > 3 && (
          <div className="text-center mt-6">
            <button className="px-6 py-2 border border-sage-500 text-sage-600 rounded-lg hover:bg-sage-50">
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

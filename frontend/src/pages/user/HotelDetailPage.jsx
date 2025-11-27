import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageGalleryModal from '../../components/ImageGalleryModal';
import api from '../../api/axios';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaHeart, FaEdit, FaTrash, FaTimes, FaFlag } from 'react-icons/fa';

export default function HotelDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', images: [] });
  const [showAllReviews, setShowAllReviews] = useState(false);

  const ensureKakaoLoaded = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }
      let script = document.getElementById('kakao-sdk');
      if (!script) {
        script = document.createElement('script');
        script.id = 'kakao-sdk';
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=23407ddda3460fcdad2d3c8903378e07&autoload=false';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Kakao Maps SDK'));
        document.head.appendChild(script);
      } else {
        script.onload = () => resolve();
      }
    });
  };

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

  useEffect(() => {
    if (hotel && hotel.location) {
      ensureKakaoLoaded()
        .then(() => initializeMap())
        .catch((e) => console.error(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel]);

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
      const favorites = response.data.favorites || [];
      setIsFavorite(favorites.some(fav => (fav._id || fav) === id));
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const initializeMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API not loaded');
      return;
    }

    // Kakao Maps SDK 로드 대기
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(
          hotel.location?.coordinates?.[1] || 35.1595,
          hotel.location?.coordinates?.[0] || 129.1600
        ),
        level: 3
      };

      const map = new window.kakao.maps.Map(container, options);

      const markerPosition = new window.kakao.maps.LatLng(
        hotel.location?.coordinates?.[1] || 35.1595,
        hotel.location?.coordinates?.[0] || 129.1600
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });

      marker.setMap(map);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${hotel.name}</div>`
      });

      infowindow.open(map, marker);
    });
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

  const handleOpenReviewModal = (review = null) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (review) {
      setEditingReview(review);
      setReviewForm({ rating: review.rating, comment: review.comment });
    } else {
      setEditingReview(null);
      setReviewForm({ rating: 5, comment: '' });
    }
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.comment.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, reviewForm);
        alert('리뷰가 수정되었습니다.');
      } else {
        await api.post('/reviews', {
          hotel: id,
          ...reviewForm
        });
        alert('리뷰가 등록되었습니다.');
      }
      handleCloseReviewModal();
      loadReviews();
      loadHotelDetails();
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error.response?.data?.message || '리뷰 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      alert('리뷰가 삭제되었습니다.');
      loadReviews();
      loadHotelDetails();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReportReview = async (reviewId) => {
    const reason = prompt('신고 사유를 입력해주세요:');
    if (!reason) return;

    try {
      await api.post(`/reviews/${reviewId}/report`, { reason });
      alert('리뷰가 신고되었습니다.');
    } catch (error) {
      console.error('Failed to report review:', error);
      alert('리뷰 신고 중 오류가 발생했습니다.');
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
            {rooms[0]?.price ? `₩${rooms[0].price.toLocaleString()}` : '가격 문의'}
          </div>
          <div className="text-gray-600">{rooms[0]?.price ? '/night' : ''}</div>
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
            className="w-full h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              setShowGallery(true);
            }}
          />
        </div>
        <div className="col-span-4 grid grid-cols-2 gap-4">
          {hotel.images?.slice(0, 4).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${hotel.name} ${idx + 1}`}
              onClick={() => {
                setSelectedImage(idx);
                setShowGallery(true);
              }}
              className={`w-full h-44 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                selectedImage === idx ? 'ring-4 ring-sage-500' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={hotel.images || []}
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        initialIndex={selectedImage}
      />

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
        <div id="map" className="w-full h-96 rounded-lg"></div>
      </section>

      {/* Reviews */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">리뷰 ({reviews.length})</h2>
          <button 
            onClick={() => handleOpenReviewModal()}
            className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
          >
            리뷰 작성
          </button>
        </div>

        <div className="space-y-6">
          {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  {user && user._id === review.user?._id && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleOpenReviewModal(review)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="수정"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:text-red-700"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                  {user && user._id !== review.user?._id && (
                    <button
                      onClick={() => handleReportReview(review._id)}
                      className="text-gray-500 hover:text-red-600 ml-4"
                      title="신고"
                    >
                      <FaFlag />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              {/* 리뷰 이미지 */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        // TODO: 이미지 갤러리 모달 열기
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">아직 작성된 리뷰가 없습니다.</p>
            <button
              onClick={() => handleOpenReviewModal()}
              className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
            >
              첫 리뷰 작성하기
            </button>
          </div>
        )}

        {reviews.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-6 py-2 border border-sage-500 text-sage-600 rounded-lg hover:bg-sage-50"
            >
              {showAllReviews ? '접기' : `모든 리뷰 보기 (${reviews.length})`}
            </button>
          </div>
        )}
      </section>

      {/* 리뷰 작성/수정 모달 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingReview ? '리뷰 수정' : '리뷰 작성'}
              </h2>
              <button onClick={handleCloseReviewModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  별점 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <FaStar
                        size={32}
                        className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                  <span className="ml-4 text-lg font-semibold">{reviewForm.rating}점</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  리뷰 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="이 호텔에 대한 솔직한 리뷰를 남겨주세요..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewForm.comment.length} / 500자
                </p>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사진 첨부 (최대 5장)
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files).slice(0, 5);
                      setReviewForm({ ...reviewForm, images: files });
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-sage-50 file:text-sage-700
                      hover:file:bg-sage-100"
                  />
                  {reviewForm.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {reviewForm.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = reviewForm.images.filter((_, i) => i !== index);
                              setReviewForm({ ...reviewForm, images: newImages });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
                >
                  {editingReview ? '수정하기' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaStar } from 'react-icons/fa';

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      city: '',
      district: '',
      address: '',
      zipCode: ''
    },
    starRating: 5,
    amenities: [],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    policies: {
      cancellation: '',
      children: '',
      pets: ''
    },
    images: []
  });
  const [amenityInput, setAmenityInput] = useState('');

  const amenitiesList = [
    '무료 Wi-Fi', '주차장', '수영장', '피트니스센터', '레스토랑',
    '룸서비스', '비즈니스센터', '세탁서비스', '공항셔틀', '스파',
    '바/라운지', '회의실', '금연실', '장애인 편의시설', '반려동물 동반'
  ];

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      alert('호텔 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name || '',
        description: hotel.description || '',
        location: hotel.location || { city: '', district: '', address: '', zipCode: '' },
        starRating: hotel.starRating || 5,
        amenities: hotel.amenities || [],
        checkInTime: hotel.checkInTime || '15:00',
        checkOutTime: hotel.checkOutTime || '11:00',
        policies: hotel.policies || { cancellation: '', children: '', pets: '' },
        images: hotel.images || []
      });
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        description: '',
        location: { city: '', district: '', address: '', zipCode: '' },
        starRating: 5,
        amenities: [],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        policies: { cancellation: '', children: '', pets: '' },
        images: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHotel(null);
    setFormData({
      name: '',
      description: '',
      location: { city: '', district: '', address: '', zipCode: '' },
      starRating: 5,
      amenities: [],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      policies: { cancellation: '', children: '', pets: '' },
      images: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location.city || !formData.location.address) {
      alert('호텔명, 도시, 주소는 필수입니다.');
      return;
    }

    try {
      if (editingHotel) {
        await api.put(`/business/hotels/${editingHotel._id}`, formData);
        alert('호텔 정보가 수정되었습니다.');
      } else {
        await api.post('/business/hotels', formData);
        alert('새 호텔이 등록되었습니다. 관리자 승인 후 활성화됩니다.');
      }
      handleCloseModal();
      loadHotels();
    } catch (error) {
      console.error('Failed to save hotel:', error);
      alert('호텔 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까? 이 호텔의 모든 객실과 예약 정보도 함께 삭제됩니다.')) return;

    try {
      await api.delete(`/business/hotels/${id}`);
      alert('호텔이 삭제되었습니다.');
      loadHotels();
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">호텔 관리</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>호텔 추가</span>
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">등록된 호텔이 없습니다.</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            첫 호텔 등록하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔명</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">위치</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">등급</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">평점</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{hotel.name}</div>
                    <div className="text-sm text-gray-500">{hotel.amenities?.length || 0}개 편의시설</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>{hotel.location?.city}</div>
                    <div className="text-sm text-gray-500">{hotel.location?.district}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(hotel.starRating || 5)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-yellow-500 font-semibold">
                      ⭐ {hotel.rating?.toFixed(1) || '신규'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      hotel.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : hotel.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {hotel.status === 'active' ? '활성' : hotel.status === 'pending' ? '승인대기' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenModal(hotel)}
                      className="text-indigo-600 hover:text-indigo-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 호텔 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingHotel ? '호텔 정보 수정' : '새 호텔 등록'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    호텔명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="호텔에 대한 상세 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    호텔 등급
                  </label>
                  <select
                    name="starRating"
                    value={formData.starRating}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {[1, 2, 3, 4, 5].map(star => (
                      <option key={star} value={star}>{star}성급</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 위치 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">위치 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      도시 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">선택하세요</option>
                      <option value="서울">서울</option>
                      <option value="부산">부산</option>
                      <option value="제주">제주</option>
                      <option value="인천">인천</option>
                      <option value="대구">대구</option>
                      <option value="광주">광주</option>
                      <option value="대전">대전</option>
                      <option value="울산">울산</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">지역/구</label>
                    <input
                      type="text"
                      name="location.district"
                      value={formData.location.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="강남구, 해운대구 등"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="상세 주소를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">우편번호</label>
                  <input
                    type="text"
                    name="location.zipCode"
                    value={formData.location.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="12345"
                  />
                </div>
              </div>

              {/* 편의시설 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">편의시설</h3>
                <div className="grid grid-cols-3 gap-3">
                  {amenitiesList.map(amenity => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 체크인/체크아웃 시간 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">이용 시간</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체크인 시간</label>
                    <input
                      type="time"
                      name="checkInTime"
                      value={formData.checkInTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체크아웃 시간</label>
                    <input
                      type="time"
                      name="checkOutTime"
                      value={formData.checkOutTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 정책 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">호텔 정책</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">취소 정책</label>
                  <textarea
                    name="policies.cancellation"
                    value={formData.policies.cancellation}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: 체크인 3일 전까지 무료 취소 가능"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">어린이 정책</label>
                  <textarea
                    name="policies.children"
                    value={formData.policies.children}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: 7세 이하 어린이 무료 (침대 추가 시 요금 발생)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">반려동물 정책</label>
                  <textarea
                    name="policies.pets"
                    value={formData.policies.pets}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: 반려동물 동반 불가 / 소형견만 가능 (1박 20,000원)"
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingHotel ? '수정하기' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

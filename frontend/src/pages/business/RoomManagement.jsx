import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBed, FaUsers } from 'react-icons/fa';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filterHotel, setFilterHotel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    hotel: '',
    name: '',
    type: 'standard',
    description: '',
    basePrice: 0,
    weekendPrice: 0,
    capacity: {
      standard: 2,
      max: 4
    },
    size: 0,
    bedType: 'double',
    amenities: [],
    inventory: 1,
    images: []
  });

  const roomTypes = [
    { value: 'standard', label: '스탠다드' },
    { value: 'deluxe', label: '디럭스' },
    { value: 'suite', label: '스위트' },
    { value: 'family', label: '패밀리' },
    { value: 'premium', label: '프리미엄' }
  ];

  const bedTypes = [
    { value: 'single', label: '싱글베드' },
    { value: 'double', label: '더블베드' },
    { value: 'queen', label: '퀸베드' },
    { value: 'king', label: '킹베드' },
    { value: 'twin', label: '트윈베드' }
  ];

  const roomAmenities = [
    '에어컨', '난방', '무료 Wi-Fi', 'TV', '미니바', '냉장고',
    '금고', '커피머신', '욕조', '샤워실', '헤어드라이어', '슬리퍼',
    '욕실용품', '전화', '책상', '옷장', '발코니', '바다뷰'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsRes, hotelsRes] = await Promise.all([
        api.get('/business/rooms'),
        api.get('/business/hotels')
      ]);
      setRooms(roomsRes.data);
      setHotels(hotelsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('데이터 로딩에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      const hotelId = room.hotel?._id || room.hotel;
      setFormData({
        hotel: hotelId || '',
        name: room.name || '',
        type: room.type || 'standard',
        description: room.description || '',
        basePrice: room.basePrice || 0,
        weekendPrice: room.weekendPrice || room.basePrice || 0,
        capacity: room.capacity || { standard: 2, max: 4 },
        size: room.size || 0,
        bedType: room.bedType || 'double',
        amenities: room.amenities || [],
        inventory: room.inventory || 1,
        images: room.images || []
      });
    } else {
      setEditingRoom(null);
      setFormData({
        hotel: hotels[0]?._id || '',
        name: '',
        type: 'standard',
        description: '',
        basePrice: 0,
        weekendPrice: 0,
        capacity: { standard: 2, max: 4 },
        size: 0,
        bedType: 'double',
        amenities: [],
        inventory: 1,
        images: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseInt(value) || value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['basePrice', 'weekendPrice', 'size', 'inventory'].includes(name)
          ? parseInt(value) || 0
          : value
      }));
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

    if (!formData.hotel || !formData.name || formData.basePrice <= 0) {
      alert('호텔, 객실명, 기본 가격은 필수입니다.');
      return;
    }

    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, formData);
        alert('객실 정보가 수정되었습니다.');
      } else {
        await api.post('/rooms', formData);
        alert('새 객실이 등록되었습니다.');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Failed to save room:', error);
      alert('객실 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/rooms/${id}`);
      alert('객실이 삭제되었습니다.');
      loadData();
    } catch (error) {
      console.error('Failed to delete room:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredRooms = rooms.filter(room => {
    const hotelMatch = filterHotel === 'all' || room.hotel._id === filterHotel;
    const typeMatch = filterType === 'all' || room.type === filterType;
    return hotelMatch && typeMatch;
  });

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
        <h1 className="text-3xl font-bold">객실 관리</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          disabled={hotels.length === 0}
        >
          <FaPlus />
          <span>객실 추가</span>
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">먼저 호텔을 등록해주세요.</p>
        </div>
      ) : (
        <>
          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">호텔 필터</label>
              <select
                value={filterHotel}
                onChange={(e) => setFilterHotel(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">전체 호텔</option>
                {hotels.map(hotel => (
                  <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">객실 타입 필터</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">전체 타입</option>
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 객실 목록 */}
          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-4">등록된 객실이 없습니다.</p>
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                첫 객실 등록하기
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">객실명</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">타입</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">가격</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">수용인원</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">재고</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRooms.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{room.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaBed className="mr-1" />
                          {bedTypes.find(b => b.value === room.bedType)?.label || room.bedType}
                          {room.size > 0 && ` · ${room.size}㎡`}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {room.hotel?.name || '알 수 없음'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {roomTypes.find(t => t.value === room.type)?.label || room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">₩{room.basePrice?.toLocaleString()}</div>
                        {room.weekendPrice && room.weekendPrice !== room.basePrice && (
                          <div className="text-sm text-gray-500">
                            주말 ₩{room.weekendPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          기준 {room.capacity?.standard || 2} / 최대 {room.capacity?.max || 4}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${room.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {room.inventory || 0}개
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenModal(room)}
                          className="text-indigo-600 hover:text-indigo-700 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
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
        </>
      )}

      {/* 객실 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingRoom ? '객실 정보 수정' : '새 객실 등록'}
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
                    호텔 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hotel"
                    value={formData.hotel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">선택하세요</option>
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      객실명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="예: 디럭스 더블룸"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      객실 타입 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      {roomTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">객실 설명</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="객실에 대한 설명을 입력하세요"
                  />
                </div>
              </div>

              {/* 가격 및 수용인원 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">가격 및 수용인원</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      평일 가격 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="1000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">주말 가격</label>
                    <input
                      type="number"
                      name="weekendPrice"
                      value={formData.weekendPrice}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      기준 인원
                    </label>
                    <input
                      type="number"
                      name="capacity.standard"
                      value={formData.capacity.standard}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최대 인원
                    </label>
                    <input
                      type="number"
                      name="capacity.max"
                      value={formData.capacity.max}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              {/* 객실 상세 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">객실 상세</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">침대 타입</label>
                    <select
                      name="bedType"
                      value={formData.bedType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {bedTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">객실 크기 (㎡)</label>
                    <input
                      type="number"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      재고 수량 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="inventory"
                      value={formData.inventory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 편의시설 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">객실 편의시설</h3>
                <div className="grid grid-cols-3 gap-3">
                  {roomAmenities.map(amenity => (
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
                  {editingRoom ? '수정하기' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

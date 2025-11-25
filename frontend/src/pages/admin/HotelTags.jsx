import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaTag, FaPlus, FaTimes } from 'react-icons/fa';

export default function HotelTags() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const availableTags = ['신규', '인기', '특가', '추천', '럭셔리', '가족', '비즈니스', '커플', '반려동물', '주말특가'];

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      alert('호텔 목록 조회에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (hotelId, tag) => {
    try {
      await api.put(`/admin/hotels/${hotelId}/tags/add`, { tags: [tag] });
      alert('태그가 추가되었습니다.');
      loadHotels();
    } catch (error) {
      console.error('Failed to add tag:', error);
      alert('태그 추가에 실패했습니다.');
    }
  };

  const handleRemoveTag = async (hotelId, tag) => {
    try {
      await api.put(`/admin/hotels/${hotelId}/tags/remove`, { tags: [tag] });
      alert('태그가 제거되었습니다.');
      loadHotels();
    } catch (error) {
      console.error('Failed to remove tag:', error);
      alert('태그 제거에 실패했습니다.');
    }
  };

  const openTagModal = (hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
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
      <h1 className="text-3xl font-bold mb-8">호텔 태그 관리</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔명</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">현재 태그</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold">{hotel.name}</div>
                  <div className="text-sm text-gray-500">{hotel.location?.city}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {hotel.tags && hotel.tags.length > 0 ? (
                      hotel.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold flex items-center"
                        >
                          <FaTag className="mr-1" />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(hotel._id, tag)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">태그 없음</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openTagModal(hotel)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    태그 추가
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 태그 추가 모달 */}
      {showModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">태그 추가 - {selectedHotel.name}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {availableTags.map((tag) => {
                const isAdded = selectedHotel.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => !isAdded && handleAddTag(selectedHotel._id, tag)}
                    disabled={isAdded}
                    className={`w-full px-4 py-3 rounded-lg font-semibold ${
                      isAdded
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    <FaTag className="inline mr-2" />
                    {tag} {isAdded && '(이미 추가됨)'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

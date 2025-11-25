import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaTrash, FaEye, FaSearch, FaStar } from 'react-icons/fa';

export default function HotelApproval() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadHotels();
  }, [filterStatus]);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/hotels?status=${filterStatus}`);
      setHotels(response.data);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      alert('호텔 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (hotel) => {
    setSelectedHotel(hotel);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedHotel(null);
  };

  const handleApprove = async (hotelId) => {
    if (!confirm('이 호텔을 승인하시겠습니까?')) return;

    try {
      await api.put(`/hotels/${hotelId}`, { status: 'active' });
      alert('호텔이 승인되었습니다.');
      loadHotels();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to approve hotel:', error);
      alert('호텔 승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (hotelId) => {
    if (!confirm('이 호텔을 거부하시겠습니까?')) return;

    try {
      await api.put(`/hotels/${hotelId}`, { status: 'inactive' });
      alert('호텔이 거부되었습니다.');
      loadHotels();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to reject hotel:', error);
      alert('호텔 거부 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (hotelId) => {
    if (!confirm('정말 삭제하시겠습니까? 이 호텔의 모든 객실과 예약 정보도 함께 삭제됩니다.')) return;

    try {
      await api.delete(`/admin/hotels/${hotelId}`);
      alert('호텔이 삭제되었습니다.');
      loadHotels();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      alert('호텔 삭제 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">승인대기</span>,
      active: <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">활성</span>,
      inactive: <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">비활성</span>
    };
    return badges[status] || status;
  };

  const filteredHotels = hotels.filter(hotel => {
    if (searchTerm === '') return true;
    return (
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    pending: hotels.filter(h => h.status === 'pending').length,
    active: hotels.filter(h => h.status === 'active').length,
    inactive: hotels.filter(h => h.status === 'inactive').length,
    total: hotels.length
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
      <h1 className="text-3xl font-bold mb-8">호텔 승인 관리</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">승인대기</p>
          <h3 className="text-3xl font-bold text-yellow-600">{stats.pending}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">활성 호텔</p>
          <h3 className="text-3xl font-bold text-green-600">{stats.active}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">비활성</p>
          <h3 className="text-3xl font-bold text-red-600">{stats.inactive}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">전체</p>
          <h3 className="text-3xl font-bold text-indigo-600">{stats.total}</h3>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {['pending', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status === 'pending' && '승인대기'}
                {status === 'active' && '활성'}
                {status === 'inactive' && '비활성'}
              </button>
            ))}
          </div>

          <div className="relative w-80">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="호텔명, 도시, 사업자명으로 검색"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 호텔 목록 */}
      {filteredHotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">
            {searchTerm ? '검색 결과가 없습니다.' : '호텔이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔 정보</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">위치</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">사업자</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">등급/평점</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">등록일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-lg">{hotel.name}</div>
                    <div className="text-sm text-gray-500">
                      {hotel.amenities?.length || 0}개 편의시설
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{hotel.location?.city}</div>
                    <div className="text-sm text-gray-500">{hotel.location?.district}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="font-semibold">{hotel.owner?.name || '알 수 없음'}</div>
                    <div className="text-sm text-gray-500">{hotel.owner?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(hotel.starRating || 5)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      평점 {hotel.rating?.toFixed(1) || '신규'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(hotel.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(hotel.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(hotel)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="상세보기"
                      >
                        <FaEye size={18} />
                      </button>
                      
                      {hotel.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(hotel._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center text-sm"
                          >
                            <FaCheck className="mr-1" /> 승인
                          </button>
                          <button
                            onClick={() => handleReject(hotel._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center text-sm"
                          >
                            <FaTimes className="mr-1" /> 거부
                          </button>
                        </>
                      )}

                      {hotel.status === 'inactive' && (
                        <button
                          onClick={() => handleApprove(hotel._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center text-sm"
                        >
                          <FaCheck className="mr-1" /> 활성화
                        </button>
                      )}

                      {hotel.status === 'active' && (
                        <button
                          onClick={() => handleReject(hotel._id)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center text-sm"
                        >
                          <FaTimes className="mr-1" /> 비활성
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        className="text-red-600 hover:text-red-700"
                        title="삭제"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 호텔 상세 모달 */}
      {showDetailModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">호텔 상세 정보</h2>
              <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">호텔명</p>
                      <p className="font-semibold text-lg">{selectedHotel.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">상태</p>
                      {getStatusBadge(selectedHotel.status)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">설명</p>
                    <p className="text-gray-700">{selectedHotel.description || '설명 없음'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">등급</p>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(selectedHotel.starRating || 5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">평점</p>
                      <p className="font-semibold">{selectedHotel.rating?.toFixed(1) || '신규'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 위치 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">위치 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">도시:</span> <span className="font-semibold">{selectedHotel.location?.city}</span></p>
                  <p><span className="text-gray-600">지역:</span> <span className="font-semibold">{selectedHotel.location?.district}</span></p>
                  <p><span className="text-gray-600">주소:</span> <span className="font-semibold">{selectedHotel.location?.address}</span></p>
                  <p><span className="text-gray-600">우편번호:</span> <span className="font-semibold">{selectedHotel.location?.zipCode}</span></p>
                </div>
              </div>

              {/* 사업자 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">사업자 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">이름:</span> <span className="font-semibold">{selectedHotel.owner?.name || '알 수 없음'}</span></p>
                  <p><span className="text-gray-600">이메일:</span> <span className="font-semibold">{selectedHotel.owner?.email}</span></p>
                  <p><span className="text-gray-600">전화번호:</span> <span className="font-semibold">{selectedHotel.owner?.phone || '미등록'}</span></p>
                </div>
              </div>

              {/* 편의시설 */}
              {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">편의시설</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-white rounded-full text-sm border">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 정책 */}
              {selectedHotel.policies && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">호텔 정책</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">체크인/체크아웃</p>
                      <p className="text-gray-600">
                        체크인: {selectedHotel.checkInTime} / 체크아웃: {selectedHotel.checkOutTime}
                      </p>
                    </div>
                    {selectedHotel.policies.cancellation && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">취소 정책</p>
                        <p className="text-gray-600">{selectedHotel.policies.cancellation}</p>
                      </div>
                    )}
                    {selectedHotel.policies.children && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">어린이 정책</p>
                        <p className="text-gray-600">{selectedHotel.policies.children}</p>
                      </div>
                    )}
                    {selectedHotel.policies.pets && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">반려동물 정책</p>
                        <p className="text-gray-600">{selectedHotel.policies.pets}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 작업 버튼 */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                {selectedHotel.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedHotel._id)}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                      <FaCheck className="mr-2" /> 승인하기
                    </button>
                    <button
                      onClick={() => handleReject(selectedHotel._id)}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                    >
                      <FaTimes className="mr-2" /> 거부하기
                    </button>
                  </>
                )}

                {selectedHotel.status === 'inactive' && (
                  <button
                    onClick={() => handleApprove(selectedHotel._id)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <FaCheck className="mr-2" /> 활성화하기
                  </button>
                )}

                {selectedHotel.status === 'active' && (
                  <button
                    onClick={() => handleReject(selectedHotel._id)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                  >
                    <FaTimes className="mr-2" /> 비활성화하기
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selectedHotel._id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <FaTrash className="mr-2" /> 삭제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

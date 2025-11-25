import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaCheck, FaTimes, FaEye, FaStar, FaTrash, FaSearch } from 'react-icons/fa';

export default function ReportedReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('reported'); // 'reported' or 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadReviews();
  }, [viewMode, filterStatus]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      
      const endpoint = viewMode === 'reported' ? '/admin/reviews/reported' : '/admin/reviews/all';
      const response = await api.get(endpoint, { params });
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      alert('리뷰를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadReviews();
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedReview(null);
  };

  const handleApprove = async (reviewId) => {
    if (!confirm('이 신고를 승인하고 리뷰를 숨기시겠습니까?')) return;

    try {
      await api.put(`/admin/reviews/${reviewId}/approve`);
      alert('리뷰가 숨김 처리되었습니다.');
      loadReviews();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to approve report:', error);
      alert('리뷰 숨김 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (reviewId) => {
    if (!confirm('이 신고를 거부하시겠습니까?')) return;

    try {
      await api.put(`/admin/reviews/${reviewId}/reject`);
      alert('신고가 거부되었습니다.');
      loadReviews();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to reject report:', error);
      alert('신고 거부 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('이 리뷰를 완전히 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) return;

    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      alert('리뷰가 삭제되었습니다.');
      loadReviews();
      if (showDetailModal) handleCloseDetail();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">리뷰 관리</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('reported')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'reported'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            신고된 리뷰
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            전체 리뷰
          </button>
        </div>
      </div>

      {/* 검색 및 필터 */}
      {viewMode === 'all' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="호텔명 또는 리뷰 내용으로 검색..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            <div className="col-span-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">전체 상태</option>
                <option value="active">활성</option>
                <option value="hidden">숨김</option>
              </select>
            </div>

            <div className="col-span-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  loadReviews();
                }}
                className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                필터 초기화
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">
            {viewMode === 'reported' ? '신고 대기' : '총 리뷰 수'}
          </p>
          <h3 className="text-3xl font-bold text-yellow-600">{reviews.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">
            {viewMode === 'reported' ? '오늘 신고' : '오늘 작성'}
          </p>
          <h3 className="text-3xl font-bold text-red-600">
            {reviews.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length}
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">
            {viewMode === 'reported' ? '처리 필요' : '활성 리뷰'}
          </p>
          <h3 className="text-3xl font-bold text-indigo-600">
            {viewMode === 'reported' 
              ? reviews.filter(r => r.reportStatus === 'pending').length
              : reviews.filter(r => r.status === 'active').length
            }
          </h3>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">
            {viewMode === 'reported' ? '신고된 리뷰가 없습니다.' : '리뷰가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">리뷰 내용</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">호텔</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작성자</th>
                {viewMode === 'reported' && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">신고자</th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작성일</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          size={14}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{review.hotel?.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{review.user?.name}</div>
                    <div className="text-sm text-gray-500">{review.user?.email}</div>
                  </td>
                  {viewMode === 'reported' && (
                    <td className="px-6 py-4">
                      <div className="font-semibold">{review.reportedBy?.name || '익명'}</div>
                      <div className="text-sm text-gray-500">{review.reportReason || '사유 없음'}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      review.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {review.status === 'active' ? '활성' : '숨김'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(review)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="상세보기"
                      >
                        <FaEye size={18} />
                      </button>
                      
                      {viewMode === 'reported' ? (
                        <>
                          <button
                            onClick={() => handleApprove(review._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center text-sm"
                          >
                            <FaCheck className="mr-1" /> 숨김
                          </button>
                          <button
                            onClick={() => handleReject(review._id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center text-sm"
                          >
                            <FaTimes className="mr-1" /> 거부
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="삭제"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 리뷰 상세 모달 */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">리뷰 상세 정보</h2>
              <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 리뷰 내용 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">리뷰 내용</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'}
                        size={20}
                      />
                    ))}
                    <span className="ml-2 font-semibold">{selectedReview.rating}점</span>
                  </div>
                  <p className="text-gray-700">{selectedReview.comment}</p>
                  <p className="text-sm text-gray-500">
                    작성일: {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 호텔 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">호텔 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-lg">{selectedReview.hotel?.name}</p>
                  <p className="text-sm text-gray-600">{selectedReview.hotel?.location?.city}</p>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">작성자 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">이름:</span> <span className="font-semibold">{selectedReview.user?.name}</span></p>
                  <p><span className="text-gray-600">이메일:</span> <span className="font-semibold">{selectedReview.user?.email}</span></p>
                </div>
              </div>

              {/* 신고 정보 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">신고 정보</h3>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">신고자:</span> <span className="font-semibold">{selectedReview.reportedBy?.name || '익명'}</span></p>
                  <p><span className="text-gray-600">신고 사유:</span> <span className="font-semibold">{selectedReview.reportReason || '사유 없음'}</span></p>
                  <p><span className="text-gray-600">신고일:</span> <span className="font-semibold">{new Date(selectedReview.createdAt).toLocaleString()}</span></p>
                </div>
              </div>

              {/* 작업 버튼 */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => handleApprove(selectedReview._id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                >
                  <FaCheck className="mr-2" /> 리뷰 숨기기
                </button>
                <button
                  onClick={() => handleReject(selectedReview._id)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                >
                  <FaTimes className="mr-2" /> 신고 거부
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPercent, FaDollarSign } from 'react-icons/fa';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    hotel: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [couponsRes, hotelsRes] = await Promise.all([
        axios.get('/business/coupons'),
        axios.get('/business/hotels')
      ]);
      setCoupons(couponsRes.data);
      setHotels(hotelsRes.data.filter(h => h.status === 'approved'));
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCoupon) {
        await axios.put(`/business/coupons/${editingCoupon._id}`, formData);
        alert('쿠폰이 수정되었습니다.');
      } else {
        await axios.post('/business/coupons', formData);
        alert('쿠폰이 생성되었습니다.');
      }
      
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('쿠폰 저장 실패:', error);
      alert(error.response?.data?.message || '쿠폰 저장에 실패했습니다.');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
      validTo: coupon.validTo ? new Date(coupon.validTo).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      hotel: coupon.hotel?._id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('쿠폰을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/business/coupons/${id}`);
      alert('쿠폰이 삭제되었습니다.');
      fetchData();
    } catch (error) {
      console.error('쿠폰 삭제 실패:', error);
      alert('쿠폰 삭제에 실패했습니다.');
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`/business/coupons/${id}/toggle`);
      fetchData();
    } catch (error) {
      console.error('쿠폰 상태 변경 실패:', error);
      alert('쿠폰 상태 변경에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      validFrom: '',
      validTo: '',
      usageLimit: '',
      hotel: ''
    });
    setEditingCoupon(null);
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validTo = new Date(coupon.validTo);
    
    if (coupon.status === 'inactive') {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">비활성</span>;
    }
    if (validTo < now) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">만료</span>;
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">소진</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">활성</span>;
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">쿠폰 관리</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaPlus />
          <span>쿠폰 생성</span>
        </button>
      </div>

      {/* 쿠폰 목록 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">쿠폰 코드</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">쿠폰명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">호텔</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">할인</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유효기간</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사용</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  등록된 쿠폰이 없습니다.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-indigo-600">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{coupon.name}</div>
                      {coupon.description && (
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{coupon.hotel?.name || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {coupon.discountType === 'percentage' ? (
                        <>
                          <FaPercent className="text-green-600" />
                          <span>{coupon.discountValue}%</span>
                        </>
                      ) : (
                        <>
                          <span className="text-blue-600">₩</span>
                          <span>{coupon.discountValue.toLocaleString()}원</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{new Date(coupon.validFrom).toLocaleDateString()}</div>
                    <div className="text-gray-500">~ {new Date(coupon.validTo).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(coupon)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggle(coupon._id)}
                        className="text-gray-600 hover:text-indigo-600"
                        title={coupon.status === 'active' ? '비활성화' : '활성화'}
                      >
                        {coupon.status === 'active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </button>
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-gray-600 hover:text-blue-600"
                        title="수정"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-gray-600 hover:text-red-600"
                        title="삭제"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 쿠폰 생성/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingCoupon ? '쿠폰 수정' : '쿠폰 생성'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 호텔 선택 */}
                <div>
                  <label className="block text-sm font-medium mb-2">호텔 *</label>
                  <select
                    value={formData.hotel}
                    onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                    disabled={editingCoupon}
                  >
                    <option value="">호텔 선택</option>
                    {hotels.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 쿠폰 코드 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">쿠폰 코드 *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border rounded-lg font-mono"
                      placeholder="SUMMER2025"
                      required
                      disabled={editingCoupon}
                    />
                  </div>

                  {/* 쿠폰명 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">쿠폰명 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="여름 특가 할인"
                      required
                    />
                  </div>
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium mb-2">설명</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="2"
                    placeholder="쿠폰 설명..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 할인 타입 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">할인 타입 *</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    >
                      <option value="percentage">퍼센트 (%)</option>
                      <option value="fixed">고정 금액 (원)</option>
                    </select>
                  </div>

                  {/* 할인 값 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      할인 값 * ({formData.discountType === 'percentage' ? '%' : '원'})
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="1"
                      max={formData.discountType === 'percentage' ? '100' : undefined}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 최소 구매 금액 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">최소 구매 금액 (원)</label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>

                  {/* 최대 할인 금액 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">최대 할인 금액 (원)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 유효 시작일 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">유효 시작일 *</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  {/* 유효 종료일 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">유효 종료일 *</label>
                    <input
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* 사용 제한 */}
                <div>
                  <label className="block text-sm font-medium mb-2">사용 제한 (회)</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    min="1"
                    placeholder="999"
                  />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingCoupon ? '수정' : '생성'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

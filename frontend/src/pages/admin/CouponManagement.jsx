import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaTicketAlt } from 'react-icons/fa';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      alert('쿠폰 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase || 0,
        maxDiscount: coupon.maxDiscount || 0,
        usageLimit: coupon.usageLimit || 0,
        validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        isActive: coupon.isActive !== false
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minPurchase: 0,
        maxDiscount: 0,
        usageLimit: 0,
        validFrom: '',
        validUntil: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              ['discountValue', 'minPurchase', 'maxDiscount', 'usageLimit'].includes(name) 
              ? parseFloat(value) || 0 
              : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.name || formData.discountValue <= 0) {
      alert('쿠폰 코드, 이름, 할인값은 필수입니다.');
      return;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      alert('할인율은 100%를 초과할 수 없습니다.');
      return;
    }

    try {
      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon._id}`, formData);
        alert('쿠폰이 수정되었습니다.');
      } else {
        await api.post('/coupons', formData);
        alert('새 쿠폰이 생성되었습니다.');
      }
      handleCloseModal();
      loadCoupons();
    } catch (error) {
      console.error('Failed to save coupon:', error);
      alert(error.response?.data?.message || '쿠폰 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/coupons/${id}`);
      alert('쿠폰이 삭제되었습니다.');
      loadCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      alert('쿠폰 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await api.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      loadCoupons();
    } catch (error) {
      console.error('Failed to toggle coupon:', error);
      alert('쿠폰 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% 할인`;
    } else {
      return `₩${coupon.discountValue.toLocaleString()} 할인`;
    }
  };

  const isExpired = (coupon) => {
    if (!coupon.validUntil) return false;
    return new Date(coupon.validUntil) < new Date();
  };

  const activeCoupons = coupons.filter(c => c.isActive && !isExpired(c));
  const inactiveCoupons = coupons.filter(c => !c.isActive || isExpired(c));

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
        <h1 className="text-3xl font-bold">쿠폰 관리</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>쿠폰 생성</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">전체 쿠폰</p>
          <h3 className="text-3xl font-bold text-indigo-600">{coupons.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">활성 쿠폰</p>
          <h3 className="text-3xl font-bold text-green-600">{activeCoupons.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">비활성 쿠폰</p>
          <h3 className="text-3xl font-bold text-gray-600">{inactiveCoupons.length}</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm mb-1">총 사용 횟수</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
          </h3>
        </div>
      </div>

      {/* 쿠폰 목록 */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FaTicketAlt className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">등록된 쿠폰이 없습니다.</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            첫 쿠폰 만들기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                isExpired(coupon) ? 'border-gray-300 opacity-60' :
                coupon.isActive ? 'border-indigo-500' : 'border-gray-300'
              }`}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <FaTicketAlt size={24} />
                  {isExpired(coupon) ? (
                    <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-semibold">
                      만료됨
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      coupon.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`}>
                      {coupon.isActive ? '활성' : '비활성'}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1">{getDiscountText(coupon)}</h3>
                <p className="text-sm opacity-90">{coupon.name}</p>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">쿠폰 코드</p>
                  <p className="font-mono font-bold text-lg">{coupon.code}</p>
                </div>

                {coupon.description && (
                  <div>
                    <p className="text-sm text-gray-600">설명</p>
                    <p className="text-sm">{coupon.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {coupon.minPurchase > 0 && (
                    <div>
                      <p className="text-gray-600">최소 구매</p>
                      <p className="font-semibold">₩{coupon.minPurchase.toLocaleString()}</p>
                    </div>
                  )}
                  {coupon.maxDiscount > 0 && coupon.discountType === 'percentage' && (
                    <div>
                      <p className="text-gray-600">최대 할인</p>
                      <p className="font-semibold">₩{coupon.maxDiscount.toLocaleString()}</p>
                    </div>
                  )}
                  {coupon.usageLimit > 0 && (
                    <div>
                      <p className="text-gray-600">사용 제한</p>
                      <p className="font-semibold">
                        {coupon.usedCount || 0} / {coupon.usageLimit}
                      </p>
                    </div>
                  )}
                </div>

                {(coupon.validFrom || coupon.validUntil) && (
                  <div className="text-sm">
                    <p className="text-gray-600">유효 기간</p>
                    <p className="font-semibold">
                      {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : '무제한'} ~ {' '}
                      {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : '무제한'}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coupon.isActive}
                      onChange={() => handleToggleActive(coupon)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                      disabled={isExpired(coupon)}
                    />
                    <span className="ml-2 text-sm">활성화</span>
                  </label>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(coupon)}
                      className="text-indigo-600 hover:text-indigo-700"
                      title="수정"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:text-red-700"
                      title="삭제"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 쿠폰 생성/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingCoupon ? '쿠폰 수정' : '새 쿠폰 생성'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      쿠폰 코드 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 uppercase"
                      placeholder="WELCOME2024"
                      required
                      disabled={!!editingCoupon}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      쿠폰 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="신규 가입 환영 쿠폰"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="쿠폰에 대한 설명을 입력하세요"
                  />
                </div>
              </div>

              {/* 할인 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">할인 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      할인 타입 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="percentage">퍼센트(%)</option>
                      <option value="fixed">정액(원)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      할인값 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step={formData.discountType === 'percentage' ? '1' : '1000'}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최소 구매 금액
                    </label>
                    <input
                      type="number"
                      name="minPurchase"
                      value={formData.minPurchase}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="1000"
                      placeholder="0"
                    />
                  </div>

                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        최대 할인 금액
                      </label>
                      <input
                        type="number"
                        name="maxDiscount"
                        value={formData.maxDiscount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        step="1000"
                        placeholder="0 (무제한)"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 사용 조건 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">사용 조건</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용 제한 횟수
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    placeholder="0 (무제한)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      유효 시작일
                    </label>
                    <input
                      type="date"
                      name="validFrom"
                      value={formData.validFrom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      유효 종료일
                    </label>
                    <input
                      type="date"
                      name="validUntil"
                      value={formData.validUntil}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium">쿠폰 활성화</span>
                  </label>
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
                  {editingCoupon ? '수정하기' : '생성하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

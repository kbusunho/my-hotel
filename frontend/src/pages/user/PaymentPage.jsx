import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import api from '../../api/axios';
import { FaCreditCard, FaBarcode, FaTicketAlt } from 'react-icons/fa';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [bestCoupon, setBestCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    loadBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (booking && booking.totalPrice) {
      calculateBestCoupon();
    }
  }, [booking]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Failed to load booking:', error);
      alert('예약 정보를 불러올 수 없습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateBestCoupon = async () => {
    try {
      const response = await api.post('/coupons/calculate-best', {
        totalPrice: booking.totalPrice,
        hotelId: booking.hotel?._id
      });
      
      if (response.data.bestCoupon) {
        setBestCoupon(response.data);
      }
    } catch (error) {
      console.error('Failed to calculate best coupon:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!bestCoupon || applyingCoupon) return;

    setApplyingCoupon(true);
    try {
      // 쿠폰 적용 로직
      const newFinalPrice = booking.totalPrice - bestCoupon.discount;
      setBooking({
        ...booking,
        discountAmount: bestCoupon.discount,
        finalPrice: newFinalPrice,
        usedCoupons: [bestCoupon.bestCoupon._id]
      });
      alert(`${bestCoupon.bestCoupon.name} 쿠폰이 적용되었습니다!`);
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      alert('쿠폰 적용 중 오류가 발생했습니다.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) {
      alert('예약 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);

      const hotelName = booking.hotel?.name || '호텔';
      const roomName = booking.room?.name || '객실';
      const userName = booking.user?.name || '고객';

      await tossPayments.requestPayment(paymentMethod, {
        amount: booking.finalPrice,
        orderId: booking.tossOrderId || `ORDER_${booking._id}`,
        orderName: `${hotelName} - ${roomName}`,
        customerName: userName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('결제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">결제하기</h1>

      <div className="grid grid-cols-12 gap-8">
        {/* Payment Method */}
        <div className="col-span-8">
          {/* 쿠폰 자동 추천 */}
          {bestCoupon && bestCoupon.bestCoupon && !booking.usedCoupons?.length && (
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <FaTicketAlt className="text-3xl mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">🎉 최적의 쿠폰을 찾았어요!</h3>
                    <p className="text-lg mb-1">{bestCoupon.bestCoupon.name}</p>
                    <p className="text-sm opacity-90 mb-3">{bestCoupon.bestCoupon.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                        <p className="text-xs opacity-80">할인 금액</p>
                        <p className="text-2xl font-bold">₩{bestCoupon.discount.toLocaleString()}</p>
                      </div>
                      <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                        <p className="text-xs opacity-80">최종 금액</p>
                        <p className="text-2xl font-bold">₩{bestCoupon.finalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50"
                >
                  {applyingCoupon ? '적용 중...' : '쿠폰 적용'}
                </button>
              </div>
            </div>
          )}

          {booking.usedCoupons?.length > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FaTicketAlt className="text-green-600 text-2xl mr-3" />
                <div>
                  <p className="font-semibold text-green-800">쿠폰이 적용되었습니다!</p>
                  <p className="text-sm text-green-600">₩{booking.discountAmount?.toLocaleString()} 할인</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">결제 수단 선택</h2>

            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-sage-500 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <FaCreditCard className="text-2xl text-gray-600 mr-3" />
                <div>
                  <div className="font-semibold">신용/체크카드</div>
                  <div className="text-sm text-gray-600">일반 카드 결제</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-sage-500 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="virtualAccount"
                  checked={paymentMethod === 'virtualAccount'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4"
                />
                <FaBarcode className="text-2xl text-gray-600 mr-3" />
                <div>
                  <div className="font-semibold">가상계좌</div>
                  <div className="text-sm text-gray-600">계좌이체</div>
                </div>
              </label>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">예약 정보</h2>

            <div className="flex mb-6">
              <img
                src={booking?.hotel?.images?.[0] || '/placeholder-hotel.jpg'}
                alt={booking?.hotel?.name || '호텔'}
                className="w-32 h-24 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h3 className="font-bold text-lg">{booking?.hotel?.name || '호텔 정보 없음'}</h3>
                <p className="text-gray-600">{booking?.room?.name || '객실 정보 없음'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''} - {booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''}
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!booking || !booking.finalPrice}
              className="w-full py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              ₩{booking?.finalPrice?.toLocaleString() || 0} 결제하기
            </button>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="col-span-4">
          <div className="bg-sage-50 rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-6">결제 내역</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">객실 요금</span>
                <span>₩{booking?.totalPrice?.toLocaleString() || 0}</span>
              </div>
              {(booking?.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>할인</span>
                  <span>-₩{booking.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">세금 및 수수료</span>
                <span>₩0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-sage-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">총 결제 금액</span>
                <span className="text-2xl font-bold text-sage-600">
                  ₩{booking?.finalPrice?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg text-sm">
              <h4 className="font-semibold mb-2">결제 안내</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 결제는 Toss Payments를 통해 안전하게 처리됩니다</li>
                <li>• 예약 확정 후 이메일로 예약 확인서가 발송됩니다</li>
                <li>• 체크인 24시간 전까지 무료 취소 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

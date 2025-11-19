import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import api from '../../api/axios';
import { FaCreditCard, FaBarcode } from 'react-icons/fa';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

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

  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);

      await tossPayments.requestPayment(paymentMethod, {
        amount: booking.finalPrice,
        orderId: booking.tossOrderId,
        orderName: `${booking.hotel.name} - ${booking.room.name}`,
        customerName: booking.user.name,
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
                src={booking?.hotel.images?.[0] || '/placeholder-hotel.jpg'}
                alt={booking?.hotel.name}
                className="w-32 h-24 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h3 className="font-bold text-lg">{booking?.hotel.name}</h3>
                <p className="text-gray-600">{booking?.room.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(booking?.checkIn).toLocaleDateString()} - {new Date(booking?.checkOut).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 font-semibold text-lg"
            >
              ₩{booking?.finalPrice.toLocaleString()} 결제하기
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
                <span>₩{booking?.totalPrice.toLocaleString()}</span>
              </div>
              {booking?.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>할인</span>
                  <span>-₩{booking?.discountAmount.toLocaleString()}</span>
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
                  ₩{booking?.finalPrice.toLocaleString()}
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

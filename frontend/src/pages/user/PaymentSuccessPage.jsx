import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { FaCheckCircle, FaHotel } from 'react-icons/fa';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    confirmPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmPayment = async () => {
    try {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        throw new Error('결제 정보가 올바르지 않습니다.');
      }

      // 결제 승인 요청
      const response = await api.post('/payments/confirm', {
        paymentKey,
        orderId,
        amount: parseInt(amount)
      });

      if (response.data.success) {
        // 예약 정보 조회
        const bookingResponse = await api.get('/bookings/my');
        const confirmedBooking = bookingResponse.data.find(
          b => b.tossOrderId === orderId
        );
        setBooking(confirmedBooking);
      } else {
        throw new Error('결제 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto mb-4"></div>
          <p className="text-gray-600">결제를 처리하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h1 className="text-2xl font-bold mb-4">결제 처리 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="px-6 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">예약이 완료되었습니다!</h1>
          <p className="text-gray-600">
            예약 확인서가 이메일로 전송되었습니다.
          </p>
        </div>

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center mb-6 pb-6 border-b">
              <FaHotel className="text-3xl text-sage-600 mr-4" />
              <div>
                <h2 className="text-xl font-bold">{booking.hotel?.name}</h2>
                <p className="text-gray-600">{booking.room?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">예약번호</div>
                <div className="font-semibold">{booking._id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">예약자명</div>
                <div className="font-semibold">{booking.user?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">체크인</div>
                <div className="font-semibold">
                  {new Date(booking.checkIn).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">체크아웃</div>
                <div className="font-semibold">
                  {new Date(booking.checkOut).toLocaleDateString('ko-KR')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">투숙 인원</div>
                <div className="font-semibold">
                  성인 {booking.guests?.adults}명
                  {booking.guests?.children > 0 && `, 어린이 ${booking.guests.children}명`}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">결제 금액</div>
                <div className="font-semibold text-sage-600 text-xl">
                  ₩{booking.finalPrice?.toLocaleString()}
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="bg-sage-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">특별 요청사항</div>
                <div className="text-gray-700">{booking.specialRequests}</div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/my-bookings"
            className="flex-1 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 text-center font-semibold"
          >
            내 예약 보기
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 bg-white border-2 border-sage-500 text-sage-600 rounded-lg hover:bg-sage-50 text-center font-semibold"
          >
            홈으로
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-3">알림</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 체크인 시 예약 확인서와 신분증을 제시해 주세요.</li>
            <li>• 체크인 24시간 전까지 무료 취소가 가능합니다.</li>
            <li>• 결제 금액의 1%가 포인트로 적립되었습니다.</li>
            <li>• 문의사항은 고객센터(1588-0000)로 연락주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

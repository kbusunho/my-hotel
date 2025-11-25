import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorDescription = (code) => {
    const errors = {
      'PAY_PROCESS_CANCELED': '사용자가 결제를 취소하였습니다.',
      'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
      'REJECT_CARD_PAYMENT': '카드 결제가 거부되었습니다.',
      'REJECT_ACCOUNT_PAYMENT': '계좌 이체가 거부되었습니다.',
      'EXCEED_MAX_CARD_INSTALLMENT_PLAN': '설정 가능한 최대 할부 개월 수를 초과했습니다.',
      'INVALID_CARD_EXPIRATION': '카드 유효기간이 만료되었습니다.',
      'NOT_ENOUGH_BALANCE': '잔액이 부족합니다.',
      'INVALID_CARD_INSTALLMENT_PLAN': '유효하지 않은 할부 개월 수입니다.',
      'EXCEED_MAX_DAILY_PAYMENT_COUNT': '일일 결제 한도를 초과했습니다.',
      'NOT_AVAILABLE_PAYMENT': '결제 가능한 시간이 아닙니다.',
      'UNAUTHORIZED_KEY': '인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.',
      'REJECT_TOSSPAY_INVALID_ACCOUNT': '유효하지 않은 계좌입니다.',
      'EXCEED_MAX_AMOUNT': '거래금액 한도를 초과했습니다.',
      'INVALID_API_KEY': '잘못된 시크릿키 연동 정보 입니다.',
      'INVALID_REJECT_CARD': '카드 사용이 정지되었습니다.',
      'BELOW_MINIMUM_AMOUNT': '결제 가능한 최소 금액보다 적습니다.',
      'INVALID_CARD_NUMBER': '카드번호를 다시 확인해주세요.',
      'INVALID_UNREGISTERED_SUBMALL': '등록되지 않은 서브몰입니다.',
      'NOT_REGISTERED_BUSINESS': '등록되지 않은 사업자 번호입니다.'
    };
    
    return errors[code] || errorMessage || '결제 처리 중 오류가 발생했습니다.';
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gray-900">결제에 실패했습니다</h1>
          <p className="text-gray-600">
            결제 처리 중 문제가 발생했습니다.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-red-900 mb-2">오류 내용</h2>
          <p className="text-red-700">{getErrorDescription(errorCode)}</p>
          {errorCode && (
            <p className="text-sm text-red-600 mt-2">오류 코드: {errorCode}</p>
          )}
        </div>

        {/* Helpful Information */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold mb-3 text-gray-900">결제 실패 시 확인사항</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 카드 정보(카드번호, 유효기간, CVC)를 정확히 입력하셨나요?</li>
            <li>• 카드 한도가 충분한가요?</li>
            <li>• 결제 가능한 카드인가요? (체크카드, 법인카드 등 일부 카드는 사용이 제한될 수 있습니다)</li>
            <li>• 해외 결제가 차단되어 있지는 않나요?</li>
            <li>• 일시적인 네트워크 오류일 수 있으니 잠시 후 다시 시도해주세요.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-2)}
            className="flex-1 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 font-semibold"
          >
            다시 시도
          </button>
          <Link
            to="/"
            className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
          >
            홈으로
          </Link>
        </div>

        {/* Customer Support */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-900">고객 지원</h3>
          <p className="text-sm text-gray-600 mb-3">
            문제가 계속되면 고객센터로 문의해주세요.
          </p>
          <div className="text-sm text-gray-700">
            <p>📞 고객센터: 1588-0000</p>
            <p>📧 이메일: support@hotelhub.com</p>
            <p>⏰ 운영시간: 평일 09:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FaTools, FaExclamationTriangle } from 'react-icons/fa';

export default function MaintenancePage({ message }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-yellow-400 text-white p-6 rounded-full">
                <FaTools className="text-4xl" />
              </div>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            시스템 점검 중
          </h1>

          {/* 메시지 */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {message || '더 나은 서비스 제공을 위해 시스템 점검을 진행하고 있습니다. 잠시 후 다시 시도해주세요.'}
          </p>

          {/* 안내 사항 */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-1">
                  예상 작업 시간
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  점검 시간은 상황에 따라 변경될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 문의 정보 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              긴급 문의사항이 있으신가요?
            </p>
            <a 
              href="mailto:admin@hotelhub.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              admin@hotelhub.com
            </a>
          </div>

          {/* 로딩 애니메이션 */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* 브랜드 로고 */}
        <div className="text-center mt-8">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © 2025 HotelHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

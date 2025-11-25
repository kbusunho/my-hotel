import { Component } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // 에러 로깅 서비스에 전송 (선택사항)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            {/* 아이콘 */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <FaExclamationTriangle className="text-4xl text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              앗! 문제가 발생했어요
            </h1>

            {/* 설명 */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              예상치 못한 오류가 발생했습니다.<br />
              불편을 드려 죄송합니다. 다시 시도해 주세요.
            </p>

            {/* 버튼들 */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <button
                onClick={this.handleReset}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaRedo />
                <span>다시 시도</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <FaHome />
                <span>홈으로</span>
              </button>
            </div>

            {/* 개발 모드에서 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-8">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2">
                  개발자 정보 (클릭하여 펼치기)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto">
                  <p className="text-red-600 dark:text-red-400 font-mono text-sm mb-2">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* 도움말 */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              <p>
                문제가 지속되면{' '}
                <a href="/info/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  고객센터
                </a>
                로 문의해 주세요.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// 간단한 토스트 알림 시스템 (외부 라이브러리 없이 구현)

class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    
    // 토스트 컨테이너 생성
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3000) {
    const id = Date.now();
    const toast = this.createToast(message, type, id);
    
    this.container.appendChild(toast);
    this.toasts.push({ id, element: toast });

    // 애니메이션 시작
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 10);

    // 자동 제거
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  createToast(message, type, id) {
    const toast = document.createElement('div');
    toast.dataset.id = id;
    toast.style.cssText = `
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      color: white;
      font-size: 14px;
      font-weight: 500;
      min-width: 300px;
      max-width: 500px;
      display: flex;
      align-items: center;
      gap: 12px;
      pointer-events: auto;
      transform: translateX(400px);
      opacity: 0;
      transition: all 0.3s ease;
      cursor: pointer;
    `;

    // 타입별 색상 및 아이콘
    const config = {
      success: {
        bg: '#10b981',
        icon: '✓'
      },
      error: {
        bg: '#ef4444',
        icon: '✕'
      },
      warning: {
        bg: '#f59e0b',
        icon: '⚠'
      },
      info: {
        bg: '#3b82f6',
        icon: 'ℹ'
      }
    };

    const { bg, icon } = config[type] || config.info;
    toast.style.backgroundColor = bg;

    toast.innerHTML = `
      <span style="font-size: 18px; font-weight: bold;">${icon}</span>
      <span style="flex: 1;">${message}</span>
      <span style="font-size: 18px; opacity: 0.7; cursor: pointer;">×</span>
    `;

    // 클릭하면 닫기
    toast.addEventListener('click', () => this.remove(id));

    return toast;
  }

  remove(id) {
    const toastData = this.toasts.find(t => t.id === id);
    if (!toastData) return;

    const { element } = toastData;
    
    // 페이드 아웃 애니메이션
    element.style.transform = 'translateX(400px)';
    element.style.opacity = '0';

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 300);
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// 싱글톤 인스턴스
const toast = new ToastManager();

export default toast;

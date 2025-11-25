import { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ImageGalleryModal({ images, isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || !images || images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
      >
        <FaTimes className="text-3xl" />
      </button>

      {/* 이전 버튼 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50 p-4"
      >
        <FaChevronLeft className="text-4xl" />
      </button>

      {/* 메인 이미지 */}
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center px-20">
        <img
          src={images[currentIndex]}
          alt={`Gallery ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
        
        {/* 이미지 카운터 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={goToNext}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50 p-4"
      >
        <FaChevronRight className="text-4xl" />
      </button>

      {/* 썸네일 네비게이션 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-4xl overflow-x-auto px-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? 'border-white scale-110'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

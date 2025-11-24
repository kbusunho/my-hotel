import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';
import { FaTimes, FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaSpa, FaUtensils, FaCheck, FaTimes as FaNo } from 'react-icons/fa';

export default function CompareHotelsPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold dark:text-white mb-4">호텔 비교</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            비교할 호텔이 없습니다.<br />
            호텔 검색 페이지에서 호텔을 선택해주세요.
          </p>
          <Link 
            to="/search" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            호텔 검색하기
          </Link>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    'WiFi': FaWifi,
    '주차': FaParking,
    '수영장': FaSwimmingPool,
    '헬스장': FaDumbbell,
    '스파': FaSpa,
    '레스토랑': FaUtensils
  };

  const commonAmenities = ['WiFi', '주차', '수영장', '헬스장', '스파', '레스토랑', '조식', '룸서비스', '공항셔틀', '비즈니스센터'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">호텔 비교</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {compareList.length}개 호텔 비교 중 (최대 3개)
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          전체 삭제
        </button>
      </div>

      {/* 비교 테이블 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left font-semibold dark:text-white w-48">비교 항목</th>
                {compareList.map((hotel) => (
                  <th key={hotel._id} className="px-6 py-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(hotel._id)}
                        className="absolute top-0 right-0 p-2 text-red-600 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                      <div className="mb-2">
                        <img
                          src={hotel.images?.[0] || '/placeholder.jpg'}
                          alt={hotel.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {hotel.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 위치 */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 font-semibold dark:text-white">
                  <FaMapMarkerAlt className="inline mr-2" />
                  위치
                </td>
                {compareList.map((hotel) => (
                  <td key={hotel._id} className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                    {hotel.location?.city || hotel.city}
                  </td>
                ))}
              </tr>

              {/* 평점 */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 font-semibold dark:text-white">
                  <FaStar className="inline mr-2 text-yellow-500" />
                  평점
                </td>
                {compareList.map((hotel) => (
                  <td key={hotel._id} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <FaStar className="text-yellow-500" />
                      <span className="font-bold dark:text-white">{hotel.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 가격 */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 font-semibold dark:text-white">최저 가격</td>
                {compareList.map((hotel) => (
                  <td key={hotel._id} className="px-6 py-4 text-center">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      ₩{hotel.minPrice?.toLocaleString() || hotel.price?.toLocaleString() || 'N/A'}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400">/ 박</div>
                  </td>
                ))}
              </tr>

              {/* 호텔 타입 */}
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 font-semibold dark:text-white">호텔 타입</td>
                {compareList.map((hotel) => (
                  <td key={hotel._id} className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                      {hotel.hotelType || 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* 편의시설 */}
              {commonAmenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || FaCheck;
                return (
                  <tr key={amenity} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 font-semibold dark:text-white">
                      <Icon className="inline mr-2" />
                      {amenity}
                    </td>
                    {compareList.map((hotel) => {
                      const hasAmenity = hotel.amenities?.includes(amenity);
                      return (
                        <td key={hotel._id} className="px-6 py-4 text-center">
                          {hasAmenity ? (
                            <FaCheck className="text-green-600 dark:text-green-400 text-xl mx-auto" />
                          ) : (
                            <FaNo className="text-red-600 dark:text-red-400 text-xl mx-auto opacity-30" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* 예약 버튼 */}
              <tr>
                <td className="px-6 py-4 font-semibold dark:text-white"></td>
                {compareList.map((hotel) => (
                  <td key={hotel._id} className="px-6 py-4 text-center">
                    <Link
                      to={`/hotels/${hotel._id}`}
                      className="inline-block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      자세히 보기
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 추가 팁 */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 비교 팁</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• 가격은 기본 1박 기준이며, 객실 타입에 따라 달라질 수 있습니다.</li>
          <li>• 평점은 실제 투숙객들의 평균 평가입니다.</li>
          <li>• 편의시설은 호텔마다 제공 범위가 다를 수 있으니 상세 페이지를 확인하세요.</li>
        </ul>
      </div>
    </div>
  );
}

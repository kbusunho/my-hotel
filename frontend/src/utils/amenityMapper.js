import { FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaUtensils, FaSpa, FaGlassWhiskey, FaCoffee, FaDog, FaBaby, FaShuttleVan, FaBriefcase, FaFire, FaTint, FaFlag, FaSnowflake, FaBook, FaTv, FaBed, FaWind, FaBath, FaCocktail, FaWineGlass, FaMusic, FaBicycle, FaTshirt, FaCamera, FaTree, FaSun, FaUmbrellaBeach } from 'react-icons/fa';

// 편의시설 아이콘 및 라벨 매핑
export const amenityMap = {
  'WiFi': { icon: FaWifi, label: '무료 WiFi', emoji: '📶' },
  '주차': { icon: FaParking, label: '무료 주차', emoji: '🅿️' },
  '수영장': { icon: FaSwimmingPool, label: '수영장', emoji: '🏊' },
  '피트니스': { icon: FaDumbbell, label: '피트니스', emoji: '💪' },
  '레스토랑': { icon: FaUtensils, label: '레스토랑', emoji: '🍽️' },
  '스파': { icon: FaSpa, label: '스파', emoji: '💆' },
  '바': { icon: FaGlassWhiskey, label: '바/라운지', emoji: '🍸' },
  '조식': { icon: FaCoffee, label: '조식 포함', emoji: '🍳' },
  '반려동물': { icon: FaDog, label: '반려동물 동반', emoji: '🐕' },
  '키즈클럽': { icon: FaBaby, label: '키즈클럽', emoji: '👶' },
  '공항셔틀': { icon: FaShuttleVan, label: '공항 셔틀', emoji: '🚐' },
  '비즈니스': { icon: FaBriefcase, label: '비즈니스 센터', emoji: '💼' },
  '온천': { icon: FaTint, label: '온천', emoji: '♨️' },
  '골프장': { icon: FaFlag, label: '골프장', emoji: '⛳' },
  '바비큐': { icon: FaFire, label: '바비큐', emoji: '🔥' },
  '에어컨': { icon: FaSnowflake, label: '에어컨', emoji: '❄️' },
  '미니바': { icon: FaCocktail, label: '미니바', emoji: '🍷' },
  'TV': { icon: FaTv, label: 'TV', emoji: '📺' },
  '금고': { icon: FaBriefcase, label: '금고', emoji: '🔒' },
  '헤어드라이어': { icon: FaWind, label: '헤어드라이어', emoji: '💨' },
  '소파': { icon: FaBed, label: '소파', emoji: '🛋️' },
  '책상': { icon: FaBook, label: '업무용 책상', emoji: '📝' },
  '욕조': { icon: FaBath, label: '욕조', emoji: '🛁' },
  '거실': { icon: FaBed, label: '거실', emoji: '🛋️' },
  '발코니': { icon: FaTree, label: '발코니', emoji: '🌳' },
  '테라스': { icon: FaSun, label: '테라스', emoji: '☀️' },
  '한옥': { icon: FaTree, label: '한옥', emoji: '🏛️' },
  '전통차': { icon: FaCoffee, label: '전통차', emoji: '🍵' },
  '한복체험': { icon: FaTshirt, label: '한복체험', emoji: '👘' },
  '명상센터': { icon: FaSpa, label: '명상센터', emoji: '🧘' },
  '루프탑': { icon: FaSun, label: '루프탑', emoji: '🌆' },
  '북카페': { icon: FaBook, label: '북카페', emoji: '📚' },
  '사우나': { icon: FaSpa, label: '사우나', emoji: '🧖' },
  '전용수영장': { icon: FaSwimmingPool, label: '전용수영장', emoji: '🏊' },
  '야외테라스': { icon: FaUmbrellaBeach, label: '야외테라스', emoji: '⛱️' },
  '주방': { icon: FaUtensils, label: '주방', emoji: '🍳' },
  '와인냉장고': { icon: FaWineGlass, label: '와인냉장고', emoji: '🍷' },
  '네스프레소': { icon: FaCoffee, label: '네스프레소', emoji: '☕' },
  '아로마테라피': { icon: FaSpa, label: '아로마테라피', emoji: '🌸' },
  '대형 업무용 책상': { icon: FaBook, label: '대형 업무용 책상', emoji: '💼' },
  '프린터': { icon: FaBriefcase, label: '프린터', emoji: '🖨️' },
  '팩스': { icon: FaBriefcase, label: '팩스', emoji: '📠' },
  '회의공간': { icon: FaBriefcase, label: '회의공간', emoji: '👔' },
  '자전거대여': { icon: FaBicycle, label: '자전거대여', emoji: '🚲' }
};

// 편의시설 이름으로 아이콘과 라벨 가져오기
export const getAmenityInfo = (amenity) => {
  return amenityMap[amenity] || { icon: FaWifi, label: amenity, emoji: '✨' };
};

// 편의시설 배열을 아이콘과 라벨로 변환
export const mapAmenities = (amenities) => {
  if (!amenities || !Array.isArray(amenities)) return [];
  return amenities.map(amenity => ({
    ...getAmenityInfo(amenity),
    name: amenity
  }));
};

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { FaSearch, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

// 배경 이미지 배열 (고급 호텔 이미지)
const heroBackgrounds = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80'
];

export default function HomePage() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  useEffect(() => {
    loadFeaturedHotels();
    
    // 배경 이미지 자동 전환 (5초마다)
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
    }, 5000);

    return () => clearInterval(bgInterval);
  }, []);

  const loadFeaturedHotels = async () => {
    try {
      const response = await api.get('/hotels/featured/list');
      setFeaturedHotels(response.data);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      setFeaturedHotels([]);
    }
  };

  return (
    <div>
      {/* Hero Section with Background Slider */}
      <section className="relative h-[500px] text-white overflow-hidden">
        {/* Background Images with Fade Transition */}
        {heroBackgrounds.map((bg, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: currentBgIndex === index ? 1 : 0,
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroBackgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBgIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentBgIndex === index 
                  ? 'bg-white w-8' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
          <h1 className="text-5xl font-bold mb-4">
            부산스 호텔 리 다이하겠<br />
            숙소를 확인하세요
          </h1>
          <p className="text-xl mb-8">오프라인 셀프 체크인을 통해 보다 편리하게 24시 체크인 가능</p>
          
          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <label className="block text-sm text-gray-600 mb-2 font-medium">Where are you staying?</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="부산광역시, 대한민국"
                    value={searchData.city}
                    onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm text-gray-600 mb-2 font-medium">Check In</label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  placeholder="년 - 월 - 일"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm text-gray-600 mb-2 font-medium">Check Out</label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  placeholder="년 - 월 - 일"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-2 font-medium">2 Adults / 0 Children / 1 Room</label>
                <Link
                  to={`/search?city=${searchData.city}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}`}
                  className="w-full px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 inline-flex items-center justify-center font-medium transition-colors"
                >
                  <FaSearch className="mr-2" />
                  검색
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">여행지 베스트</h2>
          <Link to="/search" className="text-sage-600 hover:text-sage-700">See All</Link>
        </div>
        
        <p className="text-gray-600 mb-8">
          부산광역시 관광을 여행할 수 신할 수 있는 완벽 상관일 매립니다
        </p>

        <div className="grid grid-cols-4 gap-6">
          {featuredHotels.slice(0, 4).map((hotel) => (
            <Link key={hotel._id} to={`/hotels/${hotel._id}`} className="card group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-sage-500 text-white px-3 py-1 rounded-full text-sm">
                  {hotel.location?.city || '부산'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500">
                    <FaStar />
                    <span className="ml-1 text-gray-700">{hotel.rating?.toFixed(1) || '4.2'}</span>
                  </div>
                  <div className="text-sage-600 font-bold">
                    ₩{(hotel.minPrice || 150000).toLocaleString()}
                  </div>
                </div>
                <button className="w-full mt-3 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200">
                  Book Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Travel Tips Section */}
      <section className="bg-sage-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">여행 더보기</h2>
          
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-5 bg-sage-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">알리가 투어</h3>
              <p className="text-gray-700 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <button className="px-6 py-3 bg-white text-sage-700 rounded-lg hover:bg-gray-50">
                Show Detail
              </button>
            </div>
            
            <div className="col-span-7 grid grid-cols-2 gap-4">
              {featuredHotels.slice(4, 8).map((hotel, idx) => (
                <div key={idx} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <img
                    src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-sage-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">구독 서비스<br />신청해보세요</h2>
            <p className="mb-6">The Travel (여행 뉴스 영문 아침 5:30 매일 고시)</p>
            <p className="mb-6">
              이메일로 보는 가장 여행 기사들 아침마다 이메일로 뉴스를 꿈이 받아보세요.
            </p>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

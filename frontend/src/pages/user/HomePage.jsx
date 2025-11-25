import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaSearch, FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import LazyImage from '../../components/LazyImage';
import { motion } from 'framer-motion';

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
  const { user } = useAuth();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [searchData, setSearchData] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [newsletter, setNewsletter] = useState({
    email: '',
    loading: false,
    message: ''
  });

  useEffect(() => {
    loadFeaturedHotels();
    if (user) {
      loadRecentlyViewed();
    }
    
    // 배경 이미지 자동 전환 (5초마다)
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
    }, 5000);

    return () => clearInterval(bgInterval);
  }, [user]);

  const loadFeaturedHotels = async () => {
    try {
      const response = await api.get('/hotels/featured/list');
      setFeaturedHotels(response.data || []);
    } catch (error) {
      console.error('Failed to load hotels:', error);
      setFeaturedHotels([]);
    }
  };

  const loadRecentlyViewed = async () => {
    try {
      const response = await api.get('/view-history/recent?limit=4');
      setRecentlyViewed(response.data || []);
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
      setRecentlyViewed([]);
    }
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    
    if (!newsletter.email) {
      setNewsletter({ ...newsletter, message: '이메일을 입력해주세요.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletter.email)) {
      setNewsletter({ ...newsletter, message: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }

    setNewsletter({ ...newsletter, loading: true, message: '' });

    try {
      const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
      
      if (subscriptions.includes(newsletter.email)) {
        setNewsletter({ 
          email: newsletter.email,
          loading: false, 
          message: '이미 구독 중인 이메일입니다.' 
        });
        return;
      }

      subscriptions.push(newsletter.email);
      localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));

      setNewsletter({ 
        email: '',
        loading: false, 
        message: '구독이 완료되었습니다! 매일 아침 5:30에 여행 뉴스를 받아보실 수 있습니다.' 
      });

      setTimeout(() => {
        setNewsletter(prev => ({ ...prev, message: '' }));
      }, 3000);
    } catch (error) {
      setNewsletter({ 
        ...newsletter,
        loading: false, 
        message: '구독 중 오류가 발생했습니다.' 
      });
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
            플러스 호텔 및 다양한<br />
            숙소를 확인하세요
          </h1>
          <p className="text-xl mb-8">검색을 통해 요금을 비교하고 무료 취소를 포함한 특가도 확인하세요!</p>
          
          {/* Search Box */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-6xl mx-auto transition-colors">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">Where are you staying?</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="부산광역시, 대한민국"
                    value={searchData.city}
                    onChange={(e) => setSearchData({...searchData, city: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">Check In</label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  placeholder="년 - 월 - 일"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              
              <div className="col-span-3">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">Check Out</label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  placeholder="년 - 월 - 일"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">2 Adults / 0 Children / 1 Room</label>
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
          <h2 className="text-3xl font-bold dark:text-white">여행지 베스트</h2>
          <Link to="/search" className="text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300">See All</Link>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          부산광역시 관광을 여행할 수 신할 수 있는 완벽 상관일 매립니다
        </p>

        <div className="grid grid-cols-4 gap-6">
          {featuredHotels.slice(0, 4).map((hotel, index) => (
            <motion.div
              key={hotel._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link to={`/hotels/${hotel._id}`} className="card group dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-48 overflow-hidden">
                <LazyImage
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* 최근 본 호텔 */}
      {user && recentlyViewed.length > 0 && (
        <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold dark:text-white flex items-center">
                <FaClock className="mr-3 text-sage-600 dark:text-sage-400" />
                최근 본 호텔
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">다시 보고 싶은 호텔을 빠르게 확인하세요</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {recentlyViewed.map((item) => {
              const hotel = item.hotel;
              if (!hotel) return null;
              
              return (
                <Link key={item._id} to={`/hotels/${hotel._id}`} className="card group dark:bg-gray-800 dark:border-gray-700">
                  <div className="relative h-48 overflow-hidden">
                    <LazyImage
                      src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs">
                      {new Date(item.viewedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 dark:text-white">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {hotel.location?.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500">
                        <FaStar />
                        <span className="ml-1 text-gray-700 dark:text-gray-300">{hotel.rating?.toFixed(1) || '4.2'}</span>
                      </div>
                      <div className="text-sage-600 dark:text-sage-400 font-bold">
                        ₩{(hotel.minPrice || 150000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Popular Destinations Section */}
      <section className="bg-sage-50 dark:bg-gray-900 py-16 transition-colors">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold dark:text-white mb-2">인기 여행지</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">많은 분들이 찾는 인기 호텔을 지역별로 만나보세요</p>
          
          <div className="grid grid-cols-12 gap-6">
            {/* 왼쪽 하이라이트 호텔 */}
            <div className="col-span-5 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group transition-colors">
              {featuredHotels[4] && (
                <Link to={`/hotels/${featuredHotels[4]._id}`} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={featuredHotels[4].images?.[0] || '/placeholder-hotel.jpg'}
                      alt={featuredHotels[4].name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      ⭐ 추천 호텔
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold dark:text-white mb-2">{featuredHotels[4].name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      {featuredHotels[4].location?.city} · {featuredHotels[4].location?.district}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500">
                        <FaStar className="mr-1" />
                        <span className="font-bold text-lg dark:text-white">{featuredHotels[4].rating?.toFixed(1) || '4.5'}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">(후기)</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">1박 기준</div>
                        <div className="text-2xl font-bold text-sage-600 dark:text-sage-400">
                          ₩{(featuredHotels[4].minPrice || 180000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
            
            {/* 오른쪽 호텔 그리드 */}
            <div className="col-span-7 grid grid-cols-2 gap-4">
              {featuredHotels.slice(5, 8).map((hotel, idx) => (
                <Link
                  key={hotel._id || idx}
                  to={`/hotels/${hotel._id}`}
                  className="relative h-48 rounded-lg overflow-hidden group cursor-pointer shadow-md"
                >
                  <img
                    src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/80 transition-all">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-bold text-lg mb-1">{hotel.name}</h4>
                      <p className="text-white text-sm opacity-90 mb-2">
                        📍 {hotel.location?.city}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-400">
                          <FaStar className="mr-1 text-sm" />
                          <span className="text-white text-sm font-semibold">
                            {hotel.rating?.toFixed(1) || '4.2'}
                          </span>
                        </div>
                        <div className="text-white font-bold text-sm">
                          {hotel.minPrice ? `₩${hotel.minPrice.toLocaleString()}~` : '가격 문의'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* 4번째 카드 - 더보기 링크 */}
              <Link
                to="/search"
                className="relative h-48 rounded-lg overflow-hidden group cursor-pointer shadow-md bg-sage-600 hover:bg-sage-700 transition-colors"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-5xl mb-4">+</div>
                  <h4 className="font-bold text-xl mb-2">더 많은 호텔 보기</h4>
                  <p className="text-sage-100 text-sm">다양한 숙소를 둘러보세요</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-sage-500 dark:bg-gray-800 text-white py-16 relative overflow-hidden transition-colors">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">구독 서비스 신청해보세요</h2>
            <p className="mb-2 text-sage-100 dark:text-gray-300">The Travel (여행 뉴스 영문 아침 5:30 매일 고시)</p>
            <p className="mb-8 text-sage-50 dark:text-gray-400">
              이메일로 보는 가장 여행 기사들 아침마다 이메일로 뉴스를 꿈이 받아보세요.
            </p>
            
            {newsletter.message && (
              <div className={`mb-4 p-4 rounded-lg ${
                newsletter.message.includes('완료') 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                {newsletter.message}
              </div>
            )}

            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                value={newsletter.email}
                onChange={(e) => setNewsletter({ ...newsletter, email: e.target.value })}
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                disabled={newsletter.loading}
              />
              <button 
                type="submit"
                disabled={newsletter.loading}
                className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {newsletter.loading ? 'Subscribe...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

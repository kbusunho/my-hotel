import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recentSearches';
const MAX_SEARCHES = 10;

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const addSearch = (searchData) => {
    try {
      const newSearch = {
        ...searchData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };

      // 중복 제거 (같은 도시와 날짜)
      const filtered = recentSearches.filter(
        search =>
          !(
            search.city === searchData.city &&
            search.checkIn === searchData.checkIn &&
            search.checkOut === searchData.checkOut
          )
      );

      // 새로운 검색을 맨 앞에 추가
      const updated = [newSearch, ...filtered].slice(0, MAX_SEARCHES);
      
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const removeSearch = (id) => {
    try {
      const updated = recentSearches.filter(search => search.id !== id);
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove search:', error);
    }
  };

  const clearSearches = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear searches:', error);
    }
  };

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches
  };
};

// 최근 검색 표시 컴포넌트
export const RecentSearches = ({ onSelectSearch }) => {
  const { recentSearches, removeSearch, clearSearches } = useRecentSearches();

  if (recentSearches.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">최근 검색</h3>
        <button
          onClick={clearSearches}
          className="text-sm text-red-600 hover:text-red-700"
        >
          전체 삭제
        </button>
      </div>
      <div className="space-y-2">
        {recentSearches.map((search) => (
          <div
            key={search.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onSelectSearch(search)}
          >
            <div className="flex-1">
              <div className="font-medium">{search.city || '전체 지역'}</div>
              <div className="text-sm text-gray-600">
                {search.checkIn && new Date(search.checkIn).toLocaleDateString()} ~{' '}
                {search.checkOut && new Date(search.checkOut).toLocaleDateString()}
                {search.guests && ` · ${search.guests}명`}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSearch(search.id);
              }}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

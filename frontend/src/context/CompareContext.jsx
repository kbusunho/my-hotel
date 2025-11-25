import { createContext, useContext, useState, useEffect } from 'react';
import toast from '../utils/toast';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (hotel) => {
    if (compareList.length >= 3) {
      toast.warning('최대 3개까지만 비교할 수 있습니다.');
      return false;
    }

    if (compareList.find(h => h._id === hotel._id)) {
      toast.info('이미 비교 목록에 있습니다.');
      return false;
    }

    setCompareList([...compareList, hotel]);
    toast.success(`${hotel.name}을(를) 비교 목록에 추가했습니다.`);
    return true;
  };

  const removeFromCompare = (hotelId) => {
    setCompareList(compareList.filter(h => h._id !== hotelId));
    toast.info('비교 목록에서 제거했습니다.');
  };

  const clearCompare = () => {
    setCompareList([]);
    toast.info('비교 목록을 초기화했습니다.');
  };

  const isInCompare = (hotelId) => {
    return compareList.some(h => h._id === hotelId);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      count: compareList.length
    }}>
      {children}
    </CompareContext.Provider>
  );
};

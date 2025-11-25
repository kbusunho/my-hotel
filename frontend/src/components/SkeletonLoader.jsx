// 스켈레톤 로더 컴포넌트

export function HotelCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="relative h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
}

export function HotelGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <HotelCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function HotelDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* 이미지 갤러리 스켈레톤 */}
      <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
      
      {/* 제목 및 정보 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            
            {/* 객실 목록 */}
            <div className="space-y-4 mt-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
          
          {/* 사이드바 */}
          <div className="space-y-4">
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="w-32 space-y-2">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 10, cols = 5 }) {
  return (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {Array.from({ length: cols }).map((_, idx) => (
                <th key={idx} className="px-6 py-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-gray-200 dark:border-gray-700">
                {Array.from({ length: cols }).map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}

export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <DashboardCardSkeleton key={idx} />
      ))}
    </div>
  );
}

// 텍스트 라인 스켈레톤
export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div 
          key={idx} 
          className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
          style={{ width: `${100 - (idx * 10)}%` }}
        ></div>
      ))}
    </div>
  );
}

// 차트 스켈레톤
export function ChartSkeleton({ height = 300 }) {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div 
        className="bg-gray-300 dark:bg-gray-700 rounded"
        style={{ height: `${height}px` }}
      ></div>
    </div>
  );
}

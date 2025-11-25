// 간단한 차트 컴포넌트 (외부 라이브러리 없이 구현)

// 막대 차트
export function BarChart({ data, title, height = 300 }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-8">데이터가 없습니다</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold dark:text-white mb-4">{title}</h3>}
      
      <div className="flex items-end space-x-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 60) : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* 값 표시 */}
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {item.value.toLocaleString()}
              </div>
              
              {/* 막대 */}
              <div 
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                style={{ height: `${barHeight}px` }}
                title={`${item.label}: ${item.value.toLocaleString()}`}
              ></div>
              
              {/* 라벨 */}
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 라인 차트
export function LineChart({ data, title, height = 300 }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-8">데이터가 없습니다</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  // 좌표 계산
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range > 0 ? 100 - ((item.value - minValue) / range) * 100 : 50;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold dark:text-white mb-4">{title}</h3>}
      
      <svg className="w-full" style={{ height: `${height}px` }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* 그리드 라인 */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line 
            key={y}
            x1="0" 
            y1={y} 
            x2="100" 
            y2={y} 
            stroke="currentColor" 
            className="text-gray-200 dark:text-gray-700" 
            strokeWidth="0.2"
          />
        ))}
        
        {/* 영역 채우기 */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
          opacity="0.3"
        />
        
        {/* 라인 */}
        <polyline
          points={points}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* 포인트 */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = range > 0 ? 100 - ((item.value - minValue) / range) * 100 : 50;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#6366f1"
              className="hover:r-2 cursor-pointer"
            >
              <title>{`${item.label}: ${item.value.toLocaleString()}`}</title>
            </circle>
          );
        })}
        
        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* X축 라벨 */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// 도넛 차트
export function DonutChart({ data, title }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-8">데이터가 없습니다</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // 12시 방향부터 시작

  const colors = [
    '#6366f1', // indigo
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold dark:text-white mb-4">{title}</h3>}
      
      <div className="flex items-center space-x-6">
        {/* 차트 */}
        <div className="relative" style={{ width: '200px', height: '200px' }}>
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              
              const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
              
              currentAngle += angle;
              
              const x2 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 cursor-pointer transition-opacity"
                >
                  <title>{`${item.label}: ${item.value.toLocaleString()} (${percentage.toFixed(1)}%)`}</title>
                </path>
              );
            })}
            
            {/* 중앙 구멍 */}
            <circle cx="50" cy="50" r="25" fill="currentColor" className="text-white dark:text-gray-800" />
          </svg>
          
          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold dark:text-white">{total.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">총계</div>
          </div>
        </div>
        
        {/* 범례 */}
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <div className="text-sm font-semibold dark:text-white">
                  {item.value.toLocaleString()} <span className="text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 통계 카드
export function StatCard({ title, value, change, icon: Icon, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold dark:text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% 전월 대비
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}>
            <Icon className="text-2xl" />
          </div>
        )}
      </div>
    </div>
  );
}

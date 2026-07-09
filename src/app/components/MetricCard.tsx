import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import type { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
  onClick: () => void;
}

// 生成迷你趋势线数据
const getMiniTrendData = (trend: 'up' | 'down' | 'stable') => {
  if (trend === 'up') {
    return [92, 93, 92.5, 94, 95, 94.5, 96];
  } else if (trend === 'down') {
    return [96, 95, 95.5, 94, 93, 93.5, 92];
  } else {
    return [94, 94.5, 94, 94.2, 94, 94.3, 94];
  }
};

// 迷你趋势线组件
function MiniSparkline({ data }: { data: number[] }) {
  const width = 60;
  const height = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MetricCard({ metric, onClick }: MetricCardProps) {
  const getStatusColor = () => {
    if (metric.achievementRate >= 95) return 'bg-green-50 border-green-200';
    if (metric.achievementRate >= 80) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusDot = () => {
    if (metric.achievementRate >= 95) return 'bg-green-500';
    if (metric.achievementRate >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = () => {
    if (metric.trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (metric.trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (metric.trend === 'up') return 'text-green-600';
    if (metric.trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${getStatusColor()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusDot()}`}></div>
          <h3 className="text-sm text-gray-700">{metric.name}</h3>
        </div>
        {metric.hasAppeal && (
          <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            <span className="text-xs text-orange-600">{metric.appealCount}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-gray-900">
                {metric.achievementRate.toFixed(2)}
              </span>
              <span className="text-lg text-gray-600">%</span>
            </div>
            <div className={getTrendColor()}>
              <MiniSparkline data={getMiniTrendData(metric.trend)} />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            达成率
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="text-gray-500">目标值</div>
            <div className="text-gray-900">{metric.targetValue}%</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500">实际值</div>
            <div className="text-gray-900">{metric.actualValue.toFixed(2)}%</div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs">
              {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
              {Math.abs(metric.trendValue).toFixed(2)}%
            </span>
            <span className="text-xs text-gray-500">vs上月</span>
          </div>
          
          <div className="flex gap-2">
            {metric.hasDualDimension && (
              <div className="flex items-center gap-1 text-blue-600">
                <Package className="w-3 h-3" />
                <FileText className="w-3 h-3" />
              </div>
            )}
            {metric.supportsDrilldown && (
              <span className="text-xs text-blue-600">查看明细 →</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
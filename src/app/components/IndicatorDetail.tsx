import { useState } from 'react';
import { BarChart3, Table2 } from 'lucide-react';
import { MetricDetailTable } from '@/app/components/MetricDetailTable';
import { UnifiedInventoryModule } from '@/app/components/UnifiedInventoryModule';
import type { FilterState } from '../types';
import type { DetailDimension } from '../data/detailTableData';

interface IndicatorDetailProps {
  filters: FilterState;
  businessSegment?: 'all' | 'ordering' | 'distribution' | 'store' | 'other';
  indicatorType?: 'all' | 'timeliness' | 'quality' | 'efficiency' | 'cost' | 'planning';
}

const SEGMENTS = [
  { key: 'ordering', label: '订货段', metricId: 'inventory-inbound-rate' },
  { key: 'distribution', label: '分货段', metricId: 'inventory-outbound-rate' },
] as const;

export function IndicatorDetail({ filters, businessSegment = 'all', indicatorType = 'all' }: IndicatorDetailProps) {
  const [dimension, setDimension] = useState<DetailDimension>('票数');
  const visibleSegments = SEGMENTS.filter(segment => businessSegment === 'all' || businessSegment === segment.key);
  const showUnifiedSegments = visibleSegments.length > 0 && (indicatorType === 'all' || indicatorType === 'timeliness');

  if (!showUnifiedSegments) {
    return (
      <UnifiedInventoryModule
        selectedCategories={filters.selectedCategories}
        startDate={filters.startDate}
        endDate={filters.endDate}
        businessSegment={businessSegment}
        indicatorType={indicatorType}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span>图表与表格维度</span>
        </div>
        <div className="inline-flex rounded-md border border-gray-300 p-0.5 bg-gray-50" role="group" aria-label="图表与表格数据维度">
          {(['票数', '件数'] as DetailDimension[]).map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setDimension(item)}
              className={`px-4 py-1.5 text-sm rounded transition-colors ${dimension === item ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visibleSegments.map(segment => (
        <section key={segment.key} className="bg-blue-50/30 rounded-lg p-5 border-l-4 border-blue-600">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded" />
              {segment.label}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500"><Table2 className="w-4 h-4" />当前维度：{dimension}</span>
          </div>
          <MetricDetailTable metricId={segment.metricId} dimension={dimension} segment={segment.label} />
        </section>
      ))}

      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-900">
        <span className="font-medium">指标说明：</span>
        日度均值 = 每个月的时效指标汇总值 ÷ 每个月天数的汇总值；月度均值 = 各月日度均值的平均值。各指标目标值与指标总览保持一致，未配置目标值时展示“-”。
      </div>
    </div>
  );
}

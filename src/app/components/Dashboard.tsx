import { useState } from 'react';
import { MetricCard } from './MetricCard';
import { CategoryTabs } from './CategoryTabs';
import { TrendChart } from './TrendChart';
import { ComparisonChart } from './ComparisonChart';
import { AlertPanel } from './AlertPanel';
import { MetricTree } from './MetricTree';
import { MetricDetailTable } from './MetricDetailTable';
import { FilterBar } from './FilterBar';
import type { ViewType, CategoryType, Metric } from '../types';
import { getMetricsData } from '../data/metricsData';

interface DashboardProps {
  currentView: ViewType;
  selectedStores: string[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  onMetricClick: (metric: Metric) => void;
}

export function Dashboard({
  currentView,
  selectedStores,
  selectedCategory,
  onCategoryChange,
  onMetricClick,
}: DashboardProps) {
  // 使用第一个选中的门店或'all'作为主要门店
  const primaryStore = selectedStores.length > 0 ? selectedStores[0] : 'all';
  const metrics = getMetricsData(currentView, primaryStore, selectedCategory);
  const [selectedDetailMetricId, setSelectedDetailMetricId] = useState<string>('inventory-inbound-rate');

  // 指标总览页
  if (selectedCategory === 'overview') {
    return (
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 space-y-6">
          <CategoryTabs
            selected={selectedCategory}
            onChange={onCategoryChange}
          />

          <FilterBar />

          {/* 核心指标卡片区 */}
          <div>
            <h2 className="text-xl mb-4 text-gray-800">核心指标</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  onClick={() => onMetricClick(metric)}
                />
              ))}
            </div>
          </div>

          {/* 趋势分析图表区 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart />
            <ComparisonChart />
          </div>

          {/* 异常预警看板 */}
          <AlertPanel />
        </div>
      </main>
    );
  }

  // 指标明细页
  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 space-y-6">
        <CategoryTabs
          selected={selectedCategory}
          onChange={onCategoryChange}
        />

        <FilterBar />

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* 左侧指标树 */}
          <div className="col-span-3">
            <MetricTree 
              onMetricSelect={setSelectedDetailMetricId}
              selectedMetricId={selectedDetailMetricId}
            />
          </div>

          {/* 右侧明细表格 */}
          <div className="col-span-9">
            <MetricDetailTable metricId={selectedDetailMetricId} />
          </div>
        </div>
      </div>
    </main>
  );
}
import { useState } from "react";
import { TopNavigation } from "@/app/components/TopNavigation";
import { FilterTopBar } from "@/app/components/FilterTopBar";
import { IndicatorOverview } from "@/app/components/IndicatorOverview";
import { IndicatorDetail } from "@/app/components/IndicatorDetail";
import { Settings } from "@/app/components/Settings";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import type { ViewType, FilterState } from "@/app/types";

// 指标列表数据
const INDICATOR_LIST = [
  "全链路订货平均时效（一盘货）",
  "入库时效达标率",
  "一线通关时效",
  "全链路分货平均时效",
  "出库时效达标率",
  "二线通关时效",
  "监管仓-周转仓调拨平均时效",
  "周转仓-卖场调拨平均时效",
  "直入直出全链路平均时效（监管仓-卖场）",
  "邮寄全链路平均时效",
  "提货点提货全链路平均时效",
  "监管仓/周转仓-预定仓全链路平均时效",
  "预定仓邮寄全链路平均时效",
  "预定仓配送全链路平均时效",
  "卖场-分拣仓入库平均时效",
  "配送出库平均时效",
];

const VIEW_TABS: { id: ViewType; label: string }[] = [
  { id: 'overview', label: '指标总览' },
  { id: 'detail', label: '指标明细' },
  { id: 'settings', label: '异常明细' },
];

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("overview");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // 搜索框状态
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 业务环节状态
  const [businessSegment, setBusinessSegment] = useState<'all' | 'ordering' | 'distribution' | 'store' | 'other'>('all');

  // 指标类型状态
  const [indicatorType, setIndicatorType] = useState<'all' | 'timeliness' | 'quality' | 'efficiency' | 'cost' | 'planning'>('all');

  // 筛选状态
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [filters, setFilters] = useState<FilterState>({
    startDate: yesterday,
    endDate: yesterday,
    showStoreFilter: false,
    showWarehouseFilter: false,
    showCategoryFilter: false,
    selectedStores: [],
    selectedWarehouses: [],
    selectedCategories: [],
    storeRole: 'all',
    warehouseRole: 'all',
  });

  const handleAlertClick = (metricId: string) => {
    setSelectedMetric(metricId);
    setCurrentView("settings");
  };

  const filteredIndicators = INDICATOR_LIST.filter((indicator) =>
    indicator.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleSelectIndicator = (indicator: string) => {
    setSearchValue(indicator);
    setIsDropdownOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 顶部品牌栏 - 仅Logo和用户信息 */}
        <TopNavigation />

        <main className="flex-1">
          <div className="px-6 pt-4 pb-0">
            {/* 查询模块 */}
            <FilterTopBar filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* 视图Tab - 指标总览 / 指标明细 / 异常明细 */}
          <div className="px-6 mt-3">
            <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 inline-flex">
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`px-6 py-3 text-base font-semibold transition-colors rounded-t-lg relative ${
                    currentView === tab.id
                      ? 'text-blue-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {currentView === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 内容区 */}
          <div className="px-6 pb-6">
            <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg p-6 min-h-[400px]">

              {/* 指标明细页额外筛选条件 */}
              {currentView === "detail" && (
                <div className="mb-5 pb-5 border-b border-gray-100">
                  {/* 搜索框 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-lg">
                      <input
                        type="text"
                        placeholder="搜索指标，例：门店提货至上架平均时效"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      {isDropdownOpen && filteredIndicators.length > 0 && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                          {filteredIndicators.map((indicator) => (
                            <div
                              key={indicator}
                              className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-blue-50 transition-colors"
                              onMouseDown={() => handleSelectIndicator(indicator)}
                            >
                              {indicator}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors font-medium"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      搜索
                    </button>
                  </div>

                  {/* 指标类型 + 业务环节 两行筛选 */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap w-16">指标类型</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all','timeliness','quality','efficiency','cost','planning'] as const).map((type) => {
                        const labels = { all:'全部', timeliness:'时效指标', quality:'质量指标', efficiency:'效率指标', cost:'成本指标', planning:'待规划指标' };
                        return (
                          <button
                            key={type}
                            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                              indicatorType === type ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-gray-100'
                            }`}
                            onClick={() => setIndicatorType(type)}
                          >
                            {labels[type]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap w-16">业务环节</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all','ordering','distribution','store','other'] as const).map((seg) => {
                        const labels = { all:'全部', ordering:'订货段', distribution:'分货段', store:'门店段', other:'其它' };
                        return (
                          <button
                            key={seg}
                            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                              businessSegment === seg ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-gray-100'
                            }`}
                            onClick={() => setBusinessSegment(seg)}
                          >
                            {labels[seg]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 视图内容 */}
              {currentView === "overview" && (
                <ErrorBoundary fallback={<div className="text-center py-12 text-gray-600">指标总览加载失败，请刷新页面</div>}>
                  <IndicatorOverview filters={filters} onAlertClick={handleAlertClick} />
                </ErrorBoundary>
              )}
              {currentView === "detail" && (
                <ErrorBoundary fallback={<div className="text-center py-12 text-gray-600">指标明细加载失败，请刷新页面</div>}>
                  <IndicatorDetail filters={filters} businessSegment={businessSegment} indicatorType={indicatorType} />
                </ErrorBoundary>
              )}
              {currentView === "settings" && (
                <ErrorBoundary fallback={<div className="text-center py-12 text-gray-600">异常分析加载失败，请刷新页面</div>}>
                  <Settings selectedMetric={selectedMetric} />
                </ErrorBoundary>
              )}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;

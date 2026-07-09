import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Warehouse, RotateCcw, Check, ChevronDown, Search, XCircle, ListChecks, Info } from 'lucide-react';
import { format } from 'date-fns';
import { DateRangePicker } from '@/app/components/DateRangePicker';
import { StoreSelector } from '@/app/components/StoreSelector';
import { WarehouseSelector } from '@/app/components/WarehouseSelector';
import { WarehouseCategorySelector } from '@/app/components/WarehouseCategorySelector';
import { getFilteredWarehouses, getFilteredStores, warehouses, stores } from '@/app/data/storeWarehouseMapping';
import type { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function FilterSidebar({ filters, onFiltersChange, isCollapsed, onToggleCollapse }: FilterSidebarProps) {
  // 本地筛选状态（用户正在选择但未提交）
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [quickTimeRange, setQuickTimeRange] = useState<string>('1year');
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [warehouseDropdownOpen, setWarehouseDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [highlightTimeFilter, setHighlightTimeFilter] = useState(false);

  // 当外部filters变化时，同步更新localFilters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // 获取智能过滤后的选项（基于localFilters）
  const filteredWarehouses = getFilteredWarehouses(localFilters.selectedStores);
  const filteredStores = getFilteredStores(localFilters.selectedWarehouses);

  // 获取日期范围显示文本
  const getDateRangeText = () => {
    if (format(localFilters.startDate, 'yyyy-MM-dd') === format(localFilters.endDate, 'yyyy-MM-dd')) {
      return `今天 (${format(localFilters.startDate, 'yyyy-MM-dd')})`;
    }
    return `${format(localFilters.startDate, 'yyyy-MM-dd')} 至 ${format(localFilters.endDate, 'yyyy-MM-dd')}`;
  };

  // 快捷时间选择
  const handleQuickTimeRange = (range: string) => {
    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    switch (range) {
      case 'today':
        // 已经是今天
        break;
      case '7days':
        startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(today.getTime() - 89 * 24 * 60 * 60 * 1000);
        break;
      case 'springFestival':
        // 春节：2026年2月10日 - 2月24日（涵盖春节前后约一周）
        startDate = new Date(2026, 1, 10); // 月份从0开始，1表示2月
        endDate = new Date(2026, 1, 24);
        break;
      case 'currentBusinessMonth':
        // 本业务月: 上月21日 - 本月20日
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 21);
        const thisMonth20 = new Date(today.getFullYear(), today.getMonth(), 20);
        startDate = lastMonth;
        endDate = thisMonth20;
        break;
      case 'lastBusinessMonth':
        // 上业务月: 上上月21日 - 上月20日
        const lastLastMonth = new Date(today.getFullYear(), today.getMonth() - 2, 21);
        const lastMonth20 = new Date(today.getFullYear(), today.getMonth() - 1, 20);
        startDate = lastLastMonth;
        endDate = lastMonth20;
        break;
      case '1year':
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
    }

    setQuickTimeRange(range);
    setLocalFilters({ ...localFilters, startDate, endDate });
  };

  // 切换整体视图
  const handleOverallToggle = () => {
    if (!localFilters.showStoreFilter && !localFilters.showWarehouseFilter) {
      // 当前是整体视图，不做任何事
      return;
    }
    // 切换到整体视图，清空筛选
    setLocalFilters({
      ...localFilters,
      showStoreFilter: false,
      showWarehouseFilter: false,
      selectedStores: [],
      selectedWarehouses: [],
    });
  };

  // 切换门店筛选
  const handleStoreFilterToggle = () => {
    setLocalFilters({
      ...localFilters,
      showStoreFilter: !localFilters.showStoreFilter,
      selectedStores: !localFilters.showStoreFilter ? localFilters.selectedStores : [],
    });
  };

  // 切换仓库筛选
  const handleWarehouseFilterToggle = () => {
    setLocalFilters({
      ...localFilters,
      showWarehouseFilter: !localFilters.showWarehouseFilter,
      selectedWarehouses: !localFilters.showWarehouseFilter ? localFilters.selectedWarehouses : [],
    });
  };

  // 重置筛选
  const handleReset = () => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    // 全选所有门店、仓库、品类
    const allStoreIds = stores.map(s => s.id);
    const allWarehouseIds = warehouses.map(w => w.id);
    const allCategories = ['香化', '酒水'];
    
    setLocalFilters({
      startDate: oneYearAgo,
      endDate: today,
      showStoreFilter: true,
      showWarehouseFilter: true,
      showCategoryFilter: true,
      selectedStores: allStoreIds,
      selectedWarehouses: allWarehouseIds,
      selectedCategories: allCategories,
    });
    setQuickTimeRange('1year');
  };

  // 清空筛选
  const handleClear = () => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    setLocalFilters({
      startDate: oneYearAgo,
      endDate: today,
      showStoreFilter: false,
      showWarehouseFilter: false,
      showCategoryFilter: false,
      selectedStores: [],
      selectedWarehouses: [],
      selectedCategories: [],
    });
    setQuickTimeRange('1year');
  };

  // 提交筛选
  const handleSubmit = () => {
    onFiltersChange(localFilters);
  };

  if (isCollapsed) {
    return (
      <aside className="w-[60px] bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="展开筛选栏"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar">
      <div className="p-4">
        {/* 折叠按钮 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-gray-900">筛选条件</h2>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="收起筛选栏"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 时间筛选 */}
        <div className={`mb-6 rounded-lg p-3 -m-3 transition-all ${highlightTimeFilter ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' : 'border-2 border-transparent'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs text-gray-700 font-medium">时间筛选</h3>
            <div className="relative group">
              <div 
                className="relative cursor-pointer"
                onClick={() => {
                  setHighlightTimeFilter(true);
                  setTimeout(() => setHighlightTimeFilter(false), 2000);
                }}
              >
                <Info className="w-3.5 h-3.5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">1</span>
              </div>
              <div className="absolute left-0 top-full mt-1 w-56 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="font-semibold mb-1">批注①</div>
                <div className="text-gray-300">1.默认时间为昨日，快捷键与时间进行联动；2.春节为农历初一到十五，时间范围映射到阳历对应年份的日期</div>
              </div>
            </div>
          </div>
          
          {/* 日期选择器 */}
          <DateRangePicker 
            onDateRangeChange={(startDate, endDate) => {
              setLocalFilters({ ...localFilters, startDate, endDate });
              setQuickTimeRange('custom');
            }}
          />

          {/* 快捷选择 */}
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-500 mb-2">快捷选择:</div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickTimeRange('7days')}
                className={`px-2 py-1.5 text-xs rounded transition-colors ${
                  quickTimeRange === '7days'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                近7天
              </button>
              <button
                onClick={() => handleQuickTimeRange('1month')}
                className={`px-2 py-1.5 text-xs rounded transition-colors ${
                  quickTimeRange === '1month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                近1个月
              </button>
              <button
                onClick={() => handleQuickTimeRange('3months')}
                className={`px-2 py-1.5 text-xs rounded transition-colors ${
                  quickTimeRange === '3months'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                近3个月
              </button>
              <button
                onClick={() => handleQuickTimeRange('springFestival')}
                className={`px-2 py-1.5 text-xs rounded transition-colors ${
                  quickTimeRange === 'springFestival'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                春节
              </button>
            </div>
          </div>
        </div>

        {/* 维度筛选 */}
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-xs text-gray-700 font-medium mb-3">🎯 维度筛选</h3>
          <div className="space-y-3">
            {/* 门店下拉框 */}
            <div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">门店</div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                    onFocus={() => setStoreDropdownOpen(true)}
                    placeholder={localFilters.selectedStores.length > 0 ? `已选${localFilters.selectedStores.length}项` : "搜索门店..."}
                    className="w-full px-3 py-2.5 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                  />
                  <button
                    onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {storeDropdownOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded p-3 max-h-64 overflow-y-auto space-y-2">
                  {/* 全选选项 */}
                  <label 
                    className="flex items-center gap-2 cursor-pointer group pb-2 border-b border-gray-200"
                    onClick={(e) => {
                      if (e.detail === 2) {
                        // 双击取消全选
                        e.preventDefault();
                        setLocalFilters({ 
                          ...localFilters, 
                          selectedStores: [],
                          showStoreFilter: false
                        });
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={stores.filter(store => store.name.toLowerCase().includes(storeSearchQuery.toLowerCase())).length > 0 && 
                              stores.filter(store => store.name.toLowerCase().includes(storeSearchQuery.toLowerCase())).every(store => localFilters.selectedStores.includes(store.id))}
                      onChange={(e) => {
                        const filteredStoreList = stores.filter(store => store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()));
                        if (e.target.checked) {
                          // 全选
                          const allStoreIds = filteredStoreList.map(s => s.id);
                          const newStores = Array.from(new Set([...localFilters.selectedStores, ...allStoreIds]));
                          setLocalFilters({ 
                            ...localFilters, 
                            selectedStores: newStores,
                            showStoreFilter: newStores.length > 0
                          });
                        } else {
                          // 取消全选
                          const filteredIds = filteredStoreList.map(s => s.id);
                          const newStores = localFilters.selectedStores.filter(id => !filteredIds.includes(id));
                          setLocalFilters({ 
                            ...localFilters, 
                            selectedStores: newStores,
                            showStoreFilter: newStores.length > 0
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-semibold group-hover:text-gray-900">全选</span>
                  </label>
                  {/* 门店列表 */}
                  {stores
                    .filter(store => store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()))
                    .map(store => (
                      <label key={store.id} className={`flex items-center gap-2 cursor-pointer group relative px-2 py-1.5 rounded transition-colors ${
                        localFilters.selectedStores.includes(store.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}>
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={localFilters.selectedStores.includes(store.id)}
                            onChange={(e) => {
                              const newStores = e.target.checked
                                ? [...localFilters.selectedStores, store.id]
                                : localFilters.selectedStores.filter(s => s !== store.id);
                              setLocalFilters({ 
                                ...localFilters, 
                                selectedStores: newStores,
                                showStoreFilter: newStores.length > 0
                              });
                            }}
                            className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded accent-blue-600 cursor-pointer"
                          />
                          {localFilters.selectedStores.includes(store.id) && (
                            <Check className="w-3.5 h-3.5 text-blue-600 absolute top-0 left-0 pointer-events-none" strokeWidth={4} />
                          )}
                        </div>
                        <span className={`text-sm ${
                          localFilters.selectedStores.includes(store.id) 
                            ? 'text-blue-700 font-medium' 
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}>{store.name}</span>
                      </label>
                    ))}
                  {stores.filter(store => store.name.toLowerCase().includes(storeSearchQuery.toLowerCase())).length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-2">暂无匹配结果</div>
                  )}
                </div>
              )}
            </div>

            {/* 仓库下拉框 */}
            <div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">仓库</div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={warehouseSearchQuery}
                    onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                    onFocus={() => setWarehouseDropdownOpen(true)}
                    placeholder={localFilters.selectedWarehouses.length > 0 ? `已选${localFilters.selectedWarehouses.length}项` : "搜索仓库..."}
                    className="w-full px-3 py-2.5 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                  />
                  <button
                    onClick={() => setWarehouseDropdownOpen(!warehouseDropdownOpen)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${warehouseDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {warehouseDropdownOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded p-3 max-h-64 overflow-y-auto space-y-2">
                  {/* 全选选项 */}
                  <label 
                    className="flex items-center gap-2 cursor-pointer group pb-2 border-b border-gray-200"
                    onClick={(e) => {
                      if (e.detail === 2) {
                        // 双击取消全选
                        e.preventDefault();
                        setLocalFilters({ 
                          ...localFilters, 
                          selectedWarehouses: [],
                          showWarehouseFilter: false
                        });
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(localFilters.selectedStores.length > 0 ? filteredWarehouses : warehouses)
                              .filter(warehouse => warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase())).length > 0 && 
                              (localFilters.selectedStores.length > 0 ? filteredWarehouses : warehouses)
                              .filter(warehouse => warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase()))
                              .every(warehouse => localFilters.selectedWarehouses.includes(warehouse.id))}
                      onChange={(e) => {
                        const filteredWarehouseList = (localFilters.selectedStores.length > 0 ? filteredWarehouses : warehouses)
                          .filter(warehouse => warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase()));
                        if (e.target.checked) {
                          // 全选
                          const allWarehouseIds = filteredWarehouseList.map(w => w.id);
                          const newWarehouses = Array.from(new Set([...localFilters.selectedWarehouses, ...allWarehouseIds]));
                          setLocalFilters({ 
                            ...localFilters, 
                            selectedWarehouses: newWarehouses,
                            showWarehouseFilter: newWarehouses.length > 0
                          });
                        } else {
                          // 取消全选
                          const filteredIds = filteredWarehouseList.map(w => w.id);
                          const newWarehouses = localFilters.selectedWarehouses.filter(id => !filteredIds.includes(id));
                          setLocalFilters({ 
                            ...localFilters, 
                            selectedWarehouses: newWarehouses,
                            showWarehouseFilter: newWarehouses.length > 0
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-semibold group-hover:text-gray-900">全选</span>
                  </label>
                  {/* 仓库列表 */}
                  {(localFilters.selectedStores.length > 0 ? filteredWarehouses : warehouses)
                    .filter(warehouse => warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase()))
                    .map(warehouse => (
                      <label key={warehouse.id} className={`flex items-center gap-2 cursor-pointer group relative px-2 py-1.5 rounded transition-colors ${
                        localFilters.selectedWarehouses.includes(warehouse.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}>
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={localFilters.selectedWarehouses.includes(warehouse.id)}
                            onChange={(e) => {
                              const newWarehouses = e.target.checked
                                ? [...localFilters.selectedWarehouses, warehouse.id]
                                : localFilters.selectedWarehouses.filter(w => w !== warehouse.id);
                              setLocalFilters({ 
                                ...localFilters, 
                                selectedWarehouses: newWarehouses,
                                showWarehouseFilter: newWarehouses.length > 0
                              });
                            }}
                            className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded accent-blue-600 cursor-pointer"
                          />
                          {localFilters.selectedWarehouses.includes(warehouse.id) && (
                            <Check className="w-3.5 h-3.5 text-blue-600 absolute top-0 left-0 pointer-events-none" strokeWidth={4} />
                          )}
                        </div>
                        <span className={`text-sm ${
                          localFilters.selectedWarehouses.includes(warehouse.id) 
                            ? 'text-blue-700 font-medium' 
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}>{warehouse.name}</span>
                      </label>
                    ))}
                  {(localFilters.selectedStores.length > 0 ? filteredWarehouses : warehouses)
                    .filter(warehouse => warehouse.name.toLowerCase().includes(warehouseSearchQuery.toLowerCase())).length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-2">暂无匹配结果</div>
                  )}
                </div>
              )}
            </div>

            {/* 品类下拉框 */}
            <div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">品类</div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    onFocus={() => setCategoryDropdownOpen(true)}
                    placeholder={localFilters.selectedCategories.length > 0 ? `已选${localFilters.selectedCategories.length}项` : "搜索品类..."}
                    className="w-full px-3 py-2.5 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
                  />
                  <button
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {categoryDropdownOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded p-3 space-y-2">
                  {/* 全选选项 */}
                  <label 
                    className="flex items-center gap-2 cursor-pointer group pb-2 border-b border-gray-200"
                    onClick={(e) => {
                      if (e.detail === 2) {
                        // 双击取消全选
                        e.preventDefault();
                        setLocalFilters({ 
                          ...localFilters, 
                          selectedCategories: [],
                          showCategoryFilter: false
                        });
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={['香化', '酒水'].filter(category => category.includes(categorySearchQuery)).length > 0 && 
                              ['香化', '酒水'].filter(category => category.includes(categorySearchQuery)).every(category => localFilters.selectedCategories.includes(category))}
                      onChange={(e) => {
                        const filteredCategoryList = ['香化', '酒水'].filter(category => category.includes(categorySearchQuery));
                        if (e.target.checked) {
                          // 全选
                          const newCategories = Array.from(new Set([...localFilters.selectedCategories, ...filteredCategoryList]));
                          setLocalFilters({ ...localFilters, selectedCategories: newCategories, showCategoryFilter: newCategories.length > 0 });
                        } else {
                          // 取消全选
                          const newCategories = localFilters.selectedCategories.filter(c => !filteredCategoryList.includes(c));
                          setLocalFilters({ ...localFilters, selectedCategories: newCategories, showCategoryFilter: newCategories.length > 0 });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 font-semibold group-hover:text-gray-900">全选</span>
                  </label>
                  {/* 品类列表 */}
                  {['香化', '酒水']
                    .filter(category => category.includes(categorySearchQuery))
                    .map(category => (
                      <label key={category} className={`flex items-center gap-2 cursor-pointer group relative px-2 py-1.5 rounded transition-colors ${
                        localFilters.selectedCategories.includes(category) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}>
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={localFilters.selectedCategories.includes(category)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...localFilters.selectedCategories, category]
                                : localFilters.selectedCategories.filter(c => c !== category);
                              setLocalFilters({ ...localFilters, selectedCategories: newCategories, showCategoryFilter: newCategories.length > 0 });
                            }}
                            className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded accent-blue-600 cursor-pointer"
                          />
                          {localFilters.selectedCategories.includes(category) && (
                            <Check className="w-3.5 h-3.5 text-blue-600 absolute top-0 left-0 pointer-events-none" strokeWidth={4} />
                          )}
                        </div>
                        <span className={`text-sm ${
                          localFilters.selectedCategories.includes(category) 
                            ? 'text-blue-700 font-medium' 
                            : 'text-gray-700 group-hover:text-gray-900'
                        }`}>{category}</span>
                      </label>
                    ))}
                  {['香化', '酒水'].filter(category => category.includes(categorySearchQuery)).length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-2">暂无匹配结果</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-6" />

        {/* 底部按钮 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              清空
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ListChecks className="w-4 h-4" />
              重置
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            查询
          </button>
        </div>
      </div>
    </aside>
  );
}
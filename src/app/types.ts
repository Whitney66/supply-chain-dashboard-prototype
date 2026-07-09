// 视图类型
export type ViewType = 'overview' | 'detail' | 'settings';

// 分类类型
export type CategoryType = 'overview' | 'all';

// 角色类型
export type RoleType = 'all' | 'shipping' | 'receiving';

// 筛选状态
export interface FilterState {
  startDate: Date;
  endDate: Date;
  showStoreFilter: boolean;
  showWarehouseFilter: boolean;
  showCategoryFilter: boolean;
  selectedStores: string[];
  selectedWarehouses: string[];
  selectedCategories: string[];
  storeRole: RoleType;
  warehouseRole: RoleType;
}

// 指标数据
export interface Metric {
  id: string;
  name: string;
  targetValue: number;
  actualValue: number;
  achievementRate: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  hasAppeal?: boolean;
  appealCount?: number;
  supportsDrilldown?: boolean;
  hasDualDimension?: boolean;
}
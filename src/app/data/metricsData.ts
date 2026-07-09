import type { ViewType, CategoryType, Metric } from '../types';

export function getMetricsData(
  viewType: ViewType,
  storeId: string,
  category: CategoryType
): Metric[] {
  // 核心指标（用于总览页）
  const coreMetrics: Metric[] = [
    {
      id: 'inventory-inbound-rate',
      name: '入库时效达标率',
      targetValue: 95,
      actualValue: 96.2,
      achievementRate: 96.2,
      trend: 'up',
      trendValue: 2.3,
      hasAppeal: true,
      appealCount: 3,
      supportsDrilldown: true,
      hasDualDimension: true,
    },
    {
      id: 'inventory-outbound-rate',
      name: '出库时效达标率',
      targetValue: 95,
      actualValue: 92.8,
      achievementRate: 92.8,
      trend: 'down',
      trendValue: -1.5,
      hasAppeal: false,
      supportsDrilldown: true,
      hasDualDimension: true,
    },
    {
      id: 'first-line-customs-rate',
      name: '一线通关及时率',
      targetValue: 98,
      actualValue: 98.1,
      achievementRate: 98.1,
      trend: 'up',
      trendValue: 0.8,
      supportsDrilldown: true,
    },
    {
      id: 'second-line-customs-rate',
      name: '二线通关及时率',
      targetValue: 98,
      actualValue: 97.5,
      achievementRate: 97.5,
      trend: 'stable',
      trendValue: 0.3,
      supportsDrilldown: true,
    },
    {
      id: 'store-avg-pickup-time',
      name: '门店平均提货时效',
      targetValue: 3,
      actualValue: 2.8,
      achievementRate: 93.3,
      trend: 'up',
      trendValue: 2.5,
      supportsDrilldown: true,
    },
    {
      id: 'inventory-accuracy-rate',
      name: '库存准确率',
      targetValue: 99.5,
      actualValue: 99.6,
      achievementRate: 99.6,
      trend: 'up',
      trendValue: 0.5,
      supportsDrilldown: true,
    },
    {
      id: 'expiry-accuracy-rate',
      name: '效期准确率',
      targetValue: 99.8,
      actualValue: 99.9,
      achievementRate: 99.9,
      trend: 'stable',
      trendValue: 0.1,
      supportsDrilldown: true,
    },
    {
      id: 'delivery-timeliness-rate',
      name: '配送及时率',
      targetValue: 97,
      actualValue: 95.3,
      achievementRate: 95.3,
      trend: 'down',
      trendValue: -1.2,
      hasAppeal: true,
      appealCount: 4,
      supportsDrilldown: true,
    },
  ];

  // 所有指标（用于明细页）
  const allMetrics: Metric[] = [
    ...coreMetrics,
    {
      id: 'store-pickup-shelf-time',
      name: '门店提货-上架时效',
      targetValue: 4,
      actualValue: 3.5,
      achievementRate: 87.5,
      trend: 'up',
      trendValue: 3.2,
      supportsDrilldown: true,
    },
    {
      id: 'warehouse-inbound-rate',
      name: '监管仓入库及时率',
      targetValue: 95,
      actualValue: 94.6,
      achievementRate: 94.6,
      trend: 'down',
      trendValue: -2.1,
      hasAppeal: true,
      appealCount: 5,
      supportsDrilldown: true,
      hasDualDimension: true,
    },
    {
      id: 'warehouse-outbound-rate',
      name: '监管仓出库及时率',
      targetValue: 95,
      actualValue: 96.2,
      achievementRate: 96.2,
      trend: 'up',
      trendValue: 3.5,
      hasAppeal: true,
      appealCount: 2,
      supportsDrilldown: true,
      hasDualDimension: true,
    },
    {
      id: 'customs-clearance-rate',
      name: '通关及时率',
      targetValue: 96,
      actualValue: 97.1,
      achievementRate: 97.1,
      trend: 'up',
      trendValue: 1.9,
      supportsDrilldown: true,
    },
    {
      id: 'daily-transfer-response-rate',
      name: '日常调拨配送及时响应率',
      targetValue: 98,
      actualValue: 98.9,
      achievementRate: 98.9,
      trend: 'up',
      trendValue: 2.3,
      supportsDrilldown: true,
    },
    {
      id: 'vehicle-delivery-qualified-rate',
      name: '车辆配送运行合格率',
      targetValue: 98,
      actualValue: 98.2,
      achievementRate: 98.2,
      trend: 'up',
      trendValue: 0.8,
      supportsDrilldown: true,
    },
    {
      id: 'daily-transfer-qualified-rate',
      name: '日常调拨运行合格率',
      targetValue: 97,
      actualValue: 97.5,
      achievementRate: 97.5,
      trend: 'stable',
      trendValue: 0.2,
      supportsDrilldown: true,
    },
    {
      id: 'reschedule-approval-rate',
      name: '改签审批及时率',
      targetValue: 99,
      actualValue: 99.8,
      achievementRate: 99.8,
      trend: 'up',
      trendValue: 1.5,
      supportsDrilldown: true,
    },
    {
      id: 'express-delivery-rate',
      name: '快递妥投时效达标率',
      targetValue: 96,
      actualValue: 94.2,
      achievementRate: 94.2,
      trend: 'down',
      trendValue: -2.8,
      hasAppeal: true,
      appealCount: 6,
      supportsDrilldown: true,
    },
    {
      id: 'transfer-fulfillment-rate',
      name: '调拨满足率',
      targetValue: 95,
      actualValue: 96.1,
      achievementRate: 96.1,
      trend: 'up',
      trendValue: 1.2,
      supportsDrilldown: true,
    },
  ];

  // 根据category返回不同的数据
  if (category === 'overview') {
    return coreMetrics;
  } else {
    return allMetrics;
  }
}

// 获取趋势数据（用于图表）
export function getTrendData() {
  return [
    { month: '1月', 入库时效: 94.2, 出库时效: 93.1, 通关及时率: 97.5 },
    { month: '2月', 入库时效: 94.8, 出库时效: 92.8, 通关及时率: 97.8 },
    { month: '3月', 入库时效: 95.1, 出库时效: 93.5, 通关及时率: 98.0 },
    { month: '4月', 入库时效: 95.5, 出库时效: 92.2, 通关及时率: 97.9 },
    { month: '5月', 入库时效: 95.8, 出库时效: 93.8, 通关及时率: 98.2 },
    { month: '6月', 入库时效: 96.0, 出库时效: 92.5, 通关及时率: 98.0 },
    { month: '7月', 入库时效: 96.2, 出库时效: 92.8, 通关及时率: 98.1 },
  ];
}

// 获取门店对比数据
export function getStoreComparisonData() {
  return [
    { store: '三亚', 及时率: 96.5, 准确率: 99.5 },
    { store: '新海港', 及时率: 94.2, 准确率: 99.3 },
    { store: '海口', 及时率: 97.8, 准确率: 99.7 },
    { store: '琼海', 及时率: 95.1, 准确率: 99.4 },
    { store: '万宁', 及时率: 93.8, 准确率: 99.2 },
  ];
}

// 获取异常预警数据
export function getAlertData() {
  return [
    {
      id: 'alert-1',
      level: 'high',
      message: '三亚门店出库及时率低于85% 需关注',
      metric: '出库及时率',
      store: '三亚',
      value: 82.3,
      threshold: 85,
    },
    {
      id: 'alert-2',
      level: 'medium',
      message: '新海港库存准确率波动较大',
      metric: '库存准确率',
      store: '新海港',
      value: 98.8,
      threshold: 99,
    },
    {
      id: 'alert-3',
      level: 'low',
      message: '快递妥投时效接近预警线',
      metric: '快递妥投时效',
      store: '全部',
      value: 92.5,
      threshold: 92,
    },
  ];
}
// 模拟指标数据

export interface Metric {
  id: string;
  name: string;
  category: 'timeliness' | 'quality' | 'cost' | 'efficiency';
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'success' | 'warning' | 'danger';
  hasSubCategories?: boolean;
  subCategories?: {
    name: string;
    value: number;
    icon: string;
  }[];
  description?: string;
}

export const timelinessMetrics: Metric[] = [
  {
    id: 'inbound_order',
    name: '入库时效达标率(订货端)',
    category: 'timeliness',
    value: 94.8,
    unit: '%',
    target: 95,
    trend: 'up',
    trendValue: 2.1,
    status: 'warning',
    hasSubCategories: true,
    subCategories: [
      { name: '酒水', value: 94.2, icon: '🍷' },
      { name: '香化', value: 96.8, icon: '💄' },
    ],
    description: '按时入库订单数/总订单数×100%',
  },
  {
    id: 'outbound_distribution',
    name: '出库时效达标率(分货端)',
    category: 'timeliness',
    value: 92.5,
    unit: '%',
    target: 95,
    trend: 'down',
    trendValue: 0.8,
    status: 'warning',
    hasSubCategories: true,
    subCategories: [
      { name: '酒水', value: 91.8, icon: '🍷' },
      { name: '香化', value: 93.5, icon: '💄' },
    ],
    description: '按时出库订单数/总订单数×100%',
  },
  {
    id: 'first_line_customs',
    name: '一线通关及时率',
    category: 'timeliness',
    value: 98.5,
    unit: '%',
    target: 98,
    trend: 'up',
    trendValue: 1.2,
    status: 'success',
    description: '按时通关票数/总票数×100%',
  },
  {
    id: 'second_line_customs',
    name: '二线通关及时率',
    category: 'timeliness',
    value: 97.3,
    unit: '%',
    target: 98,
    trend: 'down',
    trendValue: 0.5,
    status: 'warning',
    description: '按时通关票数/总票数×100%',
  },
  {
    id: 'store_pickup_time',
    name: '门店平均提货时效',
    category: 'timeliness',
    value: 2.8,
    unit: '小时',
    target: 3,
    trend: 'down',
    trendValue: 0.3,
    status: 'success',
    description: '加权平均提货时长',
  },
  {
    id: 'store_shelving_time',
    name: '门店提货-上架时效',
    category: 'timeliness',
    value: 3.5,
    unit: '小时',
    target: 4,
    trend: 'up',
    trendValue: 0.2,
    status: 'success',
    description: '平均提货到上架时长',
  },
  {
    id: 'inbound_timeliness',
    name: '入库及时率',
    category: 'timeliness',
    value: 95.2,
    unit: '%',
    target: 95,
    trend: 'up',
    trendValue: 1.5,
    status: 'success',
    description: '件数维度+票数维度双指标',
  },
  {
    id: 'outbound_timeliness',
    name: '出库及时率',
    category: 'timeliness',
    value: 93.8,
    unit: '%',
    target: 95,
    trend: 'stable',
    trendValue: 0,
    status: 'warning',
    description: '件数维度+票数维度双指标',
  },
  {
    id: 'customs_timeliness',
    name: '通关及时率',
    category: 'timeliness',
    value: 96.5,
    unit: '%',
    target: 96,
    trend: 'up',
    trendValue: 0.8,
    status: 'success',
    description: '按时通关票数/总票数×100%',
  },
  {
    id: 'delivery_timeliness',
    name: '配送及时率',
    category: 'timeliness',
    value: 97.2,
    unit: '%',
    target: 97,
    trend: 'up',
    trendValue: 1.1,
    status: 'success',
    description: '按时送达订单数/总订单数×100%',
  },
  {
    id: 'daily_transfer_response',
    name: '日常调拨配送及时响应率',
    category: 'timeliness',
    value: 98.7,
    unit: '%',
    target: 98,
    trend: 'up',
    trendValue: 0.9,
    status: 'success',
    description: '按时响应次数/总次数×100%',
  },
  {
    id: 'ticket_change_approval',
    name: '改签审批及时率',
    category: 'timeliness',
    value: 99.1,
    unit: '%',
    target: 99,
    trend: 'stable',
    trendValue: 0,
    status: 'success',
    description: '按时审批单数/总单数×100%',
  },
  {
    id: 'express_delivery_compliance',
    name: '快递妥投时效达标率',
    category: 'timeliness',
    value: 96.3,
    unit: '%',
    target: 96,
    trend: 'up',
    trendValue: 0.7,
    status: 'success',
    description: '达标快递单数/总单数×100%',
  },
];

export const qualityMetrics: Metric[] = [
  {
    id: 'inventory_accuracy',
    name: '库存准确率',
    category: 'quality',
    value: 99.3,
    unit: '%',
    target: 99.5,
    trend: 'up',
    trendValue: 0.2,
    status: 'warning',
    description: '盘点准确SKU数/总SKU数×100%',
  },
  {
    id: 'expiry_accuracy',
    name: '效期准确率',
    category: 'quality',
    value: 99.8,
    unit: '%',
    target: 99.8,
    trend: 'stable',
    trendValue: 0,
    status: 'success',
    description: '效期正确商品数/总商品数×100%',
  },
  {
    id: 'vehicle_delivery_compliance',
    name: '车辆配送运行合格率',
    category: 'quality',
    value: 98.2,
    unit: '%',
    target: 98,
    trend: 'up',
    trendValue: 0.5,
    status: 'success',
    description: '合格车次/总车次×100%',
  },
  {
    id: 'daily_transfer_compliance',
    name: '日常调拨运行合格率',
    category: 'quality',
    value: 97.5,
    unit: '%',
    target: 97,
    trend: 'up',
    trendValue: 0.8,
    status: 'success',
    description: '合格调拨单数/总单数×100%',
  },
  {
    id: 'transfer_fulfillment',
    name: '调拨满足率',
    category: 'quality',
    value: 95.6,
    unit: '%',
    target: 95,
    trend: 'up',
    trendValue: 1.2,
    status: 'success',
    description: '满足调拨需求数/总需求数×100%',
  },
];

export const getAllMetrics = (): Metric[] => {
  return [...timelinessMetrics, ...qualityMetrics];
};

export const getMetricsByCategory = (category: string): Metric[] => {
  return getAllMetrics().filter(m => m.category === category);
};

export const getMetricById = (id: string): Metric | undefined => {
  return getAllMetrics().find(m => m.id === id);
};

// 模拟门店数据
export interface Store {
  id: string;
  name: string;
  code: string;
}

export const stores: Store[] = [
  { id: '7063', name: '海南国际物流中心', code: '7063' },
  { id: '6868', name: '三亚海棠湾店', code: '6868' },
  { id: '7048', name: '新海港店', code: '7048' },
  { id: '7016', name: '三亚凤凰机场店', code: '7016' },
  { id: '6132', name: '海口美兰机场店', code: '6132' },
  { id: '6922', name: '海口日月店', code: '6922' },
  { id: '6921', name: '博鳌店', code: '6921' },
  { id: 'ecommerce', name: '电商', code: 'EC' },
  { id: 'cross-border', name: '跨境电商', code: 'CB' },
];

// 模拟预警数据
export interface Alert {
  id: string;
  level: 'danger' | 'warning' | 'success';
  store: string;
  metric: string;
  metricId: string; // 对应异常分析中的指标ID
  value: number;
  target: number;
  message: string;
}

export const alerts: Alert[] = [
  {
    id: '1',
    level: 'danger',
    store: '【6868】三亚海棠湾店',
    metric: '出库及时率',
    metricId: '出库及时率',
    value: 85.2,
    target: 95,
    message: '85.2% 低于目标95% - 存在3条超标订单未处理',
  },
  {
    id: '2',
    level: 'warning',
    store: '【7048】新海港店',
    metric: '门店提货-上架时效',
    metricId: '门店提货-上架时效',
    value: 28.3,
    target: 24,
    message: '28.3小时 超出标准4.3小时 - 已标记物流延误',
  },
  {
    id: '3',
    level: 'danger',
    store: '【6132】海口美兰机场店',
    metric: '配送及时率',
    metricId: '配送及时率',
    value: 87.5,
    target: 95,
    message: '87.5% 低于目标95% - 系统故障导致延误',
  },
  {
    id: '4',
    level: 'warning',
    store: '【6921】博鳌店',
    metric: '入库及时率',
    metricId: '入库及时率',
    value: 91.2,
    target: 95,
    message: '91.2% 接近预警线 - 建议关注入库流程',
  },
  {
    id: '5',
    level: 'warning',
    store: '【7052】跨境电商',
    metric: '通关及时率',
    metricId: '通关及时率',
    value: 89.8,
    target: 95,
    message: '89.8% 接近预警线 - 海关系统升级影响',
  },
  {
    id: '6',
    level: 'danger',
    store: '【7017】电商',
    metric: '调拨满足率',
    metricId: '调拨满足率',
    value: 82.3,
    target: 95,
    message: '82.3% 严重低于目标 - 库存紧张需补货',
  },
];
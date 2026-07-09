// 明细表格数据
export interface MonthlyData {
  dimension: string;
  store: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  avg: number;
  trend: 'up' | 'down' | 'stable';
}

export function getDetailTableData(metricId: string): MonthlyData[] {
  // 根据不同指标返回不同的数据
  const baseData: MonthlyData[] = [
    {
      dimension: '入库时效',
      store: '三亚',
      jan: 96.2,
      feb: 95.8,
      mar: 97.1,
      apr: 96.5,
      may: 97.2,
      jun: 96.8,
      jul: 97.5,
      aug: 96.9,
      sep: 97.3,
      oct: 97.0,
      nov: 96.5,
      dec: 97.2,
      avg: 96.8,
      trend: 'up',
    },
    {
      dimension: '入库时效',
      store: '新海港',
      jan: 92.5,
      feb: 93.2,
      mar: 91.8,
      apr: 93.5,
      may: 92.9,
      jun: 93.1,
      jul: 92.8,
      aug: 93.4,
      sep: 92.7,
      oct: 93.0,
      nov: 92.5,
      dec: 93.2,
      avg: 92.9,
      trend: 'stable',
    },
    {
      dimension: '入库时效',
      store: '海口',
      jan: 98.1,
      feb: 97.5,
      mar: 98.3,
      apr: 97.9,
      may: 98.5,
      jun: 98.2,
      jul: 98.7,
      aug: 98.1,
      sep: 98.4,
      oct: 98.0,
      nov: 97.8,
      dec: 98.3,
      avg: 98.1,
      trend: 'up',
    },
    {
      dimension: '入库时效',
      store: '琼海',
      jan: 95.2,
      feb: 95.8,
      mar: 94.9,
      apr: 96.1,
      may: 95.5,
      jun: 96.3,
      jul: 95.8,
      aug: 96.0,
      sep: 95.7,
      oct: 96.2,
      nov: 95.4,
      dec: 96.0,
      avg: 95.7,
      trend: 'up',
    },
    {
      dimension: '入库时效',
      store: '万宁',
      jan: 93.8,
      feb: 94.2,
      mar: 93.5,
      apr: 94.8,
      may: 93.9,
      jun: 94.5,
      jul: 94.1,
      aug: 94.7,
      sep: 93.8,
      oct: 94.3,
      nov: 93.7,
      dec: 94.5,
      avg: 94.1,
      trend: 'up',
    },
  ];

  return baseData;
}

// 指标树形结构
export interface MetricTreeNode {
  id: string;
  label: string;
  children?: MetricTreeNode[];
  metricId?: string;
}

export const metricTree: MetricTreeNode[] = [
  {
    id: 'timeliness',
    label: '时效类指标',
    children: [
      {
        id: 'inbound-outbound',
        label: '入库/出库时效',
        children: [
          { id: 'inventory-inbound-rate', label: '入库时效达标率（订货端）', metricId: 'inventory-inbound-rate' },
          { id: 'inventory-outbound-rate', label: '出库时效达标率（分货端）', metricId: 'inventory-outbound-rate' },
          { id: 'warehouse-inbound-rate', label: '监管仓入库及时率', metricId: 'warehouse-inbound-rate' },
          { id: 'warehouse-outbound-rate', label: '监管仓出库及时率', metricId: 'warehouse-outbound-rate' },
        ],
      },
      {
        id: 'customs',
        label: '通关时效',
        children: [
          { id: 'first-line-customs-rate', label: '一线通关及时率', metricId: 'first-line-customs-rate' },
          { id: 'second-line-customs-rate', label: '二线通关及时率', metricId: 'second-line-customs-rate' },
          { id: 'customs-clearance-rate', label: '通关及时率', metricId: 'customs-clearance-rate' },
        ],
      },
      {
        id: 'delivery',
        label: '配送时效',
        children: [
          { id: 'delivery-timeliness-rate', label: '配送及时率', metricId: 'delivery-timeliness-rate' },
          { id: 'express-delivery-rate', label: '快递妥投时效达标率', metricId: 'express-delivery-rate' },
          { id: 'daily-transfer-response-rate', label: '日常调拨配送及时响应率', metricId: 'daily-transfer-response-rate' },
        ],
      },
      {
        id: 'store-timeliness',
        label: '门店时效',
        children: [
          { id: 'store-pickup-shelf-time', label: '门店提货-上架时效', metricId: 'store-pickup-shelf-time' },
          { id: 'store-avg-pickup-time', label: '门店平均提货时效', metricId: 'store-avg-pickup-time' },
        ],
      },
      {
        id: 'other-timeliness',
        label: '其他时效',
        children: [
          { id: 'reschedule-approval-rate', label: '改签审批及时率', metricId: 'reschedule-approval-rate' },
        ],
      },
    ],
  },
  {
    id: 'accuracy',
    label: '准确率指标',
    children: [
      { id: 'inventory-accuracy-rate', label: '库存准确率', metricId: 'inventory-accuracy-rate' },
      { id: 'expiry-accuracy-rate', label: '效期准确率', metricId: 'expiry-accuracy-rate' },
    ],
  },
  {
    id: 'operation',
    label: '运营指标',
    children: [
      { id: 'vehicle-delivery-qualified-rate', label: '车辆配送运行合格率', metricId: 'vehicle-delivery-qualified-rate' },
      { id: 'daily-transfer-qualified-rate', label: '日常调拨运行合格率', metricId: 'daily-transfer-qualified-rate' },
      { id: 'transfer-fulfillment-rate', label: '调拨满足率', metricId: 'transfer-fulfillment-rate' },
    ],
  },
];

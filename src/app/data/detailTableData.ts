export type DetailDimension = '票数' | '件数';
type DetailKind = 'duration' | 'count' | 'rate';

export interface DetailRow {
  segment: '订货段' | '分货段';
  store: string;
  category: string;
  metric: string;
  kind: DetailKind;
  targetDisplay: string;
  dailyMean: number | null;
  monthlyMean: number | null;
  months: Array<number | null>;
  trend: 'up' | 'down' | 'stable';
}

const months = (values: number[]) => values;

const dimensionData: Record<DetailDimension, DetailRow[]> = {
  票数: [
    { segment: '订货段', store: '三亚店', category: '香化', metric: '平均时效', kind: 'duration', targetDisplay: '3.88D', dailyMean: 2.82, monthlyMean: 2.84, months: months([2.9, 2.8, 2.7, 2.9, 2.8, 2.7, 2.9, 2.8, 2.9, 2.8, 2.9, 2.9]), trend: 'stable' },
    { segment: '订货段', store: '三亚店', category: '香化', metric: '大于目标值的票数', kind: 'count', targetDisplay: '3.88D', dailyMean: 18, monthlyMean: 19, months: months([22, 21, 20, 21, 19, 18, 20, 19, 18, 17, 16, 17]), trend: 'down' },
    { segment: '订货段', store: '三亚店', category: '香化', metric: '总票数', kind: 'count', targetDisplay: '-', dailyMean: 286, monthlyMean: 286, months: months([280, 265, 270, 285, 260, 255, 265, 270, 250, 245, 240, 315]), trend: 'up' },
    { segment: '订货段', store: '三亚店', category: '香化', metric: '达标率', kind: 'rate', targetDisplay: '70%', dailyMean: 93.4, monthlyMean: 93.4, months: months([92.1, 92.5, 93.0, 92.6, 93.2, 94.0, 93.4, 93.0, 93.8, 94.1, 94.8, 94.0]), trend: 'up' },
    { segment: '分货段', store: '三亚店', category: '香化', metric: '平均时效', kind: 'duration', targetDisplay: '0.17D', dailyMean: 0.14, monthlyMean: 0.14, months: months([0.15, 0.14, 0.13, 0.15, 0.14, 0.14, 0.13, 0.14, 0.14, 0.13, 0.14, 0.14]), trend: 'stable' },
    { segment: '分货段', store: '三亚店', category: '香化', metric: '大于目标值的票数', kind: 'count', targetDisplay: '0.17D', dailyMean: 9, monthlyMean: 9, months: months([12, 11, 10, 11, 9, 8, 10, 9, 8, 7, 6, 8]), trend: 'down' },
    { segment: '分货段', store: '三亚店', category: '香化', metric: '总票数', kind: 'count', targetDisplay: '-', dailyMean: 286, monthlyMean: 286, months: months([280, 265, 270, 285, 260, 255, 265, 270, 250, 245, 240, 315]), trend: 'up' },
    { segment: '分货段', store: '三亚店', category: '香化', metric: '达标率', kind: 'rate', targetDisplay: '97%', dailyMean: 96.8, monthlyMean: 96.8, months: months([95.7, 95.8, 96.3, 96.1, 96.5, 97.0, 96.7, 96.8, 97.2, 97.4, 97.5, 96.8]), trend: 'up' },
  ],
  件数: [],
};

dimensionData.件数 = dimensionData.票数.map(row => ({
  ...row,
  dailyMean: row.kind === 'duration' || row.kind === 'rate' ? (row.dailyMean === null ? null : row.dailyMean + (row.kind === 'duration' ? 0.08 : 0.4)) : row.dailyMean === null ? null : Math.round(row.dailyMean * 1.8),
  monthlyMean: row.kind === 'duration' || row.kind === 'rate' ? (row.monthlyMean === null ? null : row.monthlyMean + (row.kind === 'duration' ? 0.08 : 0.4)) : row.monthlyMean === null ? null : Math.round(row.monthlyMean * 1.8),
  months: row.months.map(value => value === null ? null : row.kind === 'duration' ? value + 0.08 : row.kind === 'rate' ? value + 0.4 : Math.round(value * 1.8)),
}));

export function getDetailTableData(_metricId: string, dimension: DetailDimension = '票数'): DetailRow[] {
  return dimensionData[dimension];
}

export interface MetricTreeNode { id: string; label: string; children?: MetricTreeNode[]; metricId?: string; }

export const metricTree: MetricTreeNode[] = [
  { id: 'timeliness', label: '时效类指标', children: [{ id: 'inbound-outbound', label: '入库/出库时效', children: [
    { id: 'inventory-inbound-rate', label: '入库时效达标率（订货端）', metricId: 'inventory-inbound-rate' },
    { id: 'inventory-outbound-rate', label: '出库时效达标率（分货端）', metricId: 'inventory-outbound-rate' },
  ] }] },
  { id: 'accuracy', label: '准确率指标', children: [{ id: 'inventory-accuracy-rate', label: '库存准确率', metricId: 'inventory-accuracy-rate' }] },
];

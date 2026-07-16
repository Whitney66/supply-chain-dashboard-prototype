// 目标值维护数据
// Source: 20260529门店映射关系表+目标值维护.xlsx / Sheet2 目标值维护

export type TargetUnit = 'day' | 'hour' | 'ratio';

export interface TargetValueRule {
  businessLink: string;
  businessNode: string;
  metric: string;
  store: string;
  rawTarget: string;
  targetValue: number;
  targetUnit: TargetUnit;
  targetDays: number | null;
  targetDisplay: string;
}

export const targetValueRules: TargetValueRule[] = [
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "香化仓",
    rawTarget: "14（天）",
    targetValue: 14,
    targetUnit: "day",
    targetDays: 14,
    targetDisplay: "14D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "全链路订货时效达标率（一盘货）",
    store: "香化仓",
    rawTarget: "0.7",
    targetValue: 0.7,
    targetUnit: "ratio",
    targetDays: null,
    targetDisplay: "70%"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "7（天）",
    targetValue: 7,
    targetUnit: "day",
    targetDays: 7,
    targetDisplay: "7D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "76",
    targetValue: 76,
    targetUnit: "hour",
    targetDays: 3.17,
    targetDisplay: "3.17D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "一盘货",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "一线通关时效达标率",
    store: "一盘货",
    rawTarget: "0.65",
    targetValue: 0.65,
    targetUnit: "ratio",
    targetDays: null,
    targetDisplay: "65%"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "72",
    targetValue: 72,
    targetUnit: "hour",
    targetDays: 3,
    targetDisplay: "3D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "香化仓",
    rawTarget: "2.5（天）",
    targetValue: 2.5,
    targetUnit: "day",
    targetDays: 2.5,
    targetDisplay: "2.5D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "2.5（天）",
    targetValue: 2.5,
    targetUnit: "day",
    targetDays: 2.5,
    targetDisplay: "2.5D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "香化仓",
    rawTarget: "8",
    targetValue: 8,
    targetUnit: "hour",
    targetDays: 0.33,
    targetDisplay: "0.33D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.1.1全链路订货平均时长（一盘货）",
    store: "全部",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "1.订货段",
    businessNode: "1.1-一盘货",
    metric: "1.2.1全链路入库平均时长（直发）",
    store: "三亚店",
    rawTarget: "93",
    targetValue: 93,
    targetUnit: "hour",
    targetDays: 3.88,
    targetDisplay: "3.88D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "香化仓",
    rawTarget: "7",
    targetValue: 7,
    targetUnit: "hour",
    targetDays: 0.29,
    targetDisplay: "0.29D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "仓库出库时效达标率",
    store: "香化仓",
    rawTarget: "0.97",
    targetValue: 0.97,
    targetUnit: "ratio",
    targetDays: null,
    targetDisplay: "97%"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "12",
    targetValue: 12,
    targetUnit: "hour",
    targetDays: 0.5,
    targetDisplay: "0.5D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "76",
    targetValue: 76,
    targetUnit: "hour",
    targetDays: 3.17,
    targetDisplay: "3.17D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "香化仓",
    rawTarget: "3",
    targetValue: 3,
    targetUnit: "hour",
    targetDays: 0.13,
    targetDisplay: "0.13D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "7",
    targetValue: 7,
    targetUnit: "hour",
    targetDays: 0.29,
    targetDisplay: "0.29D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "三亚店",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "门店提货至上架时效达标率",
    store: "三亚店",
    rawTarget: "0.58",
    targetValue: 0.58,
    targetUnit: "ratio",
    targetDays: null,
    targetDisplay: "58%"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "2.分货段",
    businessNode: "2.1一盘货-门店监管仓",
    metric: "2.1.1全链路分货平均时长",
    store: "全部",
    rawTarget: "4",
    targetValue: 4,
    targetUnit: "hour",
    targetDays: 0.17,
    targetDisplay: "0.17D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.1.1监管仓-周转仓调拨平均时长",
    store: "三亚店",
    rawTarget: "24",
    targetValue: 24,
    targetUnit: "hour",
    targetDays: 1,
    targetDisplay: "1D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.1.1监管仓-周转仓调拨平均时长",
    store: "全部",
    rawTarget: "24",
    targetValue: 24,
    targetUnit: "hour",
    targetDays: 1,
    targetDisplay: "1D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.1.1监管仓-周转仓调拨平均时长",
    store: "全部",
    rawTarget: "24",
    targetValue: 24,
    targetUnit: "hour",
    targetDays: 1,
    targetDisplay: "1D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.1.1监管仓-周转仓调拨平均时长",
    store: "全部",
    rawTarget: "24",
    targetValue: 24,
    targetUnit: "hour",
    targetDays: 1,
    targetDisplay: "1D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.1.1监管仓-周转仓调拨平均时长",
    store: "全部",
    rawTarget: "24",
    targetValue: 24,
    targetUnit: "hour",
    targetDays: 1,
    targetDisplay: "1D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.1.1监管仓-周转仓调拨平均时长",
    store: "全部",
    rawTarget: "24",
    targetValue: 24,
    targetUnit: "hour",
    targetDays: 1,
    targetDisplay: "1D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "三亚店",
    rawTarget: "118",
    targetValue: 118,
    targetUnit: "hour",
    targetDays: 4.92,
    targetDisplay: "4.92D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "全部",
    rawTarget: "81",
    targetValue: 81,
    targetUnit: "hour",
    targetDays: 3.38,
    targetDisplay: "3.38D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "全部",
    rawTarget: "82",
    targetValue: 82,
    targetUnit: "hour",
    targetDays: 3.42,
    targetDisplay: "3.42D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "全部",
    rawTarget: "83",
    targetValue: 83,
    targetUnit: "hour",
    targetDays: 3.46,
    targetDisplay: "3.46D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "全部",
    rawTarget: "84",
    targetValue: 84,
    targetUnit: "hour",
    targetDays: 3.5,
    targetDisplay: "3.5D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "全部",
    rawTarget: "110",
    targetValue: 110,
    targetUnit: "hour",
    targetDays: 4.58,
    targetDisplay: "4.58D"
  },
  {
    businessLink: "3.门店段",
    businessNode: "3.1监管仓-周转仓",
    metric: "3.3.1全链路分拣仓入库平均时长",
    store: "全部",
    rawTarget: "85",
    targetValue: 85,
    targetUnit: "hour",
    targetDays: 3.54,
    targetDisplay: "3.54D"
  }
];

export const durationTargetRules = targetValueRules.filter(rule => rule.targetDays !== null);

const metricAliases: Record<string, string[]> = {
  'inventory-inbound-rate': ['入库', '全链路订货平均时长', '订货平均时长'],
  'inventory-outbound-rate': ['出库', '分货', '全链路'],
  'first-line-customs-rate': ['一线通关'],
  'second-line-customs-rate': ['二线通关'],
  'customs-clearance-rate': ['通关'],
  'delivery-timeliness-rate': ['配送', '调拨'],
  'express-delivery-rate': ['快递', '妥投'],
  'daily-transfer-response-rate': ['日常调拨', '响应'],
  'store-pickup-shelf-time': ['门店', '上架', '提货'],
  'store-avg-pickup-time': ['门店', '提货'],
  'warehouse-inbound-rate': ['监管仓', '入库'],
  'warehouse-outbound-rate': ['监管仓', '出库'],
};

function includesAny(value: string, keywords: string[]) {
  return keywords.some(keyword => value.includes(keyword));
}

export function getDurationTargetDays(metricId: string, storeName?: string): number | null {
  const aliases = metricAliases[metricId] ?? [];
  const matched = durationTargetRules.find(rule => includesAny(rule.metric, aliases) && (!storeName || rule.store === storeName || rule.store === '全部'));
  return matched?.targetDays ?? null;
}

export function getDurationTargetDisplay(metricId: string, storeName?: string): string {
  const days = getDurationTargetDays(metricId, storeName);
  return days === null ? '-' : `${days}D`;
}

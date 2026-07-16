import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, DollarSign, Info, Download } from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  Funnel,
  FunnelChart,
  ReferenceLine
} from 'recharts';
import { SmartProcessFlow } from '@/app/components/SmartProcessFlow';
import { QualityFilterBar, type QualityFilterKey } from './QualityFilterBar';
import processFlowImage from 'figma:asset/75c8af22435673fc42e09cdfe9d0c0909e68e60a.png';
import deliveryFlowImage from 'figma:asset/d34f09beeb5a1ff43cd1cc3f1e55faa50258dac7.png';
import storeFlowImage from 'figma:asset/690966a698cce8b2136a201cf1ccd257056e938b.png';
import orderFlowImage from 'figma:asset/6684e4d6d4252dbef79ebfd316d71bb05610e328.png';
import distributionFlowImage from 'figma:asset/21942260fc8b61ea9143602f901447073b0b7865.png';
import directStoreFlowImage from 'figma:asset/ca5ba05797335dc4d4766e2dde801a42b0e527d3.png';
import store11FlowImage from 'figma:asset/1b1c9b67555eba79cc63eef9243febc16da4ecc9.png';
import store21FlowImage from 'figma:asset/4cdf05309a88e859603180dd3ff98b56df2c647d.png';
import store31FlowImage from 'figma:asset/b98c1b050ad39b9fc3ee1f5d3f7512bde351af31.png';
import store41FlowImage from 'figma:asset/d8e1c06c88f6323602a920e3cb90163c1527c803.png';
import store51FlowImage from 'figma:asset/44a5403dd61abd4268ef68d971cf5fb25b3430bf.png';
import store61FlowImage from 'figma:asset/00265181533ed7f066079bc09bf379711fd7732c.png';
import store71FlowImage from 'figma:asset/099c9d93e7f20b13fcd791bf930aad611468bf77.png';
import store81FlowImage from 'figma:asset/ffbf9d483bfea4f0f57a88c416b67cb1dbf71eda.png';
import store22FlowImage from 'figma:asset/36fe4c349cba6f3d04bed8ba21461fec1b205255.png';

type TabType = 'timeliness' | 'quality' | 'cost' | 'efficiency';

export function MetricsOverview() {
  const [activeTab, setActiveTab] = useState<TabType>('timeliness');
  
  // 时间维度和计量维度状态
  const [timeDimension, setTimeDimension] = useState<'month' | 'week'>('month');
  const [metricDimension, setMetricDimension] = useState<'ticket' | 'piece'>('ticket');
  // 视图维度：时间趋势 vs 仓库对比
  const [viewDimension, setViewDimension] = useState<'time' | 'warehouse'>('time');
  // 订货/分货/门店段切换
  const [orderDeliveryTab, setOrderDeliveryTab] = useState<'order' | 'delivery' | 'store'>('order');
  // 质量指标查询过滤 - 默认只显示调拨满足率模块
  const [qualityFilter, setQualityFilter] = useState<QualityFilterKey[]>(['transfer']);

  const tabs = [
    { id: 'timeliness' as TabType, label: '时效指标', icon: Activity },
    { id: 'quality' as TabType, label: '质量指标', icon: PieChart },
    { id: 'cost' as TabType, label: '成本指标', icon: DollarSign },
    { id: 'efficiency' as TabType, label: '效率指标', icon: BarChart3 },
  ];

  // 时效指标数据
  const timelinessData = {
    // 一盘货入库时效达
    inboundCompliance: {
      alcohol: { le14: 92.3, le10: 87.1 },
      cosmetics: { le14: 91.8, le10: 86.5 }
    },
    // 一盘货出库时效达标率
    outboundCompliance: {
      alcohol: 94.5,
      cosmetics: 94.1
    },
    // 通关时效（天数）
    customsTime: {
      firstLine: { tickets: 2.4, pieces: 2.2 },
      secondLine: { tickets: 1.9, pieces: 1.7 }
    },
    // 仓-门店入库及时率
    warehouseInbound: {
      supervision: { tickets: 96.3, pieces: 96.7 },
      turnover: { tickets: 95.0, pieces: 95.4 },
      sorting: { tickets: 97.6, pieces: 98.0 }
    },
    // 仓-门店出库及时率
    warehouseOutbound: {
      supervision: { tickets: 98.1, pieces: 98.5 },
      turnover: { tickets: 97.4, pieces: 97.8 },
      sorting: { tickets: 99.0, pieces: 99.2 },
      reservation: { tickets: 96.6, pieces: 97.0 }
    },
    // 门店指标
    store: {
      pickupToShelf: 1.2,
      avgPickup: 3.5,
      customsRate: { tickets: 95.2, pieces: 95.6 },
      deliveryRate: { tickets: 96.5, pieces: 96.9 },
      transferResponse: { tickets: 94.6, pieces: 95.0 },
      vehicleQuality: 98.9,
      transferQuality: 97.2,
      reassignmentRate: { tickets: 93.4, pieces: 93.8 },
      expressDelivery: 91.3
    }
  };

  // 质量指标数据
  const qualityData = {
    transferSatisfaction: {
      top300: { value: 95.2, target: 97, change: 0.5 },
      nonTop300: { value: 91.5, target: 93, change: -0.3 }
    },
    inventoryAccuracy: {
      unified: 99.2,
      warehouse: 98.8,
      store: 97.6
    },
    expiryAccuracy: {
      unified: 98.4,
      warehouse: 97.9,
      store: 96.7
    },
    expressDelivery: {
      damageRate: { value: 0.002, target: 0.001, change: 0.0002 },
      lossRate: { value: 0.001, target: 0.001, change: 0.0001 }
    },
    complaints: {
      expressResponsible: { value: 0.002, target: 0.001, change: 0.0002 },
      logisticsResponsible: { value: 0.002, target: 0.001, change: 0.0003 }
    }
  };

  // 环形图数据 - 一货入库效
  const inboundPieData = [
    { name: '酒水≤14天', value: 92.3, color: '#3b82f6' },
    { name: '香化≤14天', value: 91.8, color: '#10b981' },
    { name: '酒水≤10天', value: 87.1, color: '#8b5cf6' },
    { name: '香化≤10天', value: 86.5, color: '#f59e0b' },
  ];

  // 仓库及时率对比数据
  const warehouseComparisonData = [
    {
      name: '监管仓',
      入库单: 96.3,
      入库件: 96.7,
      出库单: 98.1,
      出库件: 98.5
    },
    {
      name: '周转仓',
      入库单: 95.0,
      入库件: 95.4,
      出库单: 97.4,
      出库件: 97.8
    },
    {
      name: '分拣仓',
      入库单: 97.6,
      入库件: 98.0,
      出库单: 99.0,
      出库件: 99.2
    },
    {
      name: '预定仓',
      入库单: 0,
      入库件: 0,
      出库单: 96.6,
      出库件: 97.0
    }
  ];

  // 仓-门店时效数据（按月） - Fixed encoding
  const warehouseMonthlyData = [
    { time: '1月', 入库单: 95.8, 入库件: 96.2, 出库单: 97.8, 出库件: 98.2 },
    { time: '2月', 入库单: 96.0, 入库件: 96.4, 出库单: 97.9, 出库件: 98.3 },
    { time: '3月', 入库单: 96.1, 入库件: 96.5, 出库单: 98.0, 出库件: 98.4 },
    { time: '4月', 入库单: 96.3, 入库件: 96.7, 出库单: 98.1, 出库件: 98.5 },
    { time: '5月', 入库单: 96.4, 入库件: 96.8, 出库单: 98.2, 出库件: 98.6 },
    { time: '6月', 入库单: 96.5, 入库件: 96.9, 出库单: 98.3, 出库件: 98.7 },
    { time: '7月', 入库单: 96.6, 入库件: 97.0, 出库单: 98.4, 出库件: 98.8 },
    { time: '8月', 入库单: 96.7, 入库件: 97.1, 出库单: 98.5, 出库件: 98.9 },
    { time: '9月', 入库单: 96.8, 入库件: 97.2, 出库单: 98.6, 出库件: 99.0 },
    { time: '10月', 入库单: 96.9, 入库件: 97.3, 出库单: 98.7, 出库件: 99.1 },
    { time: '11月', 入库单: 97.0, 入库件: 97.4, 出库单: 98.8, 出库件: 99.2 },
    { time: '12月', 入库单: 97.1, 入库件: 97.5, 出库单: 98.9, 出库件: 99.3 }
  ];

  // 仓-门店时效数据（按周）
  const warehouseWeeklyData = [
    { time: 'W1', 入库单: 95.8, 入库件: 96.2, 出库单: 97.6, 出库件: 98.0 },
    { time: 'W2', 入库单: 96.0, 入库件: 96.4, 出库单: 97.8, 出库件: 98.2 },
    { time: 'W3', 入库单: 96.2, 入库件: 96.6, 出库单: 98.0, 出库件: 98.4 },
    { time: 'W4', 入库单: 96.4, 入库件: 96.8, 出库单: 98.2, 出库件: 98.6 },
    { time: 'W5', 入库单: 96.6, 入库件: 97.0, 出库单: 98.4, 出库件: 98.8 },
    { time: 'W6', 入库单: 96.8, 入库件: 97.2, 出库单: 98.6, 出库件: 99.0 },
    { time: 'W7', 入库单: 97.0, 入库件: 97.4, 出库单: 98.8, 出库件: 99.2 }
  ];

  // 门店时效趋势数据（近7周）
  const storeTrendData = [
    { week: 'W1', 通关: 94.8, 配送: 96.2, 调拨响应: 94.2 },
    { week: 'W2', 通关: 95.0, 配送: 96.4, 调拨响应: 94.5 },
    { week: 'W3', 通关: 95.1, 配送: 96.5, 调拨响应: 94.6 },
    { week: 'W4', 通关: 95.2, 配送: 96.6, 调拨响应: 94.7 },
    { week: 'W5', 通关: 95.3, 配送: 96.7, 调拨响应: 94.8 },
    { week: 'W6', 通关: 95.4, 配送: 96.8, 调拨响应: 94.9 },
    { week: 'W7', 通关: 95.4, 配送: 96.7, 调拨响应: 94.8 }
  ];

  // 质量指标环形图数据
  const qualityPieData = [
    { name: '一次货', value: 99.5, color: '#3b82f6' },
    { name: '仓库', value: 96.8, color: '#10b981' },
    { name: '门店', value: 92.3, color: '#f59e0b' }
  ];

  // 质量指标综合对比
  const qualityComparisonData = [
    {
      category: '一盘货',
      库存准确率: 99.2,
      效期准确率: 98.4
    },
    {
      category: '仓库',
      库存准确率: 98.8,
      效期准确率: 97.9
    },
    {
      category: '门店',
      库存准确率: 97.6,
      效期准确率: 96.7
    }
  ];

  // 渲染时效指标Tab
  const renderTimelinessTab = () => {
    return (
    <div className="space-y-6">
      {/* 第一行：时效变化趋势 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded"></div>
          <div className="relative inline-flex items-center group">
            时效变化趋势
            <div className="ml-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
              ⑪
            </div>
            <div className="absolute left-0 top-full mt-2 w-[680px] bg-gray-900 text-white text-xs rounded-lg p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
              <div className="font-semibold mb-2">批注⑪</div>
              <div className="text-gray-300 space-y-2">
                <div><span className="font-medium text-white">1. 分割线</span>用于区分原始指标以及数据分析模块，为用户新增需求。</div>
                <div><span className="font-medium text-white">2. 【上期值】</span>统一表述，对应环比计算逻辑：环比增长率 =（本期值 - 上期值）/ 上期值 × 100%。</div>
                <div><span className="font-medium text-white">3. 【同期值】</span>通常指去年同期的指标数值，对应同比计算逻辑：同比增长率 =（本期值 - 同期值）/ 同期值 × 100%。</div>
                <div className="font-medium text-white">4. 针对不同时间筛选场景下的取值逻辑：</div>
                <div className="ml-3 space-y-1.5">
                  <div><span className="font-medium text-white">场景一：跨天/跨月（普通情况）</span></div>
                  <div className="ml-2">本期：2025年1月10日 - 2025年1月20日（共11天）</div>
                  <div className="ml-2">上期值：往前推一个月对应天数 → 2024年12月10日 - 2024年12月20日（共11天）</div>
                  <div className="ml-2">同期值：往前推一年对应日期 → 2024年1月10日 - 2024年1月20日（共11天）</div>
                  <div className="mt-1.5"><span className="font-medium text-white">场景二：跨年（跨自然年）</span></div>
                  <div className="ml-2">本期：2025年1月1日 - 2025年1月31日（整个1月）</div>
                  <div className="ml-2">上期值：上一个连续周期 → 2024年12月1日 - 2024年12月31日（整个12月）</div>
                  <div className="ml-2">同期值：去年同周期 → 2024年1月1日 - 2024年1月31日（整个去年1月）</div>
                  <div className="mt-1.5"><span className="font-medium text-white">场景三：</span></div>
                  <div className="ml-2">本期：2024年6月1日 - 2025年5月31日</div>
                  <div className="ml-2">上期值：2023年6月1日 - 2024年5月31日</div>
                  <div className="ml-2">同期值：2023年6月1日 - 2024年5月31日</div>
                </div>
              </div>
            </div>
          </div>
        </h3>
        <div className="overflow-visible">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-gray-900 border-b border-gray-200">指标名称</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 w-16">品类</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200">
                  <div className="relative inline-flex items-center group justify-center">
                    目标值
                    <div className="ml-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
                      ⑫
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-1">批注⑫</div>
                      <div className="text-gray-300">目标值取值用户填报表，有则展示，没有则展示为"-"</div>
                    </div>
                  </div>
                </th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200">当前平均值</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-r-2 border-gray-300">件数达标率</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200">上期值</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200">环比</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200">同期值</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200">同比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* 全链路订货平均时效（一盘货）- 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>全链路订货平均时效（一盘货）</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：订单创建</div>
                      <div className="text-gray-300">结束节点：门店收货确认</div>
                      <div className="text-gray-300 mt-1">公式：收货时间 - 订单创建时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">10.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">12.3D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">77.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">12.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-4.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">13.6D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-9.8%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">11.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">13.1D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">74.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">13.5D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-3.0%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">14.2D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-7.8%</span></td>
              </tr>
              {/* 一线通关平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>一线通关平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：到达一线口岸</div>
                      <div className="text-gray-300">结束节点：一线通关完成</div>
                      <div className="text-gray-300 mt-1">公式：通关完成时间 - 到达时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.4D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">80.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.5D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-4.0%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-14.3%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.9D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">76.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.1D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-6.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.4D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-14.7%</span></td>
              </tr>
              {/* 提货至海综保平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>提货至海综保平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：提货完成</div>
                      <div className="text-gray-300">结束节点：海综保入库</div>
                      <div className="text-gray-300 mt-1">公式：海综保入库时间 - 提货时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.8D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">83.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-5.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.1D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-14.3%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.3D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">79.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.4D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-4.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.6D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-11.5%</span></td>
              </tr>
              {/* 仓库入库平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>仓库入库平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：货物到达仓库</div>
                      <div className="text-gray-300">结束节点：入库上架完成</div>
                      <div className="text-gray-300 mt-1">公式：上架时间 - 到达时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.2D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">86.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.3D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-7.7%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.5D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-20.0%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.7D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">82.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-5.6%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.0D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-15.0%</span></td>
              </tr>
              {/* 全链路入库平均时效（直发）- 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>全链路入库平均时效（直发）</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：订单创建</div>
                      <div className="text-gray-300">结束节点：仓库入库完成</div>
                      <div className="text-gray-300 mt-1">公式：入库时间 - 订单创建时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.2D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">71.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.6D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-4.7%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">9.1D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-9.9%</span></td>
              </tr>
              {/* 全链路分货平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>全链路分货平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：分货单创建</div>
                      <div className="text-gray-300">结束节点：门店签收</div>
                      <div className="text-gray-300 mt-1">公式：签收时间 - 分货单创建时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">15.2D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">62.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">14.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-red-600 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />+2.6%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">15.5D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-2.0%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">16.4D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">59.7%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">15.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-red-600 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />+3.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">16.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-2.4%</span></td>
              </tr>
              {/* 仓库出库平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>仓库出库平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：出库指令下发</div>
                      <div className="text-gray-300">结束节点：出库完成</div>
                      <div className="text-gray-300 mt-1">公式：出库完成时间 - 指令时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.7D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">88.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-12.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-22.2%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.8D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">85.6%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-11.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.0D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-20.0%</span></td>
              </tr>
              {/* 二线通关平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>二线通关平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：到达二线口岸</div>
                      <div className="text-gray-300">结束节点：二线通关完成</div>
                      <div className="text-gray-300 mt-1">公式：通关完成时间 - 到达时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.7D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">84.7%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-5.6%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.0D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-15.0%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.2D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">81.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.4D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-8.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.6D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-15.4%</span></td>
              </tr>
              {/* 门店提货至上架平均时效 - 香化/酒水 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700 align-middle" rowSpan={2}>
                  <div className="flex items-center gap-2 group relative">
                    <span>门店提货至上架平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：门店提货</div>
                      <div className="text-gray-300">结束节点：商品上架</div>
                      <div className="text-gray-300 mt-1">公式：上架时间 - 提货时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">香化</span></td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.1D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">85.7%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.3D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-9.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-23.8%</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center"><span className="inline-block px-1.5 py-0.5 bg-gray-50 text-gray-900 border border-gray-200 rounded text-xs">酒水</span></td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.6D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">82.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.8D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-7.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.1D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-16.1%</span></td>
              </tr>
              {/* 监管仓-周转仓调拨平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>监管仓-周转仓调拨平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：监管仓出库</div>
                      <div className="text-gray-300">结束节点：周转仓入库</div>
                      <div className="text-gray-300 mt-1">公式：周转仓入库时间 - 监管仓出库时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.4D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">82.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.5D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-2.9%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-11.8%</span></td>
              </tr>
              {/* 周转仓-卖场调拨平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>周转仓-卖场调拨平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：周转仓出库</div>
                      <div className="text-gray-300">结束节点：卖场入库</div>
                      <div className="text-gray-300 mt-1">公式：卖场入库时间 - 周转仓出库时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.8D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">71.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.6D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-red-600 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />+4.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-2.1%</span></td>
              </tr>
              {/* 直入直出全链路平均时效（监管仓-卖场）- 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>直入直出全链路平均时效（监管仓-卖场）</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：监管仓入库</div>
                      <div className="text-gray-300">结束节点：卖场上架</div>
                      <div className="text-gray-300 mt-1">公式：上架时间 - 入库时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.7D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">75.8%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-3.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.3D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-9.5%</span></td>
              </tr>
              {/* 卖场-分拣仓入库平均时效-免税预定 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>卖场-分拣仓入库平均时效-免税预定</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：卖场出库</div>
                      <div className="text-gray-300">结束节点：分拣仓入库</div>
                      <div className="text-gray-300 mt-1">公式：分拣仓入库时间 - 卖场出库时间（免税预定渠道）</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.9D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">88.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.0D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-5.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.3D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-15.8%</span></td>
              </tr>
              {/* 卖场-分拣仓入库平均时效-门店 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>卖场-分拣仓入库平均时效-门店</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：卖场出库</div>
                      <div className="text-gray-300">结束节点：分拣仓入库</div>
                      <div className="text-gray-300 mt-1">公式：分拣仓入库时间 - 卖场出库时间（门店渠道）</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.0D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">86.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.1D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-4.8%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.4D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-16.7%</span></td>
              </tr>
              {/* 邮寄全链路平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>邮寄全链路平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：分拣仓发货</div>
                      <div className="text-gray-300">结束节点：顾客签收</div>
                      <div className="text-gray-300 mt-1">公式：签收时间 - 分拣仓发货时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.6D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">83.9%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.9D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-5.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-12.5%</span></td>
              </tr>
              {/* 提货点提货全链路平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>提货点提货全链路平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：分拣仓配送出库</div>
                      <div className="text-gray-300">结束节点：提货点提货完成</div>
                      <div className="text-gray-300 mt-1">公式：提货完成时间 - 出库时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.17D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">91.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.4D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-6.3%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.7D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-12.5%</span></td>
              </tr>
              {/* 监管仓/周转仓-预定仓全链路平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>监管仓/周转仓-预定仓全链路平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：监管仓/周转仓出库</div>
                      <div className="text-gray-300">结束节点：预定仓入库</div>
                      <div className="text-gray-300 mt-1">公式：预定仓入库时间 - 出库时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.8D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">79.1%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.5D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-red-600 flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" />+4.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">7.0D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-2.9%</span></td>
              </tr>
              {/* 预定仓邮寄全链路平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>预定仓邮寄全链路平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：预定仓发货</div>
                      <div className="text-gray-300">结束节点：邮寄签收</div>
                      <div className="text-gray-300 mt-1">公式：签收时间 - 预定仓发货时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">7.3D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">81.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">7.7D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-5.5%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.3D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-12.3%</span></td>
              </tr>
              {/* 预定仓配送全链路平均时效 - 无品类 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">
                  <div className="flex items-center gap-2 group relative">
                    <span>预定仓配送全链路平均时效</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 cursor-help flex-shrink-0" />
                    <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="font-semibold mb-1">计算说明</div>
                      <div className="text-gray-300">开始节点：预定仓配送出库</div>
                      <div className="text-gray-300">结束节点：配送完成</div>
                      <div className="text-gray-300 mt-1">公式：配送完成时间 - 出库时间</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center text-gray-400 text-xs">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.0D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.5D</td>
                <td className="px-3 py-2 text-center border-r-2 border-gray-300"><span className="text-xs text-gray-900 font-semibold">84.4%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.6D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-2.2%</span></td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.2D</td>
                <td className="px-3 py-2 text-center"><span className="text-xs text-green-600 flex items-center justify-center gap-1"><TrendingDown className="w-3 h-3" />-13.3%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 第二行：仓-门店时效对比 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded"></div>
          各链路时效指标
        </h3>
        
        {/* Tab切换 */}
        <div className="sticky top-0 z-30 flex items-center justify-between mb-4 bg-white py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOrderDeliveryTab('order')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                orderDeliveryTab === 'order'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              订货段
            </button>
            <button
              onClick={() => setOrderDeliveryTab('delivery')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                orderDeliveryTab === 'delivery'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              分货段
            </button>
            <button
              onClick={() => setOrderDeliveryTab('store')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                orderDeliveryTab === 'store'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              门店段
            </button>
          </div>
          <button
            onClick={() => {
              console.log('导出数据');
            }}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow group relative"
          >
            <Download className="w-4 h-4" />
            导出数据
            <div className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-white text-blue-600 text-[10px] font-semibold cursor-help">
              ⑩
            </div>
            <div className="absolute left-0 bottom-full mb-2 w-[520px] bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
              <div className="font-semibold mb-2">批注⑩</div>
              <div className="text-gray-300 space-y-1.5">
                <div>需求标注：仅【各链路时效指标】的【导出】按钮需要导出各Tab页面内容的指标外，需要再加上每个指标的【开始时间】和【结束时间】两个字段。</div>
                <div>整体的表格字段为：业务节点、具体指标、品类、目标值、开始时间、结束时间、当前平均值、最大值、票数达标率、件数达标率、金额达标率、指标覆盖环节（为图片）。</div>
              </div>
            </div>
          </button>
        </div>
        
        <div className="max-h-[560px] overflow-auto custom-scrollbar rounded-md border border-gray-100">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20 bg-gray-50 shadow-sm">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-gray-900 border-b border-gray-200 min-w-[140px] whitespace-nowrap">业务节点</th>
                <th className="px-3 py-2 text-left font-bold text-gray-900 border-b border-gray-200 min-w-[200px] whitespace-nowrap">具体指标</th>
                <th className={`px-3 py-2 text-center font-bold border-b border-gray-200 min-w-[60px] whitespace-nowrap ${orderDeliveryTab === 'store' ? 'text-gray-300 bg-gray-50' : 'text-gray-900'}`}>
                  {orderDeliveryTab === 'store' ? (
                    <span className="flex items-center justify-center gap-1">
                      品类
                      <span className="text-[10px] font-normal text-gray-400">（不支持）</span>
                    </span>
                  ) : '品类'}
                </th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[80px] whitespace-nowrap">目标值</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[90px] whitespace-nowrap">当前平均值</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[70px] whitespace-nowrap">最大值</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[90px] whitespace-nowrap">票数达标率</th>
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[90px] whitespace-nowrap">件数达标率</th>
                {orderDeliveryTab !== 'store' && (
                  <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[90px] whitespace-nowrap">金额达标率</th>
                )}
                <th className="px-3 py-2 text-center font-bold text-gray-900 border-b border-gray-200 min-w-[100px] whitespace-nowrap">指标覆盖环节</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* 订货段内容 */}
              {orderDeliveryTab === 'order' && (
                <>
              {/* 1.订货段 */}
              <tr className="hover:bg-gray-50">
                <td rowSpan={6} className="px-3 py-2 font-medium text-gray-800 align-top">1.一盘货</td>
                <td className="px-3 py-2 text-gray-700">1.1全链路订货平均时效（一盘货）</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">14D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">12.3D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">15.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.7%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.2%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">90.1%</td>
                <td rowSpan={6} className="px-3 py-2 align-top bg-gray-50">
                  <img src={orderFlowImage} alt="一盘货流程图" className="max-w-xs h-auto" />
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td rowSpan={2} className="px-3 py-2 text-gray-700">1.2一线通关平均时效</td>
                <td className="px-3 py-2 text-center text-gray-700">香化</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.1D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">78.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">81.5%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">83.2%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center text-gray-700">酒水</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">75.6%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">79.1%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">80.9%</td>
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">1.3提货至海综保平均时效</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.6D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.9D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">82.4%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">85.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">87.1%</td>
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">1.4仓库入库平均时效</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.33D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">89.5%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">91.2%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">92.8%</td>
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">2.直发门店监管仓</td>
                <td className="px-3 py-2 text-gray-700">2.1全链路入库平均时效（直发）</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">10.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">84.2%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.7%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.5%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={directStoreFlowImage} alt="直发门店监管仓流程图" className="max-w-xs h-auto" />
                </td>
              </tr>
              </>
              )}
              
              {/* 分货段内容 */}
              {orderDeliveryTab === 'delivery' && (
                <>
              {/* 2.分货段 */}
              <tr className="hover:bg-gray-50">
                <td rowSpan={7} className="px-3 py-2 font-medium text-gray-800 align-top">1.一盘货-门店监管仓</td>
                <td rowSpan={2} className="px-3 py-2 text-gray-700">1.1全链路分货平均时效</td>
                <td className="px-3 py-2 text-center text-gray-700">香化</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">15.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">18.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">79.8%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">82.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">82.3%</td>
                <td rowSpan={7} className="px-3 py-2 align-top bg-gray-50">
                  <img src={distributionFlowImage} alt="分货段流程图" className="max-w-xs h-auto" />
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-center text-gray-700">酒水</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">16.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">20.1D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">76.5%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">79.2%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">79.2%</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">1.2仓库出库平均时效</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">7D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.9D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">11.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">92.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">93.8%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">94.6%</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">1.3二线通关平均时效</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.13D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">1.9D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.6%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">90.2%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">91.0%</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">1.4门店提货至上架平均时效</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">0.17D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">2.3D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">85.5%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">87.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.1%</td>
              </tr>
              </>
              )}
              
              {/* 门店段内容 */}
              {orderDeliveryTab === 'store' && (
                <>
              {/* 3.门店段 */}
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">1.监管仓-周转仓</td>
                <td className="px-3 py-2 text-gray-700">1.1监管仓-周转仓调拨平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-400">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">12.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">15.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">83.4%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">85.7%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">87.4%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store11FlowImage} alt="1.1监管仓-周转仓调拨流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td rowSpan={2} className="px-3 py-2 font-medium text-gray-800 align-top">2.周转仓-卖场</td>
                <td className="px-3 py-2 text-gray-700">2.1周转仓-卖场调拨平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.9%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">90.6%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">92.3%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store21FlowImage} alt="2.1周转仓-卖场调拨流程图" className="max-w-xs h-auto" />
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-700">2.2直入直出全链路平均时效（监管仓-卖场）</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.7D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">11.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">81.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">84.1%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.2%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store22FlowImage} alt="2.2直入直出流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">3.卖场-分拣仓</td>
                <td className="px-3 py-2 text-gray-700">3.1卖场-分拣仓入库平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.2H</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">7.8H</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.5%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.9%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">90.7%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store31FlowImage} alt="3.1卖场-分拣仓入库流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">4.分拣仓-顾客</td>
                <td className="px-3 py-2 text-gray-700">4.1邮寄全链路平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.5D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">82.7%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">85.2%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">87.1%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store41FlowImage} alt="4.1邮寄全链路流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800 align-top">5.分拣仓-口岸/返岛提货点</td>
                <td className="px-3 py-2 text-gray-700">5.1提货点提货全链路平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">3.6D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.1D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">87.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">89.5%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">91.2%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store51FlowImage} alt="5.1提货点提货流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">6.监管仓/周转仓-预定仓</td>
                <td className="px-3 py-2 text-gray-700">6.1监管仓/周转仓-预定仓全链路平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.4D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">8.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">84.6%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.8%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.6%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store61FlowImage} alt="6.1监管仓/周转仓-预定仓流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">7.预定仓-顾客</td>
                <td className="px-3 py-2 text-gray-700">7.1预定仓邮寄全链路平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.1D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">6.8D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">81.9%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">84.3%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.3%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store71FlowImage} alt="7.1预定仓邮寄流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">8.预定仓-口岸/返岛提货点</td>
                <td className="px-3 py-2 text-gray-700">8.1预定仓配送全链路平均时效</td>
                <td className="px-3 py-2 text-center bg-gray-50 text-gray-300 text-xs">—</td>
                <td className="px-3 py-2 text-center text-gray-700">-</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">4.2D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">5.7D</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">86.1%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">88.4%</td>
                <td className="px-3 py-2 text-center font-semibold text-gray-900">90.2%</td>
                <td className="px-3 py-2 bg-gray-50">
                  <img src={store81FlowImage} alt="8.1预定仓配送流程图" className="max-w-xs h-auto" />
                </td>
              </tr>

              </>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
    );
  };

  // 渲染质量指标Tab
  const renderQualityTab = () => {
    // 定义所有模块
    const modules = [
      { key: 'transfer' as QualityFilterKey, order: 1 },
      { key: 'delivery' as QualityFilterKey, order: 2 },
      { key: 'complaint' as QualityFilterKey, order: 3 },
      { key: 'accuracy' as QualityFilterKey, order: 4 }
    ];

    // 过滤出要显示的模块
    const displayedModules = modules.filter(m => qualityFilter.includes(m.key));

    return (
    <div className="space-y-6">
      {/* 查询指标过滤栏 */}
      <QualityFilterBar selected={qualityFilter} onChange={setQualityFilter} />

      {/* 第一行: 香化调拨满足率卡片 + 趋势图 */}
      {displayedModules.some(m => m.key === 'transfer') && <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-orange-500 rounded"></div>
          香化调拨满足率
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {/* 调拨满足率卡片 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-1">

          <div className="flex flex-col justify-center h-64 space-y-6">
            {/* TOP300 */}
            <div className="flex flex-col px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">TOP300</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">目标: {qualityData.transferSatisfaction.top300.target}%</span>
                  <span className="text-2xl font-bold text-gray-900">{qualityData.transferSatisfaction.top300.value}%</span>
                  <div className="relative inline-flex items-center group">
                    <span className={`text-xs flex items-center ${qualityData.transferSatisfaction.top300.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {qualityData.transferSatisfaction.top300.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {qualityData.transferSatisfaction.top300.change >= 0 ? '+' : ''}{qualityData.transferSatisfaction.top300.change}%
                    </span>
                    <div className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
                      ⑩
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[500px] bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-2">批注⑩</div>
                      <div className="text-gray-300 space-y-1.5">
                        <div>需求标注：该指标为【环比】=（本期数据-上月数据）/上月数据*100%。</div>
                        <div>所有环比的颜色规则为：绿色为积极、正向；红色表示消极、负面数据。</div>
                        <div>如满足率与客诉情况标注颜色相反。</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${qualityData.transferSatisfaction.top300.value >= qualityData.transferSatisfaction.top300.target ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`}
                  style={{ width: `${qualityData.transferSatisfaction.top300.value}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-2.5 w-0.5 bg-gray-500" 
                  style={{ left: `${qualityData.transferSatisfaction.top300.target}%` }}
                  title={`目标: ${qualityData.transferSatisfaction.top300.target}%`}
                ></div>
              </div>
            </div>

            {/* 非TOP300 */}
            <div className="flex flex-col px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">非TOP300</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">目标: {qualityData.transferSatisfaction.nonTop300.target}%</span>
                  <span className="text-2xl font-bold text-gray-900">{qualityData.transferSatisfaction.nonTop300.value}%</span>
                  <span className={`text-xs flex items-center ${qualityData.transferSatisfaction.nonTop300.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {qualityData.transferSatisfaction.nonTop300.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {qualityData.transferSatisfaction.nonTop300.change >= 0 ? '+' : ''}{qualityData.transferSatisfaction.nonTop300.change}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${qualityData.transferSatisfaction.nonTop300.value >= qualityData.transferSatisfaction.nonTop300.target ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`}
                  style={{ width: `${qualityData.transferSatisfaction.nonTop300.value}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-2.5 w-0.5 bg-gray-500" 
                  style={{ left: `${qualityData.transferSatisfaction.nonTop300.target}%` }}
                  title={`目标: ${qualityData.transferSatisfaction.nonTop300.target}%`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 香化调拨满足率趋势（月度） */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-orange-500 rounded"></div>
            月度趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <LineChart data={[
                { month: '1月', TOP300: 97.2, 非TOP300: 93.5 },
                { month: '2月', TOP300: 97.5, 非TOP300: 94.1 },
                { month: '3月', TOP300: 96.8, 非TOP300: 92.8 },
                { month: '4月', TOP300: 97.8, 非TOP300: 94.3 },
                { month: '5月', TOP300: 97.3, 非TOP300: 93.7 },
                { month: '6月', TOP300: 97.6, 非TOP300: 94.0 },
                { month: '7月', TOP300: 96.9, 非TOP300: 92.9 },
                { month: '8月', TOP300: 97.4, 非TOP300: 93.8 },
                { month: '9月', TOP300: 97.7, 非TOP300: 94.2 },
                { month: '10月', TOP300: 97.1, 非TOP300: 93.4 },
                { month: '11月', TOP300: 97.5, 非TOP300: 93.9 },
                { month: '12月', TOP300: 97.9, 非TOP300: 94.5 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={[90, 100]} 
                  ticks={[90, 93, 95, 97, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={({ x, y, payload }) => {
                    const value = payload.value;
                    let color = '#666';
                    if (value === 97) color = '#f97316';
                    if (value === 93) color = '#0891b2';
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        textAnchor="end" 
                        fill={color} 
                        fontSize={12}
                        fontWeight={value === 97 || value === 93 ? 600 : 400}
                      >
                        {value}%
                      </text>
                    );
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <ReferenceLine 
                  y={97} 
                  stroke="#f97316" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: 'TOP300目标: 97%', position: 'right', fill: '#f97316', fontSize: 12, fontWeight: 600 }}
                />
                <ReferenceLine 
                  y={93} 
                  stroke="#0891b2" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '非TOP300目标: 93%', position: 'right', fill: '#0891b2', fontSize: 12, fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="TOP300" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="非TOP300" stroke="#0891b2" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>}

      {/* 第二行: 快递交付卡片 + 趋势图 */}
      {displayedModules.some(m => m.key === 'delivery') && <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-green-500 rounded"></div>
          快递交付
        </h2>
        <div className="grid grid-cols-3 gap-6">
        {/* 快递交付卡片 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-1">

          <div className="space-y-6 pt-8">
            {/* 破损率 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">破损率</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">目标: {(qualityData.expressDelivery.damageRate.target * 100).toFixed(2)}%</span>
                  <span className="text-2xl font-bold text-black">{(qualityData.expressDelivery.damageRate.value * 100).toFixed(2)}%</span>
                  <span className={`text-xs flex items-center ${qualityData.expressDelivery.damageRate.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {qualityData.expressDelivery.damageRate.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {qualityData.expressDelivery.damageRate.change >= 0 ? '+' : ''}{(qualityData.expressDelivery.damageRate.change * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div 
                  className={`h-2 rounded-full transition-all ${qualityData.expressDelivery.damageRate.change < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${qualityData.expressDelivery.damageRate.value * 10000}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-gray-500" 
                  style={{ left: `${qualityData.expressDelivery.damageRate.target * 10000}%` }}
                  title={`目标: ${(qualityData.expressDelivery.damageRate.target * 100).toFixed(2)}%`}
                ></div>
              </div>
            </div>

            {/* 遗失率 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">遗失率</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">目标: {(qualityData.expressDelivery.lossRate.target * 100).toFixed(2)}%</span>
                  <span className="text-2xl font-bold text-gray-900">{(qualityData.expressDelivery.lossRate.value * 100).toFixed(2)}%</span>
                  <span className={`text-xs flex items-center ${qualityData.expressDelivery.lossRate.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {qualityData.expressDelivery.lossRate.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {qualityData.expressDelivery.lossRate.change >= 0 ? '+' : ''}{(qualityData.expressDelivery.lossRate.change * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div 
                  className={`h-2 rounded-full transition-all ${qualityData.expressDelivery.lossRate.change < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${qualityData.expressDelivery.lossRate.value * 10000}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-gray-500" 
                  style={{ left: `${qualityData.expressDelivery.lossRate.target * 10000}%` }}
                  title={`目标: ${(qualityData.expressDelivery.lossRate.target * 100).toFixed(2)}%`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 快递交付趋势（月度） */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-green-500 rounded"></div>
            月度趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <LineChart data={[
                { month: '1月', 破损率: 0.0008, 遗失率: 0.0003 },
                { month: '2月', 破损率: 0.0025, 遗失率: 0.0015 },
                { month: '3月', 破损率: 0.0012, 遗失率: 0.0006 },
                { month: '4月', 破损率: 0.0035, 遗失率: 0.0022 },
                { month: '5月', 破损率: 0.0018, 遗失率: 0.0009 },
                { month: '6月', 破损率: 0.0045, 遗失率: 0.0028 },
                { month: '7月', 破损率: 0.0022, 遗失率: 0.0012 },
                { month: '8月', 破损率: 0.0055, 遗失率: 0.0035 },
                { month: '9月', 破损率: 0.0038, 遗失率: 0.0019 },
                { month: '10月', 破损率: 0.0065, 遗失率: 0.0042 },
                { month: '11月', 破损率: 0.0048, 遗失率: 0.0025 },
                { month: '12月', 破损率: 0.0078, 遗失率: 0.0050 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={[0, 0.01]} 
                  ticks={[0, 0.001, 0.0025, 0.005, 0.0075, 0.01]}
                  tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                  tick={({ x, y, payload }) => {
                    const value = payload.value;
                    let color = '#666';
                    if (value === 0.001) color = '#ef4444';
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        textAnchor="end" 
                        fill={color} 
                        fontSize={12}
                        fontWeight={value === 0.001 ? 600 : 400}
                      >
                        {(value * 100).toFixed(2)}%
                      </text>
                    );
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <ReferenceLine 
                  y={0.001} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '目标: 0.1%', position: 'right', fill: '#ef4444', fontSize: 12, fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="破损率" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
                <Line type="monotone" dataKey="遗失率" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4, fill: '#14b8a6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>}

      {/* 第三行: 客诉情况卡片 + 趋势图 */}
      {displayedModules.some(m => m.key === 'complaint') && <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-purple-500 rounded"></div>
          客诉情况
        </h2>
        <div className="grid grid-cols-3 gap-6">

        {/* 客诉情况卡片 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-1">

          <div className="space-y-6 pt-8">
            {/* 快递有责客诉率 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">快递有责客诉率</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">目标: {(qualityData.complaints.expressResponsible.target * 100).toFixed(2)}%</span>
                  <span className="text-2xl font-bold text-black">{(qualityData.complaints.expressResponsible.value * 100).toFixed(2)}%</span>
                  <span className={`text-xs flex items-center ${qualityData.complaints.expressResponsible.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {qualityData.complaints.expressResponsible.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {qualityData.complaints.expressResponsible.change >= 0 ? '+' : ''}{(qualityData.complaints.expressResponsible.change * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div 
                  className={`h-2 rounded-full transition-all ${qualityData.complaints.expressResponsible.change < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${qualityData.complaints.expressResponsible.value * 10000}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-gray-500" 
                  style={{ left: `${qualityData.complaints.expressResponsible.target * 10000}%` }}
                  title={`目标: ${(qualityData.complaints.expressResponsible.target * 100).toFixed(2)}%`}
                ></div>
              </div>
            </div>

            {/* 物流有责客诉率 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">物流有责客诉率</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">目标: {(qualityData.complaints.logisticsResponsible.target * 100).toFixed(2)}%</span>
                  <span className="text-2xl font-bold text-black">{(qualityData.complaints.logisticsResponsible.value * 100).toFixed(2)}%</span>
                  <span className={`text-xs flex items-center ${qualityData.complaints.logisticsResponsible.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {qualityData.complaints.logisticsResponsible.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {qualityData.complaints.logisticsResponsible.change >= 0 ? '+' : ''}{(qualityData.complaints.logisticsResponsible.change * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div 
                  className={`h-2 rounded-full transition-all ${qualityData.complaints.logisticsResponsible.change < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${qualityData.complaints.logisticsResponsible.value * 10000}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-gray-500" 
                  style={{ left: `${qualityData.complaints.logisticsResponsible.target * 10000}%` }}
                  title={`目标: ${(qualityData.complaints.logisticsResponsible.target * 100).toFixed(2)}%`}
                ></div>
              </div>
            </div>

            {/* 中免物流舆情投诉量 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">中免物流舆情投诉量</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">目标: 50件</span>
                  <span className="text-2xl font-bold text-black">45件</span>
                  <span className="text-xs flex items-center text-green-600">
                    <TrendingDown className="w-3 h-3" />
                    -10.0%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div 
                  className="h-2 rounded-full transition-all bg-green-500"
                  style={{ width: '45%' }}
                ></div>
                <div 
                  className="absolute top-0 h-2 w-0.5 bg-gray-500" 
                  style={{ left: '50%' }}
                  title="目标: 50件"
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/* 客诉情况趋势（月度）*/}
        <div className="bg-white rounded-lg border border-gray-200 p-4 col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-purple-500 rounded"></div>
            月度趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <LineChart data={[
                { month: '1月', 物流有责客诉率: 0.0015, 快递有责客诉率: 0.0025, 中免物流舆情投诉量: 52 },
                { month: '2月', 物流有责客诉率: 0.0022, 快递有责客诉率: 0.0018, 中免物流舆情投诉量: 48 },
                { month: '3月', 物流有责客诉率: 0.0028, 快递有责客诉率: 0.0032, 中免物流舆情投诉量: 55 },
                { month: '4月', 物流有责客诉率: 0.0019, 快递有责客诉率: 0.0024, 中免物流舆情投诉量: 50 },
                { month: '5月', 物流有责客诉率: 0.0033, 快递有责客诉率: 0.0020, 中免物流舆情投诉量: 58 },
                { month: '6月', 物流有责客诉率: 0.0025, 快递有责客诉率: 0.0029, 中免物流舆情投诉量: 47 },
                { month: '7月', 物流有责客诉率: 0.0031, 快递有责客诉率: 0.0017, 中免物流舆情投诉量: 53 },
                { month: '8月', 物流有责客诉率: 0.0020, 快递有责客诉率: 0.0035, 中免物流舆情投诉量: 49 },
                { month: '9月', 物流有责客诉率: 0.0027, 快递有责客诉率: 0.0021, 中免物流舆情投诉量: 46 },
                { month: '10月', 物流有责客诉率: 0.0018, 快递有责客诉率: 0.0028, 中免物流舆情投诉量: 51 },
                { month: '11月', 物流有责客诉率: 0.0024, 快递有责客诉率: 0.0019, 中免物流舆情投诉量: 44 },
                { month: '12月', 物流有责客诉率: 0.0020, 快递有责客诉率: 0.0026, 中免物流舆情投诉量: 45 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis 
                  yAxisId="left"
                  domain={[0, 0.01]} 
                  ticks={[0, 0.001, 0.0025, 0.005, 0.0075, 0.01]}
                  tickFormatter={(value) => {
                    if (value === 0.001) {
                      return '0.10% (目标)';
                    }
                    return `${(value * 100).toFixed(2)}%`;
                  }}
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const value = payload.value;
                    const isTarget = value === 0.001;
                    return (
                      <text 
                        x={x - 5} 
                        y={y} 
                        textAnchor="end" 
                        fill={isTarget ? '#dc2626' : '#666'} 
                        fontSize={12}
                        fontWeight={isTarget ? 600 : 400}
                        dy={4}
                      >
                        {isTarget ? '0.10% (目标)' : `${(value * 100).toFixed(2)}%`}
                      </text>
                    );
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}件`}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === '中免物流舆情投诉量') {
                      return [`${value}件`, name];
                    }
                    return [`${(value * 100).toFixed(2)}%`, name];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <ReferenceLine 
                  yAxisId="left"
                  y={0.001} 
                  stroke="#dc2626" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '目标: 0.1%', position: 'right', fill: '#dc2626', fontSize: 12, fontWeight: 600 }}
                />
                <ReferenceLine 
                  yAxisId="right"
                  y={50} 
                  stroke="#7c3aed" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: '目标: 50件', position: 'insideTopRight', fill: '#7c3aed', fontSize: 11, fontWeight: 600 }}
                />
                <Line yAxisId="left" type="monotone" dataKey="物流有责客诉率" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} />
                <Line yAxisId="left" type="monotone" dataKey="快递有责客诉率" stroke="#0891b2" strokeWidth={2.5} dot={{ r: 4, fill: '#0891b2' }} />
                <Line yAxisId="right" type="monotone" dataKey="中免物流舆情投诉量" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>}

      {/* 第四行：盘点情况表格（占满宽）*/}
      {displayedModules.some(m => m.key === 'accuracy') && <><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-1 h-4 bg-purple-500 rounded"></div>
        准确率盘点情况
      </h3>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900 border-r border-gray-200">指标名称</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">一盘货</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">监管仓</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">周转仓</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">分拣仓</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">预定仓</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">自建仓</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900 border-r border-gray-200">其它</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900">平均</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 border-r border-gray-200">库存准确率</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
                  {qualityData.inventoryAccuracy.unified}%
                </td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">98.3%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">98.7%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.9%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">98.1%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.5%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">98.0%</td>
                <td className="px-4 py-3 text-center font-bold text-gray-900">98.1%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 border-r border-gray-200">效期准确率</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">
                  {qualityData.expiryAccuracy.unified}%
                </td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.5%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.8%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.2%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.6%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">96.9%</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900 border-r border-gray-200">97.3%</td>
                <td className="px-4 py-3 text-center font-bold text-gray-900">97.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 第五行: 库存和效期准确率趋势（季度）- 两图并排 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 库存准确率趋势（按季度）*/}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded"></div>
            库存准确率趋势（季度）
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <LineChart data={[
                { quarter: 'Q1', 一盘货: 99.0, 仓库: 96.2, 门店: 91.5 },
                { quarter: 'Q2', 一盘货: 99.2, 仓库: 96.5, 门店: 92.0 },
                { quarter: 'Q3', 一盘货: 99.4, 仓库: 96.7, 门店: 92.2 },
                { quarter: 'Q4', 一盘货: 99.5, 仓库: 96.8, 门店: 92.3 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" />
                <YAxis 
                  domain={[90, 100]} 
                  ticks={[90, 92, 94, 96, 99, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={({ x, y, payload }) => {
                    const value = payload.value;
                    let color = '#666'; // 默认颜色
                    if (value === 99) color = '#3b82f6'; // 一盘货目标值 - 蓝色
                    if (value === 96) color = '#10b981'; // 仓库目标值 - 绿色
                    if (value === 92) color = '#f59e0b'; // 门店目标值 - 橙色
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        textAnchor="end" 
                        fill={color} 
                        fontSize={12}
                        fontWeight={value === 99 || value === 96 || value === 92 ? 600 : 400}
                      >
                        {value}%
                      </text>
                    );
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                {/* 一盘货目标线: 99% - 蓝色 */}
                <ReferenceLine 
                  y={99} 
                  stroke="#3b82f6" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '一��货目标: 99%', position: 'right', fill: '#3b82f6', fontSize: 12, fontWeight: 600 }}
                />
                {/* 仓库目标线: 96% - 绿色 */}
                <ReferenceLine 
                  y={96} 
                  stroke="#10b981" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '仓库目标: 96%', position: 'right', fill: '#10b981', fontSize: 12, fontWeight: 600 }}
                />
                {/* 门店目标线: 92% - 橙色 */}
                <ReferenceLine 
                  y={92} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '门店目标: 92%', position: 'right', fill: '#f59e0b', fontSize: 12, fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="一盘货" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="仓库" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="门店" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 效期准确率趋势（季度） */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-green-500 rounded"></div>
            效期准确率趋势（季度）
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <LineChart data={[
                { quarter: 'Q1', 一盘货: 97.8, 仓库: 95.5, 门店: 90.2 },
                { quarter: 'Q2', 一盘货: 98.1, 仓库: 95.8, 门店: 90.8 },
                { quarter: 'Q3', 一盘货: 98.3, 仓库: 96.0, 门店: 91.1 },
                { quarter: 'Q4', 一盘货: 98.5, 仓库: 96.2, 门店: 91.5 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" />
                <YAxis 
                  domain={[88, 100]} 
                  ticks={[88, 90, 93, 96, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={({ x, y, payload }) => {
                    const value = payload.value;
                    let color = '#666'; // 默认颜色
                    if (value === 96) color = '#10b981'; // 一盘货目标值 - 绿色
                    if (value === 93) color = '#f59e0b'; // 仓库目标值 - 橙色
                    if (value === 90) color = '#ef4444'; // 门店目标值 - 红色
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        textAnchor="end" 
                        fill={color} 
                        fontSize={12}
                        fontWeight={value === 96 || value === 93 || value === 90 ? 600 : 400}
                      >
                        {value}%
                      </text>
                    );
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                {/* 一盘货目标线: 96% - 绿色 */}
                <ReferenceLine 
                  y={96} 
                  stroke="#10b981" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '一盘货目标: 96%', position: 'right', fill: '#10b981', fontSize: 12, fontWeight: 600 }}
                />
                {/* 仓库目标线: 93% - 橙色 */}
                <ReferenceLine 
                  y={93} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '仓库目标: 93%', position: 'right', fill: '#f59e0b', fontSize: 12, fontWeight: 600 }}
                />
                {/* 门��目标线: 90% - 红色 */}
                <ReferenceLine 
                  y={90} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  strokeWidth={2.5}
                  label={{ value: '门店目标: 90%', position: 'right', fill: '#ef4444', fontSize: 12, fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="一盘货" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="仓库" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="门店" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>}
    </div>
    );
  };

  // 渲染成本指标Tab（占位）
  const renderCostTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="text-center text-gray-500">
        <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">成本指标功能开发中...</p>
        <p className="text-sm mt-2">敬请期待</p>
      </div>
    </div>
  );

  // 渲染效率标Tab（占）
  const renderEfficiencyTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="text-center text-gray-500">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">效率指标功能开发中...</p>
        <p className="text-sm mt-2">敬请期待</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-600 rounded"></div>
        指标总览
      </h2>

      {/* Tab导航 */}
      <div className="flex items-center gap-2 mb-6 bg-white rounded-lg p-1 border border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab内容 */}
      <div className="mt-6">
        {activeTab === 'timeliness' && renderTimelinessTab()}
        {activeTab === 'quality' && renderQualityTab()}
        {activeTab === 'cost' && renderCostTab()}
        {activeTab === 'efficiency' && renderEfficiencyTab()}
      </div>
    </div>
  );
}
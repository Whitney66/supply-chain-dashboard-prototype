import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, GitBranch, BookOpen, ArrowRight, Info } from 'lucide-react';
import { MetricsOverview } from './MetricsOverview';
import { SupplyChainFlowChart } from './SupplyChainFlowChart';
import type { FilterState } from '../types';

interface IndicatorOverviewProps {
  filters: FilterState;
  onAlertClick: (metricId: string) => void;
}

type IndicatorCategory = 'timeliness' | 'quality' | 'cost' | 'efficiency';

export function IndicatorOverview({ filters, onAlertClick }: IndicatorOverviewProps) {
  const [activeCategory, setActiveCategory] = useState<IndicatorCategory>('timeliness');
  const [infoTab, setInfoTab] = useState<'flow' | 'metrics'>('flow');
  const [highlightAlertPanel, setHighlightAlertPanel] = useState(false);

  const categories = [
    { id: 'timeliness' as IndicatorCategory, label: '时效指标', icon: '📊', enabled: true },
    { id: 'quality' as IndicatorCategory, label: '质量指标', icon: '✅', enabled: true },
    { id: 'cost' as IndicatorCategory, label: '成本指标', icon: '💰', enabled: false },
    { id: 'efficiency' as IndicatorCategory, label: '效率指标', icon: '⚡', enabled: false },
  ];

  const getCurrentMetrics = () => {
    switch (activeCategory) {
      case 'timeliness':
        return timelinessMetrics;
      case 'quality':
        return qualityMetrics;
      default:
        return [];
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getAlertDotColor = (level: string) => {
    switch (level) {
      case 'danger':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Mock alerts data
  const alerts = [
    {
      id: 'alert-1',
      level: 'danger',
      message: '出库及时率存在异常单据，需关注',
      metric: '出库及时率',
      store: '三亚门店',
      metricId: 'inventory-outbound-rate',
    },
    {
      id: 'alert-2',
      level: 'warning',
      message: '库存准确率存在异常单据',
      metric: '库存准确率',
      store: '新海港门店',
      metricId: 'inventory-accuracy-rate',
    },
    {
      id: 'alert-3',
      level: 'warning',
      message: '快递妥投时效存在异常单据',
      metric: '快递妥投时效',
      store: '全部',
      metricId: 'express-delivery-rate',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 指标总览 - 可视化图表展示 */}
      <MetricsOverview />

      {/* 业务流程图与指标说明 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded"></div>
              业务流程与指标说明（后续按照实际内容修改）
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-5">
              完整展供应链物流业务流程（订货→入库→出库→配送→门店销售）及关键指标定义与计算标准
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setInfoTab('flow')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                infoTab === 'flow'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              业务流程图
            </button>
            <button
              onClick={() => setInfoTab('metrics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                infoTab === 'metrics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              指标说明
            </button>
          </div>
        </div>

        {/* 业务流程图 */}
        {infoTab === 'flow' && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <SupplyChainFlowChart />
          </div>
        )}

        {/* 指标说明 */}
        {infoTab === 'metrics' && (
          <div className="space-y-4">
            {/* 时效指标 */}
            <div className="border border-blue-200 rounded-lg overflow-hidden max-w-6xl">
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <span className="text-blue-600">📊</span>
                  时效指标
                </h3>
              </div>
              <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-50 hover:scrollbar-thumb-blue-500" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#60a5fa #eff6ff'
              }}>
                <table className="w-full text-xs border-collapse min-w-max">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标编号</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标名称</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[200px]">指标定义</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[180px]">指标公式</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标维度</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">单位</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">适用范围</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[140px]">度量口径</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[100px]">目标值</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标属性</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">更新频率</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标所属域</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标数据源</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[180px]">表中文名</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[180px]">表英文名</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 whitespace-nowrap min-w-[160px]">加工规则</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TL001</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">入库时效达标率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衡量入库作业在规定时间内完成的比例</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">(总单数 - 超标单数) / 总单数 × 100%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国仓库</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">10天: ≥85%, 14天: ≥92%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥92%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衍生指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">仓储域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">WMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">入库时效达标率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Inbound Timeliness Rate</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按入库单号统计，T+1汇总</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TL002</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">出库时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">从订单确认到发货完成所需时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">发货时间 - 订单确认时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">小时</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国仓库</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤ 48小时</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤36小时</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">原子指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">仓储域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">WMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">出库时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Outbound Timeliness</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按出库单号统计，实时更新</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TL003</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">海关放行时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">从报关到海关放行所需时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">放行时间 - 报关时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">小时</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">跨境业务</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤ 24小时</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤18小时</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">原子指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">通关域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">报关系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">海关放行时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Customs Clearance Time</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按报关单统计，T+1汇总</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TL004</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">门店提货时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">从到货通知到门店提货完成的时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">提货时间 - 到货通知时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">天</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国门店</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤ 2天</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤1.5天</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">技术指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">门店域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">门店提货时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Store Pickup Time</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按门店单号统计，实时更新</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TL005</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">门店上架时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">从门店提货到商品上架完成的时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">上架时间 - 提货时间</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">天</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国门店</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤ 1天</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≤0.5天</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">原子指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">门店域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">门店系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">门店上架时效</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Store Shelving Time</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按门店单号统计，T+1汇总</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 质量指标 */}
            <div className="border border-green-200 rounded-lg overflow-hidden max-w-6xl">
              <div className="bg-green-50 px-4 py-2 border-b border-green-200">
                <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  质量指标
                </h3>
              </div>
              <div className="p-4 overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-50 hover:scrollbar-thumb-green-500" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4ade80 #f0fdf4'
              }}>
                <table className="w-full text-xs border-collapse min-w-max">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b-2 border-gray-300 bg-gray-50">
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标编号</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标名称</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[200px]">指标定义</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[180px]">指标公式</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标维度</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">单位</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">适用范围</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[140px]">度量口径</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[100px]">目标值</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标属性</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">更新频率</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标所属域</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">指标数据源</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[180px]">表中文名</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap min-w-[180px]">表英文名</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 whitespace-nowrap min-w-[160px]">加工规则</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">QL001</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">库存准确率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衡量仓库库存数据与实际库存的一致性</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">准确SKU数 / 盘点总SKU数 × 100%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">质量</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国仓库</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥ 99%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥99.5%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衍生指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">仓储域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">WMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">库存准确率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Inventory Accuracy Rate</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按SKU统计，盘点后T+1更新</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">QL002</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">效期准确率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衡量商品效期信息登记的准确性</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">效期准确SKU数 / 总SKU数 × 100%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">质量</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国仓库</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥ 99.9%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥99.95%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">技术指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">仓储域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">WMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">效期准确率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Expiry Date Accuracy Rate</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按SKU统计，盘点后T+1更新</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">QL003</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">配送完好率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衡量配送过程中货物完好无损的比例</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">(总配送单数 - 货损单数) / 总配送单数 × 100%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">质量</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国配送</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥ 99.95%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥99.98%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衍生指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">配送域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">TMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">配送完好率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Delivery Integrity Rate</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按配送单号统计，实时更新</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">QL004</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">订单满足率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衡量订单完整发货的能力</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">完整发货单数 / 总订单数 × 100%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">质量</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国门店</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥ 95%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥98%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">原子指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">订单域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">OMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">订单满足率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Order Fulfillment Rate</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按订单号统计，T+1汇总</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">QL005</td>
                      <td className="py-2 px-2 font-medium text-gray-900 border-r border-gray-100 whitespace-nowrap">调拨满足率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衡量门店间调拨需求的满足程度</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">调拨完成数 / 调拨申请数 × 100%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">质量</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">全国门店</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥ 90%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">≥93%</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">衍生指标</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">每日</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">调拨域</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">WMS系统</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">调拨满足率</td>
                      <td className="py-2 px-2 text-gray-600 border-r border-gray-100 whitespace-nowrap">Transfer Fulfillment Rate</td>
                      <td className="py-2 px-2 text-gray-600 whitespace-nowrap">按调拨单号统计，T+1汇总</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 数据维度说明 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                <span className="text-purple-600">📐</span>
                数据维度说明
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="bg-white rounded p-3 border border-purple-100">
                    <div className="font-semibold text-gray-900 mb-1">单数维度</div>
                    <p className="text-gray-600">按订单数量计算，适用于订单处理、单据流转等场景</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-purple-100">
                    <div className="font-semibold text-gray-900 mb-1">件数维度</div>
                    <p className="text-gray-600">按商品件数计算，适用于库存管理、拣货配送等场景</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-white rounded p-3 border border-purple-100">
                    <div className="font-semibold text-gray-900 mb-1">时间维度</div>
                    <p className="text-gray-600">支持按月统计和近八周统计，可灵活切换查看趋势</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-purple-100">
                    <div className="font-semibold text-gray-900 mb-1">品类维度</div>
                    <p className="text-gray-600">部分指标支持香化/酒水品类切换，精细化分析</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 异常预警看板 */}
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all ${highlightAlertPanel ? 'border-2 border-orange-500 bg-orange-50 shadow-lg' : ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">⚠️ 异常预警看板</h2>
          <div className="relative group">
            <div 
              className="relative cursor-pointer"
              onClick={() => {
                setHighlightAlertPanel(true);
                setTimeout(() => setHighlightAlertPanel(false), 2000);
              }}
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
            </div>
            <div className="absolute left-0 top-full mt-1 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="font-semibold mb-1">批注②</div>
              <div className="text-gray-300">异常预警的判断规则是：从门店和指标两个维度筛选单据，仅当指标时效大于目标值时，会出现异常信息。触发每个模块的内容，跳转到【异常明细】页面，页面会同比展示门店下指标的全部异常单据</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => onAlertClick(alert.metricId)}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${getAlertColor(alert.level)}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getAlertDotColor(alert.level)}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {alert.store} - {alert.metric}
                </div>
                <div className="text-sm mt-1 opacity-90">
                  出库及时率存在异常单据
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-60 mt-1 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
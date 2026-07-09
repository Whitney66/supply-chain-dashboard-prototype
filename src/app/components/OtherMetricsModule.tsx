import { useState } from 'react';
import { Download } from 'lucide-react';

interface OtherMetricsModuleProps {
  tableHeaderClass: string;
  tableCellClass: string;
  tableCellCenterClass: string;
}

export function OtherMetricsModule({ tableHeaderClass, tableCellClass, tableCellCenterClass }: OtherMetricsModuleProps) {
  const [activeTab, setActiveTab] = useState(0);

  // 使用统一的标准样式，与其他模块保持一致，字体大小为12px
  const headerClass = "px-4 py-3 text-center font-semibold text-gray-900 whitespace-nowrap text-xs";
  const headerLeftClass = "px-4 py-3 text-left font-semibold text-gray-900 whitespace-nowrap text-xs";
  const cellClass = "px-4 py-3 text-gray-700 whitespace-nowrap text-xs";
  const cellCenterClass = "px-4 py-3 text-center text-gray-900 whitespace-nowrap text-xs";
  const rowClass = "hover:bg-gray-50/50 transition-colors";

  // 数据定义
  const top300Data = [
    { store: '[6863] 三亚海棠湾店', values: [95.5, 95.2, 94.8, 96.1, 95.5, 94.9, 95.8, 96.3, 95.1, 94.7, 95.9, 96.0, 95.4] },
    { store: '[7048] 新海港店', values: [96.2, 96.1, 95.8, 96.5, 96.2, 95.9, 96.4, 96.8, 96.0, 95.7, 96.3, 96.6, 96.1] },
    { store: '[7016] 三亚凤凰机场店', values: [94.9, 94.8, 94.5, 95.2, 94.9, 94.6, 95.1, 95.5, 94.7, 94.4, 95.0, 95.3, 94.8] },
    { store: '[6132] 海口兰机场店', values: [95.8, 95.6, 95.3, 96.0, 95.7, 95.4, 95.9, 96.2, 95.5, 95.2, 95.8, 96.1, 95.7] },
    { store: '[6922] 海口日月店', values: [94.6, 94.5, 94.2, 94.9, 94.6, 94.3, 94.8, 95.1, 94.4, 94.1, 94.7, 95.0, 94.5] },
    { store: '[6921] 博鳌店', values: [96.0, 95.9, 95.6, 96.3, 96.0, 95.7, 96.2, 96.5, 95.8, 95.5, 96.1, 96.4, 95.9] },
  ];

  const top300CosmeticsData = [
    { store: '[6863] 三亚海棠湾店', values: [93.7, 93.5, 92.8, 94.2, 93.6, 93.1, 94.0, 94.5, 93.3, 92.9, 94.1, 94.3, 93.6] },
    { store: '[7048] 新海港店', values: [94.3, 94.2, 93.8, 94.6, 94.3, 94.0, 94.5, 94.9, 94.1, 93.7, 94.4, 94.7, 94.2] },
    { store: '[7016] 三亚凤凰机场店', values: [93.3, 93.1, 92.5, 93.8, 93.2, 92.8, 93.6, 94.1, 93.0, 92.6, 93.7, 94.0, 93.2] },
    { store: '[6132] 海口美兰机场店', values: [93.9, 93.8, 93.3, 94.3, 93.8, 93.5, 94.1, 94.6, 93.6, 93.2, 94.0, 94.4, 93.8] },
    { store: '[6922] 海口日月店', values: [92.9, 92.8, 92.2, 93.4, 92.9, 92.5, 93.2, 93.8, 92.7, 92.3, 93.1, 93.6, 92.8] },
    { store: '[6921] 博鳌店', values: [94.1, 94.0, 93.5, 94.4, 94.0, 93.7, 94.3, 94.8, 93.9, 93.4, 94.2, 94.6, 94.0] },
  ];

  const inventoryAccuracyData = [
    { store: '[6863] 三亚海棠湾店', values: [98.5, 98.5, 98.2, 98.7, 98.4, 98.6, 98.8, 98.3, 98.9, 98.1, 98.7, 98.5, 98.4] },
    { store: '[7048] 新海港店', values: [98.8, 98.8, 98.5, 99.0, 98.7, 98.9, 99.1, 98.6, 99.2, 98.4, 99.0, 98.8, 98.7] },
    { store: '[7016] 三亚凤凰机场店', values: [98.2, 98.2, 97.9, 98.5, 98.1, 98.3, 98.6, 98.0, 98.7, 97.8, 98.4, 98.2, 98.1] },
    { store: '[6132] 海口美兰机场店', values: [98.6, 98.6, 98.3, 98.8, 98.5, 98.7, 98.9, 98.4, 99.0, 98.2, 98.8, 98.6, 98.5] },
    { store: '[6922] 海口日月店', values: [98.1, 98.1, 97.8, 98.4, 98.0, 98.2, 98.5, 97.9, 98.6, 97.7, 98.3, 98.1, 98.0] },
    { store: '[6921] 博鳌店', values: [98.7, 98.7, 98.4, 98.9, 98.6, 98.8, 99.0, 98.5, 99.1, 98.3, 98.9, 98.7, 98.6] },
  ];

  const expiryAccuracyData = [
    { store: '[6863] 三亚海棠湾店', values: [99.2, 99.1, 99.3, 99.0, 99.2, 99.4, 99.1, 99.3, 99.0, 99.2, 99.1, 99.3, 99.1] },
    { store: '[7048] 新海港店', values: [99.4, 99.3, 99.5, 99.2, 99.4, 99.6, 99.3, 99.5, 99.2, 99.4, 99.3, 99.5, 99.3] },
    { store: '[7016] 三亚凤凰机场店', values: [99.0, 98.9, 99.1, 98.8, 99.0, 99.2, 98.9, 99.1, 98.8, 99.0, 98.9, 99.1, 98.9] },
    { store: '[6132] 海口美兰机场店', values: [99.3, 99.2, 99.4, 99.1, 99.3, 99.5, 99.2, 99.4, 99.1, 99.3, 99.2, 99.4, 99.2] },
    { store: '[6922] 海口日月店', values: [98.8, 98.7, 98.9, 98.6, 98.8, 99.0, 98.7, 98.9, 98.6, 98.8, 98.7, 98.9, 98.7] },
    { store: '[6921] 博鳌店', values: [99.3, 99.2, 99.4, 99.1, 99.3, 99.5, 99.2, 99.4, 99.1, 99.3, 99.2, 99.4, 99.2] },
  ];

  const mailLossRateData = [
    { store: '[6863] 三亚海棠湾店', values: [0.12, 0.11, 0.13, 0.10, 0.12, 0.14, 0.11, 0.13, 0.10, 0.12, 0.11, 0.13, 0.11] },
    { store: '[7048] 新海港店', values: [0.09, 0.08, 0.10, 0.07, 0.09, 0.11, 0.08, 0.10, 0.07, 0.09, 0.08, 0.10, 0.08] },
    { store: '[7016] 三亚凤凰机场店', values: [0.15, 0.14, 0.16, 0.13, 0.15, 0.17, 0.14, 0.16, 0.13, 0.15, 0.14, 0.16, 0.14] },
    { store: '[6132] 海口美兰机场店', values: [0.11, 0.10, 0.12, 0.09, 0.11, 0.13, 0.10, 0.12, 0.09, 0.11, 0.10, 0.12, 0.10] },
    { store: '[6922] 海口日月店', values: [0.16, 0.15, 0.17, 0.14, 0.16, 0.18, 0.15, 0.17, 0.14, 0.16, 0.15, 0.17, 0.15] },
    { store: '[6921] 博鳌店', values: [0.10, 0.09, 0.11, 0.08, 0.10, 0.12, 0.09, 0.11, 0.08, 0.10, 0.09, 0.11, 0.09] },
  ];

  const mailDamageRateData = [
    { store: '[6863] 三亚海棠湾店', values: [0.08, 0.07, 0.09, 0.06, 0.08, 0.10, 0.07, 0.09, 0.06, 0.08, 0.07, 0.09, 0.07] },
    { store: '[7048] 新海港店', values: [0.06, 0.05, 0.07, 0.04, 0.06, 0.08, 0.05, 0.07, 0.04, 0.06, 0.05, 0.07, 0.05] },
    { store: '[7016] 三亚凤凰机场店', values: [0.11, 0.10, 0.12, 0.09, 0.11, 0.13, 0.10, 0.12, 0.09, 0.11, 0.10, 0.12, 0.10] },
    { store: '[6132] 海口美兰机场店', values: [0.07, 0.06, 0.08, 0.05, 0.07, 0.09, 0.06, 0.08, 0.05, 0.07, 0.06, 0.08, 0.06] },
    { store: '[6922] 海口日月', values: [0.12, 0.11, 0.13, 0.10, 0.12, 0.14, 0.11, 0.13, 0.10, 0.12, 0.11, 0.13, 0.11] },
    { store: '[6921] 博鳌店', values: [0.05, 0.04, 0.06, 0.03, 0.05, 0.07, 0.04, 0.06, 0.03, 0.05, 0.04, 0.06, 0.04] },
  ];

  const expressComplaintRateData = [
    { store: '[6863] 三亚海棠湾店', values: [0.25, 0.24, 0.26, 0.23, 0.25, 0.27, 0.24, 0.26, 0.23, 0.25, 0.24, 0.26, 0.24] },
    { store: '[7048] 新海港店', values: [0.20, 0.19, 0.21, 0.18, 0.20, 0.22, 0.19, 0.21, 0.18, 0.20, 0.19, 0.21, 0.19] },
    { store: '[7016] 三亚凤凰机场店', values: [0.30, 0.29, 0.31, 0.28, 0.30, 0.32, 0.29, 0.31, 0.28, 0.30, 0.29, 0.31, 0.29] },
    { store: '[6132] 海口美兰机场店', values: [0.22, 0.21, 0.23, 0.20, 0.22, 0.24, 0.21, 0.23, 0.20, 0.22, 0.21, 0.23, 0.21] },
    { store: '[6922] 海口日月店', values: [0.32, 0.31, 0.33, 0.30, 0.32, 0.34, 0.31, 0.33, 0.30, 0.32, 0.31, 0.33, 0.31] },
    { store: '[6921] 博鳌店', values: [0.18, 0.17, 0.19, 0.16, 0.18, 0.20, 0.17, 0.19, 0.16, 0.18, 0.17, 0.19, 0.17] },
  ];

  const logisticsComplaintRateData = [
    { store: '[6863] 三亚海棠湾店', values: [0.45, 0.44, 0.46, 0.43, 0.45, 0.47, 0.44, 0.46, 0.43, 0.45, 0.44, 0.46, 0.44] },
    { store: '[7048] 新海港店', values: [0.38, 0.37, 0.39, 0.36, 0.38, 0.40, 0.37, 0.39, 0.36, 0.38, 0.37, 0.39, 0.37] },
    { store: '[7016] 三亚凤凰机场店', values: [0.52, 0.51, 0.53, 0.50, 0.52, 0.54, 0.51, 0.53, 0.50, 0.52, 0.51, 0.53, 0.51] },
    { store: '[6132] 海口美兰机场店', values: [0.41, 0.40, 0.42, 0.39, 0.41, 0.43, 0.40, 0.42, 0.39, 0.41, 0.40, 0.42, 0.40] },
    { store: '[6922] 海口日月店', values: [0.55, 0.54, 0.56, 0.53, 0.55, 0.57, 0.54, 0.56, 0.53, 0.55, 0.54, 0.56, 0.54] },
    { store: '[6921] 博鳌店', values: [0.35, 0.34, 0.36, 0.33, 0.35, 0.37, 0.34, 0.36, 0.33, 0.35, 0.34, 0.36, 0.34] },
  ];

  const publicOpinionCountData = [
    { store: '[6863] 三亚海棠湾店', values: [5, 4, 6, 3, 5, 7, 4, 6, 3, 5, 4, 6, 4] },
    { store: '[7048] 新海港店', values: [3, 2, 4, 1, 3, 5, 2, 4, 1, 3, 2, 4, 2] },
    { store: '[7016] 三亚凤凰机场店', values: [7, 6, 8, 5, 7, 9, 6, 8, 5, 7, 6, 8, 6] },
    { store: '[6132] 海口美兰机场店', values: [4, 3, 5, 2, 4, 6, 3, 5, 2, 4, 3, 5, 3] },
    { store: '[6922] 海口日月店', values: [8, 7, 9, 6, 8, 10, 7, 9, 6, 8, 7, 9, 7] },
    { store: '[6921] 博鳌店', values: [2, 1, 3, 0, 2, 4, 1, 3, 0, 2, 1, 3, 1] },
  ];

  // 定义标页数据
  const tabs = [
    {
      id: 0,
      title: '调拨满足率',
      metrics: [
        { name: 'TOP300调拨满足率', unit: '%', data: top300Data },
        { name: '非TOP300香化调拨满足率', unit: '%', data: top300CosmeticsData },
      ]
    },
    {
      id: 1,
      title: '准确率',
      metrics: [
        { name: '库存准确率', unit: '%', data: inventoryAccuracyData },
        { name: '效期准确率', unit: '%', data: expiryAccuracyData },
      ]
    },
    {
      id: 2,
      title: '邮寄情况',
      metrics: [
        { name: '邮寄遗失率', unit: '%', data: mailLossRateData },
        { name: '邮寄破损率', unit: '%', data: mailDamageRateData },
      ]
    },
    {
      id: 3,
      title: '客诉情况',
      metrics: [
        { name: '快递有责客诉率', unit: '%', data: expressComplaintRateData },
        { name: '物流有责客诉率', unit: '%', data: logisticsComplaintRateData },
        { name: '中免物流舆情投诉量', unit: '件', data: publicOpinionCountData },
      ]
    }
  ];

  const currentTab = tabs[activeTab];

  // 渲染单个指标表格
  const renderSingleMetricTable = (name: string, unit: string, data: { store: string; values: number[] }[]) => (
    <div key={name} className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-gray-600 rounded"></div>
        {name} (%)
      </h4>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={headerLeftClass} style={{ minWidth: '200px' }}>门店</th>
              <th className={headerClass}>月度均值</th>
              <th className={headerClass}>1月</th>
              <th className={headerClass}>2月</th>
              <th className={headerClass}>3月</th>
              <th className={headerClass}>4月</th>
              <th className={headerClass}>5月</th>
              <th className={headerClass}>6月</th>
              <th className={headerClass}>7月</th>
              <th className={headerClass}>8月</th>
              <th className={headerClass}>9月</th>
              <th className={headerClass}>10月</th>
              <th className={headerClass}>11月</th>
              <th className={headerClass}>12月</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className={rowClass}>
                <td className={cellClass}>{row.store}</td>
                {row.values.map((value, valIdx) => (
                  <td key={valIdx} className={cellCenterClass}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="ml-3">
      {/* 标签页导航 */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-base font-bold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            // 导出当前标签页数据
            console.log('导出数据:', currentTab.title);
          }}
          className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
        >
          <Download className="w-4 h-4" />
          导出数据
        </button>
      </div>

      {/* 当前标签页内容 */}
      <div>
        {currentTab.metrics.map((metric) => 
          renderSingleMetricTable(metric.name, metric.unit, metric.data)
        )}
      </div>
    </div>
  );
}
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import {
  getDetailTableData,
  type DetailDimension,
  type DetailRow,
} from '../data/detailTableData';

interface MetricDetailTableProps {
  metricId: string;
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function formatValue(value: number | null, kind: DetailRow['kind']) {
  if (value === null || Number.isNaN(value)) return '-';
  if (kind === 'rate') return `${value.toFixed(1)}%`;
  if (kind === 'duration') return `${value.toFixed(2)}天`;
  return Math.round(value).toLocaleString('zh-CN');
}

function Trend({ trend }: { trend: DetailRow['trend'] }) {
  if (trend === 'up') return <ArrowUp className="w-4 h-4 text-emerald-600" aria-label="上升" />;
  if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600" aria-label="下降" />;
  return <Minus className="w-4 h-4 text-gray-400" aria-label="稳定" />;
}

export function MetricDetailTable({ metricId }: MetricDetailTableProps) {
  const [dimension, setDimension] = useState<DetailDimension>('票数');
  const rows = useMemo(() => getDetailTableData(metricId, dimension), [metricId, dimension]);
  const segment = rows[0]?.segment ?? '订货段';

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h3 className="text-lg text-gray-900">{segment}指标明细</h3>
          <p className="text-xs text-gray-500 mt-1">按门店、品类查看指标月度表现</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-gray-300 p-0.5 bg-gray-50" role="group" aria-label="数据维度">
            {(['票数', '件数'] as DetailDimension[]).map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setDimension(item)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  dimension === item ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button type="button" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            导出 Excel
          </button>
        </div>
      </div>

      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 text-xs text-blue-800">
        日度均值 = 每个月的时效指标汇总值 ÷ 每个月天数的汇总值；月度均值 = 各月日度均值的平均值。
      </div>

      <div className="overflow-auto flex-1">
        <table className="min-w-[1450px] w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
            <tr>
              <th className="px-3 py-3 text-left sticky left-0 bg-gray-50 z-30">门店</th>
              <th className="px-3 py-3 text-left sticky left-[110px] bg-gray-50 z-30">品类</th>
              <th className="px-3 py-3 text-left min-w-[190px]">指标</th>
              <th className="px-3 py-3 text-center bg-amber-50 text-amber-700">目标值</th>
              <th className="px-3 py-3 text-center bg-blue-50">日度均值</th>
              <th className="px-3 py-3 text-center bg-blue-50">月度均值</th>
              {MONTHS.map(month => <th key={month} className="px-3 py-3 text-center">{month}</th>)}
              <th className="px-3 py-3 text-center">月趋势</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.store}-${row.metric}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2.5 sticky left-0 bg-white z-10 font-medium text-gray-800">{row.store}</td>
                <td className="px-3 py-2.5 sticky left-[110px] bg-white z-10 text-gray-600">{row.category}</td>
                <td className="px-3 py-2.5 text-gray-700">{row.metric}</td>
                <td className="px-3 py-2.5 text-center bg-amber-50 text-amber-700 font-medium">{row.targetDisplay}</td>
                <td className="px-3 py-2.5 text-center bg-blue-50 font-medium">{formatValue(row.dailyMean, row.kind)}</td>
                <td className="px-3 py-2.5 text-center bg-blue-50 font-medium">{formatValue(row.monthlyMean, row.kind)}</td>
                {row.months.map((value, monthIndex) => (
                  <td key={monthIndex} className={`px-3 py-2.5 text-center ${monthIndex >= 9 ? 'bg-cyan-50' : ''} ${row.kind === 'rate' && value !== null && value < 70 ? 'text-red-600' : ''}`}>
                    {formatValue(value, row.kind)}
                  </td>
                ))}
                <td className="px-3 py-2.5 flex justify-center"><Trend trend={row.trend} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">显示 {rows.length} 条数据 · 当前维度：{dimension}</div>
    </div>
  );
}

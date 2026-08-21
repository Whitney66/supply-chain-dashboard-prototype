import { useMemo } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import {
  getDetailTableData,
  type DetailDimension,
  type DetailRow,
} from '../data/detailTableData';

interface MetricDetailTableProps {
  metricId?: string;
  dimension: DetailDimension;
  segment?: '订货段' | '分货段';
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

export function MetricDetailTable({ metricId = 'inventory-inbound-rate', dimension, segment }: MetricDetailTableProps) {
  const rows = useMemo(() => {
    const data = getDetailTableData(metricId, dimension);
    return segment ? data.filter(row => row.segment === segment) : data;
  }, [metricId, dimension, segment]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-[1520px] w-full text-sm border-collapse">
          <thead className="bg-blue-50 border-b border-blue-200">
            <tr>
              <th className="px-3 py-3 text-left min-w-[110px]">门店</th>
              <th className="px-3 py-3 text-left min-w-[80px]">品类</th>
              <th className="px-3 py-3 text-left min-w-[180px]">指标</th>
              <th className="px-3 py-3 text-center min-w-[80px]">目标值</th>
              <th className="px-3 py-3 text-center min-w-[90px] bg-cyan-50">日度均值</th>
              <th className="px-3 py-3 text-center min-w-[90px] bg-cyan-50">月度均值</th>
              {MONTHS.map(month => <th key={month} className="px-3 py-3 text-center min-w-[72px]">{month}</th>)}
              <th className="px-3 py-3 text-center min-w-[70px]">月趋势</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.segment}-${row.store}-${row.metric}`} className="border-b border-gray-100 hover:bg-blue-50/30">
                {index === 0 && <td rowSpan={rows.length} className="px-3 py-3 align-middle font-medium text-gray-900 border-r border-gray-200 bg-blue-50/30">{row.store}</td>}
                {index === 0 && <td rowSpan={rows.length} className="px-3 py-3 align-middle text-gray-700 border-r border-gray-200 bg-blue-50/20">{row.category}</td>}
                <td className="px-3 py-3 text-gray-700">{row.metric}</td>
                <td className="px-3 py-3 text-center text-amber-700 bg-amber-50 font-medium">{row.targetDisplay}</td>
                <td className="px-3 py-3 text-center bg-cyan-50 font-medium">{formatValue(row.dailyMean, row.kind)}</td>
                <td className="px-3 py-3 text-center bg-cyan-50 font-medium">{formatValue(row.monthlyMean, row.kind)}</td>
                {row.months.map((value, monthIndex) => (
                  <td key={monthIndex} className={`px-3 py-3 text-center ${monthIndex >= 9 ? 'bg-blue-50/50' : ''}`}>
                    {formatValue(value, row.kind)}
                  </td>
                ))}
                <td className="px-3 py-3"><div className="flex justify-center"><Trend trend={row.trend} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

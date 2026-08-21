import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { getDetailTableData, type MonthlyData } from '../data/detailTableData';

interface MetricDetailTableProps {
  metricId: string;
}

export function MetricDetailTable({ metricId }: MetricDetailTableProps) {
  const data = getDetailTableData(metricId);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCellColor = (value: number) => {
    if (value >= 97) return 'text-green-600 bg-green-50';
    if (value >= 95) return 'text-blue-600 bg-blue-50';
    if (value >= 90) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg">指标明细数据</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          导出 Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left sticky left-0 bg-gray-50 z-10">维度</th>
              <th className="px-4 py-3 text-left sticky left-20 bg-gray-50 z-10">门店</th>
              <th className="px-4 py-3 text-center bg-amber-50 text-amber-700">目标值（天）</th>
              <th className="px-4 py-3 text-center">1月</th>
              <th className="px-4 py-3 text-center">2月</th>
              <th className="px-4 py-3 text-center">3月</th>
              <th className="px-4 py-3 text-center">4月</th>
              <th className="px-4 py-3 text-center">5月</th>
              <th className="px-4 py-3 text-center">6月</th>
              <th className="px-4 py-3 text-center">7月</th>
              <th className="px-4 py-3 text-center">8月</th>
              <th className="px-4 py-3 text-center">9月</th>
              <th className="px-4 py-3 text-center">10月</th>
              <th className="px-4 py-3 text-center">11月</th>
              <th className="px-4 py-3 text-center">12月</th>
              <th className="px-4 py-3 text-center bg-blue-50">年均</th>
              <th className="px-4 py-3 text-center">趋势</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 sticky left-0 bg-white z-10">{row.dimension}</td>
                <td className="px-4 py-3 sticky left-20 bg-white z-10">{row.store}</td>
                <td className="px-4 py-3 text-center bg-amber-50 text-amber-700 font-medium">
                  {row.targetDays === null ? '-' : `${row.targetDays}天`}
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.jan)}`}>
                  {row.jan.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.feb)}`}>
                  {row.feb.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.mar)}`}>
                  {row.mar.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.apr)}`}>
                  {row.apr.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.may)}`}>
                  {row.may.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.jun)}`}>
                  {row.jun.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.jul)}`}>
                  {row.jul.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.aug)}`}>
                  {row.aug.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.sep)}`}>
                  {row.sep.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.oct)}`}>
                  {row.oct.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.nov)}`}>
                  {row.nov.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-center ${getCellColor(row.dec)}`}>
                  {row.dec.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-center bg-blue-50">
                  {row.avg.toFixed(2)}%
                </td>
                <td className="px-4 py-3 flex justify-center">
                  {getTrendIcon(row.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
        <span>显示 {data.length} 条数据</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">上一页</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">下一页</button>
        </div>
      </div>
    </div>
  );
}
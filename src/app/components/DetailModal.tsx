import { X } from 'lucide-react';
import type { Metric } from '../types';

interface DetailModalProps {
  metric: Metric;
  onClose: () => void;
}

interface SegmentRowsProps {
  segment: {
    name: string;
    exceedLabel: string;
    exceed: { total: number; months: number[] };
    totalOrders: { total: number; months: number[] };
    rate: { total: number; months: number[] };
    trend: string;
  };
}

function SegmentRows({ segment }: SegmentRowsProps) {
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="border border-gray-300 px-2 py-2 text-xs text-gray-700" rowSpan={3}>
          {segment.name}
        </td>
        <td className="border border-gray-300 px-2 py-2 text-xs text-gray-600">
          {segment.exceedLabel}
        </td>
        <td className="border border-gray-300 px-2 py-2 text-center text-xs">{segment.exceed.total}</td>
        {segment.exceed.months.map((value, mIdx) => (
          <td 
            key={mIdx}
            className={`border border-gray-300 px-2 py-2 text-center text-xs ${
              mIdx >= 9 ? 'bg-cyan-50' : ''
            }`}
          >
            {value}
          </td>
        ))}
        <td className="border border-gray-300 px-2 py-2 text-center text-xs" rowSpan={3}>
          {segment.trend}
        </td>
      </tr>
      <tr className="hover:bg-gray-50">
        <td className="border border-gray-300 px-2 py-2 text-xs text-gray-600">
          订单总数量
        </td>
        <td className="border border-gray-300 px-2 py-2 text-center text-xs">{segment.totalOrders.total}</td>
        {segment.totalOrders.months.map((value, mIdx) => (
          <td 
            key={mIdx}
            className={`border border-gray-300 px-2 py-2 text-center text-xs ${
              mIdx >= 9 ? 'bg-cyan-50' : ''
            }`}
          >
            {value}
          </td>
        ))}
      </tr>
      <tr className="bg-yellow-100 hover:bg-yellow-200">
        <td className="border border-gray-300 px-2 py-2 text-xs">
          达标率
        </td>
        <td className="border border-gray-300 px-2 py-2 text-center text-xs">{segment.rate.total}%</td>
        {segment.rate.months.map((value, mIdx) => (
          <td 
            key={mIdx}
            className={`border border-gray-300 px-2 py-2 text-center text-xs ${
              mIdx >= 9 ? 'bg-yellow-200' : ''
            } ${
              value < 85 ? 'text-red-600' : 
              value >= 95 ? 'text-green-600' : 'text-gray-900'
            }`}
          >
            {value}%
          </td>
        ))}
      </tr>
    </>
  );
}

export function DetailModal({ metric, onClose }: DetailModalProps) {
  const detailData = getDetailData(metric.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl text-gray-900">{metric.name} - 月度趋势分析</h2>
            <p className="text-sm text-gray-500 mt-1">
              数据申诉后对比：剔除前 vs 剔除后
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            导出数据
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            筛选
          </button>
          
          {metric.hasDualDimension && (
            <div className="flex gap-2 ml-auto">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">
                票数维度
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                件数维度
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* 按门店分解表 - 剔除前 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-700">按门店分解（剔除前）</h3>
                <div className="text-sm">
                  <span className="text-gray-500">整体达标率：</span>
                  <span className="text-red-600">{detailData.beforeAppeal.overallRate}%</span>
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50">
                      <th className="border border-gray-300 px-3 py-2 text-center" rowSpan={2}>
                        指标<br/>门店
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-center" rowSpan={2}>
                        分级-上报<br/>时效
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-center">1月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">2月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">3月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">4月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">5月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">6月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">7月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">8月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">9月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">10月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">11月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">12月平均</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">月趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.beforeAppeal.storeData.map((store, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{store.name}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">{store.level}</td>
                        {store.months.map((value, mIdx) => (
                          <td 
                            key={mIdx} 
                            className={`border border-gray-300 px-3 py-2 text-center ${
                              mIdx >= 9 ? 'bg-cyan-50' : ''
                            } ${
                              value < 85 ? 'text-red-600' : 
                              value >= 95 ? 'text-green-600' : 'text-gray-900'
                            }`}
                          >
                            {value ? `${value}%` : '-'}
                          </td>
                        ))}
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">
                          {store.trend}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">合计</td>
                      <td className="border border-gray-300 px-3 py-2"></td>
                      {detailData.beforeAppeal.totalData.map((value, idx) => (
                        <td 
                          key={idx} 
                          className={`border border-gray-300 px-3 py-2 text-center ${
                            idx >= 9 ? 'bg-cyan-100' : ''
                          }`}
                        >
                          {value ? `${value}%` : '-'}
                        </td>
                      ))}
                      <td className="border border-gray-300 px-3 py-2 text-center">↑</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 按门店分解表 - 剔除后 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-700">按门店分解（剔除后）</h3>
                <div className="text-sm">
                  <span className="text-gray-500">整体达标率：</span>
                  <span className="text-green-600">{detailData.afterAppeal.overallRate}%</span>
                  <span className="text-gray-500 ml-2">提升：</span>
                  <span className="text-blue-600">
                    +{(detailData.afterAppeal.overallRate - detailData.beforeAppeal.overallRate).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50">
                      <th className="border border-gray-300 px-3 py-2 text-center" rowSpan={2}>
                        指标<br/>门店
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-center" rowSpan={2}>
                        分级-上报<br/>时效
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-center">1月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">2月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">3月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">4月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">5月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">6月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">7月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">8月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">9月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">10月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">11月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">12月平均</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">月趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.afterAppeal.storeData.map((store, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{store.name}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">{store.level}</td>
                        {store.months.map((value, mIdx) => (
                          <td 
                            key={mIdx} 
                            className={`border border-gray-300 px-3 py-2 text-center ${
                              mIdx >= 9 ? 'bg-cyan-50' : ''
                            } ${
                              value < 85 ? 'text-red-600' : 
                              value >= 95 ? 'text-green-600' : 'text-gray-900'
                            }`}
                          >
                            {value ? `${value}%` : '-'}
                          </td>
                        ))}
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-600">
                          {store.trend}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100">
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">合计</td>
                      <td className="border border-gray-300 px-3 py-2"></td>
                      {detailData.afterAppeal.totalData.map((value, idx) => (
                        <td 
                          key={idx} 
                          className={`border border-gray-300 px-3 py-2 text-center ${
                            idx >= 9 ? 'bg-cyan-100' : ''
                          }`}
                        >
                          {value ? `${value}%` : '-'}
                        </td>
                      ))}
                      <td className="border border-gray-300 px-3 py-2 text-center">↑</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 分段时效详细表 */}
            <div>
              <h3 className="text-sm text-gray-700 mb-3">分段时效详细分析</h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50">
                      <th className="border border-gray-300 px-3 py-2 text-center" rowSpan={2}>
                        指标<br/>门店
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-center" rowSpan={2}>合计</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">1月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">2月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">3月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">4月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">5月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">6月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">7月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">8月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">9月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">10月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">11月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center bg-cyan-100">12月</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">月趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailData.segmentData.map((segment, idx) => (
                      <SegmentRows key={segment.name} segment={segment} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
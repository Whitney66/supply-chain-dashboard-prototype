import { X, Save } from 'lucide-react';
import { useState } from 'react';

interface ConfigModalProps {
  onClose: () => void;
}

interface TimeConfig {
  metricName: string;
  baselineValue: number;
  targetValue: number;
  challengeValue: number;
  unit: string;
}

export function ConfigModal({ onClose }: ConfigModalProps) {
  const [configs, setConfigs] = useState<TimeConfig[]>([
    {
      metricName: '监管仓入库及时率',
      baselineValue: 85,
      targetValue: 90,
      challengeValue: 95,
      unit: '%',
    },
    {
      metricName: '监管仓出库及时率',
      baselineValue: 85,
      targetValue: 92,
      challengeValue: 97,
      unit: '%',
    },
    {
      metricName: '通关及时率',
      baselineValue: 80,
      targetValue: 88,
      challengeValue: 95,
      unit: '%',
    },
    {
      metricName: '配送及时率',
      baselineValue: 85,
      targetValue: 90,
      challengeValue: 96,
      unit: '%',
    },
    {
      metricName: '快递妥投时效达标率',
      baselineValue: 82,
      targetValue: 88,
      challengeValue: 94,
      unit: '%',
    },
  ]);

  const handleSave = () => {
    // 这里可以保存配置到后端或本地存储
    console.log('保存配置:', configs);
    onClose();
  };

  const updateConfig = (index: number, field: keyof TimeConfig, value: number) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setConfigs(newConfigs);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl text-gray-900">时效标准配置</h2>
            <p className="text-sm text-gray-500 mt-1">
              配置各项指标的基准值、目标值和挑战值
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm text-blue-900 mb-2">评分规则说明</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 基准值：达到此值得60分</li>
                <li>• 目标值：达到此值得80分</li>
                <li>• 挑战值：达到此值得100分</li>
                <li>• 介于两者之间时，按比例计算分数</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">指标名称</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">基准值</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">目标值</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">挑战值</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">团队类型</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {configs.map((config, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-900">{config.metricName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            value={config.baselineValue}
                            onChange={(e) => updateConfig(idx, 'baselineValue', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">{config.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            value={config.targetValue}
                            onChange={(e) => updateConfig(idx, 'targetValue', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">{config.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            value={config.challengeValue}
                            onChange={(e) => updateConfig(idx, 'challengeValue', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-500">{config.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>全部</option>
                          <option>自有团队</option>
                          <option>外包团队</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}

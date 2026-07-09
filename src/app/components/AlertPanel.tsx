import { CircleAlert, TriangleAlert, Info } from 'lucide-react';
import { getAlertData } from '../data/metricsData';

export function AlertPanel() {
  const alerts = getAlertData();

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <CircleAlert className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <TriangleAlert className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBgColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg mb-4">异常预警</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertBgColor(alert.level)}`}
          >
            <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.level)}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{alert.message}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                <span>门店: {alert.store}</span>
                <span>
                  当前值: {alert.value}% / 阈值: {alert.threshold}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
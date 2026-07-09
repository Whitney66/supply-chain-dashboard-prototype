import { BarChart3, FileText, Settings, User } from 'lucide-react';
import type { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
}

const stores = [
  { id: 'all', name: '全部门店' },
  { id: '7063', name: '【7063】海南国际物流中心' },
  { id: '6868', name: '【6868】三亚海棠湾店' },
  { id: '7048', name: '【7048】新海港店' },
  { id: '7016', name: '【7016】三亚凤凰机场店' },
  { id: '6132', name: '【6132】海口美兰机场店' },
  { id: '6922', name: '【6922】海口日月店' },
  { id: '6921', name: '【6921】博鳌店' },
  { id: 'ecommerce', name: '电商' },
];

export function Sidebar({ currentView, onViewChange, selectedStores, onStoresChange }: SidebarProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('本月');

  const getTimeRangeDisplay = (range: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    switch (range) {
      case '近七天':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return `${sevenDaysAgo.getFullYear()}-${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')} 至 ${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      case '本月':
        return `${year}年${month}月`;
      case '近三个月':
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return `${threeMonthsAgo.getFullYear()}年${threeMonthsAgo.getMonth() + 1}月 至 ${year}年${month}月`;
      default:
        return `${year}年${month}月`;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)]">
      <div className="p-4">
        {/* 时间筛选 */}
        <div className="mb-6">
          <h3 className="text-xs text-gray-500 mb-3">时间范围</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTimeRange('近七天')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTimeRange === '近七天'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                近七天
              </button>
              <button
                onClick={() => setSelectedTimeRange('本月')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTimeRange === '本月'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                本月
              </button>
            </div>
            <button
              onClick={() => setSelectedTimeRange('近三个月')}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTimeRange === '近三个月'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              近三个月
            </button>
            
            {/* 日期范围选择器 */}
            <DateRangePicker 
              onDateRangeChange={(startDate, endDate) => {
                console.log('Selected date range:', startDate, endDate);
                setSelectedTimeRange('自定义');
              }}
            />
            
            <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{getTimeRangeDisplay(selectedTimeRange)}</span>
              </div>
            </div>
          </div>
        </div>

        {currentView !== 'coe' && (
          <div>
            <h3 className="text-xs text-gray-500 mb-3">选择门店</h3>
            <StoreSelector
              stores={stores}
              selectedStores={selectedStores}
              onSelectionChange={onStoresChange}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
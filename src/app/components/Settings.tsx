import { useState, useEffect } from 'react';
import { X, Download, AlertCircle, Send } from 'lucide-react';

interface DataRecord {
  id: string;
  metricName: string;
  date: string;
  store: string;
  orderNo: string;
  quantity: number;
  startTime: string;
  endTime: string;
  docType: string;
  actualTime: number;
  standardTime: number;
  category: string;
  status: 'completed' | 'inProgress';
  tag?: string;
  tagNote?: string;
}

interface SettingsProps {
  selectedMetric?: string | null;
}

const EXCEPTION_TAGS = [
  '物流延误',
  '系统故障',
  '天气原因',
  '人员不足',
  '设备故障',
  '交通管制',
  '其他原因'
];

const METRICS = [
  '全链路订货平均时长(一盘货)',
  '一线通关平均时长',
  '仓库入库平均时长',
  '全链路入库平均时长(直发)',
  '全链路分货平均时长',
  '仓库出库平均时长',
  '二线通关平均时长',
  '门店提货至上架平均时长',
  '监管仓-周转仓调拨平均时长',
  '周转仓-卖场调拨平均时长',
  '直入直出全链路平均时长(监管仓-卖场)',
  '全链路分拣仓入库平均时长',
  '邮寄全链路平均时效',
  '提货点提货全链路平均时效',
  '监管仓/周转仓-预定仓全链路平均时效',
  '预定仓邮寄全链路平均时效',
  '预定仓配送全时'
];

// 模拟数据
const generateMockData = (metric: string, isBeforeRemoval: boolean): DataRecord[] => {
  // 为每个指标生成唯一ID
  const metricIndex = METRICS.indexOf(metric);
  const baseId = metricIndex * 15;
  
  const baseData: DataRecord[] = [
    { id: `${baseId + 1}`, metricName: metric, date: '2024-01-08', store: '【7063】海南国际物流中心', orderNo: `SO20240108${String(baseId + 1).padStart(4, '0')}`, quantity: 125, startTime: '2024-01-08 08:30:00', endTime: '2024-01-09 06:30:00', docType: '先报后入', actualTime: 25.5, standardTime: 24.0, category: '香化', status: 'inProgress' },
    { id: `${baseId + 2}`, metricName: metric, date: '2024-01-08', store: '【6868】三亚海棠湾店', orderNo: `SO20240108${String(baseId + 2).padStart(4, '0')}`, quantity: 89, startTime: '2024-01-08 09:15:00', endTime: '2024-01-09 18:03:00', docType: '先入后报', actualTime: 32.8, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 3}`, metricName: metric, date: '2024-01-07', store: '【7048】新海港店', orderNo: `SO20240107${String(baseId + 3).padStart(4, '0')}`, quantity: 203, startTime: '2024-01-07 10:00:00', endTime: '2024-01-08 14:18:00', docType: '先报后入', actualTime: 28.3, standardTime: 24.0, category: '香化', status: 'inProgress', tag: '物流延误', tagNote: '高速封路导致' },
    { id: `${baseId + 4}`, metricName: metric, date: '2024-01-07', store: '【7016】三亚凤凰机场店', orderNo: `SO20240107${String(baseId + 4).padStart(4, '0')}`, quantity: 156, startTime: '2024-01-07 07:45:00', endTime: '2024-01-08 03:57:00', docType: '先入后报', actualTime: 26.2, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 5}`, metricName: metric, date: '2024-01-07', store: '【6132】海口美兰机场店', orderNo: `SO20240107${String(baseId + 5).padStart(4, '0')}`, quantity: 178, startTime: '2024-01-07 11:20:00', endTime: '2024-01-08 22:56:00', docType: '先报后入', actualTime: 35.6, standardTime: 24.0, category: '香化', status: 'inProgress', tag: '系统故障', tagNote: 'WMS系统宕机2小时' },
    { id: `${baseId + 6}`, metricName: metric, date: '2024-01-06', store: '【6922】海口日月店', orderNo: `SO20240106${String(baseId + 6).padStart(4, '0')}`, quantity: 92, startTime: '2024-01-06 08:00:00', endTime: '2024-01-07 07:06:00', docType: '先入后报', actualTime: 25.1, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 7}`, metricName: metric, date: '2024-01-06', store: '【6921】博鳌店', orderNo: `SO20240106${String(baseId + 7).padStart(4, '0')}`, quantity: 145, startTime: '2024-01-06 09:30:00', endTime: '2024-01-07 12:18:00', docType: '先报后入', actualTime: 26.8, standardTime: 24.0, category: '香化', status: 'inProgress' },
    { id: `${baseId + 8}`, metricName: metric, date: '2024-01-06', store: '【7017】电商', orderNo: `SO20240106${String(baseId + 8).padStart(4, '0')}`, quantity: 67, startTime: '2024-01-06 10:15:00', endTime: '2024-01-07 05:45:00', docType: '先入后报', actualTime: 24.5, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 9}`, metricName: metric, date: '2024-01-05', store: '【7052】跨境电商', orderNo: `SO20240105${String(baseId + 9).padStart(4, '0')}`, quantity: 234, startTime: '2024-01-05 07:00:00', endTime: '2024-01-06 13:12:00', docType: '先报后入', actualTime: 30.2, standardTime: 24.0, category: '香化', status: 'inProgress' },
    { id: `${baseId + 10}`, metricName: metric, date: '2024-01-05', store: '【6868】三亚海棠湾店', orderNo: `SO20240105${String(baseId + 10).padStart(4, '0')}`, quantity: 112, startTime: '2024-01-05 08:45:00', endTime: '2024-01-06 07:23:00', docType: '先入后报', actualTime: 25.6, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 11}`, metricName: metric, date: '2024-01-04', store: '【7048】新海港店', orderNo: `SO20240104${String(baseId + 11).padStart(4, '0')}`, quantity: 187, startTime: '2024-01-04 09:00:00', endTime: '2024-01-05 12:45:00', docType: '先报后入', actualTime: 27.8, standardTime: 24.0, category: '香化', status: 'inProgress' },
    { id: `${baseId + 12}`, metricName: metric, date: '2024-01-04', store: '【7016】三亚凤凰机场店', orderNo: `SO20240104${String(baseId + 12).padStart(4, '0')}`, quantity: 95, startTime: '2024-01-04 10:30:00', endTime: '2024-01-05 09:12:00', docType: '先入后报', actualTime: 24.7, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 13}`, metricName: metric, date: '2024-01-03', store: '【6132】海口美兰机场店', orderNo: `SO20240103${String(baseId + 13).padStart(4, '0')}`, quantity: 210, startTime: '2024-01-03 07:15:00', endTime: '2024-01-04 14:30:00', docType: '先报后入', actualTime: 31.3, standardTime: 24.0, category: '香化', status: 'inProgress' },
    { id: `${baseId + 14}`, metricName: metric, date: '2024-01-03', store: '【6922】海口日月店', orderNo: `SO20240103${String(baseId + 14).padStart(4, '0')}`, quantity: 78, startTime: '2024-01-03 08:50:00', endTime: '2024-01-04 06:25:00', docType: '先入后报', actualTime: 24.6, standardTime: 24.0, category: '酒水', status: 'inProgress' },
    { id: `${baseId + 15}`, metricName: metric, date: '2024-01-02', store: '【6921】博鳌店', orderNo: `SO20240102${String(baseId + 15).padStart(4, '0')}`, quantity: 163, startTime: '2024-01-02 09:45:00', endTime: '2024-01-03 13:20:00', docType: '先报后入', actualTime: 27.6, standardTime: 24.0, category: '香化', status: 'inProgress' },
  ];

  // 剔除后数据：移除已标记异常的记录
  if (!isBeforeRemoval) {
    return baseData.filter(item => !item.tag);
  }

  return baseData;
};

export function Settings({ selectedMetric: initialMetric }: SettingsProps) {
  const defaultMetric = initialMetric && METRICS.includes(initialMetric) ? initialMetric : METRICS[0];
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['全部']);
  const [data, setData] = useState<DataRecord[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DataRecord | null>(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [tagNote, setTagNote] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'inProgress' | 'tagged'>('all');
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);

  // 初始化数据
  useEffect(() => {
    const metricsToLoad = selectedMetrics.includes('全部') ? METRICS : selectedMetrics;
    const allData: DataRecord[] = [];
    metricsToLoad.forEach(metric => {
      allData.push(...generateMockData(metric, true));
    });
    setData(allData);
  }, [selectedMetrics]);

  // 监听外部传入的指标变化，自动位
  useEffect(() => {
    if (initialMetric && METRICS.includes(initialMetric)) {
      setSelectedMetrics([initialMetric]);
      setSelectedRows(new Set());
    }
  }, [initialMetric]);

  // 切换指标选择
  const handleMetricToggle = (metric: string) => {
    if (metric === '全部') {
      setSelectedMetrics(['全部']);
    } else {
      const newSelected = selectedMetrics.filter(m => m !== '全部');
      if (newSelected.includes(metric)) {
        const filtered = newSelected.filter(m => m !== metric);
        setSelectedMetrics(filtered.length === 0 ? ['全部'] : filtered);
      } else {
        setSelectedMetrics([...newSelected, metric]);
      }
    }
    setSelectedRows(new Set());
  };

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredData.map(r => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // 单选
  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  // 打开标记异常弹窗
  const handleOpenTagModal = (record?: DataRecord) => {
    setCurrentRecord(record || null);
    setSelectedTag(record?.tag || '');
    setTagNote(record?.tagNote || '');
    setShowTagModal(true);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowTagModal(false);
    setCurrentRecord(null);
    setSelectedTag('');
    setTagNote('');
  };

  // 保存标签
  const handleSaveTag = () => {
    if (!selectedTag) {
      alert('请选择异常标签');
      return;
    }

    if (currentRecord) {
      // 单个标记
      setData(data.map(item => 
        item.id === currentRecord.id 
          ? { ...item, tag: selectedTag, tagNote }
          : item
      ));
    } else {
      // 批量标记
      setData(data.map(item => 
        selectedRows.has(item.id)
          ? { ...item, tag: selectedTag, tagNote }
          : item
      ));
      setSelectedRows(new Set());
    }

    handleCloseModal();
  };

  // 移除标签
  const handleRemoveTag = (id: string) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, tag: undefined, tagNote: undefined }
        : item
    ));
  };

  // 导出数据
  const handleExport = () => {
    const csvContent = [
      ['期', '门店', '订单号', '实际时效(h)', '标准时效(h)', '差异', '状态', '异常标签', '备注'],
      ...filteredData.map(item => [
        item.date,
        item.store,
        item.orderNo,
        item.actualTime,
        item.standardTime,
        item.actualTime - item.standardTime,
        item.status === 'completed' ? '正常' : '超标',
        item.tag || '-',
        item.tagNote || '-'
      ])
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob(['\\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedMetric}_剔除前_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 下发数据
  const handleSubmit = () => {
    const taggedData = data.filter(item => !!item.tag);
    if (taggedData.length === 0) {
      alert('没有已标记异常的数据需要下发');
      return;
    }
    alert(`成功下发 ${taggedData.length} 条异常数据！`);
  };

  // 数据筛选
  const filteredData = data.filter(item => {
    if (statusFilter === 'completed') return item.status === 'completed';
    if (statusFilter === 'inProgress') return item.status === 'inProgress';
    if (statusFilter === 'tagged') return !!item.tag;
    return true;
  });

  // 统计数据
  const stats = {
    total: data.length,
    overdue: data.filter(item => item.status === 'inProgress').length,
    avgTime: (data.reduce((sum, item) => sum + item.actualTime, 0) / data.length).toFixed(2),
    onTimeRate: ((data.filter(item => item.status === 'completed').length / data.length) * 100).toFixed(2),
    tagged: data.filter(item => !!item.tag).length
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">异常明细</h2>
        <p className="text-sm text-gray-600">
          基于订单状态和指标名称管理异常数据
        </p>
      </div>

      {/* 筛选控制区 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* 指标选择 */}
          <div className="flex-1 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              <div className="relative inline-flex items-center group">
                选择指标
                <div className="ml-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
                  ⑩
                </div>
                <div className="absolute left-0 top-full mt-2 w-[480px] bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                  <div className="font-semibold mb-2">批注⑩</div>
                  <div className="text-gray-300">
                    需求标注：选择指标指包含有目标值且有异常单据的指标。如果均没有，那么就不展示到页面选择项中
                  </div>
                </div>
              </div>
            </label>
            <div className="flex-1 relative">
              <button
                onClick={() => setShowMetricDropdown(!showMetricDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
              >
                <span className="truncate">
                  {selectedMetrics.includes('全部') 
                    ? '全部' 
                    : selectedMetrics.length > 0 
                      ? `已选 ${selectedMetrics.length} 项` 
                      : '请选择指标'}
                </span>
                <svg className="ml-2 h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showMetricDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <label
                      className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded ${
                        selectedMetrics.includes('全部') ? 'bg-blue-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMetrics.includes('全部')}
                        onChange={() => handleMetricToggle('全部')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded mr-2"
                      />
                      <span className="font-medium text-gray-900">全部</span>
                    </label>
                    <div className="border-t border-gray-200 my-2"></div>
                    {METRICS.map(metric => (
                      <label
                        key={metric}
                        className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded ${
                          selectedMetrics.includes(metric) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric)}
                          onChange={() => handleMetricToggle(metric)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded mr-2"
                        />
                        <span className="text-gray-700">{metric.replace(/时长/g, '时效')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              <div className="relative inline-flex items-center group">
                订单状态
                <div className="ml-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
                  ⑨
                </div>
                <div className="absolute left-0 top-full mt-2 w-[480px] bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                  <div className="font-semibold mb-2">批注⑨</div>
                  <div className="text-gray-300 space-y-1.5">
                    <div>需求标注：订单状态的判断规则为：【结束时间】是否为空，【结束时间】为"空"，表示订单进行中，【结束时间】不为"空"，表示订单已完成。</div>
                    <div>进行中的订单，其结束时间默认为当前取值的时间。</div>
                    <div>异常判断逻辑为：当前时间 - 开始时间 &gt; 目标值，则为异常单据。</div>
                  </div>
                </div>
              </div>
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部</option>
              <option value="completed">已完成</option>
              <option value="inProgress">进行中</option>
            </select>
          </div>
        </div>
      </div>

      {/* 明细数据表格 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 表格工具栏 */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-gray-700">
              异常数据明细 {selectedRows.size > 0 && `(已选 ${selectedRows.size} 条)`}
            </div>
            {filteredData.length !== data.length && (
              <div className="text-xs text-blue-600">
                筛选后显示 {filteredData.length} / {data.length} 条
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExport}
                className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                导出数据
              </button>
            </div>
          </div>
        </div>

        {/* 表格内容 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded" 
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">指标名称</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">门店</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">单号</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">件数</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                  <div className="relative inline-flex items-center group">
                    开始时间
                    <div className="ml-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
                      ⑧
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-1">批注⑧</div>
                      <div className="text-gray-300">需求标注：指标的计算逻辑为：结束时间-开始时间，表格中的开始时间和结束时间分别对应取值字段</div>
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">结束时间</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">单据类型</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">实际时长</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">标准时长</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">所属品类</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">订单状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const diff = item.actualTime - item.standardTime;
                  const isSelected = selectedRows.has(item.id);
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 ${item.status === 'inProgress' && !item.tag ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded" 
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.metricName.replace(/时长/g, '时效')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.store}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.orderNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.startTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.endTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.docType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.actualTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.standardTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'completed'
                            ? 'text-green-700 bg-green-100'
                            : 'text-blue-700 bg-blue-100'
                        }`}>
                          {item.status === 'completed' ? '已完成' : '进行中'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {filteredData.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              显示 1-{filteredData.length} 条，共 {filteredData.length} 条记录
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                上一页
              </button>
              <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded">1</button>
              <button className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 标记异常弹窗 */}
      {showTagModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* 弹窗标题 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentRecord ? '修改异常标签' : '批量标记异常'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="px-6 py-4 space-y-4">
              {currentRecord && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="text-gray-600 mb-1">订单号: {currentRecord.orderNo}</div>
                  <div className="text-gray-600">门店: {currentRecord.store}</div>
                </div>
              )}

              {!currentRecord && selectedRows.size > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                  将为 {selectedRows.size} 条记录标记异常标签
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  异常类型 <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择异常类型</option>
                  {EXCEPTION_TAGS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注说明
                </label>
                <textarea
                  value={tagNote}
                  onChange={(e) => setTagNote(e.target.value)}
                  placeholder="请输入异常原因或其他说明（选填）"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* 弹窗按钮 */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTag}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { TrendingUp, TrendingDown, Calendar, Package, FileText, Maximize2, Download } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { OtherMetricsModule } from './OtherMetricsModule';
import { Info } from 'lucide-react';

type Dimension = 'tickets' | 'pieces';
type TimeDimension = 'monthly' | 'weekly';

interface MetricData {
  name: string;
  avgDays: number;
  trend: number;
  monthlyData: number[];
  weeklyData: number[];
  dimension?: '票数' | '件数'; // 新增维度字段
}

interface UnifiedInventoryMetricsProps {
  dimension: Dimension;
  timeDimension: TimeDimension;
  setDimension: (dimension: Dimension) => void;
  setTimeDimension: (timeDimension: TimeDimension) => void;
  selectedCategories: string[];
  businessSegment?: 'all' | 'ordering' | 'distribution' | 'store' | 'other';
  indicatorType?: 'all' | 'timeliness' | 'quality' | 'efficiency' | 'cost' | 'planning';
}

export function UnifiedInventoryMetrics({ dimension, timeDimension, setDimension, setTimeDimension, selectedCategories, businessSegment = 'all', indicatorType = 'all' }: UnifiedInventoryMetricsProps) {
  const [deliveryTab, setDeliveryTab] = useState<'timeliness' | 'stores'>('timeliness');
  const [storeSegmentTab, setStoreSegmentTab] = useState<'transfer' | 'fullChain' | 'inOut'>('transfer');
  const [highlightChartArea, setHighlightChartArea] = useState(false);
  const [firstLineTimeDimension, setFirstLineTimeDimension] = useState<TimeDimension>('monthly');
  
  // 判断是否显示某个业务模块
  const shouldShowModule = (segment: 'ordering' | 'distribution' | 'store' | 'other'): boolean => {
    // 检查业务环节筛选
    const segmentMatch = businessSegment === 'all' || businessSegment === segment;
    
    // 检查指标类型筛选
    let typeMatch = true;
    if (indicatorType === 'timeliness') {
      // 时效指标：订货段、分货段、门店段
      typeMatch = segment === 'ordering' || segment === 'distribution' || segment === 'store';
    } else if (indicatorType === 'quality') {
      // 质量指标：其它
      typeMatch = segment === 'other';
    } else if (indicatorType === 'efficiency' || indicatorType === 'cost' || indicatorType === 'planning') {
      // 其他指标类型暂时不显示任何模块
      typeMatch = false;
    }
    // indicatorType === 'all' 时 typeMatch 保持 true
    
    return segmentMatch && typeMatch;
  };
  
  // 品类筛选辅助函数
  const shouldShowCategory = (categoryKey: string): boolean => {
    // 如果没有选择任何品类，显示所有品类
    if (!selectedCategories || selectedCategories.length === 0) {
      return true;
    }
    // 检查是否选中了该品类
    return selectedCategories.includes(categoryKey);
  };

  // 获取时间标签
  const getTimeLabels = () => {
    if (timeDimension === 'monthly') {
      return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '12月'];
    }
    return ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'];
  };

  // 导出数据为CSV
  const handleExport = () => {
    const timeLabels = getTimeLabels();
    const dimensionText = dimension === 'tickets' ? '票数' : '件数';
    const timeDimensionText = timeDimension === 'monthly' ? '每月' : '近八周';
    
    // CSV内容数组
    const csvRows: string[] = [];
    
    // 添加标题
    csvRows.push(`一盘货时效指标明细数据 - ${dimensionText} - ${timeDimensionText}`);
    csvRows.push(`导出时间: ${new Date().toLocaleString('zh-CN')}`);
    csvRows.push('');
    
    // 判断是否显示品类列
    const showCategoryColumn = !selectedCategories || selectedCategories.length === 0 || selectedCategories.length === 2;
    
    // 构建表头
    const headers = [];
    if (showCategoryColumn) {
      headers.push('品类');
    }
    headers.push('指标');
    headers.push('均值天数');
    headers.push('月度均值');
    
    // 添加时间列标签（跳过12月）
    timeLabels.forEach((label, index) => {
      if (timeDimension === 'monthly' && index === 11) return;
      headers.push(label);
    });
    
    csvRows.push(headers.join(','));
    
    // 添加各业务环节的数据（这里需要遍历所有表格数据）
    // 由于数据结构复杂，这里提供一个简化版本，实际应用中需要根据具体数据结构调整
    csvRows.push('');
    csvRows.push('注: 此为示例数据，完整导出功能需要根据实际数据结构完善');
    
    // 创建Blob并下载
    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `一盘货时效明细_${dimensionText}_${timeDimensionText}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 表格样式类 - 紧凑版
  const tableHeaderClass = "px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap";
  const tableCellClass = "px-2 py-1.5 text-gray-700 border-r border-gray-200";
  const tableCellCenterClass = "px-2 py-1.5 text-center text-gray-700 border-r border-gray-200";
  
  // 模拟数据 - 入库时效达标率（订货端）- 分品类数据
  const inboundDataByCategory = {
    tickets: {
      alcohol: {
        name: '酒水',
        monthlyData: [6.8, 7.2, 7.8, 8.5, 7.5, 7.9, 7.4, 8.2, 8.8, 7.8, 7.5, 0, 7.2],
        weeklyData: [7.8, 7.5, 8.5, 8.0, 7.5, 7.9, 7.6, 7.8],
      },
      cosmetics: {
        name: '香化',
        monthlyData: [8.2, 8.8, 9.5, 10.2, 9.0, 9.5, 9.0, 10.0, 10.5, 9.2, 9.0, 0, 8.8],
        weeklyData: [9.2, 8.8, 10.0, 9.5, 9.0, 9.4, 9.1, 9.3],
      },
    },
    pieces: {
      alcohol: {
        name: '酒水',
        monthlyData: [9.5, 10.2, 10.8, 11.5, 10.5, 10.8, 10.3, 11.2, 11.8, 10.8, 10.5, 0, 10.2],
        weeklyData: [10.8, 10.5, 11.5, 11.0, 10.5, 10.9, 10.6, 10.8],
      },
      cosmetics: {
        name: '香化',
        monthlyData: [11.2, 11.8, 12.5, 13.2, 12.0, 12.5, 12.0, 13.0, 13.5, 12.5, 12.2, 0, 11.8],
        weeklyData: [12.2, 11.8, 13.0, 12.5, 12.0, 12.4, 12.1, 12.3],
      },
    },
  };

  // 入库时效达标率 - 表格详细指标数据（分品类）
  const inboundTableDataByCategory = {
    tickets: {
      alcohol: {
        over10Days: {
          monthlyData: [156, 182, 148, 195, 178, 162, 203, 175, 165, 189, 210, 0, 185],
          weeklyData: [175, 189, 165, 203, 210, 185, 195, 180],
        },
        over14Days: {
          monthlyData: [89, 105, 92, 118, 102, 95, 124, 108, 98, 115, 128, 0, 112],
          weeklyData: [108, 115, 98, 124, 128, 112, 118, 110],
        },
        totalOrders: {
          monthlyData: [1180, 1320, 1150, 1420, 1380, 1290, 1450, 1350, 1260, 1410, 1480, 0, 1390],
          weeklyData: [1350, 1410, 1260, 1450, 1480, 1390, 1420, 1380],
        },
        rate10Days: {
          monthlyData: [86.8, 86.2, 87.1, 86.3, 87.1, 87.4, 86.0, 87.0, 86.9, 86.6, 85.8, 0, 86.7],
          weeklyData: [87.0, 86.6, 86.9, 86.0, 85.8, 86.7, 86.3, 87.0],
        },
        rate14Days: {
          monthlyData: [92.5, 92.0, 92.0, 91.7, 92.6, 92.6, 91.4, 92.0, 92.2, 91.8, 91.4, 0, 91.9],
          weeklyData: [92.0, 91.8, 92.2, 91.4, 91.4, 91.9, 91.7, 92.0],
        },
      },
      cosmetics: {
        over10Days: {
          monthlyData: [102, 128, 136, 125, 148, 142, 118, 156, 145, 130, 168, 0, 143],
          weeklyData: [156, 145, 130, 118, 148, 143, 142, 138],
        },
        over14Days: {
          monthlyData: [58, 72, 85, 78, 92, 88, 68, 98, 89, 75, 105, 0, 88],
          weeklyData: [98, 89, 75, 68, 92, 88, 88, 85],
        },
        totalOrders: {
          monthlyData: [850, 920, 1050, 980, 1120, 1080, 950, 1150, 1090, 1010, 1200, 0, 1100],
          weeklyData: [1150, 1090, 1010, 950, 1120, 1100, 1080, 1060],
        },
        rate10Days: {
          monthlyData: [88.0, 86.1, 87.0, 87.2, 86.8, 86.9, 87.6, 86.4, 86.7, 87.1, 86.0, 0, 87.0],
          weeklyData: [86.4, 86.7, 87.1, 87.6, 86.8, 87.0, 86.9, 87.0],
        },
        rate14Days: {
          monthlyData: [93.2, 92.2, 91.9, 92.0, 91.8, 91.9, 92.8, 91.5, 91.8, 92.6, 91.3, 0, 92.0],
          weeklyData: [91.5, 91.8, 92.6, 92.8, 91.8, 92.0, 91.9, 92.0],
        },
      },
    },
    pieces: {
      alcohol: {
        over10Days: {
          monthlyData: [1625, 1846, 1794, 2152, 2086, 1742, 2352, 2019, 1833, 2268, 2450, 0, 2214],
          weeklyData: [2019, 2268, 1833, 2352, 2450, 2214, 2152, 2100],
        },
        over14Days: {
          monthlyData: [938, 1136, 1104, 1326, 1192, 1056, 1428, 1224, 1128, 1458, 1575, 0, 1422],
          weeklyData: [1224, 1458, 1128, 1428, 1575, 1422, 1326, 1380],
        },
        totalOrders: {
          monthlyData: [12500, 14200, 13800, 15600, 14900, 13200, 16800, 15300, 14100, 16200, 17500, 0, 15800],
          weeklyData: [15300, 16200, 14100, 16800, 17500, 15800, 16200, 15600],
        },
        rate10Days: {
          monthlyData: [87.0, 87.0, 87.0, 86.2, 86.0, 86.8, 86.0, 86.8, 87.0, 86.0, 86.0, 0, 86.0],
          weeklyData: [86.8, 86.0, 87.0, 86.0, 86.0, 86.0, 86.2, 86.5],
        },
        rate14Days: {
          monthlyData: [92.5, 92.0, 92.0, 91.5, 92.0, 92.0, 91.5, 92.0, 92.0, 91.0, 91.0, 0, 91.0],
          weeklyData: [92.0, 91.0, 92.0, 91.5, 91.0, 91.0, 91.5, 91.2],
        },
      },
      cosmetics: {
        over10Days: {
          monthlyData: [3224, 2900, 3394, 3055, 3614, 3328, 2977, 3666, 3432, 3133, 3835, 0, 3510],
          weeklyData: [3666, 3432, 3133, 2977, 3614, 3510, 3328, 3480],
        },
        over14Days: {
          monthlyData: [1984, 1784, 2088, 1880, 2224, 2048, 1832, 2256, 2112, 1928, 2360, 0, 2160],
          weeklyData: [2256, 2112, 1928, 1832, 2224, 2160, 2048, 2140],
        },
        totalOrders: {
          monthlyData: [24800, 22300, 26100, 23500, 27800, 25600, 22900, 28200, 26400, 24100, 29500, 0, 27000],
          weeklyData: [28200, 26400, 24100, 22900, 27800, 27000, 25600, 26800],
        },
        rate10Days: {
          monthlyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 0, 87.0],
          weeklyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0],
        },
        rate14Days: {
          monthlyData: [92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 0, 92.0],
          weeklyData: [92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0],
        },
      },
    },
  };
  
  // 模拟数据 - 入库时效达标率（订货端）
  const inboundData: Record<Dimension, MetricData> = {
    tickets: {
      name: '入库时效达标率（订货端）',
      avgDays: 8.5,
      trend: 2.3,
      monthlyData: [85, 87, 86, 88, 90, 89, 91, 88, 87, 89, 90, 0, 88],
      weeklyData: [88, 89, 87, 90, 91, 89, 88, 89],
    },
    pieces: {
      name: '入库时效达标率（订货端）',
      avgDays: 8.2,
      trend: 3.1,
      monthlyData: [87, 89, 88, 90, 92, 91, 93, 90, 89, 91, 92, 0, 90],
      weeklyData: [90, 91, 89, 92, 93, 91, 90, 91],
    },
  };

  // 模拟数据 - 出库时效达标率（分货端）- 分品类数据
  const outboundDataByCategory = {
    tickets: {
      alcohol: {
        name: '酒水',
        monthlyData: [7.2, 7.8, 8.5, 9.2, 8.0, 8.3, 7.9, 8.8, 9.5, 8.2, 7.8, 0, 7.5],
        weeklyData: [8.2, 7.8, 9.0, 8.5, 8.0, 8.4, 7.9, 8.3],
      },
      cosmetics: {
        name: '香化',
        monthlyData: [8.8, 9.4, 10.2, 10.8, 9.6, 10.0, 9.5, 10.5, 11.0, 9.8, 9.5, 0, 9.2],
        weeklyData: [9.8, 9.4, 10.6, 10.1, 9.6, 10.0, 9.5, 9.8],
      },
    },
    pieces: {
      alcohol: {
        name: '酒水',
        monthlyData: [10.2, 10.8, 11.5, 12.0, 11.0, 11.3, 10.8, 11.8, 12.3, 11.2, 10.9, 0, 10.5],
        weeklyData: [11.2, 10.8, 12.0, 11.5, 11.0, 11.4, 10.9, 11.2],
      },
      cosmetics: {
        name: '香化',
        monthlyData: [11.8, 12.5, 13.2, 13.8, 12.6, 13.0, 12.5, 13.5, 14.0, 13.0, 12.7, 0, 12.3],
        weeklyData: [12.8, 12.4, 13.6, 13.1, 12.6, 13.0, 12.5, 12.8],
      },
    },
  };

  // 出库时效达标率 - 表格详细指标��据（分品类）
  const outboundTableDataByCategory = {
    tickets: {
      alcohol: {
        over10Days: {
          monthlyData: [142, 167, 148, 182, 158, 152, 191, 170, 155, 179, 196, 0, 172],
          weeklyData: [170, 179, 155, 191, 196, 172, 182, 175],
        },
        over14Days: {
          monthlyData: [78, 96, 91, 108, 95, 87, 114, 104, 95, 110, 124, 0, 109],
          weeklyData: [104, 110, 95, 114, 124, 109, 108, 112],
        },
        totalOrders: {
          monthlyData: [1050, 1280, 1140, 1350, 1220, 1160, 1420, 1310, 1190, 1380, 1460, 0, 1320],
          weeklyData: [1310, 1380, 1190, 1420, 1460, 1320, 1350, 1340],
        },
        rate10Days: {
          monthlyData: [86.5, 87.0, 87.0, 86.5, 87.0, 86.9, 86.5, 87.0, 87.0, 87.0, 86.6, 0, 87.0],
          weeklyData: [87.0, 87.0, 87.0, 86.5, 86.6, 87.0, 86.5, 86.9],
        },
        rate14Days: {
          monthlyData: [92.6, 92.5, 92.0, 92.0, 92.2, 92.5, 92.0, 92.1, 92.0, 92.0, 91.5, 0, 91.7],
          weeklyData: [92.1, 92.0, 92.0, 92.0, 91.5, 91.7, 92.0, 91.6],
        },
      },
      cosmetics: {
        over10Days: {
          monthlyData: [94, 115, 124, 110, 134, 127, 116, 142, 132, 120, 150, 0, 137],
          weeklyData: [142, 132, 120, 116, 134, 137, 127, 130],
        },
        over14Days: {
          monthlyData: [54, 70, 76, 67, 82, 78, 71, 87, 81, 74, 92, 0, 84],
          weeklyData: [87, 81, 74, 71, 82, 84, 78, 80],
        },
        totalOrders: {
          monthlyData: [780, 880, 950, 840, 1020, 970, 890, 1080, 1010, 920, 1150, 0, 1050],
          weeklyData: [1080, 1010, 920, 890, 1020, 1050, 970, 1000],
        },
        rate10Days: {
          monthlyData: [87.9, 86.9, 86.9, 86.9, 86.9, 86.9, 87.0, 86.9, 86.9, 87.0, 87.0, 0, 86.9],
          weeklyData: [86.9, 86.9, 87.0, 87.0, 86.9, 86.9, 86.9, 86.9],
        },
        rate14Days: {
          monthlyData: [93.1, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 91.9, 92.0, 92.0, 92.0, 0, 92.0],
          weeklyData: [91.9, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0],
        },
      },
    },
    pieces: {
      alcohol: {
        over10Days: {
          monthlyData: [1534, 1768, 1677, 2096, 1858, 1651, 2145, 1924, 1742, 2054, 2236, 0, 1963],
          weeklyData: [1924, 2054, 1742, 2145, 2236, 1963, 2096, 2000],
        },
        over14Days: {
          monthlyData: [944, 1088, 1032, 1368, 1144, 1016, 1485, 1184, 1072, 1422, 1548, 0, 1359],
          weeklyData: [1184, 1422, 1072, 1485, 1548, 1359, 1368, 1400],
        },
        totalOrders: {
          monthlyData: [11800, 13600, 12900, 15200, 14300, 12700, 16500, 14800, 13400, 15800, 17200, 0, 15100],
          weeklyData: [14800, 15800, 13400, 16500, 17200, 15100, 15200, 15000],
        },
        rate10Days: {
          monthlyData: [87.0, 87.0, 87.0, 86.2, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 0, 87.0],
          weeklyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 86.2, 86.7],
        },
        rate14Days: {
          monthlyData: [92.0, 92.0, 92.0, 91.0, 92.0, 92.0, 91.0, 92.0, 92.0, 91.0, 91.0, 0, 91.0],
          weeklyData: [92.0, 91.0, 92.0, 91.0, 91.0, 91.0, 91.0, 91.0],
        },
      },
      cosmetics: {
        over10Days: {
          monthlyData: [3016, 2795, 3302, 2964, 3497, 3211, 2834, 3588, 3276, 3055, 3744, 0, 3419],
          weeklyData: [3588, 3276, 3055, 2834, 3497, 3419, 3211, 3350],
        },
        over14Days: {
          monthlyData: [1856, 1720, 2032, 1824, 2152, 1976, 1744, 2208, 2016, 1880, 2304, 0, 2104],
          weeklyData: [2208, 2016, 1880, 1744, 2152, 2104, 1976, 2060],
        },
        totalOrders: {
          monthlyData: [23200, 21500, 25400, 22800, 26900, 24700, 21800, 27600, 25200, 23500, 28800, 0, 26300],
          weeklyData: [27600, 25200, 23500, 21800, 26900, 26300, 24700, 25800],
        },
        rate10Days: {
          monthlyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 0, 87.0],
          weeklyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0],
        },
        rate14Days: {
          monthlyData: [92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 0, 92.0],
          weeklyData: [92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0],
        },
      },
    },
  };

  // 模拟数据 - 全链路分货平均时效 - 分品类数据
  const distributionFullChainDataByCategory = {
    tickets: {
      alcohol: {
        name: '酒水',
        monthlyData: [6.5, 7.0, 7.5, 8.2, 7.2, 7.6, 7.0, 7.8, 8.5, 7.4, 7.0, 0, 6.8],
        weeklyData: [7.4, 7.0, 8.0, 7.6, 7.2, 7.5, 7.1, 7.4],
      },
      cosmetics: {
        name: '香化',
        monthlyData: [8.0, 8.5, 9.2, 9.8, 8.8, 9.2, 8.6, 9.5, 10.0, 9.0, 8.6, 0, 8.3],
        weeklyData: [9.0, 8.6, 9.6, 9.2, 8.8, 9.1, 8.7, 9.0],
      },
    },
    pieces: {
      alcohol: {
        name: '酒水',
        monthlyData: [9.5, 10.0, 10.6, 11.2, 10.2, 10.6, 10.0, 11.0, 11.6, 10.4, 10.0, 0, 9.8],
        weeklyData: [10.4, 10.0, 11.0, 10.6, 10.2, 10.5, 10.1, 10.4],
      },
      cosmetics: {
        name: '香化',
        monthlyData: [11.0, 11.6, 12.2, 12.8, 11.8, 12.2, 11.6, 12.6, 13.2, 12.0, 11.6, 0, 11.3],
        weeklyData: [12.0, 11.6, 12.6, 12.2, 11.8, 12.1, 11.7, 12.0],
      },
    },
  };

  // 全链路分货平均时效 - 表格详细指标数据（分品类）
  const distributionFullChainTableDataByCategory = {
    tickets: {
      alcohol: {
        over10Days: {
          monthlyData: [125, 148, 132, 168, 142, 138, 175, 156, 140, 165, 180, 0, 158],
          weeklyData: [156, 165, 140, 175, 180, 158, 168, 162],
        },
        over14Days: {
          monthlyData: [68, 85, 78, 96, 82, 75, 102, 92, 83, 98, 112, 0, 96],
          weeklyData: [92, 98, 83, 102, 112, 96, 96, 98],
        },
        totalOrders: {
          monthlyData: [980, 1180, 1060, 1280, 1140, 1080, 1350, 1220, 1110, 1300, 1380, 0, 1240],
          weeklyData: [1220, 1300, 1110, 1350, 1380, 1240, 1280, 1260],
        },
        rate10Days: {
          monthlyData: [87.2, 87.5, 87.5, 86.9, 87.5, 87.2, 87.0, 87.2, 87.4, 87.3, 87.0, 0, 87.3],
          weeklyData: [87.2, 87.3, 87.4, 87.0, 87.0, 87.3, 86.9, 87.2],
        },
        rate14Days: {
          monthlyData: [93.1, 92.8, 92.6, 92.5, 92.8, 93.1, 92.4, 92.5, 92.5, 92.5, 91.9, 0, 92.3],
          weeklyData: [92.5, 92.5, 92.5, 92.4, 91.9, 92.3, 92.5, 92.2],
        },
      },
      cosmetics: {
        over10Days: {
          monthlyData: [82, 102, 115, 98, 122, 116, 104, 130, 120, 108, 138, 0, 125],
          weeklyData: [130, 120, 108, 104, 122, 125, 116, 118],
        },
        over14Days: {
          monthlyData: [48, 62, 68, 58, 75, 70, 63, 82, 74, 66, 86, 0, 78],
          weeklyData: [82, 74, 66, 63, 75, 78, 70, 73],
        },
        totalOrders: {
          monthlyData: [720, 820, 880, 780, 950, 900, 830, 1020, 940, 860, 1080, 0, 980],
          weeklyData: [1020, 940, 860, 830, 950, 980, 900, 930],
        },
        rate10Days: {
          monthlyData: [88.6, 87.6, 86.9, 87.4, 87.2, 87.1, 87.5, 87.3, 87.2, 87.4, 87.2, 0, 87.2],
          weeklyData: [87.3, 87.2, 87.4, 87.5, 87.2, 87.2, 87.1, 87.3],
        },
        rate14Days: {
          monthlyData: [93.3, 92.4, 92.3, 92.6, 92.1, 92.2, 92.4, 92.0, 92.1, 92.3, 92.0, 0, 92.0],
          weeklyData: [92.0, 92.1, 92.3, 92.4, 92.1, 92.0, 92.2, 92.2],
        },
      },
    },
    pieces: {
      alcohol: {
        over10Days: {
          monthlyData: [1420, 1650, 1560, 1952, 1728, 1536, 1998, 1792, 1624, 1914, 2084, 0, 1828],
          weeklyData: [1792, 1914, 1624, 1998, 2084, 1828, 1952, 1860],
        },
        over14Days: {
          monthlyData: [876, 1016, 964, 1276, 1064, 948, 1386, 1104, 1000, 1326, 1444, 0, 1268],
          weeklyData: [1104, 1326, 1000, 1386, 1444, 1268, 1276, 1300],
        },
        totalOrders: {
          monthlyData: [10900, 12700, 12000, 14200, 13300, 11800, 15400, 13800, 12500, 14700, 16000, 0, 14100],
          weeklyData: [13800, 14700, 12500, 15400, 16000, 14100, 14200, 14000],
        },
        rate10Days: {
          monthlyData: [87.0, 87.0, 87.0, 86.3, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 0, 87.0],
          weeklyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 86.3, 86.8],
        },
        rate14Days: {
          monthlyData: [92.0, 92.0, 92.0, 91.0, 92.0, 92.0, 91.0, 92.0, 92.0, 91.0, 91.0, 0, 91.0],
          weeklyData: [92.0, 91.0, 92.0, 91.0, 91.0, 91.0, 91.0, 91.0],
        },
      },
      cosmetics: {
        over10Days: {
          monthlyData: [2794, 2604, 3074, 2760, 3256, 2992, 2638, 3348, 3052, 2848, 3492, 0, 3188],
          weeklyData: [3348, 3052, 2848, 2638, 3256, 3188, 2992, 3120],
        },
        over14Days: {
          monthlyData: [1720, 1602, 1892, 1698, 2004, 1840, 1632, 2118, 1880, 1754, 2148, 0, 1960],
          weeklyData: [2118, 1880, 1754, 1632, 2004, 1960, 1840, 1920],
        },
        totalOrders: {
          monthlyData: [21500, 20000, 23600, 21200, 25000, 23000, 20300, 25700, 23400, 21900, 26800, 0, 24500],
          weeklyData: [25700, 23400, 21900, 20300, 25000, 24500, 23000, 24000],
        },
        rate10Days: {
          monthlyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 0, 87.0],
          weeklyData: [87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0, 87.0],
        },
        rate14Days: {
          monthlyData: [92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 91.8, 92.0, 92.0, 92.0, 0, 92.0],
          weeklyData: [91.8, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0, 92.0],
        },
      },
    },
  };
  
  // 模拟数据 - 出库时效达标率（分货端）
  const outboundData: Record<Dimension, MetricData> = {
    tickets: {
      name: '仓库出库平均时效',
      avgDays: 7.8,
      trend: 1.8,
      monthlyData: [82, 84, 83, 85, 87, 86, 88, 85, 84, 86, 87, 0, 85],
      weeklyData: [85, 86, 84, 87, 88, 86, 85, 86],
    },
    pieces: {
      name: '仓库出库平均时效',
      avgDays: 7.5,
      trend: 2.5,
      monthlyData: [84, 86, 85, 87, 89, 88, 90, 87, 86, 88, 89, 0, 87],
      weeklyData: [87, 88, 86, 89, 90, 88, 87, 88],
    },
  };

  // 通关时效数据（不分品类）
  const customsClearanceData: Record<Dimension, {
    firstLine: MetricData;
    secondLine: MetricData;
  }> = {
    tickets: {
      firstLine: {
        name: '一线通关平均时效',
        avgDays: 2.8,
        trend: -0.5,
        monthlyData: [3.2, 3.0, 2.9, 2.8, 2.7, 2.8, 2.6, 2.9, 3.0, 2.7, 2.6, 0, 2.8],
        weeklyData: [2.9, 2.8, 3.0, 2.7, 2.6, 2.8, 2.9, 2.8],
      },
      secondLine: {
        name: '二线通关平均时效',
        avgDays: 4.2,
        trend: -0.8,
        monthlyData: [4.5, 4.3, 4.4, 4.2, 4.0, 4.1, 3.9, 4.3, 4.4, 4.0, 3.9, 0, 4.2],
        weeklyData: [4.3, 4.2, 4.4, 4.0, 3.9, 4.1, 4.2, 4.1],
      },
    },
    pieces: {
      firstLine: {
        name: '一线通关平均时效',
        avgDays: 2.6,
        trend: -0.6,
        monthlyData: [3.0, 2.8, 2.7, 2.6, 2.5, 2.6, 2.4, 2.7, 2.8, 2.5, 2.4, 0, 2.6],
        weeklyData: [2.7, 2.6, 2.8, 2.5, 2.4, 2.6, 2.7, 2.6],
      },
      secondLine: {
        name: '二线通关平均时效',
        avgDays: 3.9,
        trend: -0.9,
        monthlyData: [4.2, 4.0, 4.1, 3.9, 3.7, 3.8, 3.6, 4.0, 4.1, 3.7, 3.6, 0, 3.9],
        weeklyData: [4.0, 3.9, 4.1, 3.7, 3.6, 3.8, 3.9, 3.8],
      },
    },
  };

  // 仓-店路径时效数据
  interface WarehouseStoreData {
    warehouse: string;
    stores: {
      name: string;
      data: number[];
    }[];
  }

  const warehouseStoreTimelinessData: Record<Dimension, {
    inbound: WarehouseStoreData[];
    outbound: WarehouseStoreData[];
  }> = {
    tickets: {
      inbound: [
        {
          warehouse: '',
          stores: [
            { name: '【6868】三亚海棠湾店', data: [85, 87, 86, 88, 90, 89, 91, 88, 87, 89, 90, 0, 88] },
            { name: '【7048】新海港店', data: [82, 84, 83, 85, 87, 86, 88, 85, 84, 86, 87, 0, 85] },
            { name: '【7016】三亚凤凰机场店', data: [88, 90, 89, 91, 93, 92, 94, 91, 90, 92, 93, 0, 91] },
            { name: '【6132】海口美兰机场店', data: [90, 92, 91, 93, 95, 94, 96, 93, 92, 94, 95, 0, 93] },
            { name: '【6922】海口日月店', data: [87, 89, 88, 90, 92, 91, 93, 90, 89, 91, 92, 0, 90] },
            { name: '【6921】博鳌店', data: [93, 95, 94, 96, 98, 97, 99, 96, 95, 97, 98, 0, 96] },
          ],
        },
      ],
      outbound: [
        {
          warehouse: '',
          stores: [
            { name: '【6868】三亚海棠湾店', data: [83, 85, 84, 86, 88, 87, 89, 86, 85, 87, 88, 0, 86] },
            { name: '【7048】新海港店', data: [80, 82, 81, 83, 85, 84, 86, 83, 82, 84, 85, 0, 83] },
            { name: '【7016】三亚凤凰机场店', data: [86, 88, 87, 89, 91, 90, 92, 89, 88, 90, 91, 0, 89] },
            { name: '【6132】海口美兰机场店', data: [88, 90, 89, 91, 93, 92, 94, 91, 90, 92, 93, 0, 91] },
            { name: '【6922】海口日月店', data: [85, 87, 86, 88, 90, 89, 91, 88, 87, 89, 90, 0, 88] },
            { name: '【6921】博鳌店', data: [91, 93, 92, 94, 96, 95, 97, 94, 93, 95, 96, 0, 94] },
          ],
        },
      ],
    },
    pieces: {
      inbound: [
        {
          warehouse: '',
          stores: [
            { name: '【6868】三亚海棠湾店', data: [87, 89, 88, 90, 92, 91, 93, 90, 89, 91, 92, 0, 90] },
            { name: '【7048】新海港店', data: [84, 86, 85, 87, 89, 88, 90, 87, 86, 88, 89, 0, 87] },
            { name: '【7016】三亚��凰机场店', data: [90, 92, 91, 93, 95, 94, 96, 93, 92, 94, 95, 0, 93] },
            { name: '【6132】海口美兰机场店', data: [92, 94, 93, 95, 97, 96, 98, 95, 94, 96, 97, 0, 95] },
            { name: '【6922】海口日月店', data: [89, 91, 90, 92, 94, 93, 95, 92, 91, 93, 94, 0, 92] },
            { name: '【6921】博鳌店', data: [95, 97, 96, 98, 100, 99, 100, 98, 97, 99, 100, 0, 98] },
          ],
        },
      ],
      outbound: [
        {
          warehouse: '',
          stores: [
            { name: '【6868】三亚海棠湾店', data: [85, 87, 86, 88, 90, 89, 91, 88, 87, 89, 90, 0, 88] },
            { name: '【7048】新海港店', data: [82, 84, 83, 85, 87, 86, 88, 85, 84, 86, 87, 0, 85] },
            { name: '【7016】三亚凤凰机场店', data: [88, 90, 89, 91, 93, 92, 94, 91, 90, 92, 93, 0, 91] },
            { name: '【6132】海口美兰机场店', data: [90, 92, 91, 93, 95, 94, 96, 93, 92, 94, 95, 0, 93] },
            { name: '【6922】海口日月店', data: [87, 89, 88, 90, 92, 91, 93, 90, 89, 91, 92, 0, 90] },
            { name: '【6921】博鳌店', data: [93, 95, 94, 96, 98, 97, 99, 96, 95, 97, 98, 0, 96] },
          ],
        },
      ],
    },
  };

  // 门店交付时效数据 - 及时率指标（单+件数维度）
  interface TimelinessMetric {
    tickets: number[];
    pieces: number[];
  }

  const deliveryTimelinessMetrics: {
    [key: string]: TimelinessMetric;
  } = {
    customsClearance: {
      tickets: [88, 89, 87, 90, 92, 91, 93, 90, 89, 91, 92, 0, 90],
      pieces: [90, 91, 89, 92, 94, 93, 95, 92, 91, 93, 94, 0, 92],
    },
    delivery: {
      tickets: [85, 86, 84, 87, 89, 88, 90, 87, 86, 88, 89, 0, 87],
      pieces: [87, 88, 86, 89, 91, 90, 92, 89, 88, 90, 91, 0, 89],
    },
    dailyTransferResponse: {
      tickets: [92, 93, 91, 94, 96, 95, 97, 94, 93, 95, 96, 0, 94],
      pieces: [93, 94, 92, 95, 97, 96, 98, 95, 94, 96, 97, 0, 95],
    },
    reassignmentApproval: {
      tickets: [78, 79, 77, 80, 82, 81, 83, 80, 79, 81, 82, 0, 80],
      pieces: [80, 81, 79, 82, 84, 83, 85, 82, 81, 83, 84, 0, 82],
    },
  };

  // 门店交付时效数据 - 按门店展示的指标
  interface StoreMetricData {
    name: string;
    data: number[];
  }

  const deliveryStoreMetrics: {
    [key: string]: StoreMetricData[];
  } = {
    pickupToShelf: [
      { name: '【6868】三亚海棠湾店', data: [2.3, 2.1, 2.4, 2.2, 2.0, 2.1, 1.9, 2.2, 2.3, 2.1, 2.0, 0, 2.1] },
      { name: '【7048】新海港店', data: [2.5, 2.4, 2.6, 2.5, 2.3, 2.4, 2.2, 2.5, 2.6, 2.4, 2.3, 0, 2.4] },
      { name: '【7016】三亚凤凰机场店', data: [2.4, 2.3, 2.5, 2.4, 2.2, 2.3, 2.1, 2.4, 2.5, 2.3, 2.2, 0, 2.3] },
      { name: '【6132】海口美兰机场店', data: [1.8, 1.9, 1.7, 1.8, 1.6, 1.7, 1.5, 1.8, 1.9, 1.7, 1.6, 0, 1.7] },
      { name: '【6922】海口日月店', data: [2.0, 2.1, 1.9, 2.0, 1.8, 1.9, 1.7, 2.0, 2.1, 1.9, 1.8, 0, 1.9] },
      { name: '【6921】博鳌店', data: [2.2, 2.0, 2.3, 2.1, 1.9, 2.0, 1.8, 2.1, 2.2, 2.0, 1.9, 0, 2.0] },
    ],
    averagePickup: [
      { name: '【6868】三亚海棠湾店', data: [1.5, 1.4, 1.6, 1.5, 1.3, 1.4, 1.2, 1.5, 1.6, 1.4, 1.3, 0, 1.4] },
      { name: '【7048】新海港店', data: [1.8, 1.7, 1.9, 1.8, 1.6, 1.7, 1.5, 1.8, 1.9, 1.7, 1.6, 0, 1.7] },
      { name: '【7016】三亚凤凰机场店', data: [1.7, 1.6, 1.8, 1.7, 1.5, 1.6, 1.4, 1.7, 1.8, 1.6, 1.5, 0, 1.6] },
      { name: '【6132】海口美兰机场店', data: [1.2, 1.1, 1.3, 1.2, 1.0, 1.1, 0.9, 1.2, 1.3, 1.1, 1.0, 0, 1.1] },
      { name: '【6922】海口日月店', data: [1.3, 1.4, 1.2, 1.3, 1.1, 1.2, 1.0, 1.3, 1.4, 1.2, 1.1, 0, 1.2] },
      { name: '【6921】博鳌店', data: [1.6, 1.5, 1.7, 1.6, 1.4, 1.5, 1.3, 1.6, 1.7, 1.5, 1.4, 0, 1.5] },
    ],
    vehicleQualificationRate: [
      { name: '【6868】三亚海棠湾店', data: [95, 96, 94, 95, 97, 96, 98, 95, 94, 96, 97, 0, 96] },
      { name: '【7048】新海港店', data: [92, 93, 91, 92, 94, 93, 95, 92, 91, 93, 94, 0, 93] },
      { name: '【7016】三亚凤凰机场店', data: [93, 94, 92, 93, 95, 94, 96, 93, 92, 94, 95, 0, 94] },
      { name: '【6132】海口美兰机场店', data: [98, 99, 97, 98, 100, 99, 100, 98, 97, 99, 100, 0, 99] },
      { name: '【6922】海口日月店', data: [96, 97, 95, 96, 98, 97, 99, 96, 95, 97, 98, 0, 97] },
      { name: '【6921】博鳌店', data: [94, 95, 93, 94, 96, 95, 97, 94, 93, 95, 96, 0, 95] },
    ],
    dailyTransferQualificationRate: [
      { name: '【6868】三亚海棠湾店', data: [89, 90, 88, 89, 91, 90, 92, 89, 88, 90, 91, 0, 90] },
      { name: '【7048】新海港店', data: [86, 87, 85, 86, 88, 87, 89, 86, 85, 87, 88, 0, 87] },
      { name: '【7016】三亚凤凰机场店', data: [87, 88, 86, 87, 89, 88, 90, 87, 86, 88, 89, 0, 88] },
      { name: '【6132】海口美兰机场店', data: [93, 94, 92, 93, 95, 94, 96, 93, 92, 94, 95, 0, 94] },
      { name: '【6922】海口日月店', data: [91, 92, 90, 91, 93, 92, 94, 91, 90, 92, 93, 0, 92] },
      { name: '【6921】博鳌店', data: [88, 89, 87, 88, 90, 89, 91, 88, 87, 89, 90, 0, 89] },
    ],
    expressDeliveryRate: [
      { name: '��6868】三亚海棠湾店', data: [92, 93, 91, 92, 94, 93, 95, 92, 91, 93, 94, 0, 93] },
      { name: '【7048】新海港店', data: [89, 90, 88, 89, 91, 90, 92, 89, 88, 90, 91, 0, 90] },
      { name: '【7016】三亚凤凰机场店', data: [90, 91, 89, 90, 92, 91, 93, 90, 89, 91, 92, 0, 91] },
      { name: '【6132】海口美兰机场店', data: [95, 96, 94, 95, 97, 96, 98, 95, 94, 96, 97, 0, 96] },
      { name: '【6922】海口日月店', data: [94, 95, 93, 94, 96, 95, 97, 94, 93, 95, 96, 0, 95] },
      { name: '【6921】博鳌店', data: [91, 92, 90, 91, 93, 92, 94, 91, 90, 92, 93, 0, 92] },
    ],
    transferFulfillmentRate: [
      { name: '【6868������亚海棠湾店', data: [87, 88, 86, 87, 89, 88, 90, 87, 86, 88, 89, 0, 88] },
      { name: '【7048】新海港店', data: [84, 85, 83, 84, 86, 85, 87, 84, 83, 85, 86, 0, 85] },
      { name: '【7016】三亚凤凰机场店', data: [85, 86, 84, 85, 87, 86, 88, 85, 84, 86, 87, 0, 86] },
      { name: '【6132】海口美兰机场店', data: [91, 92, 90, 91, 93, 92, 94, 91, 90, 92, 93, 0, 92] },
      { name: '【6922】海口日月店', data: [89, 90, 88, 89, 91, 90, 92, 89, 88, 90, 91, 0, 90] },
      { name: '【6921】博鳌店', data: [86, 87, 85, 86, 88, 87, 89, 86, 85, 87, 88, 0, 87] },
    ],
  };

  // 门店段新指标数据
  const storeSegmentMetrics: {
    [key: string]: StoreMetricData[];
  } = {
    // Tab 1 - 调拨时效
    supervisoryToTransit: [
      { name: '【6868】三亚海棠湾店', data: [3.2, 3.1, 3.3, 3.2, 3.0, 3.1, 2.9, 3.2, 3.3, 3.1, 3.0, 0, 3.1] },
      { name: '【7048】新海港店', data: [3.5, 3.4, 3.6, 3.5, 3.3, 3.4, 3.2, 3.5, 3.6, 3.4, 3.3, 0, 3.4] },
      { name: '【7016】三亚凤凰机场店', data: [3.4, 3.3, 3.5, 3.4, 3.2, 3.3, 3.1, 3.4, 3.5, 3.3, 3.2, 0, 3.3] },
      { name: '【6132】海口美兰机场店', data: [2.8, 2.9, 2.7, 2.8, 2.6, 2.7, 2.5, 2.8, 2.9, 2.7, 2.6, 0, 2.7] },
      { name: '【6922】海口日月店', data: [3.0, 3.1, 2.9, 3.0, 2.8, 2.9, 2.7, 3.0, 3.1, 2.9, 2.8, 0, 2.9] },
      { name: '【6921】博鳌店', data: [3.3, 3.2, 3.4, 3.3, 3.1, 3.2, 3.0, 3.3, 3.4, 3.2, 3.1, 0, 3.2] },
    ],
    transitToStore: [
      { name: '【6868】三亚海棠湾店', data: [2.5, 2.4, 2.6, 2.5, 2.3, 2.4, 2.2, 2.5, 2.6, 2.4, 2.3, 0, 2.4] },
      { name: '【7048】新海港店', data: [2.8, 2.7, 2.9, 2.8, 2.6, 2.7, 2.5, 2.8, 2.9, 2.7, 2.6, 0, 2.7] },
      { name: '【7016】三亚凤凰机场店', data: [2.7, 2.6, 2.8, 2.7, 2.5, 2.6, 2.4, 2.7, 2.8, 2.6, 2.5, 0, 2.6] },
      { name: '【6132】海口美兰机场店', data: [2.2, 2.1, 2.3, 2.2, 2.0, 2.1, 1.9, 2.2, 2.3, 2.1, 2.0, 0, 2.1] },
      { name: '【6922】海口日月店', data: [2.4, 2.3, 2.5, 2.4, 2.2, 2.3, 2.1, 2.4, 2.5, 2.3, 2.2, 0, 2.3] },
      { name: '【6921】博鳌店', data: [2.6, 2.5, 2.7, 2.6, 2.4, 2.5, 2.3, 2.6, 2.7, 2.5, 2.4, 0, 2.5] },
    ],
    // Tab 2 - 全链路时效
    directFullChain: [
      { name: '【6868】三亚海棠湾店', data: [5.8, 5.6, 6.0, 5.8, 5.4, 5.6, 5.2, 5.8, 6.0, 5.6, 5.4, 0, 5.6] },
      { name: '【7048】新海港店', data: [6.2, 6.0, 6.4, 6.2, 5.8, 6.0, 5.6, 6.2, 6.4, 6.0, 5.8, 0, 6.0] },
      { name: '【7016】三亚凤凰机场店', data: [6.0, 5.8, 6.2, 6.0, 5.6, 5.8, 5.4, 6.0, 6.2, 5.8, 5.6, 0, 5.8] },
      { name: '【6132】海口美兰机场店', data: [5.2, 5.0, 5.4, 5.2, 4.8, 5.0, 4.6, 5.2, 5.4, 5.0, 4.8, 0, 5.0] },
      { name: '【6922】海口日月店', data: [5.5, 5.3, 5.7, 5.5, 5.1, 5.3, 4.9, 5.5, 5.7, 5.3, 5.1, 0, 5.3] },
      { name: '【6921】博鳌店', data: [5.9, 5.7, 6.1, 5.9, 5.5, 5.7, 5.3, 5.9, 6.1, 5.7, 5.5, 0, 5.7] },
    ],
    mailFullChain: [
      { name: '【6868】三亚海棠湾店', data: [4.5, 4.3, 4.7, 4.5, 4.1, 4.3, 3.9, 4.5, 4.7, 4.3, 4.1, 0, 4.3] },
      { name: '【7048】新海港店', data: [4.8, 4.6, 5.0, 4.8, 4.4, 4.6, 4.2, 4.8, 5.0, 4.6, 4.4, 0, 4.6] },
      { name: '【7016】三亚凤凰机场店', data: [4.7, 4.5, 4.9, 4.7, 4.3, 4.5, 4.1, 4.7, 4.9, 4.5, 4.3, 0, 4.5] },
      { name: '【6132】海口美兰机场店', data: [4.0, 3.8, 4.2, 4.0, 3.6, 3.8, 3.4, 4.0, 4.2, 3.8, 3.6, 0, 3.8] },
      { name: '【6922】海口日月店', data: [4.2, 4.0, 4.4, 4.2, 3.8, 4.0, 3.6, 4.2, 4.4, 4.0, 3.8, 0, 4.0] },
      { name: '【6921】博鳌店', data: [4.6, 4.4, 4.8, 4.6, 4.2, 4.4, 4.0, 4.6, 4.8, 4.4, 4.2, 0, 4.4] },
    ],
    pickupPointFullChain: [
      { name: '【6868】三亚海棠湾店', data: [3.8, 3.6, 4.0, 3.8, 3.4, 3.6, 3.2, 3.8, 4.0, 3.6, 3.4, 0, 3.6] },
      { name: '【7048】新海港店', data: [4.2, 4.0, 4.4, 4.2, 3.8, 4.0, 3.6, 4.2, 4.4, 4.0, 3.8, 0, 4.0] },
      { name: '【7016】三亚凤凰机场店', data: [4.0, 3.8, 4.2, 4.0, 3.6, 3.8, 3.4, 4.0, 4.2, 3.8, 3.6, 0, 3.8] },
      { name: '【6132】海口美兰机场店', data: [3.2, 3.0, 3.4, 3.2, 2.8, 3.0, 2.6, 3.2, 3.4, 3.0, 2.8, 0, 3.0] },
      { name: '【6922】海口日月店', data: [3.5, 3.3, 3.7, 3.5, 3.1, 3.3, 2.9, 3.5, 3.7, 3.3, 3.1, 0, 3.3] },
      { name: '【6921】博鳌店', data: [3.9, 3.7, 4.1, 3.9, 3.5, 3.7, 3.3, 3.9, 4.1, 3.7, 3.5, 0, 3.7] },
    ],
    toReservedFullChain: [
      { name: '【6868】三亚海棠湾店', data: [6.5, 6.3, 6.7, 6.5, 6.1, 6.3, 5.9, 6.5, 6.7, 6.3, 6.1, 0, 6.3] },
      { name: '【7048】新海港店', data: [7.0, 6.8, 7.2, 7.0, 6.6, 6.8, 6.4, 7.0, 7.2, 6.8, 6.6, 0, 6.8] },
      { name: '【7016】三亚凤凰机场店', data: [6.8, 6.6, 7.0, 6.8, 6.4, 6.6, 6.2, 6.8, 7.0, 6.6, 6.4, 0, 6.6] },
      { name: '【6132】海口美兰机场店', data: [5.8, 5.6, 6.0, 5.8, 5.4, 5.6, 5.2, 5.8, 6.0, 5.6, 5.4, 0, 5.6] },
      { name: '【6922】海口日月店', data: [6.2, 6.0, 6.4, 6.2, 5.8, 6.0, 5.6, 6.2, 6.4, 6.0, 5.8, 0, 6.0] },
      { name: '【6921��博鳌店', data: [6.7, 6.5, 6.9, 6.7, 6.3, 6.5, 6.1, 6.7, 6.9, 6.5, 6.3, 0, 6.5] },
    ],
    reservedMailFullChain: [
      { name: '【6868】三亚海棠湾店', data: [5.2, 5.0, 5.4, 5.2, 4.8, 5.0, 4.6, 5.2, 5.4, 5.0, 4.8, 0, 5.0] },
      { name: '【7048】新海港店', data: [5.6, 5.4, 5.8, 5.6, 5.2, 5.4, 5.0, 5.6, 5.8, 5.4, 5.2, 0, 5.4] },
      { name: '【7016】三亚凤凰机场店', data: [5.4, 5.2, 5.6, 5.4, 5.0, 5.2, 4.8, 5.4, 5.6, 5.2, 5.0, 0, 5.2] },
      { name: '【6132】海口美兰机场店', data: [4.5, 4.3, 4.7, 4.5, 4.1, 4.3, 3.9, 4.5, 4.7, 4.3, 4.1, 0, 4.3] },
      { name: '【6922】海口日月店', data: [4.8, 4.6, 5.0, 4.8, 4.4, 4.6, 4.2, 4.8, 5.0, 4.6, 4.4, 0, 4.6] },
      { name: '【6921】博鳌店', data: [5.3, 5.1, 5.5, 5.3, 4.9, 5.1, 4.7, 5.3, 5.5, 5.1, 4.9, 0, 5.1] },
    ],
    reservedDeliveryFullChain: [
      { name: '【6868】三亚海棠湾店', data: [4.8, 4.6, 5.0, 4.8, 4.4, 4.6, 4.2, 4.8, 5.0, 4.6, 4.4, 0, 4.6] },
      { name: '【7048】新海港店', data: [5.2, 5.0, 5.4, 5.2, 4.8, 5.0, 4.6, 5.2, 5.4, 5.0, 4.8, 0, 5.0] },
      { name: '【7016】三亚凤凰机场店', data: [5.0, 4.8, 5.2, 5.0, 4.6, 4.8, 4.4, 5.0, 5.2, 4.8, 4.6, 0, 4.8] },
      { name: '【6132】海口美兰机场店', data: [4.2, 4.0, 4.4, 4.2, 3.8, 4.0, 3.6, 4.2, 4.4, 4.0, 3.8, 0, 4.0] },
      { name: '【6922】海口日月店', data: [4.5, 4.3, 4.7, 4.5, 4.1, 4.3, 3.9, 4.5, 4.7, 4.3, 4.1, 0, 4.3] },
      { name: '【6921】博鳌店', data: [4.9, 4.7, 5.1, 4.9, 4.5, 4.7, 4.3, 4.9, 5.1, 4.7, 4.5, 0, 4.7] },
    ],
    // Tab 3 - 出入库时效
    storeToSortingInbound: [
      { name: '【6868】三亚海棠湾店', data: [1.8, 1.7, 1.9, 1.8, 1.6, 1.7, 1.5, 1.8, 1.9, 1.7, 1.6, 0, 1.7] },
      { name: '【7048】新海港店', data: [2.0, 1.9, 2.1, 2.0, 1.8, 1.9, 1.7, 2.0, 2.1, 1.9, 1.8, 0, 1.9] },
      { name: '【7016】三亚凤凰机场店', data: [1.9, 1.8, 2.0, 1.9, 1.7, 1.8, 1.6, 1.9, 2.0, 1.8, 1.7, 0, 1.8] },
      { name: '【6132】海口美兰机场店', data: [1.5, 1.4, 1.6, 1.5, 1.3, 1.4, 1.2, 1.5, 1.6, 1.4, 1.3, 0, 1.4] },
      { name: '【6922】海口日月店', data: [1.6, 1.5, 1.7, 1.6, 1.4, 1.5, 1.3, 1.6, 1.7, 1.5, 1.4, 0, 1.5] },
      { name: '【6921】博鳌店', data: [1.8, 1.7, 1.9, 1.8, 1.6, 1.7, 1.5, 1.8, 1.9, 1.7, 1.6, 0, 1.7] },
    ],
    deliveryOutbound: [
      { name: '【6868】三亚海棠湾店', data: [1.2, 1.1, 1.3, 1.2, 1.0, 1.1, 0.9, 1.2, 1.3, 1.1, 1.0, 0, 1.1] },
      { name: '【7048】新海港店', data: [1.4, 1.3, 1.5, 1.4, 1.2, 1.3, 1.1, 1.4, 1.5, 1.3, 1.2, 0, 1.3] },
      { name: '【7016】三亚凤凰机场店', data: [1.3, 1.2, 1.4, 1.3, 1.1, 1.2, 1.0, 1.3, 1.4, 1.2, 1.1, 0, 1.2] },
      { name: '【6132】海口美兰机场店', data: [1.0, 0.9, 1.1, 1.0, 0.8, 0.9, 0.7, 1.0, 1.1, 0.9, 0.8, 0, 0.9] },
      { name: '【6922】海口日月店', data: [1.1, 1.0, 1.2, 1.1, 0.9, 1.0, 0.8, 1.1, 1.2, 1.0, 0.9, 0, 1.0] },
      { name: '【6921】博鳌店', data: [1.3, 1.2, 1.4, 1.3, 1.1, 1.2, 1.0, 1.3, 1.4, 1.2, 1.1, 0, 1.2] },
    ],
  };

  const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '12月平均'];

  const currentInbound = inboundData[dimension];
  const currentOutbound = outboundData[dimension];
  const currentCustoms = customsClearanceData[dimension];

  const getDisplayData = (data: number[]) => {
    return timeDimension === 'monthly' ? data : data.slice(0, 8);
  };

  // 格式化数值为两位小数
  const formatNumber = (value: any): string => {
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  const renderMetricTable = (metric: MetricData, subItems?: { name: string; data: number[] }[], customTimeDimension?: TimeDimension) => {
    const activeTimeDimension = customTimeDimension || timeDimension;
    const labels = activeTimeDimension === 'monthly' 
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '12月']
      : ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'];
    const displayData = activeTimeDimension === 'monthly' ? metric.monthlyData : metric.monthlyData.slice(0, 8);
    
    // 计算月度均值（仅针对月度数据，跳过索引11）
    const calculateMonthlyAverage = (data: number[]) => {
      if (activeTimeDimension === 'weekly') return '-';
      const validData = data.filter((_, index) => index !== 11 && data[index] > 0);
      const sum = validData.reduce((acc, val) => acc + val, 0);
      return validData.length > 0 ? (sum / validData.length).toFixed(2) : '-';
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-50">
                <th className="px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 min-w-[140px] whitespace-nowrap">
                  指标
                </th>
                <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[60px] whitespace-nowrap">
                  维度
                </th>
                <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                  均值天数
                </th>
                {activeTimeDimension === 'monthly' && (
                  <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                    月度均值
                  </th>
                )}
                {labels.map((label, index) => {
                  // 跳过"12月"列（索引11）
                  if (activeTimeDimension === 'monthly' && index === 11) return null;
                  return (
                    <th
                      key={index}
                      className={`px-2 py-1.5 text-center font-bold text-gray-700 min-w-[60px] whitespace-nowrap ${
                        index < labels.length - 1 ? 'border-r border-gray-200' : ''
                      } ${index >= labels.length - 2 ? 'bg-blue-50' : ''}`}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {subItems ? (
                // 如果有子项，渲染多行（每行渲染票数和件数两行）
                subItems.flatMap((item, rowIndex) => [
                  // 票数行
                  <tr key={`${rowIndex}-tickets`} className="border-t border-gray-200 hover:bg-gray-50">
                    <td rowSpan={2} className="px-2 py-1.5 text-gray-700 border-r border-gray-200 align-middle">
                      {item.name}
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      票数
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      {Number(metric.avgDays).toFixed(2)}
                    </td>
                    {activeTimeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(item.data)}
                      </td>
                    )}
                    {(activeTimeDimension === 'monthly' ? item.data : item.data.slice(0, 8)).map((value, index) => {
                      // 跳过"12月"列（索引11）
                      if (activeTimeDimension === 'monthly' && index === 11) return null;
                      const currentData = activeTimeDimension === 'monthly' ? item.data : item.data.slice(0, 8);
                      return (
                        <td
                          key={index}
                          className={`px-2 py-1.5 text-center text-gray-700 ${
                            index < currentData.length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= currentData.length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </td>
                      );
                    })}
                  </tr>,
                  // 件数行
                  <tr key={`${rowIndex}-pieces`} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      件数
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      {Number(metric.avgDays).toFixed(2)}
                    </td>
                    {activeTimeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(item.data)}
                      </td>
                    )}
                    {(activeTimeDimension === 'monthly' ? item.data : item.data.slice(0, 8)).map((value, index) => {
                      // 跳过\"12月\"列（索引11）
                      if (activeTimeDimension === 'monthly' && index === 11) return null;
                      const currentData = activeTimeDimension === 'monthly' ? item.data : item.data.slice(0, 8);
                      return (
                        <td
                          key={index}
                          className={`px-2 py-1.5 text-center text-gray-700 ${
                            index < currentData.length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= currentData.length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </td>
                      );
                    })}
                  </tr>
                ])
              ) : (
                // 单行展示（渲染票数和件数两行）
                <>
                  <tr className="border-t border-gray-200 hover:bg-gray-50">
                  <td rowSpan={2} className="px-2 py-1.5 text-gray-700 border-r border-gray-200 align-middle">
                    {metric.name}
                  </td>
                  <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                    票数
                  </td>
                  <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                    {metric.avgDays}
                  </td>
                  {activeTimeDimension === 'monthly' && (
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      {calculateMonthlyAverage(metric.monthlyData)}
                    </td>
                  )}
                  {displayData.map((value, index) => {
                    // 跳过"12月"列（索引11）
                    if (activeTimeDimension === 'monthly' && index === 11) return null;
                    return (
                      <td
                        key={index}
                        className={`px-2 py-1.5 text-center text-gray-700 ${
                          index < displayData.length - 1 ? 'border-r border-gray-200' : ''
                        } ${index >= displayData.length - 2 ? 'bg-blue-50' : ''}`}
                      >
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                    件数
                  </td>
                  <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                    {Number(metric.avgDays).toFixed(2)}
                  </td>
                  {activeTimeDimension === 'monthly' && (
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      {calculateMonthlyAverage(metric.monthlyData)}
                    </td>
                  )}
                  {displayData.map((value, index) => {
                    // 跳过\"12月\"列（索引11）
                    if (activeTimeDimension === 'monthly' && index === 11) return null;
                    return (
                      <td
                        key={index}
                        className={`px-2 py-1.5 text-center text-gray-700 ${
                          index < displayData.length - 1 ? 'border-r border-gray-200' : ''
                        } ${index >= displayData.length - 2 ? 'bg-blue-50' : ''}`}
                      >
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </td>
                    );
                  })}
                </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染带品类的指标表格（入库和出库时效专用）
  const renderMetricTableWithCategory = (
    metricName: string, 
    categoryData: {
      alcohol: {
        over10Days: { monthlyData: number[]; weeklyData: number[] };
        over14Days: { monthlyData: number[]; weeklyData: number[] };
        totalOrders: { monthlyData: number[]; weeklyData: number[] };
        rate10Days: { monthlyData: number[]; weeklyData: number[] };
        rate14Days: { monthlyData: number[]; weeklyData: number[] };
      };
      cosmetics: {
        over10Days: { monthlyData: number[]; weeklyData: number[] };
        over14Days: { monthlyData: number[]; weeklyData: number[] };
        totalOrders: { monthlyData: number[]; weeklyData: number[] };
        rate10Days: { monthlyData: number[]; weeklyData: number[] };
        rate14Days: { monthlyData: number[]; weeklyData: number[] };
      };
    }
  ) => {
    const labels = getTimeLabels();
    
    // 计算月度均值（仅针对月度数据，跳过索引11）
    const calculateMonthlyAverage = (data: number[], isRate: boolean = false) => {
      if (timeDimension === 'weekly') return '-';
      const validData = data.filter((_, index) => index !== 11 && data[index] > 0);
      const sum = validData.reduce((acc, val) => acc + val, 0);
      const avg = validData.length > 0 ? sum / validData.length : 0;
      return avg > 0 ? (isRate ? `${avg.toFixed(2)}%` : avg.toFixed(2)) : '-';
    };
    
    const subItems = [
      { name: '大于10天的订单数量', key: 'over10Days' },
      { name: '大于14天的订单数量', key: 'over14Days' },
      { name: '订单总数', key: 'totalOrders' },
      { name: '10天订单达成率', key: 'rate10Days' },
      { name: '14天订单达成率', key: 'rate14Days' },
    ];

    // 判断是否显示品类列：默认（未选择）或选择两个品类时显示
    const showCategoryColumn = !selectedCategories || selectedCategories.length === 0 || selectedCategories.length === 2;
    
    // 判断是否显示某个品类的行：默认显示所有，或根据选择显示
    const shouldShowAlcohol = !selectedCategories || selectedCategories.length === 0 || selectedCategories.includes('酒水');
    const shouldShowCosmetics = !selectedCategories || selectedCategories.length === 0 || selectedCategories.includes('香化');

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-50">
                {showCategoryColumn && (
                  <th className="px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                    品类
                  </th>
                )}
                <th className="px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 min-w-[140px] whitespace-nowrap">
                  <div className="flex items-center gap-1.5 relative group">
                    <span>指标</span>
                    <div className="relative cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">6</span>
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-96 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-2">批注⑥</div>
                      <div className="text-gray-300 space-y-1.5">
                        <div>需求标注：</div>
                        <div>1、大于10天的订单数量：指的是所选时间范围内，时效大于目标值10天对应的订单总数。</div>
                        <div>2、大于14天的订单总数：指的是所选时间范围内，时效大于目标值14天对应的订单总数。</div>
                        <div>3、10天订单达成率：指的是所选时间范围内，满足时效目标值为10天的订单数量/所选时间范围内的订单总数。</div>
                        <div>4、14天订单达成率：指的是所选时间范围内，满足时效目标值为14天的订单数量/所选时间范围内的订单总数。</div>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[65px] whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1.5 relative group">
                    <span>均值天数</span>
                    <div className="relative cursor-help">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">5</span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-1">批注⑤</div>
                      <div className="text-gray-300">需求标注：均值天数对应为所选的时间范围内，对应指标的总和/时间范围内对应的天数</div>
                    </div>
                  </div>
                </th>
                {timeDimension === 'monthly' && (
                  <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                    月度均值
                  </th>
                )}
                {labels.map((label, index) => {
                  // 跳过"12月"列��索引11）
                  if (timeDimension === 'monthly' && index === 11) return null;
                  return (
                    <th
                      key={index}
                      className={`px-2 py-1.5 text-center font-bold text-gray-700 min-w-[55px] whitespace-nowrap ${
                        index < labels.length - 1 ? 'border-r border-gray-200' : ''
                      } ${index >= labels.length - 2 ? 'bg-blue-50' : ''}`}
                    >
                      {label}
                    </th>
                  );
                })}</tr>
            </thead>
            <tbody>
              {/* 酒水品类 */}
              {shouldShowAlcohol && subItems.map((item, rowIndex) => {
                const dataKey = item.key as keyof typeof categoryData.alcohol;
                const data = timeDimension === 'monthly' 
                  ? categoryData.alcohol[dataKey].monthlyData 
                  : categoryData.alcohol[dataKey].weeklyData;
                
                return (
                  <tr key={`liquor-${rowIndex}`} className="border-t border-gray-200 hover:bg-gray-50">
                    {showCategoryColumn && rowIndex === 0 && (
                      <td 
                        rowSpan={subItems.length} 
                        className="px-2 py-1.5 text-gray-700 border-r border-gray-200 align-middle font-medium bg-blue-50"
                      >
                        酒水
                      </td>
                    )}
                    <td className="px-2 py-1.5 text-gray-700 border-r border-gray-200">
                      {item.name}
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      -
                    </td>
                    {timeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(categoryData.alcohol[dataKey].monthlyData, item.key.includes('rate'))}
                      </td>
                    )}
                    {getDisplayData(data).map((value, index) => {
                      // 跳过"12月"列（索引11）
                      if (timeDimension === 'monthly' && index === 11) return null;
                      const displayValue = item.key.includes('rate') ? `${value}%` : value;
                      return (
                        <td
                          key={index}
                          className={`px-3 py-1.5 text-center text-gray-700 ${
                            index < getDisplayData(data).length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= getDisplayData(data).length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {/* 香化品类 */}
              {shouldShowCosmetics && subItems.map((item, rowIndex) => {
                const dataKey = item.key as keyof typeof categoryData.cosmetics;
                const data = timeDimension === 'monthly' 
                  ? categoryData.cosmetics[dataKey].monthlyData 
                  : categoryData.cosmetics[dataKey].weeklyData;
                
                return (
                  <tr key={`cosmetics-${rowIndex}`} className="border-t border-gray-200 hover:bg-gray-50">
                    {showCategoryColumn && rowIndex === 0 && (
                      <td 
                        rowSpan={subItems.length} 
                        className="px-2 py-1.5 text-gray-700 border-r border-gray-200 align-middle font-medium bg-green-50"
                      >
                        香化
                      </td>
                    )}
                    <td className="px-2 py-1.5 text-gray-700 border-r border-gray-200">
                      {item.name}
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      -
                    </td>
                    {timeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(categoryData.cosmetics[dataKey].monthlyData, item.key.includes('rate'))}
                      </td>
                    )}
                    {getDisplayData(data).map((value, index) => {
                      // 跳过"12月"列（索引11）
                      if (timeDimension === 'monthly' && index === 11) return null;
                      const displayValue = item.key.includes('rate') ? `${value}%` : value;
                      return (
                        <td
                          key={index}
                          className={`px-3 py-1.5 text-center text-gray-700 ${
                            index < getDisplayData(data).length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= getDisplayData(data).length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染仓-店路径时效表格（按仓库-门店层级展示）
  const renderWarehouseStoreTable = (warehouseData: WarehouseStoreData[]) => {
    const labels = getTimeLabels();

    // 计算月度均值（仅针对月度数据，跳过索引11）
    const calculateMonthlyAverage = (data: number[]) => {
      if (timeDimension === 'weekly') return '-';
      const validData = data.filter((_, index) => index !== 11 && data[index] > 0);
      const sum = validData.reduce((acc, val) => acc + val, 0);
      return validData.length > 0 ? `${(sum / validData.length).toFixed(1)}%` : '-';
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-50">
                <th className="px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                  门店
                </th>
                {timeDimension === 'monthly' && (
                  <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                    月度均值
                  </th>
                )}
                {labels.map((label, index) => {
                  // 跳过"12月"列（索引11）
                  if (timeDimension === 'monthly' && index === 11) return null;
                  return (
                    <th
                      key={index}
                      className={`px-2 py-1.5 text-center font-bold text-gray-700 min-w-[55px] whitespace-nowrap ${
                        index < labels.length - 1 ? 'border-r border-gray-200' : ''
                      } ${index >= labels.length - 2 ? 'bg-blue-50' : ''}`}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {warehouseData.map((warehouse, warehouseIndex) => (
                warehouse.stores.map((store, storeIndex) => (
                  <tr key={`${warehouseIndex}-${storeIndex}`} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-2 py-1.5 text-gray-700 border-r border-gray-200">
                      {store.name}
                    </td>
                    {timeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(store.data)}
                      </td>
                    )}
                    {getDisplayData(store.data).map((value, index) => {
                      // 跳过"12月"列（索引11）
                      if (timeDimension === 'monthly' && index === 11) return null;
                      return (
                        <td
                          key={index}
                          className={`px-3 py-1.5 text-center text-gray-700 ${
                            index < getDisplayData(store.data).length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= getDisplayData(store.data).length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {value}%
                        </td>
                      );
                    })}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染门店交付时效 - 及时率表格（单+件数维度）
  const renderDeliveryTimelinessTable = () => {
    const labels = getTimeLabels();

    // 计算月度均值（仅针对月度数据，跳过索引11）
    const calculateMonthlyAverage = (data: number[]) => {
      if (timeDimension === 'weekly') return '-';
      const validData = data.filter((_, index) => index !== 11 && data[index] > 0);
      const sum = validData.reduce((acc, val) => acc + val, 0);
      return validData.length > 0 ? `${(sum / validData.length).toFixed(1)}%` : '-';
    };

    const metrics = [
      { name: '通关及时率', key: 'customsClearance' },
      { name: '配送及时率', key: 'delivery' },
      { name: '日常调拨配送及时响应率', key: 'dailyTransferResponse' },
      { name: '改签审批及时率', key: 'reassignmentApproval' },
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-50">
                <th className="px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 min-w-[140px] whitespace-nowrap">
                  指标
                </th>
                <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[50px] whitespace-nowrap">
                  维度
                </th>
                {timeDimension === 'monthly' && (
                  <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                    月度均值
                  </th>
                )}
                {labels.map((label, index) => {
                  // 跳过"12月"列（索引11）
                  if (timeDimension === 'monthly' && index === 11) return null;
                  return (
                    <th
                      key={index}
                      className={`px-2 py-1.5 text-center font-bold text-gray-700 min-w-[60px] whitespace-nowrap ${
                        index < labels.length - 1 ? 'border-r border-gray-200' : ''
                      } ${index >= labels.length - 2 ? 'bg-blue-50' : ''}`}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {metrics.flatMap((metric) => [
                // 单数行
                <tr key={`${metric.key}-tickets`} className="border-t border-gray-200 hover:bg-gray-50">
                    <td rowSpan={2} className="px-2 py-1.5 text-gray-700 border-r border-gray-200 align-middle">
                      {metric.name}
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      单
                    </td>
                    {timeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(deliveryTimelinessMetrics[metric.key].tickets)}
                      </td>
                    )}
                    {getDisplayData(deliveryTimelinessMetrics[metric.key].tickets).map((value, index) => {
                      // 跳过"12月"列（索引11）
                      if (timeDimension === 'monthly' && index === 11) return null;
                      return (
                        <td
                          key={index}
                          className={`px-2 py-1.5 text-center text-gray-700 ${
                            index < getDisplayData(deliveryTimelinessMetrics[metric.key].tickets).length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= getDisplayData(deliveryTimelinessMetrics[metric.key].tickets).length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {value}%
                        </td>
                      );
                    })}
                </tr>,
                // 件数行
                <tr key={`${metric.key}-pieces`} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      件
                    </td>
                    {timeDimension === 'monthly' && (
                      <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                        {calculateMonthlyAverage(deliveryTimelinessMetrics[metric.key].pieces)}
                      </td>
                    )}
                    {getDisplayData(deliveryTimelinessMetrics[metric.key].pieces).map((value, index) => {
                      // 跳过"12月"列（索引11）
                      if (timeDimension === 'monthly' && index === 11) return null;
                      return (
                        <td
                          key={index}
                          className={`px-2 py-1.5 text-center text-gray-700 ${
                            index < getDisplayData(deliveryTimelinessMetrics[metric.key].pieces).length - 1 ? 'border-r border-gray-200' : ''
                          } ${index >= getDisplayData(deliveryTimelinessMetrics[metric.key].pieces).length - 2 ? 'bg-blue-50' : ''}`}
                        >
                          {value}%
                        </td>
                      );
                    })}
                </tr>
              ])}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染门店交付时效 - 按门店展示的表格
  const renderDeliveryStoreTable = (storeData: StoreMetricData[], metricName: string, unit: string = '%') => {
    const labels = getTimeLabels();

    // 计算月度均值（仅针对月度数据，跳过索引11）
    const calculateMonthlyAverage = (data: number[]) => {
      if (timeDimension === 'weekly') return '-';
      const validData = data.filter((_, index) => index !== 11 && data[index] > 0);
      const sum = validData.reduce((acc, val) => acc + val, 0);
      return validData.length > 0 ? `${(sum / validData.length).toFixed(2)}${unit}` : '-';
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-50">
                <th className="px-2 py-1.5 text-left font-bold text-gray-700 border-r border-gray-200 min-w-[100px] whitespace-nowrap">
                  门店
                </th>
                {timeDimension === 'monthly' && (
                  <th className="px-2 py-1.5 text-center font-bold text-gray-700 border-r border-gray-200 min-w-[70px] whitespace-nowrap">
                    月度均值
                  </th>
                )}
                {labels.map((label, index) => {
                  // 跳过"12月"列（索引11）
                  if (timeDimension === 'monthly' && index === 11) return null;
                  return (
                    <th
                      key={index}
                      className={`px-2 py-1.5 text-center font-bold text-gray-700 min-w-[60px] whitespace-nowrap ${
                        index < labels.length - 1 ? 'border-r border-gray-200' : ''
                      } ${index >= labels.length - 2 ? 'bg-blue-50' : ''}`}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {storeData.map((store, storeIndex) => (
                <tr key={storeIndex} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-2 py-1.5 text-gray-700 border-r border-gray-200">
                    {store.name}
                  </td>
                  {timeDimension === 'monthly' && (
                    <td className="px-2 py-1.5 text-center text-gray-700 border-r border-gray-200">
                      {calculateMonthlyAverage(store.data)}
                    </td>
                  )}
                  {getDisplayData(store.data).map((value, index) => {
                    // 跳过"12月"列（索引11）
                    if (timeDimension === 'monthly' && index === 11) return null;
                    return (
                      <td
                        key={index}
                        className={`px-2 py-1.5 text-center text-gray-700 ${
                          index < getDisplayData(store.data).length - 1 ? 'border-r border-gray-200' : ''
                        } ${index >= getDisplayData(store.data).length - 2 ? 'bg-blue-50' : ''}`}
                      >
                        {typeof value === 'number' ? value.toFixed(2) : value}{unit}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-full">
      
      {/* 一盘货时效模块 */}
      <div className={`bg-white rounded-lg border border-gray-200 p-4 transition-all ${highlightChartArea ? 'border-2 border-blue-500 bg-blue-50 shadow-lg' : ''}`}>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          {/* 批注③ - 虚线实线说�� */}
          <div className="relative group">
            <div 
              className="relative cursor-pointer"
              onClick={() => {
                setHighlightChartArea(true);
                setTimeout(() => setHighlightChartArea(false), 2000);
              }}
            >
              <Info className="w-4 h-4 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </div>
            <div className="absolute left-0 top-full mt-1 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="font-semibold mb-1">批注③</div>
              <div className="text-gray-300">需求标注：1、所有虚线都代表目标值，实线表示真实值。如果没有目标值，则不存在虚线；2、票数表示订单数量；件数表示商品数量</div>
            </div>
          </div>
        </div>

        {/* 订货段 */}
        {shouldShowModule('ordering') && (
        <div className="mb-8 bg-blue-50/30 rounded-lg p-6 border-l-4 border-blue-600">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-600 rounded"></div>
            订货段
          </h3>

          {/* 全链路订货平均时效 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              全链路订货平均时效（一盘货）
            </h4>
          
            {/* 趋势图 - 带目标值虚线 */}
            {/* 双轴坐标系趋势图 - 酒水vs香化（票数+件数） */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">酒水 vs 香化（双轴：票数 | 件数）</div>
              <ResponsiveContainer width="100%" height={280} minHeight={280}>
                <LineChart 
                  data={(() => {
                    const labels = getTimeLabels();
                    const alcoholTicketsData = timeDimension === 'monthly' 
                      ? [7.2, 7.8, 8.5, 9.2, 8.0, 8.3, 7.9, 8.8, 9.5, 8.2, 7.8, null, 7.5]
                      : [8.2, 7.8, 9.0, 8.5, 8.0, 8.4, 7.9, 8.3];
                    const cosmeticsTicketsData = timeDimension === 'monthly'
                      ? [8.8, 9.4, 10.2, 10.8, 9.6, 10.0, 9.5, 10.5, 11.0, 9.8, 9.5, null, 9.2]
                      : [9.8, 9.4, 10.6, 10.1, 9.6, 10.0, 9.5, 9.8];
                    const alcoholPiecesData = timeDimension === 'monthly' 
                      ? [10.2, 10.8, 11.5, 12.0, 11.0, 11.3, 10.8, 11.8, 12.3, 11.2, 10.9, null, 10.5]
                      : [11.2, 10.8, 12.0, 11.5, 11.0, 11.4, 10.9, 11.2];
                    const cosmeticsPiecesData = timeDimension === 'monthly'
                      ? [11.8, 12.5, 13.2, 13.8, 12.6, 13.0, 12.5, 13.5, 14.0, 13.0, 12.7, null, 12.3]
                      : [12.8, 12.4, 13.6, 13.1, 12.6, 13.0, 12.5, 12.8];
                    return labels
                      .map((label, index) => {
                        if (timeDimension === 'monthly' && index === 11) return null;
                        const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                        return {
                          name: label,
                          酒水票数: alcoholTicketsData[dataIndex] || 0,
                          香化票数: cosmeticsTicketsData[dataIndex] || 0,
                          酒水件数: alcoholPiecesData[dataIndex] || 0,
                          香化件数: cosmeticsPiecesData[dataIndex] || 0,
                        };
                      })
                      .filter(Boolean);
                  })()}
                  margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '票数(天)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                    domain={[0, 15]}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '件数(天)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                    domain={[0, 15]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`${Number(value).toFixed(2)}天`, '']}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                  />
                  {/* 目标值虚线 - 10D */}
                  <ReferenceLine 
                    yAxisId="left"
                    y={10} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5" 
                    strokeWidth={2}
                    label={{ value: '10D', position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10, fontWeight: 600 }}
                  />
                  {/* 目标值虚线 - 14D */}
                  <ReferenceLine 
                    yAxisId="left"
                    y={14} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    strokeWidth={2}
                    label={{ value: '14D', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10, fontWeight: 600 }}
                  />
                  {shouldShowCategory('酒水') && (
                    <Line 
                      yAxisId="left"
                      type="linear" 
                      dataKey="酒水票数" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="酒水(票数)"
                    />
                  )}
                  {shouldShowCategory('香化') && (
                    <Line 
                      yAxisId="left"
                      type="linear" 
                      dataKey="香化票数" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="香化(票数)"
                    />
                  )}
                  {shouldShowCategory('酒水') && (
                    <Line 
                      yAxisId="right"
                      type="linear" 
                      dataKey="酒水件数" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="酒水(件数)"
                    />
                  )}
                  {shouldShowCategory('香化') && (
                    <Line 
                      yAxisId="right"
                      type="linear" 
                      dataKey="香化件数" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="香化(件数)"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 数据表格 - 参考图片样式 */}
            <div className="ml-3">
              {/* 时间维度切换 */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">时间维度:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                        timeDimension === 'monthly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('monthly')}
                    >
                      <Calendar className="w-4 h-4" />
                      每月
                    </button>
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                        timeDimension === 'weekly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('weekly')}
                    >
                      <Calendar className="w-4 h-4" />
                      近八周
                    </button>
                  </div>
                  <div className="relative inline-flex items-center group">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-semibold cursor-help">
                      ⑬
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-[700px] bg-gray-900 text-white text-xs rounded-lg p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-2">批注⑬</div>
                      <div className="text-gray-300 space-y-2">
                        <div><span className="font-medium text-white">1. 每月</span>为所选时间范围中取连续完整月。</div>
                        <div className="ml-3 space-y-1.5">
                          <div><span className="font-medium text-white">场景一：</span>时间筛选项为：2025年3月12日--2026年2月15日，那么展示2025年3月到2026年2月；</div>
                          <div><span className="font-medium text-white">场景二：</span>时间筛选项为2025年3月12日-2025年3月13日（至今），但是由于当前的3月份不是完整月，那么展示的是2025年3月到2026年2月。</div>
                        </div>
                        <div><span className="font-medium text-white">2. 【近八周】</span>为不包含所选时间范围并往前平移八周的每周数据，以所选时间的开始时间为基准</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log('导出数据');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 group relative"
                >
                  <Download className="w-4 h-4" />
                  导出数据
                  <div className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold cursor-help">
                    ⑪
                  </div>
                  <div className="absolute left-0 bottom-full mb-2 w-[280px] bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                    <div className="font-semibold mb-2">批注⑪</div>
                    <div className="text-gray-300">
                      下面所有导出的数据均为页面内容的数据，导出按钮统一为白底风格。
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200">
                        {/* 品类列 - 只在两种品类都出现时显示 */}
                        {(!selectedCategories || selectedCategories.length === 0 || selectedCategories.length === 2) && (
                          <th className="px-4 py-3 text-left font-semibold text-gray-900 whitespace-nowrap bg-blue-50/70 sticky left-0 z-10">
                            品类
                          </th>
                        )}
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 whitespace-nowrap bg-blue-50/70">
                          维度
                        </th>
                        {timeDimension === 'monthly' && (
                          <th className="px-4 py-3 text-center font-semibold text-gray-900 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5 relative group">
                              <span>月度均值</span>
                              <div className="relative cursor-help">
                                <Info className="w-3.5 h-3.5 text-gray-400" />
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">4</span>
                              </div>
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                                <div className="font-semibold mb-1">批注④</div>
                                <div className="text-gray-300">需求标注：月度均值为所选时间范围对应指标的总数/含总月数</div>
                              </div>
                            </div>
                          </th>
                        )}
                        {getTimeLabels().map((label, index) => {
                          if (timeDimension === 'monthly' && index === 11) return null;
                          return (
                            <th key={index} className="px-4 py-3 text-center font-semibold text-gray-900 whitespace-nowrap min-w-[70px]">
                              {label}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 酒水 - 票数 */}
                      {shouldShowCategory('酒水') && (
                        <>
                          <tr className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors">
                            {/* 品类列 - 只在两种品类都出现时显示 */}
                            {(!selectedCategories || selectedCategories.length === 0 || selectedCategories.length === 2) && (
                              <td rowSpan={2} className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap bg-blue-50/30 border-r border-gray-200 sticky left-0 z-10">
                                酒水
                              </td>
                            )}
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap bg-blue-50/10">
                              票数
                            </td>
                            {timeDimension === 'monthly' && (
                              <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap text-xs">
                                {(() => {
                                  const data = timeDimension === 'monthly' 
                                    ? [8.2, 8.9, 10.2, 11.0, 9.5, 9.9, 9.2, 10.5, 11.2, 9.8, 9.4, 9.0]
                                    : [9.9, 9.5, 10.8, 10.2, 9.6, 10.0, 9.3, 9.7];
                                  const validData = data.filter(v => v !== null);
                                  const avg = validData.reduce((sum, v) => sum + v, 0) / validData.length;
                                  return avg.toFixed(2);
                                })()}
                              </td>
                            )}
                            {(() => {
                              const data = timeDimension === 'monthly' 
                                ? [8.2, 8.9, 10.2, 11.0, 9.5, 9.9, 9.2, 10.5, 11.2, 9.8, 9.4, null, 9.0]
                                : [9.9, 9.5, 10.8, 10.2, 9.6, 10.0, 9.3, 9.7];
                              return data.map((value, index) => {
                                if (timeDimension === 'monthly' && index === 11) return null;
                                return (
                                  <td key={index} className="px-4 py-3 text-center whitespace-nowrap text-gray-900">
                                    {value ? Number(value).toFixed(2) : '-'}
                                  </td>
                                );
                              });
                            })()}
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-blue-50/20 transition-colors">
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap bg-blue-50/10">
                              件数
                            </td>
                            {timeDimension === 'monthly' && (
                              <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap text-xs">
                                {(() => {
                                  const data = timeDimension === 'monthly' 
                                    ? [8.5, 9.2, 10.5, 11.3, 9.8, 10.2, 9.5, 10.8, 11.5, 10.1, 9.7, 9.3]
                                    : [10.2, 9.8, 11.1, 10.5, 9.9, 10.3, 9.6, 10.0];
                                  const validData = data.filter(v => v !== null);
                                  const avg = validData.reduce((sum, v) => sum + v, 0) / validData.length;
                                  return avg.toFixed(2);
                                })()}
                              </td>
                            )}
                            {(() => {
                              const data = timeDimension === 'monthly' 
                                ? [8.5, 9.2, 10.5, 11.3, 9.8, 10.2, 9.5, 10.8, 11.5, 10.1, 9.7, null, 9.3]
                                : [10.2, 9.8, 11.1, 10.5, 9.9, 10.3, 9.6, 10.0];
                              return data.map((value, index) => {
                                if (timeDimension === 'monthly' && index === 11) return null;
                                return (
                                  <td key={index} className="px-4 py-3 text-center whitespace-nowrap text-gray-900">
                                    {value ? Number(value).toFixed(2) : '-'}
                                  </td>
                                );
                              });
                            })()}
                          </tr>
                        </>
                      )}
                      
                      {/* 香化 - 票数 */}
                      {shouldShowCategory('香化') && (
                        <>
                          <tr className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors">
                            {/* 品类列 - 只在两种品类都出现时显示 */}
                            {(!selectedCategories || selectedCategories.length === 0 || selectedCategories.length === 2) && (
                              <td rowSpan={2} className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap bg-green-50/30 border-r border-gray-200 sticky left-0 z-10">
                                香化
                              </td>
                            )}
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap bg-green-50/10">
                              票数
                            </td>
                            {timeDimension === 'monthly' && (
                              <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap text-xs">
                                {(() => {
                                  const data = timeDimension === 'monthly'
                                    ? [8.8, 9.5, 10.8, 11.6, 10.1, 10.5, 9.8, 11.1, 11.8, 10.4, 10.0, 9.6]
                                    : [10.5, 10.1, 11.4, 10.8, 10.2, 10.6, 9.9, 10.3];
                                  const validData = data.filter(v => v !== null);
                                  const avg = validData.reduce((sum, v) => sum + v, 0) / validData.length;
                                  return avg.toFixed(2);
                                })()}
                              </td>
                            )}
                            {(() => {
                              const data = timeDimension === 'monthly'
                                ? [8.8, 9.5, 10.8, 11.6, 10.1, 10.5, 9.8, 11.1, 11.8, 10.4, 10.0, null, 9.6]
                                : [10.5, 10.1, 11.4, 10.8, 10.2, 10.6, 9.9, 10.3];
                              return data.map((value, index) => {
                                if (timeDimension === 'monthly' && index === 11) return null;
                                return (
                                  <td key={index} className="px-4 py-3 text-center whitespace-nowrap text-gray-900">
                                    {value ? Number(value).toFixed(2) : '-'}
                                  </td>
                                );
                              });
                            })()}
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-blue-50/20 transition-colors">
                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap bg-green-50/10">
                              件数
                            </td>
                            {timeDimension === 'monthly' && (
                              <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap text-xs">
                                {(() => {
                                  const data = timeDimension === 'monthly'
                                    ? [9.1, 9.8, 11.1, 11.9, 10.4, 10.8, 10.1, 11.4, 12.1, 10.7, 10.3, 9.9]
                                    : [10.8, 10.4, 11.7, 11.1, 10.5, 10.9, 10.2, 10.6];
                                  const validData = data.filter(v => v !== null);
                                  const avg = validData.reduce((sum, v) => sum + v, 0) / validData.length;
                                  return avg.toFixed(2);
                                })()}
                              </td>
                            )}
                            {(() => {
                              const data = timeDimension === 'monthly'
                                ? [9.1, 9.8, 11.1, 11.9, 10.4, 10.8, 10.1, 11.4, 12.1, 10.7, 10.3, null, 9.9]
                                : [10.8, 10.4, 11.7, 11.1, 10.5, 10.9, 10.2, 10.6];
                              return data.map((value, index) => {
                                if (timeDimension === 'monthly' && index === 11) return null;
                                return (
                                  <td key={index} className="px-4 py-3 text-center whitespace-nowrap text-gray-900">
                                    {value ? Number(value).toFixed(2) : '-'}
                                  </td>
                                );
                              });
                            })()}
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 仓库入库平均时效 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              仓库入库平均时效
            </h4>
          
            {/* 双轴坐标系趋势图 - 酒水vs香化（票数+件数） */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">酒水 vs 香化（双轴：票数 | 件数）</div>
            <ResponsiveContainer width="100%" height={240} minHeight={240}>
              <LineChart data={(() => {
                const labels = getTimeLabels();
                const alcoholTickets = timeDimension === 'monthly' 
                  ? inboundDataByCategory.tickets.alcohol.monthlyData 
                  : inboundDataByCategory.tickets.alcohol.weeklyData;
                const cosmeticsTickets = timeDimension === 'monthly'
                  ? inboundDataByCategory.tickets.cosmetics.monthlyData
                  : inboundDataByCategory.tickets.cosmetics.weeklyData;
                const alcoholPieces = timeDimension === 'monthly' 
                  ? inboundDataByCategory.pieces.alcohol.monthlyData 
                  : inboundDataByCategory.pieces.alcohol.weeklyData;
                const cosmeticsPieces = timeDimension === 'monthly'
                  ? inboundDataByCategory.pieces.cosmetics.monthlyData
                  : inboundDataByCategory.pieces.cosmetics.weeklyData;
                return labels
                  .map((label, index) => {
                    if (timeDimension === 'monthly' && index === 11) return null;
                    const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                    return {
                      name: label,
                      酒水票数: alcoholTickets[dataIndex] || 0,
                      香化票数: cosmeticsTickets[dataIndex] || 0,
                      酒水件数: alcoholPieces[dataIndex] || 0,
                      香化件数: cosmeticsPieces[dataIndex] || 0,
                    };
                  })
                  .filter(Boolean);
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: '时效(天)-票数维度', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                  domain={[0, 15]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: '时效(天)-件数维度', angle: 90, position: 'insideRight', style: { fontSize: 10 } }}
                  domain={[0, 15]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}天`, '']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="line"
                />
                {shouldShowCategory('酒水') && (
                  <Line 
                    yAxisId="left"
                    type="linear" 
                    dataKey="酒水票数" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(票数)"
                  />
                )}
                {shouldShowCategory('香化') && (
                  <Line 
                    yAxisId="left"
                    type="linear" 
                    dataKey="香化票数" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(票数)"
                  />
                )}
                {shouldShowCategory('酒水') && (
                  <Line 
                    yAxisId="right"
                    type="linear" 
                    dataKey="酒水件数" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(件数)"
                  />
                )}
                {shouldShowCategory('香化') && (
                  <Line 
                    yAxisId="right"
                    type="linear" 
                    dataKey="香化件数" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(件数)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            </div>

            {/* 表格维度切换控制 */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 ml-3">
              <div className="flex items-center gap-4">
                {/* 时间维度切换 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">时间维度:</span>
                  <div className="flex items-center gap-2 relative group">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                          timeDimension === 'monthly'
                            ? 'bg-white text-blue-600 shadow-sm font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setTimeDimension('monthly')}
                      >
                        <Calendar className="w-4 h-4" />
                        每月
                      </button>
                      <button
                        className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                          timeDimension === 'weekly'
                            ? 'bg-white text-blue-600 shadow-sm font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setTimeDimension('weekly')}
                      >
                        <Calendar className="w-4 h-4" />
                        近八周
                      </button>
                    </div>
                    <div className="relative cursor-help">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">7</span>
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-[420px] bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                      <div className="font-semibold mb-2">批注⑦</div>
                      <div className="text-gray-300 space-y-1.5">
                        <div>需求标注：每个指标的计量维度和时间维度【每月】【近八周】均对所属指标模块下的表格有约束作用。</div>
                        <div>其中，</div>
                        <div>每月：默认从当年1月到当前月份的指标数据。</div>
                        <div>近八周：默认从当前所在周往前推八周的数据。</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                className="px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
            </div>

            <div className="ml-3">
              {renderMetricTableWithCategory(
                '入库时效达标率', 
                inboundTableDataByCategory[dimension]
              )}
            </div>
          </div>

          {/* 一线通关时效 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              一线通关平均时效
            </h4>
            
            {/* 趋势图 - 票数 vs 件数对比 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">一线通关平均时效对比（票数|件数）</div>
              <ResponsiveContainer width="100%" height={240} minHeight={240}>
                <LineChart data={(() => {
                  const labels = getTimeLabels();
                  const firstLineTickets = getDisplayData(customsClearanceData.tickets.firstLine.monthlyData);
                  const firstLinePieces = getDisplayData(customsClearanceData.pieces.firstLine.monthlyData);
                  return labels
                    .map((label, index) => {
                      if (timeDimension === 'monthly' && index === 11) return null;
                      const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                      return {
                        name: label,
                        一线票数: firstLineTickets[dataIndex] || 0,
                        一线件数: firstLinePieces[dataIndex] || 0,
                      };
                    })
                    .filter(Boolean);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '天数', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="一线票数" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="一线(票数)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="一线件数" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="一线(件数)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 时间维度切换控制 */}
            <div className="flex items-center justify-between gap-2 mb-4 ml-3 mr-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">时间维度:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      firstLineTimeDimension === 'monthly'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setFirstLineTimeDimension('monthly')}
                  >
                    <Calendar className="w-4 h-4" />
                    每月
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      firstLineTimeDimension === 'weekly'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setFirstLineTimeDimension('weekly')}
                  >
                    <Calendar className="w-4 h-4" />
                    近八周
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleExport}
                className="px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
            </div>

            <div className="ml-3">
              {renderMetricTable(currentCustoms.firstLine, [
                { name: '一线通关平均时效', data: currentCustoms.firstLine.monthlyData },
              ], firstLineTimeDimension)}
            </div>
          </div>

          {/* 新增：提货至海综保平均时效 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              提货至海综保平均时效
            </h4>
            
            {/* 趋势图 - 香化&酒水双轴对比 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">提货至海综保平均时效对比（香化|酒水 - 票数|件数）</div>
              <ResponsiveContainer width="100%" height={280} minHeight={280}>
                <LineChart data={(() => {
                  const labels = getTimeLabels();
                  // 模拟数据：香化和酒水维度
                  const perfumeTickets = labels.map(() => (Math.random() * 2 + 1.5).toFixed(2));
                  const perfumePieces = labels.map(() => (Math.random() * 2 + 1.2).toFixed(2));
                  const alcoholTickets = labels.map(() => (Math.random() * 2.5 + 2).toFixed(2));
                  const alcoholPieces = labels.map(() => (Math.random() * 2.5 + 1.8).toFixed(2));
                  return labels
                    .map((label, index) => {
                      if (timeDimension === 'monthly' && index === 11) return null;
                      const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                      return {
                        name: label,
                        香化票数: parseFloat(perfumeTickets[dataIndex]) || 0,
                        香化件数: parseFloat(perfumePieces[dataIndex]) || 0,
                        酒水票数: parseFloat(alcoholTickets[dataIndex]) || 0,
                        酒水件数: parseFloat(alcoholPieces[dataIndex]) || 0,
                      };
                    })
                    .filter(Boolean);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '香化(天)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '酒水(天)', angle: 90, position: 'insideRight', style: { fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="香化票数" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(票数)"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="香化件数" 
                    stroke="#c084fc" 
                    strokeWidth={2}
                    dot={{ fill: '#c084fc', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(件数)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="酒水票数" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(票数)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="酒水件数" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    dot={{ fill: '#34d399', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(件数)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 数据表 */}
            <div className="ml-3">
              {/* 时间维度切换器 */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">时间维度：</span>
                  <div className="inline-flex rounded-lg border border-gray-300 bg-white">
                    <button
                      onClick={() => setTimeDimension('monthly')}
                      className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                        timeDimension === 'monthly'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      } rounded-l-lg`}
                    >
                      每月
                    </button>
                    <button
                      onClick={() => setTimeDimension('weekly')}
                      className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                        timeDimension === 'weekly'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      } rounded-r-lg border-l border-gray-300`}
                    >
                      近八周
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
                >
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">指标</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">品类</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">维度</th>
                      {timeDimension === 'monthly' && (
                        <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">月度均值</th>
                      )}
                      {getTimeLabels().map((label, index) => {
                        if (timeDimension === 'monthly' && index === 11) return null;
                        return (
                          <th key={label} className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 last:border-r-0">
                            {label}
                          </th>
                        );
                      }).filter(Boolean)}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const labels = getTimeLabels();
                      const alcoholTickets = labels.map(() => (Math.random() * 2.5 + 2).toFixed(1));
                      const alcoholPieces = labels.map(() => (Math.random() * 2.5 + 1.8).toFixed(1));
                      const perfumeTickets = labels.map(() => (Math.random() * 2 + 1.5).toFixed(1));
                      const perfumePieces = labels.map(() => (Math.random() * 2 + 1.2).toFixed(1));
                      
                      // 计算均值
                      const alcoholTicketsAvg = (alcoholTickets.reduce((sum, val) => sum + parseFloat(val), 0) / alcoholTickets.length).toFixed(1);
                      const alcoholPiecesAvg = (alcoholPieces.reduce((sum, val) => sum + parseFloat(val), 0) / alcoholPieces.length).toFixed(1);
                      const perfumeTicketsAvg = (perfumeTickets.reduce((sum, val) => sum + parseFloat(val), 0) / perfumeTickets.length).toFixed(1);
                      const perfumePiecesAvg = (perfumePieces.reduce((sum, val) => sum + parseFloat(val), 0) / perfumePieces.length).toFixed(1);
                      
                      return (
                        <>
                          {/* 酒水 - 票数 */}
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td rowSpan={4} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 align-middle">提货至海综保平均时效</td>
                            <td rowSpan={2} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 align-middle">酒水</td>
                            <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">票数</td>
                            {timeDimension === 'monthly' && (
                              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{alcoholTicketsAvg}</td>
                            )}
                            {labels.map((label, index) => {
                              if (timeDimension === 'monthly' && index === 11) return null;
                              const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                              return (
                                <td key={label} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                  {alcoholTickets[dataIndex]}
                                </td>
                              );
                            }).filter(Boolean)}
                          </tr>
                          {/* 酒水 - 件数 */}
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">件数</td>
                            {timeDimension === 'monthly' && (
                              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{alcoholPiecesAvg}</td>
                            )}
                            {labels.map((label, index) => {
                              if (timeDimension === 'monthly' && index === 11) return null;
                              const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                              return (
                                <td key={label} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                  {alcoholPieces[dataIndex]}
                                </td>
                              );
                            }).filter(Boolean)}
                          </tr>
                          {/* 香化 - 票数 */}
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td rowSpan={2} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 align-middle">香化</td>
                            <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">票数</td>
                            {timeDimension === 'monthly' && (
                              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{perfumeTicketsAvg}</td>
                            )}
                            {labels.map((label, index) => {
                              if (timeDimension === 'monthly' && index === 11) return null;
                              const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                              return (
                                <td key={label} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                  {perfumeTickets[dataIndex]}
                                </td>
                              );
                            }).filter(Boolean)}
                          </tr>
                          {/* 香化 - 件数 */}
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">件数</td>
                            {timeDimension === 'monthly' && (
                              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{perfumePiecesAvg}</td>
                            )}
                            {labels.map((label, index) => {
                              if (timeDimension === 'monthly' && index === 11) return null;
                              const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                              return (
                                <td key={label} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                  {perfumePieces[dataIndex]}
                                </td>
                              );
                            }).filter(Boolean)}
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* 分货段 */}
        {shouldShowModule('distribution') && (
        <div className="mb-8 bg-green-50/30 rounded-lg p-6 border-l-4 border-green-600">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-6 bg-green-600 rounded"></div>
            分货段
          </h3>

          {/* 全链路分货平均时效 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-green-600 rounded"></div>
              全链路分货平均时效
            </h4>
            
            {/* 双轴坐标系趋势图 - 酒水vs香化（票数+件数） */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">酒水 vs 香化（双轴：票数 | 件数）</div>
            <ResponsiveContainer width="100%" height={240} minHeight={240}>
              <LineChart data={(() => {
                const labels = getTimeLabels();
                const alcoholTickets = timeDimension === 'monthly' 
                  ? distributionFullChainDataByCategory.tickets.alcohol.monthlyData 
                  : distributionFullChainDataByCategory.tickets.alcohol.weeklyData;
                const cosmeticsTickets = timeDimension === 'monthly'
                  ? distributionFullChainDataByCategory.tickets.cosmetics.monthlyData
                  : distributionFullChainDataByCategory.tickets.cosmetics.weeklyData;
                const alcoholPieces = timeDimension === 'monthly' 
                  ? distributionFullChainDataByCategory.pieces.alcohol.monthlyData 
                  : distributionFullChainDataByCategory.pieces.alcohol.weeklyData;
                const cosmeticsPieces = timeDimension === 'monthly'
                  ? distributionFullChainDataByCategory.pieces.cosmetics.monthlyData
                  : distributionFullChainDataByCategory.pieces.cosmetics.weeklyData;
                return labels
                  .map((label, index) => {
                    if (timeDimension === 'monthly' && index === 11) return null;
                    const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                    return {
                      name: label,
                      酒水票数: alcoholTickets[dataIndex] || 0,
                      香化票数: cosmeticsTickets[dataIndex] || 0,
                      酒水件数: alcoholPieces[dataIndex] || 0,
                      香化件数: cosmeticsPieces[dataIndex] || 0,
                    };
                  })
                  .filter(Boolean);
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: '时效(天)-票数维度', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                  domain={[0, 15]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: '时效(天)-件数维度', angle: 90, position: 'insideRight', style: { fontSize: 10 } }}
                  domain={[0, 15]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}天`, '']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="line"
                />
                {/* 目标值虚线 - 8天 */}
                <ReferenceLine 
                  yAxisId="left"
                  y={8} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: '目标值 8天', position: 'left', fill: '#f59e0b', fontSize: 11, fontWeight: 600 }}
                />
                {shouldShowCategory('酒水') && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="酒水票数" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(票数)"
                  />
                )}
                {shouldShowCategory('香化') && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="香化票数" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(票数)"
                  />
                )}
                {shouldShowCategory('酒水') && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="酒水件数" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(件数)"
                  />
                )}
                {shouldShowCategory('香化') && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="香化件数" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(件数)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            </div>

            {/* 表格维度切换控制 */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 ml-3">
              <div className="flex items-center gap-4">
                {/* 时间维度切换 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">时间维度:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                        timeDimension === 'monthly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('monthly')}
                    >
                      <Calendar className="w-4 h-4" />
                      每月
                    </button>
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                        timeDimension === 'weekly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('weekly')}
                    >
                      <Calendar className="w-4 h-4" />
                      近八周
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
            </div>

            <div className="ml-3">
              {renderMetricTableWithCategory(
                '全链路分货平均时效', 
                distributionFullChainTableDataByCategory[dimension]
              )}
            </div>
          </div>

          {/* 出库时效达标率 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-green-600 rounded"></div>
              仓库出库平均时效
            </h4>
            
            {/* 双轴坐标系趋势图 - 酒水vs香化（票数+件数） */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">酒水 vs 香化（双轴：票数 | 件数）</div>
            <ResponsiveContainer width="100%" height={240} minHeight={240}>
              <LineChart data={(() => {
                const labels = getTimeLabels();
                const alcoholTickets = timeDimension === 'monthly' 
                  ? outboundDataByCategory.tickets.alcohol.monthlyData 
                  : outboundDataByCategory.tickets.alcohol.weeklyData;
                const cosmeticsTickets = timeDimension === 'monthly'
                  ? outboundDataByCategory.tickets.cosmetics.monthlyData
                  : outboundDataByCategory.tickets.cosmetics.weeklyData;
                const alcoholPieces = timeDimension === 'monthly' 
                  ? outboundDataByCategory.pieces.alcohol.monthlyData 
                  : outboundDataByCategory.pieces.alcohol.weeklyData;
                const cosmeticsPieces = timeDimension === 'monthly'
                  ? outboundDataByCategory.pieces.cosmetics.monthlyData
                  : outboundDataByCategory.pieces.cosmetics.weeklyData;
                return labels
                  .map((label, index) => {
                    if (timeDimension === 'monthly' && index === 11) return null;
                    const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                    return {
                      name: label,
                      '酒水票数': alcoholTickets[dataIndex] || 0,
                      '香化票数': cosmeticsTickets[dataIndex] || 0,
                      '酒水件数': alcoholPieces[dataIndex] || 0,
                      '香化件数': cosmeticsPieces[dataIndex] || 0,
                    };
                  })
                  .filter(Boolean);
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: '时效(天)-票数维度', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                  domain={[0, 15]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: '时效(天)-件数维度', angle: 90, position: 'insideRight', style: { fontSize: 10 } }}
                  domain={[0, 15]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}天`, '']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="line"
                />
                {/* 目标值虚线 - 10天 */}
                <ReferenceLine 
                  yAxisId="left"
                  y={10} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: '目标值 10天', position: 'left', fill: '#f59e0b', fontSize: 11, fontWeight: 600 }}
                />
                {shouldShowCategory('酒水') && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="酒水票数" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(票数)"
                  />
                )}
                {shouldShowCategory('香化') && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="香化票数" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(��数)"
                  />
                )}
                {shouldShowCategory('酒水') && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="酒水件数" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="酒水(件数)"
                  />
                )}
                {shouldShowCategory('香化') && (
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="香化件数" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="香化(件数)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            </div>

            {/* 表格维度切换控制 */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 ml-3">
              <div className="flex items-center gap-4">
                {/* 时间维度切换 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">时间维度:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                        timeDimension === 'monthly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('monthly')}
                    >
                      <Calendar className="w-4 h-4" />
                      每月
                    </button>
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                        timeDimension === 'weekly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('weekly')}
                    >
                      <Calendar className="w-4 h-4" />
                      近八周
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
            </div>

            <div className="ml-3">
              {renderMetricTableWithCategory(
                '仓库出库平均时效', 
                outboundTableDataByCategory[dimension]
              )}
            </div>
          </div>

          {/* 二线通关时效 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-green-600 rounded"></div>
              二线通关平均时效
            </h4>
            
            {/* 趋势图 - 票数 vs 件数对比 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">二线通关平均时效对比（票数 | 件数）</div>
              <ResponsiveContainer width="100%" height={240} minHeight={240}>
                <LineChart data={(() => {
                  const labels = getTimeLabels();
                  const secondLineTickets = getDisplayData(customsClearanceData.tickets.secondLine.monthlyData);
                  const secondLinePieces = getDisplayData(customsClearanceData.pieces.secondLine.monthlyData);
                  return labels
                    .map((label, index) => {
                      if (timeDimension === 'monthly' && index === 11) return null;
                      const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                      return {
                        name: label,
                        二线票数: secondLineTickets[dataIndex] || 0,
                        二线件数: secondLinePieces[dataIndex] || 0,
                      };
                    })
                    .filter(Boolean);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '天数', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="二线票数" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="二线(票数)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="二线件数" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="二线(件数)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="ml-3">
              {/* 时间维度切换 */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">时间维度:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                        timeDimension === 'monthly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('monthly')}
                    >
                      每月
                    </button>
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                        timeDimension === 'weekly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('weekly')}
                    >
                      近八周
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
                >
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
              </div>
              
              {renderMetricTable(currentCustoms.secondLine, [
                { name: '二线通关平均时效', data: currentCustoms.secondLine.monthlyData },
              ])}
            </div>
          </div>

          {/* 门店提货至上架平均时效 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2 ml-3">
              <div className="w-1 h-4 bg-green-600 rounded"></div>
              门店提货至上架平均时效
            </h4>
            
            {/* 趋势图 - 票数 vs 件数对比 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100 p-4 mb-4 ml-3 max-w-full overflow-hidden">
              <div className="text-xs text-gray-600 mb-2">门店提货至上架平均时效对比（票数 | 件数）</div>
              <ResponsiveContainer width="100%" height={240} minHeight={240}>
                <LineChart data={(() => {
                  const labels = getTimeLabels();
                  // 模拟数据：门店提货至上架
                  const storePickupTickets = labels.map(() => (Math.random() * 1.5 + 0.5).toFixed(2));
                  const storePickupPieces = labels.map(() => (Math.random() * 1.2 + 0.3).toFixed(2));
                  return labels
                    .map((label, index) => {
                      if (timeDimension === 'monthly' && index === 11) return null;
                      const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                      return {
                        name: label,
                        提货至上架票数: parseFloat(storePickupTickets[dataIndex]) || 0,
                        提货至上架件数: parseFloat(storePickupPieces[dataIndex]) || 0,
                      };
                    })
                    .filter(Boolean);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    label={{ value: '天数', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="提货至上架票数" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="提货至上架(票数)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="提货至上架件数" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="提货至上架(件数)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 数据表 */}
            <div className="ml-3">
              {/* 时间维度切换 */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">时间维度:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                        timeDimension === 'monthly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('monthly')}
                    >
                      每月
                    </button>
                    <button
                      className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                        timeDimension === 'weekly'
                          ? 'bg-white text-blue-600 shadow-sm font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setTimeDimension('weekly')}
                    >
                      近八周
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
                >
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">指标</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">维度</th>
                      <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">均值天数</th>
                      {timeDimension === 'monthly' && (
                        <th className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200">月度均值</th>
                      )}
                      {getTimeLabels().map((label, index) => {
                        if (timeDimension === 'monthly' && index === 11) return null;
                        return (
                          <th key={label} className="px-3 py-2 text-center font-bold text-gray-700 border-r border-gray-200 last:border-r-0">
                            {label}
                          </th>
                        );
                      }).filter(Boolean)}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const labels = getTimeLabels();
                      const storePickupTickets = labels.map(() => (Math.random() * 1.5 + 0.5).toFixed(1));
                      const storePickupPieces = labels.map(() => (Math.random() * 1.2 + 0.3).toFixed(1));
                      
                      // 计算均值
                      const ticketsAvg = (storePickupTickets.reduce((sum, val) => sum + parseFloat(val), 0) / storePickupTickets.length).toFixed(1);
                      const piecesAvg = (storePickupPieces.reduce((sum, val) => sum + parseFloat(val), 0) / storePickupPieces.length).toFixed(1);
                      
                      return (
                        <>
                          {/* 票数 */}
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td rowSpan={2} className="px-3 py-2 text-gray-700 border-r border-gray-200 align-middle">门店提货至上架平均时效</td>
                            <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">票数</td>
                            <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">1.2</td>
                            {timeDimension === 'monthly' && (
                              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{ticketsAvg}</td>
                            )}
                            {labels.map((label, index) => {
                              if (timeDimension === 'monthly' && index === 11) return null;
                              const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                              return (
                                <td key={label} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                  {storePickupTickets[dataIndex]}
                                </td>
                              );
                            }).filter(Boolean)}
                          </tr>
                          {/* 件数 */}
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">件数</td>
                            <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">0.8</td>
                            {timeDimension === 'monthly' && (
                              <td className="px-3 py-2 text-center text-gray-900 border-r border-gray-200">{piecesAvg}</td>
                            )}
                            {labels.map((label, index) => {
                              if (timeDimension === 'monthly' && index === 11) return null;
                              const dataIndex = timeDimension === 'monthly' && index === 12 ? 12 : index;
                              return (
                                <td key={label} className="px-3 py-2 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                  {storePickupPieces[dataIndex]}
                                </td>
                              );
                            }).filter(Boolean)}
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* 门店段 */}
        {shouldShowModule('store') && (
        <div className="bg-purple-50/30 rounded-lg p-6 border-l-4 border-purple-600">
          {/* 标题行与Tab按钮 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-600 rounded"></div>
              门店段
            </h3>
            
            {/* Tab切换 */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 text-sm font-bold rounded transition-all ${
                  storeSegmentTab === 'transfer'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStoreSegmentTab('transfer')}
              >
                调拨时效
              </button>
              <button
                className={`px-4 py-2 text-sm font-bold rounded transition-all ${
                  storeSegmentTab === 'fullChain'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStoreSegmentTab('fullChain')}
              >
                全链路时效
              </button>
              <button
                className={`px-4 py-2 text-sm font-bold rounded transition-all ${
                  storeSegmentTab === 'inOut'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStoreSegmentTab('inOut')}
              >
                出入库时效
              </button>
            </div>
          </div>
          
          {/* 筛选控制行 */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* 计量维度切换 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">计量维度:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      dimension === 'tickets'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setDimension('tickets')}
                  >
                    <FileText className="w-4 h-4" />
                    票数
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      dimension === 'pieces'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setDimension('pieces')}
                  >
                    <Package className="w-4 h-4" />
                    件数
                  </button>
                </div>
              </div>

              {/* 时间维度切换 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">时间维度:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      timeDimension === 'monthly'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setTimeDimension('monthly')}
                  >
                    <Calendar className="w-4 h-4" />
                    每月
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                      timeDimension === 'weekly'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setTimeDimension('weekly')}
                  >
                    <Calendar className="w-4 h-4" />
                    近八周
                  </button>
                </div>
              </div>
            </div>
            
            {/* 导出按钮 */}
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
            >
              <Download className="w-4 h-4" />
              导出数据
            </button>
          </div>

          {/* Tab内容 - 调拨时效 */}
          {storeSegmentTab === 'transfer' && (
            <div className="ml-3">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  监管仓-周转仓调拨平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.supervisoryToTransit, '监管仓-周转仓调拨平均时效', '天')}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  周转仓-卖场调拨平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.transitToStore, '周转仓-卖场调拨平均时效', '天')}
              </div>
            </div>
          )}

          {/* Tab内容 - 全链路时效 */}
          {storeSegmentTab === 'fullChain' && (
            <div className="ml-3">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  直入直出全链路平均时效（监管仓-卖场） (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.directFullChain, '直入直出全链路平均时效（监管仓-卖场）', '天')}
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  邮寄全链路平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.mailFullChain, '邮寄全链路平均时效', '天')}
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  提货点提货全链路平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.pickupPointFullChain, '提货点提货全链路平均时效', '天')}
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  监管仓/周转仓-预定仓全链路平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.toReservedFullChain, '监管仓/周转仓-预定仓全链路平均时效', '天')}
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  预定仓邮寄全链路平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.reservedMailFullChain, '预定仓邮寄全链路平均时效', '天')}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  预定仓配送全链路平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.reservedDeliveryFullChain, '预定仓配送全链路平均��效', '天')}
              </div>
            </div>
          )}

          {/* Tab内容 - 出入库时效 */}
          {storeSegmentTab === 'inOut' && (
            <div className="ml-3">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  卖场-分拣仓入库平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.storeToSortingInbound, '卖场-分拣仓入库平均时效', '天')}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-purple-600 rounded"></div>
                  配送出库平均时效 (天)
                </h4>
                {renderDeliveryStoreTable(storeSegmentMetrics.deliveryOutbound, '配送出库平均时效', '天')}
              </div>
            </div>
          )}
        </div>
        )}

        {/* 其他 */}
        {shouldShowModule('other') && (
        <div className="bg-gray-50/30 rounded-lg p-6 border-l-4 border-gray-600">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-2 h-6 bg-gray-600 rounded"></div>
            其它
          </h3>

          <OtherMetricsModule 
            tableHeaderClass={tableHeaderClass}
            tableCellClass={tableCellClass}
            tableCellCenterClass={tableCellCenterClass}
          />
        </div>
        )}
      </div>
    </div>
  );
}
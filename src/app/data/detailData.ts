interface Order {
  orderNo: string;
  store: string;
  warehouse: string;
  targetTime: number;
  actualTime: number;
  status: '达标' | '不达标';
  appealStatus?: string;
}

interface StoreMonthData {
  name: string;
  level: string;
  months: number[];
  trend: string;
}

interface SegmentData {
  name: string;
  exceedLabel: string;
  exceed: {
    total: number;
    months: number[];
  };
  totalOrders: {
    total: number;
    months: number[];
  };
  rate: {
    total: number;
    months: number[];
  };
  trend: string;
}

interface DetailData {
  beforeAppeal: {
    rate: number;
    overallRate: number;
    orders: Order[];
    storeData: StoreMonthData[];
    totalData: number[];
  };
  afterAppeal: {
    rate: number;
    overallRate: number;
    orders: Order[];
    storeData: StoreMonthData[];
    totalData: number[];
  };
  segmentData: SegmentData[];
}

export function getDetailData(metricId: string): DetailData {
  // 模拟订单数据
  const beforeOrders: Order[] = [
    {
      orderNo: 'ORD20231201001',
      store: '三亚海棠湾店',
      warehouse: '海棠湾店基地仓[A01]',
      targetTime: 24,
      actualTime: 22.5,
      status: '达标',
    },
    {
      orderNo: 'ORD20231201002',
      store: '新海港店',
      warehouse: '新海港店监管仓[B11]',
      targetTime: 24,
      actualTime: 26.3,
      status: '不达标',
      appealStatus: '已申诉',
    },
    {
      orderNo: 'ORD20231201003',
      store: '海口美兰机场店',
      warehouse: '美兰店监管仓[B21]',
      targetTime: 24,
      actualTime: 23.1,
      status: '达标',
    },
    {
      orderNo: 'ORD20231201004',
      store: '三亚凤凰机场店',
      warehouse: '三亚机场店监管仓[A11]',
      targetTime: 24,
      actualTime: 28.5,
      status: '不达标',
      appealStatus: '已申诉',
    },
  ];

  // 剔除后数据
  const afterOrders = beforeOrders.filter(
    order => order.appealStatus !== '已申诉'
  );

  const calculateRate = (orders: Order[]) => {
    const total = orders.length;
    const qualified = orders.filter(o => o.status === '达标').length;
    return (qualified / total) * 100;
  };

  // 按门店分解数据（剔除前）
  const beforeStoreData: StoreMonthData[] = [
    {
      name: '新海港店',
      level: '一级',
      months: [85.2, 87.3, 88.1, 86.5, 89.2, 90.1, 88.7, 87.9, 89.5, 91.2, 92.3, 91.8],
      trend: '↑',
    },
    {
      name: '日月店',
      level: '一级',
      months: [88.5, 89.2, 90.1, 87.8, 88.9, 91.2, 89.5, 90.3, 91.8, 93.1, 94.2, 93.5],
      trend: '↑',
    },
    {
      name: '美兰店',
      level: '一级',
      months: [82.3, 84.5, 85.7, 83.2, 86.1, 87.5, 86.3, 85.9, 88.2, 89.5, 90.8, 90.1],
      trend: '↑',
    },
    {
      name: '博鳌店',
      level: '二级',
      months: [79.5, 81.2, 82.8, 80.5, 83.2, 84.7, 83.5, 84.1, 85.9, 87.2, 88.5, 87.8],
      trend: '↑',
    },
    {
      name: '海棠湾店',
      level: '一级',
      months: [90.1, 91.5, 92.3, 89.8, 91.7, 93.2, 92.1, 91.8, 93.5, 94.8, 95.6, 95.2],
      trend: '↑',
    },
  ];

  // 按门店分解数据（剔除后）
  const afterStoreData: StoreMonthData[] = [
    {
      name: '新海港店',
      level: '一级',
      months: [87.5, 89.1, 90.2, 88.7, 91.3, 92.4, 90.9, 90.2, 91.8, 93.5, 94.6, 94.1],
      trend: '↑',
    },
    {
      name: '日月店',
      level: '一级',
      months: [90.2, 91.1, 92.3, 89.9, 90.8, 93.1, 91.7, 92.5, 93.9, 95.2, 96.3, 95.8],
      trend: '↑',
    },
    {
      name: '美兰店',
      level: '一级',
      months: [85.1, 87.2, 88.5, 86.1, 88.9, 90.3, 89.1, 88.7, 91.1, 92.4, 93.7, 93.1],
      trend: '↑',
    },
    {
      name: '博鳌店',
      level: '二级',
      months: [82.3, 84.1, 85.7, 83.4, 86.1, 87.6, 86.4, 87.1, 88.9, 90.2, 91.5, 90.8],
      trend: '↑',
    },
    {
      name: '海棠湾店',
      level: '一级',
      months: [91.8, 93.2, 94.1, 91.7, 93.5, 95.1, 94.0, 93.7, 95.4, 96.7, 97.5, 97.1],
      trend: '↑',
    },
  ];

  const beforeTotalData = [85.1, 86.7, 87.8, 85.6, 87.8, 89.3, 88.0, 87.6, 89.8, 91.2, 92.3, 91.7];
  const afterTotalData = [87.4, 88.9, 90.2, 87.9, 90.1, 91.7, 90.4, 90.4, 92.2, 93.6, 94.7, 94.2];

  // 分段时效数据
  const segmentData: SegmentData[] = [
    {
      name: '分拣通知-提货门店接通（10天）',
      exceedLabel: '大于10天的订单数量',
      exceed: {
        total: 245,
        months: [28, 25, 22, 30, 20, 18, 21, 19, 16, 15, 12, 19],
      },
      totalOrders: {
        total: 3200,
        months: [280, 265, 270, 285, 260, 255, 265, 270, 250, 245, 240, 315],
      },
      rate: {
        total: 92.3,
        months: [90.0, 90.6, 91.9, 89.5, 92.3, 92.9, 92.1, 93.0, 93.6, 93.9, 95.0, 94.0],
      },
      trend: '↑',
    },
    {
      name: '提货门店接收-仓库装车交接（24H）',
      exceedLabel: '大于24小时订单数量',
      exceed: {
        total: 185,
        months: [22, 18, 16, 20, 15, 14, 16, 14, 12, 11, 10, 17],
      },
      totalOrders: {
        total: 3200,
        months: [280, 265, 270, 285, 260, 255, 265, 270, 250, 245, 240, 315],
      },
      rate: {
        total: 94.2,
        months: [92.1, 93.2, 94.1, 93.0, 94.2, 94.5, 94.0, 94.8, 95.2, 95.5, 95.8, 94.6],
      },
      trend: '↑',
    },
    {
      name: '仓库装车交接-门店上架（含理货、提车、收货、上架）（48H）',
      exceedLabel: '大于48小时订单数量',
      exceed: {
        total: 312,
        months: [35, 32, 28, 38, 26, 24, 27, 25, 22, 20, 18, 17],
      },
      totalOrders: {
        total: 3200,
        months: [280, 265, 270, 285, 260, 255, 265, 270, 250, 245, 240, 315],
      },
      rate: {
        total: 90.3,
        months: [87.5, 87.9, 89.6, 86.7, 90.0, 90.6, 89.8, 90.7, 91.2, 91.8, 92.5, 94.6],
      },
      trend: '↑',
    },
  ];

  return {
    beforeAppeal: {
      rate: calculateRate(beforeOrders),
      overallRate: 87.6,
      orders: beforeOrders,
      storeData: beforeStoreData,
      totalData: beforeTotalData,
    },
    afterAppeal: {
      rate: calculateRate(afterOrders),
      overallRate: 91.2,
      orders: afterOrders,
      storeData: afterStoreData,
      totalData: afterTotalData,
    },
    segmentData,
  };
}

// 门店-仓库映射数据
// Source: 20260529门店映射关系表+目标值维护.xlsx / Sheet1 门店-仓库映射表

export type WarehouseCategory = '监管仓' | '周转仓' | '分拣仓' | '预定仓' | '柜台' | '自建仓' | '一盘货仓' | '其他';

export interface Store {
  id: string;
  name: string;
  warehouseIds: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  storeId: string;
  category: WarehouseCategory;
  businessType: string;
  shopNo: string;
  ciboCode: string;
  source: string;
  remark: string;
}

export const stores: Store[] = [
  {
    id: "7063",
    name: "【7063】海南国际物流中心",
    warehouseIds: [
      "7063-706302",
      "7063-706305"
    ]
  },
  {
    id: "6867",
    name: "【6867】三亚海棠湾店",
    warehouseIds: [
      "6867-686701"
    ]
  },
  {
    id: "7018",
    name: "【7018】三亚海棠湾店",
    warehouseIds: [
      "7018-701804",
      "7018-701802",
      "7018-704802",
      "7018-704803"
    ]
  },
  {
    id: "6868",
    name: "【6868】三亚海棠湾店",
    warehouseIds: [
      "6868-686801",
      "6868-686802",
      "6868-686803",
      "6868-686701",
      "6868-6868"
    ]
  },
  {
    id: "7048",
    name: "【7048】新海港店",
    warehouseIds: [
      "7048-704801",
      "7048-704804",
      "7048-7048",
      "7048-704801-2"
    ]
  },
  {
    id: "7016",
    name: "【7016】三亚凤凰机场店",
    warehouseIds: [
      "7016-701607",
      "7016-701615",
      "7016-701608",
      "7016-701605",
      "7016-7016",
      "7016-701607-2",
      "7016-701615-2"
    ]
  },
  {
    id: "6132",
    name: "【6132】海口美兰机场店",
    warehouseIds: [
      "6132-613266",
      "6132-613201",
      "6132-613217",
      "6132-6132",
      "6132-613266-2"
    ]
  },
  {
    id: "6922",
    name: "【6922】海口日月店",
    warehouseIds: [
      "6922-692267",
      "6922-692268",
      "6922-613267",
      "6922-692206",
      "6922-692207",
      "6922-692264",
      "6922-692265",
      "6922-692266",
      "6922-6922",
      "6922-692267-2",
      "6922-692268-2",
      "6922-613267-2"
    ]
  },
  {
    id: "6921",
    name: "【6921】博鳌店",
    warehouseIds: [
      "6921-692166",
      "6921-692102",
      "6921-692103",
      "6921-6921",
      "6921-692166-2"
    ]
  }
];

export const warehouses: Warehouse[] = [
  {
    id: "7063-706302",
    name: "香化仓-2号库",
    storeId: "7063",
    category: "一盘货仓",
    businessType: "订、分货段",
    shopNo: "706302",
    ciboCode: "SWHS0001032214910",
    source: "海综保 分货台账【品类】字段区分香化仓或酒水仓",
    remark: ""
  },
  {
    id: "7063-706305",
    name: "酒水仓-4号库",
    storeId: "7063",
    category: "一盘货仓",
    businessType: "订、分货段",
    shopNo: "706305",
    ciboCode: "SWHS0001032214910",
    source: "海综保 分货台账【品类】字段区分香化仓或酒水仓",
    remark: ""
  },
  {
    id: "6867-686701",
    name: "海棠湾店监管仓（物流基地）",
    storeId: "6867",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "686701",
    ciboCode: "SWHS0001032215155",
    source: "中免集团三亚市内免税店免税品监管仓 （一盘货出库段不与凤凰机场店拆开）",
    remark: "佳翔监管仓的有效柜组为686703，但香化基本是单品量很大由物流基地调过去存储或部分精品会直接在佳翔卸货。目前看板包含的香化及酒水暂不涉及"
  },
  {
    id: "7018-701804",
    name: "三亚免税预定(佳翔仓)",
    storeId: "7018",
    category: "预定仓",
    businessType: "门店段",
    shopNo: "701804",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6868-686801",
    name: "海棠湾店周转仓[A06]",
    storeId: "6868",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "686801",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6868-686802",
    name: "海棠湾店周转仓[A06]",
    storeId: "6868",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "686802",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6868-686803",
    name: "海棠湾店周转仓[A06]",
    storeId: "6868",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "686803",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6868-686701",
    name: "海棠湾店监管仓（物流基地）",
    storeId: "6868",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "686701",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6868-6868",
    name: "海棠湾店分拣仓",
    storeId: "6868",
    category: "分拣仓",
    businessType: "门店段",
    shopNo: "6868",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7048-704801",
    name: "新海港店监管仓[B11]",
    storeId: "7048",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "704801",
    ciboCode: "SWHS0001032214784",
    source: "中免(海口)国际免税城免税品监管仓",
    remark: ""
  },
  {
    id: "7018-701802",
    name: "海口预定仓(免税仓)",
    storeId: "7018",
    category: "预定仓",
    businessType: "门店段",
    shopNo: "701802",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7018-704802",
    name: "海口预定仓(免税仓)",
    storeId: "7018",
    category: "预定仓",
    businessType: "门店段",
    shopNo: "704802",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7018-704803",
    name: "海口预定仓(免税仓)",
    storeId: "7018",
    category: "预定仓",
    businessType: "门店段",
    shopNo: "704803",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7048-704804",
    name: "新海港店周转仓[B16]",
    storeId: "7048",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "704804",
    ciboCode: "29",
    source: "",
    remark: ""
  },
  {
    id: "7048-7048",
    name: "新海港店分拣仓",
    storeId: "7048",
    category: "分拣仓",
    businessType: "门店段",
    shopNo: "7048",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7048-704801-2",
    name: "新海港店监管仓[B11]",
    storeId: "7048",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "704801",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7016-701607",
    name: "凤凰机场店监管仓[A11]",
    storeId: "7016",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "701607",
    ciboCode: "SWHS0001032215155",
    source: "中免集团三亚市内免税店免税品监管仓（一盘货出库段不与三亚店拆开）",
    remark: ""
  },
  {
    id: "7016-701615",
    name: "凤凰机场店监管仓[A11]",
    storeId: "7016",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "701615",
    ciboCode: "SWHS0001032215155",
    source: "中免集团三亚市内免税店免税品监管仓（一盘货出库段不与三亚店拆开）",
    remark: "701615（有税）"
  },
  {
    id: "7016-701608",
    name: "凤凰机场店周转仓[A16]",
    storeId: "7016",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "701608",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7016-701605",
    name: "凤凰机场店周转仓[A16]",
    storeId: "7016",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "701605",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7016-7016",
    name: "凤凰机场店分拣仓",
    storeId: "7016",
    category: "分拣仓",
    businessType: "门店段",
    shopNo: "7016",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7016-701607-2",
    name: "凤凰机场店监管仓[A11]",
    storeId: "7016",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "701607",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "7016-701615-2",
    name: "凤凰机场店监管仓[A11]",
    storeId: "7016",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "701615",
    ciboCode: "34",
    source: "",
    remark: ""
  },
  {
    id: "6132-613266",
    name: "美兰机场店监管仓[B21]",
    storeId: "6132",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "613266",
    ciboCode: "SWHS0001032214990",
    source: "海免海口美兰机场免税店免税品监管仓",
    remark: ""
  },
  {
    id: "6132-613201",
    name: "美兰店周转仓[B26]",
    storeId: "6132",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "613201",
    ciboCode: "42",
    source: "",
    remark: ""
  },
  {
    id: "6132-613217",
    name: "美兰店周转仓[B26]",
    storeId: "6132",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "613217",
    ciboCode: "43",
    source: "",
    remark: ""
  },
  {
    id: "6132-6132",
    name: "美兰机场店分拣仓",
    storeId: "6132",
    category: "分拣仓",
    businessType: "门店段",
    shopNo: "6132",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6132-613266-2",
    name: "美兰机场店监管仓[B21]",
    storeId: "6132",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "613266",
    ciboCode: "45",
    source: "",
    remark: ""
  },
  {
    id: "6922-692267",
    name: "日月店监管仓",
    storeId: "6922",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "692267",
    ciboCode: "SWHS0001032214968",
    source: "海免(海口)免税店免税品监管仓",
    remark: ""
  },
  {
    id: "6922-692268",
    name: "日月店监管仓",
    storeId: "6922",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "692268",
    ciboCode: "SWHS0001032214968",
    source: "海免(海口)免税店免税品监管仓",
    remark: ""
  },
  {
    id: "6922-613267",
    name: "日月店监管仓",
    storeId: "6922",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "613267",
    ciboCode: "SWHS0001032214968",
    source: "海免(海口)免税店免税品监管仓",
    remark: ""
  },
  {
    id: "6922-692206",
    name: "日月店周转仓[B36]",
    storeId: "6922",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "692206",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-692207",
    name: "日月店周转仓[B36]",
    storeId: "6922",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "692207",
    ciboCode: "51",
    source: "",
    remark: ""
  },
  {
    id: "6922-692264",
    name: "日月店周转仓[B36]",
    storeId: "6922",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "692264",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-692265",
    name: "日月店周转仓[B36]",
    storeId: "6922",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "692265",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-692266",
    name: "日月店周转仓[B36]",
    storeId: "6922",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "692266",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-6922",
    name: "日月店分拣仓",
    storeId: "6922",
    category: "分拣仓",
    businessType: "门店段",
    shopNo: "6922",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-692267-2",
    name: "日月店监管仓",
    storeId: "6922",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "692267",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-692268-2",
    name: "日月店监管仓",
    storeId: "6922",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "692268",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6922-613267-2",
    name: "日月店监管仓",
    storeId: "6922",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "613267",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6921-692166",
    name: "博鳌店监管仓",
    storeId: "6921",
    category: "监管仓",
    businessType: "订、分货段",
    shopNo: "692166",
    ciboCode: "SWHS0001032214924",
    source: "琼海海中免免税品监管仓",
    remark: ""
  },
  {
    id: "6921-692102",
    name: "博鳌店周转仓[C06]",
    storeId: "6921",
    category: "周转仓",
    businessType: "门店段",
    shopNo: "692102",
    ciboCode: "59",
    source: "",
    remark: ""
  },
  {
    id: "6921-692103",
    name: "博鳌店分拣仓",
    storeId: "6921",
    category: "分拣仓",
    businessType: "门店段",
    shopNo: "692103",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6921-6921",
    name: "博鳌店有税仓",
    storeId: "6921",
    category: "其他",
    businessType: "门店段",
    shopNo: "6921",
    ciboCode: "",
    source: "",
    remark: ""
  },
  {
    id: "6921-692166-2",
    name: "博鳌店监管仓",
    storeId: "6921",
    category: "监管仓",
    businessType: "门店段",
    shopNo: "692166",
    ciboCode: "",
    source: "",
    remark: ""
  }
];

export function getFilteredWarehouses(selectedStores: string[]): Warehouse[] {
  if (selectedStores.length === 0) {
    return warehouses;
  }
  return warehouses.filter(w => selectedStores.includes(w.storeId));
}

export function getFilteredStores(selectedWarehouses: string[]): Store[] {
  if (selectedWarehouses.length === 0) {
    return stores;
  }
  const storeIds = new Set(
    warehouses
      .filter(w => selectedWarehouses.includes(w.id))
      .map(w => w.storeId)
  );
  return stores.filter(s => storeIds.has(s.id));
}

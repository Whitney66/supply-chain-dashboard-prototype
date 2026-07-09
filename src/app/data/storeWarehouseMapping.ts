// 门店-仓库映射数据

export type WarehouseCategory = '监管仓' | '周转仓' | '分拣仓' | '预定仓' | '柜台' | '自建仓' | '其他';

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
}

// 门店数据
export const stores: Store[] = [
  {
    id: '7063',
    name: '【7063】海南国际物流中心',
    warehouseIds: ['7063-B01', '7063-B02', '7063-B03', '7063-B04'],
  },
  {
    id: '6868',
    name: '【6868】三亚海棠湾店',
    warehouseIds: ['6868-A01', '6868-A02', '6868-A06', '6868-bangda', '6868-sorting', '6868-counter'],
  },
  {
    id: '7048',
    name: '【7048】新海港店',
    warehouseIds: ['7048-B11', '7048-B16', '7048-sorting', '7048-counter'],
  },
  {
    id: '7016',
    name: '【7016】三亚凤凰机场店',
    warehouseIds: ['7016-A11', '7016-A16', '7016-counter'],
  },
  {
    id: '6132',
    name: '【6132】海口美兰机场店',
    warehouseIds: ['6132-B21', '6132-B26', '6132-counter'],
  },
  {
    id: '6922',
    name: '【6922】海口日月店',
    warehouseIds: ['6922-B31', '6922-B36', '6922-zbq', '6922-sorting', '6922-counter'],
  },
  {
    id: '6921',
    name: '【6921】博鳌店',
    warehouseIds: ['6921-C01', '6921-C06', '6921-tax', '6921-counter'],
  },
  {
    id: '7017',
    name: '【7017】电商',
    warehouseIds: [
      '7017-sanya',
      '7017-sanya-pre',
      '7017-hk-pre',
      '7017-zbq-member',
      '7017-zbq-build',
      '7017-zbq-haijiao',
      '7017-zbq-self',
      '7017-jinma',
      '7017-daifa',
      '7017-exp',
    ],
  },
  {
    id: '7052',
    name: '【7052】跨境电商',
    warehouseIds: ['7052-zbq', '7052-sanya'],
  },
];

// 仓库数据
export const warehouses: Warehouse[] = [
  // 7063 - 海南国际物流中心
  { id: '7063-B01', name: '海口综保区自建仓[B01]', storeId: '7063', category: '自建仓' },
  { id: '7063-B02', name: '海口综保区自建仓[B02]', storeId: '7063', category: '自建仓' },
  { id: '7063-B03', name: '海口综保区自建仓[B03]', storeId: '7063', category: '自建仓' },
  { id: '7063-B04', name: '海口综保区自建仓[B04]', storeId: '7063', category: '自建仓' },
  
  // 6868 - 三亚海棠湾店
  { id: '6868-A01', name: '海棠湾店基地仓[A01]', storeId: '6868', category: '监管仓' },
  { id: '6868-A02', name: '海棠湾店佳翔仓[A02]', storeId: '6868', category: '自建仓' },
  { id: '6868-A06', name: '海棠湾店周转仓[A06]', storeId: '6868', category: '周转仓' },
  { id: '6868-bangda', name: '海口综保区邦达仓', storeId: '6868', category: '其他' },
  { id: '6868-sorting', name: '海棠湾店分拣仓', storeId: '6868', category: '分拣仓' },
  { id: '6868-counter', name: '海棠湾店柜台', storeId: '6868', category: '柜台' },
  
  // 7048 - 新海港店
  { id: '7048-B11', name: '新海港店监管仓[B11]', storeId: '7048', category: '监管仓' },
  { id: '7048-B16', name: '新海港店周转仓[B16]', storeId: '7048', category: '周转仓' },
  { id: '7048-sorting', name: '新海港店分拣仓', storeId: '7048', category: '分拣仓' },
  { id: '7048-counter', name: '新海港店柜台', storeId: '7048', category: '柜台' },
  
  // 7016 - 三亚凤凰机场店
  { id: '7016-A11', name: '三亚机场店监管仓[A11]', storeId: '7016', category: '监管仓' },
  { id: '7016-A16', name: '三亚机场店周转仓[A16]', storeId: '7016', category: '周转仓' },
  { id: '7016-counter', name: '三亚凤凰机场店柜台', storeId: '7016', category: '柜台' },
  
  // 6132 - 海口美兰机场店
  { id: '6132-B21', name: '美兰店监管仓[B21]', storeId: '6132', category: '监管仓' },
  { id: '6132-B26', name: '美兰店周转仓[B26]', storeId: '6132', category: '周转仓' },
  { id: '6132-counter', name: '美兰店柜台', storeId: '6132', category: '柜台' },
  
  // 6922 - 海口日月店
  { id: '6922-B31', name: '日月店监管仓[B31]', storeId: '6922', category: '监管仓' },
  { id: '6922-B36', name: '日月店周转仓[B36]', storeId: '6922', category: '周转仓' },
  { id: '6922-zbq', name: '综保区监管仓', storeId: '6922', category: '其他' },
  { id: '6922-sorting', name: '日月店分拣仓', storeId: '6922', category: '分拣仓' },
  { id: '6922-counter', name: '日月店柜台', storeId: '6922', category: '柜台' },
  
  // 6921 - 博鳌店
  { id: '6921-C01', name: '博鳌店监管仓[C01]', storeId: '6921', category: '监管仓' },
  { id: '6921-C06', name: '博鳌店周转仓[C06]', storeId: '6921', category: '周转仓' },
  { id: '6921-tax', name: '博鳌店有税仓', storeId: '6921', category: '其他' },
  { id: '6921-counter', name: '博鳌店柜台', storeId: '6921', category: '柜台' },
  
  // 7017 - 电商
  { id: '7017-sanya', name: '三亚物流基地(免税仓)', storeId: '7017', category: '其他' },
  { id: '7017-sanya-pre', name: '三亚免税预定(佳翔仓)', storeId: '7017', category: '预定仓' },
  { id: '7017-hk-pre', name: '海口预定仓(免税仓)', storeId: '7017', category: '预定仓' },
  { id: '7017-zbq-member', name: '综保区会员购（管委会仓）', storeId: '7017', category: '其他' },
  { id: '7017-zbq-build', name: '综保区自建仓会员购', storeId: '7017', category: '自建仓' },
  { id: '7017-zbq-haijiao', name: '海口综保区海胶仓(会员购)', storeId: '7017', category: '自建仓' },
  { id: '7017-zbq-self', name: '海口综保区自建仓(会员购)', storeId: '7017', category: '自建仓' },
  { id: '7017-jinma', name: '海口金马有税苏宁云仓', storeId: '7017', category: '其他' },
  { id: '7017-daifa', name: '电商代发仓', storeId: '7017', category: '其他' },
  { id: '7017-exp', name: '电商体验店', storeId: '7017', category: '其他' },
  
  // 7052 - 跨境电商
  { id: '7052-zbq', name: '综保区管委会跨境仓', storeId: '7052', category: '其他' },
  { id: '7052-sanya', name: '三亚跨境电商仓', storeId: '7052', category: '其他' },
];

// 智能过滤函数
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
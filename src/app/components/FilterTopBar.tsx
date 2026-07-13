import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, XCircle } from 'lucide-react';
import { subDays } from 'date-fns';
import { DateRangePicker } from './DateRangePicker';
import { getFilteredWarehouses, getFilteredStores, warehouses, stores } from '@/app/data/storeWarehouseMapping';
import type { FilterState, RoleType } from '../types';

interface FilterTopBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const ROLE_OPTIONS: { value: RoleType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'shipping', label: '仅发货' },
  { value: 'receiving', label: '仅收货' },
];

function RoleToggle({ value, onChange }: { value: RoleType; onChange: (v: RoleType) => void }) {
  return (
    <div className="flex h-10 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {ROLE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-sm rounded-md transition-all whitespace-nowrap ${
            value === opt.value
              ? 'bg-white text-blue-600 shadow-sm font-semibold'
              : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function DimensionDropdown({
  label,
  items,
  selected,
  onSelectionChange,
  role,
  onRoleChange,
}: {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onSelectionChange: (ids: string[]) => void;
  role: RoleType;
  onRoleChange: (r: RoleType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  const allSelected = filtered.length > 0 && filtered.every((i) => selected.includes(i.id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(selected.filter((id) => !filtered.map((i) => i.id).includes(id)));
    } else {
      onSelectionChange(Array.from(new Set([...selected, ...filtered.map((i) => i.id)])));
    }
  };

  const toggleItem = (id: string) => {
    onSelectionChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id],
    );
  };

  const displayText =
    selected.length === 0 || selected.length === items.length
      ? `全部${label}`
      : `已选${selected.length}个`;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      {/* Label */}
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{label}</span>
      {/* Role selector first */}
      <RoleToggle value={role} onChange={onRoleChange} />
      {/* Dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 transition-colors hover:border-blue-400 min-w-[100px] whitespace-nowrap"
        >
          <span className="flex-1 text-left">{displayText}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`搜索${label}...`}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="max-h-56 overflow-y-auto p-1.5">
              <label className="flex items-center gap-2.5 px-2 py-2 rounded cursor-pointer hover:bg-gray-50 border-b border-gray-100 mb-1">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
                />
                <span className="text-sm font-semibold text-gray-700">全选</span>
              </label>
              {filtered.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded cursor-pointer hover:bg-gray-50 ${
                    selected.includes(item.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
                  />
                  <span className={`text-sm ${selected.includes(item.id) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </label>
              ))}
              {filtered.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4">暂无匹配</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (cats: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const categories = ['香化', '酒水'];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSelected = categories.every((c) => selected.includes(c));
  const displayText = allSelected || selected.length === 0 ? '全部品类' : selected.join('、');

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">品类</span>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 transition-colors hover:border-blue-400 min-w-[90px]"
        >
          <span className="flex-1 text-left">{displayText}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-1.5">
            <button
              type="button"
              onClick={() => {
                const reversed = categories.filter((cat) => !selected.includes(cat));
                onChange(reversed.length === categories.length ? [] : reversed);
              }}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded cursor-pointer hover:bg-gray-50 border-b border-gray-100 mb-1 text-left"
            >
              <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-700">反选</span>
            </button>
            <label className={`flex items-center gap-2.5 px-2 py-2 rounded cursor-pointer hover:bg-gray-50 ${selected.length === 0 || allSelected ? 'bg-blue-50' : ''}`}>
              <input
                type="checkbox"
                checked={selected.length === 0 || allSelected}
                onChange={() => onChange([])}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className={`text-sm ${selected.length === 0 || allSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>全部品类</span>
            </label>
            {categories.map((cat) => (
              <label
                key={cat}
                className={`flex items-center gap-2.5 px-2 py-2 rounded cursor-pointer hover:bg-gray-50 ${selected.includes(cat) ? 'bg-blue-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(cat)}
                  onChange={() => {
                    const newCats = selected.includes(cat)
                      ? selected.filter((c) => c !== cat)
                      : [...selected, cat];
                    onChange(newCats);
                  }}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span className={`text-sm ${selected.includes(cat) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const QUICK_RANGES = [
  { key: '7days', label: '近7天' },
  { key: '1month', label: '近1个月' },
  { key: '3months', label: '近3个月' },
  { key: 'springFestival', label: '春节' },
];

export function FilterTopBar({ filters, onFiltersChange }: FilterTopBarProps) {
  const [local, setLocal] = useState<FilterState>(filters);
  const [quickRange, setQuickRange] = useState<string>('');

  useEffect(() => { setLocal(filters); }, [filters]);

  const filteredWarehouses = getFilteredWarehouses(local.selectedStores);
  const filteredStores = getFilteredStores(local.selectedWarehouses);

  const applyQuickRange = (range: string) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);
    switch (range) {
      case '7days':
        start = subDays(today, 6); break;
      case '1month':
        start = subDays(today, 29); break;
      case '3months':
        start = subDays(today, 89); break;
      case 'springFestival':
        start = new Date(2026, 1, 10); end = new Date(2026, 1, 24); break;
    }
    setQuickRange(range);
    setLocal((prev) => ({ ...prev, startDate: start, endDate: end }));
  };

  const handleQuery = () => onFiltersChange(local);

  const handleClear = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reset: FilterState = {
      startDate: yesterday,
      endDate: yesterday,
      showStoreFilter: false,
      showWarehouseFilter: false,
      showCategoryFilter: false,
      selectedStores: [],
      selectedWarehouses: [],
      selectedCategories: [],
      storeRole: 'all',
      warehouseRole: 'all',
    };
    setLocal(reset);
    setQuickRange('');
  };

  return (
    <div className="mb-0 max-w-full overflow-visible rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">日期范围：</span>
          <DateRangePicker
            startDate={local.startDate}
            endDate={local.endDate}
            onDateRangeChange={(startDate, endDate) => {
              setLocal((prev) => ({ ...prev, startDate, endDate }));
              setQuickRange('');
            }}
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {QUICK_RANGES.map((btn) => (
            <button
              key={btn.key}
              onClick={() => applyQuickRange(btn.key)}
              className={`h-10 min-w-[96px] rounded-lg border px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                quickRange === btn.key
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 text-slate-800 hover:border-gray-300 hover:bg-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* 门店: 角色 → 筛选 */}
        <DimensionDropdown
          label="门店"
          items={local.selectedWarehouses.length > 0 ? filteredStores : stores}
          selected={local.selectedStores}
          onSelectionChange={(ids) =>
            setLocal((prev) => ({ ...prev, selectedStores: ids, showStoreFilter: ids.length > 0 }))
          }
          role={local.storeRole}
          onRoleChange={(r) => setLocal((prev) => ({ ...prev, storeRole: r }))}
        />

        {/* 仓库: 角色 → 筛选 */}
        <DimensionDropdown
          label="仓库"
          items={local.selectedStores.length > 0 ? filteredWarehouses : warehouses}
          selected={local.selectedWarehouses}
          onSelectionChange={(ids) =>
            setLocal((prev) => ({ ...prev, selectedWarehouses: ids, showWarehouseFilter: ids.length > 0 }))
          }
          role={local.warehouseRole}
          onRoleChange={(r) => setLocal((prev) => ({ ...prev, warehouseRole: r }))}
        />

        <div className="h-7 w-px bg-gray-200 flex-shrink-0" />

        {/* 品类 */}
        <CategoryDropdown
          selected={local.selectedCategories}
          onChange={(cats) =>
            setLocal((prev) => ({ ...prev, selectedCategories: cats, showCategoryFilter: cats.length > 0 }))
          }
        />

        {/* 操作按钮 */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-sm text-gray-600 transition-colors hover:bg-gray-200"
          >
            <XCircle className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handleQuery}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Search className="w-4 h-4" />
            查询
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Warehouse, WarehouseCategory } from '../data/storeWarehouseMapping';

interface WarehouseCategorySelectorProps {
  warehouses: Warehouse[];
  selectedWarehouses: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function WarehouseCategorySelector({
  warehouses,
  selectedWarehouses,
  onSelectionChange,
}: WarehouseCategorySelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<WarehouseCategory>>(
    new Set(['监管仓', '周转仓', '分拣仓', '预定仓', '柜台', '自建仓', '其他'])
  );

  // 按分类分组仓库
  const warehousesByCategory = warehouses.reduce((acc, warehouse) => {
    if (!acc[warehouse.category]) {
      acc[warehouse.category] = [];
    }
    acc[warehouse.category].push(warehouse);
    return acc;
  }, {} as Record<WarehouseCategory, Warehouse[]>);

  // 分类顺序
  const categoryOrder: WarehouseCategory[] = ['监管仓', '周转仓', '分拣仓', '预定仓', '柜台', '自建仓', '其他'];

  // 分类图标映射
  const categoryIcons: Record<WarehouseCategory, string> = {
    '监管仓': '🏛️',
    '周转仓': '🔄',
    '分拣仓': '📦',
    '预定仓': '📅',
    '柜台': '🛒',
    '自建仓': '🏗️',
    '其他': '📍',
  };

  // 切换分类展开/折叠
  const toggleCategory = (category: WarehouseCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // 切换单个仓库
  const toggleWarehouse = (warehouseId: string) => {
    const newSelected = selectedWarehouses.includes(warehouseId)
      ? selectedWarehouses.filter((id) => id !== warehouseId)
      : [...selectedWarehouses, warehouseId];
    onSelectionChange(newSelected);
  };

  // 全选/取消全选某个分类
  const toggleCategoryAll = (category: WarehouseCategory) => {
    const categoryWarehouses = warehousesByCategory[category] || [];
    const categoryWarehouseIds = categoryWarehouses.map((w) => w.id);
    const allSelected = categoryWarehouseIds.every((id) => selectedWarehouses.includes(id));

    if (allSelected) {
      // 取消全选
      const newSelected = selectedWarehouses.filter((id) => !categoryWarehouseIds.includes(id));
      onSelectionChange(newSelected);
    } else {
      // 全选
      const newSelected = [...new Set([...selectedWarehouses, ...categoryWarehouseIds])];
      onSelectionChange(newSelected);
    }
  };

  // 全选/取消全选所有
  const toggleSelectAll = () => {
    if (selectedWarehouses.length === warehouses.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(warehouses.map((w) => w.id));
    }
  };

  return (
    <div className="space-y-2">
      {/* 全选按钮 */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <span className="text-xs text-gray-600">
          已选 {selectedWarehouses.length}/{warehouses.length}
        </span>
        <button
          onClick={toggleSelectAll}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {selectedWarehouses.length === warehouses.length ? '取消全选' : '全选'}
        </button>
      </div>

      {/* 分类列表 */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {categoryOrder.map((category) => {
          const categoryWarehouses = warehousesByCategory[category] || [];
          if (categoryWarehouses.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const categoryWarehouseIds = categoryWarehouses.map((w) => w.id);
          const selectedCount = categoryWarehouseIds.filter((id) =>
            selectedWarehouses.includes(id)
          ).length;
          const allSelected = categoryWarehouseIds.every((id) => selectedWarehouses.includes(id));
          const someSelected = selectedCount > 0 && !allSelected;

          return (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* 分类头部 */}
              <div className="bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center gap-2 flex-1 text-left group"
                  >
                    <span className="text-sm">{categoryIcons[category]}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {category}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({selectedCount}/{categoryWarehouses.length})
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleCategoryAll(category)}
                    className="ml-2 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  >
                    {allSelected ? '取消' : '全选'}
                  </button>
                </div>
              </div>

              {/* 分类仓库列表 */}
              {isExpanded && (
                <div className="p-2 bg-white space-y-1">
                  {categoryWarehouses.map((warehouse) => (
                    <label
                      key={warehouse.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWarehouses.includes(warehouse.id)}
                        onChange={() => toggleWarehouse(warehouse.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                        {warehouse.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

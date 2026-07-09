import { useState } from 'react';
import { Search } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
}

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
  selectedWarehouses: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function WarehouseSelector({ warehouses, selectedWarehouses, onSelectionChange }: WarehouseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤仓库
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 切换单个仓库选择
  const toggleWarehouse = (warehouseId: string) => {
    let newSelection: string[];
    if (selectedWarehouses.includes(warehouseId)) {
      // 取消选择
      newSelection = selectedWarehouses.filter(id => id !== warehouseId);
    } else {
      // 添加选择
      newSelection = [...selectedWarehouses, warehouseId];
    }
    onSelectionChange(newSelection);
  };

  // 全选
  const selectAll = () => {
    onSelectionChange(warehouses.map(w => w.id));
  };

  // 取消全选
  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 搜索框 */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索仓库..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* 仓库列表 */}
      <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
        {filteredWarehouses.length > 0 ? (
          <div className="p-2">
            {filteredWarehouses.map((warehouse) => (
              <label
                key={warehouse.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedWarehouses.includes(warehouse.id)}
                  onChange={() => toggleWarehouse(warehouse.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">{warehouse.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            未找到匹配的仓库
          </div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2">
        <button
          onClick={selectAll}
          className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          全选
        </button>
        <button
          onClick={() => {
            clearAll();
            setSearchTerm('');
          }}
          className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
        >
          重置
        </button>
      </div>

      {/* 底部统计 */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 text-center">
          已选 <span className="font-medium text-blue-600">{selectedWarehouses.length}</span> / {warehouses.length} 个仓库
        </div>
      </div>
    </div>
  );
}
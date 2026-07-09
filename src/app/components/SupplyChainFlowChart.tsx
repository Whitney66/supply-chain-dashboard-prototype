import React from 'react';
import { ArrowRight, Package, Warehouse, Store, User, Truck, CheckCircle } from 'lucide-react';

interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  color: string;
  metrics?: number;
}

interface FlowSection {
  title: string;
  color: string;
  nodes: FlowNode[];
}

export function SupplyChainFlowChart() {
  const orderSection: FlowSection = {
    title: '订货段',
    color: 'blue',
    nodes: [
      { id: 'supplier', label: '供应商', sublabel: '下单', icon: <Package className="w-5 h-5" />, color: 'blue', metrics: 0 },
      { id: 'customs1', label: '一线通关', sublabel: '报关放行', icon: <CheckCircle className="w-5 h-5" />, color: 'blue', metrics: 1 },
      { id: 'transport1', label: '提货运输', sublabel: '至海综保', icon: <Truck className="w-5 h-5" />, color: 'blue', metrics: 1 },
      { id: 'warehouse-in', label: '一盘货仓库', sublabel: '入库', icon: <Warehouse className="w-5 h-5" />, color: 'blue', metrics: 2 },
    ]
  };

  const distributionSection: FlowSection = {
    title: '分货段',
    color: 'green',
    nodes: [
      { id: 'warehouse-out', label: '仓库出库', sublabel: '备货发运', icon: <Warehouse className="w-5 h-5" />, color: 'green', metrics: 1 },
      { id: 'customs2', label: '二线通关', sublabel: '清关放行', icon: <CheckCircle className="w-5 h-5" />, color: 'green', metrics: 1 },
      { id: 'store-pickup', label: '门店提货', sublabel: '至监管仓', icon: <Truck className="w-5 h-5" />, color: 'green', metrics: 1 },
      { id: 'store-shelf', label: '门店上架', sublabel: '准备销售', icon: <Store className="w-5 h-5" />, color: 'green', metrics: 1 },
    ]
  };

  const storeSection: FlowSection = {
    title: '门店段',
    color: 'purple',
    nodes: [
      { id: 'monitor-storage', label: '监管仓', sublabel: '商品存储', icon: <Warehouse className="w-5 h-5" />, color: 'purple', metrics: 1 },
      { id: 'transfer-storage', label: '周转仓', sublabel: '内部调拨', icon: <Warehouse className="w-5 h-5" />, color: 'purple', metrics: 1 },
      { id: 'sales-floor', label: '卖场', sublabel: '陈列销售', icon: <Store className="w-5 h-5" />, color: 'purple', metrics: 1 },
      { id: 'sorting', label: '分拣仓', sublabel: '订单分拣', icon: <Package className="w-5 h-5" />, color: 'purple', metrics: 1 },
      { id: 'customer', label: '顾客收货', sublabel: '完成交付', icon: <User className="w-5 h-5" />, color: 'purple', metrics: 7 },
    ]
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, {
      border: string;
      text: string;
      textDark: string;
      bg: string;
      arrow: string;
    }> = {
      blue: {
        border: 'border-blue-400',
        text: 'text-blue-600',
        textDark: 'text-blue-900',
        bg: 'bg-blue-500',
        arrow: 'text-blue-400'
      },
      green: {
        border: 'border-green-400',
        text: 'text-green-600',
        textDark: 'text-green-900',
        bg: 'bg-green-500',
        arrow: 'text-green-400'
      },
      purple: {
        border: 'border-purple-400',
        text: 'text-purple-600',
        textDark: 'text-purple-900',
        bg: 'bg-purple-500',
        arrow: 'text-purple-400'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const renderFlowNode = (node: FlowNode, isLast: boolean = false) => {
    const colors = getColorClasses(node.color);
    
    return (
      <div key={node.id} className="flex items-center">
        <div className={`relative bg-white border-2 ${colors.border} rounded-lg p-3 min-w-[140px] hover:shadow-lg transition-all group`}>
          <div className="flex flex-col items-center gap-2">
            <div className={colors.text}>
              {node.icon}
            </div>
            <div className="text-center">
              <div className={`text-sm font-semibold ${colors.textDark}`}>{node.label}</div>
              {node.sublabel && (
                <div className="text-xs text-gray-500 mt-1">{node.sublabel}</div>
              )}
            </div>
            {node.metrics !== undefined && node.metrics > 0 && (
              <div className={`absolute -top-2 -right-2 ${colors.bg} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold`}>
                {node.metrics}
              </div>
            )}
          </div>
        </div>
        {!isLast && (
          <ArrowRight className={`w-6 h-6 mx-2 ${colors.arrow} flex-shrink-0`} />
        )}
      </div>
    );
  };

  const renderDirectFlow = () => (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-300 border-dashed rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs font-semibold text-blue-700">直发门店链路（特殊场景）</div>
      </div>
      <div className="flex items-center overflow-x-auto">
        <div className="relative bg-white border-2 border-blue-400 rounded-lg p-2 min-w-[120px]">
          <div className="flex flex-col items-center gap-1">
            <Package className="w-4 h-4 text-blue-600" />
            <div className="text-xs font-semibold text-blue-900 text-center">供应商</div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 mx-1 text-blue-400" />
        <div className="relative bg-white border-2 border-blue-400 rounded-lg p-2 min-w-[120px]">
          <div className="flex flex-col items-center gap-1">
            <Store className="w-4 h-4 text-blue-600" />
            <div className="text-xs font-semibold text-blue-900 text-center">门店监管仓</div>
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">1</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStoreSubFlows = () => (
    <div className="mt-4 space-y-3">
      <div className="text-xs font-semibold text-purple-700 mb-2">门店段包含多条子链路：</div>
      
      {/* 常规销售链路 */}
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="text-xs font-medium text-purple-800 mb-2">① 常规销售链路</div>
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <span className="px-2 py-1 bg-white border border-purple-300 rounded">监管仓</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
          <span className="px-2 py-1 bg-white border border-purple-300 rounded">周转仓</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
          <span className="px-2 py-1 bg-white border border-purple-300 rounded">卖场</span>
          <ArrowRight className="w-4 h-4 text-purple-400" />
          <span className="px-2 py-1 bg-white border border-purple-300 rounded">分拣仓</span>
          <span className="ml-2 text-purple-600 font-semibold">(4个指标)</span>
        </div>
      </div>

      {/* 配送链路 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-xs font-medium text-purple-800 mb-2">② 邮寄配送</div>
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">分拣仓</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">邮寄</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">顾客</span>
            <span className="ml-1 text-purple-600 font-semibold">(1)</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-xs font-medium text-purple-800 mb-2">③ 提货点配送</div>
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">分拣仓</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">提货点</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">顾客</span>
            <span className="ml-1 text-purple-600 font-semibold">(2)</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-xs font-medium text-purple-800 mb-2">④ 预定商品邮寄</div>
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">预定仓</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">邮寄</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">顾客</span>
            <span className="ml-1 text-purple-600 font-semibold">(1)</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-xs font-medium text-purple-800 mb-2">⑤ 预定商品提货</div>
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">预定仓</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">提货点</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">顾客</span>
            <span className="ml-1 text-purple-600 font-semibold">(1)</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-xs font-medium text-purple-800 mb-2">⑥ 预定仓调拨</div>
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">监管/周转仓</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 bg-white border border-purple-300 rounded">预定仓</span>
            <span className="ml-1 text-purple-600 font-semibold">(1)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 订��段 */}
      <div className="bg-white rounded-lg p-5 border-2 border-blue-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-blue-600 rounded"></div>
          <h4 className="font-bold text-blue-900 text-base">订货段</h4>
          <span className="text-xs text-gray-500">（货品从下单到入一盘货仓库）</span>
          <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">4个指标</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-max">
            {orderSection.nodes.map((node, index) => 
              renderFlowNode(node, index === orderSection.nodes.length - 1)
            )}
          </div>
        </div>
        {renderDirectFlow()}
      </div>

      {/* 分货段 */}
      <div className="bg-white rounded-lg p-5 border-2 border-green-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-green-600 rounded"></div>
          <h4 className="font-bold text-green-900 text-base">分货段</h4>
          <span className="text-xs text-gray-500">（货品从一盘货仓库分配到门店监管仓）</span>
          <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">4个指标</span>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-max">
            {distributionSection.nodes.map((node, index) => 
              renderFlowNode(node, index === distributionSection.nodes.length - 1)
            )}
          </div>
        </div>
      </div>

      {/* 门店段 */}
      <div className="bg-white rounded-lg p-5 border-2 border-purple-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-purple-600 rounded"></div>
          <h4 className="font-bold text-purple-900 text-base">门店段</h4>
          <span className="text-xs text-gray-500">（货品从门店监管仓到达顾客手中）</span>
          <span className="ml-auto text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">9个指标</span>
        </div>
        {renderStoreSubFlows()}
      </div>

      {/* 图例说明 */}
      <div className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-lg p-4 border border-gray-300">
        <div className="flex items-start gap-2 text-xs">
          <div className="text-gray-700 font-semibold flex-shrink-0">💡 说明：</div>
          <div className="text-gray-700 space-y-1">
            <p><strong>订货段</strong>：商品从供应商采购到入库中央仓库/门店监管仓，涉及通关、运输、入库等环节。</p>
            <p><strong>分货段</strong>：商品从中央仓库向各门店分配调拨，经过出库、通关、门店提货上架。</p>
            <p><strong>门店段</strong>：门店内部仓储调拨及最后一公里配送，包含多种配送方式（邮寄、提货点、预定商品等）。</p>
            <p className="mt-2 text-gray-600"><strong>数字标记</strong>代表该环节涉及的时效指标数量，各环节均设有明确的时效标准和达标率监控。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
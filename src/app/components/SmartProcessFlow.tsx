import React from 'react';
import { ProcessFlowSVG } from './ProcessFlowSVG';

interface SmartProcessFlowProps {
  flowId: string;
  alt: string;
  className?: string;
}

// 根据流程ID返回对应的流程步骤
function getFlowSteps(flowId: string): string[] {
  const flowMap: Record<string, string[]> = {
    // 订货链路
    'flow_1_1_1': ['供应商', '国际物流', '监管仓', '完成入库'],
    'flow_1_2_1': ['供应商', '国际物流', '周转仓', '门店直发'],
    
    // 分货链路
    'flow_2_1_1': ['监管仓', '分货处理', '周转仓', '配送门店'],
    
    // 调拨链路
    'flow_3_1_1': ['监管仓', '申请调拨', '周转仓'],
    'flow_3_2_1': ['周转仓', '出库处理', '卖场上架'],
    'flow_3_3_1': ['卖场', '调拨申请', '分拣仓'],
    'flow_3_4_1': ['分拣仓', '打包邮寄', '顾客签收'],
    'flow_3_5_1': ['分拣仓', '配送运输', '提货点'],
    'flow_3_6_1': ['监管仓', '预定处理', '预定仓'],
    'flow_3_7_1': ['预定仓', '打包邮寄', '顾客签收'],
    'flow_3_8_1': ['预定仓', '物流配送', '顾客签收'],
  };

  return flowMap[flowId] || ['开始', '处理中', '完成'];
}

export function SmartProcessFlow({ flowId, alt, className = '' }: SmartProcessFlowProps) {
  const steps = getFlowSteps(flowId);

  return (
    <div className={`w-full flex flex-col items-center justify-center bg-gradient-to-r from-gray-50 to-blue-50 rounded p-2 border border-gray-200 ${className}`}>
      <ProcessFlowSVG steps={steps} />
      <div className="text-[10px] text-gray-500 mt-1 text-center">
        {alt}
      </div>
    </div>
  );
}

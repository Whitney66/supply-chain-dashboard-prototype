import { useState } from 'react';
import { Calendar, Package, FileText } from 'lucide-react';
import { UnifiedInventoryMetrics } from './UnifiedInventoryMetrics';

type Dimension = 'tickets' | 'pieces';
type TimeDimension = 'monthly' | 'weekly';

interface UnifiedInventoryModuleProps {
  selectedCategories: string[];
  businessSegment?: 'all' | 'ordering' | 'distribution' | 'store' | 'other';
  indicatorType?: 'all' | 'timeliness' | 'quality' | 'efficiency' | 'cost' | 'planning';
}

export function UnifiedInventoryModule({ selectedCategories, businessSegment = 'all', indicatorType = 'all' }: UnifiedInventoryModuleProps) {
  const [dimension, setDimension] = useState<'tickets' | 'pieces'>('tickets');
  const [timeDimension, setTimeDimension] = useState<'monthly' | 'weekly'>('monthly');

  return (
    <div className="space-y-4">
      {/* 一盘货时效 & 仓-店路径时效 */}
      <UnifiedInventoryMetrics 
        dimension={dimension} 
        timeDimension={timeDimension}
        setDimension={setDimension}
        setTimeDimension={setTimeDimension}
        selectedCategories={selectedCategories}
        businessSegment={businessSegment}
        indicatorType={indicatorType}
      />
    </div>
  );
}
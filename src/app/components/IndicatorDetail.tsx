import { useState } from 'react';
import { MetricTree } from '@/app/components/MetricTree';
import { MetricDetailTable } from '@/app/components/MetricDetailTable';
import { UnifiedInventoryModule } from '@/app/components/UnifiedInventoryModule';
import type { FilterState } from '../types';

interface IndicatorDetailProps {
  filters: FilterState;
  businessSegment?: 'all' | 'ordering' | 'distribution' | 'store' | 'other';
  indicatorType?: 'all' | 'timeliness' | 'quality' | 'efficiency' | 'cost' | 'planning';
}

type Dimension = 'tickets' | 'pieces';
type TimeDimension = 'monthly' | 'weekly';

export function IndicatorDetail({ filters, businessSegment = 'all', indicatorType = 'all' }: IndicatorDetailProps) {
  return (
    <UnifiedInventoryModule 
      selectedCategories={filters.selectedCategories} 
      businessSegment={businessSegment}
      indicatorType={indicatorType}
    />
  );
}
import type { CategoryType } from '../types';

interface CategoryTabsProps {
  selected: CategoryType;
  onChange: (category: CategoryType) => void;
}

export function CategoryTabs({ selected, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 border-b border-gray-200">
      <button
        onClick={() => onChange('overview')}
        className={`px-6 py-3 -mb-px transition-colors ${
          selected === 'overview'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        指标概览
      </button>
      <button
        onClick={() => onChange('detail')}
        className={`px-6 py-3 -mb-px transition-colors ${
          selected === 'detail'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        指标明细
      </button>
    </div>
  );
}
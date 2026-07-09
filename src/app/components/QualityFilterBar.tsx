import { Check } from 'lucide-react';

export type QualityFilterKey = 'transfer' | 'delivery' | 'complaint' | 'accuracy';

export interface QualityFilterOption {
  key: QualityFilterKey;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  activeTextColor: string;
}

export const QUALITY_FILTER_OPTIONS: QualityFilterOption[] = [
  {
    key: 'transfer',
    label: '调拨满足率',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    dotColor: 'bg-orange-400',
    activeTextColor: 'text-orange-700',
  },
  {
    key: 'delivery',
    label: '快递交付',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    dotColor: 'bg-green-400',
    activeTextColor: 'text-green-700',
  },
  {
    key: 'complaint',
    label: '客诉情况',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    dotColor: 'bg-purple-400',
    activeTextColor: 'text-purple-700',
  },
  {
    key: 'accuracy',
    label: '准确率盘点情况',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-400',
    activeTextColor: 'text-blue-700',
  },
];

interface QualityFilterBarProps {
  selected: QualityFilterKey[];
  onChange: (selected: QualityFilterKey[]) => void;
}

export function QualityFilterBar({ selected, onChange }: QualityFilterBarProps) {
  const toggle = (key: QualityFilterKey) => {
    // 单选模式：点击任何选项就只显示该选项
    onChange([key]);
  };

  return (
    <div className="flex items-center justify-end gap-3 mb-6 flex-wrap">
      {QUALITY_FILTER_OPTIONS.map((opt) => {
        const isSelected = selected.includes(opt.key);
        return (
          <button
            key={opt.key}
            onClick={() => toggle(opt.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
              isSelected
                ? `${opt.bgColor} ${opt.color} ${opt.borderColor} shadow-md scale-105`
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            {isSelected ? (
              <span className={`w-2 h-2 rounded-full ${opt.dotColor} animate-pulse`}></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            )}
            <span className="font-bold">{opt.label}</span>
            {isSelected && (
              <Check className="w-4 h-4 ml-0.5" strokeWidth={3} />
            )}
          </button>
        );
      })}
    </div>
  );
}
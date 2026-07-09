import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { metricTree, type MetricTreeNode } from '../data/detailTableData';

interface MetricTreeProps {
  onMetricSelect: (metricId: string) => void;
  selectedMetricId?: string;
}

export function MetricTree({ onMetricSelect, selectedMetricId }: MetricTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['timeliness']));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: MetricTreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedMetricId === node.metricId;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
            isSelected
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else if (node.metricId) {
              onMetricSelect(node.metricId);
            }
          }}
        >
          {hasChildren && (
            <span className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          <span className="text-sm">{node.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full overflow-y-auto">
      <h3 className="text-lg mb-4 px-3">指标分类</h3>
      <div className="space-y-1">
        {metricTree.map((node) => renderNode(node))}
      </div>
    </div>
  );
}

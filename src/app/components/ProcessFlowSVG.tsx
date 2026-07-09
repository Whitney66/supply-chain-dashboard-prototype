import React from 'react';

interface ProcessFlowSVGProps {
  steps: string[];
  className?: string;
}

export function ProcessFlowSVG({ steps, className = '' }: ProcessFlowSVGProps) {
  const stepCount = steps.length;
  const nodeWidth = 80;
  const nodeHeight = 30;
  const gap = 15;
  const totalWidth = stepCount * nodeWidth + (stepCount - 1) * gap;
  const svgHeight = 50;
  const startY = (svgHeight - nodeHeight) / 2;

  return (
    <svg 
      width={totalWidth} 
      height={svgHeight} 
      viewBox={`0 0 ${totalWidth} ${svgHeight}`}
      className={`max-w-full h-auto ${className}`}
      style={{ minWidth: '200px' }}
    >
      {steps.map((step, index) => {
        const x = index * (nodeWidth + gap);
        const isFirst = index === 0;
        const isLast = index === stepCount - 1;

        return (
          <g key={index}>
            {/* 连接线 */}
            {index > 0 && (
              <>
                <line
                  x1={x - gap}
                  y1={startY + nodeHeight / 2}
                  x2={x}
                  y2={startY + nodeHeight / 2}
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <polygon
                  points={`${x},${startY + nodeHeight / 2} ${x - 5},${startY + nodeHeight / 2 - 3} ${x - 5},${startY + nodeHeight / 2 + 3}`}
                  fill="#94a3b8"
                />
              </>
            )}

            {/* 节点矩形 */}
            <rect
              x={x}
              y={startY}
              width={nodeWidth}
              height={nodeHeight}
              rx="4"
              fill={isFirst ? '#dbeafe' : isLast ? '#dcfce7' : '#f1f5f9'}
              stroke={isFirst ? '#3b82f6' : isLast ? '#22c55e' : '#94a3b8'}
              strokeWidth="1.5"
            />

            {/* 节点文字 */}
            <text
              x={x + nodeWidth / 2}
              y={startY + nodeHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isFirst ? '#1e40af' : isLast ? '#15803d' : '#475569'}
              fontSize="10"
              fontWeight="500"
            >
              {step.length > 8 ? step.substring(0, 7) + '...' : step}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

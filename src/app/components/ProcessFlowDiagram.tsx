import React from 'react';
import { GitBranch } from 'lucide-react';

interface ProcessFlowDiagramProps {
  imageSrc: string;
  alt: string;
  className?: string;
}

export function ProcessFlowDiagram({ imageSrc, alt, className = '' }: ProcessFlowDiagramProps) {
  // 如果没有图片源或为空字符串，只显示占位符
  if (!imageSrc || imageSrc.trim() === '') {
    return (
      <div className={`w-full flex flex-col items-center justify-center bg-gray-50 rounded p-3 border border-dashed border-gray-300 min-h-[60px] ${className}`}>
        <GitBranch className="w-6 h-6 text-gray-400 mb-1" />
        <span className="text-xs text-gray-500 text-center line-clamp-2">{alt}</span>
      </div>
    );
  }

  // 只有在有有效图片源时才渲染img
  return (
    <div className={`w-full flex items-center justify-center bg-gray-50 rounded p-1 ${className}`}>
      <img 
        src={imageSrc} 
        alt={alt}
        className="max-w-full h-auto object-contain"
        style={{ maxHeight: '60px' }}
        onError={(e) => {
          // 图片加载失败时的处理
          const target = e.currentTarget;
          if (target && target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="flex flex-col items-center justify-center p-3 w-full">
                <svg class="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-xs text-gray-500 text-center">${alt}</span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}

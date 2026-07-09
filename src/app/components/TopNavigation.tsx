import { User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/d3b42e3873be8e0006aaf7c871651435294522e7.png';

export function TopNavigation() {
  return (
    <header className="h-[56px] bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={logoImage}
            alt="供应链数据看板LOGO"
            className="h-8 w-auto object-contain"
          />
          <h1 className="text-xl font-semibold text-gray-900">供应链数据看板</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-900">管理员</div>
            <div className="text-xs text-gray-500">供应链部</div>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
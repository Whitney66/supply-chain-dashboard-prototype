import { Search, Bell, Settings, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeaderProps {
  onConfigClick: () => void;
}

export function Header({ onConfigClick }: HeaderProps) {
  const navItems = [
    '系统管理',
    '经营看板',
    '销售分析',
    '进销存分析',
    '库存分析',
    '顾客分析',
    '采购分析',
    '提货分析',
    '风险管控',
    '离线分析',
    '自定义分析',
    '数据填报',
  ];

  return (
    <header className="bg-blue-600 text-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1638272693588-f1e8c6a27f54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHN0YXIlMjBsb2dvfGVufDF8fHx8MTc2NzQ5MzQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="大数据平台"
                className="w-full h-full object-cover"
              />
            </div>
            <span>大数据平台</span>
          </div>
          
          <nav className="flex gap-6 ml-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${
                  index === 1 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索..."
              className="bg-white/20 text-white placeholder-white/60 px-4 py-1 rounded-full w-64 focus:outline-none focus:bg-white/30"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
          
          <button className="p-2 hover:bg-blue-500 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={onConfigClick}
            className="p-2 hover:bg-blue-500 rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-lg">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1729824186570-4d4aede00043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHVzZXIlMjBhdmF0YXJ8ZW58MXx8fHwxNzY3NDkzNDY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="用户头像"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm">管理员</span>
          </button>
        </div>
      </div>
    </header>
  );
}
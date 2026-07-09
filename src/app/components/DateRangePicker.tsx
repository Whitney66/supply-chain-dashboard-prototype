import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export function DateRangePicker({ onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  
  // 获取昨天的日期
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };
  
  const [startDate, setStartDate] = useState<Date | null>(getYesterday());
  const [endDate, setEndDate] = useState<Date | null>(getYesterday());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化时触发一次日期范围变化
  useEffect(() => {
    const yesterday = getYesterday();
    onDateRangeChange(yesterday, yesterday);
  }, []);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 获取某月的天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取某月第一天是星期几
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 生成日历数据
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];

    // 填充前面的空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    
    if (!startDate || (startDate && endDate)) {
      // 开始新的选择
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      // 选择结束日期
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  // 确认选择
  const handleConfirm = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
      setIsOpen(false);
    }
  };

  // 判断日期是否在范围内
  const isDateInRange = (day: number) => {
    if (!startDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    
    if (endDate) {
      return date >= startDate && date <= endDate;
    } else if (hoverDate && hoverDate > startDate) {
      return date >= startDate && date <= hoverDate;
    }
    
    return false;
  };

  // 判断是否为起始或结束日期
  const isStartOrEndDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return (startDate && date.getTime() === startDate.getTime()) ||
           (endDate && date.getTime() === endDate.getTime());
  };

  // 格式化日期显示
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-0 py-0 bg-white border-none w-full flex-nowrap"
      >
        <div className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
          <span className="text-sm text-gray-700">
            {startDate ? formatDate(startDate) : (() => {
              const today = new Date();
              const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
              return formatDate(oneYearAgo);
            })()}
          </span>
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
        <span className="text-gray-400">-</span>
        <RotateCcw className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" />
        <div className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
          <span className="text-sm text-gray-700">
            {endDate ? formatDate(endDate) : formatDate(new Date())}
          </span>
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-full min-w-[280px]">
          {/* 年月选择 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
              
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => i).map(month => (
                  <option key={month} value={month}>{month + 1}月</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calendarDays.map((day, index) => (
              <div key={index}>
                {day === null ? (
                  <div className="aspect-square" />
                ) : (
                  <button
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoverDate(new Date(currentYear, currentMonth, day))}
                    onMouseLeave={() => setHoverDate(null)}
                    className={`
                      aspect-square w-full text-sm rounded transition-colors
                      ${isStartOrEndDate(day)
                        ? 'bg-blue-600 text-white font-medium'
                        : isDateInRange(day)
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 底部按钮 */}
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setHoverDate(null);
              }}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              清空
            </button>
            <button
              onClick={handleConfirm}
              disabled={!startDate || !endDate}
              className={`
                flex-1 px-3 py-2 text-sm rounded-lg transition-colors
                ${startDate && endDate
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
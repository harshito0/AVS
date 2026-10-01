import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarDays
} from 'lucide-react';

export interface DatePickerProps {
  currentRange?: string;
  startDate?: string;
  endDate?: string;
  onChange?: (range: string, startDate?: string, endDate?: string) => void;
  className?: string;
}

interface PresetOption {
  label: string;
  getRange: () => { range: string; startDate?: string; endDate?: string };
}

export const DatePicker: React.FC<DatePickerProps> = ({
  currentRange = 'All Time',
  startDate: initialStart,
  endDate: initialEnd,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(currentRange);
  const [customStart, setCustomStart] = useState<string>(initialStart || '');
  const [customEnd, setCustomEnd] = useState<string>(initialEnd || '');
  const [activeTab, setActiveTab] = useState<'presets' | 'calendar'>('presets');

  // Interactive Calendar view month
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (initialStart) {
      const d = new Date(initialStart);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRange) {
      setSelectedLabel(currentRange);
    }
  }, [currentRange]);

  const presets: PresetOption[] = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const formatShort = (d: Date) => d.toISOString().split('T')[0];

    const dYesterday = new Date(today);
    dYesterday.setDate(dYesterday.getDate() - 1);
    const yesterdayStr = formatShort(dYesterday);

    const d7 = new Date(today);
    d7.setDate(d7.getDate() - 7);

    const d30 = new Date(today);
    d30.setDate(d30.getDate() - 30);

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const firstDayThisMonth = new Date(currentYear, currentMonth, 1);
    const lastDayThisMonth = new Date(currentYear, currentMonth + 1, 0);

    return [
      {
        label: 'All Time',
        getRange: () => ({ range: 'All Time', startDate: undefined, endDate: undefined })
      },
      {
        label: 'This Month',
        getRange: () => ({
          range: `This Month (${firstDayThisMonth.toLocaleString('en-US', { month: 'short' })} ${currentYear})`,
          startDate: formatShort(firstDayThisMonth),
          endDate: formatShort(lastDayThisMonth)
        })
      },
      {
        label: 'September 2026',
        getRange: () => ({
          range: 'September 2026',
          startDate: '2026-09-01',
          endDate: '2026-09-30'
        })
      },
      {
        label: 'Last 30 Days',
        getRange: () => ({
          range: 'Last 30 Days',
          startDate: formatShort(d30),
          endDate: todayStr
        })
      },
      {
        label: 'Last 7 Days',
        getRange: () => ({
          range: 'Last 7 Days',
          startDate: formatShort(d7),
          endDate: todayStr
        })
      },
      {
        label: 'Today',
        getRange: () => ({
          range: 'Today',
          startDate: todayStr,
          endDate: todayStr
        })
      },
      {
        label: 'Yesterday',
        getRange: () => ({
          range: 'Yesterday',
          startDate: yesterdayStr,
          endDate: yesterdayStr
        })
      }
    ];
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleSelectPreset = (p: PresetOption) => {
    const res = p.getRange();
    setSelectedLabel(res.range);
    setCustomStart(res.startDate || '');
    setCustomEnd(res.endDate || '');
    if (onChange) onChange(res.range, res.startDate, res.endDate);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!customStart && !customEnd) {
      handleSelectPreset(presets[0]); // All time
      return;
    }
    const start = customStart || customEnd;
    const end = customEnd || customStart;
    const sortedStart = start <= end ? start : end;
    const sortedEnd = start <= end ? end : start;

    const label = `${sortedStart} to ${sortedEnd}`;
    setSelectedLabel(label);
    if (onChange) onChange(label, sortedStart, sortedEnd);
    setIsOpen(false);
  };

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDateCellClick = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (!customStart || (customStart && customEnd)) {
      setCustomStart(dStr);
      setCustomEnd('');
    } else if (customStart && !customEnd) {
      if (dStr < customStart) {
        setCustomEnd(customStart);
        setCustomStart(dStr);
      } else {
        setCustomEnd(dStr);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D9E2DC] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        title="Change Filter Date Range"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-forest-850" />
        <span className="max-w-[170px] truncate">{selectedLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-[330px] sm:w-[360px] rounded-2xl bg-white p-3.5 shadow-xl border border-[#E3EAE5] z-50 animate-scaleUp">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-forest-850" /> Filter Date Range
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'presets' ? 'bg-white text-forest-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Presets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'calendar' ? 'bg-white text-forest-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          {/* Tab 1: Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-1">
              {presets.map((p) => {
                const isSelected = selectedLabel === p.label || selectedLabel.startsWith(p.label);
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-forest-50 text-forest-900 font-bold border border-forest-100'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{p.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-forest-850 shrink-0" />}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('calendar')}
                  className="w-full text-center text-xs font-semibold text-forest-850 hover:underline py-1 cursor-pointer"
                >
                  Pick Custom Date Range →
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Calendar & Date Inputs */}
          {activeTab === 'calendar' && (
            <div className="space-y-3">
              {/* Manual Date Input Fields */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-forest-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-forest-800"
                  />
                </div>
              </div>

              {/* Month Navigator */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800">{monthName}</span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} className="py-1">
                    {d}
                  </span>
                ))}

                {/* Empty cells before 1st of month */}
                {[...Array(firstDayIndex)].map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Days of month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isStart = customStart === dateStr;
                  const isEnd = customEnd === dateStr;
                  const isInRange =
                    customStart && customEnd && dateStr > customStart && dateStr < customEnd;

                  let cellClass =
                    'w-7 h-7 mx-auto rounded-lg text-xs font-medium flex items-center justify-center cursor-pointer transition-colors ';
                  if (isStart || isEnd) {
                    cellClass += 'bg-forest-850 text-white font-bold shadow-xs';
                  } else if (isInRange) {
                    cellClass += 'bg-forest-100/70 text-forest-900 font-semibold';
                  } else {
                    cellClass += 'hover:bg-slate-100 text-slate-700';
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateCellClick(day)}
                      className={cellClass}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCustomStart('');
                    setCustomEnd('');
                    handleSelectPreset(presets[0]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    className="px-3 py-1 bg-forest-850 hover:bg-forest-900 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;

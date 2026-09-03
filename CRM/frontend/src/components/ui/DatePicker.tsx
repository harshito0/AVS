import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';

export interface DatePickerProps {
  currentRange?: string;
  onChange?: (range: string) => void;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  currentRange = 'May 1 – May 31, 2025',
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentRange);
  const ref = useRef<HTMLDivElement>(null);

  const presets = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'This Month (May 1 – May 31, 2025)',
    'Last Month (Apr 1 – Apr 30, 2025)',
    'Q1 2025 (Jan – Mar)',
    'Year to Date (2025)'
  ];

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleSelect = (preset: string) => {
    setSelected(preset);
    if (onChange) onChange(preset);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D9E2DC] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-forest-850" />
        <span>{selected}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white p-1.5 shadow-lg border border-[#E3EAE5] z-40 animate-scaleUp">
          <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Filter Date Range
          </p>
          <div className="space-y-0.5">
            {presets.map((p) => {
              const isSelected = selected === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelect(p)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected ? 'bg-forest-50 text-forest-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{p}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-forest-850 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

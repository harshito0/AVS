import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { Location } from '../../types';

export interface LocationSelectorProps {
  currentLocation: Location;
  onChange: (location: Location) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const locations: { label: Location; sub: string }[] = [
    { label: 'All Locations', sub: 'Brampton & Mississauga' },
    { label: 'Brampton', sub: 'Queen St Rejuvenation Hub' },
    { label: 'Mississauga', sub: 'City Centre Wellness Suites' }
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

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D9E2DC] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
      >
        <MapPin className="w-3.5 h-3.5 text-forest-850" />
        <span>{currentLocation}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white p-1.5 shadow-lg border border-[#E3EAE5] z-40 animate-scaleUp">
          <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Active Centre
          </p>
          {locations.map((loc) => {
            const isSelected = currentLocation === loc.label;
            return (
              <button
                key={loc.label}
                type="button"
                onClick={() => {
                  onChange(loc.label);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-forest-50 text-forest-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <p className="text-xs">{loc.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{loc.sub}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-forest-850 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { LocationPerformanceItem } from '../../types';
import { DashboardEmptyState } from './DashboardEmptyState';

interface LocationPerformanceProps {
  locations?: LocationPerformanceItem[];
}

export const LocationPerformance: React.FC<LocationPerformanceProps> = ({ locations = [] }) => {
  const hasLocations = locations.length > 0;

  return (
    <div className="crm-card p-5 sm:p-6 bg-white border border-[#E5ECE7] rounded-xl flex flex-col justify-between h-[390px]">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
            <span className="truncate">Location Performance</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
            {locations.length} Locations
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1 sm:line-clamp-none">
          Comparative sales and treatment volume across Ontario facilities
        </p>
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto py-2.5 space-y-3 pr-1">
        {hasLocations ? (
          locations.map((loc) => (
            <div
              key={loc.id}
              className="p-3 rounded-xl border border-slate-100 bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors space-y-2"
            >
              {/* Location Name and Metric Overview */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {loc.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-slate-900 block leading-none">
                    ${loc.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Sub-row: Appointments Count */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {loc.appointments} {loc.appointments === 1 ? 'appointment' : 'appointments'}
                </span>
                <span className="text-[11px] font-semibold text-forest-800">
                  {loc.percentage}% volume
                </span>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-forest-800 to-emerald-600 transition-all duration-500"
                  style={{ width: `${Math.max(loc.percentage, 4)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <DashboardEmptyState
            title="No Location Data"
            description="Locations configured in the database will display their performance here."
            icon={MapPin}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 gap-2">
        <span className="truncate">Settled clinic invoices</span>
        <span className="font-semibold text-slate-600 shrink-0">Facility Analytics</span>
      </div>
    </div>
  );
};

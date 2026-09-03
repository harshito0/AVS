import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { TopServiceItem } from '../../types';
import { DashboardEmptyState } from './DashboardEmptyState';
import { useNavigate } from 'react-router-dom';

interface TopServicesProps {
  services?: TopServiceItem[];
}

export const TopServices: React.FC<TopServicesProps> = ({ services = [] }) => {
  const navigate = useNavigate();
  const hasServices = services.length > 0;

  return (
    <div className="crm-card p-6 bg-white border border-[#E5ECE7] rounded-xl flex flex-col justify-between h-[380px]">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            Top Services
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Highest performing treatments by client demand & revenue
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/services')}
          className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 hover:underline cursor-pointer"
        >
          Catalog
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-2.5 my-auto">
        {hasServices ? (
          services.map((svc, idx) => (
            <div
              key={`${svc.name}-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
            >
              {/* Left: Rank, Icon, Name */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-center text-xs font-bold text-slate-400">
                  #{idx + 1}
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#FAF5EC] border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] shrink-0 font-serif font-bold text-xs">
                  {svc.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {svc.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {svc.category}
                  </p>
                </div>
              </div>

              {/* Right: Bookings & Sales */}
              <div className="text-right shrink-0 pl-2">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  ${svc.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {svc.bookings} {svc.bookings === 1 ? 'booking' : 'bookings'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <DashboardEmptyState
            title="No Services Booked"
            description="Top services will be ranked dynamically as appointments and invoices are recorded."
            icon={Sparkles}
          />
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Ranked by frequency & settled invoice items</span>
        <span className="font-semibold text-slate-600">{services.length} items</span>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RecentAppointmentItem } from '../../types';
import { DashboardEmptyState } from './DashboardEmptyState';

interface RecentAppointmentsProps {
  appointments?: RecentAppointmentItem[];
}

export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments = [] }) => {
  const navigate = useNavigate();
  const hasAppointments = appointments.length > 0;

  return (
    <div className="crm-card p-6 bg-white border border-[#E5ECE7] rounded-xl flex flex-col justify-between h-[380px]">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C9A227]" />
            Recent Appointments
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest treatment bookings and check-in statuses
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/appointments')}
          className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 hover:underline cursor-pointer"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Appointments List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-2.5 my-auto">
        {hasAppointments ? (
          appointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => navigate('/appointments')}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group"
            >
              {/* Left: Initial, Client Name & Service */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 font-bold text-xs shrink-0 group-hover:border-forest-700 transition-colors">
                  {apt.clientName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-forest-850 transition-colors">
                    {apt.clientName}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {apt.service}
                  </p>
                </div>
              </div>

              {/* Right: Date, Time & Status */}
              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-medium text-slate-700 block leading-tight">
                    {apt.date}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {apt.time}
                  </span>
                </div>
                <StatusBadge status={apt.status as any} />
              </div>
            </div>
          ))
        ) : (
          <DashboardEmptyState
            title="No Recent Appointments"
            description="Recent client bookings will appear here as they are received."
            icon={Calendar}
          />
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any row to open full scheduling queue</span>
        <span className="font-semibold text-slate-600">{appointments.length} shown</span>
      </div>
    </div>
  );
};

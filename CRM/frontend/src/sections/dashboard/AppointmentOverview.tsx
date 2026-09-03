import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, CheckCircle2, Clock, XCircle, AlertOctagon } from 'lucide-react';
import { AppointmentOverviewData } from '../../types';
import { DashboardEmptyState } from './DashboardEmptyState';

interface AppointmentOverviewProps {
  data?: AppointmentOverviewData;
}

export const AppointmentOverview: React.FC<AppointmentOverviewProps> = ({ data }) => {
  const total = data?.total ?? 0;
  const completed = data?.completed ?? { count: 0, percentage: 0 };
  const upcoming = data?.upcoming ?? { count: 0, percentage: 0 };
  const cancelled = data?.cancelled ?? { count: 0, percentage: 0 };
  const noShow = data?.noShow ?? { count: 0, percentage: 0 };

  const chartData = [
    { name: 'Completed', value: completed.count, color: '#10B981', icon: CheckCircle2 },
    { name: 'Upcoming', value: upcoming.count, color: '#0F5B47', icon: Clock },
    { name: 'Cancelled', value: cancelled.count, color: '#F43F5E', icon: XCircle },
    { name: 'No Show', value: noShow.count, color: '#C9A227', icon: AlertOctagon },
  ].filter(d => d.value > 0);

  const statuses = [
    { name: 'Completed', count: completed.count, percentage: completed.percentage, color: '#10B981', bg: 'bg-emerald-500' },
    { name: 'Upcoming', count: upcoming.count, percentage: upcoming.percentage, color: '#0F5B47', bg: 'bg-[#0F5B47]' },
    { name: 'Cancelled', count: cancelled.count, percentage: cancelled.percentage, color: '#F43F5E', bg: 'bg-rose-500' },
    { name: 'No Show', count: noShow.count, percentage: noShow.percentage, color: '#C9A227', bg: 'bg-[#C9A227]' },
  ];

  return (
    <div className="crm-card p-6 bg-white border border-[#E5ECE7] rounded-xl flex flex-col justify-between h-[390px]">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Appointment Overview
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Treatment status distribution across schedule
        </p>
      </div>

      {/* Main Content: Donut + Legend */}
      {total > 0 ? (
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
          {/* Donut Chart with Center Total */}
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 leading-none">
                {total}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Legend on the right */}
          <div className="flex-1 w-full space-y-2.5 pl-0 sm:pl-2">
            {statuses.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.bg} shrink-0`} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900">{item.count}</span>
                  <span className="text-[11px] font-medium text-slate-400 w-9 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DashboardEmptyState
          title="No Appointments Found"
          description="Appointments scheduled for this filter period will appear in this status breakdown."
          icon={Calendar}
        />
      )}

      {/* Footer subtle tip */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Pending & confirmed grouped as Upcoming</span>
        <span className="font-semibold text-forest-800">{total} total records</span>
      </div>
    </div>
  );
};

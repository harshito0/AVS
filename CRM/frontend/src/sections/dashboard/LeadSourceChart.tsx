import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, Users } from 'lucide-react';
import { LeadSourcesData } from '../../types';
import { DashboardEmptyState } from './DashboardEmptyState';

interface LeadSourceChartProps {
  data?: LeadSourcesData;
}

const PALETTE = [
  '#0F5B47', // Deep Green
  '#C9A227', // Gold
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
];

export const LeadSourceChart: React.FC<LeadSourceChartProps> = ({ data }) => {
  const total = data?.total ?? 0;
  const breakdown = data?.breakdown ?? [];

  const chartData = breakdown.map((item, idx) => ({
    name: item.source,
    value: item.count,
    percentage: item.percentage,
    color: PALETTE[idx % PALETTE.length],
  }));

  return (
    <div className="crm-card p-6 bg-white border border-[#E5ECE7] rounded-xl flex flex-col justify-between h-[380px]">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-4 h-4 text-[#C9A227]" />
            Lead Acquisition Source
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Channel attribution across marketing touchpoints
          </p>
        </div>
        <span className="text-[11px] font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-100">
          {total} {total === 1 ? 'Lead' : 'Leads'}
        </span>
      </div>

      {/* Main: Donut + Breakdown */}
      {total > 0 ? (
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          {/* Donut Chart */}
          <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-lead-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900 leading-none">
                {total}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="flex-1 w-full max-h-48 overflow-y-auto space-y-2 pr-1">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-slate-900">{item.value}</span>
                  <span className="text-[11px] font-medium text-slate-400 w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DashboardEmptyState
          title="No Leads Tracked"
          description="Inbound leads from Website, Instagram, Google, and Walk-ins will appear here."
          icon={Users}
        />
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Dynamic acquisition channels from CRM records</span>
        <span className="font-semibold text-slate-600">{chartData.length} channels</span>
      </div>
    </div>
  );
};

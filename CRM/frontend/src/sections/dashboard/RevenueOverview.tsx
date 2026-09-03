import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { RevenueOverviewData } from '../../types';
import { DashboardEmptyState } from './DashboardEmptyState';

interface RevenueOverviewProps {
  data?: RevenueOverviewData;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  data,
  period = 'This Month',
  onPeriodChange
}) => {
  const [activePeriod, setActivePeriod] = useState(period);

  const handlePeriodChange = (val: string) => {
    setActivePeriod(val);
    onPeriodChange?.(val);
  };

  const totalRevenue = data?.totalRevenue ?? 0;
  const changePercent = data?.changePercent || '+14.8%';
  const series = data?.series || [];

  const hasData = series.length > 0;

  // Custom luxury tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3.5 py-2.5 rounded-xl shadow-lg border border-[#E3EAE5] text-xs">
          <p className="text-slate-400 font-medium mb-1">{label}</p>
          <p className="text-forest-900 font-bold text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="crm-card p-6 bg-white border border-[#E5ECE7] rounded-xl flex flex-col justify-between h-[390px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Revenue Overview
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              {changePercent}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Settled clinical services and retail treatments over time
          </p>
        </div>

        {/* Period Selector & Total */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Total Revenue
            </span>
            <span className="text-lg font-extrabold text-slate-900 leading-none">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="relative">
            <select
              value={activePeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 w-full pt-4 min-h-[240px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F5B47" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#0F5B47" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
                tickFormatter={(val) => {
                  try {
                    const parts = val.split('-');
                    return `${parts[1]}/${parts[2]}`;
                  } catch {
                    return val;
                  }
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0F5B47"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
                activeDot={{ r: 5, fill: '#C9A227', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <DashboardEmptyState
            title="No Revenue Data Recorded"
            description="Paid invoices and settled sales for this time period will appear here automatically."
            icon={DollarSign}
          />
        )}
      </div>
    </div>
  );
};

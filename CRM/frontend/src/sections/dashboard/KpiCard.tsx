import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  comparisonText?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  change,
  trend = 'neutral',
  comparisonText,
  iconBgColor = 'bg-[#FAF5EC]',
  iconColor = 'text-[#C9A227]'
}) => {
  const renderTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-emerald-700" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-rose-600" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  };

  const getTrendBadgeStyle = () => {
    if (trend === 'up') return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    if (trend === 'down') return 'bg-rose-50 text-rose-700 border-rose-200/80';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="crm-card p-5 bg-white border border-[#E5ECE7] rounded-xl hover:shadow-[0_8px_20px_-4px_rgba(15,41,30,0.06)] transition-all duration-200 flex flex-col justify-between group">
      {/* Top: Label and Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-xl ${iconBgColor} ${iconColor} border border-[#C9A227]/20 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 duration-200`}>
          {icon}
        </div>
      </div>

      {/* Middle: Value */}
      <div className="mb-3">
        <h3 className="text-2xl lg:text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">
          {value}
        </h3>
      </div>

      {/* Bottom: Comparison Indicator */}
      {(change || comparisonText) && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {change && (
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[11px] border ${getTrendBadgeStyle()}`}>
              {renderTrendIcon()}
              {change}
            </span>
          )}
          {comparisonText && (
            <span className="text-slate-400 text-[11px] truncate">
              {comparisonText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

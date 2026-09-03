import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  comparisonText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'gold' | 'forest';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  trend,
  comparisonText = 'vs last month',
  icon,
  variant = 'default',
  className = ''
}) => {
  return (
    <div className={`crm-card p-5 relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#D1DED5] ${
      variant === 'forest' ? 'bg-[#0F291E] text-white border-[#1B4332]' : 'bg-white'
    } ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${
            variant === 'forest' ? 'text-emerald-300/80' : 'text-slate-500'
          }`}>
            {label}
          </p>
          <h3 className={`text-2xl lg:text-[28px] font-bold tracking-tight ${
            variant === 'forest' ? 'text-white' : 'text-slate-900'
          }`}>
            {value}
          </h3>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'forest'
              ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-700/50'
              : 'bg-forest-50 text-forest-850 border border-forest-100/80'
          }`}>
            {icon}
          </div>
        )}
      </div>

      {(change || comparisonText) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          {change && (
            <span className={`inline-flex items-center gap-0.5 font-semibold ${
              trend === 'up'
                ? variant === 'forest' ? 'text-emerald-300' : 'text-emerald-600'
                : trend === 'down'
                ? 'text-rose-500'
                : 'text-slate-500'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {comparisonText && (
            <span className={variant === 'forest' ? 'text-emerald-200/60' : 'text-slate-400'}>
              {comparisonText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

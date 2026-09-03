import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface DashboardEmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionButton?: React.ReactNode;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are no active records for the selected date range and location filter.',
  icon: Icon = Inbox,
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
      <div className="w-12 h-12 rounded-xl bg-spa-bg border border-spa-border flex items-center justify-center text-slate-400 mb-3 shadow-inner">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <p className="text-sm font-semibold text-slate-800 tracking-tight mb-1">
        {title}
      </p>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
};

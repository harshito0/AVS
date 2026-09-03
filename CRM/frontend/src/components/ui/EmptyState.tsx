import React from 'react';
import { Sparkles } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search or filters to see available records.',
  icon,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100/80 flex items-center justify-center text-forest-850 mb-3.5 shadow-sm">
        {icon || <Sparkles className="w-6 h-6 text-forest-800" />}
      </div>
      <h4 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

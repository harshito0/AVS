import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface DashboardErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  message = 'Unable to load dashboard intelligence metrics. Please verify backend connection.',
  onRetry,
}) => {
  return (
    <div className="crm-card p-12 bg-white border border-rose-200/80 rounded-2xl text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
        Dashboard Feed Unavailable
      </h3>
      <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="gap-2 bg-forest-900 hover:bg-forest-850 text-white text-xs px-5 py-2.5 rounded-xl shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
};

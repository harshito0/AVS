import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, UserPlus, FilePlus2, MessageSquareText, BarChart2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface QuickActionsProps {
  onNewAppointment?: () => void;
  onNewClient?: () => void;
  onNewInvoice?: () => void;
  onSendMessage?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewAppointment,
  onNewClient,
  onNewInvoice,
  onSendMessage,
}) => {
  const navigate = useNavigate();
  const { info } = useToast();

  const actions = [
    {
      title: 'New Appointment',
      desc: 'Schedule clinical treatment',
      icon: CalendarPlus,
      color: 'text-forest-800',
      bg: 'bg-forest-50 border-forest-100',
      onClick: () => {
        if (onNewAppointment) onNewAppointment();
        else navigate('/appointments');
      },
    },
    {
      title: 'Add New Client',
      desc: 'Register client profile',
      icon: UserPlus,
      color: 'text-[#C9A227]',
      bg: 'bg-[#FAF5EC] border-[#C9A227]/20',
      onClick: () => {
        if (onNewClient) onNewClient();
        else navigate('/clients');
      },
    },
    {
      title: 'Create Invoice',
      desc: 'Generate billing statement',
      icon: FilePlus2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-100',
      onClick: () => {
        if (onNewInvoice) onNewInvoice();
        else navigate('/invoices');
      },
    },
    {
      title: 'Send Message',
      desc: 'Broadcast or SMS reminder',
      icon: MessageSquareText,
      color: 'text-sky-700',
      bg: 'bg-sky-50 border-sky-100',
      onClick: () => {
        if (onSendMessage) onSendMessage();
        else info('Client Messaging', 'Concierge messaging portal ready. Opening notifications queue.');
      },
    },
    {
      title: 'Generate Report',
      desc: 'Export wellness metrics',
      icon: BarChart2,
      color: 'text-purple-700',
      bg: 'bg-purple-50 border-purple-100',
      onClick: () => navigate('/reports'),
    },
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Quick Actions
        </h3>
        <span className="text-xs text-slate-400">
          Frequently used management tasks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              type="button"
              onClick={act.onClick}
              className="crm-card p-4 bg-white border border-[#E5ECE7] rounded-xl hover:border-forest-700/40 hover:shadow-[0_8px_20px_-4px_rgba(15,41,30,0.08)] transition-all duration-200 text-left group flex items-center sm:flex-col sm:items-start gap-3.5 cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-xl ${act.bg} ${act.color} border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-forest-900 transition-colors leading-tight">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

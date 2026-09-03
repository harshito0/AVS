import React from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Appointment, AppointmentStatus } from '../../types';
import { Calendar, Clock, MapPin, User, Sparkles, Phone, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export interface AppointmentDetailsDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
}

export const AppointmentDetailsDrawer: React.FC<AppointmentDetailsDrawerProps> = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const { success } = useToast();

  if (!appointment) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Appointment Details</span>
          <StatusBadge status={appointment.status} />
        </div>
      }
      subtitle={`Scheduled for ${appointment.date} at ${appointment.time}`}
      width="max-w-lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            {appointment.status !== 'Completed' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onStatusUpdate(appointment.id, 'Completed');
                  success('Marked Completed', `${appointment.clientName}'s session completed.`);
                }}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Mark Completed
              </Button>
            )}
            {appointment.status !== 'Cancelled' && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onStatusUpdate(appointment.id, 'Cancelled');
                  success('Appointment Cancelled', `${appointment.clientName}'s slot cancelled.`);
                }}
              >
                Cancel Slot
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Service Highlight Card */}
        <div className="p-5 rounded-xl border border-forest-100 bg-forest-50/50 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-forest-850 uppercase">
                {appointment.serviceCategory}
              </span>
              <h4 className="text-lg font-bold text-forest-950 mt-0.5">{appointment.service}</h4>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-forest-900">${appointment.amount.toFixed(2)}</span>
              <p className="text-[10px] text-slate-500">{appointment.duration}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-forest-200/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-forest-850" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-forest-850" />
              <span>{appointment.time} ({appointment.duration})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-forest-850" />
              <span>{appointment.location} Centre</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <User className="w-3.5 h-3.5 text-forest-850" />
              <span>{appointment.staff}</span>
            </div>
          </div>
        </div>

        {/* Client Profile Summary */}
        <div className="crm-card p-4 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Client Information</h5>
          <p className="text-sm font-bold text-slate-900">{appointment.clientName}</p>
          <div className="space-y-1 text-xs text-slate-600">
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {appointment.phone}
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {appointment.email}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="crm-card p-4 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Treatment & Booking Notes</h5>
          <p className="text-xs text-slate-700 leading-relaxed bg-[#FAFBF9] p-3 rounded-lg border border-slate-100">
            {appointment.notes || 'No special intake instructions recorded for this session.'}
          </p>
        </div>
      </div>
    </Drawer>
  );
};

import React, { useState } from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Appointment, AppointmentStatus } from '../../types';
import { Calendar, Clock, MapPin, User, Sparkles, Phone, Mail, CheckCircle2, XCircle, Trash2, ShieldCheck, FileText } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { ConsentFormViewerModal } from '../../components/ConsentFormViewerModal';

export interface AppointmentDetailsDrawerProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
  onDelete?: (id: string) => void;
}

export const AppointmentDetailsDrawer: React.FC<AppointmentDetailsDrawerProps> = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
  onDelete
}) => {
  const { success } = useToast();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(appointment.id);
                  onClose();
                }}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </Button>
            )}
          </div>
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
        {/* Reference ID & Channel/Source Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Reference:</span>
            <span className="font-mono font-bold text-forest-900 bg-white px-2 py-0.5 rounded border border-slate-200">{appointment.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Source:</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {appointment.source || 'QR Code'}
            </span>
          </div>
        </div>

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
          <div className="space-y-1.5 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-forest-850 shrink-0" />
              <span className={appointment.phone ? "text-slate-800 font-medium" : "text-slate-400 italic"}>
                {appointment.phone || 'No phone number provided'}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-forest-850 shrink-0" />
              <span className={appointment.email ? "text-slate-800 font-medium" : "text-slate-400 italic"}>
                {appointment.email || 'No email provided'}
              </span>
            </p>
          </div>
        </div>

        {/* Client Consent Form Verification Card */}
        <div className="crm-card p-4 space-y-3 bg-gradient-to-br from-white to-[#F9FAF8] border-[#DFE7E2]">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Client Consent Form</span>
            </h5>
            {appointment.consentCompleted || appointment.consentForm ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <span>✓ Verified &amp; Signed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span>Pending Client Signature</span>
              </span>
            )}
          </div>

          {appointment.consentForm ? (
            <div className="space-y-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Date Signed:</span>
                <span className="font-bold text-slate-900">{appointment.consentForm.signatureDate || appointment.date}</span>
              </div>

              {/* Signature Preview */}
              {appointment.consentForm.signatureData && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Digital Signature:</span>
                  <div className="h-10 w-28 bg-[#FAFBF9] rounded border border-slate-200 flex items-center justify-center p-1">
                    <img
                      src={appointment.consentForm.signatureData}
                      alt="Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-1 text-[11px]">
                <span className="text-slate-500">Under Medical Treatment:</span>
                <span className="font-semibold text-slate-800">{appointment.consentForm.underMedicalTreatment || 'No'}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Allergies Declared:</span>
                <span className="font-semibold text-slate-800">
                  {appointment.consentForm.hasAllergies === 'Yes'
                    ? (appointment.consentForm.allergiesDetails || 'Yes')
                    : 'None reported'}
                </span>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsConsentModalOpen(true)}
                  className="w-full text-xs font-bold text-forest-900 border-forest-300 hover:bg-forest-50 flex items-center justify-center gap-1.5"
                  icon={<FileText className="w-3.5 h-3.5" />}
                >
                  View Full Signed Consent Document
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-800 space-y-2">
              <p>No intake consent form linked to this appointment session yet.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConsentModalOpen(true)}
                className="w-full text-xs font-semibold text-amber-900 border-amber-300 hover:bg-amber-100/50"
              >
                Open Blank Consent Record
              </Button>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="crm-card p-4 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Treatment & Booking Notes</h5>
          <p className="text-xs text-slate-700 leading-relaxed bg-[#FAFBF9] p-3 rounded-lg border border-slate-100">
            {appointment.notes || 'No special intake instructions recorded for this session.'}
          </p>
        </div>
      </div>

      {/* Consent Document Viewer Modal */}
      <ConsentFormViewerModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        appointment={appointment}
      />
    </Drawer>
  );
};

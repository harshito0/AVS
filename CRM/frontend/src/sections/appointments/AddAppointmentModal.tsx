import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { INITIAL_SERVICES } from '../../data/services';
import { clientService } from '../../services/clientService';
import { Appointment, Client } from '../../types';
import { User, UserCheck, AlertTriangle } from 'lucide-react';

export interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  existingAppointments?: Appointment[];
}

const STAFF_LIST = [
  'Robert Jenkins (RMT)',
  'Dr. Sarah Alston',
  'Zoe Martinez',
  'Emma Taylor',
  'Maya Lin',
  'Liam Wong'
];

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
  existingAppointments = []
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  // 'registered' | 'walkin'
  const [bookingMode, setBookingMode] = useState<'registered' | 'walkin'>('walkin');
  const [clientId, setClientId] = useState('');
  const [manualClientName, setManualClientName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [serviceName, setServiceName] = useState(INITIAL_SERVICES[0]?.name || 'RMT Massage Therapy');
  const [staff, setStaff] = useState(STAFF_LIST[0]);
  const [location, setLocation] = useState<'Brampton' | 'Mississauga'>('Brampton');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [duration, setDuration] = useState('60 min');
  const [notes, setNotes] = useState('');
  const [slotError, setSlotError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      clientService.getClients().then((res) => {
        setClients(res);
        if (res.length > 0) {
          setClientId(res[0].id);
        }
      });
      // Reset state on open
      setBookingMode('walkin');
      setManualClientName('');
      setManualPhone('');
      setNotes('');
      setSlotError(null);
    }
  }, [isOpen]);

  // Clear slot error when date/time/location/client changes
  useEffect(() => {
    setSlotError(null);
  }, [date, time, location, clientId, manualClientName, bookingMode]);

  const checkDuplicateSlot = (resolvedName: string, resolvedPhone: string): string | null => {
    const nameLower = resolvedName.trim().toLowerCase();
    const phoneCleaned = resolvedPhone.replace(/\D/g, '');

    for (const apt of existingAppointments) {
      if (apt.status === 'Cancelled') continue; // Skip cancelled appointments

      const aptDateNorm = apt.date;
      const aptTimeLower = apt.time.toLowerCase().replace(/\s/g, '');
      const newTimeLower = time.toLowerCase().replace(/\s/g, '');
      const aptNameLower = apt.clientName.trim().toLowerCase();
      const aptPhoneCleaned = (apt.phone || '').replace(/\D/g, '');

      const sameDate = aptDateNorm === date;
      const sameTime = aptTimeLower === newTimeLower;
      const sameLocation = apt.location === location;

      // Match by phone (if available) or by name
      const sameClient =
        (phoneCleaned.length > 5 && aptPhoneCleaned === phoneCleaned) ||
        (nameLower.length > 1 && aptNameLower === nameLower);

      if (sameDate && sameTime && sameLocation && sameClient) {
        return `${resolvedName} already has a "${apt.service}" appointment at ${apt.time} on ${apt.date} at ${apt.location}. Please choose a different time slot.`;
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSlotError(null);

    const selectedClient = bookingMode === 'registered' ? clients.find((c) => c.id === clientId) : null;
    const clientName = selectedClient
      ? selectedClient.name
      : (manualClientName.trim() || 'Walk-in Guest');
    const phone = selectedClient ? selectedClient.phone : manualPhone.trim();
    const email = selectedClient ? selectedClient.email : 'guest@example.ca';
    const service = INITIAL_SERVICES.find((s) => s.name === serviceName) || INITIAL_SERVICES[0];

    // --- Duplicate slot check ---
    const conflict = checkDuplicateSlot(clientName, phone);
    if (conflict) {
      setSlotError(conflict);
      return;
    }

    onAddAppointment({
      clientId: selectedClient ? selectedClient.id : `cli-temp-${Date.now()}`,
      clientName,
      phone,
      email,
      service: service ? service.name : serviceName,
      serviceCategory: service ? service.category : 'Massage Therapy',
      staff,
      location,
      date,
      time,
      duration,
      status: 'Confirmed',
      amount: service ? service.price : 120,
      notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book New Appointment"
      subtitle="Schedule a clinical or relaxation visit"
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Confirm Booking
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Booking Mode Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Client Type
          </label>
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setBookingMode('walkin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bookingMode === 'walkin'
                  ? 'bg-white text-forest-900 shadow-sm border border-forest-100'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Walk-in / Guest
            </button>
            <button
              type="button"
              onClick={() => setBookingMode('registered')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bookingMode === 'registered'
                  ? 'bg-white text-forest-900 shadow-sm border border-forest-100'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Registered Client
            </button>
          </div>
        </div>

        {/* Slot Conflict Error */}
        {slotError && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-0.5">Booking Conflict Detected</p>
              <p>{slotError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Client Input — Walk-in vs Registered */}
          {bookingMode === 'walkin' ? (
            <div className="space-y-3">
              <Input
                label="Guest Name"
                value={manualClientName}
                onChange={(e) => setManualClientName(e.target.value)}
                placeholder="e.g. Jane Doe (optional)"
              />
              <Input
                label="Guest Phone (optional)"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                placeholder="e.g. (905) 555-0100"
              />
            </div>
          ) : (
            <Select
              label="Select Registered Client *"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              options={
                clients.length > 0
                  ? clients.map((c) => ({
                      value: c.id,
                      label: `${c.name} (${c.location})`
                    }))
                  : [{ value: '', label: 'No clients found' }]
              }
            />
          )}

          <Select
            label="Select Service *"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            options={INITIAL_SERVICES.map((s) => ({
              value: s.name,
              label: `${s.name} ($${s.price})`
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Specialist / RMT"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            options={STAFF_LIST.map((st) => ({ value: st, label: st }))}
          />
          <Select
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value as any)}
            options={[
              { value: 'Brampton', label: 'Brampton Hub' },
              { value: 'Mississauga', label: 'Mississauga Suites' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="10:00 AM"
          />
          <Select
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            options={[
              { value: '45 min', label: '45 min' },
              { value: '60 min', label: '60 min' },
              { value: '75 min', label: '75 min' },
              { value: '90 min', label: '90 min' },
              { value: '120 min', label: '120 min' }
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Client Preferences & Booking Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Pressure preferences, aromatherapy choice, insurance claim requirements..."
            className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
          />
        </div>
      </form>
    </Modal>
  );
};

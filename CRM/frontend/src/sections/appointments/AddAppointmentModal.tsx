import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { INITIAL_SERVICES } from '../../data/services';
import { clientService } from '../../services/clientService';
import { Appointment, Client } from '../../types';

export interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
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
  onAddAppointment
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [manualClientName, setManualClientName] = useState('');
  const [manualPhone, setManualPhone] = useState('(905) 555-0100');
  const [serviceName, setServiceName] = useState(INITIAL_SERVICES[0]?.name || 'RMT Massage Therapy');
  const [staff, setStaff] = useState(STAFF_LIST[0]);
  const [location, setLocation] = useState<'Brampton' | 'Mississauga'>('Brampton');
  const [date, setDate] = useState('2025-06-05');
  const [time, setTime] = useState('11:00 AM');
  const [duration, setDuration] = useState('60 min');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      clientService.getClients().then((res) => {
        setClients(res);
        if (res.length > 0) {
          setClientId(res[0].id);
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.id === clientId);
    const clientName = selectedClient ? selectedClient.name : (manualClientName.trim() || 'Walk-in Guest');
    const phone = selectedClient ? selectedClient.phone : manualPhone;
    const email = selectedClient ? selectedClient.email : 'guest@example.ca';
    const service = INITIAL_SERVICES.find((s) => s.name === serviceName) || INITIAL_SERVICES[0];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clients.length > 0 ? (
            <Select
              label="Select Registered Client *"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              options={clients.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.location})`
              }))}
            />
          ) : (
            <Input
              label="Client Name *"
              value={manualClientName}
              onChange={(e) => setManualClientName(e.target.value)}
              placeholder="Enter client name"
              required
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

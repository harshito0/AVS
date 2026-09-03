import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LeadSource, LeadStatus } from '../../types';

export interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (data: any) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Instagram' as LeadSource,
    location: 'Brampton' as 'Brampton' | 'Mississauga',
    interestService: 'RMT Massage Therapy',
    status: 'Follow Up' as LeadStatus,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Lead name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onAddLead(formData);
      setIsSubmitting(false);
      onClose();
      setFormData({
        name: '',
        phone: '',
        email: '',
        source: 'Instagram',
        location: 'Brampton',
        interestService: 'RMT Massage Therapy',
        status: 'Follow Up',
        notes: ''
      });
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      subtitle="Capture potential client inquiry and start follow-up workflow"
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Lead
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Lead Name *"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Jessica Miller"
            error={errors.name}
          />
          <Input
            label="Phone Number *"
            value={formData.phone}
            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            placeholder="(905) 555-0143"
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            placeholder="jessica.m@outlook.com"
          />
          <Select
            label="Lead Source"
            value={formData.source}
            onChange={(e) => setFormData((p) => ({ ...p, source: e.target.value as LeadSource }))}
            options={[
              { value: 'Instagram', label: 'Instagram' },
              { value: 'Website', label: 'Website' },
              { value: 'Facebook', label: 'Facebook' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Google', label: 'Google' },
              { value: 'Walk In', label: 'Walk In' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Centre Location"
            value={formData.location}
            onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value as any }))}
            options={[
              { value: 'Brampton', label: 'Brampton Hub' },
              { value: 'Mississauga', label: 'Mississauga Suites' }
            ]}
          />
          <Input
            label="Service of Interest"
            value={formData.interestService}
            onChange={(e) => setFormData((p) => ({ ...p, interestService: e.target.value }))}
            placeholder="e.g. 24K Gold Facial"
          />
          <Select
            label="Initial Status"
            value={formData.status}
            onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as LeadStatus }))}
            options={[
              { value: 'Follow Up', label: 'Follow Up' },
              { value: 'Converted', label: 'Converted' },
              { value: 'Dead', label: 'Dead' }
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Inquiry & Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Client requested weekend availability, wedding prep packages..."
            className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
          />
        </div>
      </form>
    </Modal>
  );
};

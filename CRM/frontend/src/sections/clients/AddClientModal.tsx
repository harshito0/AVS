import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { AlertTriangle } from 'lucide-react';
import { Client } from '../../types';

export interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (clientData: any) => void;
  existingClients?: Client[];
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
  existingClients = []
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'Female',
    location: 'Brampton',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [confirmedDuplicate, setConfirmedDuplicate] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setDuplicateWarning(null);
    setConfirmedDuplicate(false);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const checkForDuplicates = () => {
    const phone = formData.phone.trim().replace(/\D/g, '');
    const email = formData.email.trim().toLowerCase();

    const phoneMatch = existingClients.find(
      (c) => c.phone.replace(/\D/g, '') === phone && phone.length > 5
    );
    const emailMatch = existingClients.find(
      (c) => c.email.toLowerCase() === email && email.includes('@')
    );

    if (phoneMatch && emailMatch && phoneMatch.id === emailMatch.id) {
      return `A client named "${phoneMatch.name}" already has this exact phone and email on file.`;
    }
    if (phoneMatch) {
      return `Phone number already used by client "${phoneMatch.name}" (${phoneMatch.email}).`;
    }
    if (emailMatch) {
      return `Email already used by client "${emailMatch.name}" (${emailMatch.phone}).`;
    }
    return null;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check for duplicates — if warning not yet acknowledged, show it and pause
    if (!confirmedDuplicate) {
      const warning = checkForDuplicates();
      if (warning) {
        setDuplicateWarning(warning);
        return; // Wait for user to confirm
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onAddClient(formData);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: '',
        gender: 'Female',
        location: 'Brampton',
        notes: ''
      });
      setDuplicateWarning(null);
      setConfirmedDuplicate(false);
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      subtitle="Register a new guest in the AURA VITAL STAR client directory"
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {duplicateWarning && !confirmedDuplicate ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setConfirmedDuplicate(true);
                setDuplicateWarning(null);
                // Immediately submit after confirming
                setIsSubmitting(true);
                setTimeout(() => {
                  onAddClient(formData);
                  setIsSubmitting(false);
                  onClose();
                  setFormData({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    dob: '',
                    gender: 'Female',
                    location: 'Brampton',
                    notes: ''
                  });
                }, 400);
              }}
              isLoading={isSubmitting}
            >
              Add Anyway
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting}>
              Add Client
            </Button>
          )}
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Duplicate Warning Banner */}
        {duplicateWarning && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-0.5">Possible Duplicate Client Detected</p>
              <p>{duplicateWarning}</p>
              <p className="mt-1 text-amber-600">Click <strong>Add Anyway</strong> to create a new record, or <strong>Cancel</strong> to go back and search for the existing client.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="First name"
            error={errors.firstName}
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Last name"
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number *"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Phone number"
            error={errors.phone}
          />
          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
          />
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            options={[
              { value: 'Female', label: 'Female' },
              { value: 'Male', label: 'Male' },
              { value: 'Other', label: 'Other' },
              { value: 'Prefer not to say', label: 'Prefer not to say' }
            ]}
          />
          <Select
            label="Primary Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            options={[
              { value: 'Brampton', label: 'Brampton Hub' },
              { value: 'Mississauga', label: 'Mississauga Suites' }
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Therapist / Wellness Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Massage pressure preferences, allergies, insurance requirements..."
            className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
          />
        </div>
      </form>
    </Modal>
  );
};

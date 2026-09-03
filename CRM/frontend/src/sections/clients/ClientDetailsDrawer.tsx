import React, { useState } from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Tabs } from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Client } from '../../types';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink
} from 'lucide-react';

export interface ClientDetailsDrawerProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onCreateInvoice?: (client: Client) => void;
}

export const ClientDetailsDrawer: React.FC<ClientDetailsDrawerProps> = ({
  client,
  isOpen,
  onClose,
  onEdit,
  onCreateInvoice
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!client) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments', count: client.totalVisits },
    { id: 'invoices', label: 'Invoices' },
    { id: 'notes', label: 'Notes' }
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Client Profile"
      subtitle={`AVS ID: #${client.id.toUpperCase()}`}
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(client)} icon={<Edit2 className="w-3.5 h-3.5" />}>
            Edit Profile
          </Button>
          {onCreateInvoice && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCreateInvoice(client)}
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              Create Invoice
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="crm-card p-5 bg-gradient-to-br from-white to-[#F7FAF8] border-[#D9E5DE]">
          <div className="flex items-start gap-4">
            <Avatar name={client.name} src={client.avatar} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
                <StatusBadge status={client.status === 'Active' ? 'Active Client' : 'Inactive'} />
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.location} Centre</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Member since {client.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary Strip */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-200/80">
            <div className="bg-white/80 rounded-xl p-3 border border-[#E3EAE5]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</p>
              <p className="text-xl font-bold text-forest-900 mt-0.5">${client.totalSpent.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Lifetime Value</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 border border-[#E3EAE5]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Visits</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{client.totalVisits}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Completed Sessions</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Personal Information */}
            <div className="crm-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Personal Information
                </h4>
                <button
                  onClick={() => onEdit(client)}
                  className="text-xs text-forest-850 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-semibold text-slate-800">{client.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{client.dob || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone</span>
                  <span className="font-semibold text-slate-800">{client.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gender</span>
                  <span className="font-semibold text-slate-800">{client.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-slate-800 truncate block">{client.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Location</span>
                  <span className="font-semibold text-slate-800">{client.location}</span>
                </div>
              </div>
            </div>

            {/* Last Visit Highlight Card */}
            <div className="crm-card p-4 border-l-4 border-l-forest-800 bg-[#FAFBF9]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-850">
                    Last Visit Details
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 mt-1">{client.lastService}</h5>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {client.lastVisit}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-[#E3EAE5] bg-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{client.lastService}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{client.lastVisit} at 10:00 AM • {client.location}</p>
              </div>
              <StatusBadge status="Completed" />
            </div>
            <p className="text-center text-xs text-slate-400 py-4">All {client.totalVisits} previous appointment records on file.</p>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-[#E3EAE5] bg-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">INV-2025-0186</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{client.lastVisit} • RMT & Spa Treatments</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">${client.totalSpent.toFixed(2)}</p>
                <StatusBadge status="Paid" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="crm-card p-4 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Therapist & Care Notes</h5>
            <p className="text-xs text-slate-700 leading-relaxed bg-[#FAFBF9] p-3 rounded-lg border border-slate-100">
              {client.notes || 'No custom notes on file for this client.'}
            </p>
          </div>
        )}
      </div>
    </Drawer>
  );
};

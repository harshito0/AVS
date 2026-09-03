import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Bell,
  Palette,
  User,
  Shield,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../hooks/useToast';

export const SettingsPage: React.FC = () => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'business' | 'locations' | 'staff' | 'notifications' | 'profile'>('business');

  // Business info state
  const [businessName, setBusinessName] = useState('Aura Vital Star Rejuvenation Centre');
  const [taxNumber, setTaxNumber] = useState('84920 1932 RT0001');
  const [supportEmail, setSupportEmail] = useState('concierge@auravitalstar.ca');
  const [phone, setPhone] = useState('(905) 555-0100');
  const [currency, setCurrency] = useState('CAD ($)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Centre configuration preferences updated.');
  };

  const navItems = [
    { id: 'business', label: 'Business Profile', icon: Building2 },
    { id: 'locations', label: 'Centres & Locations', icon: MapPin },
    { id: 'staff', label: 'Therapists & Staff', icon: Users },
    { id: 'notifications', label: 'Client Notifications', icon: Bell },
    { id: 'profile', label: 'Admin Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div className="crm-card p-0 overflow-hidden flex flex-col md:flex-row min-h-[560px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-[#FAFBF9] border-r border-[#E3EAE5] p-4 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Centre Settings
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-forest-850 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'business' && (
            <form onSubmit={handleSave} className="max-w-xl space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Brand & Clinical Identity</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official rejuvenation centre business details printed on receipts and invoices.
                </p>
              </div>

              {/* Official Brand Logo Showcase */}
              <div className="p-4 rounded-xl border border-[#D9E2DC] bg-[#FAFBF9] flex items-center gap-4">
                <div className="w-18 h-18 rounded-xl bg-white p-2 shadow-sm border border-[#C5A880]/50 shrink-0 flex items-center justify-center">
                  <img
                    src="/avs_logo.png"
                    alt="Aura Vital Star"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">AURA VITAL STAR</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                      Primary Logo Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rejuvenation Centre Inc. • Registered Brand Mark
                  </p>
                  <p className="text-[11px] text-forest-850 font-medium mt-1">
                    "Where Wellness Meets Radiance"
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Input
                  label="Legal Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ontario HST / Tax #"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                  />
                  <Input
                    label="Operating Currency"
                    value={currency}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Concierge Email"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                  <Input
                    label="Main Clinic Telephone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button variant="primary" size="sm" type="submit" icon={<Save className="w-3.5 h-3.5" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Operating Centres</h3>
                <p className="text-xs text-slate-500 mt-0.5">Physical branches across the Greater Toronto Area.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-forest-200 bg-forest-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-forest-950">Brampton Rejuvenation Hub</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-forest-850 text-white rounded-full">Primary</span>
                  </div>
                  <p className="text-xs text-slate-600">144 Queen St East, Brampton, ON L6V 1B4</p>
                  <p className="text-[11px] text-slate-500">6 Treatment Rooms • Hydrotherapy Suite</p>
                </div>

                <div className="p-4 rounded-xl border border-[#D9E2DC] bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-900">Mississauga City Centre Suites</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">Branch</span>
                  </div>
                  <p className="text-xs text-slate-600">300 City Centre Dr, Mississauga, ON L5B 3C1</p>
                  <p className="text-[11px] text-slate-500">8 Treatment Rooms • Couples Retreat VIP</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Clinical & Spa Staff Roster</h3>
                <p className="text-xs text-slate-500 mt-0.5">Licensed massage therapists, aestheticians, and reception.</p>
              </div>

              <div className="divide-y divide-slate-100 border border-[#E3EAE5] rounded-xl bg-white">
                {[
                  { name: 'Robert Jenkins', role: 'Lead Registered Massage Therapist (RMT)', loc: 'Brampton' },
                  { name: 'Dr. Sarah Alston', role: 'Holistic Podiatrist & Orthotics Specialist', loc: 'Mississauga' },
                  { name: 'Zoe Martinez', role: 'Senior Clinical Aesthetician (24K Gold Facials)', loc: 'Brampton' },
                  { name: 'Emma Taylor', role: 'Ayurvedic Bodywork & Aromatherapy Therapist', loc: 'Mississauga' }
                ].map((s) => (
                  <div key={s.name} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-slate-500">{s.role}</p>
                    </div>
                    <span className="font-semibold text-forest-850 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-100">
                      {s.loc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-base font-bold text-slate-900">Automated Messaging Rules</h3>
              <div className="space-y-3 pt-2">
                {[
                  { title: 'Appointment SMS Confirmations', desc: 'Send direct text reminders 24h prior to visit.' },
                  { title: 'Digital Invoice & Insurance Receipts', desc: 'Instantly email PDF copies on payment clearance.' },
                  { title: 'Gift Card Expiry Warning', desc: 'Remind buyer & recipient 30 days before validity ends.' }
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between p-3 rounded-xl border border-[#E3EAE5] bg-[#FAFBF9]">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-forest-850 rounded cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-base font-bold text-slate-900">Admin Security & Password</h3>
              <p className="text-xs text-slate-500">Superadministrator access controls for the AVS CRM.</p>
              <div className="space-y-3 pt-2">
                <Input label="Current Password" type="password" value="••••••••••••" readOnly />
                <Input label="New Password" type="password" placeholder="Enter new strong password" />
                <Button variant="primary" size="sm" onClick={() => success('Updated', 'Admin credentials updated.')}>
                  Update Credentials
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

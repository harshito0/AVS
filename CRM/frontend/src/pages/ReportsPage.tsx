import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Target,
  FileText,
  Gift,
  PieChart as PieIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { StatCard } from '../components/ui/StatCard';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  REVENUE_CHART_DATA,
  SERVICE_PERFORMANCE_DATA,
  LOCATION_DISTRIBUTION,
  MONTHLY_RETENTION_DATA
} from '../data/reports';
import { LEAD_STATUS_BREAKDOWN } from '../data/leads';
import { useCrmContext } from '../layouts/CrmShell';
import { useToast } from '../hooks/useToast';

export const ReportsPage: React.FC = () => {
  const { currentLocation, dateRange } = useCrmContext();
  const { info } = useToast();
  const [activeTab, setActiveTab] = useState('revenue');

  const reportTabs = [
    { id: 'revenue', label: 'Revenue Report', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'clients', label: 'Client Retention', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'leads', label: 'Lead Conversion', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Service Performance', icon: <BarChart3 className="w-3.5 h-3.5" /> }
  ];

  const handleExportCsv = () => {
    info('Export Report', `Compiling ${activeTab.toUpperCase()} analytical export for ${dateRange}...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Analytics & Financial Insights</h3>
          <p className="text-xs text-slate-500">
            Reporting period: <span className="font-semibold text-slate-700">{dateRange}</span> • Location:{' '}
            <span className="font-semibold text-slate-700">{currentLocation}</span>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          icon={<Download className="w-3.5 h-3.5 text-slate-400" />}
        >
          Export Report (CSV)
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={reportTabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      {/* TAB 1: REVENUE REPORT */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="GROSS REVENUE (YTD)" value="$202,550" change="+18.4%" trend="up" icon={<DollarSign className="w-5 h-5" />} />
            <StatCard label="ESTIMATED EXPENSES" value="$82,400" change="40.6%" trend="neutral" comparisonText="operational overhead" icon={<TrendingUp className="w-5 h-5" />} />
            <StatCard label="NET OPERATING MARGIN" value="$120,150" change="59.4%" trend="up" comparisonText="profitability" icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} />
            <StatCard label="AVG TICKET VALUE" value="$113.60" change="+$6.20" trend="up" comparisonText="per treatment" icon={<DollarSign className="w-5 h-5" />} />
          </div>

          <div className="crm-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Monthly Revenue vs Operational Expenses
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Ontario clinic performance timeline</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REVENUE_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5ECE7" />
                  <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F291E', borderRadius: '8px', color: '#fff', border: 'none' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`]}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#0F291E" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#C5A880" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT RETENTION */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="RETENTION RATE" value="77.2%" change="+3.2%" trend="up" comparisonText="repeat visits" icon={<Users className="w-5 h-5" />} />
            <StatCard label="CHURN RATE" value="4.8%" change="-1.1%" trend="down" comparisonText="inactive >90 days" icon={<Users className="w-5 h-5" />} />
            <StatCard label="LIFETIME VALUE (AVG)" value="$420.00" change="+$45.00" trend="up" comparisonText="annual guest spend" icon={<DollarSign className="w-5 h-5" />} />
          </div>

          <div className="crm-card p-5 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Returning vs First-Time Clients Trend
            </h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_RETENTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5ECE7" />
                  <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F291E', borderRadius: '8px', color: '#fff', border: 'none' }} />
                  <Area type="monotone" dataKey="returning" name="% Returning" stroke="#0F291E" fill="#0F291E" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="newClients" name="% New" stroke="#C5A880" fill="#C5A880" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAD CONVERSION */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="crm-card p-5 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Conversion Pipeline
              </h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={LEAD_STATUS_BREAKDOWN} innerRadius={50} outerRadius={75} dataKey="value">
                      {LEAD_STATUS_BREAKDOWN.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0F291E', borderRadius: '8px', color: '#fff', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="crm-card p-5 lg:col-span-2 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Acquisition Channel Performance
              </h4>
              <div className="space-y-3 pt-2">
                {[
                  { channel: 'Instagram Ads', leads: 94, converted: 42, rate: '44.6%' },
                  { channel: 'Organic Website', leads: 68, converted: 29, rate: '42.6%' },
                  { channel: 'Client Referrals', leads: 38, converted: 21, rate: '55.2%' },
                  { channel: 'Google Local Search', leads: 32, converted: 12, rate: '37.5%' },
                  { channel: 'Walk Ins', leads: 16, converted: 8, rate: '50.0%' }
                ].map((item) => (
                  <div key={item.channel} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{item.channel}</span>
                      <span className="text-forest-900 font-bold">{item.converted} converted ({item.rate})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-forest-850 h-2 rounded-full" style={{ width: item.rate }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE PERFORMANCE */}
      {activeTab === 'services' && (
        <div className="crm-card p-5 space-y-4">
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Revenue by Treatment Category
          </h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SERVICE_PERFORMANCE_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5ECE7" />
                <XAxis type="number" stroke="#94A3B8" tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" width={160} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0F291E', borderRadius: '8px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="revenue" fill="#0F291E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { RotateCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LEAD_STATUS_BREAKDOWN } from '../../data/leads';

export interface LeadFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  sourceFilter: string;
  setSourceFilter: (s: string) => void;
  locationFilter: string;
  setLocationFilter: (l: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export const LeadFilterPanel: React.FC<LeadFilterPanelProps> = ({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  locationFilter,
  setLocationFilter,
  onApply,
  onClear
}) => {
  const chartData = LEAD_STATUS_BREAKDOWN;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Leads"
      subtitle="Refine pipeline by status, acquisition source, and centre"
      width="max-w-md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClear} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Clear Filters
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Selects */}
        <div className="space-y-4">
          <Select
            label="Lead Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Follow Up', label: 'Follow Up' },
              { value: 'Converted', label: 'Converted' },
              { value: 'Dead', label: 'Dead Leads' }
            ]}
          />

          <Select
            label="Lead Source"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Sources' },
              { value: 'Instagram', label: 'Instagram' },
              { value: 'Website', label: 'Website' },
              { value: 'Facebook', label: 'Facebook' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Google', label: 'Google' },
              { value: 'Walk In', label: 'Walk In' }
            ]}
          />

          <Select
            label="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Locations' },
              { value: 'Brampton', label: 'Brampton Centre' },
              { value: 'Mississauga', label: 'Mississauga Suites' }
            ]}
          />
        </div>

        {/* Lead Status Summary & Donut Chart per specification */}
        <div className="crm-card p-4 border-[#DCE6E0] bg-[#FAFBF9] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lead Status Summary
            </h4>
            <span className="text-[11px] font-bold text-forest-850">Total 248</span>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [`${val} leads`, name]}
                  contentStyle={{
                    backgroundColor: '#0F291E',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900 leading-none">248</span>
              <span className="text-[10px] text-slate-400 font-medium">Leads</span>
            </div>
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-2 pt-1 border-t border-slate-200/60">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">
                  {item.value} <span className="text-slate-400 font-normal">({item.percentage})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

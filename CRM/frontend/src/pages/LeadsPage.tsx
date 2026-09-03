import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  UserCheck,
  Clock,
  UserX,
  Percent,
  Plus,
  Upload,
  Download,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Trash2,
  Edit2
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { ActionMenu, ActionMenuItem } from '../components/ui/ActionMenu';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { LeadFilterPanel } from '../sections/leads/LeadFilterPanel';
import { AddLeadModal } from '../sections/leads/AddLeadModal';
import { leadService } from '../services/leadService';
import { Lead, LeadStatus } from '../types';
import { useCrmContext } from '../layouts/CrmShell';
import { useToast } from '../hooks/useToast';

export const LeadsPage: React.FC = () => {
  const { currentLocation, searchQuery } = useCrmContext();
  const { success, info } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Filter criteria
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('addedOn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeads();
      setLeads(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async (formData: any) => {
    const newLead = await leadService.createLead(formData);
    setLeads((prev) => [newLead, ...prev]);
    success('Lead Created', `${newLead.name} has been added to the sales pipeline.`);
  };

  const handleStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    await leadService.updateLeadStatus(lead.id, newStatus);
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
    );
    success('Status Updated', `${lead.name} moved to ${newStatus}.`);
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    await leadService.deleteLead(leadToDelete.id);
    setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
    success('Lead Removed', `${leadToDelete.name} has been removed.`);
    setLeadToDelete(null);
  };

  const filteredLeads = useMemo(() => {
    const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

    return leads.filter((lead) => {
      // Global location
      if (currentLocation !== 'All Locations' && lead.location !== currentLocation) {
        return false;
      }
      // Drawer location filter
      if (locationFilter !== 'All' && lead.location !== locationFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && lead.status !== statusFilter) {
        return false;
      }
      // Source filter
      if (sourceFilter !== 'All' && lead.source !== sourceFilter) {
        return false;
      }
      // Search term
      if (effectiveSearch) {
        const matchName = lead.name.toLowerCase().includes(effectiveSearch);
        const matchPhone = lead.phone.toLowerCase().includes(effectiveSearch);
        const matchEmail = lead.email.toLowerCase().includes(effectiveSearch);
        const matchService = lead.interestService.toLowerCase().includes(effectiveSearch);
        if (!matchName && !matchPhone && !matchEmail && !matchService) return false;
      }
      return true;
    });
  }, [leads, currentLocation, searchQuery, localSearch, statusFilter, sourceFilter, locationFilter]);

  const sortedLeads = useMemo(() => {
    const list = [...filteredLeads];
    list.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredLeads, sortField, sortDirection]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedLeads.slice(startIndex, startIndex + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'Instagram':
        return <Badge variant="purple">Instagram</Badge>;
      case 'Website':
        return <Badge variant="blue">Website</Badge>;
      case 'Facebook':
        return <Badge variant="blue">Facebook</Badge>;
      case 'Referral':
        return <Badge variant="gold">Referral</Badge>;
      case 'Google':
        return <Badge variant="green">Google</Badge>;
      case 'Walk In':
        return <Badge variant="gray">Walk In</Badge>;
      default:
        return <Badge variant="gray">{source}</Badge>;
    }
  };

  const getActionMenuItems = (lead: Lead): ActionMenuItem[] => [
    {
      label: 'Mark as Converted',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
      onClick: () => handleStatusChange(lead, 'Converted')
    },
    {
      label: 'Mark as Follow Up',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      onClick: () => handleStatusChange(lead, 'Follow Up')
    },
    {
      label: 'Mark as Dead Lead',
      icon: <UserX className="w-3.5 h-3.5 text-slate-500" />,
      onClick: () => handleStatusChange(lead, 'Dead')
    },
    {
      label: 'Delete Lead',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      isDanger: true,
      divider: true,
      onClick: () => setLeadToDelete(lead)
    }
  ];

  const columns: Column<Lead>[] = [
    {
      key: 'index',
      header: '#',
      width: '48px',
      render: (_, idx) => <span className="text-slate-400 font-medium">{(currentPage - 1) * pageSize + idx + 1}</span>
    },
    {
      key: 'name',
      header: 'LEAD NAME',
      sortable: true,
      render: (lead) => (
        <div>
          <p className="font-bold text-slate-900">{lead.name}</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            {lead.email && <span className="truncate max-w-[140px]">{lead.email}</span>}
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'PHONE',
      render: (lead) => (
        <span className="text-slate-700 font-medium">{lead.phone}</span>
      )
    },
    {
      key: 'source',
      header: 'SOURCE',
      sortable: true,
      render: (lead) => getSourceBadge(lead.source)
    },
    {
      key: 'location',
      header: 'LOCATION',
      sortable: true,
      render: (lead) => <StatusBadge status={lead.location} />
    },
    {
      key: 'interestService',
      header: 'INTEREST / SERVICE',
      sortable: true,
      render: (lead) => (
        <span className="font-medium text-slate-800">{lead.interestService}</span>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      sortable: true,
      render: (lead) => <StatusBadge status={lead.status} />
    },
    {
      key: 'addedOn',
      header: 'ADDED ON',
      sortable: true,
      render: (lead) => (
        <span className="text-slate-600 text-xs">{lead.addedOn}</span>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (lead) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <ActionMenu items={getActionMenuItems(lead)} />
        </div>
      )
    }
  ];

  const activeFiltersCount =
    (statusFilter !== 'All' ? 1 : 0) +
    (sourceFilter !== 'All' ? 1 : 0) +
    (locationFilter !== 'All' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="TOTAL LEADS"
          value={leads.length}
          comparisonText="active pipeline"
          icon={<Target className="w-5 h-5" />}
        />
        <StatCard
          label="FOLLOW UP"
          value={leads.filter((l) => l.status === 'Follow Up').length}
          comparisonText="awaiting contact"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="CONVERTED"
          value={leads.filter((l) => l.status === 'Converted').length}
          comparisonText="converted guests"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="DEAD LEADS"
          value={leads.filter((l) => l.status === 'Dead').length}
          comparisonText="closed inactive"
          icon={<UserX className="w-5 h-5 text-slate-400" />}
        />
        <StatCard
          label="CONVERSION RATE"
          value={leads.length > 0 ? `${((leads.filter((l) => l.status === 'Converted').length / leads.length) * 100).toFixed(1)}%` : '0%'}
          comparisonText="conversion ratio"
          icon={<Percent className="w-5 h-5 text-forest-850" />}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            + Add New Lead
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Import', 'CSV import wizard ready')}
            icon={<Upload className="w-3.5 h-3.5 text-slate-400" />}
          >
            Import Leads
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Export', 'Exporting leads data to CSV')}
            icon={<Download className="w-3.5 h-3.5 text-slate-400" />}
          >
            Export
          </Button>
          <Button
            variant={activeFiltersCount > 0 ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsFilterPanelOpen(true)}
            icon={<Filter className="w-3.5 h-3.5" />}
          >
            Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search leads by name, email, phone..."
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="space-y-3">
        <Table
          columns={columns}
          data={paginatedLeads}
          keyExtractor={(l) => l.id}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable
          selectedIds={selectedIds}
          onSelectAll={() => {
            if (selectedIds.length === paginatedLeads.length) setSelectedIds([]);
            else setSelectedIds(paginatedLeads.map((l) => l.id));
          }}
          onSelectRow={(id) => {
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          isLoading={isLoading}
          emptyTitle="No leads found"
          emptyDescription="Try adjusting status, source, or search keyword."
          emptyAction={
            <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
              Add New Lead
            </Button>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedLeads.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Right-Side Filter Panel with Recharts Donut Summary */}
      <LeadFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        onApply={() => setIsFilterPanelOpen(false)}
        onClear={() => {
          setStatusFilter('All');
          setSourceFilter('All');
          setLocationFilter('All');
        }}
      />

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(leadToDelete)}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteLead}
        title="Delete Lead"
        message={`Are you sure you want to remove ${leadToDelete?.name}?`}
        confirmText="Delete"
        isDanger
      />
    </div>
  );
};

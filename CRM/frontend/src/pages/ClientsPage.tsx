import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  DollarSign,
  TrendingUp,
  Download,
  Upload,
  Filter,
  Eye,
  Calendar,
  FileText,
  MessageSquare,
  FileEdit,
  Trash2,
  Phone,
  Mail
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Avatar } from '../components/ui/Avatar';
import { ActionMenu, ActionMenuItem } from '../components/ui/ActionMenu';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { ClientDetailsDrawer } from '../sections/clients/ClientDetailsDrawer';
import { AddClientModal } from '../sections/clients/AddClientModal';
import { clientService } from '../services/clientService';
import { Client } from '../types';
import { useCrmContext } from '../layouts/CrmShell';
import { useToast } from '../hooks/useToast';

export const ClientsPage: React.FC = () => {
  const { currentLocation, searchQuery } = useCrmContext();
  const { success, info } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedClientForDrawer, setSelectedClientForDrawer] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Pagination & Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('lastVisit');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getClients();
      setClients(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (formData: any) => {
    const newClient = await clientService.createClient(formData);
    setClients((prev) => [newClient, ...prev]);
    success('Client Registered Successfully', `${newClient.name} has been added to the CRM directory.`);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    await clientService.deleteClient(clientToDelete.id);
    setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
    success('Client Removed', `${clientToDelete.name} has been deleted from records.`);
    setClientToDelete(null);
    if (selectedClientForDrawer?.id === clientToDelete.id) {
      setSelectedClientForDrawer(null);
    }
  };

  const handleExport = () => {
    info('Exporting Client Directory', 'Generating secure CSV download of all client records...');
  };

  const handleImport = () => {
    info('Import Wizard', 'Client CSV/Excel batch import wizard ready.');
  };

  // Filter & Search Logic
  const filteredClients = useMemo(() => {
    const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

    return clients.filter((c) => {
      // Location filter
      if (currentLocation !== 'All Locations' && c.location !== currentLocation) {
        return false;
      }
      // Search filter (name, phone, email)
      if (effectiveSearch) {
        const matchName = c.name.toLowerCase().includes(effectiveSearch);
        const matchPhone = c.phone.toLowerCase().includes(effectiveSearch);
        const matchEmail = c.email.toLowerCase().includes(effectiveSearch);
        if (!matchName && !matchPhone && !matchEmail) return false;
      }
      return true;
    });
  }, [clients, currentLocation, searchQuery, localSearch]);

  // Sort logic
  const sortedClients = useMemo(() => {
    const list = [...filteredClients];
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
  }, [filteredClients, sortField, sortDirection]);

  // Pagination slice
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedClients.slice(startIndex, startIndex + pageSize);
  }, [sortedClients, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedClients.length / pageSize) || 1;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedClients.map((c) => c.id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 7 Action Menu Items per reference specification
  const getActionMenuItems = (client: Client): ActionMenuItem[] => [
    {
      label: 'View Client Details',
      icon: <Eye className="w-3.5 h-3.5" />,
      onClick: () => setSelectedClientForDrawer(client)
    },
    {
      label: 'Edit Client',
      icon: <FileEdit className="w-3.5 h-3.5" />,
      onClick: () => setSelectedClientForDrawer(client)
    },
    {
      label: 'Appointment History',
      icon: <Calendar className="w-3.5 h-3.5" />,
      onClick: () => {
        setSelectedClientForDrawer(client);
      }
    },
    {
      label: 'Create Invoice',
      icon: <FileText className="w-3.5 h-3.5" />,
      onClick: () => {
        info('Create Invoice', `Initiating invoice draft for ${client.name}.`);
      }
    },
    {
      label: 'Send Message',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      onClick: () => {
        info('Direct Message', `Opening SMS/Email composer for ${client.name} (${client.phone}).`);
      }
    },
    {
      label: 'Add Note',
      icon: <FileEdit className="w-3.5 h-3.5" />,
      onClick: () => {
        setSelectedClientForDrawer(client);
      }
    },
    {
      label: 'Delete Client',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      isDanger: true,
      divider: true,
      onClick: () => setClientToDelete(client)
    }
  ];

  // Table Columns
  const columns: Column<Client>[] = [
    {
      key: 'index',
      header: '#',
      width: '48px',
      render: (_, idx) => <span className="text-slate-400 font-medium">{(currentPage - 1) * pageSize + idx + 1}</span>
    },
    {
      key: 'name',
      header: 'CLIENT',
      sortable: true,
      render: (client) => (
        <div className="flex items-center gap-3">
          <Avatar name={client.name} src={client.avatar} size="md" />
          <div>
            <p className="font-bold text-slate-900 leading-tight">{client.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">AVS-ID: #{client.id.slice(-4)}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'PHONE',
      render: (client) => (
        <div className="flex items-center gap-1.5 text-slate-700">
          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{client.phone}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'EMAIL',
      render: (client) => (
        <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[200px]">
          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{client.email}</span>
        </div>
      )
    },
    {
      key: 'location',
      header: 'LOCATION',
      sortable: true,
      render: (client) => <StatusBadge status={client.location} />
    },
    {
      key: 'totalVisits',
      header: 'TOTAL VISITS',
      sortable: true,
      align: 'center',
      render: (client) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
          {client.totalVisits} visits
        </span>
      )
    },
    {
      key: 'lastVisit',
      header: 'LAST VISIT',
      sortable: true,
      render: (client) => (
        <div>
          <p className="font-medium text-slate-800">{client.lastVisit}</p>
          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{client.lastService}</p>
        </div>
      )
    },
    {
      key: 'totalSpent',
      header: 'TOTAL SPENT',
      sortable: true,
      align: 'right',
      render: (client) => (
        <span className="font-bold text-slate-900">${client.totalSpent.toFixed(2)}</span>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (client) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedClientForDrawer(client)}
            className="text-xs px-2.5 py-1 h-7 text-slate-600 hover:text-forest-900"
          >
            View
          </Button>
          <ActionMenu items={getActionMenuItems(client)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="TOTAL CLIENTS"
          value={clients.length.toLocaleString()}
          comparisonText="registered guests"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="NEW CLIENTS (THIS MONTH)"
          value={clients.length}
          comparisonText="recent registrations"
          icon={<UserPlus className="w-5 h-5" />}
        />
        <StatCard
          label="RETURNING CLIENTS"
          value={clients.filter((c) => c.totalVisits > 1).length}
          comparisonText="repeat visits"
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatCard
          label="TOTAL SPEND"
          value={`$${clients.reduce((s, c) => s + (c.totalSpent || 0), 0).toFixed(2)}`}
          comparisonText="aggregate revenue"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          label="AVG. SPEND PER CLIENT"
          value={`$${(clients.length > 0 ? clients.reduce((s, c) => s + (c.totalSpent || 0), 0) / clients.length : 0).toFixed(2)}`}
          comparisonText="lifetime average"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        {/* Left Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            + Add New Client
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            icon={<Upload className="w-3.5 h-3.5 text-slate-400" />}
          >
            Import Clients
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-3.5 h-3.5 text-slate-400" />}
          >
            Export
          </Button>
        </div>

        {/* Right Search & Quick Filters */}
        <div className="flex items-center gap-2">
          <div className="w-full sm:w-64">
            <SearchInput
              value={localSearch}
              onChange={setLocalSearch}
              placeholder="Search client by name, phone, email..."
            />
          </div>
        </div>
      </div>

      {/* Main Clients Data Table */}
      <div className="space-y-3">
        <Table
          columns={columns}
          data={paginatedClients}
          keyExtractor={(c) => c.id}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          isLoading={isLoading}
          onRowClick={(c) => setSelectedClientForDrawer(c)}
          emptyTitle="No clients found"
          emptyDescription="No clients matched your selected location, date, or search criteria."
          emptyAction={
            <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
              Add Client
            </Button>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedClients.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Right-Side Client Details Drawer */}
      <ClientDetailsDrawer
        isOpen={Boolean(selectedClientForDrawer)}
        client={selectedClientForDrawer}
        onClose={() => setSelectedClientForDrawer(null)}
        onEdit={(c) => {
          info('Edit Client', `Opened editor for ${c.name}`);
        }}
      />

      {/* Add New Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddClient={handleAddClient}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={Boolean(clientToDelete)}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        title="Delete Client Record"
        message={`Are you sure you want to delete ${clientToDelete?.name}? This client record and their visit history will be removed.`}
        confirmText="Delete Client"
        isDanger
      />
    </div>
  );
};

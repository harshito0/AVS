import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Download,
  Filter,
  Eye,
  Send,
  Printer,
  Trash2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ActionMenu, ActionMenuItem } from '../components/ui/ActionMenu';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { InvoiceDetailsDrawer } from '../sections/invoices/InvoiceDetailsDrawer';
import { CreateInvoiceModal } from '../sections/invoices/CreateInvoiceModal';
import { invoiceService } from '../services/invoiceService';
import { Invoice, InvoiceStatus } from '../types';
import { useCrmContext } from '../layouts/CrmShell';
import { useToast } from '../hooks/useToast';

export const InvoicesPage: React.FC = () => {
  const { currentLocation, searchQuery } = useCrmContext();
  const { success, info } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
  const [selectedInvoiceForDrawer, setSelectedInvoiceForDrawer] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    const newInv = await invoiceService.createInvoice(invoiceData);
    setInvoices((prev) => [newInv, ...prev]);
    success('Invoice Issued', `${newInv.invoiceNo} successfully generated.`);
  };

  const handleStatusChange = async (invoice: Invoice, newStatus: InvoiceStatus) => {
    await invoiceService.updateInvoiceStatus(invoice.id, newStatus);
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, status: newStatus } : inv))
    );
    success('Invoice Status Updated', `${invoice.invoiceNo} marked as ${newStatus}.`);
    if (selectedInvoiceForDrawer?.id === invoice.id) {
      setSelectedInvoiceForDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    await invoiceService.deleteInvoice(invoiceToDelete.id);
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete.id));
    success('Invoice Voided', `${invoiceToDelete.invoiceNo} has been deleted.`);
    setInvoiceToDelete(null);
  };

  const filteredInvoices = useMemo(() => {
    const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

    return invoices.filter((inv) => {
      if (currentLocation !== 'All Locations' && inv.location !== currentLocation) {
        return false;
      }
      if (statusFilter !== 'All' && inv.status !== statusFilter) {
        return false;
      }
      if (effectiveSearch) {
        const matchNo = inv.invoiceNo.toLowerCase().includes(effectiveSearch);
        const matchClient = inv.clientName.toLowerCase().includes(effectiveSearch);
        const matchEmail = inv.clientEmail.toLowerCase().includes(effectiveSearch);
        if (!matchNo && !matchClient && !matchEmail) return false;
      }
      return true;
    });
  }, [invoices, currentLocation, searchQuery, localSearch, statusFilter]);

  const sortedInvoices = useMemo(() => {
    const list = [...filteredInvoices];
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
  }, [filteredInvoices, sortField, sortDirection]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedInvoices.slice(startIndex, startIndex + pageSize);
  }, [sortedInvoices, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedInvoices.length / pageSize) || 1;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getActionMenuItems = (invoice: Invoice): ActionMenuItem[] => [
    {
      label: 'View Details',
      icon: <Eye className="w-3.5 h-3.5" />,
      onClick: () => setSelectedInvoiceForDrawer(invoice)
    },
    {
      label: 'Send by Email',
      icon: <Send className="w-3.5 h-3.5" />,
      onClick: () => success('Sent', `Invoice ${invoice.invoiceNo} dispatched to ${invoice.clientEmail}`)
    },
    {
      label: 'Mark as Paid',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      onClick: () => handleStatusChange(invoice, 'Paid')
    },
    {
      label: 'Mark as Pending',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      onClick: () => handleStatusChange(invoice, 'Pending')
    },
    {
      label: 'Delete Invoice',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      isDanger: true,
      divider: true,
      onClick: () => setInvoiceToDelete(invoice)
    }
  ];

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNo',
      header: 'INVOICE NO.',
      sortable: true,
      render: (inv) => (
        <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          {inv.invoiceNo}
        </span>
      )
    },
    {
      key: 'clientName',
      header: 'CLIENT',
      sortable: true,
      render: (inv) => (
        <div>
          <p className="font-bold text-slate-900">{inv.clientName}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{inv.location} Centre</p>
        </div>
      )
    },
    {
      key: 'date',
      header: 'DATE',
      sortable: true,
      render: (inv) => <span className="text-slate-600">{inv.date}</span>
    },
    {
      key: 'dueDate',
      header: 'DUE DATE',
      sortable: true,
      render: (inv) => <span className="text-slate-600">{inv.dueDate}</span>
    },
    {
      key: 'total',
      header: 'AMOUNT',
      sortable: true,
      align: 'right',
      render: (inv) => (
        <span className="font-bold text-slate-900">${inv.total.toFixed(2)}</span>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      sortable: true,
      render: (inv) => <StatusBadge status={inv.status} />
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (inv) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedInvoiceForDrawer(inv)}
            className="text-xs px-2.5 py-1 h-7"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => success('Sent', `Dispatched to ${inv.clientEmail}`)}
            className="text-xs px-2 py-1 h-7 text-slate-600 hover:text-forest-900"
            icon={<Send className="w-3.5 h-3.5" />}
          />
          <ActionMenu items={getActionMenuItems(inv)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL INVOICES"
          value={invoices.length}
          comparisonText="issued receipts"
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard
          label="PAID"
          value={invoices.filter((i) => i.status === 'Paid').length}
          comparisonText="cleared payments"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          label="PENDING"
          value={invoices.filter((i) => i.status === 'Pending').length}
          comparisonText="awaiting settlement"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          label="OVERDUE"
          value={invoices.filter((i) => i.status === 'Overdue').length}
          comparisonText="past grace period"
          icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            + Create Invoice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => info('Export Invoices', 'Exporting accounting CSV summary...')}
            icon={<Download className="w-3.5 h-3.5 text-slate-400" />}
          >
            Export
          </Button>

          {/* Quick status filters */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-forest-850 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search invoice #, client..."
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="space-y-3">
        <Table
          columns={columns}
          data={paginatedInvoices}
          keyExtractor={(inv) => inv.id}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable
          selectedIds={selectedIds}
          onSelectAll={() => {
            if (selectedIds.length === paginatedInvoices.length) setSelectedIds([]);
            else setSelectedIds(paginatedInvoices.map((inv) => inv.id));
          }}
          onSelectRow={(id) => {
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          isLoading={isLoading}
          onRowClick={(inv) => setSelectedInvoiceForDrawer(inv)}
          emptyTitle="No invoices found"
          emptyDescription="Try adjusting status or search keyword."
          emptyAction={
            <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Create Invoice
            </Button>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedInvoices.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Invoice Details Drawer */}
      <InvoiceDetailsDrawer
        invoice={selectedInvoiceForDrawer}
        isOpen={Boolean(selectedInvoiceForDrawer)}
        onClose={() => setSelectedInvoiceForDrawer(null)}
      />

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInvoice={handleCreateInvoice}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(invoiceToDelete)}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={handleDeleteInvoice}
        title="Delete Invoice"
        message={`Are you sure you want to delete ${invoiceToDelete?.invoiceNo}? This cannot be undone.`}
        confirmText="Delete Invoice"
        isDanger
      />
    </div>
  );
};

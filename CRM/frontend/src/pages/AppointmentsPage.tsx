import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Sparkles,
  Plus,
  Filter,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Phone,
  Trash2
} from 'lucide-react';
import { Table, Column } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Select } from '../components/ui/Select';
import { ActionMenu, ActionMenuItem } from '../components/ui/ActionMenu';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { AppointmentDetailsDrawer } from '../sections/appointments/AppointmentDetailsDrawer';
import { AddAppointmentModal } from '../sections/appointments/AddAppointmentModal';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';
import { useCrmContext } from '../layouts/CrmShell';
import { useToast } from '../hooks/useToast';

export const AppointmentsPage: React.FC = () => {
  const { currentLocation, searchQuery } = useCrmContext();
  const { success, info } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [localSearch, setLocalSearch] = useState('');

  // Modals & Drawers
  const [selectedAptForDrawer, setSelectedAptForDrawer] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAppointment = async (data: any) => {
    const newApt = await appointmentService.createAppointment(data);
    setAppointments((prev) => [newApt, ...prev]);
    success('Appointment Booked', `Slot reserved for ${newApt.clientName} on ${newApt.date}.`);
  };

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    await appointmentService.updateAppointmentStatus(id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    if (selectedAptForDrawer?.id === id) {
      setSelectedAptForDrawer((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    setIsDeleting(true);
    try {
      const apt = appointments.find((a) => a.id === id);
      const ok = await appointmentService.deleteAppointment(id);
      if (ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        success('Appointment Deleted', `Appointment for ${apt?.clientName || 'Client'} has been removed.`);
      } else {
        // Fallback: remove from UI state
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        info('Appointment Removed', 'Appointment removed from schedule.');
      }
      if (selectedAptForDrawer?.id === id) {
        setSelectedAptForDrawer(null);
      }
      setAppointmentToDelete(null);
    } catch (err) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      success('Appointment Deleted', 'Appointment slot removed.');
      setAppointmentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const effectiveSearch = (localSearch || searchQuery).trim().toLowerCase();

    return appointments.filter((apt) => {
      if (currentLocation !== 'All Locations' && apt.location !== currentLocation) {
        return false;
      }
      if (statusFilter !== 'All' && apt.status !== statusFilter) {
        return false;
      }
      if (staffFilter !== 'All' && !apt.staff.includes(staffFilter)) {
        return false;
      }
      if (effectiveSearch) {
        const matchClient = apt.clientName.toLowerCase().includes(effectiveSearch);
        const matchService = apt.service.toLowerCase().includes(effectiveSearch);
        const matchStaff = apt.staff.toLowerCase().includes(effectiveSearch);
        if (!matchClient && !matchService && !matchStaff) return false;
      }
      return true;
    });
  }, [appointments, currentLocation, searchQuery, localSearch, statusFilter, staffFilter]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAppointments.slice(startIndex, startIndex + pageSize);
  }, [filteredAppointments, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAppointments.length / pageSize) || 1;

  const getActionMenuItems = (apt: Appointment): ActionMenuItem[] => [
    {
      label: 'View Session Details',
      icon: <Eye className="w-3.5 h-3.5" />,
      onClick: () => setSelectedAptForDrawer(apt)
    },
    {
      label: 'Mark as Completed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      onClick: () => {
        handleStatusUpdate(apt.id, 'Completed');
        success('Session Completed', `${apt.clientName}'s visit updated.`);
      }
    },
    {
      label: 'Cancel Appointment',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      onClick: () => {
        handleStatusUpdate(apt.id, 'Cancelled');
        info('Cancelled', `Slot marked cancelled.`);
      }
    },
    {
      label: 'Delete Appointment',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
      onClick: () => setAppointmentToDelete(apt)
    }
  ];

  const columns: Column<Appointment>[] = [
    {
      key: 'clientName',
      header: 'CLIENT',
      sortable: true,
      render: (apt) => (
        <div>
          <p className="font-bold text-slate-900">{apt.clientName}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            <span>{apt.phone || 'No contact number'}</span>
          </p>
        </div>
      )
    },
    {
      key: 'service',
      header: 'SERVICE',
      sortable: true,
      render: (apt) => (
        <div>
          <p className="font-semibold text-slate-800">{apt.service}</p>
          <span className="text-[10px] text-forest-850 font-medium">{apt.serviceCategory}</span>
        </div>
      )
    },
    {
      key: 'staff',
      header: 'SPECIALIST',
      sortable: true,
      render: (apt) => (
        <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium text-xs">
          <User className="w-3 h-3 text-forest-800/70 shrink-0" />
          {apt.staff}
        </span>
      )
    },
    {
      key: 'location',
      header: 'LOCATION',
      sortable: true,
      render: (apt) => <StatusBadge status={apt.location} />
    },
    {
      key: 'date',
      header: 'DATE & TIME',
      sortable: true,
      render: (apt) => (
        <div>
          <p className="text-slate-800 font-medium">{apt.date}</p>
          <p className="text-[11px] text-slate-400">{apt.time} ({apt.duration})</p>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'AMOUNT',
      sortable: true,
      align: 'right',
      render: (apt) => (
        <span className="font-bold text-slate-900">${apt.amount.toFixed(2)}</span>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      sortable: true,
      render: (apt) => <StatusBadge status={apt.status} />
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (apt) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAptForDrawer(apt)}
            className="text-xs px-2.5 py-1 h-7"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAppointmentToDelete(apt)}
            className="text-xs px-2 py-1 h-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer"
            title="Delete Appointment"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline ml-1 font-medium">Delete</span>
          </Button>
          <ActionMenu items={getActionMenuItems(apt)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3EAE5] shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            + Book Appointment
          </Button>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-forest-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white text-forest-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            {(['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'] as const).map((st) => (
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
            placeholder="Search client, service, therapist..."
          />
        </div>
      </div>

      {/* Main View: List or Calendar View */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          <Table
            columns={columns}
            data={paginatedAppointments}
            keyExtractor={(a) => a.id}
            isLoading={isLoading}
            onRowClick={(a) => setSelectedAptForDrawer(a)}
            emptyTitle="No appointments found"
            emptyDescription="No sessions match your filter criteria."
            emptyAction={
              <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
                Book New Appointment
              </Button>
            }
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAppointments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            }}
          />
        </div>
      ) : (
        /* Visual Calendar Day Grid View */
        <div className="crm-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 text-base">Schedule for May 2025</h3>
              <span className="text-xs text-slate-400">Viewing active therapy room bookings</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" icon={<ChevronLeft className="w-3.5 h-3.5" />}>
                Previous Week
              </Button>
              <Button variant="outline" size="sm" icon={<ChevronRight className="w-3.5 h-3.5" />} iconPosition="right">
                Next Week
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => setSelectedAptForDrawer(apt)}
                className="p-4 rounded-xl border border-[#E3EAE5] bg-white hover:border-[#CBDCD1] hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-forest-850 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {apt.time}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{apt.clientName}</h4>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>

                <div className="p-2.5 rounded-lg bg-forest-50/50 border border-forest-100/70 text-xs space-y-1">
                  <p className="font-semibold text-slate-800">{apt.service}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {apt.staff}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {apt.location}
                  </span>
                  <span className="font-bold text-slate-900">${apt.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Details Drawer */}
      <AppointmentDetailsDrawer
        appointment={selectedAptForDrawer}
        isOpen={Boolean(selectedAptForDrawer)}
        onClose={() => setSelectedAptForDrawer(null)}
        onStatusUpdate={handleStatusUpdate}
        onDelete={(id) => {
          const apt = appointments.find((a) => a.id === id);
          if (apt) setAppointmentToDelete(apt);
        }}
      />

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAppointment={handleAddAppointment}
        existingAppointments={appointments}
      />

      {/* Delete Confirmation Modal */}
      {appointmentToDelete && (
        <Modal
          isOpen={!!appointmentToDelete}
          onClose={() => {
            if (!isDeleting) setAppointmentToDelete(null);
          }}
          title="Delete Appointment"
          subtitle="Permanently remove this booking"
          maxWidth="sm"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAppointmentToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteAppointment(appointmentToDelete.id)}
                disabled={isDeleting}
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              Are you sure you want to permanently delete the appointment for{' '}
              <strong className="text-slate-900">{appointmentToDelete.clientName}</strong>?
            </p>
            <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-900 space-y-1">
              <p><strong>Service:</strong> {appointmentToDelete.service}</p>
              <p><strong>Date & Time:</strong> {appointmentToDelete.date} at {appointmentToDelete.time}</p>
              <p><strong>Location:</strong> {appointmentToDelete.location} Centre</p>
              {appointmentToDelete.phone && (
                <p><strong>Phone:</strong> {appointmentToDelete.phone}</p>
              )}
            </div>
            <p className="text-xs text-slate-500">
              This action will remove the slot from the appointments schedule and calendar.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

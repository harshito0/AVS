import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useCrmContext } from '../layouts/CrmShell';
import { dashboardApi } from '../services/apiClient';
import { DashboardOverviewData } from '../types';
import { useToast } from '../hooks/useToast';
import { appointmentService } from '../services/appointmentService';
import { clientService } from '../services/clientService';
import { invoiceService } from '../services/invoiceService';

// Modular Dashboard Components
import { KpiCard } from '../sections/dashboard/KpiCard';
import { RevenueOverview } from '../sections/dashboard/RevenueOverview';
import { AppointmentOverview } from '../sections/dashboard/AppointmentOverview';
import { LocationPerformance } from '../sections/dashboard/LocationPerformance';
import { TopServices } from '../sections/dashboard/TopServices';
import { RecentAppointments } from '../sections/dashboard/RecentAppointments';
import { LeadSourceChart } from '../sections/dashboard/LeadSourceChart';
import { QuickActions } from '../sections/dashboard/QuickActions';
import { DashboardSkeleton } from '../sections/dashboard/DashboardSkeleton';
import { DashboardErrorState } from '../sections/dashboard/DashboardErrorState';

// Modals for Quick Actions
import { AddAppointmentModal } from '../sections/appointments/AddAppointmentModal';
import { AddClientModal } from '../sections/clients/AddClientModal';
import { CreateInvoiceModal } from '../sections/invoices/CreateInvoiceModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLocation, dateRange } = useCrmContext();
  const { success, error: toastError, info } = useToast();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardOverviewData | null>(null);

  // Modals state
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  // Fetch Dashboard Overview
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getOverview({
        location: currentLocation,
        dateRange: dateRange,
      });

      if (res.success && res.data) {
        setData(res.data);
      } else {
        const errMsg = (res as any).error?.message || 'Failed to load dashboard data';
        setError(errMsg);
      }
    } catch (err: any) {
      console.error('[DashboardPage] Error loading overview:', err);
      setError('Unable to connect to dashboard API. Please check your backend server.');
    } finally {
      setLoading(false);
    }
  }, [currentLocation, dateRange]);

  // Modal Submission Handlers
  const handleAddAppointment = async (apptData: any) => {
    try {
      await appointmentService.createAppointment(apptData);
      setShowAddAppointment(false);
      success('Treatment Scheduled', 'New appointment recorded in calendar and database.');
      fetchDashboardData();
    } catch (e: any) {
      toastError('Booking Failed', e.message || 'Could not schedule appointment');
    }
  };

  const handleAddClient = async (clientData: any) => {
    try {
      await clientService.createClient(clientData);
      setShowAddClient(false);
      success('Client Profile Created', 'New guest registered in client directory.');
      fetchDashboardData();
    } catch (e: any) {
      toastError('Registration Failed', e.message || 'Could not register client');
    }
  };

  const handleCreateInvoice = async (invData: any) => {
    try {
      await invoiceService.createInvoice(invData);
      setShowCreateInvoice(false);
      success('Invoice Generated', 'Invoice generated and revenue ledger updated.');
      fetchDashboardData();
    } catch (e: any) {
      toastError('Invoice Failed', e.message || 'Could not generate invoice');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-200 rounded-md animate-pulse" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <DashboardErrorState
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  const kpis = data?.kpi;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. Four KPI Cards (Immediately Below Header) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: TOTAL CLIENTS */}
        <KpiCard
          label="TOTAL CLIENTS"
          value={kpis?.totalClients.value ?? 0}
          icon={<Users className="w-5 h-5 text-[#0F5B47]" />}
          iconBgColor="bg-[#F7F4ED]"
          iconColor="text-[#0F5B47]"
          change={kpis?.totalClients.change}
          trend={kpis?.totalClients.trend}
          comparisonText={kpis?.totalClients.comparisonText}
        />

        {/* Card 2: TOTAL APPOINTMENTS */}
        <KpiCard
          label="TOTAL APPOINTMENTS"
          value={kpis?.totalAppointments.value ?? 0}
          icon={<Calendar className="w-5 h-5 text-[#C9A227]" />}
          iconBgColor="bg-[#FAF5EC]"
          iconColor="text-[#C9A227]"
          change={kpis?.totalAppointments.change}
          trend={kpis?.totalAppointments.trend}
          comparisonText={kpis?.totalAppointments.comparisonText}
        />

        {/* Card 3: TODAY'S SALES */}
        <KpiCard
          label="TODAY'S SALES"
          value={kpis?.todaySales.value ?? '$0.00'}
          icon={<DollarSign className="w-5 h-5 text-[#1B6F56]" />}
          iconBgColor="bg-[#F2F8F5]"
          iconColor="text-[#1B6F56]"
          change={kpis?.todaySales.change}
          trend={kpis?.todaySales.trend}
          comparisonText={kpis?.todaySales.comparisonText}
        />

        {/* Card 4: MONTHLY SALES */}
        <KpiCard
          label="MONTHLY SALES"
          value={kpis?.monthlySales.value ?? '$0.00'}
          icon={<TrendingUp className="w-5 h-5 text-[#0F5B47]" />}
          iconBgColor="bg-[#F7F4ED]"
          iconColor="text-[#0F5B47]"
          change={kpis?.monthlySales.change}
          trend={kpis?.monthlySales.trend}
          comparisonText={kpis?.monthlySales.comparisonText}
        />
      </div>

      {/* 2. Analytics Row: Revenue Overview, Appointment Overview, Location Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 xl:col-span-6">
          <RevenueOverview
            data={data?.revenueOverview}
            onPeriodChange={() => fetchDashboardData()}
          />
        </div>
        <div className="lg:col-span-6 xl:col-span-3">
          <AppointmentOverview
            data={data?.appointmentOverview}
          />
        </div>
        <div className="lg:col-span-6 xl:col-span-3">
          <LocationPerformance
            locations={data?.locationPerformance}
          />
        </div>
      </div>

      {/* 3. Operational Row: Top Services, Recent Appointments, Lead Acquisition Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <TopServices
          services={data?.topServices}
        />
        <RecentAppointments
          appointments={data?.recentAppointments}
        />
        <div className="md:col-span-2 xl:col-span-1">
          <LeadSourceChart
            data={data?.leadSources}
          />
        </div>
      </div>

      {/* 4. Quick Actions (Exact 5 Actions) */}
      <QuickActions
        onNewAppointment={() => setShowAddAppointment(true)}
        onNewClient={() => setShowAddClient(true)}
        onNewInvoice={() => setShowCreateInvoice(true)}
        onSendMessage={() => {
          info('Concierge Messaging', 'SMS and automated appointment reminder dispatches are active.');
        }}
      />

      {/* Modals for Direct Action */}
      {showAddAppointment && (
        <AddAppointmentModal
          isOpen={showAddAppointment}
          onClose={() => setShowAddAppointment(false)}
          onAddAppointment={handleAddAppointment}
        />
      )}

      {showAddClient && (
        <AddClientModal
          isOpen={showAddClient}
          onClose={() => setShowAddClient(false)}
          onAddClient={handleAddClient}
        />
      )}

      {showCreateInvoice && (
        <CreateInvoiceModal
          isOpen={showCreateInvoice}
          onClose={() => setShowCreateInvoice(false)}
          onCreateInvoice={handleCreateInvoice}
        />
      )}
    </div>
  );
};

export default DashboardPage;

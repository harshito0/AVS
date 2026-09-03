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
      {/* 1. Welcome / Facility Status Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#0B1F17] via-[#0F291E] to-[#163D2D] text-white border border-[#1E4D38] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white p-2 shadow-lg border border-[#C5A880]/50 shrink-0 flex items-center justify-center">
              <img
                src="/avs_logo.png"
                alt="Aura Vital Star"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold tracking-wide">
                <Sparkles className="w-3 h-3 text-[#E5C583]" />
                Executive Dashboard • {currentLocation}
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-serif">
                Aura Vital Star Rejuvenation Centre
              </h2>
              <p className="text-xs text-emerald-100/70 max-w-xl leading-relaxed">
                Active operational overview for clinical treatments, client acquisition, and Ontario practice billing.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={fetchDashboardData}
              title="Refresh dashboard metrics"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setShowAddAppointment(true)}
              className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#B38F1E] text-forest-950 text-xs font-bold tracking-wide transition-colors shadow-sm cursor-pointer"
            >
              Book Treatment
            </button>
          </div>
        </div>

        {/* Botanical leaf watermark */}
        <div className="absolute right-4 -bottom-6 text-emerald-900/20 text-9xl pointer-events-none select-none font-serif">
          🌿
        </div>
      </div>

      {/* 2. Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: TOTAL CLIENTS */}
        <KpiCard
          label="TOTAL CLIENTS"
          value={kpis?.totalClients.value ?? 0}
          icon={<Users className="w-5 h-5 text-forest-800" />}
          iconBgColor="bg-forest-50"
          iconColor="text-forest-800"
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
          icon={<DollarSign className="w-5 h-5 text-emerald-700" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          change={kpis?.todaySales.change}
          trend={kpis?.todaySales.trend}
          comparisonText={kpis?.todaySales.comparisonText}
        />

        {/* Card 4: MONTHLY SALES */}
        <KpiCard
          label="MONTHLY SALES"
          value={kpis?.monthlySales.value ?? '$0.00'}
          icon={<TrendingUp className="w-5 h-5 text-forest-900" />}
          iconBgColor="bg-forest-100/60"
          iconColor="text-forest-900"
          change={kpis?.monthlySales.change}
          trend={kpis?.monthlySales.trend}
          comparisonText={kpis?.monthlySales.comparisonText}
        />
      </div>

      {/* 3. Analytics Grid: Revenue Overview (2 cols) & Appointment Overview (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueOverview
            data={data?.revenueOverview}
            onPeriodChange={() => fetchDashboardData()}
          />
        </div>
        <div className="lg:col-span-1">
          <AppointmentOverview
            data={data?.appointmentOverview}
          />
        </div>
      </div>

      {/* 4. Three Operational Columns: Location Performance, Top Services, Lead Acquisition */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Location Performance */}
        <LocationPerformance
          locations={data?.locationPerformance}
        />

        {/* Column 2: Top Services */}
        <TopServices
          services={data?.topServices}
        />

        {/* Column 3: Lead Acquisition Source */}
        <LeadSourceChart
          data={data?.leadSources}
        />
      </div>

      {/* 5. Recent Appointments (Full Width / Highlight) */}
      <div className="grid grid-cols-1 gap-6">
        <RecentAppointments
          appointments={data?.recentAppointments}
        />
      </div>

      {/* 6. Quick Actions (Exact 5 Actions) */}
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

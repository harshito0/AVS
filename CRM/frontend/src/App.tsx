import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { CrmShell } from './layouts/CrmShell';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ClientsPage } from './pages/ClientsPage';
import { LeadsPage } from './pages/LeadsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ServicesPage } from './pages/ServicesPage';
import { PackagesPage } from './pages/PackagesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const baseName = import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : undefined;
  return (
    <ToastProvider>
      <BrowserRouter basename={baseName}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CrmShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="admin/dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="admin/appointments" element={<AppointmentsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="gift-cards" element={<GiftCardsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;

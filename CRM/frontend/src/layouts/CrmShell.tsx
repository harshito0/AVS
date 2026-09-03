import React, { useState, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { Location } from '../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Target,
  FileText,
  Gift,
  Image as ImageIcon,
  Sparkles,
  Package,
  BarChart3,
  Settings
} from 'lucide-react';

interface CrmContextType {
  currentLocation: Location;
  setCurrentLocation: (loc: Location) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const useCrmContext = () => {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrmContext must be used within CrmShell');
  return ctx;
};

export const CrmShell: React.FC = () => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<Location>('All Locations');
  const [dateRange, setDateRange] = useState<string>('May 1 – May 31, 2025');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Derive title, subtitle and icon from current route
  const getHeaderInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Holistic overview of appointments, revenue, and clinic operations',
          icon: <LayoutDashboard className="w-5 h-5" />
        };
      case '/appointments':
        return {
          title: 'Appointments',
          subtitle: 'Schedule and manage client treatments across Brampton & Mississauga',
          icon: <Calendar className="w-5 h-5" />
        };
      case '/clients':
        return {
          title: 'Clients',
          subtitle: 'Manage and view all your clients',
          icon: <Users className="w-5 h-5" />
        };
      case '/leads':
        return {
          title: 'Leads',
          subtitle: 'Manage and track all your leads',
          icon: <Target className="w-5 h-5" />
        };
      case '/invoices':
        return {
          title: 'Invoices',
          subtitle: 'Create, manage and send invoices',
          icon: <FileText className="w-5 h-5" />
        };
      case '/gift-cards':
        return {
          title: 'Gift Cards',
          subtitle: 'Create, manage and track gift cards',
          icon: <Gift className="w-5 h-5" />
        };
      case '/gallery':
        return {
          title: 'Gallery Management',
          subtitle: 'Curate luxury spa interior photography and treatment experiences',
          icon: <ImageIcon className="w-5 h-5" />
        };
      case '/services':
        return {
          title: 'Service Catalog',
          subtitle: 'Configure treatments, pricing tiers, and RMT categories',
          icon: <Sparkles className="w-5 h-5" />
        };
      case '/packages':
        return {
          title: 'Wellness Packages',
          subtitle: 'Manage multi-session treatment bundles and promotional combinations',
          icon: <Package className="w-5 h-5" />
        };
      case '/reports':
        return {
          title: 'Reports & Analytics',
          subtitle: 'Financial metrics, customer retention, and therapist performance breakdown',
          icon: <BarChart3 className="w-5 h-5" />
        };
      case '/settings':
        return {
          title: 'Centre Settings',
          subtitle: 'Manage business identity, branch locations, and system preferences',
          icon: <Settings className="w-5 h-5" />
        };
      default:
        return {
          title: 'Aura Vital Star CRM',
          subtitle: 'Luxury Rejuvenation Centre Management',
          icon: <Sparkles className="w-5 h-5" />
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <CrmContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        dateRange,
        setDateRange,
        searchQuery,
        setSearchQuery
      }}
    >
      <div className="min-h-screen bg-[#F5F7F5] flex">
        {/* Fixed Left Sidebar */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-[240px] flex flex-col min-w-0">
          <TopHeader
            title={headerInfo.title}
            subtitle={headerInfo.subtitle}
            icon={headerInfo.icon}
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </CrmContext.Provider>
  );
};

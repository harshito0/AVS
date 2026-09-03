import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { clearToken } from '../services/apiClient';

interface NavItemConfig {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MAIN_NAV: NavItemConfig[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/leads', label: 'Leads', icon: Target },
  { path: '/invoices', label: 'Invoices', icon: FileText },
  { path: '/gift-cards', label: 'Gift Cards', icon: Gift },
];

const WEBSITE_NAV: NavItemConfig[] = [
  { path: '/gallery', label: 'Gallery', icon: ImageIcon },
  { path: '/services', label: 'Services', icon: Sparkles },
  { path: '/packages', label: 'Packages', icon: Package },
];

const SYSTEM_NAV: NavItemConfig[] = [
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = useToast();

  const handleLogout = () => {
    clearToken();
    info('Session Logged Out', 'You have been safely signed out of the CRM session.');
    navigate('/login');
  };

  const renderNavLinks = (items: NavItemConfig[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

      return (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onCloseMobile}
          className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 relative ${
            isActive
              ? 'bg-[#184232] text-white font-semibold shadow-[0_2px_10px_-2px_rgba(0,0,0,0.3)] border border-[#275E48]'
              : 'text-[#A3B8AF] hover:text-white hover:bg-[#123124]'
          }`}
        >
          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#E5C583]' : 'text-[#7D9A8D] group-hover:text-[#C5A880]'}`} />
          <span>{item.label}</span>
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C583] ml-auto shadow-[0_0_8px_#E5C583]" />
          )}
        </NavLink>
      );
    });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#0A1D15] border-r border-[#15382A] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#15382A]">
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group bg-[#081811] hover:bg-[#0c2319] p-2.5 rounded-xl border border-[#C5A880]/30 hover:border-[#C5A880]/70 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden border border-[#C5A880]/50 group-hover:scale-105 transition-transform">
              <img
                src="/avs_logo.png"
                alt="Aura Vital Star"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold tracking-wider text-white leading-tight">
                AURA VITAL STAR
              </div>
              <p className="text-[9px] font-semibold tracking-widest uppercase text-[#E5C583] leading-tight mt-1">
                Rejuvenation Centre
              </p>
              <p className="text-[8px] text-emerald-400 font-medium tracking-tight">
                Wellness Meets Radiance
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 ml-auto"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {/* Main CRM Navigation */}
          <div className="space-y-1">
            {renderNavLinks(MAIN_NAV)}
          </div>

          {/* Website Management Divider & Nav */}
          <div className="pt-2">
            <div className="px-3 pb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B897C]">
                Website Management
              </span>
              <div className="flex-1 h-[1px] bg-[#173A2B]" />
            </div>
            <div className="space-y-1">
              {renderNavLinks(WEBSITE_NAV)}
            </div>
          </div>

          {/* System Navigation */}
          <div className="pt-2">
            <div className="px-3 pb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B897C]">
                Analytics & System
              </span>
              <div className="flex-1 h-[1px] bg-[#173A2B]" />
            </div>
            <div className="space-y-1">
              {renderNavLinks(SYSTEM_NAV)}
            </div>
          </div>
        </div>

        {/* Bottom Wellness Art & Logout */}
        <div className="p-3 border-t border-[#15382A] bg-[#071610] space-y-3">
          {/* Subtle Wellness Visual (Stones, Candle, Botanical Leaves) */}
          <div className="relative rounded-xl p-3 bg-gradient-to-br from-[#102D21] to-[#0A1E16] border border-[#1C4635]/60 overflow-hidden group">
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#071711] border border-[#C5A880]/30 flex items-center justify-center shrink-0 shadow-inner">
                {/* Visual icon for spa stones & glow candle */}
                <span className="text-base" role="img" aria-label="spa stones">🪨</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[#E8D9BF] tracking-wide truncate">
                  Aura Vital Sanctuary
                </p>
                <p className="text-[9px] text-[#7C9A8D] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Botanical Serenity
                </p>
              </div>
            </div>
            {/* Subtle decorative leaf watermark */}
            <div className="absolute -bottom-2 -right-2 text-emerald-800/20 text-4xl pointer-events-none select-none">
              🌿
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#8DA69C] hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

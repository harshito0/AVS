import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Menu,
  CheckCircle2,
  ShieldCheck,
  User,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { LocationSelector } from '../components/ui/LocationSelector';
import { DatePicker } from '../components/ui/DatePicker';
import { SearchInput } from '../components/ui/SearchInput';
import { Avatar } from '../components/ui/Avatar';
import { Location, NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export interface TopHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  currentLocation: Location;
  onLocationChange: (loc: Location) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  icon,
  currentLocation,
  onLocationChange,
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu
}) => {
  const navigate = useNavigate();
  const { info, success } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    success('Notifications cleared', 'All messages marked as read.');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E3EAE5] px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left Side: Title & Description */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {icon && (
            <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-850 shrink-0">
              {icon}
            </div>
          )}

          <div>
            <h1 className="text-xl lg:text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 leading-normal">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Date Range Selector */}
          <DatePicker
            currentRange={dateRange}
            onChange={onDateRangeChange}
          />

          {/* Location Selector */}
          <LocationSelector
            currentLocation={currentLocation}
            onChange={onLocationChange}
          />

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-0.5" />

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="w-9 h-9 rounded-lg border border-[#D9E2DC] bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#E3EAE5] z-50 p-4 animate-scaleUp">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-forest-850 hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2 space-y-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl transition-colors ${
                          n.read ? 'bg-transparent' : 'bg-forest-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <Avatar
                name="Admin Administrator"
                size="sm"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Admin</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">Administrator</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#E3EAE5] z-50 p-2 animate-scaleUp">
                <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white p-0.5 shadow-xs border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    <img src="/avs_logo.png" alt="AVS" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Aura Vital Star Admin</p>
                    <p className="text-[10px] text-slate-500 truncate">management@auravitalstar.ca</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                      Superadmin
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#F2F6F3] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfile(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#F2F6F3] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Centre Settings</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setShowProfile(false);
                      info('Signed out', 'Session closed.');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

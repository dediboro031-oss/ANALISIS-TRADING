import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  User as UserIcon, 
  TrendingUp, 
  ChevronDown, 
  Check, 
  Plus, 
  CheckCheck,
  Flame,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTrading } from '../../context/TradingContext';
import { formatUSD, formatIDR } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenAuthModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu, onOpenAuthModal }) => {
  const { 
    user, 
    switchRole, 
    quotes, 
    darkMode, 
    toggleDarkMode, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    openQuickTrade,
    activeTab,
    setActiveTab
  } = useTrading();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabLabels: Record<string, string> = {
    dashboard: 'Ringkasan Trading',
    signals: 'Sinyal & Analisis Pasar',
    journal: 'Jurnal Transaksi',
    market: 'Terminal Live Pasar',
    analytics: 'Laporan & Omzet',
    calculator: 'Kalkulator Forex',
    admin: 'Konsorsium Tim 100'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0D0D0D] border-b border-[#333] px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0">
      {/* Left side: Mobile Menu + Breadcrumb / Market Ticker */}
      <div className="flex items-center gap-4 overflow-hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#2A2A2A] lg:hidden"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs matching design HTML */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="text-gray-500">Dashboard</span>
          <span className="text-gray-700">/</span>
          <span className="text-[#F2C94C] font-semibold tracking-wide">
            {tabLabels[activeTab] || 'Ringkasan Trading'}
          </span>
        </div>

        {/* Live Market Quote Pill matching design HTML */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('market')}
            className="px-2.5 py-1 bg-[#1A1A1A] border border-[#333] hover:border-[#F2C94C] rounded text-[11px] font-bold text-[#F2C94C] flex items-center gap-1.5 transition-colors"
            title="Buka Watchlist Pasar Hari Ini"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>WATCHLIST HARI INI</span>
          </button>

          {quotes.slice(0, 3).map(q => {
            const isPositive = q.change24h >= 0;
            return (
              <div
                key={q.symbol}
                onClick={() => {
                  setActiveTab('market');
                }}
                className="px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded flex items-center gap-2 text-xs text-white cursor-pointer hover:border-[#F2C94C]/60 transition-colors"
                title={`Lihat Watchlist & Order ${q.symbol}`}
              >
                <span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-bold">{q.symbol}:</span>
                <span className="font-mono">{q.bid}</span>
                <span className={`font-mono text-[11px] ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  ({isPositive ? '+' : ''}{q.change24h}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Role Switcher, Quick Order, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick Order Button matching design HTML DEPOSIT / ACTION button */}
        <button
          onClick={() => openQuickTrade({ pair: 'XAU/USD', type: 'BUY', price: 2384.45 })}
          className="px-3 sm:px-4 py-2 bg-[#F2C94C] hover:opacity-90 text-[#000] text-xs font-bold rounded flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>ORDER CEPAT</span>
        </button>

        {/* Role Switcher Pill */}
        <div className="flex items-center bg-[#1A1A1A] border border-[#333] rounded p-0.5 text-xs">
          <button
            onClick={() => switchRole('USER')}
            className={`px-2.5 py-1 rounded transition-colors font-semibold ${
              user.role === 'USER'
                ? 'bg-[#F2C94C] text-[#000]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            User
          </button>
          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-2.5 py-1 rounded transition-colors font-semibold flex items-center gap-1 ${
              user.role === 'ADMIN'
                ? 'bg-[#F2C94C] text-[#000]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Admin
          </button>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors relative"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F2C94C] ring-2 ring-[#0D0D0D]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-2xl p-0 overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#F2C94C] text-[#000] font-bold px-1.5 py-0.5 rounded">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#F2C94C] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#333]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">
                    Tidak ada notifikasi saat ini
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 hover:bg-[#222] cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#F2C94C]/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#F2C94C] shrink-0" />}
                          {n.title}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 rounded hover:bg-[#2A2A2A] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#F2C94C] text-[#000] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {user.role === 'ADMIN' ? 'AD' : 'TR'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none truncate max-w-[120px]">
                {user.name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                {user.role} • {user.accountType}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-[#333]">
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                <div className="mt-2 bg-[#0D0D0D] border border-[#333] p-2 rounded">
                  <div className="text-[10px] text-gray-500">Saldo Akun:</div>
                  <div className="text-xs font-mono font-bold text-[#F2C94C]">
                    {formatUSD(user.balanceUSD)}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    ≈ {formatIDR(user.balanceUSD * 16250)}
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#222] rounded transition-colors flex items-center justify-between"
                >
                  <span>Ganti Akun / Info Profil</span>
                  <span className="text-[10px] text-[#F2C94C] font-mono">Kelola</span>
                </button>
                <button
                  onClick={() => {
                    switchRole(user.role === 'ADMIN' ? 'USER' : 'ADMIN');
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#222] rounded transition-colors flex items-center justify-between"
                >
                  <span>Beralih ke {user.role === 'ADMIN' ? 'User Biasa' : 'Admin'}</span>
                  <Badge variant="admin" size="sm">{user.role === 'ADMIN' ? 'USER' : 'ADMIN'}</Badge>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

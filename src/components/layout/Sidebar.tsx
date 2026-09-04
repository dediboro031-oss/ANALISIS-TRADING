import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  PieChart, 
  Calculator, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useTrading } from '../../context/TradingContext';
import { NavigationPage } from '../../types';
import { formatIDR, formatUSD } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { activeTab, setActiveTab, user, metrics, openQuickTrade } = useTrading();

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: string; adminOnly?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'signals',
      label: 'Sinyal & Analisis',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: `${metrics.activeSignalsCount} Aktif`
    },
    {
      id: 'journal',
      label: 'Jurnal Transaksi',
      icon: <BookOpen className="w-4 h-4" />,
      badge: `${metrics.openTradesCount} Open`
    },
    {
      id: 'market',
      label: 'Pasar & Watchlist',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Laporan & Omzet',
      icon: <PieChart className="w-4 h-4" />
    },
    {
      id: 'calculator',
      label: 'Kalkulator Forex',
      icon: <Calculator className="w-4 h-4" />
    },
    {
      id: 'admin',
      label: 'Konsorsium Tim 100',
      icon: <Users className="w-4 h-4" />,
      badge: user.role === 'ADMIN' ? 'Admin' : undefined
    }
  ];

  const handleNav = (id: NavigationPage) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#1A1A1A] border-r border-[#333] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#333] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-8 h-8 bg-[#F2C94C] rounded flex items-center justify-center text-[#1A1A1A] shrink-0 shadow-sm">
              <div className="w-4 h-4 border-t-2 border-l-2 border-[#1A1A1A]"></div>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base tracking-tight text-white uppercase">
                  ANALISIS <span className="text-[#F2C94C]">TRADING</span>
                </span>
                <span className="text-[9px] text-gray-400 font-mono tracking-wider">
                  EXNESS FOREX TERMINAL
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
            title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Trade CTA in Sidebar */}
        {!collapsed && (
          <div className="p-3">
            <button
              onClick={() => openQuickTrade({ pair: 'XAU/USD', type: 'BUY', price: 2384.50 })}
              className="w-full bg-[#F2C94C] hover:opacity-90 text-[#000] font-bold py-2 px-3 rounded flex items-center justify-center gap-2 text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              <Flame className="w-4 h-4 text-[#000] fill-[#000]" />
              <span>+ BUKA POSISI BARU</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[10px] font-semibold text-gray-500 px-3 py-1 uppercase tracking-wider">
            {!collapsed ? 'Menu Utama' : '•••'}
          </div>

          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-[#F2C94C] text-[#000] font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`${isActive ? 'text-[#000]' : 'text-gray-400 group-hover:text-white'}`}>
                  {item.icon}
                </div>

                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-[#000] text-[#F2C94C] font-bold' 
                      : 'bg-[#222] text-gray-300 border border-[#333]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Account Info Box at Bottom */}
        <div className="mt-auto p-3 border-t border-[#333] shrink-0">
          {!collapsed ? (
            <div className="bg-[#222] rounded-lg border border-[#333] p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2C94C] text-[#000] flex items-center justify-center font-bold text-xs shrink-0">
                  {user.role === 'ADMIN' ? 'AD' : 'TR'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Online • {user.role}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#333] flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-gray-400">Saldo:</span>
                <span className="font-bold text-[#F2C94C]">{formatUSD(user.balanceUSD)}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-1">
              <div className="w-8 h-8 rounded-full bg-[#F2C94C] text-[#000] flex items-center justify-center text-xs font-bold shadow-sm">
                {user.role === 'ADMIN' ? 'AD' : 'TR'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

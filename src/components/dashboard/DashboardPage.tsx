import React, { useState } from 'react';
import { KpiCards } from './KpiCards';
import { PerformanceChart } from './PerformanceChart';
import { QuickSignalsCard } from './QuickSignalsCard';
import { MarketOverview } from './MarketOverview';
import { XauUsdTodayChart } from '../market/XauUsdTodayChart';
import { XauUsdTodayPriceCard } from '../market/XauUsdTodayPriceCard';
import { useTrading } from '../../context/TradingContext';
import { ShieldCheck, Sparkles, TrendingUp, DollarSign, LineChart, Flame, Coins } from 'lucide-react';
import { formatIDR } from '../../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { user, metrics } = useTrading();
  const [activeChartTab, setActiveChartTab] = useState<'price' | 'chart' | 'performance'>('price');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner / Overview Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-[#1A1A1A] border border-[#333]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
              Selamat Datang, <span className="text-[#F2C94C]">{user.name}</span>
            </h1>
            {user.role === 'ADMIN' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-[#F2C94C] text-[#000] px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                ADMIN PANEL
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Sistem Analisis Trading Forex terintegrasi untuk menentukan waktu optimal entri BUY dan SELL, memantau omzet finansial, dan mengelola portofolio akun.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-[#0D0D0D] border border-[#333] p-2.5 px-3 rounded">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase block font-semibold">Omzet Tim Bulan Ini</span>
            <span className="text-sm font-bold text-[#F2C94C] font-mono">
              Rp 1,15 Miliar
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-[#F2C94C]/10 border border-[#F2C94C]/20 flex items-center justify-center text-[#F2C94C]">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <KpiCards />

      {/* Selector: Harga Hari Ini XAU/USD vs Chart Teknikal vs Performa Ekuitas */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveChartTab('price')}
              className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${
                activeChartTab === 'price'
                  ? 'bg-[#F2C94C] text-[#000] shadow-md font-black'
                  : 'bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>HARGA HARI INI XAU/USD</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveChartTab('chart')}
              className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${
                activeChartTab === 'chart'
                  ? 'bg-[#F2C94C] text-[#000] shadow-md'
                  : 'bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-900" />
              <span>CHART LILIN XAU/USD</span>
            </button>

            <button
              onClick={() => setActiveChartTab('performance')}
              className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all ${
                activeChartTab === 'performance'
                  ? 'bg-[#F2C94C] text-[#000] shadow-md'
                  : 'bg-[#1A1A1A] border border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>KURVA EKUITAS & OMZET</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
            <span>Kamis, 03 September 2026</span>
            <span>•</span>
            <span className="text-[#F2C94C]">Sesi London & New York Aktif</span>
          </div>
        </div>

        {/* Render Selected View */}
        {activeChartTab === 'price' && (
          <div className="space-y-4">
            <XauUsdTodayPriceCard />
            <div className="flex justify-end">
              <button
                onClick={() => setActiveChartTab('chart')}
                className="text-xs font-semibold text-[#F2C94C] hover:underline flex items-center gap-1 bg-[#1A1A1A] border border-[#333] px-3 py-1.5 rounded"
              >
                <Flame className="w-3.5 h-3.5 text-[#F2C94C]" />
                Lihat Chart Teknikal Lengkap Candlestick & RSI XAU/USD →
              </button>
            </div>
          </div>
        )}

        {activeChartTab === 'chart' && (
          <div className="space-y-4">
            <XauUsdTodayChart />
            <div className="flex justify-end">
              <button
                onClick={() => setActiveChartTab('price')}
                className="text-xs font-semibold text-[#F2C94C] hover:underline flex items-center gap-1 bg-[#1A1A1A] border border-[#333] px-3 py-1.5 rounded"
              >
                <Coins className="w-3.5 h-3.5 text-[#F2C94C]" />
                Lihat Ringkasan Harga Hari Ini & Konversi Rupiah Emas →
              </button>
            </div>
          </div>
        )}

        {activeChartTab === 'performance' && (
          <PerformanceChart />
        )}
      </div>

      {/* 2-Column Grid: Quick Signals & Live Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickSignalsCard />
        <MarketOverview />
      </div>
    </div>
  );
};

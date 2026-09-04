import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatIDR, formatUSD } from '../../utils/formatters';
import { Card } from '../common/Card';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Layers, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { metrics, user } = useTrading();

  const isNetProfitPositive = metrics.totalProfitIDR >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TOTAL OMZET TRADING */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333] hover:border-[#444] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            TOTAL OMZET TRADING
          </span>
          <span className="text-[9px] bg-[#F2C94C]/10 text-[#F2C94C] px-1.5 py-0.5 rounded font-mono font-bold">
            IDR
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-[#F2C94C] font-mono mt-1 tracking-tight">
          {formatIDR(metrics.totalOmzetIDR)}
        </div>
        <div className="text-[10px] text-green-500 mt-1 font-medium flex items-center gap-1 font-mono">
          <ArrowUpRight className="w-3 h-3" />
          <span>+14.8% vs bulan lalu</span>
        </div>
      </div>

      {/* 2. NET PROFIT / KEUNTUNGAN */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333] hover:border-[#444] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            KEUNTUNGAN BERSIH (P&L)
          </span>
          <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-mono font-bold">
            {metrics.winningTradesCount} WIN
          </span>
        </div>
        <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 tracking-tight ${
          isNetProfitPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isNetProfitPositive ? '+' : ''}{formatIDR(metrics.totalProfitIDR)}
        </div>
        <div className="text-[10px] text-gray-400 mt-1 font-mono flex items-center gap-1.5">
          <span className={isNetProfitPositive ? 'text-green-500' : 'text-red-500'}>
            {isNetProfitPositive ? '+' : ''}{formatUSD(metrics.totalProfitUSD)}
          </span>
          <span>• Akurasi {metrics.winRate}%</span>
        </div>
      </div>

      {/* 3. WIN RATE & AKURASI */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333] hover:border-[#444] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            WIN RATE SINYAL
          </span>
          <span className="font-mono text-[#F2C94C] font-bold text-xs">{metrics.winRate}%</span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 tracking-tight">
          {metrics.winningTradesCount} <span className="text-xs font-normal text-gray-400">/ {metrics.totalTradesCount} Trades</span>
        </div>
        {/* Progress Bar matching theme */}
        <div className="w-full h-1.5 bg-[#0D0D0D] rounded mt-2.5 overflow-hidden border border-[#333]">
          <div
            className="h-full bg-[#F2C94C] rounded transition-all duration-500"
            style={{ width: `${metrics.winRate}%` }}
          />
        </div>
      </div>

      {/* 4. POSISI AKTIF & SALDO TRADING */}
      <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333] hover:border-[#444] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            POSISI AKTIF & SALDO
          </span>
          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">
            {metrics.openTradesCount} OPEN
          </span>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white font-mono mt-1 tracking-tight">
          {metrics.openTradesCount} <span className="text-xs font-normal text-gray-400">Posisi</span>
        </div>
        <div className="text-[10px] text-[#F2C94C] mt-1 font-mono font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Ekuitas: {formatUSD(user.equityUSD)}</span>
        </div>
      </div>
    </div>
  );
};

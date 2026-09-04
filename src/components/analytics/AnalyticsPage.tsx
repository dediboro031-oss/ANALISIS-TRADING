import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { OMZET_MONTHLY_DATA, PAIR_PERFORMANCE_DATA } from '../../data/initialData';
import { formatIDR, formatUSD } from '../../utils/formatters';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  PieChart as PieIcon, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Award, 
  BarChart3,
  Calendar,
  Layers
} from 'lucide-react';
import { Button } from '../common/Button';

export const AnalyticsPage: React.FC = () => {
  const { metrics, showToast } = useTrading();

  const [timeRange, setTimeRange] = useState<'6M' | '1Y' | 'YTD'>('6M');

  const handleExportReport = () => {
    showToast('Laporan analisis omzet trading berhasil diunduh (PDF/Spreadsheet).', 'success');
  };

  const winLossPieData = [
    { name: 'Winning Trades (Profit)', value: metrics.winningTradesCount, color: '#10B981' },
    { name: 'Losing Trades (Loss)', value: metrics.losingTradesCount, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2.5 uppercase tracking-tight">
            <PieIcon className="w-6 h-6 text-amber-400" />
            <span>Laporan Omzet & Kinerja Portofolio</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Analisis komprehensif metrik bisnis, pertumbuhan omzet bulanan dalam Rupiah (IDR), dan efisiensi sinyal trading.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportReport}
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Unduh Laporan Finansial
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Akumulasi Omzet
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2 tracking-tight">
            {formatIDR(metrics.totalOmzetIDR)}
          </div>
          <div className="text-xs text-neutral-500 mt-1.5 font-mono">
            Volume perdagangan pasar agregat
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Net Profit Bersih (IDR)
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2 tracking-tight">
            +{formatIDR(metrics.totalProfitIDR)}
          </div>
          <div className="text-xs text-neutral-500 mt-1.5 font-mono">
            Setara dengan +{formatUSD(metrics.totalProfitUSD)}
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Rata-Rata Win Rate
          </div>
          <div className="text-2xl font-black text-neutral-100 font-mono mt-2 tracking-tight">
            {metrics.winRate}%
          </div>
          <div className="text-xs text-emerald-400 mt-1.5 font-mono">
            {metrics.winningTradesCount} Menang dari {metrics.totalTradesCount} Transaksi
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Profit Factor Ratio
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-2 tracking-tight">
            2.84
          </div>
          <div className="text-xs text-neutral-500 mt-1.5 font-mono">
            Rasio laba kotor terhadap rugi
          </div>
        </Card>
      </div>

      {/* Charts: Omzet Growth (Bar) and Win/Loss Ratio (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Omzet Monthly Bar Chart */}
        <Card className="lg:col-span-8 p-5">
          <CardHeader
            title="Tren Pertumbuhan Omzet Transaksi Bulanan (IDR)"
            subtitle="Volume omzet perdagangan forex dan komoditas per bulan dalam Rupiah"
          />
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OMZET_MONTHLY_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} />
                <YAxis 
                  stroke="#737373" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `Rp ${(val / 1000000000).toFixed(1)}M`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-neutral-100">{label} 2026</div>
                          <div className="text-amber-400 font-mono font-bold">
                            Omzet: {formatIDR(data.omzetIDR)}
                          </div>
                          <div className="text-emerald-400 font-mono font-bold">
                            Keuntungan: {formatIDR(data.profitIDR)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="omzetIDR" fill="#F5C200" radius={[6, 6, 0, 0]} maxBarSize={44} name="Omzet (IDR)" />
                <Bar dataKey="profitIDR" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={44} name="Profit Bersih (IDR)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Win/Loss Donut Chart */}
        <Card className="lg:col-span-4 p-5 flex flex-col justify-between">
          <CardHeader
            title="Rasio Win vs Loss"
            subtitle="Distribusi keberhasilan sinyal & transaksi"
          />
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {winLossPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
              <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Win Trades
              </span>
              <span className="font-mono font-bold text-emerald-300">{metrics.winningTradesCount} Trades ({metrics.winRate}%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/20 border border-rose-500/20">
              <span className="flex items-center gap-2 text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                Loss Trades
              </span>
              <span className="font-mono font-bold text-rose-300">{metrics.losingTradesCount} Trades ({100 - metrics.winRate}%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Financial Performance Table */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Tabel Rekapitulasi Finansial Bulanan"
          subtitle="Rincian perolehan omzet dan net profit per periode semester pertama 2026"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/80 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <th className="py-3 px-4">Bulan</th>
                <th className="py-3 px-4 text-right">Total Omzet (IDR)</th>
                <th className="py-3 px-4 text-right">Laba Bersih (IDR)</th>
                <th className="py-3 px-4 text-right">Margin Keuntungan</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
                <th className="py-3 px-4 text-center">Status Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {OMZET_MONTHLY_DATA.map((row, idx) => {
                const margin = ((row.profitIDR / row.omzetIDR) * 100).toFixed(1);
                return (
                  <tr key={row.month} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-bold text-neutral-200">
                      {row.month} 2026
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                      {formatIDR(row.omzetIDR)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                      +{formatIDR(row.profitIDR)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-300 font-bold">
                      {margin}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-300">
                      {row.trades} Trades
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans">
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        TARGET TERCAPAI
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend 
} from 'recharts';
import { Card, CardHeader, CardContent } from '../common/Card';
import { OMZET_MONTHLY_DATA, PAIR_PERFORMANCE_DATA } from '../../data/initialData';
import { formatIDR, formatUSD } from '../../utils/formatters';
import { TrendingUp, BarChart2, PieChart as PieIcon } from 'lucide-react';

export const PerformanceChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'omzet' | 'profit' | 'distribution'>('omzet');

  // Daily performance mock points for profit equity curve
  const equityCurveData = [
    { date: '28 Agu', equityUSD: 12200, profitUSD: 180 },
    { date: '29 Agu', equityUSD: 12650, profitUSD: 450 },
    { date: '30 Agu', equityUSD: 13500, profitUSD: 850 },
    { date: '31 Agu', equityUSD: 13900, profitUSD: 400 },
    { date: '01 Sep', equityUSD: 13700, profitUSD: -200 },
    { date: '02 Sep', equityUSD: 14285, profitUSD: 585 },
    { date: '03 Sep', equityUSD: 15420, profitUSD: 1135 }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">Analisis Performa & Pertumbuhan Omzet</span>
            <span className="text-[9px] bg-[#F2C94C]/10 text-[#F2C94C] font-mono font-bold px-2 py-0.5 rounded">
              LIVE METRICS
            </span>
          </div>
        }
        subtitle="Visualisasi pertumbuhan omzet finansial, laba bersih, dan alokasi instrumen forex"
        action={
          <div className="flex items-center bg-[#0D0D0D] border border-[#333] rounded p-0.5 text-xs">
            <button
              onClick={() => setActiveChart('omzet')}
              className={`px-3 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeChart === 'omzet'
                  ? 'bg-[#F2C94C] text-[#000] font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Omzet (IDR)</span>
            </button>
            <button
              onClick={() => setActiveChart('profit')}
              className={`px-3 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeChart === 'profit'
                  ? 'bg-[#F2C94C] text-[#000] font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Laba Bersih</span>
            </button>
            <button
              onClick={() => setActiveChart('distribution')}
              className={`px-3 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeChart === 'distribution'
                  ? 'bg-[#F2C94C] text-[#000] font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Pair</span>
            </button>
          </div>
        }
      />

      <CardContent className="p-4 sm:p-5">
        {/* 1. Bar Chart: Omzet Bulanan */}
        {activeChart === 'omzet' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-medium">Total Volume & Omzet Transaksi Bulanan (IDR)</span>
              <span className="font-mono text-[#F2C94C] font-bold">Puncak: Rp 1,15 Miliar (September)</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={OMZET_MONTHLY_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="month" stroke="#666" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#666" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(val) => `Rp ${(val / 1000000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1A1A1A] border border-[#333] p-3 rounded shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white">{label} 2026</div>
                            <div className="text-[#F2C94C] font-mono font-bold">
                              Omzet: {formatIDR(data.omzetIDR)}
                            </div>
                            <div className="text-green-500 font-mono">
                              Profit: {formatIDR(data.profitIDR)}
                            </div>
                            <div className="text-gray-400 font-mono">
                              Total Transaksi: {data.trades} Trades
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="omzetIDR" fill="#F2C94C" radius={[4, 4, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. Area Chart: Equity Curve / Laba Bersih */}
        {activeChart === 'profit' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-medium">Kurva Pertumbuhan Ekuitas Akun 7 Hari Terakhir</span>
              <span className="font-mono text-green-500 font-bold">+26.4% Pertumbuhan</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurveData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#666" 
                    fontSize={11} 
                    tickLine={false}
                    domain={['dataMin - 500', 'dataMax + 500']}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1A1A1A] border border-[#333] p-3 rounded shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white">{label}</div>
                            <div className="text-green-500 font-mono font-bold">
                              Ekuitas: {formatUSD(data.equityUSD)}
                            </div>
                            <div className="text-[#F2C94C] font-mono">
                              Harian: {data.profitUSD >= 0 ? '+' : ''}${data.profitUSD}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="equityUSD" 
                    stroke="#22C55E" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#profitGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. Pie/Donut Chart: Distribusi Volume Pair */}
        {activeChart === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PAIR_PERFORMANCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {PAIR_PERFORMANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#1A1A1A] border border-[#333] p-2.5 rounded text-xs font-mono">
                            <div className="font-bold text-white">{data.name}</div>
                            <div className="text-[#F2C94C] font-bold">{data.value}% Volume</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Pangsa Pasar & Frekuensi Transaksi
              </h4>
              <div className="space-y-2">
                {PAIR_PERFORMANCE_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2.5 rounded bg-[#0D0D0D] border border-[#333] text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-gray-200">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-gray-300">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { MarketQuote } from '../../types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Flame, 
  ArrowUp, 
  ArrowDown, 
  Activity, 
  Clock, 
  TrendingUp,
  Layers,
  Search,
  Globe,
  SlidersHorizontal,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const MarketWatchPage: React.FC = () => {
  const { quotes, openQuickTrade } = useTrading();

  const [selectedPair, setSelectedPair] = useState<string>('XAU/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('H1');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const currentQuote = quotes.find(q => q.symbol === selectedPair) || quotes[0];
  const isPositive = currentQuote.change24h >= 0;

  // Filter watchlist items
  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchSearch = q.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || q.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [quotes, searchTerm, selectedCategory]);

  // Generate responsive chart data for selected instrument
  const chartData = currentQuote.sparkline.map((val, idx) => ({
    time: `${14 + idx}:00`,
    price: val
  }));

  // Today's range calculation
  const dailyRange = +(currentQuote.high24h - currentQuote.low24h).toFixed(currentQuote.pipPrecision);
  const positionPercent = dailyRange > 0 
    ? Math.min(100, Math.max(0, ((currentQuote.bid - currentQuote.low24h) / dailyRange) * 100))
    : 50;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-lg bg-[#1A1A1A] border border-[#333]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#F2C94C]" />
              <span>HARGA PASAR & TERMINAL WATCHLIST HARI INI</span>
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE TICKING
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white">Kamis, 03 September 2026</span>
            <span>•</span>
            <span>Spread terendah standar institusional Exness tanpa komisi tersembunyi</span>
          </div>
        </div>

        {/* Instant Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'SELL', price: currentQuote.bid })}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>ORDER SELL {currentQuote.symbol}</span>
          </button>
          <button
            onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'BUY', price: currentQuote.ask })}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>ORDER BUY {currentQuote.symbol}</span>
          </button>
        </div>
      </div>

      {/* Main Terminal View: Left Chart + Right Instrument Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Terminal (8 cols) */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-[#333] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header of the instrument */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#333]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded bg-[#0D0D0D] border border-[#333] flex items-center justify-center font-bold text-base text-[#F2C94C] font-mono">
                  {currentQuote.symbol.split('/')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white">{currentQuote.symbol}</h2>
                    <span className={`flex items-center text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      {isPositive ? '+' : ''}{currentQuote.change24h}%
                    </span>
                    <span className="text-[10px] font-mono text-[#F2C94C] bg-[#F2C94C]/10 px-1.5 py-0.5 rounded font-bold">
                      Spread {currentQuote.spread}p
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{currentQuote.name}</div>
                </div>
              </div>

              {/* Timeframe switchers */}
              <div className="flex items-center bg-[#0D0D0D] border border-[#333] rounded p-0.5 text-xs font-mono">
                {['M5', 'M15', 'M30', 'H1', 'H4', 'D1'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-[#F2C94C] text-[#000] font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Price statistics bar with High/Low Range */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 rounded bg-[#0D0D0D] border border-[#333] text-xs font-mono">
              <div>
                <span className="text-[10px] text-gray-500 block font-sans">Bid (Jual Saat Ini):</span>
                <span className="text-sm sm:text-base font-bold text-white">{currentQuote.bid}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block font-sans">Ask (Beli Saat Ini):</span>
                <span className="text-sm sm:text-base font-bold text-white">{currentQuote.ask}</span>
              </div>
              <div>
                <span className="text-[10px] text-green-500 block font-sans">Tertinggi Hari Ini (High):</span>
                <span className="text-xs font-semibold text-green-400">{currentQuote.high24h}</span>
              </div>
              <div>
                <span className="text-[10px] text-red-500 block font-sans">Terendah Hari Ini (Low):</span>
                <span className="text-xs font-semibold text-red-400">{currentQuote.low24h}</span>
              </div>
            </div>

            {/* Daily Position Meter */}
            <div className="mb-3 px-3 py-2 bg-[#141414] rounded border border-[#2A2A2A] text-xs font-mono">
              <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                <span>Rentang Pergerakan Hari Ini (Range: {dailyRange})</span>
                <span className="text-[#F2C94C]">Posisi: {positionPercent.toFixed(0)}% dari rentang terendah</span>
              </div>
              <div className="w-full h-2 bg-[#0D0D0D] rounded border border-[#333] overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-[#F2C94C] to-green-500 rounded transition-all duration-300"
                  style={{ width: `${positionPercent}%` }}
                />
              </div>
            </div>

            {/* Price Chart */}
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="quoteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#22C55E' : '#F2C94C'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isPositive ? '#22C55E' : '#F2C94C'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#666" 
                    fontSize={11} 
                    tickLine={false}
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#1A1A1A] border border-[#333] p-2.5 rounded shadow-xl text-xs font-mono">
                            <div className="font-bold text-white">{label} WIB</div>
                            <div className="text-[#F2C94C] font-bold mt-0.5">
                              Harga: {payload[0].value}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#22C55E' : '#F2C94C'}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#quoteGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick One-Click Order Footer */}
          <div className="mt-4 pt-4 border-t border-[#333] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span>Spread Exness:</span>
              <span className="font-bold text-[#F2C94C] font-mono">{currentQuote.spread} Pips</span>
              <span>•</span>
              <span className="text-gray-500">Eksekusi Instan No Requote</span>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'SELL', price: currentQuote.bid })}
                className="flex-1 sm:flex-none px-5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm text-center"
              >
                SELL @ {currentQuote.bid}
              </button>
              <button
                onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'BUY', price: currentQuote.ask })}
                className="flex-1 sm:flex-none px-5 py-2 rounded bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all shadow-sm text-center"
              >
                BUY @ {currentQuote.ask}
              </button>
            </div>
          </div>
        </div>

        {/* Watchlist selection sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#333] rounded-lg p-4 flex flex-col">
          {/* Watchlist Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#333]">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Daftar Watchlist Hari Ini
              </h3>
              <span className="text-[10px] text-gray-400">
                {filteredQuotes.length} dari {quotes.length} Instrumen
              </span>
            </div>
            <span className="text-[9px] bg-[#F2C94C]/10 text-[#F2C94C] font-mono px-1.5 py-0.5 rounded font-bold">
              LIVE
            </span>
          </div>

          {/* Search Box */}
          <div className="relative my-3">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari simbol (XAU, EUR)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#333] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F2C94C] transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 text-[11px]">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'FOREX_MAJOR', label: 'Forex' },
              { id: 'COMMODITIES', label: 'Komoditas' },
              { id: 'CRYPTO', label: 'Crypto' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-0.5 rounded whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#F2C94C] text-[#000] font-bold'
                    : 'bg-[#0D0D0D] text-gray-400 hover:text-white border border-[#333]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* List of Quotes */}
          <div className="divide-y divide-[#2A2A2A] overflow-y-auto max-h-[500px] pr-1">
            {filteredQuotes.map(q => {
              const isSelected = q.symbol === selectedPair;
              const qPositive = q.change24h >= 0;

              return (
                <div
                  key={q.symbol}
                  onClick={() => setSelectedPair(q.symbol)}
                  className={`p-2.5 cursor-pointer transition-all rounded mt-1.5 first:mt-0 ${
                    isSelected
                      ? 'bg-[#F2C94C]/10 border border-[#F2C94C]/40 text-white'
                      : 'hover:bg-[#222] border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{q.symbol}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#F2C94C]" />}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[130px]">{q.name}</div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-white">{q.bid}</div>
                      <div className={`text-[10px] font-semibold ${qPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {qPositive ? '+' : ''}{q.change24h}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-1.5 pt-1 border-t border-[#2A2A2A]">
                    <span>Spread: {q.spread}p</span>
                    <span>H: {q.high24h} | L: {q.low24h}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

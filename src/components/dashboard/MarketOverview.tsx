import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Clock, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Flame
} from 'lucide-react';

export const MarketOverview: React.FC = () => {
  const { quotes, openQuickTrade, setActiveTab } = useTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filtered quotes based on search and category
  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchSearch = q.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [quotes, searchTerm, selectedCategory]);

  // Market session status
  const sessions = [
    { name: 'London', time: '14:00 - 23:00 WIB', active: true },
    { name: 'New York', time: '19:00 - 04:00 WIB', active: true },
    { name: 'Tokyo', time: '06:00 - 15:00 WIB', active: false },
    { name: 'Sydney', time: '04:00 - 13:00 WIB', active: false },
  ];

  return (
    <Card className="h-full flex flex-col border border-[#333] bg-[#1A1A1A]">
      <CardHeader
        title={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#F2C94C]/10 border border-[#F2C94C]/30 flex items-center justify-center text-[#F2C94C]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  HARGA PASAR WATCHLIST HARI INI
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] bg-green-500/15 text-green-400 font-mono font-bold px-2 py-0.5 rounded border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  LIVE TICKER
                </span>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5 font-sans">
                <span>Kamis, 03 September 2026</span>
                <span>•</span>
                <span className="text-[#F2C94C]">Exness Real-Time Floating Spreads</span>
              </div>
            </div>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-[#0D0D0D] border border-[#333] rounded p-0.5 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table' ? 'bg-[#F2C94C] text-[#000]' : 'text-gray-400 hover:text-white'
                }`}
                title="Tampilan Tabel Detail"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'cards' ? 'bg-[#F2C94C] text-[#000]' : 'text-gray-400 hover:text-white'
                }`}
                title="Tampilan Kartu Cepat"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Link to Full Terminal */}
            <button
              onClick={() => setActiveTab('market')}
              className="px-3 py-1.5 rounded bg-[#F2C94C] text-[#000] hover:bg-[#ffe082] text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
            >
              <span>Terminal Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Market Sessions Strip */}
      <div className="px-4 py-2 bg-[#0D0D0D] border-b border-[#333] flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 font-mono text-gray-400">
          <Clock className="w-3.5 h-3.5 text-[#F2C94C]" />
          <span className="font-sans font-semibold text-gray-300">Status Sesi Pasar:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[10px]">
          {sessions.map(s => (
            <div 
              key={s.name} 
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${
                s.active 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 font-bold' 
                  : 'bg-[#1A1A1A] border-[#333] text-gray-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-green-500 animate-ping' : 'bg-gray-600'}`} />
              <span>{s.name}</span>
              <span className="text-[9px] opacity-75 hidden md:inline">({s.active ? 'BUKA' : 'TUTUP'})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3 bg-[#141414] border-b border-[#333] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'FOREX_MAJOR', label: 'Forex Major' },
            { id: 'COMMODITIES', label: 'Komoditas (Emas/Minyak)' },
            { id: 'CRYPTO', label: 'Kripto' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#F2C94C] text-[#000] font-bold'
                  : 'bg-[#0D0D0D] border border-[#333] text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Cari instrumen (e.g. XAU, EUR)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#333] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F2C94C] transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area: Table or Card Grid */}
      <CardContent className="p-0 flex-1 overflow-x-auto">
        {filteredQuotes.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500">
            Tidak ada instrumen yang cocok dengan pencarian "{searchTerm}".
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#333] bg-[#141414] text-[9px] uppercase font-bold text-gray-500 tracking-widest">
                <th className="py-2.5 px-4">Instrumen</th>
                <th className="py-2.5 px-3 text-right">Bid (Jual)</th>
                <th className="py-2.5 px-3 text-right">Ask (Beli)</th>
                <th className="py-2.5 px-3 text-right">Spread</th>
                <th className="py-2.5 px-3 text-center hidden md:table-cell">Rentang Hari Ini (Low - High)</th>
                <th className="py-2.5 px-3 text-right">24j %</th>
                <th className="py-2.5 px-4 text-center">Tindakan Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A] font-mono">
              {filteredQuotes.map(q => {
                const isPositive = q.change24h >= 0;
                // Calculate position of current bid within 24h range
                const range = q.high24h - q.low24h;
                const position = range > 0 ? Math.min(100, Math.max(0, ((q.bid - q.low24h) / range) * 100)) : 50;

                return (
                  <tr key={q.symbol} className="hover:bg-[#222] transition-colors group">
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-[#0D0D0D] border border-[#333] flex items-center justify-center font-bold text-[11px] text-[#F2C94C] font-mono shrink-0">
                          {q.symbol.split('/')[0].slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{q.symbol}</span>
                            {q.symbol === 'XAU/USD' && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-sans font-semibold">
                                POPULER
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{q.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* BID */}
                    <td className="py-3 px-3 text-right font-bold text-gray-200">
                      <span className="px-1.5 py-0.5 rounded bg-[#0D0D0D] border border-[#333]/50">
                        {q.bid}
                      </span>
                    </td>

                    {/* ASK */}
                    <td className="py-3 px-3 text-right font-bold text-gray-200">
                      <span className="px-1.5 py-0.5 rounded bg-[#0D0D0D] border border-[#333]/50">
                        {q.ask}
                      </span>
                    </td>

                    {/* SPREAD */}
                    <td className="py-3 px-3 text-right text-gray-400">
                      <span className="text-[11px] text-[#F2C94C] font-bold">{q.spread}p</span>
                    </td>

                    {/* 24h RANGE VISUAL */}
                    <td className="py-3 px-3 hidden md:table-cell">
                      <div className="w-36 mx-auto">
                        <div className="flex justify-between text-[9px] text-gray-500 font-mono mb-1">
                          <span>{q.low24h}</span>
                          <span>{q.high24h}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0D0D0D] rounded border border-[#333] relative overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 via-[#F2C94C] to-green-500 rounded"
                            style={{ width: `${position}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 24h CHANGE */}
                    <td className={`py-3 px-3 text-right font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center justify-end gap-0.5">
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{isPositive ? '+' : ''}{q.change24h}%</span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-4 text-center font-sans">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openQuickTrade({ pair: q.symbol, type: 'SELL', price: q.bid })}
                          className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold text-[10px] transition-colors"
                          title={`Buka Order SELL ${q.symbol}`}
                        >
                          SELL
                        </button>
                        <button
                          onClick={() => openQuickTrade({ pair: q.symbol, type: 'BUY', price: q.ask })}
                          className="px-2.5 py-1 rounded bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-500 font-bold text-[10px] transition-colors"
                          title={`Buka Order BUY ${q.symbol}`}
                        >
                          BUY
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Cards View */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredQuotes.map(q => {
              const isPositive = q.change24h >= 0;
              return (
                <div 
                  key={q.symbol}
                  className="bg-[#0D0D0D] border border-[#333] hover:border-[#444] rounded p-3.5 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{q.symbol}</span>
                          <span className="text-[9px] text-[#F2C94C] font-mono bg-[#F2C94C]/10 px-1 py-0.5 rounded">
                            {q.spread}p spread
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 truncate mt-0.5">{q.name}</div>
                      </div>
                      <div className={`text-xs font-mono font-bold flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isPositive ? '+' : ''}{q.change24h}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-[#1A1A1A] rounded border border-[#333] font-mono text-center">
                      <div>
                        <span className="text-[9px] text-gray-500 block font-sans">BID (JUAL)</span>
                        <span className="text-xs font-bold text-white">{q.bid}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block font-sans">ASK (BELI)</span>
                        <span className="text-xs font-bold text-white">{q.ask}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-2">
                      <span>L: {q.low24h}</span>
                      <span>H: {q.high24h}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#2A2A2A]">
                    <button
                      onClick={() => openQuickTrade({ pair: q.symbol, type: 'SELL', price: q.bid })}
                      className="py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold text-xs transition-colors text-center"
                    >
                      SELL
                    </button>
                    <button
                      onClick={() => openQuickTrade({ pair: q.symbol, type: 'BUY', price: q.ask })}
                      className="py-1.5 rounded bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-500 font-bold text-xs transition-colors text-center"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

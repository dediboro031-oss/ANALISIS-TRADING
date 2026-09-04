import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';

export const MarketWatchPage: React.FC = () => {
  const { quotes, openQuickTrade } = useTrading();

  const [selectedPair, setSelectedPair] = useState<string>('XAU/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('H1');

  const currentQuote = quotes.find(q => q.symbol === selectedPair) || quotes[0];
  const isPositive = currentQuote.change24h >= 0;

  // Generate responsive chart data for selected instrument
  const chartData = currentQuote.sparkline.map((val, idx) => ({
    time: `${14 + idx}:00`,
    price: val
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2.5 uppercase tracking-tight">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <span>Pasar & Terminal Live Watchlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Pantau pergerakan harga instrumen mayor Forex, Emas (Gold), dan Kripto dengan spread ultra-rendah Exness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'BUY', price: currentQuote.ask })}
            variant="success"
            className="font-bold text-xs"
          >
            ORDER BUY {currentQuote.symbol}
          </Button>
          <Button
            onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'SELL', price: currentQuote.bid })}
            variant="danger"
            className="font-bold text-xs"
          >
            ORDER SELL {currentQuote.symbol}
          </Button>
        </div>
      </div>

      {/* Main Terminal View: Left Chart + Right Instrument Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Terminal (8 cols) */}
        <Card className="lg:col-span-8 p-5 flex flex-col justify-between">
          <div>
            {/* Header of the instrument */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-400 font-mono">
                  {currentQuote.symbol.split('/')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-neutral-100">{currentQuote.symbol}</h2>
                    <span className={`flex items-center text-xs font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {isPositive ? '+' : ''}{currentQuote.change24h}%
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">{currentQuote.name}</div>
                </div>
              </div>

              {/* Timeframe switchers */}
              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs font-mono">
                {['M5', 'M15', 'M30', 'H1', 'H4', 'D1'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Price statistics bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-500 block">Bid (Jual):</span>
                <span className="text-sm font-bold text-neutral-200">{currentQuote.bid}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">Ask (Beli):</span>
                <span className="text-sm font-bold text-neutral-200">{currentQuote.ask}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">Tertinggi 24j:</span>
                <span className="text-xs font-semibold text-emerald-400">{currentQuote.high24h}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">Terendah 24j:</span>
                <span className="text-xs font-semibold text-rose-400">{currentQuote.low24h}</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="quoteGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#10B981' : '#F5C200'} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isPositive ? '#10B981' : '#F5C200'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="time" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#737373" 
                    fontSize={11} 
                    tickLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                            <div className="font-bold text-neutral-100">{label}</div>
                            <div className="text-amber-400 font-bold mt-0.5">
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
                    stroke={isPositive ? '#10B981' : '#F5C200'}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#quoteGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick One-Click Order Footer */}
          <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              Spread: <span className="font-bold text-amber-400 font-mono">{currentQuote.spread} Pips</span> (Floating)
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'SELL', price: currentQuote.bid })}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
              >
                SELL @ {currentQuote.bid}
              </button>
              <button
                onClick={() => openQuickTrade({ pair: currentQuote.symbol, type: 'BUY', price: currentQuote.ask })}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                BUY @ {currentQuote.ask}
              </button>
            </div>
          </div>
        </Card>

        {/* Watchlist selection sidebar (4 cols) */}
        <Card className="lg:col-span-4 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Daftar Watchlist
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">
              {quotes.length} Instrumen
            </span>
          </div>

          <div className="divide-y divide-neutral-800/80 overflow-y-auto max-h-[480px]">
            {quotes.map(q => {
              const isSelected = q.symbol === selectedPair;
              const qPositive = q.change24h >= 0;

              return (
                <div
                  key={q.symbol}
                  onClick={() => setSelectedPair(q.symbol)}
                  className={`p-3 cursor-pointer transition-colors rounded-xl mt-1.5 first:mt-0 ${
                    isSelected
                      ? 'bg-amber-400/10 border border-amber-400/30'
                      : 'hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-neutral-100 flex items-center gap-1.5">
                        <span>{q.symbol}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">{q.name}</div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-neutral-200">{q.bid}</div>
                      <div className={`text-[11px] font-semibold ${qPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {qPositive ? '+' : ''}{q.change24h}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-2 pt-1 border-t border-neutral-800/40">
                    <span>Spread: {q.spread}p</span>
                    <span>High: {q.high24h}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

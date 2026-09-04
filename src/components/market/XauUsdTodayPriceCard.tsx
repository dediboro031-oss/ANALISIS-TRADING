import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Calculator, 
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { formatUSD, formatIDR } from '../../utils/formatters';

export const XauUsdTodayPriceCard: React.FC = () => {
  const { quotes, openQuickTrade } = useTrading();

  // Find XAU/USD quote
  const goldQuote = quotes.find(q => q.symbol === 'XAU/USD') || quotes[0];
  const isPositive = goldQuote.change24h >= 0;

  // Rate assumptions
  const usdToIdrRate = 16250;
  const troyOunceToGram = 31.1034768;

  // Price per gram calculation
  const pricePerGramUSD = goldQuote.bid / troyOunceToGram;
  const pricePerGramIDR = pricePerGramUSD * usdToIdrRate;
  const pricePerTroyOunceIDR = goldQuote.bid * usdToIdrRate;

  // Quick grams conversion calculator state
  const [calcGrams, setCalcGrams] = useState<number>(10);
  const calcTotalIDR = calcGrams * pricePerGramIDR;
  const calcTotalUSD = calcGrams * pricePerGramUSD;

  // Daily statistics
  const openPrice = 2364.50;
  const dailyRange = +(goldQuote.high24h - goldQuote.low24h).toFixed(2);
  const dailyRangePips = Math.round(dailyRange * 10);
  const positionPercent = dailyRange > 0 
    ? Math.min(100, Math.max(0, ((goldQuote.bid - goldQuote.low24h) / dailyRange) * 100))
    : 50;

  // Key intraday levels
  const keyLevels = [
    { label: 'Resistance 2 (R2)', price: 2405.00, type: 'resistance' },
    { label: 'Tertinggi Hari Ini (R1)', price: goldQuote.high24h, type: 'high' },
    { label: 'Pivot Point (PP)', price: 2378.50, type: 'pivot' },
    { label: 'Terendah Hari Ini (S1)', price: goldQuote.low24h, type: 'low' },
    { label: 'Support 2 (S2)', price: 2350.00, type: 'support' },
  ];

  return (
    <Card className="border border-[#333] bg-[#1A1A1A] overflow-hidden shadow-xl">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-5 bg-[#141414] border-b border-[#333]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded bg-[#0D0D0D] border border-[#F2C94C]/40 flex items-center justify-center text-[#F2C94C] shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight uppercase">
                  HARGA HARI INI XAU/USD (SPOT GOLD / EMAS)
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  REAL-TIME
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                <span className="text-white font-medium">Kamis, 03 September 2026</span>
                <span>•</span>
                <span>Pasar Spot Logam Mulia Internasional</span>
                <span>•</span>
                <span className="text-[#F2C94C] font-mono">Spread Exness: {goldQuote.spread} Pips</span>
              </div>
            </div>
          </div>

          {/* Quick Action Order Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openQuickTrade({ pair: 'XAU/USD', type: 'SELL', price: goldQuote.bid, sl: 2392.50, tp: 2374.00 })}
              className="px-3.5 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>SELL @ ${goldQuote.bid}</span>
            </button>
            <button
              onClick={() => openQuickTrade({ pair: 'XAU/USD', type: 'BUY', price: goldQuote.ask, sl: 2374.00, tp: 2395.00 })}
              className="px-3.5 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>BUY @ ${goldQuote.ask}</span>
            </button>
          </div>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Main Price Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* BID PRICE */}
          <div className="p-4 rounded bg-[#0D0D0D] border border-[#333] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-400 font-sans mb-1">
              <span>HARGA JUAL (BID)</span>
              <span className="text-[10px] text-gray-500">Pasar Langsung</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              ${goldQuote.bid}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              ≈ {formatIDR(pricePerTroyOunceIDR)} / oz
            </div>
          </div>

          {/* ASK PRICE */}
          <div className="p-4 rounded bg-[#0D0D0D] border border-[#333] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-400 font-sans mb-1">
              <span>HARGA BELI (ASK)</span>
              <span className="text-[10px] text-[#F2C94C] font-mono font-bold">Spread {goldQuote.spread}p</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              ${goldQuote.ask}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Spread: ${(goldQuote.ask - goldQuote.bid).toFixed(2)} / oz
            </div>
          </div>

          {/* PERUBAHAN HARI INI */}
          <div className="p-4 rounded bg-[#0D0D0D] border border-[#333] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-400 font-sans mb-1">
              <span>PERUBAHAN 24 JAM</span>
              <span className="text-[10px] text-green-400 font-bold font-sans">BULLISH</span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-mono flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="w-6 h-6 mr-1" /> : <ArrowDownRight className="w-6 h-6 mr-1" />}
              <span>{isPositive ? '+' : ''}{goldQuote.change24h}%</span>
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              +${(goldQuote.bid - openPrice).toFixed(2)} dari harga open
            </div>
          </div>

          {/* HARGA PER GRAM (IDR) */}
          <div className="p-4 rounded bg-[#0D0D0D] border border-[#F2C94C]/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#F2C94C]/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-[#F2C94C] font-bold mb-1">
              <span>KONVERSI SPOT EMAS</span>
              <span className="text-[9px] bg-[#F2C94C]/10 text-[#F2C94C] px-1.5 py-0.5 rounded">
                PER GRAM
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#F2C94C]">
              {formatIDR(Math.round(pricePerGramIDR))}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              ${pricePerGramUSD.toFixed(2)} / gram (Kurs 16.250)
            </div>
          </div>
        </div>

        {/* Intraday Range & Movement Progress Bar */}
        <div className="p-4 rounded bg-[#0D0D0D] border border-[#333]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono mb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-[#F2C94C]" />
              <span className="text-white font-sans font-bold">Rentang Pergerakan Hari Ini (Range Harian):</span>
              <span className="text-[#F2C94C] font-bold">${dailyRange} ({dailyRangePips} Pips)</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-[11px]">
              <span>Open: <strong className="text-white">${openPrice.toFixed(2)}</strong></span>
              <span>Low: <strong className="text-red-400">${goldQuote.low24h}</strong></span>
              <span>High: <strong className="text-green-400">${goldQuote.high24h}</strong></span>
            </div>
          </div>

          {/* Visual Range Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-[#1A1A1A] rounded border border-[#333] relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-[#F2C94C] to-green-500 rounded transition-all duration-300"
                style={{ width: `${positionPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>Terendah: ${goldQuote.low24h}</span>
              <span className="text-[#F2C94C]">Posisi Sekarang: ${goldQuote.bid} ({positionPercent.toFixed(0)}% dari Low)</span>
              <span>Tertinggi: ${goldQuote.high24h}</span>
            </div>
          </div>
        </div>

        {/* 2-Column: Key Intraday Levels + Quick Grams Conversion Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Key Levels (7 cols) */}
          <div className="lg:col-span-7 p-4 rounded bg-[#0D0D0D] border border-[#333]">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-3">
              <span className="flex items-center gap-1.5 uppercase">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Level Kunci Harga Emas Intraday Hari Ini</span>
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Sesi NY / London</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {keyLevels.map(item => (
                <div 
                  key={item.label}
                  className="flex items-center justify-between p-2 rounded bg-[#141414] border border-[#262626] hover:border-[#333] transition-colors"
                >
                  <span className="text-gray-400 font-sans">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${
                      item.type === 'resistance' || item.type === 'high' ? 'text-red-400' :
                      item.type === 'support' || item.type === 'low' ? 'text-green-400' :
                      'text-[#F2C94C]'
                    }`}>
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      ≈ {formatIDR(Math.round(item.price * usdToIdrRate / troyOunceToGram))} / gr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Grams Calculator & Market Sentiment (5 cols) */}
          <div className="lg:col-span-5 p-4 rounded bg-[#0D0D0D] border border-[#333] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-white mb-2.5">
                <span className="flex items-center gap-1.5 uppercase">
                  <Calculator className="w-4 h-4 text-[#F2C94C]" />
                  <span>Kalkulator Emas Hari Ini</span>
                </span>
                <span className="text-[10px] text-gray-500 font-mono">1 oz = 31.10 gr</span>
              </div>

              {/* Quick Gram Selector */}
              <div className="text-[11px] text-gray-400 mb-1.5">Pilih berat emas:</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[1, 5, 10, 25, 50, 100].map(gr => (
                  <button
                    key={gr}
                    onClick={() => setCalcGrams(gr)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                      calcGrams === gr
                        ? 'bg-[#F2C94C] text-[#000]'
                        : 'bg-[#1A1A1A] border border-[#333] text-gray-300 hover:text-white'
                    }`}
                  >
                    {gr} gr
                  </button>
                ))}
              </div>

              {/* Calculated Result Box */}
              <div className="p-3 rounded bg-[#141414] border border-[#262626]">
                <div className="text-[10px] text-gray-500 uppercase font-sans">
                  Total Nilai Spot {calcGrams} Gram Emas:
                </div>
                <div className="text-lg font-bold text-[#F2C94C] font-mono mt-0.5">
                  {formatIDR(Math.round(calcTotalIDR))}
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {formatUSD(calcTotalUSD)} USD
                </div>
              </div>
            </div>

            {/* Sentimen Pasar Hari Ini */}
            <div className="pt-3 border-t border-[#262626]">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span className="font-sans font-semibold">Sentimen Pasar Emas:</span>
                <span className="text-green-400 font-mono font-bold">68% BUY (BULLISH)</span>
              </div>
              <div className="w-full h-2 bg-[#141414] rounded overflow-hidden flex border border-[#333]">
                <div className="bg-green-500 h-full" style={{ width: '68%' }} title="68% Pembeli (Long)" />
                <div className="bg-red-500 h-full" style={{ width: '32%' }} title="32% Penjual (Short)" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                <span className="text-green-500">68% Buyer</span>
                <span className="text-red-500">32% Seller</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

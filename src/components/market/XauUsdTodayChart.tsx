import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { 
  Flame, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Clock, 
  SlidersHorizontal,
  Maximize2,
  Zap,
  Info,
  CheckCircle2,
  ShieldCheck,
  BarChart2,
  DollarSign,
  Activity,
  Target
} from 'lucide-react';
import { formatUSD, formatIDR } from '../../utils/formatters';

interface CandleData {
  time: string;
  session: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20: number;
  ema50: number;
  rsi: number;
}

export const XauUsdTodayChart: React.FC = () => {
  const { quotes, openQuickTrade } = useTrading();

  // Find XAU/USD quote
  const goldQuote = quotes.find(q => q.symbol === 'XAU/USD') || quotes[0];
  const currentPrice = goldQuote.bid;

  const [timeframe, setTimeframe] = useState<'M5' | 'M15' | 'H1' | 'H4'>('H1');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showEMA, setShowEMA] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  // Lot quick order state
  const [quickLot, setQuickLot] = useState<number>(0.10);

  // Today's High Fidelity Hourly Candles for XAU/USD (Kamis, 03 September 2026)
  const candles: CandleData[] = useMemo(() => [
    { time: '00:00', session: 'Asia', open: 2364.50, high: 2366.20, low: 2363.80, close: 2365.10, volume: 1420, ema20: 2364.20, ema50: 2362.80, rsi: 48.2 },
    { time: '02:00', session: 'Asia', open: 2365.10, high: 2367.40, low: 2364.00, close: 2366.80, volume: 1250, ema20: 2364.80, ema50: 2363.10, rsi: 51.4 },
    { time: '04:00', session: 'Asia', open: 2366.80, high: 2367.00, low: 2362.50, close: 2363.90, volume: 1890, ema20: 2364.60, ema50: 2363.30, rsi: 44.1 },
    { time: '06:00', session: 'Tokyo', open: 2363.90, high: 2368.50, low: 2363.20, close: 2367.80, volume: 2240, ema20: 2365.20, ema50: 2363.90, rsi: 52.8 },
    { time: '08:00', session: 'Tokyo', open: 2367.80, high: 2371.40, low: 2366.50, close: 2370.20, volume: 2480, ema20: 2366.10, ema50: 2364.80, rsi: 56.7 },
    { time: '10:00', session: 'Asia', open: 2370.20, high: 2373.80, low: 2369.00, close: 2372.50, volume: 2150, ema20: 2367.30, ema50: 2365.70, rsi: 60.1 },
    { time: '12:00', session: 'Asia', open: 2372.50, high: 2374.00, low: 2370.10, close: 2371.80, volume: 1980, ema20: 2368.10, ema50: 2366.50, rsi: 58.4 },
    { time: '14:00', session: 'London', open: 2371.80, high: 2378.60, low: 2371.20, close: 2377.90, volume: 4680, ema20: 2370.00, ema50: 2367.90, rsi: 67.2 },
    { time: '16:00', session: 'London', open: 2377.90, high: 2382.40, low: 2376.50, close: 2381.50, volume: 5410, ema20: 2372.40, ema50: 2369.60, rsi: 71.5 },
    { time: '18:00', session: 'Overlap', open: 2381.50, high: 2385.00, low: 2379.80, close: 2383.60, volume: 6320, ema20: 2374.90, ema50: 2371.50, rsi: 73.8 },
    { time: '19:30', session: 'New York', open: 2383.60, high: 2392.10, low: 2382.50, close: 2389.40, volume: 8950, ema20: 2377.90, ema50: 2373.80, rsi: 78.2 },
    { time: '21:00', session: 'New York', open: 2389.40, high: 2390.80, low: 2383.50, close: currentPrice, volume: 7420, ema20: 2381.20, ema50: 2376.10, rsi: 58.4 },
  ], [currentPrice]);

  // Key Price Levels for Today
  const keyLevels = {
    resistance2: 2405.00,
    resistance1: 2392.10, // High hari ini
    pivotPoint: 2378.50,
    entrySignal: 2382.50, // Sinyal BUY aktif
    support1: 2362.50,    // Low hari ini
    support2: 2350.00,
    tp1: 2395.00,
    tp2: 2410.00,
    sl: 2374.00
  };

  // Dimensions & Scale Calculations for SVG rendering
  const svgWidth = 740;
  const mainHeight = 270;
  const rsiHeight = 70;
  const padding = { top: 20, right: 65, bottom: 25, left: 15 };

  const minPrice = 2360;
  const maxPrice = 2395;
  const priceRange = maxPrice - minPrice;

  // Coordinate mappers
  const getY = (price: number) => {
    return padding.top + (1 - (price - minPrice) / priceRange) * (mainHeight - padding.top - padding.bottom);
  };

  const candleWidth = (svgWidth - padding.left - padding.right) / candles.length;
  const getX = (index: number) => padding.left + index * candleWidth + candleWidth / 2;

  // Selected or latest candle to show in legend
  const activeDisplay = hoveredCandle || candles[candles.length - 1];

  // Est profit / loss for quick lot
  const estPipValueUSD = quickLot * 10; // Approx $1 per pip on 0.1 lot in gold
  const estPipValueIDR = estPipValueUSD * 16250;

  return (
    <Card className="border border-[#333] bg-[#1A1A1A] overflow-hidden">
      {/* Top Banner: Instrument Identity & Key Stats */}
      <div className="p-4 sm:p-5 border-b border-[#333] bg-[#141414]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#0D0D0D] border border-[#F2C94C]/40 flex items-center justify-center font-black text-xl text-[#F2C94C] font-mono shadow-sm">
              XAU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  CHART XAU/USD HARI INI (GOLD / EMAS)
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#F2C94C]/10 border border-[#F2C94C]/30 text-[#F2C94C] text-[10px] font-mono font-bold">
                  SPOT GOLD
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-green-500/15 text-green-400 font-mono font-bold px-2 py-0.5 rounded border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  PASAR LIVE
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-2">
                <span>Kamis, 03 September 2026</span>
                <span>•</span>
                <span className="text-gray-300">Spread: <strong className="text-[#F2C94C] font-mono">{goldQuote.spread} Pips</strong> (Exness Ultra-Low)</span>
                <span>•</span>
                <span className="text-green-400">Trend Harian: Strong Bullish Momentum</span>
              </div>
            </div>
          </div>

          {/* Current Live Pricing Pill */}
          <div className="flex items-center gap-4 bg-[#0D0D0D] border border-[#333] p-2 sm:px-4 rounded">
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-mono">Bid (Jual)</span>
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                ${goldQuote.bid}
              </span>
            </div>
            <div className="h-7 w-[1px] bg-[#333]" />
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-mono">Ask (Beli)</span>
              <span className="text-base sm:text-lg font-bold font-mono text-white">
                ${goldQuote.ask}
              </span>
            </div>
            <div className="h-7 w-[1px] bg-[#333]" />
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-mono">Perubahan 24j</span>
              <span className="text-sm font-bold font-mono text-green-500 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                +{goldQuote.change24h}%
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Timeframe & Indicators Switchers */}
        <div className="mt-4 pt-3 border-t border-[#262626] flex flex-wrap items-center justify-between gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#333] rounded p-1 text-xs font-mono">
            {(['M5', 'M15', 'H1', 'H4'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-[#F2C94C] text-[#000] font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style: Candlestick vs Line */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0D0D0D] border border-[#333] rounded p-1 text-xs">
              <button
                onClick={() => setChartType('candlestick')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  chartType === 'candlestick'
                    ? 'bg-[#2A2A2A] text-white border border-[#444]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Candlestick (Lilin)
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  chartType === 'line'
                    ? 'bg-[#2A2A2A] text-white border border-[#444]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Garis Area
              </button>
            </div>

            {/* Indicator Toggles */}
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2.5 py-1.5 rounded text-xs border font-medium transition-colors ${
                showEMA
                  ? 'bg-[#F2C94C]/10 border-[#F2C94C]/40 text-[#F2C94C]'
                  : 'bg-[#0D0D0D] border-[#333] text-gray-500'
              }`}
              title="Toggle Moving Average (EMA 20 & EMA 50)"
            >
              EMA 20/50
            </button>
            <button
              onClick={() => setShowLevels(!showLevels)}
              className={`px-2.5 py-1.5 rounded text-xs border font-medium transition-colors ${
                showLevels
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                  : 'bg-[#0D0D0D] border-[#333] text-gray-500'
              }`}
              title="Toggle Support, Resistance, & Entry Signal Levels"
            >
              Support/Resistance
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2.5 py-1.5 rounded text-xs border font-medium transition-colors ${
                showRSI
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-400'
                  : 'bg-[#0D0D0D] border-[#333] text-gray-500'
              }`}
              title="Toggle RSI Oscillator Panel"
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* Dynamic Candle OHLC Info Bar on Hover */}
        <div className="mt-3 p-2 rounded bg-[#0D0D0D] border border-[#262626] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-[#F2C94C] font-bold">Waktu: {activeDisplay.time} WIB ({activeDisplay.session})</span>
            <span>O: <strong className="text-white">${activeDisplay.open}</strong></span>
            <span>H: <strong className="text-green-400">${activeDisplay.high}</strong></span>
            <span>L: <strong className="text-red-400">${activeDisplay.low}</strong></span>
            <span>C: <strong className="text-white">${activeDisplay.close}</strong></span>
            <span>Vol: <strong className="text-gray-300">{activeDisplay.volume.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {showEMA && (
              <>
                <span className="text-[#F2C94C]">EMA20: ${activeDisplay.ema20}</span>
                <span className="text-blue-400">EMA50: ${activeDisplay.ema50}</span>
              </>
            )}
            {showRSI && (
              <span className="text-purple-400">RSI(14): {activeDisplay.rsi}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main SVG Candlestick & Indicator Chart Canvas */}
      <div className="p-3 sm:p-5 bg-[#0D0D0D] relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${showRSI ? mainHeight + rsiHeight : mainHeight}`}
          className="w-full h-auto min-w-[680px] select-none"
        >
          {/* Grid lines horizontal */}
          {[2365, 2370, 2375, 2380, 2385, 2390].map(p => {
            const y = getY(p);
            return (
              <g key={p}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#222222"
                  strokeDasharray="2 2"
                />
                <text
                  x={svgWidth - padding.right + 8}
                  y={y + 3}
                  fill="#777"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${p}.00
                </text>
              </g>
            );
          })}

          {/* Key Support & Resistance Overlay Lines */}
          {showLevels && (
            <>
              {/* Resistance 1 (High Hari Ini) */}
              <g>
                <line
                  x1={padding.left}
                  y1={getY(keyLevels.resistance1)}
                  x2={svgWidth - padding.right}
                  y2={getY(keyLevels.resistance1)}
                  stroke="#EF4444"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <rect
                  x={svgWidth - padding.right + 2}
                  y={getY(keyLevels.resistance1) - 8}
                  width="58"
                  height="16"
                  fill="#EF4444"
                  rx="3"
                />
                <text
                  x={svgWidth - padding.right + 6}
                  y={getY(keyLevels.resistance1) + 4}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  R1: 2392.1
                </text>
              </g>

              {/* Sinyal Entry Buy Area */}
              <g>
                <line
                  x1={padding.left}
                  y1={getY(keyLevels.entrySignal)}
                  x2={svgWidth - padding.right}
                  y2={getY(keyLevels.entrySignal)}
                  stroke="#F2C94C"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <rect
                  x={svgWidth - padding.right + 2}
                  y={getY(keyLevels.entrySignal) - 8}
                  width="58"
                  height="16"
                  fill="#F2C94C"
                  rx="3"
                />
                <text
                  x={svgWidth - padding.right + 5}
                  y={getY(keyLevels.entrySignal) + 4}
                  fill="#000000"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  BUY: 2382.5
                </text>
              </g>

              {/* Support 1 (Low Hari Ini) */}
              <g>
                <line
                  x1={padding.left}
                  y1={getY(keyLevels.support1)}
                  x2={svgWidth - padding.right}
                  y2={getY(keyLevels.support1)}
                  stroke="#22C55E"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <rect
                  x={svgWidth - padding.right + 2}
                  y={getY(keyLevels.support1) - 8}
                  width="58"
                  height="16"
                  fill="#22C55E"
                  rx="3"
                />
                <text
                  x={svgWidth - padding.right + 6}
                  y={getY(keyLevels.support1) + 4}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  S1: 2362.5
                </text>
              </g>
            </>
          )}

          {/* Moving Average Lines (EMA 20 and EMA 50) */}
          {showEMA && (
            <>
              {/* EMA 50 (Blue) */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.8"
                opacity="0.85"
                points={candles.map((c, i) => `${getX(i)},${getY(c.ema50)}`).join(' ')}
              />
              {/* EMA 20 (Gold) */}
              <polyline
                fill="none"
                stroke="#F2C94C"
                strokeWidth="2"
                points={candles.map((c, i) => `${getX(i)},${getY(c.ema20)}`).join(' ')}
              />
            </>
          )}

          {/* Candlesticks or Area Line */}
          {chartType === 'candlestick' ? (
            candles.map((c, i) => {
              const x = getX(i);
              const yHigh = getY(c.high);
              const yLow = getY(c.low);
              const yOpen = getY(c.open);
              const yClose = getY(c.close);
              const isGreen = c.close >= c.open;
              const color = isGreen ? '#22C55E' : '#EF4444';

              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
              const width = candleWidth * 0.65;

              return (
                <g 
                  key={c.time}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCandle(c)}
                  onMouseLeave={() => setHoveredCandle(null)}
                >
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <rect
                    x={x - width / 2}
                    y={bodyTop}
                    width={width}
                    height={bodyHeight}
                    fill={color}
                    rx="1.5"
                    stroke={color}
                    strokeWidth="0.5"
                  />
                  {/* Time label */}
                  <text
                    x={x}
                    y={mainHeight - 5}
                    fill="#666666"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {c.time}
                  </text>
                </g>
              );
            })
          ) : (
            /* Line / Area View */
            <>
              <defs>
                <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F2C94C" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F2C94C" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#goldAreaGrad)"
                points={`
                  ${getX(0)},${mainHeight - padding.bottom} 
                  ${candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')} 
                  ${getX(candles.length - 1)},${mainHeight - padding.bottom}
                `}
              />
              <polyline
                fill="none"
                stroke="#F2C94C"
                strokeWidth="2.5"
                points={candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ')}
              />
              {candles.map((c, i) => (
                <text
                  key={c.time}
                  x={getX(i)}
                  y={mainHeight - 5}
                  fill="#666666"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {c.time}
                </text>
              ))}
            </>
          )}

          {/* Current Live Price Line */}
          <line
            x1={padding.left}
            y1={getY(currentPrice)}
            x2={svgWidth - padding.right}
            y2={getY(currentPrice)}
            stroke="#F2C94C"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* RSI Sub-chart Panel */}
          {showRSI && (
            <g transform={`translate(0, ${mainHeight})`}>
              {/* Divider */}
              <line x1={0} y1={0} x2={svgWidth} y2={0} stroke="#222" strokeWidth="1" />
              <rect x={padding.left} y={10} width={svgWidth - padding.left - padding.right} height={50} fill="#141414" rx="2" />
              
              {/* Overbought (70) and Oversold (30) levels */}
              <line x1={padding.left} y1={25} x2={svgWidth - padding.right} y2={25} stroke="#333" strokeDasharray="2 2" />
              <text x={svgWidth - padding.right + 5} y={28} fill="#EF4444" fontSize="8" fontFamily="monospace">70 OB</text>

              <line x1={padding.left} y1={45} x2={svgWidth - padding.right} y2={45} stroke="#333" strokeDasharray="2 2" />
              <text x={svgWidth - padding.right + 5} y={48} fill="#22C55E" fontSize="8" fontFamily="monospace">30 OS</text>

              {/* RSI Oscillator Line */}
              <polyline
                fill="none"
                stroke="#A855F7"
                strokeWidth="1.8"
                points={candles.map((c, i) => {
                  const x = getX(i);
                  // Map RSI 0 - 100 to y 60 to 10
                  const y = 10 + (1 - c.rsi / 100) * 50;
                  return `${x},${y}`;
                }).join(' ')}
              />

              <text x={padding.left + 5} y={22} fill="#A855F7" fontSize="9" fontWeight="bold" fontFamily="monospace">
                RSI (14): {activeDisplay.rsi}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Sinyal Analisis Masuk & Target Trading Hari Ini */}
      <div className="p-4 sm:p-5 bg-[#141414] border-t border-[#333]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sinyal Aktif Konsorsium */}
          <div className="p-3 bg-[#0D0D0D] border border-[#333] rounded">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[#F2C94C] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#F2C94C]" />
                REKOMENDASI SINYAL HARI INI
              </span>
              <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold text-[10px]">
                CONFIDENCE 92%
              </span>
            </div>
            <div className="text-xs text-gray-300 font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Aksi Disarankan:</span>
                <span className="font-bold text-green-400">BUY @ 2,382.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Target TP 1:</span>
                <span className="text-green-400 font-bold">$2,395.00 (+125 Pips)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Target TP 2:</span>
                <span className="text-green-400 font-bold">$2,410.00 (+275 Pips)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-sans">Stop Loss Proteksi:</span>
                <span className="text-red-400 font-bold">$2,374.00 (-85 Pips)</span>
              </div>
            </div>
          </div>

          {/* Level Kunci Pivot & Support / Resistance */}
          <div className="p-3 bg-[#0D0D0D] border border-[#333] rounded">
            <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>LEVEL KUNCI HARGA EMAS HARI INI</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-1.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[10px] text-gray-500 block font-sans">Resistance 1 (H)</span>
                <span className="font-bold text-red-400">$2,392.10</span>
              </div>
              <div className="p-1.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[10px] text-gray-500 block font-sans">Pivot Point (PP)</span>
                <span className="font-bold text-[#F2C94C]">$2,378.50</span>
              </div>
              <div className="p-1.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[10px] text-gray-500 block font-sans">Support 1 (L)</span>
                <span className="font-bold text-green-400">$2,362.50</span>
              </div>
              <div className="p-1.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[10px] text-gray-500 block font-sans">Rentang Harian</span>
                <span className="font-bold text-white">296 Pips</span>
              </div>
            </div>
          </div>

          {/* 1-Click Order Execution Panel */}
          <div className="p-3 bg-[#0D0D0D] border border-[#333] rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#F2C94C]" />
                  <span>EKSEKUSI CEPAT XAU/USD</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Instant No Requote</span>
              </div>

              {/* Lot Selector */}
              <div className="flex items-center gap-1.5 my-2">
                <span className="text-[11px] text-gray-400">Lot:</span>
                {[0.01, 0.05, 0.10, 0.50, 1.00].map(val => (
                  <button
                    key={val}
                    onClick={() => setQuickLot(val)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                      quickLot === val
                        ? 'bg-[#F2C94C] text-[#000]'
                        : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#333]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-gray-500 font-mono">
                Estimasi 10 Pips: <span className="text-[#F2C94C] font-bold">{formatUSD(estPipValueUSD)}</span> (≈ {formatIDR(estPipValueIDR)})
              </div>
            </div>

            {/* Buy / Sell Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#262626]">
              <button
                onClick={() => openQuickTrade({ pair: 'XAU/USD', type: 'SELL', price: goldQuote.bid, sl: 2392.50, tp: 2374.00 })}
                className="py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <span>SELL @ {goldQuote.bid}</span>
              </button>
              <button
                onClick={() => openQuickTrade({ pair: 'XAU/USD', type: 'BUY', price: goldQuote.ask, sl: 2374.00, tp: 2395.00 })}
                className="py-2 rounded bg-green-600 hover:bg-green-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <span>BUY @ {goldQuote.ask}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

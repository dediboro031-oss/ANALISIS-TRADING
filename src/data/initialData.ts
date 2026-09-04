import { MarketQuote, TradingSignal, TradePosition, TeamMember, UserAccount } from '../types';

export const USD_TO_IDR_RATE = 16250;

export const INITIAL_USER: UserAccount = {
  id: 'usr-001',
  name: 'Bambang Sugianto',
  email: 'bambang.trader@analisistrading.id',
  role: 'ADMIN', // Defaults to ADMIN with full access, can toggle in UI to USER
  accountType: 'LIVE',
  accountNumber: 'EXN-8942104',
  balanceUSD: 14850.50,
  equityUSD: 15420.00,
  leverage: '1:500',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const INITIAL_MARKET_QUOTES: MarketQuote[] = [
  {
    symbol: 'XAU/USD',
    name: 'Gold vs US Dollar (Emas)',
    category: 'COMMODITIES',
    bid: 2384.45,
    ask: 2384.70,
    spread: 0.25,
    change24h: 1.42,
    high24h: 2392.10,
    low24h: 2362.50,
    pipPrecision: 2,
    sparkline: [2365, 2368, 2372, 2370, 2378, 2381, 2384.45]
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro vs US Dollar',
    category: 'FOREX_MAJOR',
    bid: 1.08450,
    ask: 1.08462,
    spread: 1.2,
    change24h: -0.18,
    high24h: 1.08820,
    low24h: 1.08290,
    pipPrecision: 5,
    sparkline: [1.0870, 1.0862, 1.0855, 1.0848, 1.0851, 1.0842, 1.0845]
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound vs US Dollar',
    category: 'FOREX_MAJOR',
    bid: 1.26880,
    ask: 1.26895,
    spread: 1.5,
    change24h: 0.54,
    high24h: 1.27150,
    low24h: 1.26300,
    pipPrecision: 5,
    sparkline: [1.2640, 1.2655, 1.2670, 1.2662, 1.2680, 1.2675, 1.2688]
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar vs Japanese Yen',
    category: 'FOREX_MAJOR',
    bid: 154.620,
    ask: 154.635,
    spread: 1.5,
    change24h: 0.78,
    high24h: 155.100,
    low24h: 153.950,
    pipPrecision: 3,
    sparkline: [154.10, 154.30, 154.25, 154.50, 154.40, 154.60, 154.62]
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar vs US Dollar',
    category: 'FOREX_MAJOR',
    bid: 0.65820,
    ask: 0.65834,
    spread: 1.4,
    change24h: -0.32,
    high24h: 0.66100,
    low24h: 0.65650,
    pipPrecision: 5,
    sparkline: [0.6605, 0.6598, 0.6590, 0.6580, 0.6585, 0.6578, 0.6582]
  },
  {
    symbol: 'USD/CAD',
    name: 'US Dollar vs Canadian Dollar',
    category: 'FOREX_MAJOR',
    bid: 1.37120,
    ask: 1.37138,
    spread: 1.8,
    change24h: 0.12,
    high24h: 1.37450,
    low24h: 1.36900,
    pipPrecision: 5,
    sparkline: [1.3695, 1.3705, 1.3715, 1.3708, 1.3710, 1.3718, 1.3712]
  },
  {
    symbol: 'USD/CHF',
    name: 'US Dollar vs Swiss Franc',
    category: 'FOREX_MAJOR',
    bid: 0.89740,
    ask: 0.89756,
    spread: 1.6,
    change24h: -0.24,
    high24h: 0.90120,
    low24h: 0.89550,
    pipPrecision: 5,
    sparkline: [0.8990, 0.8985, 0.8980, 0.8972, 0.8978, 0.8971, 0.8974]
  },
  {
    symbol: 'NZD/USD',
    name: 'New Zealand vs US Dollar',
    category: 'FOREX_MAJOR',
    bid: 0.61240,
    ask: 0.61258,
    spread: 1.8,
    change24h: 0.45,
    high24h: 0.61480,
    low24h: 0.60920,
    pipPrecision: 5,
    sparkline: [0.6095, 0.6105, 0.6112, 0.6118, 0.6125, 0.6120, 0.6124]
  },
  {
    symbol: 'USOIL',
    name: 'Crude Oil WTI (Minyak Mentah)',
    category: 'COMMODITIES',
    bid: 78.42,
    ask: 78.46,
    spread: 0.04,
    change24h: 1.85,
    high24h: 79.20,
    low24h: 77.10,
    pipPrecision: 2,
    sparkline: [77.2, 77.5, 77.8, 78.1, 78.0, 78.3, 78.42]
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin vs US Dollar',
    category: 'CRYPTO',
    bid: 64850.00,
    ask: 64875.00,
    spread: 25.0,
    change24h: 3.25,
    high24h: 65400.00,
    low24h: 62900.00,
    pipPrecision: 2,
    sparkline: [63100, 63450, 63900, 64200, 64100, 64600, 64850]
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum vs US Dollar',
    category: 'CRYPTO',
    bid: 3480.20,
    ask: 3482.50,
    spread: 2.30,
    change24h: 2.14,
    high24h: 3520.00,
    low24h: 3390.00,
    pipPrecision: 2,
    sparkline: [3410, 3425, 3450, 3465, 3470, 3475, 3480.2]
  }
];

export const INITIAL_SIGNALS: TradingSignal[] = [
  {
    id: 'SIG-8092',
    pair: 'XAU/USD',
    type: 'BUY',
    timeframe: 'H1',
    entryPrice: 2382.50,
    takeProfit1: 2395.00,
    takeProfit2: 2410.00,
    stopLoss: 2374.00,
    pipsTarget: 125,
    riskRewardRatio: '1:3.2',
    confidenceScore: 92,
    status: 'ACTIVE',
    analysisSummary: 'Rejection kuat di area demand support Fibonacci 61.8%. Indikator RSI oversold rebound di angka 34 disertai candle Bullish Engulfing pada timeframe H1. Momentum beli institusional sangat kuat.',
    indicators: {
      rsi: 34.5,
      macdSignal: 'BULLISH',
      trend: 'UPTREND',
      ma200: 'ABOVE',
      bollingerStatus: 'EXPANDING'
    },
    createdAt: '2026-09-03 18:30 WIB',
    author: {
      name: 'Bambang Sugianto',
      role: 'ADMIN',
      badge: 'Chief Technical Analyst'
    }
  },
  {
    id: 'SIG-8091',
    pair: 'EUR/USD',
    type: 'SELL',
    timeframe: 'M30',
    entryPrice: 1.08580,
    takeProfit1: 1.08200,
    takeProfit2: 1.07900,
    stopLoss: 1.08820,
    pipsTarget: 38,
    riskRewardRatio: '1:2.4',
    confidenceScore: 86,
    status: 'ACTIVE',
    analysisSummary: 'Gagal menembus resistance dinamis EMA 100 dan membentuk pola Double Top di area 1.08600. Divergensi negatif terlihat jelas pada oscillator MACD dengan volume seller mendominasi sesi Eropa.',
    indicators: {
      rsi: 68.2,
      macdSignal: 'BEARISH',
      trend: 'DOWNTREND',
      ma200: 'BELOW',
      bollingerStatus: 'NORMAL'
    },
    createdAt: '2026-09-03 17:15 WIB',
    author: {
      name: 'Rian Hendrawan',
      role: 'ADMIN',
      badge: 'Senior Forex Strategist'
    }
  },
  {
    id: 'SIG-8090',
    pair: 'GBP/USD',
    type: 'BUY',
    timeframe: 'H4',
    entryPrice: 1.26500,
    takeProfit1: 1.27200,
    takeProfit2: 1.27800,
    stopLoss: 1.26150,
    pipsTarget: 70,
    riskRewardRatio: '1:2.8',
    confidenceScore: 89,
    status: 'HIT_TP',
    analysisSummary: 'Pola Bullish Flag terkonfirmasi breakout dengan volume tinggi di atas support psikologis 1.26500. Sinyal telah sukses mencapai Target Profit 1 sebesar +70 Pips.',
    indicators: {
      rsi: 58.1,
      macdSignal: 'BULLISH',
      trend: 'UPTREND',
      ma200: 'ABOVE',
      bollingerStatus: 'EXPANDING'
    },
    createdAt: '2026-09-03 12:00 WIB',
    author: {
      name: 'Bambang Sugianto',
      role: 'ADMIN',
      badge: 'Chief Technical Analyst'
    }
  },
  {
    id: 'SIG-8089',
    pair: 'USD/JPY',
    type: 'SELL',
    timeframe: 'H1',
    entryPrice: 155.050,
    takeProfit1: 154.200,
    takeProfit2: 153.500,
    stopLoss: 155.550,
    pipsTarget: 85,
    riskRewardRatio: '1:2.1',
    confidenceScore: 83,
    status: 'ACTIVE',
    analysisSummary: 'Area intervensi psikologis Bank of Japan (BOJ). Formasi Shooting Star di puncak resistance mayor dengan RSI overbought di level 76. Setup ideal untuk swing sell.',
    indicators: {
      rsi: 76.4,
      macdSignal: 'BEARISH',
      trend: 'SIDEWAYS',
      ma200: 'ABOVE',
      bollingerStatus: 'SQUEEZE'
    },
    createdAt: '2026-09-03 14:40 WIB',
    author: {
      name: 'Rian Hendrawan',
      role: 'ADMIN',
      badge: 'Senior Forex Strategist'
    }
  },
  {
    id: 'SIG-8088',
    pair: 'AUD/USD',
    type: 'BUY',
    timeframe: 'M15',
    entryPrice: 0.65750,
    takeProfit1: 0.66100,
    takeProfit2: 0.66400,
    stopLoss: 0.65550,
    pipsTarget: 35,
    riskRewardRatio: '1:2.0',
    confidenceScore: 78,
    status: 'HIT_SL',
    analysisSummary: 'Upaya scalping buy pasca rilis data ketenagakerjaan Australia. Volatilitas tinggi memicu spike penurunan dan menyentuh stop loss sebelum stabil kembali.',
    indicators: {
      rsi: 42.0,
      macdSignal: 'NEUTRAL',
      trend: 'SIDEWAYS',
      ma200: 'BELOW',
      bollingerStatus: 'EXPANDING'
    },
    createdAt: '2026-09-02 09:30 WIB',
    author: {
      name: 'Siti Nurhaliza',
      role: 'ADMIN',
      badge: 'Price Action Specialist'
    }
  }
];

export const INITIAL_TRADES: TradePosition[] = [
  {
    id: 'TRD-1099',
    pair: 'XAU/USD',
    type: 'BUY',
    lots: 1.50,
    openPrice: 2378.20,
    stopLoss: 2372.00,
    takeProfit: 2398.00,
    openTime: '2026-09-03 14:20',
    status: 'OPEN',
    profitUSD: 937.50,
    profitIDR: 937.50 * USD_TO_IDR_RATE,
    omzetIDR: 1.50 * 100 * 2378.20 * USD_TO_IDR_RATE / 100, // Normalized omzet volume IDR
    pips: 62.5,
    outcome: 'PENDING',
    notes: 'Mengikuti sinyal breakout sesi London. Posisi running profit +$937. Stop loss telah digeser ke Breakeven.',
    tags: ['Gold', 'London Breakout', 'Sinyal #8092']
  },
  {
    id: 'TRD-1098',
    pair: 'EUR/USD',
    type: 'SELL',
    lots: 2.00,
    openPrice: 1.08620,
    stopLoss: 1.08900,
    takeProfit: 1.08150,
    openTime: '2026-09-03 16:10',
    status: 'OPEN',
    profitUSD: 340.00,
    profitIDR: 340.00 * USD_TO_IDR_RATE,
    omzetIDR: 2.00 * 100000 * 1.08620 * (USD_TO_IDR_RATE / 1000),
    pips: 17.0,
    outcome: 'PENDING',
    notes: 'Pullback retest EMA 50. Menunggu rilis data klaim pengangguran AS malam ini.',
    tags: ['Forex Major', 'Trend Following']
  },
  {
    id: 'TRD-1097',
    pair: 'GBP/USD',
    type: 'BUY',
    lots: 1.00,
    openPrice: 1.26420,
    closePrice: 1.27120,
    stopLoss: 1.26050,
    takeProfit: 1.27120,
    openTime: '2026-09-02 11:15',
    closeTime: '2026-09-03 12:30',
    status: 'CLOSED',
    profitUSD: 700.00,
    profitIDR: 700.00 * USD_TO_IDR_RATE, // Rp 11.375.000
    omzetIDR: 58500000,
    pips: 70.0,
    outcome: 'WIN',
    notes: 'Target Profit 1 terpenuhi sempurna di 1.27120 sesuai sinyal SIG-8090.',
    tags: ['Sinyal #8090', 'Hit TP', 'Poundsterling']
  },
  {
    id: 'TRD-1096',
    pair: 'USD/JPY',
    type: 'BUY',
    lots: 1.20,
    openPrice: 153.800,
    closePrice: 154.550,
    stopLoss: 153.300,
    takeProfit: 154.550,
    openTime: '2026-09-01 08:45',
    closeTime: '2026-09-02 17:10',
    status: 'CLOSED',
    profitUSD: 585.00,
    profitIDR: 585.00 * USD_TO_IDR_RATE,
    omzetIDR: 45000000,
    pips: 75.0,
    outcome: 'WIN',
    notes: 'Carry trade momentum buy pasca pengumuman suku bunga The Fed.',
    tags: ['Carry Trade', 'Yen']
  },
  {
    id: 'TRD-1095',
    pair: 'AUD/USD',
    type: 'BUY',
    lots: 0.80,
    openPrice: 0.65850,
    closePrice: 0.65600,
    stopLoss: 0.65600,
    takeProfit: 0.66300,
    openTime: '2026-09-01 13:00',
    closeTime: '2026-09-01 19:45',
    status: 'CLOSED',
    profitUSD: -200.00,
    profitIDR: -200.00 * USD_TO_IDR_RATE,
    omzetIDR: 28000000,
    pips: -25.0,
    outcome: 'LOSS',
    notes: 'Kena Stop Loss saat terjadi volatilitas di pembukaan pasar New York.',
    tags: ['Stop Loss', 'Risk Management']
  },
  {
    id: 'TRD-1094',
    pair: 'XAU/USD',
    type: 'SELL',
    lots: 1.00,
    openPrice: 2365.00,
    closePrice: 2351.00,
    stopLoss: 2372.00,
    takeProfit: 2350.00,
    openTime: '2026-08-31 16:30',
    closeTime: '2026-08-31 22:15',
    status: 'CLOSED',
    profitUSD: 1400.00,
    profitIDR: 1400.00 * USD_TO_IDR_RATE,
    omzetIDR: 95000000,
    pips: 140.0,
    outcome: 'WIN',
    notes: 'Gold sell swing di area resistance all-time high. Win profit maksimal.',
    tags: ['Gold Swing', 'Big Win']
  },
  {
    id: 'TRD-1093',
    pair: 'BTC/USD',
    type: 'BUY',
    lots: 0.50,
    openPrice: 62400.00,
    closePrice: 64100.00,
    stopLoss: 61500.00,
    takeProfit: 64500.00,
    openTime: '2026-08-30 10:00',
    closeTime: '2026-08-31 04:00',
    status: 'CLOSED',
    profitUSD: 850.00,
    profitIDR: 850.00 * USD_TO_IDR_RATE,
    omzetIDR: 62000000,
    pips: 170.0,
    outcome: 'WIN',
    notes: 'Breakout konfirmasi tren bullish akhir pekan.',
    tags: ['Crypto', 'Weekend Trade']
  }
];

// Sample 100 team members aggregation data for Admin overview
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'TM-001',
    name: 'Bambang Sugianto (You)',
    email: 'bambang.trader@analisistrading.id',
    role: 'ADMIN',
    accountNumber: 'EXN-8942104',
    status: 'ACTIVE',
    totalTrades: 148,
    winRate: 78.4,
    omzetIDR: 425000000,
    netProfitIDR: 68500000,
    lastActive: 'Baru saja'
  },
  {
    id: 'TM-002',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@forexindo.com',
    role: 'USER',
    accountNumber: 'EXN-8942105',
    status: 'ACTIVE',
    totalTrades: 92,
    winRate: 72.8,
    omzetIDR: 290000000,
    netProfitIDR: 41200000,
    lastActive: '5 menit lalu'
  },
  {
    id: 'TM-003',
    name: 'Dewi Lestari',
    email: 'dewi.trading@gmail.com',
    role: 'USER',
    accountNumber: 'EXN-8942106',
    status: 'ACTIVE',
    totalTrades: 64,
    winRate: 68.7,
    omzetIDR: 195000000,
    netProfitIDR: 28400000,
    lastActive: '12 menit lalu'
  },
  {
    id: 'TM-004',
    name: 'Hendrik Pratama',
    email: 'hendrik.p@investor.co.id',
    role: 'USER',
    accountNumber: 'EXN-8942107',
    status: 'ACTIVE',
    totalTrades: 110,
    winRate: 81.0,
    omzetIDR: 540000000,
    netProfitIDR: 92100000,
    lastActive: '1 jam lalu'
  },
  {
    id: 'TM-005',
    name: 'Siti Nurhaliza',
    email: 'siti.analyst@analisistrading.id',
    role: 'ADMIN',
    accountNumber: 'EXN-8942108',
    status: 'ACTIVE',
    totalTrades: 180,
    winRate: 83.2,
    omzetIDR: 610000000,
    netProfitIDR: 104500000,
    lastActive: '15 menit lalu'
  },
  {
    id: 'TM-006',
    name: 'Reza Kurniawan',
    email: 'reza.kurniawan@surabaya.com',
    role: 'USER',
    accountNumber: 'EXN-8942109',
    status: 'ACTIVE',
    totalTrades: 45,
    winRate: 62.2,
    omzetIDR: 112000000,
    netProfitIDR: 14600000,
    lastActive: '3 jam lalu'
  },
  {
    id: 'TM-007',
    name: 'Agus Setiawan',
    email: 'agus.trader@bandung.net',
    role: 'USER',
    accountNumber: 'EXN-8942110',
    status: 'SUSPENDED',
    totalTrades: 28,
    winRate: 46.4,
    omzetIDR: 68000000,
    netProfitIDR: -4200000,
    lastActive: '2 hari lalu'
  },
  {
    id: 'TM-008',
    name: 'Mega Utami',
    email: 'mega.utami@finansial.id',
    role: 'USER',
    accountNumber: 'EXN-8942111',
    status: 'ACTIVE',
    totalTrades: 87,
    winRate: 74.7,
    omzetIDR: 315000000,
    netProfitIDR: 49800000,
    lastActive: '30 menit lalu'
  }
];

export const OMZET_MONTHLY_DATA = [
  { month: 'Apr', omzetIDR: 420000000, profitIDR: 68000000, trades: 120 },
  { month: 'Mei', omzetIDR: 540000000, profitIDR: 85000000, trades: 145 },
  { month: 'Jun', omzetIDR: 610000000, profitIDR: 98000000, trades: 168 },
  { month: 'Jul', omzetIDR: 780000000, profitIDR: 132000000, trades: 210 },
  { month: 'Agt', omzetIDR: 920000000, profitIDR: 164000000, trades: 245 },
  { month: 'Sep', omzetIDR: 1150000000, profitIDR: 218000000, trades: 280 }
];

export const PAIR_PERFORMANCE_DATA = [
  { name: 'XAU/USD (Gold)', value: 42, color: '#F5C200' },
  { name: 'EUR/USD', value: 24, color: '#3B82F6' },
  { name: 'GBP/USD', value: 18, color: '#10B981' },
  { name: 'USD/JPY', value: 11, color: '#EC4899' },
  { name: 'Lainnya', value: 5, color: '#8B5CF6' }
];

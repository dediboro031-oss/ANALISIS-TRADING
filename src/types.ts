export type UserRole = 'USER' | 'ADMIN';

export type SignalType = 'BUY' | 'SELL';
export type SignalStatus = 'ACTIVE' | 'HIT_TP' | 'HIT_SL' | 'CLOSED' | 'EXPIRED';
export type TimeFrame = 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'D1';

export interface TechnicalIndicators {
  rsi: number;
  macdSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';
  ma200: 'ABOVE' | 'BELOW';
  bollingerStatus: 'EXPANDING' | 'SQUEEZE' | 'NORMAL';
}

export interface TradingSignal {
  id: string;
  pair: string;
  type: SignalType;
  timeframe: TimeFrame;
  entryPrice: number;
  takeProfit1: number;
  takeProfit2: number;
  stopLoss: number;
  pipsTarget: number;
  riskRewardRatio: string;
  confidenceScore: number; // 0 - 100%
  status: SignalStatus;
  analysisSummary: string;
  indicators: TechnicalIndicators;
  createdAt: string;
  updatedAt?: string;
  author: {
    name: string;
    role: UserRole;
    badge: string;
  };
}

export type TradeStatus = 'OPEN' | 'CLOSED';
export type TradeOutcome = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING';

export interface TradePosition {
  id: string;
  pair: string;
  type: SignalType;
  lots: number;
  openPrice: number;
  closePrice?: number;
  stopLoss: number;
  takeProfit: number;
  openTime: string;
  closeTime?: string;
  status: TradeStatus;
  profitUSD: number;
  profitIDR: number;
  omzetIDR: number; // Turnover / Volume translated to IDR
  pips: number;
  outcome: TradeOutcome;
  notes?: string;
  tags?: string[];
}

export interface MarketQuote {
  symbol: string;
  name: string;
  category: 'FOREX_MAJOR' | 'FOREX_MINOR' | 'COMMODITIES' | 'CRYPTO';
  bid: number;
  ask: number;
  spread: number;
  change24h: number;
  high24h: number;
  low24h: number;
  pipPrecision: number;
  sparkline: number[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountNumber: string;
  status: 'ACTIVE' | 'SUSPENDED';
  totalTrades: number;
  winRate: number;
  omzetIDR: number;
  netProfitIDR: number;
  lastActive: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountType: 'LIVE' | 'DEMO';
  accountNumber: string;
  balanceUSD: number;
  equityUSD: number;
  leverage: string;
  avatarUrl: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'SIGNAL' | 'TRADE' | 'ALERT' | 'SYSTEM';
  read: boolean;
  pair?: string;
}

export type NavigationPage = 
  | 'dashboard' 
  | 'signals' 
  | 'journal' 
  | 'market' 
  | 'analytics' 
  | 'calculator' 
  | 'admin';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  TradingSignal, 
  TradePosition, 
  MarketQuote, 
  TeamMember, 
  UserAccount, 
  NavigationPage, 
  AppNotification 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_MARKET_QUOTES, 
  INITIAL_SIGNALS, 
  INITIAL_TRADES, 
  INITIAL_TEAM_MEMBERS, 
  USD_TO_IDR_RATE 
} from '../data/initialData';
import { calculatePips, calculateProfitUSD, convertUsdToIdr } from '../utils/formatters';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface QuickTradePrefill {
  pair: string;
  type: 'BUY' | 'SELL';
  price: number;
  sl?: number;
  tp?: number;
}

interface TradingContextType {
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  switchRole: (newRole: 'USER' | 'ADMIN') => void;
  activeTab: NavigationPage;
  setActiveTab: (tab: NavigationPage) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  quotes: MarketQuote[];
  signals: TradingSignal[];
  trades: TradePosition[];
  teamMembers: TeamMember[];
  notifications: AppNotification[];
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  
  // Quick trade modal trigger
  quickTradePrefill: QuickTradePrefill | null;
  openQuickTrade: (prefill: QuickTradePrefill) => void;
  closeQuickTrade: () => void;

  // Signal CRUD
  addSignal: (signal: Omit<TradingSignal, 'id' | 'createdAt'>) => void;
  updateSignal: (id: string, updated: Partial<TradingSignal>) => void;
  deleteSignal: (id: string) => void;
  
  // Trade CRUD (Jurnal)
  addTrade: (trade: Omit<TradePosition, 'id' | 'openTime'>) => void;
  updateTrade: (id: string, updated: Partial<TradePosition>) => void;
  closeTrade: (id: string, closePrice?: number) => void;
  deleteTrade: (id: string) => void;

  // Team Member CRUD (Admin)
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updated: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  // Notification management
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Metrics
  metrics: {
    totalOmzetIDR: number;
    totalProfitIDR: number;
    totalProfitUSD: number;
    winRate: number;
    totalTradesCount: number;
    winningTradesCount: number;
    losingTradesCount: number;
    openTradesCount: number;
    activeSignalsCount: number;
  };
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local persistence for user, signals, trades, theme
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('at_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState<NavigationPage>('dashboard');
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('at_dark_mode');
    return saved !== null ? JSON.parse(saved) : true; // default dark mode for Exness feel
  });

  const [quotes, setQuotes] = useState<MarketQuote[]>(INITIAL_MARKET_QUOTES);

  const [signals, setSignals] = useState<TradingSignal[]>(() => {
    const saved = localStorage.getItem('at_signals');
    return saved ? JSON.parse(saved) : INITIAL_SIGNALS;
  });

  const [trades, setTrades] = useState<TradePosition[]>(() => {
    const saved = localStorage.getItem('at_trades');
    return saved ? JSON.parse(saved) : INITIAL_TRADES;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('at_team_members');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Sinyal Baru XAU/USD (BUY)',
      message: 'Sinyal baru Gold H1 dengan confidence 92% telah diterbitkan.',
      time: '10m lalu',
      type: 'SIGNAL',
      read: false,
      pair: 'XAU/USD'
    },
    {
      id: 'notif-2',
      title: 'Target Profit Tercapai',
      message: 'Posisi GBP/USD #TRD-1097 sukses menyentuh Take Profit (+70 Pips).',
      time: '2j lalu',
      type: 'TRADE',
      read: false,
      pair: 'GBP/USD'
    },
    {
      id: 'notif-3',
      title: 'Laporan Omzet Tim',
      message: 'Omzet trading konsorsium bulan ini telah menembus Rp 1,15 Miliar.',
      time: '1h lalu',
      type: 'ALERT',
      read: true
    }
  ]);

  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [quickTradePrefill, setQuickTradePrefill] = useState<QuickTradePrefill | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('at_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('at_signals', JSON.stringify(signals));
  }, [signals]);

  useEffect(() => {
    localStorage.setItem('at_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('at_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('at_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Live market price simulation (every 3 seconds subtle realistic ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes(prevQuotes =>
        prevQuotes.map(q => {
          const deltaFactor = (Math.random() - 0.49) * 0.0004;
          const newBid = +(q.bid * (1 + deltaFactor)).toFixed(q.pipPrecision);
          const spreadOffset = q.spread * Math.pow(10, -q.pipPrecision);
          const newAsk = +(newBid + spreadOffset).toFixed(q.pipPrecision);
          const newSpark = [...q.sparkline.slice(1), newBid];
          return {
            ...q,
            bid: newBid,
            ask: newAsk,
            high24h: Math.max(q.high24h, newBid),
            low24h: Math.min(q.low24h, newBid),
            sparkline: newSpark
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const switchRole = (newRole: 'USER' | 'ADMIN') => {
    setUser(prev => ({ ...prev, role: newRole }));
    showToast(`Beralih ke mode akun: ${newRole === 'ADMIN' ? 'ADMIN (Full Access)' : 'USER (Trader)'}`, 'info');
  };

  const openQuickTrade = (prefill: QuickTradePrefill) => {
    setQuickTradePrefill(prefill);
  };

  const closeQuickTrade = () => {
    setQuickTradePrefill(null);
  };

  // Signal CRUD operations
  const addSignal = (newSig: Omit<TradingSignal, 'id' | 'createdAt'>) => {
    const id = `SIG-${Math.floor(8100 + Math.random() * 900)}`;
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
    
    const created: TradingSignal = {
      ...newSig,
      id,
      createdAt: timeStr
    };

    setSignals(prev => [created, ...prev]);
    showToast(`Sinyal baru ${created.pair} (${created.type}) berhasil diterbitkan!`, 'success');
  };

  const updateSignal = (id: string, updated: Partial<TradingSignal>) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, ...updated, updatedAt: new Date().toISOString() } : s));
    showToast(`Sinyal ${id} berhasil diperbarui.`, 'success');
  };

  const deleteSignal = (id: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));
    showToast(`Sinyal ${id} telah dihapus.`, 'info');
  };

  // Trade CRUD operations
  const addTrade = (tradeData: Omit<TradePosition, 'id' | 'openTime'>) => {
    const id = `TRD-${Math.floor(1100 + Math.random() * 900)}`;
    const now = new Date();
    const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

    const newTrade: TradePosition = {
      ...tradeData,
      id,
      openTime: timeStr
    };

    setTrades(prev => [newTrade, ...prev]);

    // Update user balance/equity
    if (newTrade.status === 'CLOSED') {
      setUser(prev => ({
        ...prev,
        balanceUSD: prev.balanceUSD + newTrade.profitUSD,
        equityUSD: prev.equityUSD + newTrade.profitUSD
      }));
    }

    showToast(`Transaksi ${newTrade.pair} (${newTrade.type} ${newTrade.lots} Lot) berhasil dicatat!`, 'success');
  };

  const updateTrade = (id: string, updated: Partial<TradePosition>) => {
    setTrades(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    showToast(`Jurnal transaksi ${id} berhasil diperbarui.`, 'success');
  };

  const closeTrade = (id: string, customClosePrice?: number) => {
    const trade = trades.find(t => t.id === id);
    if (!trade || trade.status === 'CLOSED') return;

    // Find current quote price if not provided
    const quote = quotes.find(q => q.symbol === trade.pair);
    const closePrice = customClosePrice ?? (trade.type === 'BUY' ? (quote?.bid || trade.openPrice) : (quote?.ask || trade.openPrice));
    
    const pips = calculatePips(trade.pair, trade.openPrice, closePrice, trade.type);
    const profitUSD = calculateProfitUSD(trade.pair, trade.lots, pips);
    const profitIDR = convertUsdToIdr(profitUSD);
    const outcome = profitUSD > 0 ? 'WIN' : profitUSD < 0 ? 'LOSS' : 'BREAKEVEN';
    
    const now = new Date();
    const closeTimeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

    setTrades(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          closePrice,
          closeTime: closeTimeStr,
          status: 'CLOSED',
          pips,
          profitUSD,
          profitIDR,
          outcome,
          notes: t.notes ? `${t.notes} (Ditutup pada ${closePrice})` : `Ditutup pada ${closePrice}`
        };
      }
      return t;
    }));

    // Update account balance
    setUser(prev => ({
      ...prev,
      balanceUSD: +(prev.balanceUSD + profitUSD).toFixed(2),
      equityUSD: +(prev.equityUSD + profitUSD).toFixed(2)
    }));

    showToast(`Posisi ${trade.pair} ditutup. Hasil: ${profitUSD >= 0 ? '+' : ''}$${profitUSD.toFixed(2)} (${outcome})`, profitUSD >= 0 ? 'success' : 'warning');
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
    showToast(`Transaksi ${id} telah dihapus dari jurnal.`, 'info');
  };

  // Team Member CRUD
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const id = `TM-0${Math.floor(10 + Math.random() * 90)}`;
    const newMember: TeamMember = { ...memberData, id };
    setTeamMembers(prev => [newMember, ...prev]);
    showToast(`Anggota tim ${newMember.name} berhasil ditambahkan.`, 'success');
  };

  const updateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    showToast(`Data anggota ${id} diperbarui.`, 'success');
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    showToast(`Anggota tim telah dihapus.`, 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Semua notifikasi telah ditandai dibaca.', 'info');
  };

  // Aggregated Metrics
  const metrics = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'CLOSED');
    const winningTrades = closedTrades.filter(t => t.outcome === 'WIN');
    const losingTrades = closedTrades.filter(t => t.outcome === 'LOSS');
    const openTrades = trades.filter(t => t.status === 'OPEN');
    const activeSignals = signals.filter(s => s.status === 'ACTIVE');

    const totalProfitUSD = trades.reduce((acc, t) => acc + t.profitUSD, 0);
    const totalProfitIDR = trades.reduce((acc, t) => acc + t.profitIDR, 0);
    const totalOmzetIDR = trades.reduce((acc, t) => acc + t.omzetIDR, 0);

    const winRate = closedTrades.length > 0 
      ? Math.round((winningTrades.length / closedTrades.length) * 100) 
      : 0;

    return {
      totalOmzetIDR,
      totalProfitIDR,
      totalProfitUSD,
      winRate,
      totalTradesCount: trades.length,
      winningTradesCount: winningTrades.length,
      losingTradesCount: losingTrades.length,
      openTradesCount: openTrades.length,
      activeSignalsCount: activeSignals.length
    };
  }, [trades, signals]);

  return (
    <TradingContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        activeTab,
        setActiveTab,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        quotes,
        signals,
        trades,
        teamMembers,
        notifications,
        toast,
        showToast,
        quickTradePrefill,
        openQuickTrade,
        closeQuickTrade,
        addSignal,
        updateSignal,
        deleteSignal,
        addTrade,
        updateTrade,
        closeTrade,
        deleteTrade,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        metrics
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

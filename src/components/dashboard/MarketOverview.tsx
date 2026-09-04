import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { ArrowUpRight, ArrowDownRight, Globe, ArrowUp, ArrowDown } from 'lucide-react';

export const MarketOverview: React.FC = () => {
  const { quotes, openQuickTrade, setActiveTab } = useTrading();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#F2C94C]" />
            <span className="text-sm font-bold text-white tracking-tight">Live Kuotasi Pasar Forex</span>
          </div>
        }
        subtitle="Harga real-time dengan spread ketat standar institusional"
        action={
          <button
            onClick={() => setActiveTab('market')}
            className="text-xs text-[#F2C94C] hover:opacity-90 font-semibold"
          >
            Lihat Semua
          </button>
        }
      />

      <CardContent className="p-0 flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#333] bg-[#1A1A1A] text-[9px] uppercase font-bold text-gray-500 tracking-widest">
              <th className="py-2.5 px-4">Instrumen</th>
              <th className="py-2.5 px-3 text-right">Bid (Jual)</th>
              <th className="py-2.5 px-3 text-right">Ask (Beli)</th>
              <th className="py-2.5 px-3 text-right">Spread</th>
              <th className="py-2.5 px-3 text-right">24j %</th>
              <th className="py-2.5 px-4 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333] font-mono">
            {quotes.map(q => {
              const isPositive = q.change24h >= 0;
              return (
                <tr key={q.symbol} className="hover:bg-[#222] transition-colors">
                  <td className="py-2.5 px-4 font-sans">
                    <div className="font-bold text-white">{q.symbol}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{q.name}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-200">
                    {q.bid}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-gray-200">
                    {q.ask}
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-400">
                    {q.spread}p
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    <div className="flex items-center justify-end gap-0.5">
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isPositive ? '+' : ''}{q.change24h}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openQuickTrade({ pair: q.symbol, type: 'SELL', price: q.bid })}
                        className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold text-[10px] transition-colors"
                        title="Buka Sell"
                      >
                        SELL
                      </button>
                      <button
                        onClick={() => openQuickTrade({ pair: q.symbol, type: 'BUY', price: q.ask })}
                        className="px-2 py-1 rounded bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-500 font-bold text-[10px] transition-colors"
                        title="Buka Buy"
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
      </CardContent>
    </Card>
  );
};

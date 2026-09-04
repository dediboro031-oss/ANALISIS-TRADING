import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Target, 
  ShieldAlert, 
  Zap, 
  ChevronRight,
  Clock
} from 'lucide-react';

export const QuickSignalsCard: React.FC = () => {
  const { signals, openQuickTrade, setActiveTab } = useTrading();

  const activeSignals = signals.filter(s => s.status === 'ACTIVE').slice(0, 3);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F2C94C] fill-[#F2C94C]" />
            <span className="text-sm font-bold text-white tracking-tight">Sinyal Buy & Sell Terkini</span>
          </div>
        }
        subtitle="Rekomendasi waktu masuk pasar terverifikasi dengan probabilitas tinggi"
        action={
          <button
            onClick={() => setActiveTab('signals')}
            className="text-xs text-[#F2C94C] hover:opacity-90 font-semibold flex items-center gap-1"
          >
            <span>Semua Sinyal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        }
      />

      <CardContent className="p-4 flex-1 divide-y divide-[#333] space-y-3">
        {activeSignals.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            Belum ada sinyal aktif saat ini.
          </div>
        ) : (
          activeSignals.map(sig => {
            const isBuy = sig.type === 'BUY';
            return (
              <div key={sig.id} className="pt-3 first:pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{sig.pair}</span>
                    <Badge variant={isBuy ? 'buy' : 'sell'} size="sm">
                      {isBuy ? <ArrowUp className="w-3 h-3 inline mr-0.5" /> : <ArrowDown className="w-3 h-3 inline mr-0.5" />}
                      {sig.type} • {sig.timeframe}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F2C94C]">
                    <span>Akurasi {sig.confidenceScore}%</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {sig.analysisSummary}
                </p>

                {/* Price metrics row */}
                <div className="grid grid-cols-3 gap-2 py-1.5 px-2.5 rounded bg-[#0D0D0D] border border-[#333] text-[11px] font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-sans">Entry:</span>
                    <span className="font-semibold text-white">{sig.entryPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-green-500 block font-sans">TP 1 (+{sig.pipsTarget}p):</span>
                    <span className="font-semibold text-green-500">{sig.takeProfit1}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-500 block font-sans">Stop Loss:</span>
                    <span className="font-semibold text-red-500">{sig.stopLoss}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{sig.createdAt}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={isBuy ? 'success' : 'danger'}
                    onClick={() => openQuickTrade({
                      pair: sig.pair,
                      type: sig.type,
                      price: sig.entryPrice,
                      sl: sig.stopLoss,
                      tp: sig.takeProfit1
                    })}
                    className="font-bold py-1 px-3 text-xs"
                  >
                    Eksekusi {sig.type}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

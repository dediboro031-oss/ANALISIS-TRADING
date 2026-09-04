import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/FormElements';
import { calculatePips, calculateProfitUSD, convertUsdToIdr, formatIDR, formatUSD } from '../../utils/formatters';
import { SignalType, TradeStatus, TradeOutcome } from '../../types';
import { ArrowUp, ArrowDown, Shield, Target, AlertTriangle } from 'lucide-react';

export const QuickTradeModal: React.FC = () => {
  const { quickTradePrefill, closeQuickTrade, quotes, addTrade, user } = useTrading();

  const [pair, setPair] = useState<string>('XAU/USD');
  const [type, setType] = useState<SignalType>('BUY');
  const [lots, setLots] = useState<number>(0.10);
  const [openPrice, setOpenPrice] = useState<number>(2384.50);
  const [stopLoss, setStopLoss] = useState<number>(2375.00);
  const [takeProfit, setTakeProfit] = useState<number>(2400.00);
  const [notes, setNotes] = useState<string>('');

  // Sync when prefill changes
  useEffect(() => {
    if (quickTradePrefill) {
      setPair(quickTradePrefill.pair);
      setType(quickTradePrefill.type);
      setOpenPrice(quickTradePrefill.price);
      if (quickTradePrefill.sl) setStopLoss(quickTradePrefill.sl);
      if (quickTradePrefill.tp) setTakeProfit(quickTradePrefill.tp);
    }
  }, [quickTradePrefill]);

  // When pair changes, auto-update default price from live quotes
  useEffect(() => {
    if (!quickTradePrefill) {
      const q = quotes.find(quote => quote.symbol === pair);
      if (q) {
        const price = type === 'BUY' ? q.ask : q.bid;
        setOpenPrice(price);
        const pipDiff = pair.includes('XAU') ? 10 : pair.includes('JPY') ? 0.8 : 0.0050;
        setStopLoss(type === 'BUY' ? +(price - pipDiff).toFixed(q.pipPrecision) : +(price + pipDiff).toFixed(q.pipPrecision));
        setTakeProfit(type === 'BUY' ? +(price + pipDiff * 2).toFixed(q.pipPrecision) : +(price - pipDiff * 2).toFixed(q.pipPrecision));
      }
    }
  }, [pair, type]);

  if (!quickTradePrefill) return null;

  // Real-time estimated risk/reward metrics
  const tpPips = calculatePips(pair, openPrice, takeProfit, type);
  const slPips = calculatePips(pair, openPrice, stopLoss, type);
  const estProfitUSD = calculateProfitUSD(pair, lots, Math.max(0, tpPips));
  const estLossUSD = calculateProfitUSD(pair, lots, Math.abs(Math.min(0, slPips)));
  const estProfitIDR = convertUsdToIdr(estProfitUSD);
  const estLossIDR = convertUsdToIdr(estLossUSD);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Volume omzet calculation (Lots * Contract Size * Price in IDR)
    const contractMultiplier = pair.includes('XAU') ? 100 : 100000;
    const omzetIDR = Math.round(lots * contractMultiplier * openPrice * (16250 / (pair.includes('XAU') ? 100 : 1000)));

    addTrade({
      pair,
      type,
      lots,
      openPrice,
      stopLoss,
      takeProfit,
      status: 'OPEN',
      profitUSD: +(lots * 15).toFixed(2), // slight initial floating spread/profit
      profitIDR: Math.round(+(lots * 15).toFixed(2) * 16250),
      omzetIDR,
      pips: 1.5,
      outcome: 'PENDING',
      notes: notes || `Order ${type} dieksekusi via terminal Analisis Trading.`
    });

    closeQuickTrade();
  };

  return (
    <Modal
      isOpen={!!quickTradePrefill}
      onClose={closeQuickTrade}
      title="Buka Posisi Trading (Order Baru)"
      subtitle={`Akun: ${user.accountNumber} (${user.accountType}) • Spread Rendah Standar Exness`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pair Selection & Currency info */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Instrumen Pasar / Pair"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            options={quotes.map(q => ({ label: `${q.symbol} — ${q.name}`, value: q.symbol }))}
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Tipe Order (Sinyal Arah)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('BUY')}
                className={`py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  type === 'BUY'
                    ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                    : 'bg-[#0D0D0D] border border-[#333] text-gray-400 hover:text-white'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                BUY (Naik)
              </button>
              <button
                type="button"
                onClick={() => setType('SELL')}
                className={`py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  type === 'SELL'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-[#0D0D0D] border border-[#333] text-gray-400 hover:text-white'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                SELL (Turun)
              </button>
            </div>
          </div>
        </div>

        {/* Lot Size & Stepper */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Ukuran Volume (Lots)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max="50"
              value={lots}
              onChange={(e) => setLots(parseFloat(e.target.value) || 0.01)}
              rightAddon="Lot"
              className="font-mono font-bold"
            />
            <div className="flex items-center gap-1 shrink-0">
              {[0.01, 0.05, 0.10, 0.50, 1.00].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLots(val)}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                    lots === val 
                      ? 'bg-[#F2C94C] text-[#000] font-bold' 
                      : 'bg-[#0D0D0D] border border-[#333] text-gray-300 hover:bg-[#222]'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Inputs: Entry, SL, TP */}
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Harga Eksekusi (Entry)"
            type="number"
            step="any"
            value={openPrice}
            onChange={(e) => setOpenPrice(parseFloat(e.target.value) || 0)}
            className="font-mono"
          />
          <Input
            label="Stop Loss (SL)"
            type="number"
            step="any"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            className="font-mono text-red-500"
          />
          <Input
            label="Take Profit (TP)"
            type="number"
            step="any"
            value={takeProfit}
            onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
            className="font-mono text-green-500"
          />
        </div>

        {/* Risk & Profit Projections in IDR and USD */}
        <div className="bg-[#0D0D0D] border border-[#333] rounded p-3.5 space-y-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>Kalkulasi Proyeksi Keuntungan & Resiko</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#1A1A1A] border border-[#333] rounded p-2.5">
              <span className="text-[10px] text-green-500 font-semibold block">Potensi Target Profit:</span>
              <span className="font-mono font-bold text-green-500 text-sm">
                +{formatUSD(estProfitUSD)}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                ≈ +{formatIDR(estProfitIDR)}
              </span>
              <span className="text-[10px] text-green-500 font-mono">({tpPips > 0 ? tpPips : 0} Pips)</span>
            </div>

            <div className="bg-[#1A1A1A] border border-[#333] rounded p-2.5">
              <span className="text-[10px] text-red-500 font-semibold block">Batas Maksimal Resiko (SL):</span>
              <span className="font-mono font-bold text-red-500 text-sm">
                -{formatUSD(estLossUSD)}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                ≈ -{formatIDR(estLossIDR)}
              </span>
              <span className="text-[10px] text-red-500 font-mono">({Math.abs(slPips)} Pips)</span>
            </div>
          </div>
        </div>

        {/* Strategy Notes */}
        <Input
          label="Catatan Analisis / Strategi (Opsional)"
          placeholder="cth. Konfirmasi breakout H1, menunggu rilis NFP"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={closeQuickTrade}>
            Batal
          </Button>
          <Button
            type="submit"
            variant={type === 'BUY' ? 'success' : 'danger'}
            className="font-bold px-6"
          >
            {type === 'BUY' ? `KONFIRMASI BUY ${pair}` : `KONFIRMASI SELL ${pair}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

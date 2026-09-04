import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { TradePosition, SignalType, TradeStatus, TradeOutcome } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/FormElements';
import { calculatePips, calculateProfitUSD, convertUsdToIdr } from '../../utils/formatters';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeToEdit?: TradePosition | null;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  tradeToEdit
}) => {
  const { addTrade, updateTrade, quotes } = useTrading();

  const [pair, setPair] = useState('XAU/USD');
  const [type, setType] = useState<SignalType>('BUY');
  const [lots, setLots] = useState<number>(1.0);
  const [openPrice, setOpenPrice] = useState<number>(2384.50);
  const [closePrice, setClosePrice] = useState<number | undefined>(undefined);
  const [stopLoss, setStopLoss] = useState<number>(2375.00);
  const [takeProfit, setTakeProfit] = useState<number>(2400.00);
  const [status, setStatus] = useState<TradeStatus>('OPEN');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (tradeToEdit) {
      setPair(tradeToEdit.pair);
      setType(tradeToEdit.type);
      setLots(tradeToEdit.lots);
      setOpenPrice(tradeToEdit.openPrice);
      setClosePrice(tradeToEdit.closePrice);
      setStopLoss(tradeToEdit.stopLoss);
      setTakeProfit(tradeToEdit.takeProfit);
      setStatus(tradeToEdit.status);
      setNotes(tradeToEdit.notes || '');
    } else {
      setPair('XAU/USD');
      setType('BUY');
      setLots(1.0);
      setOpenPrice(2384.50);
      setClosePrice(undefined);
      setStopLoss(2375.00);
      setTakeProfit(2400.00);
      setStatus('OPEN');
      setNotes('');
    }
  }, [tradeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let pips = 0;
    let profitUSD = 0;
    let profitIDR = 0;
    let outcome: TradeOutcome = 'PENDING';

    const endPrice = status === 'CLOSED' ? (closePrice || openPrice) : openPrice;

    if (status === 'CLOSED') {
      pips = calculatePips(pair, openPrice, endPrice, type);
      profitUSD = calculateProfitUSD(pair, lots, pips);
      profitIDR = convertUsdToIdr(profitUSD);
      outcome = profitUSD > 0 ? 'WIN' : profitUSD < 0 ? 'LOSS' : 'BREAKEVEN';
    } else {
      pips = 10;
      profitUSD = calculateProfitUSD(pair, lots, pips);
      profitIDR = convertUsdToIdr(profitUSD);
      outcome = 'PENDING';
    }

    const contractMultiplier = pair.includes('XAU') ? 100 : 100000;
    const omzetIDR = Math.round(lots * contractMultiplier * openPrice * (16250 / (pair.includes('XAU') ? 100 : 1000)));

    if (tradeToEdit) {
      updateTrade(tradeToEdit.id, {
        pair,
        type,
        lots,
        openPrice,
        closePrice: status === 'CLOSED' ? endPrice : undefined,
        stopLoss,
        takeProfit,
        status,
        pips,
        profitUSD,
        profitIDR,
        omzetIDR,
        outcome,
        notes
      });
    } else {
      addTrade({
        pair,
        type,
        lots,
        openPrice,
        closePrice: status === 'CLOSED' ? endPrice : undefined,
        stopLoss,
        takeProfit,
        status,
        profitUSD,
        profitIDR,
        omzetIDR,
        pips,
        outcome,
        notes: notes || 'Entri transaksi manual jurnal.'
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tradeToEdit ? `Edit Transaksi ${tradeToEdit.id}` : 'Tambah Catatan Transaksi Jurnal'}
      subtitle="Catat dan pantau setiap eksekusi trading untuk evaluasi omzet dan keuntungan"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Pair / Instrumen"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            options={quotes.map(q => ({ label: q.symbol, value: q.symbol }))}
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Posisi (BUY / SELL)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('BUY')}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  type === 'BUY'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                BUY
              </button>
              <button
                type="button"
                onClick={() => setType('SELL')}
                className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  type === 'SELL'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                SELL
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Volume (Lots)"
            type="number"
            step="0.01"
            min="0.01"
            value={lots}
            onChange={(e) => setLots(parseFloat(e.target.value) || 0.01)}
            className="font-mono font-bold"
          />
          <Select
            label="Status Transaksi"
            value={status}
            onChange={(e) => setStatus(e.target.value as TradeStatus)}
            options={[
              { label: 'OPEN (Masih Terbuka)', value: 'OPEN' },
              { label: 'CLOSED (Sudah Ditutup)', value: 'CLOSED' }
            ]}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            label="Harga Buka (Entry)"
            type="number"
            step="any"
            value={openPrice}
            onChange={(e) => setOpenPrice(parseFloat(e.target.value) || 0)}
            className="font-mono"
          />
          {status === 'CLOSED' ? (
            <Input
              label="Harga Tutup (Exit)"
              type="number"
              step="any"
              value={closePrice || openPrice}
              onChange={(e) => setClosePrice(parseFloat(e.target.value) || openPrice)}
              className="font-mono text-amber-400 font-bold"
            />
          ) : (
            <Input
              label="Harga Tutup"
              value="Posisi Berjalan"
              disabled
              className="font-mono opacity-50"
            />
          )}
          <Input
            label="Stop Loss (SL)"
            type="number"
            step="any"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            className="font-mono text-rose-400"
          />
          <Input
            label="Take Profit (TP)"
            type="number"
            step="any"
            value={takeProfit}
            onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
            className="font-mono text-emerald-400"
          />
        </div>

        <Input
          label="Catatan Evaluasi / Strategi"
          placeholder="cth. Setup pinbar di level support, eksekusi disiplin."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="font-bold">
            {tradeToEdit ? 'Simpan Perubahan' : 'Tambah ke Jurnal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

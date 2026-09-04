import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { TradingSignal, SignalType, TimeFrame, SignalStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/FormElements';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signalToEdit?: TradingSignal | null;
}

export const SignalModal: React.FC<SignalModalProps> = ({
  isOpen,
  onClose,
  signalToEdit
}) => {
  const { addSignal, updateSignal, user, quotes } = useTrading();

  const [pair, setPair] = useState<string>('XAU/USD');
  const [type, setType] = useState<SignalType>('BUY');
  const [timeframe, setTimeframe] = useState<TimeFrame>('H1');
  const [entryPrice, setEntryPrice] = useState<number>(2384.50);
  const [takeProfit1, setTakeProfit1] = useState<number>(2395.00);
  const [takeProfit2, setTakeProfit2] = useState<number>(2410.00);
  const [stopLoss, setStopLoss] = useState<number>(2375.00);
  const [pipsTarget, setPipsTarget] = useState<number>(105);
  const [riskRewardRatio, setRiskRewardRatio] = useState<string>('1:2.8');
  const [confidenceScore, setConfidenceScore] = useState<number>(88);
  const [status, setStatus] = useState<SignalStatus>('ACTIVE');
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  
  // Indicators
  const [rsi, setRsi] = useState<number>(45);
  const [macdSignal, setMacdSignal] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('BULLISH');
  const [trend, setTrend] = useState<'UPTREND' | 'DOWNTREND' | 'SIDEWAYS'>('UPTREND');

  useEffect(() => {
    if (signalToEdit) {
      setPair(signalToEdit.pair);
      setType(signalToEdit.type);
      setTimeframe(signalToEdit.timeframe);
      setEntryPrice(signalToEdit.entryPrice);
      setTakeProfit1(signalToEdit.takeProfit1);
      setTakeProfit2(signalToEdit.takeProfit2);
      setStopLoss(signalToEdit.stopLoss);
      setPipsTarget(signalToEdit.pipsTarget);
      setRiskRewardRatio(signalToEdit.riskRewardRatio);
      setConfidenceScore(signalToEdit.confidenceScore);
      setStatus(signalToEdit.status);
      setAnalysisSummary(signalToEdit.analysisSummary);
      setRsi(signalToEdit.indicators.rsi);
      setMacdSignal(signalToEdit.indicators.macdSignal);
      setTrend(signalToEdit.indicators.trend);
    } else {
      // Defaults for new signal
      setPair('XAU/USD');
      setType('BUY');
      setTimeframe('H1');
      setEntryPrice(2384.50);
      setTakeProfit1(2398.00);
      setTakeProfit2(2415.00);
      setStopLoss(2374.00);
      setPipsTarget(135);
      setRiskRewardRatio('1:3.0');
      setConfidenceScore(88);
      setStatus('ACTIVE');
      setAnalysisSummary('Konfirmasi pola candlestick di area support kuat dengan divergensi positif pada RSI.');
      setRsi(38);
      setMacdSignal('BULLISH');
      setTrend('UPTREND');
    }
  }, [signalToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      pair,
      type,
      timeframe,
      entryPrice,
      takeProfit1,
      takeProfit2,
      stopLoss,
      pipsTarget,
      riskRewardRatio,
      confidenceScore,
      status,
      analysisSummary,
      indicators: {
        rsi,
        macdSignal,
        trend,
        ma200: type === 'BUY' ? ('ABOVE' as const) : ('BELOW' as const),
        bollingerStatus: 'EXPANDING' as const
      },
      author: {
        name: user.name,
        role: user.role,
        badge: user.role === 'ADMIN' ? 'Head Technical Analyst' : 'Certified Trader'
      }
    };

    if (signalToEdit) {
      updateSignal(signalToEdit.id, payload);
    } else {
      addSignal(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={signalToEdit ? `Edit Sinyal ${signalToEdit.id}` : 'Terbitkan Sinyal Trading Baru'}
      subtitle="Analisis waktu yang tepat untuk BUY / SELL dengan parameter risiko ketat"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pair & Signal Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Instrumen Pasar / Pair"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            options={quotes.map(q => ({ label: q.symbol, value: q.symbol }))}
          />

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Arah Sinyal (Waktu Masuk)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('BUY')}
                className={`py-2 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors ${
                  type === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                BUY
              </button>
              <button
                type="button"
                onClick={() => setType('SELL')}
                className={`py-2 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors ${
                  type === 'SELL'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                SELL
              </button>
            </div>
          </div>

          <Select
            label="Timeframe Analisis"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
            options={[
              { label: 'M5 (Scalping Cepat)', value: 'M5' },
              { label: 'M15 (Scalping Menengah)', value: 'M15' },
              { label: 'M30 (Intraday)', value: 'M30' },
              { label: 'H1 (Standard Hourly)', value: 'H1' },
              { label: 'H4 (Swing 4-Jam)', value: 'H4' },
              { label: 'D1 (Daily Swing)', value: 'D1' }
            ]}
          />
        </div>

        {/* Entry, TP1, TP2, SL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            label="Harga Masuk (Entry)"
            type="number"
            step="any"
            value={entryPrice}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
            className="font-mono font-bold"
          />
          <Input
            label="Take Profit 1 (TP 1)"
            type="number"
            step="any"
            value={takeProfit1}
            onChange={(e) => setTakeProfit1(parseFloat(e.target.value) || 0)}
            className="font-mono text-emerald-400 font-bold"
          />
          <Input
            label="Take Profit 2 (TP 2)"
            type="number"
            step="any"
            value={takeProfit2}
            onChange={(e) => setTakeProfit2(parseFloat(e.target.value) || 0)}
            className="font-mono text-emerald-300"
          />
          <Input
            label="Stop Loss (SL)"
            type="number"
            step="any"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            className="font-mono text-rose-400 font-bold"
          />
        </div>

        {/* Status, Target Pips, Risk-Reward, Confidence */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Select
            label="Status Sinyal"
            value={status}
            onChange={(e) => setStatus(e.target.value as SignalStatus)}
            options={[
              { label: 'ACTIVE (Berjalan)', value: 'ACTIVE' },
              { label: 'HIT_TP (Target Tercapai)', value: 'HIT_TP' },
              { label: 'HIT_SL (Kena Stop Loss)', value: 'HIT_SL' },
              { label: 'CLOSED (Selesai Manual)', value: 'CLOSED' },
              { label: 'EXPIRED (Kadaluwarsa)', value: 'EXPIRED' }
            ]}
          />
          <Input
            label="Target Keuntungan (Pips)"
            type="number"
            value={pipsTarget}
            onChange={(e) => setPipsTarget(parseInt(e.target.value) || 0)}
            rightAddon="Pips"
            className="font-mono"
          />
          <Input
            label="Rasio Risk : Reward"
            value={riskRewardRatio}
            onChange={(e) => setRiskRewardRatio(e.target.value)}
            placeholder="cth. 1:3.0"
            className="font-mono"
          />
          <Input
            label="Skor Probabilitas (%)"
            type="number"
            min="1"
            max="100"
            value={confidenceScore}
            onChange={(e) => setConfidenceScore(parseInt(e.target.value) || 50)}
            rightAddon="%"
            className="font-mono font-bold text-amber-400"
          />
        </div>

        {/* Technical Indicators Configuration */}
        <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Konfirmasi Indikator Teknikal
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Indikator RSI (14)"
              type="number"
              min="0"
              max="100"
              value={rsi}
              onChange={(e) => setRsi(parseFloat(e.target.value) || 50)}
              helperText={rsi < 30 ? 'Oversold (Potensi Buy)' : rsi > 70 ? 'Overbought (Potensi Sell)' : 'Netral'}
              className="font-mono"
            />
            <Select
              label="Sinyal MACD"
              value={macdSignal}
              onChange={(e) => setMacdSignal(e.target.value as any)}
              options={[
                { label: 'BULLISH (Golden Cross)', value: 'BULLISH' },
                { label: 'BEARISH (Death Cross)', value: 'BEARISH' },
                { label: 'NEUTRAL (Konsolidasi)', value: 'NEUTRAL' }
              ]}
            />
            <Select
              label="Arah Tren Pasar"
              value={trend}
              onChange={(e) => setTrend(e.target.value as any)}
              options={[
                { label: 'UPTREND (Bullish)', value: 'UPTREND' },
                { label: 'DOWNTREND (Bearish)', value: 'DOWNTREND' },
                { label: 'SIDEWAYS (Datar)', value: 'SIDEWAYS' }
              ]}
            />
          </div>
        </div>

        {/* Analysis Reason Text */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-300">
            Ulasan Analisis (Alasan Waktu Buy/Sell)
          </label>
          <textarea
            rows={3}
            value={analysisSummary}
            onChange={(e) => setAnalysisSummary(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
            placeholder="Jelaskan setup chart, level support/resistance, konfirmasi price action mengapa waktu ini tepat..."
            required
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="font-bold">
            {signalToEdit ? 'Simpan Perubahan Sinyal' : 'Publikasikan Sinyal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

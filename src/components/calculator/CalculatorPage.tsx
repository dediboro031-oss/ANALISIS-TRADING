import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Input, Select } from '../common/FormElements';
import { Button } from '../common/Button';
import { useTrading } from '../../context/TradingContext';
import { formatIDR, formatUSD, calculateProfitUSD, convertUsdToIdr } from '../../utils/formatters';
import { Calculator, ShieldCheck, Target, DollarSign, Layers, ArrowRight } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { user, quotes } = useTrading();

  // Tab state
  const [activeCalc, setActiveCalc] = useState<'lot' | 'pip' | 'rr'>('lot');

  // 1. Lot Size Calculator states
  const [accountBalanceUSD, setAccountBalanceUSD] = useState<number>(user.balanceUSD);
  const [riskPercent, setRiskPercent] = useState<number>(2); // 2% risk rule
  const [stopLossPips, setStopLossPips] = useState<number>(30);
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');

  // 2. Pip Value Calculator states
  const [pipLots, setPipLots] = useState<number>(1.0);
  const [pipPair, setPipPair] = useState<string>('XAU/USD');

  // 3. Risk-Reward Calculator states
  const [rrEntry, setRrEntry] = useState<number>(2384.50);
  const [rrSl, setRrSl] = useState<number>(2375.00);
  const [rrTp, setRrTp] = useState<number>(2410.00);
  const [rrLots, setRrLots] = useState<number>(0.5);

  // Lot Calculator Calculations
  const riskAmountUSD = (accountBalanceUSD * riskPercent) / 100;
  const riskAmountIDR = riskAmountUSD * 16250;
  
  // Pip value per lot for selected pair
  const isGold = selectedPair.includes('XAU');
  const pipFactor = isGold ? 10 : selectedPair.includes('JPY') ? 6.8 : 10;
  const recommendedLot = stopLossPips > 0 ? +(riskAmountUSD / (stopLossPips * pipFactor)).toFixed(2) : 0.01;

  // Pip Calculator Calculations
  const isPipGold = pipPair.includes('XAU');
  const pipSingleValUSD = isPipGold ? 10 : pipPair.includes('JPY') ? 6.8 : 10;
  const totalPipValueUSD = +(pipLots * pipSingleValUSD).toFixed(2);
  const totalPipValueIDR = totalPipValueUSD * 16250;

  // R:R Calculator Calculations
  const slDiff = Math.abs(rrEntry - rrSl);
  const tpDiff = Math.abs(rrTp - rrEntry);
  const riskRewardRatio = slDiff > 0 ? (tpDiff / slDiff).toFixed(2) : '0';
  const rrLossUSD = calculateProfitUSD(pipPair, rrLots, slDiff * (isPipGold ? 10 : 10000));
  const rrGainUSD = calculateProfitUSD(pipPair, rrLots, tpDiff * (isPipGold ? 10 : 10000));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2.5 uppercase tracking-tight">
          <Calculator className="w-6 h-6 text-amber-400" />
          <span>Kalkulator Trading & Manajemen Risiko</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Alat hitung matematis untuk menentukan ukuran lot aman, nilai pip dalam Rupiah (IDR), dan rasio Risk-Reward sebelum eksekusi order.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 w-full max-w-lg">
        <button
          onClick={() => setActiveCalc('lot')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCalc === 'lot'
              ? 'bg-amber-400 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Kalkulator Ukuran Lot
        </button>
        <button
          onClick={() => setActiveCalc('pip')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCalc === 'pip'
              ? 'bg-amber-400 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Nilai Pip ke IDR
        </button>
        <button
          onClick={() => setActiveCalc('rr')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCalc === 'rr'
              ? 'bg-amber-400 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Rasio Risk : Reward
        </button>
      </div>

      {/* Content for each calculator */}
      {activeCalc === 'lot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-5 space-y-4">
            <CardHeader
              title="Parameter Risiko Trading"
              subtitle="Tentukan batas toleransi kerugian akun untuk kalkulasi lot otomatis"
            />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Saldo Akun (USD)"
                  type="number"
                  value={accountBalanceUSD}
                  onChange={(e) => setAccountBalanceUSD(parseFloat(e.target.value) || 0)}
                  rightAddon="USD"
                  className="font-mono font-bold"
                />
                <Select
                  label="Instrumen / Pair"
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  options={quotes.map(q => ({ label: q.symbol, value: q.symbol }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Toleransi Risiko (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 1)}
                      rightAddon="%"
                      className="font-mono"
                    />
                    <div className="flex gap-1">
                      {[1, 2, 3].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setRiskPercent(p)}
                          className={`px-2 py-2 rounded text-xs font-bold ${
                            riskPercent === p ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {p}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Input
                  label="Jarak Stop Loss (Pips)"
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(parseInt(e.target.value) || 1)}
                  rightAddon="Pips"
                  className="font-mono font-bold text-rose-400"
                />
              </div>
            </div>
          </Card>

          {/* Results Card */}
          <Card className="lg:col-span-5 p-5 bg-gradient-to-br from-neutral-900 to-amber-950/30 border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Rekomendasi Money Management</span>
              </div>

              <div className="mt-6 text-center p-5 rounded-2xl bg-neutral-950/80 border border-amber-400/30">
                <span className="text-xs text-neutral-400 uppercase font-semibold">Ukuran Lot Maksimal Aman:</span>
                <div className="text-4xl font-black text-amber-400 font-mono mt-1">
                  {recommendedLot} <span className="text-lg font-normal text-neutral-300">Lots</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-1">
                  Volume Standar Terkendali
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Maksimal Risiko (USD):</span>
                  <span className="font-bold text-rose-400">-{formatUSD(riskAmountUSD)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-neutral-400">Maksimal Risiko (IDR):</span>
                  <span className="font-bold text-rose-400">-{formatIDR(riskAmountIDR)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-neutral-300 leading-relaxed">
              Aturan 2%: Jangan pernah mempertaruhkan lebih dari 2% modal akun per transaksi demi menjaga keberlanjutan omzet dan portofolio trading.
            </div>
          </Card>
        </div>
      )}

      {/* Nilai Pip ke IDR */}
      {activeCalc === 'pip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-5 space-y-4">
            <CardHeader
              title="Konversi Nilai Pip ke Rupiah (IDR)"
              subtitle="Ketahui berapa nilai moneter setiap pergerakan 1 pip pada pair pilihan Anda"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Instrumen Pasar / Pair"
                value={pipPair}
                onChange={(e) => setPipPair(e.target.value)}
                options={quotes.map(q => ({ label: `${q.symbol} (${q.name})`, value: q.symbol }))}
              />
              <Input
                label="Ukuran Volume (Lots)"
                type="number"
                step="0.01"
                min="0.01"
                value={pipLots}
                onChange={(e) => setPipLots(parseFloat(e.target.value) || 0.01)}
                rightAddon="Lot"
                className="font-mono font-bold"
              />
            </div>
          </Card>

          <Card className="lg:col-span-5 p-5 bg-gradient-to-br from-neutral-900 to-emerald-950/20 border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <DollarSign className="w-4 h-4" />
              <span>Nilai Pergerakan 1 Pip</span>
            </div>

            <div className="mt-6 p-5 text-center rounded-2xl bg-neutral-950/80 border border-emerald-500/30">
              <span className="text-xs text-neutral-400 uppercase font-semibold">Nilai 1 Pip dalam IDR:</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                {formatIDR(totalPipValueIDR)}
              </div>
              <div className="text-xs text-neutral-300 font-mono mt-1">
                Setara dengan {formatUSD(totalPipValueUSD)} / pip
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Jika Profit +50 Pips:</span>
                <span className="font-bold text-emerald-400">+{formatIDR(totalPipValueIDR * 50)}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Jika Kena SL -30 Pips:</span>
                <span className="font-bold text-rose-400">-{formatIDR(totalPipValueIDR * 30)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Rasio Risk to Reward */}
      {activeCalc === 'rr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-5 space-y-4">
            <CardHeader
              title="Evaluasi Rasio Risk to Reward (R:R)"
              subtitle="Cari peluang trading yang memiliki potensi cuan minimal 2x lipat dari resikonya"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Harga Entry"
                type="number"
                step="any"
                value={rrEntry}
                onChange={(e) => setRrEntry(parseFloat(e.target.value) || 0)}
                className="font-mono"
              />
              <Input
                label="Stop Loss (SL)"
                type="number"
                step="any"
                value={rrSl}
                onChange={(e) => setRrSl(parseFloat(e.target.value) || 0)}
                className="font-mono text-rose-400"
              />
              <Input
                label="Take Profit (TP)"
                type="number"
                step="any"
                value={rrTp}
                onChange={(e) => setRrTp(parseFloat(e.target.value) || 0)}
                className="font-mono text-emerald-400"
              />
            </div>
            <Input
              label="Ukuran Lot"
              type="number"
              step="0.01"
              value={rrLots}
              onChange={(e) => setRrLots(parseFloat(e.target.value) || 0.01)}
              rightAddon="Lot"
              className="font-mono"
            />
          </Card>

          <Card className="lg:col-span-5 p-5 bg-gradient-to-br from-neutral-900 to-amber-950/20 border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Target className="w-4 h-4" />
              <span>Rasio & Kualitas Setup</span>
            </div>

            <div className="mt-6 p-5 text-center rounded-2xl bg-neutral-950/80 border border-amber-400/30">
              <span className="text-xs text-neutral-400 uppercase font-semibold">Rasio Risk : Reward</span>
              <div className="text-4xl font-black text-amber-400 font-mono mt-1">
                1 : {riskRewardRatio}
              </div>
              <div className={`text-xs font-bold font-mono mt-1.5 ${
                parseFloat(riskRewardRatio) >= 2 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {parseFloat(riskRewardRatio) >= 2 ? 'Kualitas Setup Bagus (Layak Entri)' : 'Rasio Rendah (< 1:2)'}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Estimasi Untung (TP):</span>
                <span className="font-bold text-emerald-400">+{formatUSD(rrGainUSD)} ({formatIDR(convertUsdToIdr(rrGainUSD))})</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400">Estimasi Rugi (SL):</span>
                <span className="font-bold text-rose-400">-{formatUSD(rrLossUSD)} ({formatIDR(convertUsdToIdr(rrLossUSD))})</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

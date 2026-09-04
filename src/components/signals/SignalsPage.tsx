import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { TradingSignal, SignalType, SignalStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Pagination } from '../common/Pagination';
import { SignalModal } from './SignalModal';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Activity, 
  Clock, 
  Shield, 
  Target,
  BarChart2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const SignalsPage: React.FC = () => {
  const { signals, deleteSignal, updateSignal, openQuickTrade, user } = useTrading();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'confidence' | 'pips'>('newest');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<TradingSignal | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter and sort logic
  const filteredSignals = useMemo(() => {
    return signals.filter(sig => {
      const matchSearch = sig.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sig.analysisSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sig.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = filterType === 'ALL' || sig.type === filterType;
      const matchStatus = filterStatus === 'ALL' || sig.status === filterStatus;

      return matchSearch && matchType && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'confidence') {
        return b.confidenceScore - a.confidenceScore;
      }
      if (sortBy === 'pips') {
        return b.pipsTarget - a.pipsTarget;
      }
      // default newest: based on created date or id
      return b.id.localeCompare(a.id);
    });
  }, [signals, searchTerm, filterType, filterStatus, sortBy]);

  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);
  const paginatedSignals = filteredSignals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (sig: TradingSignal) => {
    setEditingSignal(sig);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSignal(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, pair: string) => {
    if (window.confirm(`Hapus sinyal analisa ${pair} (${id})?`)) {
      deleteSignal(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Create Signal CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2.5 uppercase tracking-tight">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Sinyal & Analisis Pasar</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Panduan presisi kapan waktu yang tepat untuk BUY atau SELL dengan level Take Profit, Stop Loss, dan validasi indikator teknikal.
          </p>
        </div>

        <Button
          onClick={handleAddNew}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          className="font-bold shrink-0"
        >
          + TERBITKAN SINYAL BARU
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari pair, kata kunci analisis..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Arah Sinyal (Buy & Sell)</option>
            <option value="BUY">Sinyal BUY Sahaja</option>
            <option value="SELL">Sinyal SELL Sahaja</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Status Sinyal</option>
            <option value="ACTIVE">Status: ACTIVE (Berjalan)</option>
            <option value="HIT_TP">Status: HIT TP (Sukses)</option>
            <option value="HIT_SL">Status: HIT SL (Terkena SL)</option>
            <option value="CLOSED">Status: CLOSED</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="newest">Urutkan: Sinyal Terbaru</option>
            <option value="confidence">Urutkan: Akurasi Tertinggi</option>
            <option value="pips">Urutkan: Target Pips Terbesar</option>
          </select>
        </div>
      </Card>

      {/* Signals Grid List */}
      <div className="space-y-4">
        {paginatedSignals.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
            <div className="text-sm font-bold text-neutral-300">Tidak ada sinyal yang sesuai filter</div>
            <p className="text-xs text-neutral-500 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
          </Card>
        ) : (
          paginatedSignals.map(sig => {
            const isBuy = sig.type === 'BUY';
            const statusVariants: Record<SignalStatus, any> = {
              ACTIVE: 'active',
              HIT_TP: 'win',
              HIT_SL: 'loss',
              CLOSED: 'neutral',
              EXPIRED: 'warning'
            };

            return (
              <Card key={sig.id} hover className="p-5 sm:p-6 transition-all border-neutral-800">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left block: Header, Badges, and Analysis */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-neutral-500">#{sig.id}</span>
                      <h2 className="text-lg font-black text-neutral-100 tracking-tight">{sig.pair}</h2>
                      
                      <Badge variant={isBuy ? 'buy' : 'sell'} size="md">
                        {isBuy ? <ArrowUp className="w-3.5 h-3.5 inline mr-1" /> : <ArrowDown className="w-3.5 h-3.5 inline mr-1" />}
                        {sig.type} • {sig.timeframe}
                      </Badge>

                      <Badge variant={statusVariants[sig.status]} size="sm" dot={sig.status === 'ACTIVE'}>
                        {sig.status}
                      </Badge>

                      <div className="ml-auto sm:ml-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-xs font-bold">
                        <span>Akurasi {sig.confidenceScore}%</span>
                      </div>
                    </div>

                    {/* Analysis explanation */}
                    <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                      <div className="font-semibold text-neutral-400 text-[11px] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Alasan & Logika Masuk Pasar:</span>
                      </div>
                      {sig.analysisSummary}
                    </div>

                    {/* Technical Indicator Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-[11px]">
                        <span className="text-neutral-500">RSI(14): </span>
                        <span className={`font-bold ${sig.indicators.rsi < 30 ? 'text-emerald-400' : sig.indicators.rsi > 70 ? 'text-rose-400' : 'text-neutral-200'}`}>
                          {sig.indicators.rsi}
                        </span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-[11px]">
                        <span className="text-neutral-500">MACD: </span>
                        <span className={`font-bold ${sig.indicators.macdSignal === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {sig.indicators.macdSignal}
                        </span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-[11px]">
                        <span className="text-neutral-500">Tren: </span>
                        <span className="font-bold text-amber-400">{sig.indicators.trend}</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-[11px]">
                        <span className="text-neutral-500">R:R: </span>
                        <span className="font-bold text-neutral-200">{sig.riskRewardRatio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right block: Price targets & Execution Action */}
                  <div className="w-full lg:w-72 bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 space-y-3 shrink-0">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-neutral-900 p-2 rounded-lg">
                        <span className="text-[10px] text-neutral-500 block">Harga Entry</span>
                        <span className="text-sm font-bold text-neutral-100">{sig.entryPrice}</span>
                      </div>
                      <div className="bg-neutral-900 p-2 rounded-lg">
                        <span className="text-[10px] text-neutral-500 block">Target Pips</span>
                        <span className="text-sm font-bold text-amber-400">+{sig.pipsTarget} Pips</span>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-500/20 p-2 rounded-lg">
                        <span className="text-[10px] text-emerald-400 block font-semibold">Take Profit 1</span>
                        <span className="text-xs font-bold text-emerald-300">{sig.takeProfit1}</span>
                      </div>
                      <div className="bg-rose-950/40 border border-rose-500/20 p-2 rounded-lg">
                        <span className="text-[10px] text-rose-400 block font-semibold">Stop Loss</span>
                        <span className="text-xs font-bold text-rose-300">{sig.stopLoss}</span>
                      </div>
                    </div>

                    {/* Quick Trade Execution Button */}
                    <Button
                      onClick={() => openQuickTrade({
                        pair: sig.pair,
                        type: sig.type,
                        price: sig.entryPrice,
                        sl: sig.stopLoss,
                        tp: sig.takeProfit1
                      })}
                      variant={isBuy ? 'success' : 'danger'}
                      className="w-full font-bold text-xs py-2.5 shadow-md"
                    >
                      Eksekusi Order ({sig.type} {sig.pair})
                    </Button>

                    {/* Quick Status Modifiers & Edit Controls */}
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateSignal(sig.id, { status: 'HIT_TP' })}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-neutral-900 transition-colors"
                          title="Tandai Hit Take Profit"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateSignal(sig.id, { status: 'HIT_SL' })}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
                          title="Tandai Hit Stop Loss"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(sig)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 transition-colors"
                          title="Edit Sinyal"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sig.id, sig.pair)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
                          title="Hapus Sinyal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Diterbitkan: {sig.createdAt} oleh {sig.author.name} ({sig.author.badge})</span>
                  </div>
                  <span className="font-mono text-neutral-400">TP 2: {sig.takeProfit2}</span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredSignals.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Modal for create/edit */}
      <SignalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        signalToEdit={editingSignal}
      />
    </div>
  );
};

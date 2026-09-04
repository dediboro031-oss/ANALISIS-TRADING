import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { TradePosition, TradeStatus, TradeOutcome } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Pagination } from '../common/Pagination';
import { TradeModal } from './TradeModal';
import { formatUSD, formatIDR } from '../../utils/formatters';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Download, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  DollarSign, 
  X,
  AlertCircle
} from 'lucide-react';

export const JournalPage: React.FC = () => {
  const { trades, closeTrade, deleteTrade, showToast } = useTrading();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterOutcome, setFilterOutcome] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'profit' | 'lot'>('date');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TradePosition | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchSearch = t.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      const matchOutcome = filterOutcome === 'ALL' || t.outcome === filterOutcome;

      return matchSearch && matchStatus && matchOutcome;
    }).sort((a, b) => {
      if (sortBy === 'profit') return b.profitUSD - a.profitUSD;
      if (sortBy === 'lot') return b.lots - a.lots;
      return b.openTime.localeCompare(a.openTime);
    });
  }, [trades, searchTerm, filterStatus, filterOutcome, sortBy]);

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filtered totals
  const totalProfitUSD = filteredTrades.reduce((acc, t) => acc + t.profitUSD, 0);
  const totalOmzetIDR = filteredTrades.reduce((acc, t) => acc + t.omzetIDR, 0);
  const winCount = filteredTrades.filter(t => t.outcome === 'WIN').length;
  const closedCount = filteredTrades.filter(t => t.status === 'CLOSED').length;
  const winRate = closedCount > 0 ? Math.round((winCount / closedCount) * 100) : 0;

  const handleEdit = (trade: TradePosition) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, pair: string) => {
    if (window.confirm(`Hapus catatan transaksi ${pair} (${id}) dari jurnal?`)) {
      deleteTrade(id);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Pair,Tipe,Lot,Open Price,Close Price,SL,TP,Profit USD,Profit IDR,Omzet IDR,Status,Hasil,Waktu Buka\n';
    const rows = filteredTrades.map(t => 
      `${t.id},${t.pair},${t.type},${t.lots},${t.openPrice},${t.closePrice || '-'},${t.stopLoss},${t.takeProfit},${t.profitUSD},${t.profitIDR},${t.omzetIDR},${t.status},${t.outcome},"${t.openTime}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Jurnal_Trading_Analisis_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Jurnal transaksi berhasil diekspor ke CSV.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2.5 uppercase tracking-tight">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Jurnal Transaksi & Riwayat Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Log lengkap posisi terbuka, histori hasil trading, catatan strategi, dan penghitungan omzet finansial IDR.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            size="md"
          >
            Ekspor CSV
          </Button>
          <Button
            onClick={handleAddNew}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            className="font-bold"
          >
            + CATAT TRANSAKSI
          </Button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari ID, pair, catatan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Status (Open & Closed)</option>
            <option value="OPEN">Posisi Masih Terbuka (OPEN)</option>
            <option value="CLOSED">Posisi Selesai (CLOSED)</option>
          </select>

          <select
            value={filterOutcome}
            onChange={(e) => {
              setFilterOutcome(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">Semua Hasil (Win / Loss / Pending)</option>
            <option value="WIN">Transaksi Profit (WIN)</option>
            <option value="LOSS">Transaksi Rugi (LOSS)</option>
            <option value="PENDING">Sedang Berjalan (PENDING)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="date">Urutkan: Waktu Eksekusi</option>
            <option value="profit">Urutkan: Keuntungan Terbesar</option>
            <option value="lot">Urutkan: Volume Lot Terbesar</option>
          </select>
        </div>

        {/* Quick summary badges */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-neutral-800/80 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Total Transaksi:</span>
            <span className="font-bold text-neutral-200">{filteredTrades.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Omzet Terfilter:</span>
            <span className="font-bold text-amber-400">{formatIDR(totalOmzetIDR)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Total P&L:</span>
            <span className={`font-bold ${totalProfitUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalProfitUSD >= 0 ? '+' : ''}{formatUSD(totalProfitUSD)} ({formatIDR(totalProfitUSD * 16250)})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Win Rate:</span>
            <span className="font-bold text-emerald-400">{winRate}% ({winCount} Win)</span>
          </div>
        </div>
      </Card>

      {/* Trades Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/80 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <th className="py-3 px-4">ID & Waktu</th>
                <th className="py-3 px-3">Instrumen</th>
                <th className="py-3 px-3 text-center">Tipe</th>
                <th className="py-3 px-3 text-right">Volume</th>
                <th className="py-3 px-3 text-right">Entry / Exit</th>
                <th className="py-3 px-3 text-right">SL / TP</th>
                <th className="py-3 px-3 text-right">Omzet (IDR)</th>
                <th className="py-3 px-4 text-right">Hasil (P&L)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {paginatedTrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-neutral-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Tidak ada catatan transaksi yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedTrades.map(trade => {
                  const isBuy = trade.type === 'BUY';
                  const isProfit = trade.profitUSD >= 0;

                  return (
                    <tr key={trade.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-mono font-bold text-neutral-200 block">{trade.id}</span>
                        <span className="text-[10px] text-neutral-500">{trade.openTime}</span>
                      </td>

                      <td className="py-3.5 px-3 font-sans">
                        <span className="font-extrabold text-neutral-100">{trade.pair}</span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <Badge variant={isBuy ? 'buy' : 'sell'} size="sm">
                          {isBuy ? <ArrowUp className="w-3 h-3 inline" /> : <ArrowDown className="w-3 h-3 inline" />}
                          {trade.type}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-3 text-right font-bold text-neutral-200">
                        {trade.lots.toFixed(2)} Lot
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="text-neutral-200">{trade.openPrice}</div>
                        <div className="text-[10px] text-neutral-500">
                          {trade.closePrice ? `Exit: ${trade.closePrice}` : 'Open'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right text-[11px]">
                        <div className="text-rose-400">SL: {trade.stopLoss}</div>
                        <div className="text-emerald-400">TP: {trade.takeProfit}</div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-bold text-amber-400">
                        {formatIDR(trade.omzetIDR)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfit ? '+' : ''}{formatUSD(trade.profitUSD)}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {isProfit ? '+' : ''}{formatIDR(trade.profitIDR)}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {trade.status === 'OPEN' ? (
                          <Badge variant="active" size="sm" dot>OPEN</Badge>
                        ) : (
                          <Badge variant={trade.outcome === 'WIN' ? 'win' : trade.outcome === 'LOSS' ? 'loss' : 'neutral'} size="sm">
                            {trade.outcome}
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-sans">
                        <div className="flex items-center justify-center gap-1.5">
                          {trade.status === 'OPEN' && (
                            <button
                              onClick={() => closeTrade(trade.id)}
                              className="px-2 py-1 rounded bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-400 font-bold text-[10px] transition-colors"
                              title="Tutup Posisi Sekarang"
                            >
                              Tutup
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(trade)}
                            className="p-1.5 rounded text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                            title="Edit Catatan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(trade.id, trade.pair)}
                            className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredTrades.length}
          itemsPerPage={itemsPerPage}
        />
      </Card>

      {/* Trade Create/Edit Modal */}
      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tradeToEdit={editingTrade}
      />
    </div>
  );
};

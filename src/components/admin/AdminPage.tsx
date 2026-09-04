import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { TeamMember, UserRole } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Input, Select } from '../common/FormElements';
import { Modal } from '../common/Modal';
import { Pagination } from '../common/Pagination';
import { formatIDR } from '../../utils/formatters';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Award, 
  Activity, 
  Send,
  AlertTriangle
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, user, showToast } = useTrading();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states for add/edit member
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [accountNumber, setAccountNumber] = useState('');

  // Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRole = roleFilter === 'ALL' || m.role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [teamMembers, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Aggregate stats
  const totalTeamOmzet = teamMembers.reduce((acc, m) => acc + m.omzetIDR, 0);
  const totalTeamProfit = teamMembers.reduce((acc, m) => acc + m.netProfitIDR, 0);
  const avgWinRate = Math.round(teamMembers.reduce((acc, m) => acc + m.winRate, 0) / teamMembers.length);

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setRole('USER');
    setStatus('ACTIVE');
    setAccountNumber(`EXN-${Math.floor(8942100 + Math.random() * 899)}`);
    setIsMemberModalOpen(true);
  };

  const openEditModal = (m: TeamMember) => {
    setEditingMember(m);
    setName(m.name);
    setEmail(m.email);
    setRole(m.role);
    setStatus(m.status);
    setAccountNumber(m.accountNumber);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMember) {
      updateTeamMember(editingMember.id, {
        name,
        email,
        role,
        status,
        accountNumber
      });
    } else {
      addTeamMember({
        name,
        email,
        role,
        status,
        accountNumber,
        totalTrades: 12,
        winRate: 75.0,
        omzetIDR: 45000000,
        netProfitIDR: 6200000,
        lastActive: 'Baru saja'
      });
    }

    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = (id: string, memberName: string) => {
    if (window.confirm(`Hapus anggota ${memberName} (${id}) dari tim?`)) {
      deleteTeamMember(id);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    showToast(`Broadcast terkirim ke seluruh 100 anggota tim: "${broadcastMessage}"`, 'success');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-100 flex items-center gap-2.5 uppercase tracking-tight">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Manajemen Konsorsium Tim 100 & Admin</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Dasbor terpusat administrator untuk mengawasi 100 trader, memantau omzet kumulatif, dan menyiarkan sinyal pasar resmi.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          className="font-bold"
        >
          + TAMBAH ANGGOTA TRADER
        </Button>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Target Kapasitas Tim
          </div>
          <div className="text-2xl font-black text-neutral-100 font-mono mt-2 tracking-tight flex items-baseline gap-2">
            <span>{teamMembers.length}</span>
            <span className="text-sm font-normal text-neutral-500">/ 100 Trader Terdaftar</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${(teamMembers.length / 100) * 100}%` }}
            />
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Omzet Tim Konsorsium
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-2 tracking-tight">
            {formatIDR(totalTeamOmzet)}
          </div>
          <div className="text-xs text-neutral-500 mt-1.5 font-mono">
            Volume akumulasi 100 akun
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Net Profit Bersih Tim
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2 tracking-tight">
            +{formatIDR(totalTeamProfit)}
          </div>
          <div className="text-xs text-neutral-500 mt-1.5 font-mono">
            Rata-rata profit Rp {(totalTeamProfit / teamMembers.length / 1000000).toFixed(1)}Jt / akun
          </div>
        </Card>

        <Card hover className="p-5">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Rata-rata Win Rate Tim
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-2 tracking-tight">
            {avgWinRate}%
          </div>
          <div className="text-xs text-emerald-400 mt-1.5 font-mono">
            Konsistensi sinyal sangat tinggi
          </div>
        </Card>
      </div>

      {/* Broadcast Message to 100 Team Members */}
      <Card className="p-5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/20 border-neutral-800">
        <CardHeader
          title="Siaran Pesan Kilat (Broadcast ke Seluruh 100 Anggota)"
          subtitle="Kirim pemberitahuan penting, peringatan berita high-impact NFP, atau pengumuman sinyal"
        />
        <form onSubmit={handleSendBroadcast} className="flex flex-col sm:flex-row items-center gap-3 mt-3">
          <input
            type="text"
            placeholder="Ketik pesan broadcast ke seluruh trader (cth: Perhatian rilis FOMC jam 01:00 WIB, amankan posisi TP/SL)..."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
          <Button
            type="submit"
            variant="primary"
            icon={<Send className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto font-bold text-xs shrink-0 py-2.5"
          >
            KIRIM SIARAN
          </Button>
        </form>
      </Card>

      {/* Team Members Management Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari anggota, email, nomor akun..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
            >
              <option value="ALL">Semua Role</option>
              <option value="ADMIN">Role Admin</option>
              <option value="USER">Role User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Status Aktif</option>
              <option value="SUSPENDED">Status Ditangguhkan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/80 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                <th className="py-3 px-4">Trader & Akun</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
                <th className="py-3 px-4 text-right">Omzet (IDR)</th>
                <th className="py-3 px-4 text-right">Laba Bersih</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {paginatedMembers.map(member => (
                <tr key={member.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-neutral-200">{member.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{member.email} • {member.accountNumber}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant={member.role === 'ADMIN' ? 'admin' : 'neutral'} size="sm">
                      {member.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                      member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-neutral-200">
                    {member.totalTrades}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    {member.winRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                    {formatIDR(member.omzetIDR)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    +{formatIDR(member.netProfitIDR)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-1.5 rounded text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                        title="Edit Data Anggota"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="p-1.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        title="Hapus Anggota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
        />
      </Card>

      {/* Member Add/Edit Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title={editingMember ? `Edit Anggota Tim: ${editingMember.name}` : 'Tambah Anggota Trader Baru'}
        subtitle="Registrasi akun trader ke dalam konsorsium 100 akun Analisis Trading"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="cth. Hendra Gunawan"
          />
          <Input
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="hendra@forex.id"
          />
          <Input
            label="Nomor Akun Trading (Exness / MT5)"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            placeholder="EXN-8942100"
            className="font-mono"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Peran / Hak Akses"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { label: 'USER (Trader)', value: 'USER' },
                { label: 'ADMIN (Full Access)', value: 'ADMIN' }
              ]}
            />
            <Select
              label="Status Akun"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              options={[
                { label: 'ACTIVE (Aktif)', value: 'ACTIVE' },
                { label: 'SUSPENDED (Ditangguhkan)', value: 'SUSPENDED' }
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsMemberModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="font-bold">
              {editingMember ? 'Simpan Perubahan' : 'Daftarkan Anggota'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

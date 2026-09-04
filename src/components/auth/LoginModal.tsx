import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Select } from '../common/FormElements';
import { UserRole } from '../../types';
import { ShieldCheck, User as UserIcon, Lock, CheckCircle } from 'lucide-react';
import { formatUSD, formatIDR } from '../../utils/formatters';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, switchRole, showToast } = useTrading();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [accountType, setAccountType] = useState<'LIVE' | 'DEMO'>(user.accountType);
  const [accountNumber, setAccountNumber] = useState(user.accountNumber);
  const [balanceUSD, setBalanceUSD] = useState<number>(user.balanceUSD);
  const [role, setRole] = useState<UserRole>(user.role);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      email,
      accountType,
      accountNumber,
      balanceUSD,
      equityUSD: +(balanceUSD * 1.038).toFixed(2),
      role
    }));
    showToast(`Profil akun ${name} berhasil disimpan.`, 'success');
    onClose();
  };

  const setPreset = (presetRole: UserRole) => {
    if (presetRole === 'ADMIN') {
      setName('Bambang Sugianto');
      setEmail('bambang.trader@analisistrading.id');
      setRole('ADMIN');
      setAccountType('LIVE');
      setAccountNumber('EXN-8942104');
      setBalanceUSD(14850.50);
    } else {
      setName('Rian Hendrawan');
      setEmail('rian.trader@forexindo.com');
      setRole('USER');
      setAccountType('LIVE');
      setAccountNumber('EXN-8942105');
      setBalanceUSD(5200.00);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Autentikasi & Akun Trading"
      subtitle="Kelola profil trader, tipe akun Exness, atau beralih hak akses Admin / User"
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Preset quick buttons */}
        <div className="p-3 bg-[#0D0D0D] border border-[#333] rounded space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Pintasan Masuk / Beralih Akun Cepat:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPreset('ADMIN')}
              className="px-3 py-2 rounded bg-[#F2C94C]/10 hover:bg-[#F2C94C]/20 border border-[#F2C94C]/30 text-[#F2C94C] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Akun Admin (Full)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreset('USER')}
              className="px-3 py-2 rounded bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Akun Trader (User)</span>
            </button>
          </div>
        </div>

        <Input
          label="Nama Lengkap Pengguna"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Email Terdaftar"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nomor Akun Exness"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="font-mono"
            required
          />
          <Select
            label="Tipe Akun"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as any)}
            options={[
              { label: 'REAL / LIVE ACCOUNT', value: 'LIVE' },
              { label: 'DEMO / TRIAL ACCOUNT', value: 'DEMO' }
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Saldo Akun (USD)"
            type="number"
            step="0.01"
            value={balanceUSD}
            onChange={(e) => setBalanceUSD(parseFloat(e.target.value) || 0)}
            className="font-mono font-bold text-[#F2C94C]"
            helperText={`≈ ${formatIDR(balanceUSD * 16250)}`}
          />
          <Select
            label="Peran Akun"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { label: 'ADMIN (Manajer & Analis)', value: 'ADMIN' },
              { label: 'USER (Trader Anggota)', value: 'USER' }
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="font-bold">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

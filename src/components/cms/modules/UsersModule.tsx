import React, { useState } from 'react';
import {
  Users,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  UserPlus,
  Mail,
  Phone
} from 'lucide-react';
import { UserProfile, UserRole } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface UsersModuleProps {
  users: UserProfile[];
  currentUserId?: string;
  onSaveUser: (user: Partial<UserProfile>) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const UsersModule: React.FC<UsersModuleProps> = ({
  users,
  currentUserId,
  onSaveUser,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.displayName || !editingUser?.email) {
      showToast('Nama dan email staf wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveUser(editingUser);
      setEditingUser(null);
      showToast('Akun staf & peran berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan akun staf.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const map = {
      super_admin: { label: 'Super Admin', bg: 'bg-red-950 text-red-300 border-red-800' },
      admin: { label: 'Administrator', bg: 'bg-amber-950 text-amber-300 border-amber-800' },
      editor: { label: 'Editor Konten', bg: 'bg-blue-950 text-blue-300 border-blue-800' },
      sales: { label: 'Tim Sales & CRM', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
      marketing: { label: 'Tim Marketing', bg: 'bg-purple-950 text-purple-300 border-purple-800' }
    };
    const r = map[role] || { label: role, bg: 'bg-stone-900 text-stone-300 border-stone-700' };
    return (
      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold border ${r.bg}`}>
        {r.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Peran Staf & Hak Akses Pengguna (User Roles)"
        description="Kelola otorisasi berbasis peran (Role-Based Access Control) untuk staf PT ZIA Properti Indonesia: Super Admin, Administrator, Editor Konten, Sales CRM, dan Marketing."
        actionLabel="Tambah Akun Staf"
        onAction={() =>
          setEditingUser({
            displayName: '',
            email: '',
            role: 'sales',
            phone: '0812'
          })
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-3 bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2">
          <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama staf atau email..."
            className="w-full bg-transparent text-white placeholder-stone-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
            Peran:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
          >
            <option value="All" className="bg-stone-900 text-stone-200">
              Semua Peran
            </option>
            <option value="super_admin" className="bg-stone-900 text-stone-200">
              Super Admin
            </option>
            <option value="admin" className="bg-stone-900 text-stone-200">
              Administrator
            </option>
            <option value="editor" className="bg-stone-900 text-stone-200">
              Editor Konten
            </option>
            <option value="sales" className="bg-stone-900 text-stone-200">
              Tim Sales CRM
            </option>
            <option value="marketing" className="bg-stone-900 text-stone-200">
              Tim Marketing
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Staf Ditemukan"
          description="Belum ada akun staf yang cocok dengan kriteria pencarian."
        />
      ) : (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3.5">Nama Staf</th>
                <th className="p-3.5">Email Akses</th>
                <th className="p-3.5">Nomor WhatsApp</th>
                <th className="p-3.5">Peran / Role</th>
                <th className="p-3.5">Cakupan Otorisasi</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 bg-stone-800 flex items-center justify-center font-serif text-xs font-bold text-amber-300">
                      {user.displayName.charAt(0)}
                    </div>
                    {user.displayName}
                  </td>
                  <td className="p-3.5 font-mono text-stone-400">{user.email}</td>
                  <td className="p-3.5 font-mono text-stone-400">{user.phone || '-'}</td>
                  <td className="p-3.5">{getRoleBadge(user.role)}</td>
                  <td className="p-3.5 text-stone-400 text-[11px] max-w-xs">
                    {user.role === 'super_admin' && 'Akses Penuh: Seluruh Modul, Konfigurasi & Otorisasi'}
                    {user.role === 'admin' && 'Manajemen Properti, Kavling, Leads, dan Media'}
                    {user.role === 'editor' && 'Penyuntingan Halaman, Blog, dan Wawasan Berita'}
                    {user.role === 'sales' && 'Melihat & Memperbarui Status Prospek CRM Leads'}
                    {user.role === 'marketing' && 'Membuat Promo, Media Visual & Ekspor Data Leads'}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-400 font-semibold flex items-center gap-1 ml-auto"
                    >
                      <Edit2 className="w-3 h-3" />
                      Ubah Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingUser && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          title={editingUser.uid ? `Ubah Peran: ${editingUser.displayName}` : 'Tambah Akun Staf Baru'}
          subtitle="Tentukan nama staf, email resmi, dan tingkat hak akses pada sistem."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Nama Lengkap Staf <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Farhan Pratama"
                value={editingUser.displayName || ''}
                onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Alamat Email Login <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="farhan@ziaproperti.co.id"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Nomor WhatsApp Staf
              </label>
              <input
                type="text"
                placeholder="0812xxxxxxx"
                value={editingUser.phone || ''}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Tingkat Hak Akses (Role) <span className="text-amber-500">*</span>
              </label>
              <select
                value={editingUser.role || 'sales'}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              >
                <option value="super_admin">Super Administrator (Akses Penuh)</option>
                <option value="admin">Administrator (Operasional & Properti)</option>
                <option value="editor">Editor (Konten & Artikel Publikasi)</option>
                <option value="sales">Sales (Khusus Tindak Lanjut Leads CRM)</option>
                <option value="marketing">Marketing (Promosi, Media & Ekspor Leads)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Staf'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Menu,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUpDown,
  Compass,
  Link2
} from 'lucide-react';
import { NavigationItem, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface NavigationModuleProps {
  navigation: NavigationItem[];
  onSaveNavigation: (nav: Partial<NavigationItem>) => Promise<void>;
  onDeleteNavigation: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const NavigationModule: React.FC<NavigationModuleProps> = ({
  navigation,
  onSaveNavigation,
  onDeleteNavigation,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [editingNav, setEditingNav] = useState<Partial<NavigationItem> | null>(null);
  const [deletingNav, setDeletingNav] = useState<NavigationItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredNav = navigation.filter((item) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === 'All' || item.location === locationFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesLocation && matchesStatus;
  });

  // Sort
  const sortedNav = [...filteredNav].sort((a, b) => {
    if (sortBy === 'label') return a.label.localeCompare(b.label);
    if (sortBy === 'order') return (a.order || 0) - (b.order || 0);
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNav?.label || !editingNav?.url) {
      showToast('Label menu dan URL tautan wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveNavigation(editingNav);
      setEditingNav(null);
      showToast('Menu navigasi berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan menu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNav) return;
    try {
      await onDeleteNavigation(deletingNav.id);
      setDeletingNav(null);
      showToast(`Menu "${deletingNav.label}" berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus menu.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Menu Navigasi Website (Navigation)"
        description="Atur struktur menu header atas, dropdown portofolio proyek, tautan footer, dan navigasi seluler tanpa mengubah kode sumber."
        actionLabel="Tambah Menu Navigasi"
        onAction={() =>
          setEditingNav({
            label: '',
            url: '/',
            location: 'header',
            order: navigation.length + 1,
            isExternal: false,
            status: 'published'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari label menu atau URL..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={locationFilter}
        onCategoryChange={setLocationFilter}
        categories={[
          { label: 'Header Menu Utama', value: 'header' },
          { label: 'Dropdown Proyek', value: 'dropdown' },
          { label: 'Footer Bawah', value: 'footer' },
          { label: 'Mobile Drawer', value: 'mobile' }
        ]}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Urutan Tampilan', value: 'order' },
          { label: 'Label Menu (A-Z)', value: 'label' }
        ]}
      />

      {/* Table */}
      {sortedNav.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Menu Ditemukan"
          description="Belum ada item navigasi yang sesuai dengan filter pencarian."
          actionLabel="Tambah Menu Pertama"
          onAction={() =>
            setEditingNav({
              label: 'Beranda',
              url: '/',
              location: 'header',
              order: 1,
              status: 'published'
            })
          }
        />
      ) : (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3.5">Urutan</th>
                <th className="p-3.5">Label Menu</th>
                <th className="p-3.5">Target Tautan (URL)</th>
                <th className="p-3.5">Posisi Penempatan</th>
                <th className="p-3.5">Induk Menu (Dropdown)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {sortedNav.map((item) => (
                <tr key={item.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-3.5 font-mono text-stone-500 font-bold">{item.order}</td>
                  <td className="p-3.5 font-bold text-white flex items-center gap-1.5">
                    {item.label}
                    {item.isExternal && <ExternalLink className="w-3 h-3 text-stone-500" />}
                  </td>
                  <td className="p-3.5 font-mono text-amber-300 text-[11px]">{item.url}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-stone-300 uppercase text-[10px] font-mono">
                      {item.location}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-400">{item.parentLabel || '-'}</td>
                  <td className="p-3.5">
                    <CMSStatusBadge status={item.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNav(item)}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-400 font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingNav(item)}
                        className="p-1 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
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
      )}

      {/* Edit / Create Modal */}
      {editingNav && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingNav(null)}
          title={editingNav.id ? `Ubah Menu: ${editingNav.label}` : 'Tambah Menu Navigasi Baru'}
          subtitle="Atur teks tampilan menu, rute URL tujuan, dan lokasi penempatan pada situs."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Label Teks Menu <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Portofolio Proyek"
                value={editingNav.label || ''}
                onChange={(e) => setEditingNav({ ...editingNav, label: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                URL Tautan Tujuan <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="/projects atau https://..."
                value={editingNav.url || ''}
                onChange={(e) => setEditingNav({ ...editingNav, url: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Posisi Penempatan
                </label>
                <select
                  value={editingNav.location || 'header'}
                  onChange={(e) => setEditingNav({ ...editingNav, location: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="header">Header Utama</option>
                  <option value="dropdown">Dropdown Proyek</option>
                  <option value="footer">Footer Bawah</option>
                  <option value="mobile">Mobile Menu</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  value={editingNav.order || 1}
                  onChange={(e) => setEditingNav({ ...editingNav, order: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Induk Menu (Jika Submenu)
                </label>
                <input
                  type="text"
                  placeholder="Portofolio & Proyek"
                  value={editingNav.parentLabel || ''}
                  onChange={(e) => setEditingNav({ ...editingNav, parentLabel: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Status
                </label>
                <select
                  value={editingNav.status || 'published'}
                  onChange={(e) => setEditingNav({ ...editingNav, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Aktif Ditampilkan)</option>
                  <option value="draft">Draf (Disembunyikan)</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingNav(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Menu'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingNav)}
        title="Konfirmasi Hapus Menu"
        message={`Apakah Anda yakin ingin menghapus menu "${deletingNav?.label}"?`}
        confirmLabel="Hapus Menu"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingNav(null)}
      />
    </div>
  );
};

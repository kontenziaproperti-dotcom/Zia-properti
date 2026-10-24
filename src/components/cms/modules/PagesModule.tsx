import React, { useState } from 'react';
import {
  FileText,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Globe
} from 'lucide-react';
import { PageItem, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface PagesModuleProps {
  pages: PageItem[];
  onSavePage: (page: Partial<PageItem>) => Promise<void>;
  onDeletePage: (id: string) => Promise<void>;
  onNavigatePublic: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const PagesModule: React.FC<PagesModuleProps> = ({
  pages,
  onSavePage,
  onDeletePage,
  onNavigatePublic,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [editingPage, setEditingPage] = useState<Partial<PageItem> | null>(null);
  const [deletingPage, setDeletingPage] = useState<PageItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (page.summary && page.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || page.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedPages = [...filteredPages].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'order') return (a.order || 0) - (b.order || 0);
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage?.title || !editingPage?.slug) {
      showToast('Judul dan slug URL halaman wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSavePage(editingPage);
      setEditingPage(null);
      showToast('Halaman website berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan halaman.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPage) return;
    try {
      await onDeletePage(deletingPage.id);
      setDeletingPage(null);
      showToast(`Halaman ${deletingPage.title} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus halaman.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Manajemen Halaman Website (Pages)"
        description="Kelola halaman publik korporat, struktur URL, konten narasi, meta tag SEO, dan status penerbitan."
        actionLabel="Tambah Halaman Baru"
        onAction={() =>
          setEditingPage({
            title: '',
            slug: `/halaman-${Date.now().toString().slice(-4)}`,
            summary: '',
            content: '',
            seoTitle: '',
            seoDescription: '',
            order: pages.length + 1,
            status: 'draft'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari judul halaman atau rute URL..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Urutan Tampilan', value: 'order' },
          { label: 'Judul Halaman (A-Z)', value: 'title' }
        ]}
      />

      {/* Table / List */}
      {sortedPages.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Halaman Ditemukan"
          description="Belum ada halaman yang sesuai dengan filter pencarian Anda."
          actionLabel="Buat Halaman Pertama"
          onAction={() =>
            setEditingPage({
              title: 'Halaman Informasi Baru',
              slug: '/informasi-perusahaan',
              summary: 'Deskripsi ringkas konten halaman.',
              content: 'Isi lengkap teks halaman.',
              status: 'draft',
              order: 1
            })
          }
        />
      ) : (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3.5">Urutan</th>
                <th className="p-3.5">Judul Halaman</th>
                <th className="p-3.5">Slug URL Web</th>
                <th className="p-3.5">Ringkasan</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {sortedPages.map((page) => (
                <tr key={page.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-3.5 font-mono text-stone-500 font-semibold">{page.order}</td>
                  <td className="p-3.5 font-serif font-bold text-white text-sm">{page.title}</td>
                  <td className="p-3.5 font-mono text-amber-300 text-[11px]">{page.slug}</td>
                  <td className="p-3.5 text-stone-400 max-w-xs truncate">{page.summary || '-'}</td>
                  <td className="p-3.5">
                    <CMSStatusBadge status={page.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigatePublic(page.slug)}
                        className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800"
                        title="Lihat Halaman Publik"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPage(page)}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-400 font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingPage(page)}
                        className="p-1.5 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
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
      {editingPage && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingPage(null)}
          title={editingPage.id ? `Ubah Halaman: ${editingPage.title}` : 'Tambah Halaman Baru'}
          subtitle="Atur judul, rute tautan web, ringkasan, teks konten, serta metadata SEO."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Judul Halaman <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Profil Perusahaan"
                  value={editingPage.title || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Slug URL <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="/tentang-kami"
                  value={editingPage.slug || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-/]/g, '') })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Status Publikasi
                </label>
                <select
                  value={editingPage.status || 'draft'}
                  onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                  <option value="archived">Arsip (Archived)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Urutan Tampilan Menu
                </label>
                <input
                  type="number"
                  value={editingPage.order || 1}
                  onChange={(e) => setEditingPage({ ...editingPage, order: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Ringkasan Singkat Halaman
              </label>
              <textarea
                rows={2}
                placeholder="Penjelasan ringkas mengenai topik halaman ini..."
                value={editingPage.summary || ''}
                onChange={(e) => setEditingPage({ ...editingPage, summary: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Konten Lengkap Narasi
              </label>
              <textarea
                rows={5}
                placeholder="Tuliskan isi teks atau artikel halaman..."
                value={editingPage.content || ''}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Judul SEO (Title Tag)
                </label>
                <input
                  type="text"
                  placeholder="Judul ramah mesin pencari..."
                  value={editingPage.seoTitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Meta Deskripsi SEO
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan 150 karakter untuk Google..."
                  value={editingPage.seoDescription || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, seoDescription: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Halaman'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingPage)}
        title="Konfirmasi Hapus Halaman"
        message={`Apakah Anda yakin ingin menghapus halaman "${deletingPage?.title}"?`}
        confirmLabel="Hapus Halaman"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPage(null)}
      />
    </div>
  );
};

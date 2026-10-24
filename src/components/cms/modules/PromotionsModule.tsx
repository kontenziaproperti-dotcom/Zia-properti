import React, { useState } from 'react';
import {
  Tag,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  Percent,
  CheckCircle,
  Clock
} from 'lucide-react';
import { PromotionItem, ProjectEntity, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface PromotionsModuleProps {
  promotions: PromotionItem[];
  projects: ProjectEntity[];
  onSavePromotion: (promo: Partial<PromotionItem>) => Promise<void>;
  onDeletePromotion: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const PromotionsModule: React.FC<PromotionsModuleProps> = ({
  promotions,
  projects,
  onSavePromotion,
  onDeletePromotion,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [editingPromo, setEditingPromo] = useState<Partial<PromotionItem> | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromotionItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredPromos = promotions.filter((promo) => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = projectFilter === 'All' || promo.projectSlug === projectFilter;
    const matchesStatus = statusFilter === 'All' || promo.status === statusFilter;

    return matchesSearch && matchesProject && matchesStatus;
  });

  // Sort
  const sortedPromos = [...filteredPromos].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'newest') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo?.title || !editingPromo?.badge) {
      showToast('Judul promo dan label badge wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSavePromotion(editingPromo);
      setEditingPromo(null);
      showToast('Program promosi berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan promosi.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPromo) return;
    try {
      await onDeletePromotion(deletingPromo.id);
      setDeletingPromo(null);
      showToast(`Promo ${deletingPromo.title} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus promo.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Promo & Penawaran Spesial"
        description="Kelola program subsidi DP, gratis biaya notaris/BPHTB, potongan tunai kavling, paket qurban, dan periode berlaku penawaran."
        actionLabel="Buat Promo Baru"
        onAction={() =>
          setEditingPromo({
            title: '',
            projectSlug: projects[0]?.slug || 'zia-emerald',
            badge: 'Subsidi DP 0% + Free BPHTB',
            description: '',
            discountValue: 'Hemat hingga Rp 40 Juta',
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            terms: 'Syarat & ketentuan berlaku selama kuota unit masih tersedia.',
            status: 'published',
            featured: true
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama promo, diskon, atau label..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={projectFilter}
        onCategoryChange={setProjectFilter}
        categories={projects.map((p) => ({ label: p.name, value: p.slug }))}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Terbaru', value: 'newest' },
          { label: 'Judul Promo (A-Z)', value: 'title' }
        ]}
      />

      {/* Grid Cards */}
      {sortedPromos.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Promo Ditemukan"
          description="Belum ada penawaran promo yang sesuai dengan filter yang Anda tentukan."
          actionLabel="Buat Penawaran Promo Pertama"
          onAction={() =>
            setEditingPromo({
              title: 'Promo Spesial Konsumen Baru',
              projectSlug: projects[0]?.slug || 'zia-emerald',
              badge: 'Diskon Booking Fee 50%',
              description: 'Program kemudahan reservasi unit.',
              startDate: new Date().toISOString().slice(0, 10),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
              status: 'published'
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedPromos.map((promo) => (
            <div
              key={promo.id}
              className="bg-stone-950 border border-stone-800 flex flex-col justify-between group hover:border-amber-400/50 transition-colors"
            >
              <div>
                <div className="h-40 overflow-hidden relative bg-stone-900">
                  <img
                    src={promo.bannerImage}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <CMSStatusBadge status={promo.status} />
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-400 text-stone-950 font-bold">
                      {promo.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono text-stone-500 block mb-1">
                    {promo.projectSlug}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                    {promo.title}
                  </h3>
                  {promo.discountValue && (
                    <div className="p-2.5 bg-amber-950/30 border border-amber-900/40 text-amber-300 font-semibold text-xs mb-3 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 shrink-0" />
                      {promo.discountValue}
                    </div>
                  )}
                  <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed mb-4">
                    {promo.description}
                  </p>

                  <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Periode: {promo.startDate} s/d {promo.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 flex justify-end gap-2 border-t border-stone-800/80 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingPromo(promo)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-xs font-semibold text-stone-200 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingPromo(promo)}
                  className="p-1.5 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingPromo && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingPromo(null)}
          title={editingPromo.id ? `Ubah Promo: ${editingPromo.title}` : 'Buat Program Promo Baru'}
          subtitle="Atur judul program, label badge, masa berlaku promosi, dan syarat ketentuan."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Judul Promo <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Promo Khusus Konsumen Pertama"
                  value={editingPromo.title || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Label Badge Promosi <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Subsidi DP 0% / Diskon 25 Jt"
                  value={editingPromo.badge || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, badge: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Proyek Terkait
                </label>
                <select
                  value={editingPromo.projectSlug || projects[0]?.slug}
                  onChange={(e) => setEditingPromo({ ...editingPromo, projectSlug: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Nilai Diskon / Benefit
                </label>
                <input
                  type="text"
                  placeholder="Hemat hingga Rp 45 Juta"
                  value={editingPromo.discountValue || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, discountValue: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Tanggal Mulai Periode
                </label>
                <input
                  type="date"
                  value={editingPromo.startDate || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, startDate: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Tanggal Berakhir Periode
                </label>
                <input
                  type="date"
                  value={editingPromo.endDate || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, endDate: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Status Promo
                </label>
                <select
                  value={editingPromo.status || 'published'}
                  onChange={(e) => setEditingPromo({ ...editingPromo, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Aktif Ditampilkan)</option>
                  <option value="draft">Draf (Disimpan Sementara)</option>
                  <option value="archived">Arsip (Promo Berakhir)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  URL Gambar Banner
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingPromo.bannerImage || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, bannerImage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Deskripsi Program Promosi
              </label>
              <textarea
                rows={3}
                placeholder="Rincian keuntungan promo untuk konsumen..."
                value={editingPromo.description || ''}
                onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Syarat & Ketentuan Berlaku
              </label>
              <input
                type="text"
                placeholder="Contoh: Berlaku untuk 10 konsumen pertama via KPR bank rekanan."
                value={editingPromo.terms || ''}
                onChange={(e) => setEditingPromo({ ...editingPromo, terms: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingPromo(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Promo'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingPromo)}
        title="Konfirmasi Hapus Promo"
        message={`Apakah Anda yakin ingin menghapus promo "${deletingPromo?.title}"?`}
        confirmLabel="Hapus Promo"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPromo(null)}
      />
    </div>
  );
};

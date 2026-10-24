import React, { useState } from 'react';
import {
  Layers,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { SectionItem, PageItem, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface SectionsModuleProps {
  sections: SectionItem[];
  pages: PageItem[];
  onSaveSection: (section: Partial<SectionItem>) => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SectionsModule: React.FC<SectionsModuleProps> = ({
  sections,
  pages,
  onSaveSection,
  onDeleteSection,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageFilter, setPageFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [editingSection, setEditingSection] = useState<Partial<SectionItem> | null>(null);
  const [deletingSection, setDeletingSection] = useState<SectionItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredSections = sections.filter((sec) => {
    const matchesSearch =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.sectionKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.subtitle && sec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPage = pageFilter === 'All' || sec.pageSlug === pageFilter;
    const matchesStatus = statusFilter === 'All' || sec.status === statusFilter;

    return matchesSearch && matchesPage && matchesStatus;
  });

  // Sort
  const sortedSections = [...filteredSections].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'order') return (a.order || 0) - (b.order || 0);
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection?.title || !editingSection?.sectionKey) {
      showToast('Judul dan kode seksi konten wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveSection(editingSection);
      setEditingSection(null);
      showToast('Seksi konten berhasil diperbarui.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan seksi konten.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSection) return;
    try {
      await onDeleteSection(deletingSection.id);
      setDeletingSection(null);
      showToast(`Seksi ${deletingSection.title} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus seksi.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Bagian & Seksi Konten (Sections)"
        description="Atur blok hero banner, filosofi, galeri, sorotan arsitektur, dan tombol ajakan bertindak (CTA) pada halaman."
        actionLabel="Tambah Seksi Konten"
        onAction={() =>
          setEditingSection({
            pageSlug: pages[0]?.slug || '/',
            sectionKey: `section-${Date.now().toString().slice(-4)}`,
            title: '',
            subtitle: '',
            content: '',
            imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            ctaText: 'Pelajari Selengkapnya',
            ctaUrl: '/projects',
            order: sections.length + 1,
            status: 'published'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari judul seksi atau kode blok..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={pageFilter}
        onCategoryChange={setPageFilter}
        categories={[
          { label: 'Beranda (/)', value: '/' },
          { label: 'Tentang Kami (/about)', value: '/about' },
          { label: 'ZIA Emerald', value: 'zia-emerald' },
          { label: 'Kav Hillside', value: 'kav-hillside' },
          { label: 'ZIA Farm', value: 'zia-farm' },
          { label: 'Altara ZIA', value: 'altara-zia-international' }
        ]}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Urutan Tampilan', value: 'order' },
          { label: 'Judul Seksi (A-Z)', value: 'title' }
        ]}
      />

      {/* Grid Cards */}
      {sortedSections.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Seksi Konten"
          description="Belum ada blok seksi yang cocok dengan filter yang dipilih."
          actionLabel="Tambah Seksi Baru"
          onAction={() =>
            setEditingSection({
              pageSlug: '/',
              sectionKey: 'hero',
              title: 'Seksi Baru Beranda',
              subtitle: 'Subjudul pengantar',
              content: 'Isi teks penjelasan.',
              order: 1,
              status: 'published'
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedSections.map((sec) => (
            <div
              key={sec.id}
              className="bg-stone-950 border border-stone-800 flex flex-col justify-between group hover:border-stone-700 transition-colors"
            >
              <div>
                {sec.imageUrl && (
                  <div className="h-40 overflow-hidden relative bg-stone-900">
                    <img
                      src={sec.imageUrl}
                      alt={sec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <CMSStatusBadge status={sec.status} />
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-900/90 text-stone-200 border border-stone-700">
                        {sec.pageSlug} • {sec.sectionKey}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {!sec.imageUrl && (
                    <div className="flex items-center gap-2 mb-2">
                      <CMSStatusBadge status={sec.status} />
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-900 text-stone-300 border border-stone-800">
                        {sec.pageSlug} • {sec.sectionKey}
                      </span>
                    </div>
                  )}

                  <h3 className="font-serif text-lg font-bold text-white mb-1">{sec.title}</h3>
                  {sec.subtitle && (
                    <p className="text-xs text-amber-200/80 italic mb-3">{sec.subtitle}</p>
                  )}
                  {sec.content && (
                    <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed mb-4">
                      {sec.content}
                    </p>
                  )}

                  {sec.ctaText && (
                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Tombol Aksi (CTA):</span>
                      <span className="text-amber-300 font-medium">
                        "{sec.ctaText}" → {sec.ctaUrl}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 flex justify-end gap-2 border-t border-stone-800/80 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(sec)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-xs font-semibold text-stone-200 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingSection(sec)}
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
      {editingSection && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingSection(null)}
          title={editingSection.id ? `Ubah Seksi: ${editingSection.title}` : 'Tambah Seksi Konten Baru'}
          subtitle="Atur teks judul, subjudul, gambar ilustrasi, dan tombol aksi."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Halaman Target <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: / atau zia-emerald"
                  value={editingSection.pageSlug || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, pageSlug: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Kode / Kunci Seksi <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="hero / philosophy / features"
                  value={editingSection.sectionKey || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, sectionKey: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Judul Seksi Konten <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Building Better Places, Creating Long Term Value"
                value={editingSection.title || ''}
                onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Subjudul / Tagline Pendukung
              </label>
              <input
                type="text"
                placeholder="Pengembang Properti & Ekosistem Bisnis Terpadu"
                value={editingSection.subtitle || ''}
                onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                URL Gambar Banner / Background
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={editingSection.imageUrl || ''}
                onChange={(e) => setEditingSection({ ...editingSection, imageUrl: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Teks Penjelasan Lengkap
              </label>
              <textarea
                rows={3}
                placeholder="Uraian narasi seksi..."
                value={editingSection.content || ''}
                onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  type="text"
                  placeholder="Konsultasi WhatsApp / Lihat Tipe"
                  value={editingSection.ctaText || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, ctaText: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Target Tautan Tuju (URL)
                </label>
                <input
                  type="text"
                  placeholder="/projects atau #house-types"
                  value={editingSection.ctaUrl || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, ctaUrl: e.target.value })}
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
                  value={editingSection.status || 'published'}
                  onChange={(e) => setEditingSection({ ...editingSection, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                  <option value="archived">Arsip (Archived)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  value={editingSection.order || 1}
                  onChange={(e) => setEditingSection({ ...editingSection, order: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Seksi'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingSection)}
        title="Konfirmasi Hapus Seksi"
        message={`Apakah Anda yakin ingin menghapus seksi "${deletingSection?.title}"?`}
        confirmLabel="Hapus Seksi"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSection(null)}
      />
    </div>
  );
};

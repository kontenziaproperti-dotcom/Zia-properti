import React, { useState } from 'react';
import {
  Quote,
  Edit2,
  Trash2,
  Star,
  User,
  CheckCircle,
  Building
} from 'lucide-react';
import { TestimonialItem, ProjectEntity, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface TestimonialsModuleProps {
  testimonials: TestimonialItem[];
  projects: ProjectEntity[];
  onSaveTestimonial: (testimonial: Partial<TestimonialItem>) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const TestimonialsModule: React.FC<TestimonialsModuleProps> = ({
  testimonials,
  projects,
  onSaveTestimonial,
  onDeleteTestimonial,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = projectFilter === 'All' || t.projectSlug === projectFilter;
    const matchesStatus = statusFilter === 'All' || (t.status || 'published') === statusFilter;

    return matchesSearch && matchesProject && matchesStatus;
  });

  // Sort
  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.author || !editingTestimonial?.content) {
      showToast('Nama konsumen dan ulasan wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveTestimonial(editingTestimonial);
      setEditingTestimonial(null);
      showToast('Ulasan testimoni berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan testimoni.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTestimonial) return;
    try {
      await onDeleteTestimonial(deletingTestimonial.id);
      setDeletingTestimonial(null);
      showToast(`Testimoni dari ${deletingTestimonial.author} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus testimoni.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Ulasan & Testimoni Konsumen"
        description="Kelola pengalaman otentik pembeli rumah ZIA Emerald, pemilik kavling Kav Hillside, pelanggan ZIA Farm, dan importir vanilla Altara ZIA."
        actionLabel="Tambah Testimoni"
        onAction={() =>
          setEditingTestimonial({
            author: '',
            role: 'Pemilik Unit ZIA Emerald',
            projectSlug: projects[0]?.slug || 'zia-emerald',
            content: '',
            rating: 5,
            status: 'published'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama konsumen, instansi, atau isi ulasan..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={projectFilter}
        onCategoryChange={setProjectFilter}
        categories={projects.map((p) => ({ label: p.name, value: p.slug }))}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Rating Tertinggi', value: 'rating' },
          { label: 'Nama Konsumen (A-Z)', value: 'author' }
        ]}
      />

      {/* Grid Cards */}
      {sortedTestimonials.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Testimoni"
          description="Belum ada data ulasan konsumen yang sesuai dengan filter pencarian."
          actionLabel="Tambah Testimoni Pertama"
          onAction={() =>
            setEditingTestimonial({
              author: 'Budi Santoso',
              role: 'Pemilik Rumah ZIA Emerald',
              projectSlug: 'zia-emerald',
              content: 'Kualitas konstruksi dan tata ruang sangat memuaskan keluarga kami.',
              rating: 5,
              status: 'published'
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTestimonials.map((t) => (
            <div
              key={t.id}
              className="p-5 bg-stone-950 border border-stone-800 flex flex-col justify-between group hover:border-stone-700 transition-colors text-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CMSStatusBadge status={t.status || 'published'} />
                    <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-amber-300 font-mono text-[10px]">
                      {t.projectSlug}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{t.rating}/5</span>
                  </div>
                </div>

                <p className="text-stone-300 italic mb-4 leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">{t.author}</span>
                  <span className="text-stone-500 text-[11px]">{t.role}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(t)}
                    className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-stone-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTestimonial(t)}
                    className="p-1 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingTestimonial && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingTestimonial(null)}
          title={editingTestimonial.id ? `Ubah Testimoni: ${editingTestimonial.author}` : 'Tambah Testimoni Konsumen'}
          subtitle="Masukkan ulasan kepuasan konsumen, rating bintang, dan nama pembeli."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Nama Konsumen / Instansi <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={editingTestimonial.author || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Proyek Terkait
                </label>
                <select
                  value={editingTestimonial.projectSlug || projects[0]?.slug}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, projectSlug: e.target.value })}
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
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Rating Bintang (1 - 5)
                </label>
                <select
                  value={editingTestimonial.rating || 5}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value={5}>★★★★★ (5 Bintang)</option>
                  <option value={4}>★★★★☆ (4 Bintang)</option>
                  <option value={3}>★★★☆☆ (3 Bintang)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Peran / Keterangan Pembeli
                </label>
                <input
                  type="text"
                  placeholder="Pemilik Unit ZIA Emerald"
                  value={editingTestimonial.role || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Status Publikasi
                </label>
                <select
                  value={editingTestimonial.status || 'published'}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Ditampilkan)</option>
                  <option value="draft">Draf (Disembunyikan)</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Isi Ulasan Konsumen <span className="text-amber-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan ulasan langsung pengalaman bertransaksi..."
                value={editingTestimonial.content || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Ulasan'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingTestimonial)}
        title="Konfirmasi Hapus Testimoni"
        message={`Apakah Anda yakin ingin menghapus testimoni dari "${deletingTestimonial?.author}"?`}
        confirmLabel="Hapus Testimoni"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTestimonial(null)}
      />
    </div>
  );
};

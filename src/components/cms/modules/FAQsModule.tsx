import React, { useState } from 'react';
import {
  HelpCircle,
  Edit2,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { FAQItem, ProjectEntity, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface FAQsModuleProps {
  faqs: FAQItem[];
  projects: ProjectEntity[];
  onSaveFAQ: (faq: Partial<FAQItem>) => Promise<void>;
  onDeleteFAQ: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const FAQsModule: React.FC<FAQsModuleProps> = ({
  faqs,
  projects,
  onSaveFAQ,
  onDeleteFAQ,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQItem> | null>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<FAQItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = projectFilter === 'All' || faq.projectSlug === projectFilter;
    const matchesStatus = statusFilter === 'All' || (faq.status || 'published') === statusFilter;

    return matchesSearch && matchesProject && matchesStatus;
  });

  // Sort
  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    if (sortBy === 'question') return a.question.localeCompare(b.question);
    if (sortBy === 'order') return (a.order || 0) - (b.order || 0);
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ?.question || !editingFAQ?.answer) {
      showToast('Pertanyaan dan jawaban wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveFAQ(editingFAQ);
      setEditingFAQ(null);
      showToast('Tanya jawab (FAQ) berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan FAQ.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFAQ) return;
    try {
      await onDeleteFAQ(deletingFAQ.id);
      setDeletingFAQ(null);
      showToast('FAQ berhasil dihapus.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus FAQ.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Tanya Jawab (FAQ) Per Proyek"
        description="Kelola jawaban resmi atas pertanyaan calon pembeli seputar legalitas tanah, sertifikat SHM, skema KPR, jadwal serah terima, dan spesifikasi bangunan."
        actionLabel="Tambah Pertanyaan FAQ"
        onAction={() =>
          setEditingFAQ({
            projectSlug: projects[0]?.slug || 'zia-emerald',
            category: 'Legalitas & Perizinan',
            question: '',
            answer: '',
            order: faqs.length + 1,
            status: 'published'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari pertanyaan atau kata kunci jawaban..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={projectFilter}
        onCategoryChange={setProjectFilter}
        categories={projects.map((p) => ({ label: p.name, value: p.slug }))}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Urutan Tampilan', value: 'order' },
          { label: 'Pertanyaan (A-Z)', value: 'question' }
        ]}
      />

      {/* FAQs List */}
      {sortedFAQs.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Tanya Jawab"
          description="Belum ada item FAQ yang sesuai dengan filter yang Anda gunakan."
          actionLabel="Tambah FAQ Baru"
          onAction={() =>
            setEditingFAQ({
              projectSlug: 'zia-emerald',
              category: 'Legalitas',
              question: 'Apakah sertifikat sudah pecah per kavling?',
              answer: 'Ya, seluruh unit sudah memiliki legalitas jelas dan siap proses AJB/SHM.',
              status: 'published'
            })
          }
        />
      ) : (
        <div className="space-y-3">
          {sortedFAQs.map((faq) => (
            <div
              key={faq.id}
              className="p-5 bg-stone-950 border border-stone-800 flex justify-between items-start gap-4 hover:border-stone-700 transition-colors text-xs"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 mb-1">
                  <CMSStatusBadge status={faq.status || 'published'} />
                  <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-amber-300 font-mono text-[10px]">
                    {faq.projectSlug}
                  </span>
                  <span className="text-stone-400 font-medium">• {faq.category}</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-white">{faq.question}</h4>
                <p className="text-stone-400 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingFAQ(faq)}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-stone-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingFAQ(faq)}
                  className="p-1 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingFAQ && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingFAQ(null)}
          title={editingFAQ.id ? 'Ubah Tanya Jawab FAQ' : 'Tambah Pertanyaan FAQ Baru'}
          subtitle="Masukkan pertanyaan umum konsumen dan penjelasan resmi dari manajemen."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Proyek Terkait <span className="text-amber-500">*</span>
                </label>
                <select
                  value={editingFAQ.projectSlug || projects[0]?.slug}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, projectSlug: e.target.value })}
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
                  Kategori Pertanyaan <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Legalitas & Perizinan / KPR / Spesifikasi"
                  value={editingFAQ.category || ''}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Pertanyaan Konsumen <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bagaimana legalitas sertifikat tanah dan IMB/PBG di ZIA Emerald?"
                value={editingFAQ.question || ''}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Jawaban Resmi Developer <span className="text-amber-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Penjelasan gamblang dan transparan..."
                value={editingFAQ.answer || ''}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Status Publikasi
                </label>
                <select
                  value={editingFAQ.status || 'published'}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Tampil di Landing Page)</option>
                  <option value="draft">Draf (Disimpan Sementara)</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  value={editingFAQ.order || 1}
                  onChange={(e) => setEditingFAQ({ ...editingFAQ, order: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingFAQ(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan FAQ'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingFAQ)}
        title="Konfirmasi Hapus FAQ"
        message="Apakah Anda yakin ingin menghapus tanya jawab ini?"
        confirmLabel="Hapus FAQ"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingFAQ(null)}
      />
    </div>
  );
};

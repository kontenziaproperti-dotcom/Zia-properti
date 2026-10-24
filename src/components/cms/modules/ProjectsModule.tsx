import React, { useState } from 'react';
import {
  Building,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Eye,
  CheckCircle,
  Archive,
  FileText
} from 'lucide-react';
import { ProjectEntity, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface ProjectsModuleProps {
  projects: ProjectEntity[];
  onSaveProject: (project: Partial<ProjectEntity>) => Promise<void>;
  onDeleteProject: (slug: string) => Promise<void>;
  onNavigatePublic: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
  onNavigatePublic,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('order');
  const [editingProject, setEditingProject] = useState<Partial<ProjectEntity> | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectEntity | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const projectStatus = p.status?.toLowerCase() || 'published';
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'published' && (projectStatus === 'active' || projectStatus === 'development' || projectStatus === 'available' || projectStatus === 'published' || projectStatus === 'exporting')) ||
      (statusFilter === 'draft' && (projectStatus === 'draft' || projectStatus === 'coming soon')) ||
      (statusFilter === 'archived' && (projectStatus === 'archived' || projectStatus === 'unavailable'));

    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'order') return (a.order || 0) - (b.order || 0);
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name || !editingProject?.slug) {
      showToast('Nama dan slug proyek wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveProject(editingProject);
      setEditingProject(null);
      showToast('Data kawasan proyek berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan proyek.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      await onDeleteProject(deletingProject.slug);
      setDeletingProject(null);
      showToast(`Proyek ${deletingProject.name} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus proyek.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Header */}
      <CMSModuleHeader
        title="Kawasan & Unit Proyek"
        description="Kelola profil kawasan mandiri, klasifikasi peruntukan, foto lanskap, narasi arsitektur, dan tautan kontak resmi."
        actionLabel="Tambah Kawasan Proyek"
        onAction={() =>
          setEditingProject({
            name: '',
            slug: `proyek-${Date.now()}`,
            category: 'Kawasan Residensial',
            tagline: 'American Classic Living',
            location: 'Kabupaten Bekasi, Jawa Barat',
            shortDescription: '',
            longDescription: '',
            status: 'Development',
            heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
            contactWhatsApp: '6281288889911',
            order: projects.length + 1,
            featured: true,
            seoTitle: '',
            seoDescription: ''
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama kawasan, lokasi, atau peruntukan..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Urutan Tampilan', value: 'order' },
          { label: 'Nama (A-Z)', value: 'name' }
        ]}
      />

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Proyek Ditemukan"
          description="Tidak ada kawasan proyek yang sesuai dengan kriteria pencarian atau filter status yang dipilih."
          actionLabel="Tambah Proyek Baru"
          onAction={() =>
            setEditingProject({
              name: 'Kawasan Baru ZIA',
              slug: `proyek-${Date.now()}`,
              category: 'Kawasan Residensial',
              tagline: 'Konsep Hunian Berkualitas',
              location: 'Kabupaten Bekasi, Jawa Barat',
              shortDescription: 'Deskripsi singkat keunggulan kawasan.',
              longDescription: 'Penjelasan lengkap visi dan konsep proyek.',
              status: 'Development',
              heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
              contactWhatsApp: '6281288889911',
              order: projects.length + 1,
              featured: true
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedProjects.map((p) => (
            <div
              key={p.slug}
              className="bg-stone-950 border border-stone-800 flex flex-col justify-between group hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-stone-900">
                  <img
                    src={p.heroImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <CMSStatusBadge status={p.status} />
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-stone-900/90 text-stone-200 border border-stone-700">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{p.location}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-amber-200/80 italic mb-3">{p.tagline}</p>
                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-4">
                    {p.shortDescription}
                  </p>

                  <div className="p-3 bg-stone-900 border border-stone-800 text-[11px] space-y-1">
                    <div className="flex justify-between text-stone-400">
                      <span>Slug URL:</span>
                      <span className="text-white font-mono">/projects/{p.slug}</span>
                    </div>
                    <div className="flex justify-between text-stone-400">
                      <span>WhatsApp Hotline:</span>
                      <span className="text-emerald-400 font-mono">+{p.contactWhatsApp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 border-t border-stone-800/80 flex items-center justify-between text-xs gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => onNavigatePublic(`/projects/${p.slug}`)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Pratinjau
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(p)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingProject(p)}
                    className="p-1.5 bg-stone-900 hover:bg-red-950 text-stone-400 hover:text-red-400 border border-stone-800 hover:border-red-800 transition-colors"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingProject(null)}
          title={editingProject.id ? `Ubah Data Proyek: ${editingProject.name}` : 'Tambah Kawasan Proyek Baru'}
          subtitle="Isi informasi identitas kawasan, visual, narasi, dan kontak WhatsApp resmi."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Nama Kawasan Proyek <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ZIA Emerald"
                  value={editingProject.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Slug URL Web <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="zia-emerald"
                  value={editingProject.slug || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Kategori Peruntukan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Premium Residential Development"
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Status Kawasan
                </label>
                <select
                  value={editingProject.status || 'Development'}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="Development">Development (Dalam Pembangunan)</option>
                  <option value="Available">Available (Siap Huni / Siap Bangun)</option>
                  <option value="Active">Active (Beroperasi)</option>
                  <option value="Exporting">Exporting (Pasar Global)</option>
                  <option value="Coming Soon">Coming Soon (Draf / Segera Hadir)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Tagline / Slogan Kawasan
              </label>
              <input
                type="text"
                placeholder="American Classic × Modern Family Living"
                value={editingProject.tagline || ''}
                onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Lokasi Geografis
                </label>
                <input
                  type="text"
                  placeholder="Tarumajaya, Kabupaten Bekasi, Jawa Barat"
                  value={editingProject.location || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Nomor WhatsApp Khusus Proyek
                </label>
                <input
                  type="text"
                  placeholder="6281288889922"
                  value={editingProject.contactWhatsApp || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, contactWhatsApp: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                URL Foto Hero Utama
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={editingProject.heroImage || ''}
                onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Ringkasan Narasi (Tampil di Direktori)
              </label>
              <textarea
                rows={2}
                placeholder="Ringkasan konsep arsitektur dan fasilitas unggulan..."
                value={editingProject.shortDescription || ''}
                onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Narasi Lengkap (Tampil di Landing Page Proyek)
              </label>
              <textarea
                rows={4}
                placeholder="Penjelasan mendalam mengenai desain, spesifikasi, dan filosofi..."
                value={editingProject.longDescription || ''}
                onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  SEO Keywords (pisahkan dengan koma)
                </label>
                <textarea
                  rows={4}
                  placeholder="rumah dijual Bekasi, perumahan Tarumajaya"
                  value={(editingProject.seoKeywords || []).join(', ')}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    seoKeywords: e.target.value.split(',').map((value) => value.trim()).filter(Boolean)
                  })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-y"
                />
                <p className="text-[10px] text-stone-500 mt-1">Gunakan frasa relevan. Metadata keywords bukan pengganti konten halaman yang bermanfaat.</p>
              </div>
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Hashtag Sosial (pisahkan dengan koma)
                </label>
                <textarea
                  rows={4}
                  placeholder="#ZIAEmerald, #RumahBekasi"
                  value={(editingProject.socialHashtags || []).join(', ')}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    socialHashtags: e.target.value.split(',').map((value) => value.trim()).filter(Boolean)
                  })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-y"
                />
                <p className="text-[10px] text-stone-500 mt-1">Hashtag dipakai untuk kampanye sosial, bukan dimasukkan paksa ke teks website.</p>
              </div>
            </div>

            {editingProject.slug === 'zia-emerald' && (
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Path Site Plan Resmi (di folder public)
                </label>
                <input
                  type="text"
                  placeholder="/brands/zia-emerald/images/site-plan/site-plan-utama.webp"
                  value={editingProject.sitePlanImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, sitePlanImage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono text-[11px]"
                />
                <p className="text-[10px] text-stone-500 mt-1">Unggah site plan resmi dari tim internal; jangan menggunakan ilustrasi pengganti seolah-olah site plan asli.</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Kawasan'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Confirmation Dialog */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingProject)}
        title="Konfirmasi Hapus Proyek"
        message={`Apakah Anda yakin ingin menghapus kawasan proyek "${deletingProject?.name}"? Tindakan ini bersifat permanen.`}
        confirmLabel="Hapus Permanen"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
};

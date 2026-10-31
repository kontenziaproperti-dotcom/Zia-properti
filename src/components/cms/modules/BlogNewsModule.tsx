import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Newspaper,
  BookOpen,
  Calendar,
  User,
} from 'lucide-react';
import { PostItem, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

const BLOG_CATEGORIES = [
  'Arsitektur American Classic',
  'Tips Pemilihan Kavling',
  'Investasi Jangka Panjang',
  'Agribisnis',
] as const;

const NEWS_CATEGORIES = [
  'Siaran Pers Resmi',
  'Berita Korporat',
  'Agenda & Acara',
  'Ekspor & Agribisnis',
] as const;

interface BlogNewsModuleProps {
  posts: PostItem[];
  defaultType?: 'blog' | 'news';
  onSavePost: (post: Partial<PostItem>) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
  onNavigatePublic: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const BlogNewsModule: React.FC<BlogNewsModuleProps> = ({
  posts,
  defaultType = 'blog',
  onSavePost,
  onDeletePost,
  onNavigatePublic,
  showToast
}) => {
  const [activeType, setActiveType] = useState<'blog' | 'news'>(defaultType);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [editingPost, setEditingPost] = useState<Partial<PostItem> | null>(null);
  const [deletingPost, setDeletingPost] = useState<PostItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter posts by type (blog vs news)
  const typeFilteredPosts = posts.filter((p) => {
    if (activeType === 'news') {
      return p.type === 'news' || p.category.toLowerCase().includes('berita') || p.category.toLowerCase().includes('pers') || p.category.toLowerCase().includes('kabar');
    }
    // Default blog
    return p.type !== 'news';
  });

  // Extract unique categories
  const uniqueCategories = Array.from(new Set(typeFilteredPosts.map((p) => p.category))).filter(Boolean);

  // Search & Status filter
  const filteredPosts = typeFilteredPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;

    const postStatus = post.status || (post.published ? 'published' : 'draft');
    const matchesStatus = statusFilter === 'All' || postStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title) {
      showToast('Judul artikel wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSavePost({
        ...editingPost,
        type: activeType,
        published: editingPost.status !== 'draft'
      });
      setEditingPost(null);
      showToast(`${activeType === 'news' ? 'Kabar rilis' : 'Artikel blog'} berhasil disimpan.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan artikel.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;
    try {
      await onDeletePost(deletingPost.id);
      setDeletingPost(null);
      showToast(`Publikasi "${deletingPost.title}" telah dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus publikasi.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Type Switcher Tabs */}
      <div className="flex border-b border-stone-800 pb-0">
        <button
          onClick={() => setActiveType('blog')}
          className={`px-6 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeType === 'blog'
              ? 'border-amber-400 text-amber-300 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Artikel & Wawasan Blog
        </button>
        <button
          onClick={() => setActiveType('news')}
          className={`px-6 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeType === 'news'
              ? 'border-amber-400 text-amber-300 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          Kabar & Siaran Pers Resmi
        </button>
      </div>

      {/* Header */}
      <CMSModuleHeader
        title={activeType === 'news' ? 'Kabar & Siaran Pers Resmi' : 'Artikel Blog & Wawasan Properti'}
        description={
          activeType === 'news'
            ? 'Publikasikan informasi serah terima unit, kunjungan perbankan, peresmian fasilitas, dan agenda ekspor vanilla.'
            : 'Kelola artikel edukasi arsitektur American Classic, tips pemilihan kavling, investasi jangka panjang, dan agribisnis.'
        }
        actionLabel={activeType === 'news' ? 'Rilis Berita Baru' : 'Tulis Artikel Blog'}
        onAction={() =>
          setEditingPost({
            title: '',
            slug: `artikel-${Date.now()}`,
            category: activeType === 'news' ? NEWS_CATEGORIES[0] : BLOG_CATEGORIES[0],
            summary: '',
            content: '',
            author: 'Tim Komunikasi PT ZIA',
            coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            status: 'published',
            published: true,
            featured: false,
            type: activeType,
            createdAt: new Date().toISOString()
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari judul artikel, penulis, atau kata kunci..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={uniqueCategories.map((c) => ({ label: c, value: c }))}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Terbaru Ditulis', value: 'newest' },
          { label: 'Terlama', value: 'oldest' },
          { label: 'Judul A sampai Z', value: 'title' }
        ]}
      />

      {/* Grid Cards */}
      {sortedPosts.length === 0 ? (
        <CMSEmptyState
          title={`Tidak Ada ${activeType === 'news' ? 'Berita' : 'Artikel'} Ditemukan`}
          description="Belum ada publikasi yang sesuai dengan kriteria filter Anda."
          actionLabel={`Buat ${activeType === 'news' ? 'Berita' : 'Artikel'} Pertama`}
          onAction={() =>
            setEditingPost({
              title: 'Judul Publikasi Baru PT ZIA',
              slug: `artikel-${Date.now()}`,
              category: activeType === 'news' ? NEWS_CATEGORIES[1] : BLOG_CATEGORIES[0],
              summary: 'Ringkasan singkat ulasan materi...',
              content: 'Isi lengkap analisis dan wawasan korporat...',
              author: 'Tim Editorial PT ZIA',
              coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              status: 'published',
              published: true,
              type: activeType,
              createdAt: new Date().toISOString()
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-stone-950 border border-stone-800 flex flex-col justify-between group hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-stone-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <CMSStatusBadge status={post.status || (post.published ? 'published' : 'draft')} />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-900/90 text-amber-300 border border-stone-700">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-stone-500 text-[11px] mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug group-hover:text-amber-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 flex justify-between items-center border-t border-stone-800/80 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => onNavigatePublic('/blog')}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Lihat di Blog
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(post)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-xs font-semibold text-stone-200 flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingPost(post)}
                    className="p-1.5 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
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
      {editingPost && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingPost(null)}
          title={editingPost.id ? `Ubah Artikel: ${editingPost.title}` : `Tulis ${activeType === 'news' ? 'Kabar Berita' : 'Artikel Blog'} Baru`}
          subtitle="Tuliskan judul informatif, ringkasan, isi konten, dan tautan gambar pendukung."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Judul Artikel / Publikasi <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Mengapa High Ceiling Menjadi Ciri Khas Desain ZIA Emerald?"
                value={editingPost.title || ''}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Kategori Topik
                </label>
                <select
                  value={editingPost.category || (activeType === 'news' ? NEWS_CATEGORIES[0] : BLOG_CATEGORIES[0])}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  {(activeType === 'news' ? NEWS_CATEGORIES : BLOG_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Nama Penulis / Tim
                </label>
                <input
                  type="text"
                  placeholder="Tim Komunikasi PT ZIA"
                  value={editingPost.author || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  Status Publikasi
                </label>
                <select
                  value={editingPost.status || (editingPost.published ? 'published' : 'draft')}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      status: e.target.value as ContentStatus,
                      published: e.target.value === 'published'
                    })
                  }
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Published)</option>
                  <option value="draft">Draf (Draft)</option>
                  <option value="archived">Arsip (Archived)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1">
                  URL Gambar Cover
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingPost.coverImage || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Ringkasan Singkat (Lead Paragraph)
              </label>
              <textarea
                rows={2}
                placeholder="Ringkasan 2-3 kalimat mengenai inti ulasan artikel..."
                value={editingPost.summary || ''}
                onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Konten Lengkap Artikel
              </label>
              <textarea
                rows={7}
                placeholder="Tuliskan ulasan lengkap artikel atau rilis berita..."
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white leading-relaxed resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan & Publikasikan'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingPost)}
        title="Konfirmasi Hapus Publikasi"
        message={`Apakah Anda yakin ingin menghapus "${deletingPost?.title}"?`}
        confirmLabel="Hapus Publikasi"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPost(null)}
      />
    </div>
  );
};

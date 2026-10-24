import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Trash2,
  CheckCircle,
  Eye,
  ExternalLink,
  Plus
} from 'lucide-react';
import { MediaAsset } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface MediaModuleProps {
  media: MediaAsset[];
  onAddMedia: (asset: Omit<MediaAsset, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteMedia: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const MediaModule: React.FC<MediaModuleProps> = ({
  media,
  onAddMedia,
  onDeleteMedia,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [newMediaModal, setNewMediaModal] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState<MediaAsset | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaAsset | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [brand, setBrand] = useState<MediaAsset['brand']>('Corporate');
  const [category, setCategory] = useState<MediaAsset['category']>('Architecture');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredMedia = media.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = brandFilter === 'All' || item.brand === brandFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUrl(result);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      showToast('Silakan pilih file gambar atau masukkan URL.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onAddMedia({
        url,
        title: title || 'Aset Visual ZIA',
        alt: alt || title || 'Visual PT ZIA Properti Indonesia',
        brand,
        category,
        fileType: url.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
      });
      setNewMediaModal(false);
      setUrl('');
      setTitle('');
      setAlt('');
      showToast('Aset gambar berhasil ditambahkan ke pustaka.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan media.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    showToast('Tautan URL gambar berhasil disalin ke clipboard!');
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMedia) return;
    try {
      await onDeleteMedia(deletingMedia.id);
      setDeletingMedia(null);
      showToast('Aset media berhasil dihapus.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus aset media.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Pustaka Media Visual (Media Library)"
        description="Unggah foto fasad hunian, denah, lansekap kavling, peternakan, dan komoditas vanilla. Salin URL dengan satu klik untuk disematkan pada tipe unit atau artikel."
        actionLabel="Unggah Gambar Baru"
        onAction={() => {
          setUrl('');
          setTitle('');
          setAlt('');
          setNewMediaModal(true);
        }}
      />

      {/* Filter and Search Bar */}
      <div className="p-3 bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2">
          <ImageIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul gambar atau alt text..."
            className="w-full bg-transparent text-white placeholder-stone-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Merek:
            </span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-stone-900 text-stone-200">Semua Merek</option>
              <option value="Corporate" className="bg-stone-900 text-stone-200">Corporate</option>
              <option value="ZIA Emerald" className="bg-stone-900 text-stone-200">ZIA Emerald</option>
              <option value="Kav Hillside" className="bg-stone-900 text-stone-200">Kav Hillside</option>
              <option value="ZIA Farm" className="bg-stone-900 text-stone-200">ZIA Farm</option>
              <option value="Altara ZIA International" className="bg-stone-900 text-stone-200">Altara ZIA</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Kategori:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-stone-900 text-stone-200">Semua Kategori</option>
              <option value="Architecture" className="bg-stone-900 text-stone-200">Arsitektur</option>
              <option value="Exterior" className="bg-stone-900 text-stone-200">Eksterior</option>
              <option value="Interior" className="bg-stone-900 text-stone-200">Interior</option>
              <option value="Landscape" className="bg-stone-900 text-stone-200">Lansekap</option>
              <option value="Masterplan" className="bg-stone-900 text-stone-200">Masterplan</option>
              <option value="Livestock" className="bg-stone-900 text-stone-200">Peternakan</option>
              <option value="Vanilla" className="bg-stone-900 text-stone-200">Vanilla</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <CMSEmptyState
          title="Pustaka Media Kosong"
          description="Tidak ada file gambar yang cocok dengan filter yang ditentukan."
          actionLabel="Unggah Aset Visual"
          onAction={() => setNewMediaModal(true)}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((asset) => (
            <div
              key={asset.id}
              className="bg-stone-950 border border-stone-800 overflow-hidden flex flex-col justify-between group hover:border-amber-400/50 transition-colors"
            >
              <div className="h-36 overflow-hidden relative bg-stone-900">
                <img
                  src={asset.url}
                  alt={asset.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-stone-900/90 text-amber-300 border border-stone-700">
                  {asset.category}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(asset)}
                  className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="Pratinjau Gambar"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3">
                <h4 className="font-medium text-white truncate text-xs mb-1" title={asset.title}>
                  {asset.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>{asset.brand}</span>
                  <span className="truncate max-w-[80px]">{asset.fileType.split('/')[1] || 'img'}</span>
                </div>
              </div>

              <div className="p-2 border-t border-stone-800 flex items-center justify-between gap-1 bg-stone-900/50">
                <button
                  type="button"
                  onClick={() => copyToClipboard(asset.url)}
                  className="flex-1 py-1 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  title="Salin URL Gambar"
                >
                  <Copy className="w-3 h-3" />
                  Salin URL
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingMedia(asset)}
                  className="p-1 text-stone-500 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                  title="Hapus Media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {newMediaModal && (
        <CMSModal
          isOpen={true}
          onClose={() => setNewMediaModal(false)}
          title="Unggah Aset Visual Proyek"
          subtitle="Pilih berkas dari komputer Anda atau sematkan tautan gambar eksternal."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Pilih File Gambar dari Komputer:
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="w-full text-xs text-stone-300 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-stone-800 file:text-amber-300 file:cursor-pointer hover:file:bg-stone-700 font-sans"
              />
            </div>

            <div className="text-stone-500 text-center text-[10px] uppercase tracking-wider">— ATAU TEMPELKAN URL GAMBAR —</div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                URL Gambar Eksternal
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 p-2 text-white font-mono text-[11px]"
              />
            </div>

            {url && (
              <div className="p-2 bg-stone-950 border border-stone-800">
                <span className="text-[10px] text-stone-500 block mb-1">Pratinjau Gambar:</span>
                <img src={url} alt="Pratinjau" className="w-full h-32 object-cover border border-stone-800" />
              </div>
            )}

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Judul / Nama Aset <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Fasad Depan ZIA Emerald Type 50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Teks Alternatif (Alt Text SEO & Aksesibilitas)
              </label>
              <input
                type="text"
                placeholder="Rumah bergaya American Classic ZIA Emerald Bekasi"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Merek Entitas
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="Corporate">Corporate PT ZIA</option>
                  <option value="ZIA Emerald">ZIA Emerald</option>
                  <option value="Kav Hillside">Kav Hillside</option>
                  <option value="ZIA Farm">ZIA Farm</option>
                  <option value="Altara ZIA International">Altara ZIA</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Kategori Visual
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="Architecture">Arsitektur</option>
                  <option value="Exterior">Eksterior</option>
                  <option value="Interior">Interior</option>
                  <option value="Landscape">Lansekap</option>
                  <option value="Masterplan">Masterplan</option>
                  <option value="Livestock">Peternakan</option>
                  <option value="Vanilla">Vanilla</option>
                  <option value="Corporate">Korporat</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setNewMediaModal(false)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan ke Pustaka'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <CMSModal
          isOpen={true}
          onClose={() => setPreviewMedia(null)}
          title={previewMedia.title}
          subtitle={`${previewMedia.brand} • ${previewMedia.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-stone-950 border border-stone-800">
              <img src={previewMedia.url} alt={previewMedia.alt} className="max-h-[60vh] object-contain" />
            </div>

            <div className="p-3 bg-stone-950 border border-stone-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">URL Gambar:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(previewMedia.url)}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" />
                  Salin URL Gambar
                </button>
              </div>
              <div className="text-stone-300 font-mono text-[11px] break-all bg-stone-900 p-2 border border-stone-800">
                {previewMedia.url}
              </div>
            </div>
          </div>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingMedia)}
        title="Konfirmasi Hapus Aset Media"
        message={`Apakah Anda yakin ingin menghapus gambar "${deletingMedia?.title}" dari pustaka?`}
        confirmLabel="Hapus Gambar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingMedia(null)}
      />
    </div>
  );
};

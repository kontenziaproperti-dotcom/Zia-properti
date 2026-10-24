import React, { useState } from 'react';
import {
  Home,
  Edit2,
  Trash2,
  Layers,
  Bed,
  Bath,
  Maximize2,
  Tag,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { PropertyItem, ProjectEntity, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface PropertiesModuleProps {
  properties: PropertyItem[];
  projects: ProjectEntity[];
  onSaveProperty: (property: Partial<PropertyItem>) => Promise<void>;
  onDeleteProperty: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const PropertiesModule: React.FC<PropertiesModuleProps> = ({
  properties,
  projects,
  onSaveProperty,
  onDeleteProperty,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [editingProperty, setEditingProperty] = useState<Partial<PropertyItem> | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<PropertyItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.priceFormatted.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = projectFilter === 'All' || p.projectSlug === projectFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'published' && p.status === 'Available') ||
      (statusFilter === 'draft' && (p.status === 'Coming Soon' || p.status === 'Reserved')) ||
      (statusFilter === 'archived' && (p.status === 'Sold' || p.status === 'Unavailable'));

    return matchesSearch && matchesProject && matchesStatus;
  });

  // Sort
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'landArea') return b.landArea - a.landArea;
    if (sortBy === 'buildingArea') return b.buildingArea - a.buildingArea;
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty?.name || !editingProperty?.projectSlug) {
      showToast('Nama tipe dan proyek wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveProperty(editingProperty);
      setEditingProperty(null);
      showToast('Data tipe unit hunian berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan unit.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProperty) return;
    try {
      await onDeleteProperty(deletingProperty.id);
      setDeletingProperty(null);
      showToast(`Tipe unit ${deletingProperty.name} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus unit.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Tipe Unit Hunian & Bangunan"
        description="Kelola spesifikasi bangunan American Classic, luas tanah/bangunan, denah arsitektur, estimasi cicilan, dan ketersediaan."
        actionLabel="Tambah Tipe Unit"
        onAction={() =>
          setEditingProperty({
            name: '',
            type: 'Rumah Tinggal 1 Lantai + Mezanin',
            projectSlug: projects[0]?.slug || 'zia-emerald',
            landArea: 72,
            buildingArea: 50,
            bedrooms: 2,
            bathrooms: 1,
            floors: 1,
            priceFormatted: 'Mulai Rp 650 Juta-an',
            downPayment: 'DP Mulai 0%',
            installmentEstimate: 'Mulai Rp 3,8 Jt / bln',
            status: 'Available',
            mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            description: 'Hunian bergaya American Classic dengan plafon tinggi dan pencahayaan alami maksimal.',
            specifications: {
              'Pondasi': 'Batu Kali & Beton Bertulang',
              'Dinding': 'Bata Ringan Diplester Aci & Cat Weatherproof',
              'Lantai': 'Homogeneous Tile 60x60',
              'Sanitair': 'American Standard / Toto'
            }
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama tipe, harga, atau spesifikasi..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={projectFilter}
        onCategoryChange={setProjectFilter}
        categories={projects.map((p) => ({ label: p.name, value: p.slug }))}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Nama Tipe (A-Z)', value: 'name' },
          { label: 'Luas Tanah Terbesar', value: 'landArea' },
          { label: 'Luas Bangunan Terbesar', value: 'buildingArea' }
        ]}
      />

      {/* Property Cards Grid */}
      {sortedProperties.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Unit Ditemukan"
          description="Tidak ada tipe unit hunian yang cocok dengan kata kunci pencarian atau filter yang Anda pilih."
          actionLabel="Tambah Tipe Unit Baru"
          onAction={() =>
            setEditingProperty({
              name: 'Tipe Baru American Classic',
              type: 'Rumah Tinggal 1 Lantai',
              projectSlug: projects[0]?.slug || 'zia-emerald',
              landArea: 72,
              buildingArea: 50,
              bedrooms: 2,
              bathrooms: 1,
              floors: 1,
              priceFormatted: 'Mulai Rp 600 Jt-an',
              status: 'Available',
              mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              description: 'Deskripsi unit hunian.'
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-stone-950 border border-stone-800 flex flex-col justify-between group hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-stone-900">
                  <img
                    src={prop.mainImage}
                    alt={prop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <CMSStatusBadge status={prop.status} />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-900/90 text-amber-300 border border-stone-800">
                      {prop.projectSlug}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono block mb-1">
                    {prop.type}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">{prop.name}</h3>
                  <p className="text-xs text-stone-400 line-clamp-2 mb-4 leading-relaxed">
                    {prop.description}
                  </p>

                  <div className="p-3 bg-stone-900 text-xs border border-stone-800 space-y-1.5">
                    <div className="flex justify-between text-stone-400 text-[11px]">
                      <span>LT / LB:</span>
                      <span className="text-white font-medium">
                        {prop.landArea}m² / {prop.buildingArea}m²
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-400 text-[11px]">
                      <span>Kamar Tidur / Mandi:</span>
                      <span className="text-white font-medium">
                        {prop.bedrooms} KT / {prop.bathrooms} KM ({prop.floors} Lt)
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-400 text-[11px] pt-1 border-t border-stone-800">
                      <span>Harga Terpasang:</span>
                      <span className="text-amber-300 font-semibold">{prop.priceFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 flex gap-2 border-t border-stone-800/80 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingProperty(prop)}
                  className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-xs uppercase tracking-wider font-semibold text-stone-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingProperty(prop)}
                  className="p-2 text-stone-500 hover:text-red-400 bg-stone-900 hover:bg-red-950/50 border border-stone-800 hover:border-red-800 transition-colors"
                  title="Hapus Unit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Property Modal */}
      {editingProperty && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingProperty(null)}
          title={editingProperty.id ? `Ubah Data Unit: ${editingProperty.name}` : 'Tambah Tipe Unit Baru'}
          subtitle="Masukkan data spesifikasi teknis, harga, cicilan, dan foto unit."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Nama Tipe Unit <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Type 50/72 Mezzanine"
                  value={editingProperty.name || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Kawasan Proyek Terkait <span className="text-amber-500">*</span>
                </label>
                <select
                  value={editingProperty.projectSlug || projects[0]?.slug}
                  onChange={(e) => setEditingProperty({ ...editingProperty, projectSlug: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-stone-400 uppercase block mb-1">Luas Tanah (m²)</label>
                <input
                  type="number"
                  value={editingProperty.landArea || 72}
                  onChange={(e) => setEditingProperty({ ...editingProperty, landArea: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-stone-400 uppercase block mb-1">Luas Bangunan (m²)</label>
                <input
                  type="number"
                  value={editingProperty.buildingArea || 50}
                  onChange={(e) => setEditingProperty({ ...editingProperty, buildingArea: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-stone-400 uppercase block mb-1">Kamar Tidur</label>
                <input
                  type="number"
                  value={editingProperty.bedrooms || 2}
                  onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-stone-400 uppercase block mb-1">Kamar Mandi</label>
                <input
                  type="number"
                  value={editingProperty.bathrooms || 1}
                  onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-stone-400 uppercase block mb-1">Format Harga</label>
                <input
                  type="text"
                  placeholder="Mulai Rp 650 Juta-an"
                  value={editingProperty.priceFormatted || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, priceFormatted: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-stone-400 uppercase block mb-1">Uang Muka (DP)</label>
                <input
                  type="text"
                  placeholder="DP Mulai 0%"
                  value={editingProperty.downPayment || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, downPayment: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="text-stone-400 uppercase block mb-1">Estimasi Cicilan</label>
                <input
                  type="text"
                  placeholder="Mulai Rp 3,8 Jt / bln"
                  value={editingProperty.installmentEstimate || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, installmentEstimate: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase block mb-1">Status Ketersediaan</label>
                <select
                  value={editingProperty.status || 'Available'}
                  onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white"
                >
                  <option value="Available">Available (Tersedia / Siap Dipilih)</option>
                  <option value="Reserved">Reserved (Terbooking / Draf)</option>
                  <option value="Sold">Sold (Habis Terjual / Arsip)</option>
                  <option value="Coming Soon">Coming Soon (Segera Hadir)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase block mb-1">URL Foto Fasad Utama</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingProperty.mainImage || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, mainImage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase block mb-1">Deskripsi Keunggulan Unit</label>
              <textarea
                rows={3}
                placeholder="Penjelasan arsitektur, ventilasi, pencahayaan alami, atau opsi mezanin..."
                value={editingProperty.description || ''}
                onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Tipe Unit'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Confirmation Dialog */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingProperty)}
        title="Konfirmasi Hapus Unit"
        message={`Apakah Anda yakin ingin menghapus tipe unit "${deletingProperty?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Unit"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProperty(null)}
      />
    </div>
  );
};

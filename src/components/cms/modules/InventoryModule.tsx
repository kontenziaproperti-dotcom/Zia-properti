import React, { useState } from 'react';
import {
  Layers,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { KavlingPlot, PropertyStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface InventoryModuleProps {
  plots: KavlingPlot[];
  onSavePlot: (plot: Partial<KavlingPlot>) => Promise<void>;
  onDeletePlot: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  plots,
  onSavePlot,
  onDeletePlot,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [blockFilter, setBlockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('plotId');
  const [editingPlot, setEditingPlot] = useState<Partial<KavlingPlot> | null>(null);
  const [deletingPlot, setDeletingPlot] = useState<KavlingPlot | null>(null);
  const [saving, setSaving] = useState(false);

  // Extract unique blocks
  const uniqueBlocks = Array.from(new Set(plots.map((p) => p.block))).filter(Boolean);

  // Filter & Search
  const filteredPlots = plots.filter((plot) => {
    const matchesSearch =
      plot.plotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plot.notes && plot.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBlock = blockFilter === 'All' || plot.block === blockFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'published' && plot.status === 'Available') ||
      (statusFilter === 'draft' && plot.status === 'Reserved') ||
      (statusFilter === 'archived' && plot.status === 'Sold');

    return matchesSearch && matchesBlock && matchesStatus;
  });

  // Sort
  const sortedPlots = [...filteredPlots].sort((a, b) => {
    if (sortBy === 'plotId') return a.plotId.localeCompare(b.plotId);
    if (sortBy === 'landSize') return b.landSize - a.landSize;
    return 0;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot?.plotId || !editingPlot?.block) {
      showToast('ID Plot dan Blok kavling wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSavePlot(editingPlot);
      setEditingPlot(null);
      showToast('Data kavling tanah berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan kavling.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlot) return;
    try {
      await onDeletePlot(deletingPlot.id);
      setDeletingPlot(null);
      showToast(`Plot ${deletingPlot.plotId} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus kavling.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Inventaris Kavling & Stok Properti"
        description="Pantau nomor kavling siap bangun, status ketersediaan (Available, Reserved, Sold), luas tanah, dan orientasi."
        actionLabel="Tambah Plot Kavling"
        onAction={() =>
          setEditingPlot({
            plotId: `PLOT-${Date.now().toString().slice(-4)}`,
            block: 'Blok A',
            lotNumber: '01',
            landSize: 96,
            frontage: 8,
            priceFormatted: 'Mulai Rp 280 Jt-an',
            status: 'Available',
            notes: 'Posisi hook, menghadap timur asri.'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari kode plot (misal: A-01), blok, atau posisi..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={blockFilter}
        onCategoryChange={setBlockFilter}
        categories={uniqueBlocks.map((b) => ({ label: `Blok ${b}`, value: b }))}
        sortValue={sortBy}
        onSortChange={setSortBy}
        sortOptions={[
          { label: 'Kode Plot (A-Z)', value: 'plotId' },
          { label: 'Luas Tanah Terbesar', value: 'landSize' }
        ]}
      />

      {/* Table */}
      {sortedPlots.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Data Kavling"
          description="Tidak ditemukan plot kavling dengan kriteria yang Anda cari."
          actionLabel="Tambah Kavling Baru"
          onAction={() =>
            setEditingPlot({
              plotId: 'BLOK-A01',
              block: 'Blok A',
              lotNumber: '01',
              landSize: 96,
              frontage: 8,
              priceFormatted: 'Mulai Rp 280 Jt',
              status: 'Available'
            })
          }
        />
      ) : (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3.5">Kode Plot</th>
                <th className="p-3.5">Zona / Blok</th>
                <th className="p-3.5">Luas Tanah</th>
                <th className="p-3.5">Lebar Muka</th>
                <th className="p-3.5">Estimasi Nilai</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Keterangan / Posisi</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {sortedPlots.map((plot) => (
                <tr key={plot.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-white">{plot.plotId}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-stone-300 font-mono text-[11px]">
                      {plot.block}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium">{plot.landSize} m²</td>
                  <td className="p-3.5 text-stone-400">{plot.frontage || 8} meter</td>
                  <td className="p-3.5 text-amber-300 font-semibold">{plot.priceFormatted || '-'}</td>
                  <td className="p-3.5">
                    <CMSStatusBadge status={plot.status} />
                  </td>
                  <td className="p-3.5 text-stone-400 max-w-xs truncate">{plot.notes || '-'}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPlot(plot)}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingPlot(plot)}
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

      {/* Edit / Create Plot Modal */}
      {editingPlot && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingPlot(null)}
          title={editingPlot.id ? `Ubah Plot: ${editingPlot.plotId}` : 'Tambah Plot Kavling Baru'}
          subtitle="Atur identifikasi kavling, zonasi blok, luas tanah, dan status penjualan."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase block mb-1 font-medium">
                  ID / Nomor Plot <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: A-01"
                  value={editingPlot.plotId || ''}
                  onChange={(e) => setEditingPlot({ ...editingPlot, plotId: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase block mb-1 font-medium">
                  Zona / Blok <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Blok A"
                  value={editingPlot.block || ''}
                  onChange={(e) => setEditingPlot({ ...editingPlot, block: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase block mb-1">Luas Tanah (m²)</label>
                <input
                  type="number"
                  value={editingPlot.landSize || 96}
                  onChange={(e) => setEditingPlot({ ...editingPlot, landSize: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase block mb-1">Lebar Muka (m)</label>
                <input
                  type="number"
                  value={editingPlot.frontage || 8}
                  onChange={(e) => setEditingPlot({ ...editingPlot, frontage: Number(e.target.value) })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-400 uppercase block mb-1">Format Harga</label>
                <input
                  type="text"
                  placeholder="Mulai Rp 280 Juta"
                  value={editingPlot.priceFormatted || ''}
                  onChange={(e) => setEditingPlot({ ...editingPlot, priceFormatted: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase block mb-1">Status Ketersediaan</label>
                <select
                  value={editingPlot.status || 'Available'}
                  onChange={(e) => setEditingPlot({ ...editingPlot, status: e.target.value as PropertyStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="Available">Available (Tersedia / Terbit)</option>
                  <option value="Reserved">Reserved (Terpesan / Draf)</option>
                  <option value="Sold">Sold (Terjual / Arsip)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase block mb-1">Catatan Posisi / Orientasi</label>
              <input
                type="text"
                placeholder="Hook jalan utama, hadap timur, kontur datar..."
                value={editingPlot.notes || ''}
                onChange={(e) => setEditingPlot({ ...editingPlot, notes: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingPlot(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Plot'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Confirmation Dialog */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingPlot)}
        title="Konfirmasi Hapus Kavling"
        message={`Apakah Anda yakin ingin menghapus data kavling plot ${deletingPlot?.plotId}?`}
        confirmLabel="Hapus Kavling"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPlot(null)}
      />
    </div>
  );
};

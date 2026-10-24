import React, { useState } from 'react';
import {
  FileCheck,
  Edit2,
  Trash2,
  Send,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import { FormConfigItem, ProjectEntity, ContentStatus } from '../../../types';
import {
  CMSModuleHeader,
  CMSSearchFilter,
  CMSStatusBadge,
  CMSModal,
  CMSConfirmDialog,
  CMSEmptyState
} from '../CMSUI';

interface FormsModuleProps {
  forms: FormConfigItem[];
  projects: ProjectEntity[];
  onSaveForm: (form: Partial<FormConfigItem>) => Promise<void>;
  onDeleteForm: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const FormsModule: React.FC<FormsModuleProps> = ({
  forms,
  projects,
  onSaveForm,
  onDeleteForm,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingForm, setEditingForm] = useState<Partial<FormConfigItem> | null>(null);
  const [deletingForm, setDeletingForm] = useState<FormConfigItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter & Search
  const filteredForms = forms.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingForm?.name || !editingForm?.formKey) {
      showToast('Nama formulir dan kode unik wajib diisi.', 'error');
      return;
    }

    setSaving(true);
    try {
      await onSaveForm(editingForm);
      setEditingForm(null);
      showToast('Konfigurasi formulir berhasil disimpan.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan formulir.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingForm) return;
    try {
      await onDeleteForm(deletingForm.id);
      setDeletingForm(null);
      showToast(`Formulir ${deletingForm.name} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus formulir.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Pengaturan Formulir Kontak & Brosur (Forms)"
        description="Sesuaikan judul formulir, teks tombol submit, pesan konfirmasi sukses, dan nomor WhatsApp / email tujuan notifikasi saat konsumen mendaftar."
        actionLabel="Buat Formulir Baru"
        onAction={() =>
          setEditingForm({
            name: '',
            formKey: `form-${Date.now().toString().slice(-4)}`,
            projectSlug: 'all',
            title: 'Konsultasi & Reservasi Privat',
            subtitle: 'Dapatkan brosur spesifikasi dan jadwal survei langsung dari representatif PT ZIA Properti Indonesia.',
            submitButtonText: 'Kirim Permintaan Konsultasi',
            successMessage: 'Terima kasih, perwakilan kami akan segera menghubungi Anda via WhatsApp.',
            notifyEmail: 'sales@ziaproperti.co.id',
            notifyWhatsApp: '6281288889911',
            status: 'published'
          })
        }
      />

      {/* Filter and Search Bar */}
      <CMSSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama formulir atau kode..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Grid Cards */}
      {filteredForms.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Formulir"
          description="Belum ada formulir yang sesuai dengan filter pencarian."
          actionLabel="Buat Formulir Pertama"
          onAction={() =>
            setEditingForm({
              name: 'Formulir Survei Lokasi',
              formKey: 'site-visit',
              projectSlug: 'all',
              title: 'Jadwalkan Kunjungan Lokasi',
              subtitle: 'Kunjungi show unit kami di Tarumajaya Bekasi.',
              submitButtonText: 'Reservasi Jadwal',
              successMessage: 'Jadwal kunjungan Anda telah tercatat.',
              status: 'published'
            })
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-stone-950 border border-stone-800 p-6 flex flex-col justify-between group hover:border-stone-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CMSStatusBadge status={form.status} />
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-900 text-amber-300 border border-stone-800">
                      key: {form.formKey}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">
                    Proyek: {form.projectSlug}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-1">{form.name}</h3>
                <p className="text-xs text-amber-200/90 font-medium mb-3">"{form.title}"</p>
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
                  {form.subtitle}
                </p>

                <div className="p-3 bg-stone-900 border border-stone-800 text-[11px] space-y-1.5">
                  <div className="flex justify-between text-stone-400">
                    <span>Tombol Submit:</span>
                    <span className="text-white font-medium">"{form.submitButtonText}"</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>WhatsApp Notifikasi:</span>
                    <span className="text-emerald-400 font-mono">+{form.notifyWhatsApp || '-'}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Email Tujuan:</span>
                    <span className="text-stone-300 font-mono">{form.notifyEmail || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-stone-800/80 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingForm(form)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-xs font-semibold text-stone-200 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Ubah
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingForm(form)}
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
      {editingForm && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingForm(null)}
          title={editingForm.id ? `Ubah Formulir: ${editingForm.name}` : 'Buat Formulir Baru'}
          subtitle="Atur judul formulir, label tombol aksi, pesan sukses, dan tujuan notifikasi."
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Nama Identitas Formulir <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Formulir Unduh Brosur ZIA Emerald"
                  value={editingForm.name || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Kode Unik Form (Key) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="emerald-brochure"
                  value={editingForm.formKey || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, formKey: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Kawasan Proyek Dituju
                </label>
                <select
                  value={editingForm.projectSlug || 'all'}
                  onChange={(e) => setEditingForm({ ...editingForm, projectSlug: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="all">Semua Proyek (Global Corporate)</option>
                  {projects.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Status Formulir
                </label>
                <select
                  value={editingForm.status || 'published'}
                  onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value as ContentStatus })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                >
                  <option value="published">Terbit (Aktif Menerima Input)</option>
                  <option value="draft">Draf (Disimpan Sementara)</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Judul Formulir (Tampil di Layar) <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Konsultasi & Reservasi Privat"
                value={editingForm.title || ''}
                onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1">
                Subjudul Penjelasan
              </label>
              <textarea
                rows={2}
                placeholder="Dapatkan brosur spesifikasi dan jadwal survei langsung..."
                value={editingForm.subtitle || ''}
                onChange={(e) => setEditingForm({ ...editingForm, subtitle: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Teks Tombol Submit
                </label>
                <input
                  type="text"
                  placeholder="Kirim Permintaan Konsultasi"
                  value={editingForm.submitButtonText || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, submitButtonText: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  WhatsApp Notifikasi Sales
                </label>
                <input
                  type="text"
                  placeholder="6281288889911"
                  value={editingForm.notifyWhatsApp || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, notifyWhatsApp: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Pesan Notifikasi Sukses
              </label>
              <input
                type="text"
                placeholder="Terima kasih, representatif kami akan segera menghubungi Anda."
                value={editingForm.successMessage || ''}
                onChange={(e) => setEditingForm({ ...editingForm, successMessage: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingForm(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Formulir'}
              </button>
            </div>
          </form>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingForm)}
        title="Konfirmasi Hapus Formulir"
        message={`Apakah Anda yakin ingin menghapus konfigurasi formulir "${deletingForm?.name}"?`}
        confirmLabel="Hapus Formulir"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingForm(null)}
      />
    </div>
  );
};

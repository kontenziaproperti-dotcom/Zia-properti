import React, { useState } from 'react';
import {
  Users,
  Download,
  Search,
  Filter,
  Trash2,
  Edit2,
  Send,
  Calendar,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle,
  Phone
} from 'lucide-react';
import { LeadItem, LeadStatus, ProjectEntity } from '../../../types';
import {
  CMSModuleHeader,
  CMSConfirmDialog,
  CMSEmptyState,
  CMSModal
} from '../CMSUI';
import { exportLeadsToGoogleSheet } from '../../../services/workspaceService';

interface LeadsModuleProps {
  leads: LeadItem[];
  projects: ProjectEntity[];
  onUpdateLeadStatus: (id: string, status: LeadStatus, notes?: string) => Promise<void>;
  onDeleteLead: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  projects,
  onUpdateLeadStatus,
  onDeleteLead,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [editingLead, setEditingLead] = useState<LeadItem | null>(null);
  const [deletingLead, setDeletingLead] = useState<LeadItem | null>(null);
  const [noteText, setNoteText] = useState('');

  // Filter & Search
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.message && lead.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesProject = projectFilter === 'All' || lead.projectSlug === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const exportCsv = () => {
    if (filteredLeads.length === 0) {
      showToast('Tidak ada data leads untuk diekspor.', 'error');
      return;
    }

    const headers = ['Waktu Masuk', 'Nama Lengkap', 'Nomor WhatsApp', 'Email', 'Kawasan Proyek', 'Minat Tipe', 'Status Prospek', 'Pesan / Keterangan', 'Catatan'];
    const rows = filteredLeads.map((l) => [
      `"${new Date(l.createdAt).toLocaleDateString('id-ID')}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || '-'}"`,
      `"${l.projectName || '-'}"`,
      `"${l.propertyType || '-'}"`,
      `"${l.status}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leads-PT-ZIA-Properti-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Berhasil mengekspor ${filteredLeads.length} data prospek ke format CSV.`);
  };

  const [exportingSheets, setExportingSheets] = useState(false);

  const handleExportGoogleSheets = async () => {
    if (filteredLeads.length === 0) {
      showToast('Tidak ada data prospek untuk diekspor ke Google Sheets.', 'error');
      return;
    }
    setExportingSheets(true);
    try {
      const res = await exportLeadsToGoogleSheet(filteredLeads);
      showToast(`Berhasil mengekspor ${res.rowsExported} prospek ke Google Sheets!`, 'success');
      window.open(res.spreadsheetUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengekspor ke Google Sheets. Pastikan akun Google terhubung di tab Google Workspace.', 'error');
    } finally {
      setExportingSheets(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await onUpdateLeadStatus(leadId, newStatus);
      showToast('Status tahapan prospek berhasil diperbarui.');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui status.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;
    try {
      await onDeleteLead(deletingLead.id);
      setDeletingLead(null);
      showToast(`Kontak prospek ${deletingLead.name} berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus prospek.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Manajemen Prospek Konsumen (Leads CRM)"
        description="Pantau kontak konsumen dari formulir publik, tindak lanjuti langsung via WhatsApp, kelola tahapan penjualan, dan ekspor data."
        badge={`${filteredLeads.length} Prospek`}
        secondaryAction={
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportGoogleSheets}
              disabled={exportingSheets}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{exportingSheets ? 'Mengekspor...' : 'Google Sheets'}</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-3 bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-2">
          <Search className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama konsumen, nomor WhatsApp, atau pesan..."
            className="w-full bg-transparent text-white placeholder-stone-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Tahapan:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-stone-900 text-stone-200">
                Semua Status
              </option>
              <option value="New" className="bg-stone-900 text-stone-200">
                New (Baru Masuk)
              </option>
              <option value="Contacted" className="bg-stone-900 text-stone-200">
                Contacted (Sudah Dihubungi)
              </option>
              <option value="Qualified" className="bg-stone-900 text-stone-200">
                Qualified (Berminat / Valid)
              </option>
              <option value="Site Visit" className="bg-stone-900 text-stone-200">
                Site Visit (Jadwal Survei Lokasi)
              </option>
              <option value="Follow Up" className="bg-stone-900 text-stone-200">
                Follow Up (Berkas KPR / Negosiasi)
              </option>
              <option value="Booked" className="bg-stone-900 text-stone-200">
                Booked (Booking Fee Diterima)
              </option>
              <option value="Closed" className="bg-stone-900 text-stone-200">
                Closed (Akad Selesai)
              </option>
              <option value="Lost" className="bg-stone-900 text-stone-200">
                Lost (Batal / Tidak Merespon)
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              Proyek:
            </span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-transparent text-stone-300 focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-stone-900 text-stone-200">
                Semua Kawasan
              </option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug} className="bg-stone-900 text-stone-200">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredLeads.length === 0 ? (
        <CMSEmptyState
          title="Tidak Ada Prospek Ditemukan"
          description="Tidak ada pesan konsumen yang sesuai dengan kata kunci atau filter status yang dipilih."
        />
      ) : (
        <div className="bg-stone-950 border border-stone-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3.5">Waktu Masuk</th>
                <th className="p-3.5">Nama Konsumen</th>
                <th className="p-3.5">WhatsApp / Telepon</th>
                <th className="p-3.5">Kawasan / Minat</th>
                <th className="p-3.5">Pesan Masuk</th>
                <th className="p-3.5">Status Tahapan</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-900/50 transition-colors">
                  <td className="p-3.5 text-stone-500 font-mono">
                    {new Date(lead.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3.5 font-bold text-white">
                    <div>{lead.name}</div>
                    {lead.email && <span className="text-[11px] text-stone-500 font-mono">{lead.email}</span>}
                  </td>
                  <td className="p-3.5 font-mono">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Halo Bapak/Ibu ${lead.name}, saya representatif dari PT ZIA Properti Indonesia menindaklanjuti pesan Anda mengenai ${lead.projectName}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3 h-3 shrink-0" />
                      {lead.phone}
                    </a>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-amber-200 block">{lead.projectName}</span>
                    <span className="text-[11px] text-stone-500">{lead.propertyType || '-'}</span>
                  </td>
                  <td className="p-3.5 text-stone-400 max-w-xs truncate">{lead.message || '-'}</td>
                  <td className="p-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className={`text-xs font-semibold px-2.5 py-1 border rounded-none cursor-pointer ${
                        lead.status === 'New'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : lead.status === 'Site Visit'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : lead.status === 'Booked' || lead.status === 'Closed'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : 'bg-stone-900 text-stone-300 border-stone-800'
                      }`}
                    >
                      <option value="New" className="bg-stone-900 text-stone-200">New</option>
                      <option value="Contacted" className="bg-stone-900 text-stone-200">Contacted</option>
                      <option value="Qualified" className="bg-stone-900 text-stone-200">Qualified</option>
                      <option value="Site Visit" className="bg-stone-900 text-stone-200">Site Visit</option>
                      <option value="Follow Up" className="bg-stone-900 text-stone-200">Follow Up</option>
                      <option value="Booked" className="bg-stone-900 text-stone-200">Booked</option>
                      <option value="Closed" className="bg-stone-900 text-stone-200">Closed</option>
                      <option value="Lost" className="bg-stone-900 text-stone-200">Lost</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo Bapak/Ibu ${lead.name}, saya representatif dari PT ZIA Properti Indonesia menindaklanjuti pesan Anda mengenai ${lead.projectName}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1"
                        title="Chat WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        Chat
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLead(lead);
                          setNoteText(lead.notes || '');
                        }}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-400 font-semibold flex items-center gap-1"
                        title="Tambah Catatan"
                      >
                        <Edit2 className="w-3 h-3" />
                        Catatan
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingLead(lead)}
                        className="p-1 bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400 border border-stone-800 hover:border-red-800"
                        title="Hapus Lead"
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

      {/* Edit Notes Modal */}
      {editingLead && (
        <CMSModal
          isOpen={true}
          onClose={() => setEditingLead(null)}
          title={`Catatan Konsumen: ${editingLead.name}`}
          subtitle={`Proyek: ${editingLead.projectName} • WhatsApp: ${editingLead.phone}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-stone-400 uppercase tracking-wider block mb-1">
                Pesan Awal Konsumen:
              </span>
              <div className="p-3 bg-stone-950 border border-stone-800 text-stone-300 italic">
                "{editingLead.message || 'Tidak ada pesan khusus.'}"
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Catatan Tindak Lanjut Sales
              </label>
              <textarea
                rows={4}
                placeholder="Misal: Sudah telepon jam 10.00, konsumen berniat survei ZIA Emerald hari Sabtu depan bersama pasangan..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="px-4 py-2 border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onUpdateLeadStatus(editingLead.id, editingLead.status, noteText);
                  setEditingLead(null);
                  showToast('Catatan sales berhasil diperbarui.');
                }}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </CMSModal>
      )}

      {/* Delete Confirmation */}
      <CMSConfirmDialog
        isOpen={Boolean(deletingLead)}
        title="Konfirmasi Hapus Data Prospek"
        message={`Apakah Anda yakin ingin menghapus data kontak "${deletingLead?.name}"?`}
        confirmLabel="Hapus Data"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLead(null)}
      />
    </div>
  );
};

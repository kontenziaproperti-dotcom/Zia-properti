import React, { useState, useEffect } from 'react';
import {
  Calendar,
  FileText,
  Table,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Share2,
  CalendarCheck,
  Check
} from 'lucide-react';
import { CMSModuleHeader, CMSConfirmDialog, CMSEmptyState } from '../CMSUI';
import { LeadItem, PropertyItem, KavlingPlot, ProjectEntity } from '../../../types';
import {
  getAccessToken,
  signInWithWorkspaceScopes,
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  createGoogleDoc,
  exportLeadsToGoogleSheet,
  exportInventoryToGoogleSheet,
  CalendarEventItem,
  GeneratedDocResult,
  GeneratedSheetResult
} from '../../../services/workspaceService';
import { auth } from '../../../lib/firebase';

interface GoogleWorkspaceModuleProps {
  leads: LeadItem[];
  properties: PropertyItem[];
  plots: KavlingPlot[];
  projects: ProjectEntity[];
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const GoogleWorkspaceModule: React.FC<GoogleWorkspaceModuleProps> = ({
  leads,
  properties,
  plots,
  projects,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'docs' | 'sheets'>('calendar');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Calendar States
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    summary: 'Survey Lokasi ZIA Emerald - Konsumen Baru',
    description: 'Kunjungan dan peninjauan unit American Classic tipe 50/72 di Tarumajaya, didampingi sales representatif.',
    location: 'ZIA Emerald Residence, Tarumajaya, Bekasi',
    startDateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 90000000).toISOString().slice(0, 16)
  });

  // Docs States
  const [docTemplate, setDocTemplate] = useState<'spk' | 'ppjb' | 'altara' | 'farm' | 'custom'>('spk');
  const [docClientName, setDocClientName] = useState('Budi Santoso');
  const [docClientPhone, setDocClientPhone] = useState('081288889911');
  const [docProject, setDocProject] = useState('ZIA Emerald');
  const [docUnitCode, setDocUnitCode] = useState('Blok A1 - No. 05');
  const [docPrice, setDocPrice] = useState('Rp 685.000.000');
  const [docNotes, setDocNotes] = useState('Pembayaran DP 10%, tenor KPR 15 tahun');
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [recentDocs, setRecentDocs] = useState<GeneratedDocResult[]>([]);

  // Sheets States
  const [exportingLeads, setExportingLeads] = useState(false);
  const [exportingInventory, setExportingInventory] = useState(false);
  const [recentSheets, setRecentSheets] = useState<GeneratedSheetResult[]>([]);

  // Check auth on load
  useEffect(() => {
    const checkToken = async () => {
      const token = await getAccessToken();
      const currentGoogleUser = auth.currentUser;
      if (token && currentGoogleUser) {
        setIsAuthenticated(true);
        setUserEmail(currentGoogleUser.email);
        loadEvents();
      } else {
        setIsAuthenticated(false);
        setUserEmail(currentGoogleUser?.email || null);
      }
    };
    checkToken();
  }, []);

  const handleGoogleConnect = async () => {
    setLoadingAuth(true);
    try {
      const res = await signInWithWorkspaceScopes();
      setIsAuthenticated(true);
      setUserEmail(res.user.email);
      showToast(`Terhubung dengan Google Workspace: ${res.user.email}`, 'success');
      loadEvents();
    } catch (err: any) {
      console.error('Google Workspace connect error:', err);
      showToast(err.message || 'Gagal menghubungkan Google Workspace.', 'error');
    } finally {
      setLoadingAuth(false);
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const items = await fetchCalendarEvents();
      setEvents(items);
    } catch (err: any) {
      console.warn('Load calendar events notice:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.summary || !newEvent.startDateTime) {
      showToast('Mohon isi judul dan waktu kegiatan.', 'error');
      return;
    }
    setLoadingEvents(true);
    try {
      const created = await createCalendarEvent(newEvent);
      setEvents((prev) => [created, ...prev]);
      setShowEventModal(false);
      showToast('Jadwal berhasil ditambahkan ke Google Calendar!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menambahkan event.', 'error');
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEventId) return;
    try {
      await deleteCalendarEvent(deletingEventId);
      setEvents((prev) => prev.filter((ev) => ev.id !== deletingEventId));
      showToast('Jadwal Google Calendar berhasil dihapus.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus event.', 'error');
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleGenerateDoc = async () => {
    setGeneratingDoc(true);
    try {
      let title = '';
      let content = '';

      if (docTemplate === 'spk') {
        title = `SPK Kavling - ${docClientName} - ${docUnitCode}`;
        content = `SURAT PESANAN KAVLING (SPK)\nPT ZIA PROPERTI INDONESIA\nNomor: SPK/ZIA/${Date.now().toString().slice(-6)}\n\n` +
          `Pada hari ini, tanggal ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}, telah disepakati pemesanan unit kavling/hunian:\n\n` +
          `I. DATA KONSUMEN / PEMESAN:\n` +
          `- Nama Lengkap   : ${docClientName}\n` +
          `- No. WhatsApp   : ${docClientPhone}\n\n` +
          `II. OBJEK PEMESANAN:\n` +
          `- Proyek         : ${docProject}\n` +
          `- Kode Unit/Blok : ${docUnitCode}\n` +
          `- Nilai Transaksi: ${docPrice}\n` +
          `- Ketentuan Lain : ${docNotes}\n\n` +
          `III. KETENTUAN POKOK:\n` +
          `1. Dokumen ini merupakan bukti kesepakatan pemesanan resmi unit PT ZIA Properti Indonesia.\n` +
          `2. Konsumen berkewajiban melengkapi berkas administrasi dan kelayakan legalitas dalam tempo 14 hari kerja.\n` +
          `3. Hak penguasaan fisik tanah diserahterimakan setelah penyelesaian akad PPJB notariil.\n\n` +
          `Tertanda,\n\n( ${docClientName} )           ( Direksi PT ZIA Properti Indonesia )`;
      } else if (docTemplate === 'ppjb') {
        title = `Draft PPJB - ZIA Emerald - ${docClientName}`;
        content = `DRAFT PERJANJIAN PENGIKATAN JUAL BELI (PPJB)\nKawasan Residensial ZIA Emerald Tarumajaya\n\n` +
          `PIHAK PERTAMA: PT ZIA Properti Indonesia\nPIHAK KEDUA  : ${docClientName} (No. Kontak: ${docClientPhone})\n\n` +
          `Kedua belah pihak telah sepakat mengikatkan diri dalam Perjanjian Pengikatan Jual Beli unit properti:\n` +
          `- Unit / Kavling : ${docUnitCode}\n` +
          `- Harga Total    : ${docPrice}\n` +
          `- Skema Finansial: ${docNotes}\n\n` +
          `Spesifikasi bangunan mengacu pada standar American Classic PT ZIA Properti Indonesia.\n` +
          `Dokumen ini disiapkan untuk proses legalisasi di hadapan Pejabat Pembuat Akta Tanah (PPAT) / Notaris rekanan resmi.`;
      } else if (docTemplate === 'altara') {
        title = `Technical Specification & Quality Sheet - ALTARA Vanilla - ${docClientName}`;
        content = `ALTARA ZIA INTERNATIONAL\nPREMIUM INDONESIAN VANILLA BEAN SPECIFICATION\n\n` +
          `Target Buyer / Partner: ${docClientName}\n` +
          `Issued Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n\n` +
          `PRODUCT SPECIFICATIONS:\n` +
          `- Origin           : Planifolia / Tahitensis Indonesia\n` +
          `- Grade            : Gourmet Black Prime Export Quality\n` +
          `- Moisture Content : 28% - 33%\n` +
          `- Vanillin Content : 1.8% - 2.4%\n` +
          `- Average Length   : 16cm - 20cm+\n` +
          `- Aroma Profile    : Rich, Sweet, Woody, Creamy Floral\n` +
          `- Traceability     : Direct Single-Origin Farm to Vacuum Export Packing\n\n` +
          `Commercial Terms: ${docNotes}\n\n` +
          `Authorized by:\nAltara ZIA International Export Desk`;
      } else {
        title = `Surat Kesepakatan & Dokumen Operasional ZIA - ${docClientName}`;
        content = `DOKUMEN RESMI PT ZIA PROPERTI INDONESIA\nJudul: ${docProject} - ${docUnitCode}\nNama Klien: ${docClientName} (${docClientPhone})\n\nCatatan & Butir Kesepakatan:\n${docNotes}`;
      }

      const docResult = await createGoogleDoc(title, content);
      setRecentDocs((prev) => [docResult, ...prev]);
      showToast(`Dokumen "${docResult.title}" berhasil dibuat di Google Docs!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat Google Doc.', 'error');
    } finally {
      setGeneratingDoc(false);
    }
  };

  const handleExportLeads = async () => {
    setExportingLeads(true);
    try {
      const sheetResult = await exportLeadsToGoogleSheet(leads);
      setRecentSheets((prev) => [sheetResult, ...prev]);
      showToast(`Berhasil mengekspor ${sheetResult.rowsExported} data prospek ke Google Sheets!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengekspor data leads ke Google Sheets.', 'error');
    } finally {
      setExportingLeads(false);
    }
  };

  const handleExportInventory = async () => {
    setExportingInventory(true);
    try {
      const sheetResult = await exportInventoryToGoogleSheet(properties, plots);
      setRecentSheets((prev) => [sheetResult, ...prev]);
      showToast(`Berhasil mengekspor ${sheetResult.rowsExported} unit & kavling ke Google Sheets!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal mengekspor data inventaris ke Google Sheets.', 'error');
    } finally {
      setExportingInventory(false);
    }
  };

  return (
    <div className="space-y-6">
      <CMSModuleHeader
        title="Google Workspace Business Suite"
        description="Kelola integrasi resmi Google Calendar (jadwal survei), Google Docs (kontrak & SPK), dan Google Sheets (sinkronisasi data real-time)."
        badge="Integrasi Terpadu"
      />

      {/* Google Account Connection Status Card */}
      <div className="p-5 bg-stone-900 border border-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Share2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Google Workspace Connectivity</span>
              {isAuthenticated ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <Check className="w-3 h-3" /> Terhubung
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800">
                  Perlu Autentikasi
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {isAuthenticated
                ? `Akun aktif: ${userEmail} — Izin: Calendar, Docs, Sheets, Drive`
                : 'Hubungkan akun Google staf/manajemen untuk mengaktifkan sinkronisasi otomatis.'}
            </p>
          </div>
        </div>

        <div>
          {!isAuthenticated ? (
            <button
              onClick={handleGoogleConnect}
              disabled={loadingAuth}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{loadingAuth ? 'Menghubungkan...' : 'Sign in with Google'}</span>
            </button>
          ) : (
            <button
              onClick={handleGoogleConnect}
              className="text-xs text-stone-400 hover:text-white underline font-semibold"
            >
              Ubah / Re-auth Akun
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-stone-200 gap-2">
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
            activeSubTab === 'calendar'
              ? 'border-emerald-800 text-emerald-900 bg-white'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Google Calendar ({events.length} Jadwal)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('docs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
            activeSubTab === 'docs'
              ? 'border-emerald-800 text-emerald-900 bg-white'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Google Docs (Generator SPK & Kontrak)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
            activeSubTab === 'sheets'
              ? 'border-emerald-800 text-emerald-900 bg-white'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Google Sheets (Export Leads & Inventaris)</span>
        </button>
      </div>

      {/* SUBTAB 1: GOOGLE CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Jadwal Kunjungan Lapangan & Agenda Penjualan
              </h3>
              <p className="text-xs text-stone-500">
                Sinkronisasi otomatis dengan Google Calendar resmi sales dan manajemen PT ZIA Properti Indonesia.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadEvents}
                disabled={loadingEvents}
                className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
                title="Muat Ulang Kalender"
              >
                <RefreshCw className={`w-4 h-4 ${loadingEvents ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Jadwal Survey</span>
              </button>
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Google Calendar</span>
              </a>
            </div>
          </div>

          {events.length === 0 ? (
            <CMSEmptyState
              title="Belum Ada Jadwal Kalender Terdaftar"
              description="Buat jadwal janji temu survei konsumen, tanda tangan notaris, atau rapat koordinasi ekspor untuk disinkronkan langsung ke Google Calendar."
              actionLabel="Tambah Jadwal Baru"
              onAction={() => setShowEventModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white border border-stone-200 p-4 flex flex-col justify-between hover:border-stone-400 transition-all shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-stone-900 line-clamp-2">
                        {ev.summary}
                      </span>
                      <button
                        onClick={() => setDeletingEventId(ev.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-[11px] text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <span>
                          {ev.start.dateTime
                            ? new Date(ev.start.dateTime).toLocaleString('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })
                            : ev.start.date || '-'}
                        </span>
                      </div>

                      {ev.location && (
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{ev.location}</span>
                        </div>
                      )}
                    </div>

                    {ev.description && (
                      <p className="text-[11px] text-stone-500 bg-stone-50 p-2 border border-stone-100 line-clamp-3">
                        {ev.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5" /> Google Calendar
                    </span>
                    {ev.htmlLink && (
                      <a
                        href={ev.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-500 hover:text-stone-900 inline-flex items-center gap-0.5"
                      >
                        <span>Lihat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: GOOGLE DOCS */}
      {activeSubTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Generator */}
          <div className="lg:col-span-7 bg-white border border-stone-200 p-5 space-y-4 shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-1">
                Generator Dokumen Legal & Surat Perjanjian
              </span>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Buat Berkas Resmi ke Google Docs
              </h3>
              <p className="text-xs text-stone-500">
                Pilih format surat untuk menghasilkan naskah kontrak rapi yang langsung disimpan ke Google Docs Anda.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Format / Template Dokumen
                </label>
                <select
                  value={docTemplate}
                  onChange={(e) => setDocTemplate(e.target.value as any)}
                  className="w-full p-2 border border-stone-200 bg-stone-50 text-xs font-semibold focus:outline-none focus:border-stone-900"
                >
                  <option value="spk">Surat Pesanan Kavling (SPK) ZIA Properti</option>
                  <option value="ppjb">Draft Perjanjian Pengikatan Jual Beli (PPJB) ZIA Emerald</option>
                  <option value="altara">Specification Sheet & Quality Certificate ALTARA Vanilla</option>
                  <option value="farm">Berita Acara & Catatan Medis Qurban ZIA Farm</option>
                  <option value="custom">Format Kustom Dokumen Kerja Sama</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Nama Konsumen / Klien
                  </label>
                  <input
                    type="text"
                    value={docClientName}
                    onChange={(e) => setDocClientName(e.target.value)}
                    className="w-full p-2 border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="Contoh: Ir. Hendra Gunawan"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Nomor WhatsApp / Kontak
                  </label>
                  <input
                    type="text"
                    value={docClientPhone}
                    onChange={(e) => setDocClientPhone(e.target.value)}
                    className="w-full p-2 border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="081288889911"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Unit Usaha / Proyek
                  </label>
                  <select
                    value={docProject}
                    onChange={(e) => setDocProject(e.target.value)}
                    className="w-full p-2 border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
                  >
                    <option value="ZIA Emerald">ZIA Emerald (Residensial)</option>
                    <option value="Kavling Hills">Kavling Hills (Lahan)</option>
                    <option value="ZIA Farm">ZIA Farm (Peternakan)</option>
                    <option value="Altara ZIA">Altara ZIA (Vanilla Beans)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Kode Unit / Blok
                  </label>
                  <input
                    type="text"
                    value={docUnitCode}
                    onChange={(e) => setDocUnitCode(e.target.value)}
                    className="w-full p-2 border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="Blok B2 - No. 08"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Nilai / Harga Transaksi
                  </label>
                  <input
                    type="text"
                    value={docPrice}
                    onChange={(e) => setDocPrice(e.target.value)}
                    className="w-full p-2 border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="Rp 685.000.000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Catatan Tambahan & Ketentuan Finansial
                </label>
                <textarea
                  rows={3}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  className="w-full p-2 border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
                  placeholder="Skema pembayaran, nomor rekening, catatan sertifikat atau klausul khusus..."
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerateDoc}
                  disabled={generatingDoc || !docClientName}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>{generatingDoc ? 'Membuat Google Doc...' : 'Generate & Simpan ke Google Docs'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* History of Generated Docs */}
          <div className="lg:col-span-5 bg-stone-50 border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Berkas Google Docs Tergenerate
              </span>
              <a
                href="https://docs.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-800 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Google Docs Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {recentDocs.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-stone-300 text-stone-500 text-xs">
                <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p>Belum ada dokumen yang dibuat pada sesi ini.</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Isi formulir di sebelah kiri untuk menghasilkan berkas resmi.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
                {recentDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-stone-200 flex items-start justify-between gap-3 shadow-sm hover:border-stone-400 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-900 block leading-snug">
                        {doc.title}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        ID: {doc.documentId.slice(0, 16)}...
                      </span>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors shrink-0"
                    >
                      <span>Buka Dokumen</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: GOOGLE SHEETS */}
      {activeSubTab === 'sheets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Leads Card */}
            <div className="bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Sinkronisasi Leads & Prospek
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Tersedia {leads.length} data calon konsumen siap diekspor.
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menghasilkan spreadsheet baru dengan tabel terstruktur berisi nama konsumen, nomor WhatsApp, email, proyek yang diminati, budget, status tindak lanjut, dan pesan konsultasi.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium">Format: Google Sheets v4</span>
                <button
                  onClick={handleExportLeads}
                  disabled={exportingLeads || leads.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportingLeads ? 'Mengekspor...' : 'Export Leads ke Google Sheets'}</span>
                </button>
              </div>
            </div>

            {/* Export Inventory Card */}
            <div className="bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Export Inventaris Unit & Kavling
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Tersedia {properties.length} tipe hunian + {plots.length} kavling tanah.
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menghasilkan database spreadsheet inventaris lengkap yang memuat rincian tipe rumah ZIA Emerald, kavling Kav Hillside, luas tanah/bangunan, status ketersediaan, dan harga jual terkini.
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-medium">Format: Google Sheets v4</span>
                <button
                  onClick={handleExportInventory}
                  disabled={exportingInventory}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportingInventory ? 'Mengekspor...' : 'Export Inventaris ke Google Sheets'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* History of Exported Sheets */}
          <div className="bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-stone-900 font-serif">
                  Daftar Google Sheets Tergenerate
                </h4>
                <p className="text-xs text-stone-500">
                  Spreadsheet yang telah dibuat selama sesi operasional dapat langsung diakses melalui tautan berikut.
                </p>
              </div>
              <a
                href="https://sheets.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Buka Google Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {recentSheets.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-stone-200 text-stone-400 text-xs">
                Klik tombol "Export" di atas untuk menyinkronkan data leads atau inventaris ke Google Sheets.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200">
                {recentSheets.map((sheet, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{sheet.title}</span>
                        <span className="text-[10px] text-stone-500">
                          {sheet.rowsExported} baris data tersinkronisasi
                        </span>
                      </div>
                    </div>
                    <a
                      href={sheet.spreadsheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 text-xs font-bold text-stone-800 hover:border-stone-400 transition-colors"
                    >
                      <span>Buka Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD CALENDAR EVENT */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Google Calendar Scheduler
              </span>
              <h3 className="text-lg font-bold font-serif text-stone-900">
                Tambah Agenda / Janji Temu Konsumen
              </h3>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Nama Kegiatan / Ringkasan Agenda
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                  className="w-full p-2 border border-stone-200 focus:outline-none focus:border-stone-900"
                  placeholder="Contoh: Survey Lapangan Kavling Hills - Bpk. Irwan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.startDateTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startDateTime: e.target.value })}
                    className="w-full p-2 border border-stone-200 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.endDateTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endDateTime: e.target.value })}
                    className="w-full p-2 border border-stone-200 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Lokasi Pertemuan / Proyek
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full p-2 border border-stone-200 focus:outline-none focus:border-stone-900"
                  placeholder="Contoh: Marketing Gallery ZIA Emerald, Tarumajaya"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Deskripsi & Catatan Kunjungan
                </label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-2 border border-stone-200 focus:outline-none focus:border-stone-900"
                  placeholder="Tujuan survei, nomor kontak perwakilan, preferensi unit..."
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingEvents}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {loadingEvents ? 'Menyimpan...' : 'Simpan ke Google Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DESTRUCTION DIALOG FOR WORKSPACE */}
      <CMSConfirmDialog
        isOpen={!!deletingEventId}
        title="Hapus Agenda dari Google Calendar?"
        message="Tindakan ini akan menghapus kegiatan dari Google Calendar secara permanen. Apakah Anda yakin ingin melanjutkan?"
        confirmLabel="Hapus Agenda"
        isDestructive={true}
        onConfirm={handleDeleteEvent}
        onCancel={() => setDeletingEventId(null)}
      />
    </div>
  );
};

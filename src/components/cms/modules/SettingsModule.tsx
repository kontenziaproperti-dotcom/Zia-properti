import React, { useState, useEffect } from 'react';
import {
  Building2,
  Phone,
  MessageSquare,
  Share2,
  Save,
  MapPin,
  Clock,
  Mail,
  CheckCircle2,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { CompanySettings } from '../../../types';
import { CMSModuleHeader } from '../CMSUI';
import {
  cleanWhatsAppNumber,
  formatIndonesianPhone,
  buildWhatsAppUrl,
  validatePhoneNumber
} from '../../../lib/contactUtils';

interface SettingsModuleProps {
  settings: CompanySettings;
  defaultSubTab?: 'company' | 'whatsapp' | 'social';
  onSaveSettings: (settings: Partial<CompanySettings>) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  settings,
  defaultSubTab = 'company',
  onSaveSettings,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'whatsapp' | 'social'>(defaultSubTab);
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(settings.updatedAt || null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Synchronize formData whenever settings prop changes (e.g. after refresh or initial fetch)
  useEffect(() => {
    setFormData(settings);
    if (settings.updatedAt) {
      setLastSaved(settings.updatedAt);
    }
  }, [settings]);

  // Handle active subtab switch
  useEffect(() => {
    if (defaultSubTab) {
      setActiveTab(defaultSubTab);
    }
  }, [defaultSubTab]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate phone
    if (formData.phone) {
      const v = validatePhoneNumber(formData.phone, 'phone');
      if (!v.valid && v.error) errors.phone = v.error;
    }

    // Validate WhatsApp numbers
    const waFields: (keyof CompanySettings)[] = [
      'contactWhatsApp',
      'corporateWhatsApp',
      'emeraldWhatsApp',
      'kavWhatsApp',
      'farmWhatsApp',
      'altaraWhatsApp'
    ];

    waFields.forEach((key) => {
      const val = formData[key];
      if (val && typeof val === 'string') {
        const v = validatePhoneNumber(val, 'whatsapp');
        if (!v.valid && v.error) {
          errors[key] = v.error;
        }
      }
    });

    // Validate email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format alamat email tidak valid.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Mohon perbaiki format nomor atau data yang tidak valid.', 'error');
      return;
    }

    setSaving(true);
    try {
      // Clean and sanitize numbers prior to persistent saving
      const payload: Partial<CompanySettings> = {
        ...formData,
        contactWhatsApp: cleanWhatsAppNumber(formData.contactWhatsApp || formData.corporateWhatsApp),
        corporateWhatsApp: cleanWhatsAppNumber(formData.corporateWhatsApp || formData.contactWhatsApp),
        emeraldWhatsApp: cleanWhatsAppNumber(formData.emeraldWhatsApp, '6281288889922'),
        kavWhatsApp: cleanWhatsAppNumber(formData.kavWhatsApp, '6281288889933'),
        farmWhatsApp: cleanWhatsAppNumber(formData.farmWhatsApp, '6281288889944'),
        altaraWhatsApp: cleanWhatsAppNumber(formData.altaraWhatsApp, '6281288889955')
      };

      await onSaveSettings(payload);
      const now = new Date().toISOString();
      setLastSaved(now);
      showToast('Pengaturan perusahaan dan kanal kontak berhasil disimpan ke database!');
    } catch (err: any) {
      console.error('Save settings error:', err);
      showToast(err.message || 'Gagal menyimpan pengaturan ke database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(settings);
    setValidationErrors({});
    showToast('Formulir dikembalikan ke data terakhir tersimpan.');
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Sub Tabs */}
      <div className="flex border-b border-stone-800 pb-0 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`px-6 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'company'
              ? 'border-amber-400 text-amber-300 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Profil & Telepon Perusahaan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`px-6 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'whatsapp'
              ? 'border-amber-400 text-amber-300 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          Kanal Kontak & WhatsApp Resmi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-6 py-3 text-xs uppercase tracking-widest font-bold border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'social'
              ? 'border-amber-400 text-amber-300 bg-stone-900/60'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Tautan Media Sosial
        </button>
      </div>

      {/* Module Header */}
      <CMSModuleHeader
        title={
          activeTab === 'company'
            ? 'Identitas & Informasi Telepon Perusahaan'
            : activeTab === 'whatsapp'
            ? 'Pengelolaan Terpusat Kanal WhatsApp Resmi'
            : 'Akun Media Sosial & Saluran Komunikasi'
        }
        description={
          activeTab === 'company'
            ? 'Kelola data hukum, alamat kantor pusat, jam layanan operasional, serta nomor telepon resmi PT ZIA Properti Indonesia.'
            : activeTab === 'whatsapp'
            ? 'Atur nomor hotline WhatsApp resmi untuk masing-masing unit usaha dan proyek. Seluruh tombol, widget mengambang, dan footer website akan otomatis menggunakan nomor ini.'
            : 'Kelola tautan akun resmi Instagram, YouTube, dan LinkedIn yang tampil pada footer website publik.'
        }
      />

      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-stone-900 border border-stone-800 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Penyimpanan Aktif:{' '}
            <strong className="text-white">Cloud Firestore & Sinkronisasi Real-Time</strong>
          </span>
        </div>
        {lastSaved && (
          <div className="flex items-center gap-1.5 text-stone-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Pembaruan Terakhir:{' '}
              <span className="text-stone-200 font-mono">
                {new Date(lastSaved).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}{' '}
                WIB
              </span>
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-5xl text-xs">
        {/* ============================================================ */}
        {/* TAB 1: COMPANY PROFILE & PHONE */}
        {/* ============================================================ */}
        {activeTab === 'company' && (
          <div className="p-6 bg-stone-950 border border-stone-800 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Nama Badan Hukum Perusahaan <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                  Slogan / Tagline Korporat
                </label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Alamat Lengkap Kantor Pusat <span className="text-amber-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.fullAddress || ''}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white resize-none focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Telepon Perusahaan */}
              <div className="p-3.5 bg-stone-900 border border-stone-800 space-y-2">
                <label className="text-stone-300 uppercase tracking-wider block font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Phone className="w-3.5 h-3.5" />
                    Telepon Utama Kantor
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="+62 21 8899 7654"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <div className="text-[11px] text-stone-400">
                  <span>Pratinjau tampilan: </span>
                  <span className="text-amber-300 font-mono font-medium">
                    {formatIndonesianPhone(formData.phone)}
                  </span>
                </div>
                {validationErrors.phone && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.phone}
                  </p>
                )}
                <span className="text-[10px] text-stone-500 block">
                  Tampil pada halaman Hubungi Kami, footer, beranda, serta schema SEO.
                </span>
              </div>

              {/* Email Perusahaan */}
              <div className="p-3.5 bg-stone-900 border border-stone-800 space-y-2">
                <label className="text-stone-300 uppercase tracking-wider block font-bold flex items-center gap-1.5 text-amber-400">
                  <Mail className="w-3.5 h-3.5" />
                  Alamat Email Resmi
                </label>
                <input
                  type="email"
                  placeholder="corporate@ziaproperti.co.id"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.email}
                  </p>
                )}
                <span className="text-[10px] text-stone-500 block">
                  Email tujuan konsultasi dan tautan mailto publik.
                </span>
              </div>

              {/* Jam Operasional */}
              <div className="p-3.5 bg-stone-900 border border-stone-800 space-y-2">
                <label className="text-stone-300 uppercase tracking-wider block font-bold flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  Jam Operasional Kantor
                </label>
                <input
                  type="text"
                  placeholder="Senin - Sabtu: 08:30 - 17:00 WIB"
                  value={formData.officeHours || ''}
                  onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2 text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-stone-500 block">
                  Tampil di halaman Hubungi Kami dan informasi layanan konsumen.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: WHATSAPP CHANNELS (PER UNIT & CORPORATE) */}
        {/* ============================================================ */}
        {activeTab === 'whatsapp' && (
          <div className="p-6 bg-stone-950 border border-stone-800 space-y-6">
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Nomor dapat dimasukkan dalam format <strong>0812...</strong>,{' '}
                  <strong>62812...</strong>, atau <strong>+62 812...</strong>. Sistem akan
                  otomatis membersihkan dan menghasilkan tautan internasional yang valid.
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. WhatsApp Utama Korporat */}
              <div className="p-4 bg-stone-900 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    1. WhatsApp Utama Perusahaan / Hotline Korporat
                  </span>
                  <span className="text-[9px] uppercase tracking-wider bg-emerald-900/60 text-emerald-300 px-2 py-0.5 border border-emerald-800">
                    Utama
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="081288889911 atau 6281288889911"
                  value={formData.contactWhatsApp || formData.corporateWhatsApp || ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setFormData({
                      ...formData,
                      contactWhatsApp: raw,
                      corporateWhatsApp: raw
                    });
                  }}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                {validationErrors.contactWhatsApp && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.contactWhatsApp}
                  </p>
                )}
                <div className="space-y-1 text-[11px] text-stone-400 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Format Internasional:</span>
                    <span className="font-mono text-emerald-300 font-semibold">
                      {cleanWhatsAppNumber(formData.contactWhatsApp || formData.corporateWhatsApp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tampilan Nomor:</span>
                    <span className="font-mono text-stone-300">
                      {formatIndonesianPhone(formData.contactWhatsApp || formData.corporateWhatsApp)}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <span className="text-[10px] text-stone-500">
                    Digunakan pada Header Korporat & Floating Button umum.
                  </span>
                  <a
                    href={buildWhatsAppUrl(
                      formData.contactWhatsApp || formData.corporateWhatsApp,
                      'Halo Tim PT ZIA Properti Indonesia, saya ingin berkonsultasi.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <span>Uji Buka WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 2. ZIA Emerald */}
              <div className="p-4 bg-stone-900 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    2. WhatsApp Sales ZIA Emerald (Residensial)
                  </span>
                  <span className="text-[9px] uppercase tracking-wider bg-emerald-950 text-emerald-400 px-2 py-0.5 border border-emerald-800">
                    Tarumajaya
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="081288889922 atau 6281288889922"
                  value={formData.emeraldWhatsApp || ''}
                  onChange={(e) => setFormData({ ...formData, emeraldWhatsApp: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                {validationErrors.emeraldWhatsApp && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.emeraldWhatsApp}
                  </p>
                )}
                <div className="space-y-1 text-[11px] text-stone-400 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Format Internasional:</span>
                    <span className="font-mono text-emerald-300 font-semibold">
                      {cleanWhatsAppNumber(formData.emeraldWhatsApp, '6281288889922')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tampilan Nomor:</span>
                    <span className="font-mono text-stone-300">
                      {formatIndonesianPhone(formData.emeraldWhatsApp || '6281288889922')}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <span className="text-[10px] text-stone-500">
                    Digunakan pada Landing Page ZIA Emerald & Footer Residensial.
                  </span>
                  <a
                    href={buildWhatsAppUrl(
                      formData.emeraldWhatsApp,
                      'Halo Tim Sales ZIA Emerald, saya ingin informasi mengenai hunian American Classic.',
                      '6281288889922'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <span>Uji Buka WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 3. Kav Hillside */}
              <div className="p-4 bg-stone-900 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    3. WhatsApp Sales Kav Hillside (Kavling Tanah)
                  </span>
                  <span className="text-[9px] uppercase tracking-wider bg-stone-800 text-stone-300 px-2 py-0.5 border border-stone-700">
                    Kavling
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="081288889933 atau 6281288889933"
                  value={formData.kavWhatsApp || ''}
                  onChange={(e) => setFormData({ ...formData, kavWhatsApp: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                {validationErrors.kavWhatsApp && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.kavWhatsApp}
                  </p>
                )}
                <div className="space-y-1 text-[11px] text-stone-400 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Format Internasional:</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {cleanWhatsAppNumber(formData.kavWhatsApp, '6281288889933')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tampilan Nomor:</span>
                    <span className="font-mono text-stone-300">
                      {formatIndonesianPhone(formData.kavWhatsApp || '6281288889933')}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <span className="text-[10px] text-stone-500">
                    Digunakan pada Landing Page Kav Hillside & Footer Kavling.
                  </span>
                  <a
                    href={buildWhatsAppUrl(
                      formData.kavWhatsApp,
                      'Halo Tim Kav Hillside, saya ingin informasi mengenai kavling siap bangun.',
                      '6281288889933'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>Uji Buka WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 4. ZIA Farm */}
              <div className="p-4 bg-stone-900 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    4. WhatsApp Layanan ZIA Farm (Peternakan & Qurban)
                  </span>
                  <span className="text-[9px] uppercase tracking-wider bg-amber-950 text-amber-400 px-2 py-0.5 border border-amber-800">
                    Peternakan
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="081288889944 atau 6281288889944"
                  value={formData.farmWhatsApp || ''}
                  onChange={(e) => setFormData({ ...formData, farmWhatsApp: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                {validationErrors.farmWhatsApp && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.farmWhatsApp}
                  </p>
                )}
                <div className="space-y-1 text-[11px] text-stone-400 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Format Internasional:</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {cleanWhatsAppNumber(formData.farmWhatsApp, '6281288889944')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tampilan Nomor:</span>
                    <span className="font-mono text-stone-300">
                      {formatIndonesianPhone(formData.farmWhatsApp || '6281288889944')}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <span className="text-[10px] text-stone-500">
                    Digunakan pada Landing Page ZIA Farm, pemesanan qurban & footer.
                  </span>
                  <a
                    href={buildWhatsAppUrl(
                      formData.farmWhatsApp,
                      'Halo Tim ZIA Farm, saya ingin informasi pemesanan hewan ternak qurban.',
                      '6281288889944'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>Uji Buka WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 5. Altara ZIA International */}
              <div className="p-4 bg-stone-900 border border-stone-800 space-y-2.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    5. WhatsApp ALTARA ZIA International (Vanilla Export Desk B2B)
                  </span>
                  <span className="text-[9px] uppercase tracking-wider bg-amber-950 text-amber-200 px-2 py-0.5 border border-amber-800">
                    Global Export
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="081288889955 atau 6281288889955"
                  value={formData.altaraWhatsApp || ''}
                  onChange={(e) => setFormData({ ...formData, altaraWhatsApp: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                {validationErrors.altaraWhatsApp && (
                  <p className="text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.altaraWhatsApp}
                  </p>
                )}
                <div className="space-y-1 text-[11px] text-stone-400 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Format Internasional:</span>
                    <span className="font-mono text-amber-300 font-semibold">
                      {cleanWhatsAppNumber(formData.altaraWhatsApp, '6281288889955')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tampilan Nomor:</span>
                    <span className="font-mono text-stone-300">
                      {formatIndonesianPhone(formData.altaraWhatsApp || '6281288889955')}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-stone-800">
                  <span className="text-[10px] text-stone-500">
                    Digunakan pada Landing Page Altara ZIA International & Export desk inquiry.
                  </span>
                  <a
                    href={buildWhatsAppUrl(
                      formData.altaraWhatsApp,
                      'Hello Altara ZIA International, I would like to inquire about premium Indonesian vanilla beans export.',
                      '6281288889955'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 font-semibold"
                  >
                    <span>Uji Buka WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SOCIAL MEDIA */}
        {/* ============================================================ */}
        {activeTab === 'social' && (
          <div className="p-6 bg-stone-950 border border-stone-800 space-y-4">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                URL Profil Instagram Resmi
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/ziaproperti"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                URL Halaman LinkedIn Resmi
              </label>
              <input
                type="text"
                placeholder="https://linkedin.com/company/zia-properti-indonesia"
                value={formData.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                URL Channel YouTube Resmi
              </label>
              <input
                type="text"
                placeholder="https://youtube.com/@ziaproperti"
                value={formData.youtube || ''}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors border border-stone-800 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Batal & Pulihkan Data Terakhir
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan ke Database...' : 'Simpan Nomor & Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
};

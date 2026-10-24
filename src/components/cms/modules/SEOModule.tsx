import React, { useState } from 'react';
import {
  Globe,
  Save,
  Search,
  CheckCircle2,
  Share2,
  Code2,
  Sparkles
} from 'lucide-react';
import { CompanySettings } from '../../../types';
import { CMSModuleHeader } from '../CMSUI';

interface SEOModuleProps {
  settings: CompanySettings;
  onSaveSettings: (settings: Partial<CompanySettings>) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SEOModule: React.FC<SEOModuleProps> = ({
  settings,
  onSaveSettings,
  showToast
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveSettings(formData);
      showToast('Konfigurasi SEO dan metadata berhasil diperbarui.');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan SEO.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <CMSModuleHeader
        title="Optimasi Mesin Pencari & Sosial Media (SEO)"
        description="Atur meta title, meta deskripsi, gambar preview share WhatsApp/Facebook (OpenGraph), Google Analytics 4, dan Schema.org Structured Data."
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl text-xs">
        {/* Google Search Snippet Preview */}
        <div className="p-6 bg-stone-950 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-semibold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            Pratinjau Tampilan di Google Search
          </div>

          <div className="p-4 bg-white rounded-md max-w-2xl text-stone-900 space-y-1 shadow-sm font-sans">
            <div className="text-[12px] text-[#202124] truncate">https://ziaproperti.co.id</div>
            <div className="text-[18px] text-[#1a0dab] font-normal hover:underline cursor-pointer leading-snug line-clamp-1">
              {formData.companyName} | {formData.tagline}
            </div>
            <div className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
              {formData.fullAddress} • Pengembang kawasan perumahan American Classic ZIA Emerald, kavling Kav Hillside, ZIA Farm, dan Altara ZIA International.
            </div>
          </div>
        </div>

        {/* Global Metadata Inputs */}
        <div className="p-6 bg-stone-950 border border-stone-800 space-y-4">
          <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-stone-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            Meta Tag Global Website
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Nama Entitas Korporat (Brand Name)
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Tagline Utama
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
              Kata Kunci Pencarian (Meta Keywords)
            </label>
            <input
              type="text"
              placeholder="properti bekasi, rumah american classic, kavling tarumajaya, peternakan modern, vanilla beans indonesia"
              value={formData.metaKeywords || ''}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white"
            />
          </div>
        </div>

        {/* Analytics & Webmaster Pixels */}
        <div className="p-6 bg-stone-950 border border-stone-800 space-y-4">
          <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-stone-800 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Tracking & Analitik Lalu Lintas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={formData.ga4Id || ''}
                onChange={(e) => setFormData({ ...formData, ga4Id: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white font-mono"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Digunakan untuk memantau jumlah kunjungan dan perilaku pengunjung.
              </span>
            </div>

            <div>
              <label className="text-stone-400 uppercase tracking-wider block mb-1 font-medium">
                Meta Pixel ID (Facebook / Instagram Ads)
              </label>
              <input
                type="text"
                placeholder="123456789012345"
                value={formData.metaPixelId || ''}
                onChange={(e) => setFormData({ ...formData, metaPixelId: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white font-mono"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Digunakan untuk pelacakan konversi iklan pemasaran properti.
              </span>
            </div>
          </div>
        </div>

        {/* Structured Data Info */}
        <div className="p-6 bg-stone-950 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Schema.org JSON-LD Structured Data
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Sistem secara otomatis menginjeksi metadata skema <strong>RealEstateAgent</strong> dan <strong>Product</strong> berstandar Google Search Console, termasuk koordinat kantor pusat di Kabupaten Bekasi (-6.1852, 106.9944).
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan Pengaturan...' : 'Simpan Konfigurasi SEO'}
          </button>
        </div>
      </form>
    </div>
  );
};

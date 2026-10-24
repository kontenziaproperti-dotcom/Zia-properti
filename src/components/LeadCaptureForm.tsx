import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { createLead } from '../services/dataService';
import { getProjectMarketing } from '../config/projectMarketing';

interface LeadFormProps {
  projectSlug: string;
  projectName: string;
  propertyOptions?: string[];
  title?: string;
  subtitle?: string;
  accentColorClass?: string;
  buttonColorClass?: string;
  submitButtonText?: string;
  onSuccess?: () => void;
}

export const LeadCaptureForm: React.FC<LeadFormProps> = ({
  projectSlug,
  projectName,
  propertyOptions = [],
  title = 'Konsultasi & Reservasi Eksklusif',
  subtitle = 'Dapatkan brosur spesifikasi lengkap, simulasi pembiayaan, atau jadwalkan survei privat langsung dengan representatif PT ZIA Properti Indonesia.',
  accentColorClass = 'text-stone-900',
  buttonColorClass = 'bg-stone-900 hover:bg-stone-800 text-white',
  submitButtonText,
  onSuccess
}) => {
  const marketing = getProjectMarketing(projectSlug);
  const today = new Date();
  const minimumVisitDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const initialFormData = {
    name: '',
    phone: '',
    email: '',
    propertyType: propertyOptions[0] || '',
    budgetRange: 'Di bawah Rp 700 Juta',
    visitDate: '',
    visitTime: '',
    requestedOffer: marketing?.offerOptions[0] || 'Konsultasi umum',
    message: '',
    honeypot: '' // Anti-spam trap
  };
  const [formData, setFormData] = useState(initialFormData);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      // Bot detected silently
      setSubmitted(true);
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Nama lengkap dan nomor WhatsApp wajib diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        projectSlug,
        projectName,
        propertyType: formData.propertyType,
        budgetRange: formData.budgetRange,
        visitDate: formData.visitDate,
        visitTime: formData.visitTime,
        requestedOffer: formData.requestedOffer,
        message: formData.message.trim(),
        source: 'Website Lead Form',
        status: 'New'
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg('Terjadi kendala saat mengirim data. Silakan hubungi kami via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-stone-900 text-white p-8 md:p-12 rounded-none border border-stone-800 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-400 mb-4 stroke-1" />
        <h3 className="text-2xl font-serif mb-2">Terima Kasih, Permintaan Anda Telah Diterima</h3>
        <p className="text-stone-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
          Representatif {projectName} akan segera menghubungi nomor WhatsApp Anda untuk memberikan katalog dan jadwal konsultasi yang nyaman.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData(initialFormData);
          }}
          className="text-xs uppercase tracking-widest text-stone-300 hover:text-white underline underline-offset-4"
        >
          Kirim formulir lain
        </button>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 text-stone-100 p-8 md:p-12 border border-stone-800">
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 block mb-2 font-medium">
          Official Direct Developer
        </span>
        <h3 className={`text-2xl md:text-3xl font-serif tracking-tight text-white mb-3`}>
          {title}
        </h3>
        <p className="text-stone-400 text-sm leading-relaxed max-w-xl">
          {subtitle}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Anti-spam honeypot */}
        <input
          type="text"
          name="user_note_extra"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
              Nama Lengkap <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
              Nomor WhatsApp <span className="text-amber-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="0812xxxxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
              Email Pribadi
            </label>
            <input
              type="email"
              placeholder="budi@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>

          {propertyOptions.length > 0 ? (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
                Pilihan Unit / Kavling
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-stone-500 transition-colors"
              >
                {propertyOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-stone-900 text-stone-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
                Estimasi Rencana Investasi
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-stone-500 transition-colors"
              >
                <option value="Di bawah Rp 700 Juta">Di bawah Rp 700 Juta</option>
                <option value="Rp 700 Juta - Rp 1 Milyar">Rp 700 Juta - Rp 1 Milyar</option>
                <option value="Di atas Rp 1 Milyar">Di atas Rp 1 Milyar</option>
                <option value="Eksplorasi Kavling / Bisnis">Eksplorasi Kavling / Bisnis</option>
              </select>
            </div>
          )}
        </div>

        <div className="border border-stone-800 bg-stone-950/60 p-4 md:p-5 space-y-4">
          <div>
            <span className="block text-xs uppercase tracking-wider text-amber-300 mb-1 font-semibold">
              {marketing?.ctaLabel || 'Jadwalkan Kunjungan / Konsultasi'}
            </span>
            <p className="text-[11px] leading-relaxed text-stone-500">
              Pilih minat penawaran dan, bila sudah ada rencana, isi tanggal serta waktu yang Anda inginkan. Jadwal akan dikonfirmasi oleh tim, bukan langsung dianggap booking final.
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
              {marketing?.offerLabel || 'Penawaran yang ingin ditanyakan'}
            </label>
            <select
              value={formData.requestedOffer}
              onChange={(e) => setFormData({ ...formData, requestedOffer: e.target.value })}
              className="w-full bg-stone-900 border border-stone-700 px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-300"
            >
              {(marketing?.offerOptions || ['Konsultasi umum']).map((offer) => (
                <option key={offer} value={offer} className="bg-stone-900 text-stone-200">{offer}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
                {marketing?.visitDateLabel || 'Tanggal kunjungan / konsultasi (opsional)'}
              </label>
              <input
                type="date"
                min={minimumVisitDate}
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full bg-stone-900 border border-stone-700 px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-300"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
                {marketing?.visitTimeLabel || 'Waktu kunjungan / konsultasi (opsional)'}
              </label>
              <select
                value={formData.visitTime}
                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                className="w-full bg-stone-900 border border-stone-700 px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-300"
              >
                <option value="">Belum ditentukan</option>
                <option value="09:00">09.00 WIB</option>
                <option value="10:00">10.00 WIB</option>
                <option value="11:00">11.00 WIB</option>
                <option value="13:00">13.00 WIB</option>
                <option value="14:00">14.00 WIB</option>
                <option value="15:00">15.00 WIB</option>
                <option value="16:00">16.00 WIB</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-medium">
            Pesan Tambahan / Kebutuhan Khusus
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan jika ada spesifikasi khusus atau rencana hari untuk survei lokasi..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors resize-none"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 px-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 ${buttonColorClass} disabled:opacity-50`}
          >
            {submitting ? 'Mengirim Data...' : (submitButtonText || marketing?.submitButtonText || 'Kirim Permintaan Konsultasi')}
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-stone-500 text-center pt-2">
          Privasi Anda terlindungi. Kami tidak membagikan kontak Anda kepada pihak ketiga manapun di luar PT ZIA Properti Indonesia.
        </p>
      </form>
    </div>
  );
};

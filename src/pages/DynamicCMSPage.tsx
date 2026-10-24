import { PageItem, SectionItem, CompanySettings } from '../types';
import { ArrowLeft, MessageSquare, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { cleanWhatsAppNumber } from '../lib/contactUtils';

interface DynamicCMSPageProps {
  page: PageItem;
  sections: SectionItem[];
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}

export const DynamicCMSPage: React.FC<DynamicCMSPageProps> = ({
  page,
  sections,
  settings,
  onNavigate
}) => {
  const activeSections = sections
    .filter((s) => s.pageSlug === page.slug && (s.status === 'published' || !s.status))
    .sort((a, b) => a.order - b.order);

  const getWaLink = () => {
    const rawNumber = settings.contactWhatsApp || settings.corporateWhatsApp || '6281288889911';
    const cleanNumber = cleanWhatsAppNumber(rawNumber, '6281288889911');
    const msg = `Halo Tim PT ZIA Properti Indonesia, saya membaca halaman "${page.title}" dan ingin berkonsultasi lebih lanjut.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-stone-800 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-stone-950 text-white overflow-hidden py-16">
        {page.coverImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={page.coverImage}
              alt={page.title}
              className="w-full h-full object-cover opacity-25 filter saturate-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-xs uppercase tracking-widest font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] uppercase tracking-widest font-bold mb-4">
            <Sparkles className="w-3 h-3" />
            Halaman Resmi
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4 tracking-tight leading-tight">
            {page.title}
          </h1>

          {page.summary && (
            <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed font-light">
              {page.summary}
            </p>
          )}

          {page.updatedAt && (
            <div className="flex items-center gap-2 mt-6 text-xs text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Diperbarui pada: {new Date(page.updatedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      {page.content && (
        <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="bg-white border border-stone-200 p-8 sm:p-12 shadow-xs">
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line font-light">
              {page.content}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Sections (from CMS Sections module) */}
      {activeSections.length > 0 && (
        <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-12">
          {activeSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-8 sm:p-10 border border-stone-200 bg-white ${
                idx % 2 === 1 ? 'bg-stone-50/50' : ''
              }`}
            >
              {sec.subtitle && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold block mb-1">
                  {sec.subtitle}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-4">
                {sec.title}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {sec.imageUrl && (
                  <div className="lg:col-span-5 overflow-hidden border border-stone-200">
                    <img
                      src={sec.imageUrl}
                      alt={sec.title}
                      className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className={sec.imageUrl ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
                  <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                  {sec.ctaText && sec.ctaUrl && (
                    <div className="pt-2">
                      <a
                        href={sec.ctaUrl}
                        target={sec.ctaUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-800 text-xs uppercase tracking-wider font-semibold"
                      >
                        {sec.ctaText}
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Inquiry & Consultation Box */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-stone-900 text-white p-8 sm:p-12 border border-stone-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block mb-2">
                Konsultasi & Layanan Resmi
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">
                Butuh Informasi Lebih Lanjut?
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                Tim representatif PT ZIA Properti Indonesia siap membantu memberikan penjelasan komprehensif, penjadwalan survei, atau penawaran resmi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getWaLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs uppercase tracking-wider font-bold transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-stone-950 p-6 border border-stone-800">
              <LeadCaptureForm
                projectName={page.title}
                projectSlug={page.slug}
                title="Kirim Pesan Langsung"
                subtitle="Isi data diri Anda agar tim kami dapat menghubungi kembali."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  Trees,
  Award,
  ChevronDown,
  Building,
  CheckCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { CompanySettings, ProjectEntity, PostItem } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';
import { getBusinessDirectoryItems } from '../features/corporate-refresh/businessUnits';
import { CorporateBusinessCard } from '../features/corporate-refresh/components/CorporateBusinessCard';

interface HomePageProps {
  settings: CompanySettings;
  projects: ProjectEntity[];
  posts: PostItem[];
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  projects,
  posts,
  onNavigate
}) => {
  // Hide this listing from the corporate homepage only. The project record,
  // CMS data and direct detail route remain untouched.
  const directoryItems = getBusinessDirectoryItems(projects)
    .filter((item) => item.slug !== 'proyek-1792842863315');

  const getWaCorporateLink = () => {
    const rawNumber = settings.contactWhatsApp || settings.corporateWhatsApp;
    const cleanNumber = cleanWhatsAppNumber(rawNumber);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      'Halo Tim ZIA Corporate, saya ingin berkonsultasi mengenai proyek dan ekosistem bisnis ZIA.'
    )}`;
  };

  return (
    <div className="se-home min-h-screen bg-stone-50">
      {/* 1. HERO SECTION */}
      <section className="se-hero relative min-h-[92vh] flex items-center bg-stone-950 text-white overflow-hidden">
        {/* Reference-inspired corporate canvas. Official photography will be supplied separately. */}
        <div className="se-hero__media absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(80,120,101,0.36),transparent_30%),linear-gradient(125deg,#0c1511_0%,#1d2a22_52%,#0d1713_100%)]" />
          <div className="absolute -right-24 bottom-0 h-[75%] w-[58%] border-l border-t border-stone-400/20 bg-[linear-gradient(90deg,transparent_0%,rgba(201,168,76,0.08)_100%)] [clip-path:polygon(22%_100%,22%_24%,42%_4%,42%_100%,59%_100%,59%_38%,80%_14%,80%_100%,100%_100%,100%_0%,0%_0%,0%_100%)]" aria-hidden="true" />
          <div className="se-hero__overlay--horizontal absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          <div className="se-hero__overlay--bottom absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* Architectural Corporate Badge */}
            <div className="se-hero__eyebrow inline-flex items-center gap-2.5 px-3 py-1.5 border border-stone-700 bg-stone-900/80 backdrop-blur-sm text-stone-300 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="se-hero__eyebrow-dot w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ZIA Corporate · Kelompok Usaha Diversifikasi
            </div>

            {/* Headline */}
            <h1 className="se-hero__title text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.15] mb-6">
              Building Better Places, <br />
              <span className="se-hero__title-accent italic font-light text-stone-300">Creating Long Term Value</span>
            </h1>

            {/* Supporting Copy */}
            <p className="se-hero__copy text-base sm:text-lg text-stone-300 font-sans font-light leading-relaxed mb-10 max-w-2xl">
              ZIA Corporate mengembangkan ekosistem usaha lintas sektor, mulai dari properti, agribisnis, ekspor, retail, perdagangan, hingga direct selling. Setiap lini bisnis memiliki fokus tersendiri dalam membangun nilai jangka panjang bagi pelanggan dan mitra.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('/projects')}
                className="se-button se-button--light px-8 py-4 bg-stone-100 text-stone-900 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
              >
                Eksplorasi Proyek Kami
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWaCorporateLink()}
                target="_blank"
                rel="noreferrer"
                className="se-button se-button--outline-light px-8 py-4 border border-stone-600 hover:border-white text-stone-200 hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Konsultasi Langsung
              </a>
            </div>

            {/* Corporate Value Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-16 border-t border-stone-800/80 mt-16">
              <div>
                <span className="se-hero__metric-number block text-2xl lg:text-3xl font-serif text-white font-light">6 Lini</span>
                <span className="se-hero__metric-label text-[11px] uppercase tracking-wider text-stone-400">Ekosistem Usaha Terpadu</span>
              </div>
              <div>
                <span className="se-hero__metric-number block text-2xl lg:text-3xl font-serif text-white font-light">Bekasi</span>
                <span className="se-hero__metric-label text-[11px] uppercase tracking-wider text-stone-400">Kantor Pusat & Basis Operasi</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="se-hero__metric-number block text-2xl lg:text-3xl font-serif text-white font-light">Multi-sektor</span>
                <span className="se-hero__metric-label text-[11px] uppercase tracking-wider text-stone-400">Properti, agribisnis, retail & perdagangan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 mb-1">Gulir</span>
          <ChevronDown className="w-4 h-4 text-stone-400 animate-bounce" />
        </div>
      </section>

      {/* 2. CORPORATE POSITIONING & ABOUT SECTION */}
      <section className="py-24 lg:py-32 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-3">
                Tentang ZIA
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight mb-6">
                Komitmen Nyata Membangun Ekosistem Berkelanjutan di Jawa Barat
              </h2>
              <div className="w-12 h-0.5 bg-stone-900 mb-6" />
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                ZIA Corporate adalah ekosistem usaha lintas sektor yang bertumbuh dari fondasi tata kelola bisnis yang disiplin, pengembangan bernilai jangka panjang, dan kemitraan yang dapat dipercaya.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed mb-8">
                Bagi kami, properti bukan sekadar struktur fisik, melainkan ruang bertumbuh bagi keluarga dan instrumen pelindung nilai aset bagi generasi mendatang.
              </p>

              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-900 border-b-2 border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
              >
                Pelajari Visi & Filosofi Perusahaan →
              </button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-stone-50 border border-stone-200">
                <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center mb-6">
                  <ShieldCheck className="w-5 h-5 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                  Integritas Legalitas
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Mengutamakan keterbukaan informasi dan proses yang dapat ditelusuri pada setiap pengembangan properti.
                </p>
              </div>

              <div className="p-8 bg-stone-50 border border-stone-200">
                <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center mb-6">
                  <Building className="w-5 h-5 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                  Arsitektur Bernilai Abadi
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Menerapkan proporsi American Classic yang elegan, sirkulasi udara optimal, dan konstruksi kokoh berstandar tinggi.
                </p>
              </div>

              <div className="p-8 bg-stone-50 border border-stone-200">
                <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center mb-6">
                  <Trees className="w-5 h-5 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                  Ekosistem Saling Menguatkan
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Mengembangkan keterpaduan antara hunian, kavling bernilai simpan, agrikultur higienis, dan komoditas ekspor bernilai devisa.
                </p>
              </div>

              <div className="p-8 bg-stone-50 border border-stone-200">
                <div className="w-10 h-10 bg-stone-900 text-white flex items-center justify-center mb-6">
                  <Compass className="w-5 h-5 stroke-1" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                  Lokasi Berorientasi Akses
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Memilih koridor berkembang di Kabupaten Bekasi yang dekat dengan sarana transportasi, gerbang tol, dan kawasan bisnis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS ECOSYSTEM (6 BUSINESS UNITS) */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-2">
              Corporate Master Brand
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
              Ekosistem Usaha ZIA Corporate
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Setiap entitas dirancang dengan identitas mandiri, standar keunggulan fungsional, dan etika bisnis yang terpercaya.
            </p>
          </div>

          <div className="se-business-grid">
            {directoryItems.map((item) => (
              <CorporateBusinessCard key={item.slug} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECT HIGHLIGHT: ZIA EMERALD */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 border border-stone-200 overflow-hidden shadow-xl">
                <div className="h-[450px] bg-[linear-gradient(145deg,#10231a,#284b36_55%,#c9a84c_210%)] p-8 flex items-end" role="img" aria-label="Visual referensi ZIA Emerald">
                  <div className="border border-white/25 p-6 max-w-xs text-white/90">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-amber-200 mb-3">ZIA Emerald</span>
                    <span className="font-serif text-3xl leading-tight">A place to grow, with lasting value.</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-emerald-950/10 -z-0 hidden md:block" />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Flagship Residential Development
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight">
                ZIA Emerald: Estetika American Classic di Tarumajaya, Bekasi
              </h2>

              <p className="text-stone-600 text-sm leading-relaxed">
                Menghadirkan lingkungan perumahan modern dengan keanggunan fasad American Classic. Dirancang dengan plafon ekstra tinggi, opsi mezzanine fungsional, dan one-gate security system untuk kenyamanan keluarga Anda.
              </p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-200">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block">Pilihan Tipe</span>
                  <span className="font-serif text-base font-bold text-stone-900">Type 50/72 & Type 80/72</span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 block">Konsep Khusus</span>
                  <span className="font-serif text-base font-bold text-stone-900">High Ceiling & Mezzanine</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/projects/zia-emerald')}
                  className="se-button se-featured-cta se-featured-cta--primary px-6 py-3.5 bg-emerald-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2"
                >
                  Detail Lengkap ZIA Emerald
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.emeraldWhatsApp, '6281288889922')}?text=${encodeURIComponent('Halo Tim Sales ZIA Emerald, saya ingin informasi mengenai hunian American Classic di Tarumajaya.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="se-button se-featured-cta se-featured-cta--outline px-6 py-3.5 border border-stone-300 text-stone-800 text-xs uppercase tracking-widest font-semibold hover:border-stone-900 transition-colors"
                >
                  WhatsApp Sales Emerald
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWS / CORPORATE INSIGHTS */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-2">
                Publikasi & Analisis
              </span>
              <h2 className="text-3xl font-serif text-stone-900">
                Wawasan Resmi ZIA Corporate
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1.5"
            >
              Lihat Semua Artikel →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate('/blog')}
                className="se-card se-card--article bg-white border border-stone-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all"
              >
                <div className="h-48 overflow-hidden bg-stone-900">
                  {post.coverImage && !/images\.unsplash\.com/i.test(post.coverImage) ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_25%,rgba(201,168,76,0.18),transparent_42%),linear-gradient(135deg,#101a16,#26372e)] text-stone-300">
                      <div className="w-14 h-14 border border-amber-300/40 rounded-full flex items-center justify-center">
                        <Building size={30} strokeWidth={1.15} className="text-amber-200" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-stone-300/75">ZIA Corporate · Insights</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mb-2">
                    {post.category}
                  </span>
                  <h3 className="se-card__title font-serif text-lg font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                    {post.summary}
                  </p>
                  <span className="se-card__read-more text-[11px] font-semibold text-stone-900 uppercase tracking-wider">
                    Baca Ulasan →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GENERAL CORPORATE INQUIRY & CONTACT */}
      <section className="se-cta-section py-24 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-medium block">
                Konsultasi & Kemitraan
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Hubungi Representatif Resmi ZIA Corporate
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed">
                Tim profesional kami siap melayani pertanyaan seputar pemesanan unit residensial ZIA Emerald, kavling Kav Hillside, kemitraan agrikultur ZIA Farm, maupun ekspor vanilla Altara ZIA International.
              </p>

              <div className="pt-6 border-t border-stone-800 space-y-4 text-xs">
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block mb-1">Kantor Pusat</span>
                  <p className="text-stone-300 font-medium">{settings.fullAddress}</p>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block mb-1">Jam Operasional</span>
                  <p className="text-stone-300 font-medium">{settings.officeHours}</p>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block mb-1">Telepon & Email</span>
                  <p className="text-stone-300 font-medium font-mono">{formatIndonesianPhone(settings.phone)} • {settings.email}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <LeadCaptureForm
                projectSlug="corporate-general"
                projectName="ZIA Corporate"
                propertyOptions={[
                  'ZIA Emerald (Rumah American Classic)',
                  'Kav Hillside (Kavling Siap Bangun)',
                  'ZIA Farm (Kemitraan & Hewan Ternak)',
                  'Altara ZIA (Ekspor Vanilla Bean B2B)',
                  'Konsultasi Bisnis / Kemitraan Lain'
                ]}
                title="Sampaikan Kebutuhan Anda"
                subtitle="Isi formulir di bawah ini dan representatif spesifik kami akan menghubungi Anda sesuai bidang minat yang dipilih."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

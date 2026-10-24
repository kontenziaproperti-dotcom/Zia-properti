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
  const getWaCorporateLink = () => {
    const rawNumber = settings.contactWhatsApp || settings.corporateWhatsApp;
    const cleanNumber = cleanWhatsAppNumber(rawNumber);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      'Halo Tim PT ZIA Properti Indonesia, saya ingin berkonsultasi mengenai proyek dan ekosistem bisnis ZIA.'
    )}`;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center bg-stone-950 text-white overflow-hidden">
        {/* Authentic Background Architecture Canvas with subtle gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Arsitektur Residensial PT ZIA Properti Indonesia"
            className="w-full h-full object-cover opacity-35 filter saturate-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* Architectural Corporate Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-stone-700 bg-stone-900/80 backdrop-blur-sm text-stone-300 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Pengembang Properti • Kabupaten Bekasi, Jawa Barat
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.15] mb-6">
              Building Better Places, <br />
              <span className="italic font-light text-stone-300">Creating Long Term Value</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-stone-300 font-sans font-light leading-relaxed mb-10 max-w-2xl">
              PT ZIA Properti Indonesia mengembangkan kawasan hunian dan ekosistem bisnis terencana yang berorientasi pada kualitas bangunan, fungsionalitas tata ruang, kepastian legalitas, dan penciptaan nilai berkelanjutan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('/projects')}
                className="px-8 py-4 bg-stone-100 text-stone-900 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
              >
                Eksplorasi Proyek Kami
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWaCorporateLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-stone-600 hover:border-white text-stone-200 hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Konsultasi Langsung
              </a>
            </div>

            {/* Corporate Value Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-16 border-t border-stone-800/80 mt-16">
              <div>
                <span className="block text-2xl lg:text-3xl font-serif text-white font-light">4 Pilar</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400">Ekosistem Usaha Terpadu</span>
              </div>
              <div>
                <span className="block text-2xl lg:text-3xl font-serif text-white font-light">Bekasi</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400">Kantor Pusat & Basis Operasi</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-2xl lg:text-3xl font-serif text-white font-light">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-stone-400">Transparansi Legalitas</span>
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
                PT ZIA Properti Indonesia adalah perusahaan pengembang properti yang berkedudukan di Kabupaten Bekasi, Jawa Barat. Kami memadukan perencanaan tata letak arsitektur yang beretika dengan tata kelola bisnis yang disiplin.
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
                  Menjamin seluruh sertifikat tanah induk, izin tapak, dan PBG diproses transparan sebelum penawaran unit dilakukan.
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

      {/* 3. BUSINESS ECOSYSTEM (4 CARDS) */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-2">
              Corporate Master Brand
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
              Ekosistem Usaha PT ZIA Properti Indonesia
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Setiap entitas dirancang dengan identitas mandiri, standar keunggulan fungsional, dan etika bisnis yang terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((proj) => {
              const route = `/projects/${proj.slug}`;
              return (
                <div
                  key={proj.slug}
                  className="bg-white border border-stone-200 flex flex-col group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden bg-stone-900">
                    <img
                      src={proj.heroImage}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
                    <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-semibold bg-white text-stone-900 px-2.5 py-1 shadow-sm">
                      {proj.category.split(' ')[0]}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
                        {proj.location}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-6">
                        {proj.shortDescription}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate(route)}
                      className="w-full py-3 border border-stone-900 text-stone-900 text-xs uppercase tracking-widest font-semibold hover:bg-stone-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      Eksplorasi {proj.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECT HIGHLIGHT: ZIA EMERALD */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 border border-stone-200 overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="ZIA Emerald House Type"
                  className="w-full h-[450px] object-cover"
                />
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
                  className="px-6 py-3.5 bg-emerald-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2"
                >
                  Detail Lengkap ZIA Emerald
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.emeraldWhatsApp, '6281288889922')}?text=${encodeURIComponent('Halo Tim Sales ZIA Emerald, saya ingin informasi mengenai hunian American Classic di Tarumajaya.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 border border-stone-300 text-stone-800 text-xs uppercase tracking-widest font-semibold hover:border-stone-900 transition-colors"
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
                Wawasan Resmi PT ZIA Properti Indonesia
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
                className="bg-white border border-stone-200 overflow-hidden cursor-pointer group hover:shadow-md transition-all"
              >
                <div className="h-48 overflow-hidden bg-stone-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mb-2">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                    {post.summary}
                  </p>
                  <span className="text-[11px] font-semibold text-stone-900 uppercase tracking-wider">
                    Baca Ulasan →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GENERAL CORPORATE INQUIRY & CONTACT */}
      <section className="py-24 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-medium block">
                Konsultasi & Kemitraan
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Hubungi Representatif Resmi PT ZIA Properti Indonesia
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
                projectName="PT ZIA Properti Indonesia (Corporate)"
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

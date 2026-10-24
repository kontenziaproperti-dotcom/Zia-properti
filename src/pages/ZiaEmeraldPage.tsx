import React, { useState } from 'react';
import {
  Compass,
  Trees,
  Check,
  MapPin,
  Maximize2,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
  HelpCircle,
  FileText
} from 'lucide-react';
import { PropertyItem, FAQItem, TestimonialItem, CompanySettings } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { GoogleMapsView } from '../components/maps/GoogleMapsView';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';

interface ZiaEmeraldProps {
  properties: PropertyItem[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}

export const ZiaEmeraldPage: React.FC<ZiaEmeraldProps> = ({
  properties,
  faqs,
  testimonials,
  settings,
  onNavigate
}) => {
  const emeraldProps = properties.filter((p) => p.projectSlug === 'zia-emerald');
  const [selectedType, setSelectedType] = useState<PropertyItem>(
    emeraldProps[0] || properties[0]
  );
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const emeraldFaqs = faqs.filter((f) => f.projectSlug === 'zia-emerald');
  const emeraldTestimonials = testimonials.filter((t) => t.projectSlug === 'zia-emerald');

  const getWaEmeraldLink = (text?: string) => {
    const rawNum = settings.emeraldWhatsApp || '6281288889922';
    const cleanNum = cleanWhatsAppNumber(rawNum, '6281288889922');
    const msg = text || 'Halo Tim Sales ZIA Emerald, saya tertarik dengan informasi hunian American Classic di Tarumajaya Bekasi. Mohon informasi lebih lanjut mengenai tipe unit dan promo.';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* 1. HERO - American Classic Editorial */}
      <section className="relative min-h-[90vh] flex items-center bg-[#092b21] text-stone-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="ZIA Emerald American Classic Residence"
            className="w-full h-full object-cover opacity-40 filter saturate-[0.8] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061e17] via-[#092b21]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061e17] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1b4d3e] bg-[#0c3629]/90 text-amber-200 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Tarumajaya, Kabupaten Bekasi • Jawa Barat
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-6">
              ZIA EMERALD
              <span className="block text-xl sm:text-2xl font-light text-amber-100/90 font-serif italic mt-3">
                American Classic × Modern Family Living
              </span>
            </h1>

            <p className="text-base text-stone-200 font-light leading-relaxed mb-8 max-w-xl">
              Harmonisasi keanggunan fasad klasik abadi dengan kebutuhan gaya hidup keluarga modern. Menghadirkan plafon tinggi (high ceiling), fleksibilitas mezanin, serta lingkungan asri yang terjaga.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#house-types"
                className="px-8 py-4 bg-amber-100 text-[#092b21] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all text-center"
              >
                Pilihan Tipe Rumah
              </a>

              <a
                href={getWaEmeraldLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-amber-200/50 text-amber-100 hover:bg-white/10 text-xs uppercase tracking-[0.2em] font-semibold transition-all text-center flex items-center justify-center gap-2"
              >
                Konsultasi WhatsApp
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-emerald-900/60 mt-12 text-xs">
              <div>
                <span className="text-amber-200 uppercase tracking-wider block text-[10px]">Arsitektur</span>
                <span className="font-serif text-base text-white">American Classic</span>
              </div>
              <div>
                <span className="text-amber-200 uppercase tracking-wider block text-[10px]">Plafon Ruang</span>
                <span className="font-serif text-base text-white">Hingga 4.2 Meter</span>
              </div>
              <div>
                <span className="text-amber-200 uppercase tracking-wider block text-[10px]">Akses Tol</span>
                <span className="font-serif text-base text-white">Tol Cibitung - Cilincing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJECT INTRODUCTION & WHY CHOOSE ZIA EMERALD */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#0f4c3a] font-bold block">
                Konsep & Filosofi Hunian
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight">
                Dirancang untuk Pertumbuhan Keluarga dan Ketenteraman Hati
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Di ZIA Emerald, arsitektur bukan sekadar tampilan visual luar. Setiap garis fasad American Classic mencerminkan kemapanan dan estetika abadi yang tak lekang oleh tren waktu.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Dinding bata ringan kokoh, pencahayaan alami melimpah, dan sirkulasi udara silang (cross ventilation) dirancang untuk meminimalkan kelembapan tinggi khas wilayah tropis Bekasi, menciptakan hunian yang senantiasa sejuk dan sehat.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Desain fasad American Classic dengan moulding proporsional dan finishing berkelas',
                  'Plafon ruang utama ekstra tinggi mendukung opsi mezzanine modular masa depan',
                  'Sistem keamanan satu gerbang (one-gate security) dengan akses kartu penghuni',
                  'Infrastruktur jalan lingkungan rapi dan sistem drainase tertutup bebas genangan',
                  'Legalitas terverifikasi resmi oleh PT ZIA Properti Indonesia'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-stone-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="ZIA Emerald Exterior Detail"
                  className="w-full h-64 object-cover border border-stone-200 shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
                  alt="ZIA Emerald Interior Living Room"
                  className="w-full h-64 object-cover border border-stone-200 shadow-md translate-y-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOUSE TYPES / UNIT CATALOGUE (CMS-DRIVEN) */}
      <section id="house-types" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#0f4c3a] font-bold block mb-2">
              Koleksi Tipe Rumah
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
              Pilihan Unit Residensial ZIA Emerald
            </h2>
            <p className="text-sm text-stone-600">
              Setiap denah dan spesifikasi dapat disesuaikan dengan kebutuhan ruang keluarga Anda. Informasi ketersediaan unit dikelola dinamis melalui sistem CMS pengembang.
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {emeraldProps.map((prop) => (
              <button
                key={prop.id}
                onClick={() => setSelectedType(prop)}
                className={`px-6 py-3 text-xs uppercase tracking-widest font-semibold border transition-all ${
                  selectedType?.id === prop.id
                    ? 'bg-[#0f4c3a] text-white border-[#0f4c3a] shadow-md'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'
                }`}
              >
                {prop.name}
              </button>
            ))}
          </div>

          {/* Selected Type Detail View */}
          {selectedType && (
            <div className="bg-white border border-stone-200 overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Images */}
                <div className="lg:col-span-7 bg-stone-950 p-6 flex flex-col justify-between">
                  <div className="relative h-[380px] sm:h-[450px] overflow-hidden border border-stone-800">
                    <img
                      src={selectedType.mainImage}
                      alt={selectedType.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-stone-900/90 text-amber-300 px-3 py-1 text-xs uppercase tracking-wider font-semibold border border-stone-700">
                      Status: {selectedType.status}
                    </div>
                    {selectedType.promoBadge && (
                      <div className="absolute bottom-4 left-4 bg-emerald-800 text-white px-3 py-1.5 text-xs font-semibold">
                        Promo: {selectedType.promoBadge}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail gallery */}
                  {selectedType.gallery && selectedType.gallery.length > 0 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                      {selectedType.gallery.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${selectedType.name} gallery ${i}`}
                          className="w-20 h-16 object-cover border border-stone-700 cursor-pointer opacity-80 hover:opacity-100"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Specs & Data */}
                <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#0f4c3a] font-bold block mb-1">
                      {selectedType.type}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 font-bold mb-3">
                      {selectedType.name}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed mb-6">
                      {selectedType.description}
                    </p>

                    {/* Area parameters */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 border border-stone-200 mb-6 text-xs">
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Luas Tanah</span>
                        <span className="font-serif text-base font-bold text-stone-900">{selectedType.landArea} m²</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Luas Bangunan</span>
                        <span className="font-serif text-base font-bold text-stone-900">{selectedType.buildingArea} m²</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Kamar Tidur</span>
                        <span className="font-serif text-base font-bold text-stone-900">{selectedType.bedrooms} Kamar</span>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Kamar Mandi</span>
                        <span className="font-serif text-base font-bold text-stone-900">{selectedType.bathrooms} Ruang</span>
                      </div>
                    </div>

                    {/* Financial details managed via CMS */}
                    <div className="mb-6 p-4 border border-amber-200 bg-amber-50/50 text-xs">
                      <span className="text-stone-500 uppercase tracking-wider text-[10px] block mb-1">
                        Informasi Harga & Pembiayaan
                      </span>
                      <div className="font-serif text-xl font-bold text-[#0f4c3a] mb-2">
                        {selectedType.priceFormatted}
                      </div>
                      <div className="space-y-1 text-stone-700">
                        {selectedType.downPayment && <p>• Down Payment: {selectedType.downPayment}</p>}
                        {selectedType.installmentEstimate && <p>• Estimasi Cicilan: {selectedType.installmentEstimate}</p>}
                        {selectedType.bookingFee && <p>• Tanda Jadi / Booking: Rp {selectedType.bookingFee.toLocaleString('id-ID')}</p>}
                      </div>
                    </div>

                    {/* Building Specs Accordion-style list */}
                    <div className="space-y-2 border-t border-stone-200 pt-4">
                      <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block mb-2">
                        Spesifikasi Material Utama:
                      </span>
                      {Object.entries(selectedType.specifications || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs py-1 border-b border-stone-100 last:border-none">
                          <span className="text-stone-500">{key}</span>
                          <span className="text-stone-800 font-medium text-right max-w-[55%]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col gap-3">
                    <a
                      href={getWaEmeraldLink(`Halo ZIA, saya tertarik dengan informasi spesifik untuk unit ${selectedType.name}. Mohon rincian simulasi KPR.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 bg-[#0f4c3a] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#0a3327] transition-colors text-center"
                    >
                      Pesan / Cek Ketersediaan Unit Ini
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. LOCATION & ACCESS ROAD HIGHLIGHTS */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#0f4c3a] font-bold block">
                Konektivitas Strategis
              </span>
              <h2 className="text-3xl font-serif text-stone-900 leading-tight">
                Tarumajaya: Koridor Pertumbuhan Cepat Kabupaten Bekasi
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Terletak di kawasan Tarumajaya yang berkembang pesat, ZIA Emerald memiliki aksesibilitas langsung ke jaringan jalan tol utama penghubung Jakarta Utara, Kawasan Industri Marunda, dan pusat ekonomi Jabodetabek.
              </p>

              <div className="space-y-4 pt-4 border-t border-stone-200 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0f4c3a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Jalan Tol Cibitung - Cilincing (JTCC)</span>
                    <span className="text-stone-500">Mempermudah perjalanan menuju Tanjung Priok dan Tol Jakarta-Cikampek.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0f4c3a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Fasilitas Pendidikan & Kesehatan</span>
                    <span className="text-stone-500">Dikelilingi sekolah negeri/swasta ternama dan rumah sakit rujukan.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#0f4c3a] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Sentra Niaga & Pasar Modern</span>
                    <span className="text-stone-500">Akses mudah untuk belanja harian dan pemenuhan kebutuhan keluarga.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-stone-900 p-8 border border-stone-200 text-white relative">
              <div className="border border-stone-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <span className="font-serif text-lg text-amber-200">Site Plan & Master Direction</span>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400">Tarumajaya Area</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Peta lokasi resmi dan koordinat terpasang pada masterplan proyek. Anda dapat mengunjungi show unit dengan pendampingan langsung staf pemasaran kami.
                </p>
                <div className="h-64 bg-stone-950 flex flex-col items-center justify-center p-6 text-center border border-stone-800">
                  <Compass className="w-10 h-10 text-emerald-400 mb-2 stroke-1" />
                  <span className="text-sm font-serif text-stone-200 font-semibold">Kawasan Residensial ZIA Emerald</span>
                  <span className="text-xs text-stone-500 mt-1">Tarumajaya, Kabupaten Bekasi, Jawa Barat</span>
                  <a
                    href="https://maps.google.com/?q=Tarumajaya+Bekasi"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 px-4 py-2 border border-stone-700 hover:border-amber-300 text-amber-200 text-[11px] uppercase tracking-wider transition-colors"
                  >
                    Buka Panduan Rute Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      {emeraldTestimonials.length > 0 && (
        <section className="py-20 bg-stone-100 border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#0f4c3a] font-bold block mb-4">
              Ulasan Penghuni & Konsumen
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-8">
              Kesan Tinggal di ZIA Emerald
            </h2>
            <div className="bg-white p-8 md:p-12 border border-stone-200 shadow-sm relative">
              <p className="text-stone-700 italic font-serif text-lg sm:text-xl leading-relaxed mb-6">
                "{emeraldTestimonials[0].content}"
              </p>
              <div className="text-xs font-semibold text-stone-900 uppercase tracking-widest">
                {emeraldTestimonials[0].author}
              </div>
              <div className="text-[11px] text-stone-500">
                {emeraldTestimonials[0].role}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. FAQS */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#0f4c3a] font-bold block mb-2">
              Pertanyaan yang Kerap Ditanyakan
            </span>
            <h2 className="text-3xl font-serif text-stone-900">
              Tanya Jawab Seputar ZIA Emerald
            </h2>
          </div>

          <div className="space-y-4">
            {emeraldFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-stone-200 bg-stone-50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-base text-stone-900 font-semibold"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? 'rotate-90 text-[#0f4c3a]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6.5. LOCATION & GOOGLE MAPS SECTION */}
      <section className="py-20 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#0f4c3a] font-bold block mb-2">
              Aksesibilitas & Panduan Arah
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-bold">
              Lokasi Kawasan ZIA Emerald Tarumajaya
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Jelajahi peta interaktif Google Maps untuk melihat lokasi persis kawasan hunian, rute dari Tol Cibitung - Cilincing, serta konektivitas ke sentra bisnis Bekasi dan Jakarta Utara.
            </p>
          </div>
          <GoogleMapsView
            initialSelectedId="emerald"
            heightClassName="h-[460px]"
            showDirectory={true}
          />
        </div>
      </section>

      {/* 7. LEAD GENERATION SECTION */}
      <section className="py-24 bg-[#08221a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-200 font-semibold block">
                Reservasi & Jadwal Survei
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Miliki Hunian American Classic Anda Sekarang
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Jadwalkan kunjungan privat ke rumah contoh ZIA Emerald di Tarumajaya bersama konsultan properti kami. Dapatkan penawaran promo DP ringan dan subsidi biaya legalitas.
              </p>
              <div className="p-4 bg-[#0d3429] border border-emerald-800 text-xs text-amber-100">
                <span className="font-semibold block mb-1">Butuh respon kilat?</span>
                Langsung kirim pesan ke tim sales kami via{' '}
                <a
                  href={getWaEmeraldLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-white hover:text-amber-200"
                >
                  WhatsApp Resmi ZIA Emerald
                </a>
                .
              </div>
            </div>

            <div className="lg:col-span-7">
              <LeadCaptureForm
                projectSlug="zia-emerald"
                projectName="ZIA Emerald (Tarumajaya)"
                propertyOptions={[
                  'Type 50/72 - The Haven (1 Lantai High Ceiling)',
                  'Type 80/72 - The Grand Manor (2 Lantai Mewah)',
                  'Type 65/72 - The Mezzanine Atelier (Loft Series)'
                ]}
                title="Dapatkan Brosur Lengkap & Pricelist ZIA Emerald"
                subtitle="Isi kontak Anda agar konsultan perumahan kami dapat mengirimkan denah resolusi tinggi dan jadwal kunjungan."
                buttonColorClass="bg-amber-300 hover:bg-amber-200 text-stone-950 font-bold"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

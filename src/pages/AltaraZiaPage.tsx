import React, { useState } from 'react';
import {
  Globe2,
  CheckCircle2,
  Sparkles,
  FileCheck2,
  ShieldCheck,
  Package,
  Layers,
  HelpCircle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { FAQItem, CompanySettings, ProjectEntity } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';

interface AltaraZiaProps {
  faqs: FAQItem[];
  settings: CompanySettings;
  project?: ProjectEntity | null;
  onNavigate: (route: string) => void;
}

export const AltaraZiaPage: React.FC<AltaraZiaProps> = ({
  faqs,
  settings,
  project,
  onNavigate
}) => {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const altaraFaqs = faqs.filter((f) => f.projectSlug === 'altara-zia-international');

  const getWaAltaraLink = () => {
    const rawNum = settings.altaraWhatsApp || '6281288889955';
    const cleanNum = cleanWhatsAppNumber(rawNum, '6281288889955');
    const msg = lang === 'EN'
      ? 'Hello Altara ZIA International, I am interested in sourcing Indonesian vanilla beans (Planifolia / Tahitensis).'
      : 'Halo Tim Altara ZIA International, saya tertarik untuk informasi pasokan vanilla bean ekspor mutu premium.';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-200 selection:text-stone-950">
      {/* 1. TOP B2B GLOBAL UTILITY BAR & LANGUAGE TOGGLE */}
      <div className="bg-stone-950 border-b border-stone-800 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase tracking-widest text-[10px]">
              {lang === 'EN'
                ? 'Indonesian Vanilla Origin • Direct Agroforestry Export'
                : 'Asal Vanilla Indonesia • Ekspor Agrikultur Langsung'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Language:</span>
            <div className="inline-flex border border-stone-700 bg-stone-900 text-[10px]">
              <button
                onClick={() => setLang('EN')}
                className={`px-2 py-0.5 font-bold transition-colors ${
                  lang === 'EN' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ID')}
                className={`px-2 py-0.5 font-bold transition-colors ${
                  lang === 'ID' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                ID
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HERO - Luxury Editorial Minimalist Swiss Grid */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0d1310] border-b border-stone-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2000&q=85"
            alt="Authentic Indonesian Cured Vanilla Beans"
            className="w-full h-full object-cover opacity-35 filter saturate-[0.8] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b09] via-[#0d1310]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b09] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber-900/60 bg-stone-950/80 text-amber-300 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {lang === 'EN' ? 'Premium Agricultural Export Division' : 'Divisi Ekspor Agrikultur Premium'}
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.08] mb-6">
              ALTARA ZIA <br />
              <span className="text-amber-100 font-light italic font-serif">
                INTERNATIONAL
              </span>
            </h1>

            <p className="text-xl text-stone-300 font-serif italic mb-6">
              "From Indonesia's Finest Farms to The World's Premium Markets."
            </p>

            <p className="text-sm sm:text-base text-stone-300 font-sans font-light leading-relaxed mb-10 max-w-2xl">
              {lang === 'EN'
                ? 'Directly sourcing, naturally sun-curing, and grading Gourmet and Extraction Grade vanilla beans (Planifolia & Tahitensis) from volcanic agroforestry origins across Indonesia for global flavor houses, chocolatiers, and master pastry chefs.'
                : 'Mengkurasi, memproses curing matahari bertahap, dan mengekspor vanilla bean kualitas Gourmet serta Ekstraksi (Planifolia & Tahitensis) dari tanah vulkanik Indonesia langsung ke industri perasa internasional.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#specifications"
                className="px-8 py-4 bg-amber-400 text-stone-950 text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-300 transition-all text-center"
              >
                {lang === 'EN' ? 'Product Specifications' : 'Spesifikasi Produk'}
              </a>

              <a
                href={getWaAltaraLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-stone-600 text-stone-200 hover:text-white hover:border-amber-400 text-xs uppercase tracking-[0.2em] font-semibold transition-all text-center"
              >
                {lang === 'EN' ? 'Request Quotation (B2B)' : 'Minta Penawaran Ekspor'}
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-stone-800 mt-12 text-xs">
              <div>
                <span className="text-amber-400 uppercase tracking-wider block text-[10px]">
                  {lang === 'EN' ? 'Species' : 'Spesies'}
                </span>
                <span className="font-serif text-sm text-white">Planifolia & Tahitensis</span>
              </div>
              <div>
                <span className="text-amber-400 uppercase tracking-wider block text-[10px]">
                  {lang === 'EN' ? 'Moisture Level' : 'Kadar Air'}
                </span>
                <span className="font-serif text-sm text-white">30% - 35% Gourmet</span>
              </div>
              <div>
                <span className="text-amber-400 uppercase tracking-wider block text-[10px]">
                  {lang === 'EN' ? 'Packaging' : 'Pengemasan'}
                </span>
                <span className="font-serif text-sm text-white">Vacuum Food-Grade</span>
              </div>
              <div>
                <span className="text-amber-400 uppercase tracking-wider block text-[10px]">
                  {lang === 'EN' ? 'Documentation' : 'Dokumen'}
                </span>
                <span className="font-serif text-sm text-white">Phytosanitary & COO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCIENTIFIC CURING & ORIGIN PRECISION */}
      <section className="py-24 bg-stone-950 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold block">
                {lang === 'EN' ? 'Artisanal Science & Ethical Origin' : 'Presisi Sains & Rantai Pasok Beretika'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                {lang === 'EN'
                  ? 'Traditional Curing Elevated by Strict Scientific QC'
                  : 'Proses Curing Tradisional Terbimbing Standar Laboratorium'}
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed">
                {lang === 'EN'
                  ? 'Indonesian terroir imparts a uniquely rich, warm, and woody fragrance profile with complex floral overtones. At Altara ZIA International, every harvested green pod is hand-selected at optimal maturity, scalded with precise thermal controls, sun-sweated, and conditioned for 3 to 5 months in wooden chests to allow full enzymatic development of natural vanillin crystals.'
                  : 'Tanah vulkanik Indonesia menghasilkan biji vanilla dengan profil aroma woody yang hangat dan sentuhan floral yang pekat. Kami memastikan pemanenan hanya pada polong yang matang pohon optimal, proses blanching terkontrol, pemanasan matahari, dan pemeraman berbulan-bulan di kotak kayu cedar/mahoni.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="p-4 bg-stone-900 border border-stone-800">
                  <span className="font-serif text-base text-amber-200 block mb-1">
                    {lang === 'EN' ? 'Zero Additives' : '100% Alami Bebas Aditif'}
                  </span>
                  <p className="text-stone-400">
                    {lang === 'EN'
                      ? 'No artificial fragrance enhancement or chemical preservation.'
                      : 'Murni pengeringan alami tanpa bahan pengawet atau pewangi sintetik.'}
                  </p>
                </div>
                <div className="p-4 bg-stone-900 border border-stone-800">
                  <span className="font-serif text-base text-amber-200 block mb-1">
                    {lang === 'EN' ? 'Full Batch Traceability' : 'Ketertelusuran Batch'}
                  </span>
                  <p className="text-stone-400">
                    {lang === 'EN'
                      ? 'Transparent tracking from partner farmers to export lot numbers.'
                      : 'Setiap karton ekspor memiliki kode lot asal perkebunan mitra binaan.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-stone-800 p-2 bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
                  alt="Altara ZIA Gourmet Vanilla Selection"
                  className="w-full h-[420px] object-cover"
                />
                <div className="p-4 bg-stone-950 text-xs text-stone-500 flex justify-between items-center border-t border-stone-800">
                  <span className="font-mono text-stone-400">BATCH-QC-GRADE-A</span>
                  <span className="text-amber-400 font-serif italic">Altara ZIA Standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT SPECIFICATIONS (TABLE / SWISS GRID) */}
      <section id="specifications" className="py-24 bg-stone-900 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold block mb-2">
              {lang === 'EN' ? 'B2B Export Catalogue' : 'Katalog Ekspor B2B'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              {lang === 'EN' ? 'Commercial Specifications & Grades' : 'Spesifikasi Komersial & Mutu'}
            </h2>
            <p className="text-sm text-stone-400">
              {lang === 'EN'
                ? 'Standardized grading adhering to international culinary and extraction benchmarks.'
                : 'Klasifikasi mutu terstandar sesuai kebutuhan kuliner dan ekstraksi internasional.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Grade A Gourmet */}
            <div className="bg-stone-950 border border-stone-800 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block mb-1">
                      Culinary Masterpiece
                    </span>
                    <h3 className="font-serif text-2xl text-white font-bold">
                      Gourmet / Prime Grade A
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
                    MOQ: 5 kg
                  </span>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed mb-6">
                  {lang === 'EN'
                    ? 'Supple, dark oily pods with high moisture retention. Best suited for high-end patisserie, artisanal ice creams, fine dining infusions, and luxury cosmetics.'
                    : 'Polong hitam berminyak dengan kelembapan tinggi, lentur tanpa retak. Sangat cocok untuk pastri premium, es krim artisan, dan infus kuliner mewah.'}
                </p>

                <div className="space-y-2 border-t border-stone-800 pt-4 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Length</span>
                    <span className="text-stone-200">16 cm - 22 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Moisture</span>
                    <span className="text-stone-200">30% - 35%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Vanillin Content</span>
                    <span className="text-stone-200">1.8% - 2.4% (Typical)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Appearance</span>
                    <span className="text-stone-200">Plump, oily sheen, no splits</span>
                  </div>
                </div>
              </div>

              <a
                href={getWaAltaraLink()}
                target="_blank"
                rel="noreferrer"
                className="mt-8 w-full py-3.5 bg-amber-400 text-stone-950 text-xs uppercase tracking-widest font-bold text-center hover:bg-amber-300 transition-colors"
              >
                {lang === 'EN' ? 'Request Grade A Sample' : 'Minta Sampel Grade A'}
              </a>
            </div>

            {/* Grade B Extraction */}
            <div className="bg-stone-950 border border-stone-800 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
                      Industrial Extraction
                    </span>
                    <h3 className="font-serif text-2xl text-white font-bold">
                      Extraction Grade B
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-stone-800 text-stone-300 text-xs font-mono">
                    MOQ: 25 kg
                  </span>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed mb-6">
                  {lang === 'EN'
                    ? 'Dryer profile designed specifically for maximum percolation efficiency, vanilla extract manufacturing, baking concentrates, and industrial flavor blending.'
                    : 'Kadar air lebih rendah untuk efisiensi perkolasi ekstraksi alkohol atau pelarut rasa makanan dan konsentrat roti.'}
                </p>

                <div className="space-y-2 border-t border-stone-800 pt-4 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Length</span>
                    <span className="text-stone-200">13 cm - 17 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Moisture</span>
                    <span className="text-stone-200">20% - 25%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Vanillin Content</span>
                    <span className="text-stone-200">2.0% - 2.6%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-500">Packaging</span>
                    <span className="text-stone-200">1kg - 5kg vacuum packs in carton</span>
                  </div>
                </div>
              </div>

              <a
                href={getWaAltaraLink()}
                target="_blank"
                rel="noreferrer"
                className="mt-8 w-full py-3.5 border border-stone-700 text-stone-200 hover:text-white hover:border-amber-400 text-xs uppercase tracking-widest font-semibold text-center transition-colors"
              >
                {lang === 'EN' ? 'Request Bulk Quotation' : 'Minta Penawaran Partai Besar'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQS */}
      <section className="py-24 bg-stone-950 border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-bold block mb-2">
              International Trade Information
            </span>
            <h2 className="text-3xl font-serif text-white">
              {lang === 'EN' ? 'Frequently Asked Questions' : 'Tanya Jawab Ekspor'}
            </h2>
          </div>

          <div className="space-y-4">
            {altaraFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-stone-800 bg-stone-900 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-base text-stone-200 font-semibold"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-stone-500 transition-transform ${
                        isOpen ? 'rotate-90 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-400 leading-relaxed border-t border-stone-800 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. B2B INQUIRY & SAMPLE REQUEST */}
      <section id="project-visit-form" className="py-24 bg-[#0a0f0d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-semibold block">
                {lang === 'EN' ? 'Global Export Desk' : 'Layanan Kemitraan Ekspor'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                {lang === 'EN'
                  ? 'Connect with Our Export Specialists'
                  : 'Konsultasikan Kebutuhan Pasokan Anda'}
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed">
                {lang === 'EN'
                  ? 'We support air courier sample dispatch (DHL/FedEx) worldwide and containerized sea freight with complete customs documentation.'
                  : 'Kami mendukung pengiriman sampel internasional via kurir ekspres serta pengiriman laut/udara partai besar lengkap dengan sertifikat fitosanitari.'}
              </p>
              <div className="p-4 bg-stone-900 border border-stone-800 text-xs text-stone-300">
                <span className="font-semibold block mb-1 text-amber-300">
                  Direct Contact Desk:
                </span>
                WhatsApp: +{settings.altaraWhatsApp} • Email: export@ziaproperti.co.id
              </div>
            </div>

            <div className="lg:col-span-7">
              <LeadCaptureForm
                projectSlug="altara-zia-international"
                projectName="Altara ZIA International (Vanilla Export)"
                propertyOptions={[
                  'Gourmet Grade A (Sample Pack 1kg)',
                  'Gourmet Grade A (Commercial Lot 5kg - 50kg)',
                  'Extraction Grade B (Bulk Industrial 25kg+)',
                  'Custom Specification / Contract Farming Inquiry'
                ]}
                title={lang === 'EN' ? 'Request Quotation & Sample' : 'Formulir Permintaan Sampel & Penawaran'}
                subtitle={
                  lang === 'EN'
                    ? 'Please specify your company name, country destination, and intended volume requirements.'
                    : 'Sampaikan profil perusahaan dan estimasi volume kebutuhan vanilla bean Anda.'
                }
                buttonColorClass="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold"
                ctaLabel={project?.ctaLabel}
                visitOfferLabel={project?.visitOfferLabel}
                visitOfferOptions={project?.visitOfferOptions}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

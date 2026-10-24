import React, { useState } from 'react';
import {
  MapPin,
  Check,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Phone,
  MessageSquare,
  Building
} from 'lucide-react';
import { ProjectEntity, PropertyItem, FAQItem, TestimonialItem, CompanySettings } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';

interface DynamicProjectProps {
  project: ProjectEntity;
  properties: PropertyItem[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}

export const DynamicProjectPage: React.FC<DynamicProjectProps> = ({
  project,
  properties,
  faqs,
  testimonials,
  settings,
  onNavigate
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    properties[0] || null
  );
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const projectFaqs = faqs.filter(
    (f) => f.projectSlug === project.slug || f.projectSlug === 'zia-emerald'
  );
  const projectProps = properties.filter((p) => p.projectSlug === project.slug);

  const getWaLink = () => {
    const rawNumber = project.contactWhatsApp || settings.contactWhatsApp || settings.corporateWhatsApp || '6281288889911';
    const cleanNumber = cleanWhatsAppNumber(rawNumber, '6281288889911');
    const msg = `Halo Tim PT ZIA Properti Indonesia, saya tertarik dengan informasi proyek ${project.name}. Mohon informasi ketersediaan unit dan jadwal survei.`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* 1. HERO */}
      <section className="relative min-h-[85vh] flex items-center bg-stone-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={project.heroImage}
            alt={project.name}
            className="w-full h-full object-cover opacity-35 filter saturate-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-stone-700 bg-stone-900/80 text-amber-300 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {project.category} • {project.location}
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-6">
              {project.name}
              {project.tagline && (
                <span className="block text-xl sm:text-2xl font-light text-stone-300 font-serif italic mt-3">
                  {project.tagline}
                </span>
              )}
            </h1>

            <p className="text-base text-stone-300 font-light leading-relaxed mb-8 max-w-xl">
              {project.shortDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {projectProps.length > 0 && (
                <a
                  href="#properties"
                  className="px-8 py-4 bg-stone-100 text-stone-900 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all text-center"
                >
                  Pilihan Unit Properti
                </a>
              )}

              <a
                href={getWaLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-stone-500 text-stone-200 hover:text-white hover:border-white text-xs uppercase tracking-[0.2em] font-semibold transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                WhatsApp Representatif
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-stone-800 mt-12 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Status Proyek</span>
                <span className="font-serif text-base text-amber-200">{project.status}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Lokasi</span>
                <span className="font-serif text-base text-white">{project.location}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Pengembang</span>
                <span className="font-serif text-base text-white">PT ZIA Properti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONCEPT & OVERVIEW */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-bold block">
                Konsep & Nilai Utama
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight">
                {project.name}: Komitmen Kualitas & Nilai Jangka Panjang
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                {project.longDescription}
              </p>
              <div className="space-y-3 pt-2">
                {[
                  'Pengembangan terencana dengan standar arsitektur teruji',
                  'Integritas kepemilikan dan perizinan resmi terverifikasi',
                  'Fasilitas lingkungan asri dengan aksesibilitas terencana',
                  'Dukungan penuh tim representatif PT ZIA Properti Indonesia'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-stone-700">
                    <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-stone-200 p-2 bg-stone-50 shadow-md">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROPERTY UNITS (IF ANY EXIST FOR THIS PROJECT) */}
      {projectProps.length > 0 && (
        <section id="properties" className="py-24 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-2">
                Pilihan Unit
              </span>
              <h2 className="text-3xl font-serif text-stone-900 mb-4">
                Katalog Properti {project.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projectProps.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white border border-stone-200 flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div>
                    <div className="h-52 overflow-hidden relative">
                      <img src={prop.mainImage} alt={prop.name} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold uppercase bg-stone-900 text-white">
                        {prop.status}
                      </span>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono block mb-1">
                        {prop.type}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{prop.name}</h3>
                      <p className="text-xs text-stone-600 line-clamp-3 mb-4">{prop.description}</p>
                      <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-700 flex justify-between">
                        <span>Luas Tanah / Bangunan</span>
                        <span className="font-bold">{prop.landArea}m² / {prop.buildingArea}m²</span>
                      </div>
                      <div className="mt-3 text-base font-serif font-bold text-stone-900">
                        {prop.priceFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <a
                      href={getWaLink()}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                    >
                      Konsultasi Unit Ini
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. FAQS */}
      {projectFaqs.length > 0 && (
        <section className="py-24 bg-white border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-2">
                Tanya Jawab
              </span>
              <h2 className="text-3xl font-serif text-stone-900">
                Informasi & Pertanyaan Umum Seputar {project.name}
              </h2>
            </div>

            <div className="space-y-4">
              {projectFaqs.map((faq) => {
                const isOpen = activeFaq === faq.id;
                return (
                  <div key={faq.id} className="border border-stone-200 bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between font-serif text-base text-stone-900 font-semibold"
                    >
                      <span>{faq.question}</span>
                      <ChevronRight
                        className={`w-4 h-4 text-stone-400 transition-transform ${
                          isOpen ? 'rotate-90 text-stone-900' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-200 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. INQUIRY FORM */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-300 font-semibold block">
                Konsultasi & Reservasi
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Hubungi Representatif {project.name}
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Dapatkan informasi lengkap brosur, denah, spesifikasi, dan jadwal survei lokasi bersama tim konsultan PT ZIA Properti Indonesia.
              </p>
            </div>

            <div className="lg:col-span-7">
              <LeadCaptureForm
                projectSlug={project.slug}
                projectName={project.name}
                propertyOptions={projectProps.map((p) => p.name)}
                title={`Formulir Informasi ${project.name}`}
                subtitle="Isi formulir kontak untuk menerima jadwal survei dan katalog resmi."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

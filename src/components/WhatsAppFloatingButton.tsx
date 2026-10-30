import React, { useState, useEffect } from 'react';
import { CompanySettings, ProjectEntity } from '../types';
import { MessageSquare, X, Send, Sparkles, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

import { cleanWhatsAppNumber, formatIndonesianPhone, getProjectContact } from '../lib/contactUtils';

interface WhatsAppFloatingButtonProps {
  settings: CompanySettings;
  currentRoute: string;
  projects?: ProjectEntity[];
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  settings,
  currentRoute,
  projects = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Extract active project slug from route if present
  const currentSlug = (() => {
    if (currentRoute === '/projects/zia-emerald') return 'zia-emerald';
    if (currentRoute === '/projects/kav-hillside') return 'kav-hillside';
    if (currentRoute === '/projects/zia-farm') return 'zia-farm';
    if (currentRoute === '/projects/altara-zia-international') return 'altara-zia-international';
    if (currentRoute.startsWith('/projects/')) return currentRoute.replace('/projects/', '');
    return undefined;
  })();

  // Dynamically obtain contact configuration based on settings and active page
  const contactInfo = getProjectContact(settings, currentSlug);

  // Find if current route is a specific project from dataset
  const currentProject = projects.find((p) => currentRoute === `/projects/${p.slug}`);

  // Construct contextual pre-filled message for sales
  const getContextualMessage = () => {
    if (currentProject && currentProject.slug !== 'zia-emerald' && currentProject.slug !== 'kav-hillside' && currentProject.slug !== 'zia-farm' && currentProject.slug !== 'altara-zia-international') {
      return `Halo Tim Sales PT ZIA Properti Indonesia, saya sedang melihat proyek "${currentProject.name}" di website dan ingin berkonsultasi mengenai ketersediaan unit, simulasi pembayaran, serta jadwal survei lokasi.`;
    }
    if (currentRoute === '/projects/zia-emerald') {
      return `Halo Tim Sales ZIA Emerald (PT ZIA Properti Indonesia), saya tertarik dengan hunian American Classic di Tarumajaya Bekasi dan ingin menanyakan tipe unit, ketersediaan, serta promo booking fee.`;
    }
    if (currentRoute === '/projects/kav-hillside') {
      return `Halo Tim Sales Kav Hillside (PT ZIA Properti Indonesia), saya tertarik dengan kavling tanah siap bangun dan ingin informasi site plan, ukuran luas, serta skema pembayaran tunai/bertahap.`;
    }
    if (currentRoute === '/projects/zia-farm') {
      return `Halo Tim ZIA Farm (PT ZIA Properti Indonesia), saya ingin informasi pemesanan ternak qurban/aqiqah dan program kemitraan peternakan terpadu.`;
    }
    if (currentRoute === '/projects/altara-zia-international') {
      return `Halo Tim Altara ZIA International, saya ingin berkonsultasi mengenai ekspor komoditas vanilla beans Indonesia grade gourmet & extraction untuk kebutuhan B2B.`;
    }
    if (currentRoute === '/projects' || currentRoute === '/properties') {
      return `Halo Tim Sales PT ZIA Properti Indonesia, saya sedang meninjau katalog portofolio proyek dan ingin mendapatkan rekomendasi properti yang sesuai dengan kebutuhan saya.`;
    }
    if (currentRoute === '/business/zia-raya') {
      return `Halo Tim ZIA Raya, saya ingin informasi mengenai koleksi retail, apparel, lifestyle, dan perdagangan.`;
    }
    if (currentRoute === '/business/zia-direct') {
      return `Halo Tim ZIA Direct, saya ingin informasi mengenai perlengkapan rumah tangga dan program kemitraan.`;
    }
    if (currentRoute === '/contact') {
      return `Halo Tim Sales PT ZIA Properti Indonesia, saya ingin menjadwalkan kunjungan lokasi (site visit) dan berkonsultasi langsung dengan sales representative resmi.`;
    }
    if (currentRoute === '/about') {
      return `Halo Tim PT ZIA Properti Indonesia, saya membaca profil korporat dan ingin informasi lebih lanjut mengenai peluang investasi serta portofolio pengembangan properti Anda.`;
    }
    if (currentRoute.startsWith('/blog') || currentRoute.startsWith('/news')) {
      return `Halo Tim Sales PT ZIA Properti Indonesia, saya membaca artikel di website dan ingin berkonsultasi lebih lanjut mengenai panduan properti dan informasi terkini.`;
    }
    return `Halo Tim Sales PT ZIA Properti Indonesia, saya sedang mengunjungi website resmi ziaproperti.co.id dan ingin berkonsultasi langsung mengenai produk hunian, kavling, atau investasi.`;
  };

  const messageText = getContextualMessage();
  const whatsappUrl = `https://wa.me/${contactInfo.cleanNumber}?text=${encodeURIComponent(messageText)}`;
  const formattedPhone = contactInfo.displayFormatted;

  const handleOpenDirectly = (e: React.MouseEvent) => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    setHasInteracted(true);
  };

  return (
    <aside
      aria-label="Layanan WhatsApp Tim Sales PT ZIA Properti Indonesia"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none"
    >
      {/* Expandable Chat Card / Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="wa-dialog-title"
          className="pointer-events-auto w-[calc(100vw-2.5rem)] max-w-sm mb-3.5 bg-stone-950 text-white border border-stone-800 shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-stone-950 p-4 border-b border-stone-800 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </div>
                {/* Active online pulse dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-stone-950 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 id="wa-dialog-title" className="font-serif text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  {contactInfo.channelName}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Respon Cepat</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 hover:bg-stone-800 transition-colors"
              aria-label="Tutup jendela chat WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body with Context-aware Message */}
          <div className="p-4 space-y-3 bg-stone-900/60 backdrop-blur-xs text-xs">
            <div className="bg-stone-900 border border-stone-800/80 p-3 rounded-xs space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  Konsultasi Langsung
                </span>
                <span className="font-mono text-stone-500">{formattedPhone}</span>
              </div>
              <p className="text-stone-300 text-xs leading-relaxed font-light">
                Selamat datang! Tim representatif resmi kami siap memberikan brosur digital, estimasi harga, simulasi KPR, dan penjadwalan survei lokasi.
              </p>
            </div>

            {/* Context Notice */}
            <div className="bg-stone-950/70 p-2.5 border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                Pesan Pembuka Otomatis:
              </span>
              <p className="italic text-stone-300 line-clamp-3">
                "{messageText}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>Rata-rata balas &lt; 15 menit</span>
              </span>
              <span className="flex items-center gap-1 text-stone-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Hotline Resmi</span>
              </span>
            </div>

            {/* CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all duration-200 active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Mulai Chat via WhatsApp</span>
              <Send className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button Row */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Desktop pill teaser tooltip */}
        {!isOpen && (
          <div
            onClick={togglePopup}
            className="hidden sm:flex items-center gap-2 py-2 px-3.5 bg-stone-900/95 text-stone-200 border border-stone-700/80 shadow-xl backdrop-blur-md cursor-pointer hover:bg-stone-800 transition-all duration-200 group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-medium tracking-wide">
              Chat Sales Representative
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pl-1 border-l border-stone-700">
              Online
            </span>
          </div>
        )}

        {/* Primary Round WhatsApp Floating Button */}
        <div className="relative group">
          {/* Subtle outer ping animation ring */}
          <span
            className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse blur-xs group-hover:bg-emerald-500/40 transition-colors pointer-events-none"
            aria-hidden="true"
          />

          <button
            onClick={togglePopup}
            onDoubleClick={handleOpenDirectly}
            aria-label="Hubungi Tim Sales PT ZIA Properti Indonesia via WhatsApp"
            aria-expanded={isOpen}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
          >
            {isOpen ? (
              <X className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <WhatsAppIcon className="w-8 h-8 fill-current drop-shadow-sm" />
            )}

            {/* Notification badge when not open */}
            {!isOpen && !hasInteracted && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
                  1
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

// Official WhatsApp Vector Logo
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.09 19.14L7.74 18.94L4.62 19.76L5.45 16.72L5.23 16.37C4.49 15.01 4.1 13.48 4.1 11.91C4.1 7.37 7.8 3.67 12.05 3.67ZM8.73 7.3C8.54 7.3 8.24 7.37 7.98 7.65C7.73 7.93 7 8.61 7 10C7 11.39 8.01 12.73 8.16 12.92C8.3 13.11 10.15 15.96 12.98 17.18C13.65 17.47 14.18 17.65 14.59 17.78C15.26 18 15.87 17.97 16.36 17.9C16.9 17.82 18.02 17.22 18.25 16.57C18.48 15.92 18.48 15.37 18.41 15.25C18.34 15.13 18.15 15.06 17.87 14.92C17.59 14.78 16.24 14.11 15.99 14.02C15.74 13.93 15.55 13.88 15.37 14.16C15.18 14.44 14.65 15.06 14.49 15.25C14.33 15.43 14.17 15.45 13.89 15.31C13.61 15.17 12.72 14.88 11.66 13.93C10.84 13.2 10.28 12.29 10.12 12.01C9.96 11.73 10.1 11.58 10.24 11.44C10.37 11.31 10.53 11.1 10.67 10.94C10.81 10.78 10.86 10.66 10.95 10.48C11.04 10.29 11 10.13 10.93 10C10.86 9.86 10.3 8.49 10.07 7.93C9.84 7.39 9.61 7.46 9.44 7.45C9.28 7.45 9.09 7.3 8.73 7.3Z" />
  </svg>
);

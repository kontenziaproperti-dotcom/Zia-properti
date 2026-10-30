import React, { useState } from 'react';
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  ChevronDown,
  Building2,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Mail,
  ArrowRight,
  Lock
} from 'lucide-react';
import { CompanySettings } from '../types';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';

export { cleanWhatsAppNumber, formatIndonesianPhone };

interface HeaderProps {
  settings: CompanySettings;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const CorporateHeader: React.FC<HeaderProps> = ({
  settings,
  currentRoute,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const navLinks: { label: string; route?: string; isDropdown?: boolean }[] = [
    { label: 'Beranda', route: '/' },
    { label: 'Tentang Kami', route: '/about' },
    { label: 'Proyek & Ekosistem', isDropdown: true },
    { label: 'Katalog Portofolio', route: '/projects' },
    { label: 'Berita & Wawasan', route: '/blog' },
    { label: 'Hubungi Kami', route: '/contact' }
  ];

  const projects = [
    {
      name: 'ZIA Emerald',
      type: 'Residensial American Classic',
      route: '/projects/zia-emerald',
      badge: 'Tarumajaya, Bekasi'
    },
    {
      name: 'Kav Hillside',
      type: 'Kavling Siap Bangun Eksklusif',
      route: '/projects/kav-hillside',
      badge: 'Investasi Tanah'
    },
    {
      name: 'ZIA Farm',
      type: 'Peternakan & Agrikultur Terpadu',
      route: '/projects/zia-farm',
      badge: 'Agribisnis Modern'
    },
    {
      name: 'Altara ZIA International',
      type: 'Eksportir Vanilla Indonesia',
      route: '/projects/altara-zia-international',
      badge: 'Global B2B Market'
    },
    {
      name: 'ZIA Raya',
      type: 'Retail & Perdagangan',
      route: '/business/zia-raya',
      badge: 'Lifestyle & Trade'
    },
    {
      name: 'ZIA Direct',
      type: 'Penjualan Langsung & Kemitraan',
      route: '/business/zia-direct',
      badge: 'Direct Selling'
    }
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setProjectDropdownOpen(false);
  };

  const getWaLink = () => {
    const rawNumber = settings.contactWhatsApp || settings.corporateWhatsApp;
    const cleanNumber = cleanWhatsAppNumber(rawNumber);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      'Halo Tim PT ZIA Properti Indonesia, saya ingin berkonsultasi mengenai proyek dan ekosistem bisnis ZIA.'
    )}`;
  };

  return (
    <>
      {/* Top utility announcement bar */}
      <header className="se-header sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all duration-300">
        <div className="se-header__container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="se-header__row flex items-center justify-between h-20">
            {/* Corporate Brand Identity */}
            <div
              onClick={() => handleNavClick('/')}
              className="se-header__brand cursor-pointer group flex items-center gap-3.5"
            >
              <div className="se-header__brand-mark w-10 h-10 bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-xl tracking-wider font-semibold border border-stone-800 shadow-sm group-hover:bg-stone-800 transition-colors">
                Z
              </div>
              <div className="flex flex-col">
                <span className="se-header__brand-title font-serif text-lg tracking-wider font-bold text-stone-900 leading-tight group-hover:text-stone-700 transition-colors uppercase">
                  PT ZIA Properti Indonesia
                </span>
                <span className="se-header__brand-subtitle text-[10px] uppercase tracking-[0.25em] text-stone-500 font-medium">
                  Pengembang Properti & Ekosistem Bisnis
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="se-nav hidden lg:flex items-center space-x-7" aria-label="Navigasi utama">
              {navLinks.map((item, idx) => {
                if (item.isDropdown) {
                  return (
                    <div
                      key={idx}
                      className="relative"
                      onMouseEnter={() => setProjectDropdownOpen(true)}
                      onMouseLeave={() => setProjectDropdownOpen(false)}
                    >
                      <button
                        aria-expanded={projectDropdownOpen}
                        aria-haspopup="true"
                        onClick={() => setProjectDropdownOpen((open) => !open)}
                        className={`flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium py-2 transition-colors ${
                          (currentRoute.startsWith('/projects/') || currentRoute.startsWith('/business/'))
                            ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {/* Dropdown panel */}
                      {projectDropdownOpen && (
                        <div className="se-nav-dropdown absolute top-full left-0 w-80 bg-white border border-stone-200 shadow-xl py-2 animate-fadeIn z-50">
                          <div className="se-nav-dropdown__heading px-4 py-2 border-b border-stone-100 bg-stone-50">
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-500">
                              Unit Usaha & Proyek Mandiri
                            </span>
                          </div>
                          {projects.map((proj) => (
                            <div
                              key={proj.route}
                              onClick={() => handleNavClick(proj.route)}
                              className="se-nav-dropdown__item px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-none transition-colors"
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-serif text-sm font-semibold text-stone-900">
                                  {proj.name}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 font-medium">
                                  {proj.badge}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 font-sans">
                                {proj.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.route || idx}
                    onClick={() => item.route && handleNavClick(item.route)}
                    className={`text-xs uppercase tracking-widest font-medium py-2 transition-colors ${
                      currentRoute === item.route
                        ? 'text-stone-900 font-bold border-b-2 border-stone-900'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href={getWaLink()}
                target="_blank"
                rel="noreferrer"
                className="se-button se-button--outline se-header__contact inline-flex items-center gap-2 border border-stone-300 text-stone-800 px-4 py-2.5 text-xs uppercase tracking-widest hover:border-stone-900 hover:bg-stone-50 transition-all font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Konsultasi WhatsApp
              </a>

              <button
                onClick={() => handleNavClick('/admin')}
                title="Akses CMS Internal"
                className="se-header__cms p-2.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-none transition-colors"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={getWaLink()}
                target="_blank"
                rel="noreferrer"
                className="se-mobile-icon-button p-2 text-stone-800 bg-stone-100 rounded-none"
                title="WhatsApp ZIA"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <button
                type="button"
                aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                aria-expanded={mobileMenuOpen}
                aria-controls="se-mobile-navigation"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="se-mobile-icon-button p-2 text-stone-800 hover:bg-stone-100 rounded-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="se-mobile-navigation" className="se-mobile-drawer lg:hidden bg-stone-900 text-stone-100 px-6 py-8 border-b border-stone-800 animate-fadeIn">
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleNavClick('/')}
                className="se-mobile-link block text-left w-full text-sm uppercase tracking-widest text-stone-300 py-1"
              >
                Beranda
              </button>
              <button
                onClick={() => handleNavClick('/about')}
                className="se-mobile-link block text-left w-full text-sm uppercase tracking-widest text-stone-300 py-1"
              >
                Tentang ZIA
              </button>
              <button
                onClick={() => handleNavClick('/projects')}
                className="se-mobile-link block text-left w-full text-sm uppercase tracking-widest text-stone-300 py-1"
              >
                Semua Proyek & Portofolio
              </button>
              <div className="pl-4 border-l border-stone-800 space-y-3 py-2">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block">
                  Proyek Spesifik:
                </span>
                {projects.map((proj) => (
                  <button
                    key={proj.route}
                    onClick={() => handleNavClick(proj.route)}
                    className="se-mobile-link block text-left w-full text-xs text-stone-400 hover:text-white"
                  >
                    • {proj.name} ({proj.type})
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleNavClick('/blog')}
                className="se-mobile-link block text-left w-full text-sm uppercase tracking-widest text-stone-300 py-1"
              >
                Wawasan & Publikasi
              </button>
              <button
                onClick={() => handleNavClick('/contact')}
                className="se-mobile-link block text-left w-full text-sm uppercase tracking-widest text-stone-300 py-1"
              >
                Kontak Representatif
              </button>
              <button
                onClick={() => handleNavClick('/admin')}
                className="se-mobile-link block text-left w-full text-xs uppercase tracking-widest text-amber-400 py-2 border-t border-stone-800"
              >
                Akses CMS Internal PT ZIA
              </button>
            </div>

            <div className="pt-4 border-t border-stone-800 flex flex-col gap-3">
              <a
                href={getWaLink()}
                target="_blank"
                rel="noreferrer"
                className="se-button se-button--light w-full py-3 bg-white text-stone-900 text-center text-xs uppercase tracking-widest font-semibold"
              >
                Hubungi via WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Floating Mobile Direct Action Bar (Bottom) */}
      <div className="se-mobile-actionbar fixed bottom-0 inset-x-0 bg-stone-900 border-t border-stone-800 text-white py-3 px-4 z-40 lg:hidden flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-stone-400">
            PT ZIA Properti Indonesia
          </span>
          <span className="text-xs font-serif font-medium text-stone-200">
            Konsultasi & Kunjungan Lokasi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${settings.phone}`}
            className="se-button--phone px-3 py-2 bg-stone-800 text-stone-200 text-xs uppercase tracking-wider flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            Telepon
          </a>
          <a
            href={getWaLink()}
            target="_blank"
            rel="noreferrer"
            className="se-button--whatsapp px-3.5 py-2 bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};

export const CorporateFooter: React.FC<{
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}> = ({ settings, onNavigate }) => {
  return (
    <footer className="se-footer bg-stone-950 text-stone-400 border-t border-stone-800 pt-16 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Corporate Profile Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="se-footer__brand-mark w-9 h-9 bg-white text-stone-950 flex items-center justify-center font-serif text-lg font-bold">
                Z
              </div>
              <span className="font-serif text-xl tracking-wider text-white font-bold">
                {settings.companyName}
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
              {settings.tagline}
            </p>
            <p className="text-sm leading-relaxed text-stone-400 max-w-sm pt-2">
              Pengembang properti berwawasan jangka panjang yang berakar di Kabupaten Bekasi, Jawa Barat. Menghadirkan kawasan residensial berkualitas prima, kavling bernilai apresiasi tinggi, serta ekosistem agrikultur dan ekspor terpadu.
            </p>

            <div className="pt-4 space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>{settings.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{settings.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{settings.phone}</span>
              </p>
            </div>
          </div>

          {/* Project & Ecosystem Links */}
          <div>
            <h4 className="font-serif text-sm text-stone-200 uppercase tracking-widest mb-4">
              Ekosistem Proyek
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/projects/zia-emerald')}
                  className="hover:text-white transition-colors"
                >
                  ZIA Emerald (Residensial)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/projects/kav-hillside')}
                  className="hover:text-white transition-colors"
                >
                  Kav Hillside (Kavling)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/projects/zia-farm')}
                  className="hover:text-white transition-colors"
                >
                  ZIA Farm (Peternakan)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/projects/altara-zia-international')}
                  className="hover:text-white transition-colors"
                >
                  Altara ZIA International (Ekspor)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/business/zia-raya')} className="hover:text-white transition-colors">
                  ZIA Raya (Retail & Perdagangan)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/business/zia-direct')} className="hover:text-white transition-colors">
                  ZIA Direct (Direct Selling)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/projects')}
                  className="hover:text-white text-stone-500 transition-colors pt-2 block"
                >
                  Lihat Seluruh Direktori →
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Links */}
          <div>
            <h4 className="font-serif text-sm text-stone-200 uppercase tracking-widest mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  Profil & Visi Misi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-white transition-colors">
                  Wawasan & Berita Resmi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/careers')} className="hover:text-white transition-colors">
                  Karir & Kemitraan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Kontak Representatif
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 pt-2">
                  <Lock className="w-3 h-3" />
                  CMS Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Line */}
          <div>
            <h4 className="font-serif text-sm text-stone-200 uppercase tracking-widest mb-4">
              Layanan WhatsApp
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber(settings.emeraldWhatsApp, '6281288889922')}?text=${encodeURIComponent('Halo Tim Sales ZIA Emerald, saya ingin informasi mengenai hunian American Classic.')}`}
                target="_blank"
                rel="noreferrer"
                className="se-footer__service block p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Residensial</div>
                <div className="text-stone-300 font-medium">WhatsApp ZIA Emerald</div>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsAppNumber(settings.kavWhatsApp, '6281288889933')}?text=${encodeURIComponent('Halo Tim Kav Hillside, saya ingin informasi mengenai kavling hunian siap bangun.')}`}
                target="_blank"
                rel="noreferrer"
                className="se-footer__service block p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <div className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Kavling Tanah</div>
                <div className="text-stone-300 font-medium">WhatsApp Kav Hillside</div>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsAppNumber(settings.farmWhatsApp, '6281288889944')}?text=${encodeURIComponent('Halo Tim ZIA Farm, saya ingin informasi mengenai hewan ternak qurban dan agribisnis.')}`}
                target="_blank"
                rel="noreferrer"
                className="se-footer__service block p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <div className="text-[10px] text-amber-500 uppercase tracking-wider font-semibold">Peternakan Terpadu</div>
                <div className="text-stone-300 font-medium">WhatsApp ZIA Farm</div>
              </a>
              <a
                href={`https://wa.me/${cleanWhatsAppNumber(settings.altaraWhatsApp, '6281288889955')}?text=${encodeURIComponent('Hello Altara ZIA International, I would like to inquire about premium Indonesian vanilla beans export.')}`}
                target="_blank"
                rel="noreferrer"
                className="se-footer__service block p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors"
              >
                <div className="text-[10px] text-amber-200 uppercase tracking-wider font-semibold">Vanilla Export Desk</div>
                <div className="text-stone-300 font-medium">WhatsApp Altara B2B</div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="se-footer__bottom border-t border-stone-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-600 gap-4">
          <p>© {new Date().getFullYear()} PT ZIA Properti Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-stone-400 transition-colors">
              Kebijakan Privasi
            </button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-stone-400 transition-colors">
              Syarat & Ketentuan
            </button>
            <span>Kabupaten Bekasi, Jawa Barat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

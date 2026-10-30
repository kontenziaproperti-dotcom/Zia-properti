import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CorporateHeader, CorporateFooter } from './components/CorporateLayout';
import { SEOHead } from './components/SEOHead';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { X } from 'lucide-react';

// Public and internal routes are split into on-demand chunks to keep the
// first corporate page load smaller and defer the CMS/maps until requested.
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ZiaEmeraldPage = lazy(() => import('./pages/ZiaEmeraldPage').then((m) => ({ default: m.ZiaEmeraldPage })));
const KavHillsidePage = lazy(() => import('./pages/KavHillsidePage').then((m) => ({ default: m.KavHillsidePage })));
const ZiaFarmPage = lazy(() => import('./pages/ZiaFarmPage').then((m) => ({ default: m.ZiaFarmPage })));
const AltaraZiaPage = lazy(() => import('./pages/AltaraZiaPage').then((m) => ({ default: m.AltaraZiaPage })));
const DynamicProjectPage = lazy(() => import('./pages/DynamicProjectPage').then((m) => ({ default: m.DynamicProjectPage })));
const DynamicCMSPage = lazy(() => import('./pages/DynamicCMSPage').then((m) => ({ default: m.DynamicCMSPage })));
const ProjectDirectoryPage = lazy(() => import('./features/corporate-refresh/pages/ProjectDirectoryPage').then((m) => ({ default: m.ProjectDirectoryPage })));
const AboutPage = lazy(() => import('./features/corporate-refresh/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./features/corporate-refresh/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./features/corporate-refresh/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BusinessUnitPage = lazy(() => import('./features/corporate-refresh/pages/BusinessUnitPage').then((m) => ({ default: m.BusinessUnitPage })));
const LegalPages = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.LegalPages })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
import {
  initializeDatabaseIfEmpty,
  getCompanySettings,
  getProjects,
  getProperties,
  getKavlingPlots,
  getPosts,
  getFAQs,
  getTestimonials,
  getPages,
  getSections,
  getPromotions,
  getNavigation
} from './services/dataService';
import {
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_PROPERTIES,
  INITIAL_PLOTS,
  INITIAL_POSTS,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_PAGES,
  INITIAL_SECTIONS,
  INITIAL_PROMOTIONS,
  INITIAL_NAVIGATION
} from './data/initialData';
import {
  CompanySettings,
  ProjectEntity,
  PropertyItem,
  KavlingPlot,
  PostItem,
  FAQItem,
  TestimonialItem,
  PageItem,
  SectionItem,
  PromotionItem,
  NavigationItem
} from './types';

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    return window.location.pathname === '/' ? '/' : window.location.pathname;
  });

  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [projects, setProjects] = useState<ProjectEntity[]>(INITIAL_PROJECTS);
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);
  const [plots, setPlots] = useState<KavlingPlot[]>(INITIAL_PLOTS);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [pages, setPages] = useState<PageItem[]>(INITIAL_PAGES);
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [promotions, setPromotions] = useState<PromotionItem[]>(INITIAL_PROMOTIONS);
  const [navigation, setNavigation] = useState<NavigationItem[]>(INITIAL_NAVIGATION);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Initialize and load live data from Firestore
  useEffect(() => {
    const init = async () => {
      await initializeDatabaseIfEmpty();
      try {
        const [stgs, pjs, props, pls, pts, fqs, tsts, pgs, secs, prms, navs] = await Promise.all([
          getCompanySettings(),
          getProjects(),
          getProperties(),
          getKavlingPlots(),
          getPosts(),
          getFAQs(),
          getTestimonials(),
          getPages(),
          getSections(),
          getPromotions(),
          getNavigation()
        ]);
        if (stgs) setSettings(stgs);
        if (pjs.length) setProjects(pjs);
        if (props.length) setProperties(props);
        if (pls.length) setPlots(pls);
        if (pts.length) setPosts(pts);
        if (fqs.length) setFaqs(fqs);
        if (tsts.length) setTestimonials(tsts);
        if (pgs.length) setPages(pgs);
        if (secs.length) setSections(secs);
        if (prms.length) setPromotions(prms);
        if (navs.length) setNavigation(navs);
      } catch (e) {
        console.warn('Init error, utilizing initial robust datasets', e);
      }
    };
    init();
  }, []);

  // Handle client-side routing & history
  const navigateTo = (newRoute: string) => {
    setRoute(newRoute);
    window.history.pushState({}, '', newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Admin CMS layout
  if (route.startsWith('/admin')) {
    return (
      <AuthProvider>
        <Suspense fallback={<div className="se-route-loading" role="status">Memuat panel administrasi...</div>}>
        <AdminDashboard onNavigatePublic={navigateTo} />
      </Suspense>
      </AuthProvider>
    );
  }

  // Determine SEO metadata based on active route
  const getSeoData = () => {
    if (route === '/') {
      return {
        title: 'ZIA Corporate | Enam Lini Bisnis dalam Satu Ekosistem',
        description: 'Jelajahi enam lini bisnis ZIA Corporate: properti, peternakan, agribisnis ekspor, retail, perdagangan, dan direct selling.',
        project: null
      };
    }
    if (route === '/projects/zia-emerald') {
      const p = projects.find(item => item.slug === 'zia-emerald');
      return {
        title: 'ZIA Emerald | Perumahan American Classic Tarumajaya Bekasi',
        description: p?.shortDescription || 'Hunian American Classic berplafon tinggi di Tarumajaya, Kabupaten Bekasi oleh PT ZIA Properti Indonesia.',
        project: p || null
      };
    }
    if (route === '/projects/kav-hillside') {
      const p = projects.find(item => item.slug === 'kav-hillside');
      return {
        title: 'Kav Hillside | Kavling Siap Bangun Eksklusif Kabupaten Bekasi',
        description: p?.shortDescription || 'Kavling matang siap bangun dengan infrastruktur tertata dan legalitas terjamin di Kabupaten Bekasi.',
        project: p || null
      };
    }
    if (route === '/projects/zia-farm') {
      const p = projects.find(item => item.slug === 'zia-farm');
      return {
        title: 'ZIA Farm | Peternakan Domba Modern & Higienis Bekasi',
        description: p?.shortDescription || 'Sentra peternakan domba modern, qurban premium, dan aqiqah higienis Kabupaten Bekasi.',
        project: p || null
      };
    }
    if (route === '/projects/altara-zia-international') {
      const p = projects.find(item => item.slug === 'altara-zia-international');
      return {
        title: 'Altara ZIA International | Eksportir Vanilla Gourmet Indonesia',
        description: p?.shortDescription || 'Pemasok dan eksportir vanilla beans premium Indonesia berstandar mutu internasional.',
        project: p || null
      };
    }
    if (route.startsWith('/projects/')) {
      const slug = route.replace('/projects/', '');
      const p = projects.find(item => item.slug === slug);
      if (p) {
        return {
          title: `${p.name} | Portofolio PT ZIA Properti Indonesia`,
          description: p.shortDescription || p.tagline,
          project: p
        };
      }
    }
    if (route === '/business/zia-raya') {
      return { title: 'ZIA Raya | Retail & Perdagangan ZIA Corporate', description: 'Informasi lini retail, apparel, aksesori, lifestyle, dan perdagangan umum ZIA Raya.', project: null };
    }
    if (route === '/business/zia-direct') {
      return { title: 'ZIA Direct | Direct Selling & Kemitraan', description: 'Informasi produk perlengkapan rumah tangga dan program kemitraan ZIA Direct.', project: null };
    }
    if (route === '/business/zia-raya') {
      return { title: 'ZIA Raya | Retail & Perdagangan ZIA Corporate', description: 'Informasi lini retail, apparel, aksesori, lifestyle, dan perdagangan umum ZIA Raya.', project: null };
    }
    if (route === '/business/zia-direct') {
      return { title: 'ZIA Direct | Direct Selling & Kemitraan', description: 'Informasi produk perlengkapan rumah tangga dan program kemitraan ZIA Direct.', project: null };
    }
    if (route === '/projects' || route === '/properties') {
      return {
        title: 'Direktori Proyek & Ekosistem Bisnis',
        description: 'Jelajahi seluruh portofolio hunian, kavling, agrikultur, dan komoditas ekspor PT ZIA Properti Indonesia.',
        project: null
      };
    }
    if (route === '/about') {
      return {
        title: 'Profil & Filosofi Korporat',
        description: 'Mengenal visi, misi, dan komitmen PT ZIA Properti Indonesia dalam menghadirkan nilai jangka panjang.',
        project: null
      };
    }
    if (route === '/contact') {
      return {
        title: 'Hubungi Kami & Layanan Konsumen',
        description: 'Kantor resmi, representatif per unit bisnis, dan konsultasi survei lokasi PT ZIA Properti Indonesia.',
        project: null
      };
    }
    if (route === '/blog' || route === '/news') {
      return {
        title: 'Wawasan, Berita & Artikel Resmi',
        description: 'Analisis arsitektur, dinamika koridor properti Bekasi, dan artikel edukasi dari PT ZIA Properti Indonesia.',
        project: null
      };
    }
    // Check if route matches dynamic CMS page
    const cleanSlug = route.replace(/^\//, '').replace(/^p\//, '');
    const matchedCustomPage = pages.find((p) => p.slug === cleanSlug && (p.status === 'published' || !p.status));
    if (matchedCustomPage) {
      return {
        title: matchedCustomPage.seoTitle || `${matchedCustomPage.title} | PT ZIA Properti Indonesia`,
        description: matchedCustomPage.seoDescription || matchedCustomPage.summary || 'Informasi resmi PT ZIA Properti Indonesia.',
        project: null
      };
    }
    return {
      title: 'PT ZIA Properti Indonesia',
      description: 'Official corporate website & project ecosystem PT ZIA Properti Indonesia.',
      project: null
    };
  };

  const seoData = getSeoData();

  // Render Public Route
  const renderPublicPage = () => {
    switch (route) {
      case '/':
        return (
          <HomePage
            settings={settings}
            projects={projects}
            posts={posts}
            onNavigate={navigateTo}
          />
        );
      case '/projects/zia-emerald':
        return (
          <ZiaEmeraldPage
            properties={properties}
            faqs={faqs}
            testimonials={testimonials}
            settings={settings}
            onNavigate={navigateTo}
          />
        );
      case '/projects/kav-hillside':
        return (
          <KavHillsidePage
            plots={plots}
            faqs={faqs}
            testimonials={testimonials}
            settings={settings}
            onNavigate={navigateTo}
          />
        );
      case '/projects/zia-farm':
        return (
          <ZiaFarmPage
            faqs={faqs}
            settings={settings}
            onNavigate={navigateTo}
          />
        );
      case '/projects/altara-zia-international':
        return (
          <AltaraZiaPage
            faqs={faqs}
            settings={settings}
            onNavigate={navigateTo}
          />
        );
      case '/business/zia-raya':
        return <BusinessUnitPage slug="zia-raya" onNavigate={navigateTo} />;
      case '/business/zia-direct':
        return <BusinessUnitPage slug="zia-direct" onNavigate={navigateTo} />;
      case '/projects':
      case '/properties':
        return (
          <ProjectDirectoryPage
            projects={projects}
            properties={properties}
            onNavigate={navigateTo}
          />
        );
      case '/about':
        return <AboutPage settings={settings} onNavigate={navigateTo} />;
      case '/contact':
        return <ContactPage settings={settings} />;
      case '/blog':
      case '/news':
        return <BlogPage posts={posts} onNavigate={navigateTo} />;
      case '/privacy-policy':
        return <LegalPages type="privacy" onNavigate={navigateTo} />;
      case '/terms':
        return <LegalPages type="terms" onNavigate={navigateTo} />;
      case '/careers':
        return (
          <div className="min-h-[70vh] bg-stone-50 py-24 flex items-center justify-center font-sans">
            <div className="max-w-xl mx-auto px-4 text-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-2">
                Karir & Kemitraan
              </span>
              <h1 className="text-3xl font-serif text-stone-900 mb-4">
                Bergabung dengan Ekosistem ZIA
              </h1>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Kami selalu membuka kesempatan bagi talenta arsitektur, teknik sipil, tenaga pemasaran properti, agronomis peternakan, dan perdagangan komoditas ekspor.
              </p>
              <a
                href={`mailto:${settings.email}?subject=Lamaran%20Karir%20PT%20ZIA%20Properti%20Indonesia`}
                className="inline-block px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-stone-800"
              >
                Kirim CV ke {settings.email}
              </a>
            </div>
          </div>
        );
      default:
        // Handle dynamic project routes (/projects/:slug)
        if (route.startsWith('/projects/')) {
          const slug = route.replace('/projects/', '');
          const matchedProj = projects.find((p) => p.slug === slug);
          if (matchedProj) {
            return (
              <DynamicProjectPage
                project={matchedProj}
                properties={properties.filter((prop) => prop.projectSlug === slug)}
                faqs={faqs.filter((f) => f.projectSlug === slug)}
                testimonials={testimonials.filter((t) => t.projectSlug === slug)}
                settings={settings}
                onNavigate={navigateTo}
              />
            );
          }
        }

        // Handle dynamic custom CMS pages (/slug or /p/slug)
        const cleanSlug = route.replace(/^\//, '').replace(/^p\//, '');
        const matchedCustomPage = pages.find((p) => p.slug === cleanSlug && (p.status === 'published' || !p.status));
        if (matchedCustomPage) {
          return (
            <DynamicCMSPage
              page={matchedCustomPage}
              sections={sections}
              settings={settings}
              onNavigate={navigateTo}
            />
          );
        }

        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">404</h1>
            <p className="text-stone-600 text-sm mb-6">Halaman yang Anda tuju tidak ditemukan.</p>
            <button
              onClick={() => navigateTo('/')}
              className="px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-semibold"
            >
              Kembali ke Beranda
            </button>
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        canonicalPath={route}
        project={seoData.project}
        settings={settings}
      />
      <div className="se-site min-h-screen flex flex-col bg-stone-50 selection:bg-stone-800 selection:text-white">
        {gmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm sticky top-0 z-50 shadow-sm flex items-center justify-between">
            <div className="flex-1 text-center">
              <span>
                Fitur peta interaktif Google Maps memerlukan kuota atau konfigurasi API Key aktif.{' '}
                <a
                  href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-amber-950 hover:text-amber-800"
                >
                  Pelajari panduan Google Maps
                </a>
              </span>
            </div>
            <button
              onClick={() => setGmpQuotaExceeded(false)}
              className="p-1 hover:bg-amber-100 text-amber-800 hover:text-amber-950 transition-colors shrink-0"
              aria-label="Tutup pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <CorporateHeader
          settings={settings}
          currentRoute={route}
          onNavigate={navigateTo}
        />
        <main className="flex-1" id="main-content">
          <Suspense fallback={<div className="se-route-loading" role="status">Memuat halaman...</div>}>
            {renderPublicPage()}
          </Suspense>
        </main>
        <CorporateFooter settings={settings} onNavigate={navigateTo} />
        <WhatsAppFloatingButton
          settings={settings}
          currentRoute={route}
          projects={projects}
        />
      </div>
    </AuthProvider>
  );
}

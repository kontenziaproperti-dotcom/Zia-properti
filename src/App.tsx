import React, { lazy, Suspense, useState, useEffect } from 'react';

import { CorporateHeader, CorporateFooter } from './components/CorporateLayout';
import { SEOHead } from './components/SEOHead';
const AuthProvider = lazy(() => import('./context/AuthContext').then((module) => ({ default: module.AuthProvider })));
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const ZiaEmeraldPage = lazy(() => import('./pages/ZiaEmeraldPage').then((module) => ({ default: module.ZiaEmeraldPage })));
const KavHillsidePage = lazy(() => import('./pages/KavHillsidePage').then((module) => ({ default: module.KavHillsidePage })));
const ZiaFarmPage = lazy(() => import('./pages/ZiaFarmPage').then((module) => ({ default: module.ZiaFarmPage })));
const AltaraZiaPage = lazy(() => import('./pages/AltaraZiaPage').then((module) => ({ default: module.AltaraZiaPage })));
const DynamicProjectPage = lazy(() => import('./pages/DynamicProjectPage').then((module) => ({ default: module.DynamicProjectPage })));
const DynamicCMSPage = lazy(() => import('./pages/DynamicCMSPage').then((module) => ({ default: module.DynamicCMSPage })));
const ProjectDirectoryPage = lazy(() => import('./pages/ProjectDirectoryPage').then((module) => ({ default: module.ProjectDirectoryPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/StaticPages').then((module) => ({ default: module.ContactPage })));
const BlogPage = lazy(() => import('./pages/StaticPages').then((module) => ({ default: module.BlogPage })));
const LegalPages = lazy(() => import('./pages/LegalPages').then((module) => ({ default: module.LegalPages })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { X } from 'lucide-react';
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

const PageLoadingFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[40vh] flex items-center justify-center px-6 py-16 text-sm text-stone-500"
  >
    Memuat halaman...
  </div>
);

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

  // Load the data service after the first render so Firebase and its SDKs
  // are not part of the initial route bundle.
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const dataService = await import('./services/dataService');
        await dataService.initializeDatabaseIfEmpty();

        const [stgs, pjs, props, pls, pts, fqs, tsts, pgs, secs, prms, navs] = await Promise.all([
          dataService.getCompanySettings(),
          dataService.getProjects(),
          dataService.getProperties(),
          dataService.getKavlingPlots(),
          dataService.getPosts(),
          dataService.getFAQs(),
          dataService.getTestimonials(),
          dataService.getPages(),
          dataService.getSections(),
          dataService.getPromotions(),
          dataService.getNavigation()
        ]);

        if (cancelled) return;
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

    void init();
    return () => {
      cancelled = true;
    };
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
      <Suspense fallback={<PageLoadingFallback />}>
        <AuthProvider>
          <AdminDashboard onNavigatePublic={navigateTo} />
        </AuthProvider>
      </Suspense>
    );
  }

  // Determine SEO metadata based on active route
  const getSeoData = () => {
    if (route === '/') {
      return {
        title: 'Beranda | PT ZIA Properti Indonesia',
        description: 'PT ZIA Properti Indonesia - Pengembang properti dan ekosistem bisnis terkemuka di Kabupaten Bekasi. ZIA Emerald, Kav Hillside, ZIA Farm, dan Altara ZIA.',
        project: null
      };
    }
    if (route === '/projects/zia-emerald') {
      const p = projects.find(item => item.slug === 'zia-emerald');
      return {
        title: p?.seoTitle || 'ZIA Emerald | Perumahan American Classic Tarumajaya Bekasi',
        description: p?.seoDescription || p?.shortDescription || 'Hunian American Classic berplafon tinggi di Tarumajaya, Kabupaten Bekasi oleh PT ZIA Properti Indonesia.',
        project: p || null
      };
    }
    if (route === '/projects/kav-hillside') {
      const p = projects.find(item => item.slug === 'kav-hillside');
      return {
        title: p?.seoTitle || 'Kav Hillside | Kavling Siap Bangun Eksklusif Kabupaten Bekasi',
        description: p?.seoDescription || p?.shortDescription || 'Kavling matang siap bangun dengan infrastruktur tertata dan legalitas terjamin di Kabupaten Bekasi.',
        project: p || null
      };
    }
    if (route === '/projects/zia-farm') {
      const p = projects.find(item => item.slug === 'zia-farm');
      return {
        title: p?.seoTitle || 'ZIA Farm | Peternakan Domba Modern & Higienis Bekasi',
        description: p?.seoDescription || p?.shortDescription || 'Sentra peternakan domba modern, qurban premium, dan aqiqah higienis Kabupaten Bekasi.',
        project: p || null
      };
    }
    if (route === '/projects/altara-zia-international') {
      const p = projects.find(item => item.slug === 'altara-zia-international');
      return {
        title: p?.seoTitle || 'Altara ZIA International | Eksportir Vanilla Gourmet Indonesia',
        description: p?.seoDescription || p?.shortDescription || 'Pemasok dan eksportir vanilla beans premium Indonesia berstandar mutu internasional.',
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
            project={projects.find((item) => item.slug === 'zia-emerald') || null}
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
            project={projects.find((item) => item.slug === 'kav-hillside') || null}
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
            project={projects.find((item) => item.slug === 'zia-farm') || null}
            faqs={faqs}
            settings={settings}
            onNavigate={navigateTo}
          />
        );
      case '/projects/altara-zia-international':
        return (
          <AltaraZiaPage
            project={projects.find((item) => item.slug === 'altara-zia-international') || null}
            faqs={faqs}
            settings={settings}
            onNavigate={navigateTo}
          />
        );
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
      <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-stone-800 selection:text-white">
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
          <Suspense fallback={<PageLoadingFallback />}>
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

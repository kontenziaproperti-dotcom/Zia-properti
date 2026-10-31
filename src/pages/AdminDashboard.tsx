import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building,
  Home,
  Layers,
  FileText,
  Bookmark,
  Newspaper,
  BookOpen,
  Tag,
  Quote,
  HelpCircle,
  Users,
  FileCheck,
  Globe,
  Compass,
  Building2,
  Share2,
  MessageSquare,
  Shield,
  ShieldAlert,
  Image as ImageIcon,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  Search,
  CheckCircle,
  Lock,
  Sparkles,
  Calendar,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getProjects,
  saveProject,
  deleteProject,
  getProperties,
  saveProperty,
  deleteProperty,
  getKavlingPlots,
  saveKavlingPlot,
  deleteKavlingPlot,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getPosts,
  savePost,
  deletePost,
  getMediaAssets,
  addMediaAsset,
  deleteMediaAsset,
  getCompanySettings,
  updateCompanySettings,
  getFAQs,
  saveFAQ,
  deleteFAQ,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getUsers,
  saveUser,
  getPages,
  savePage,
  deletePage,
  getSections,
  saveSection,
  deleteSection,
  getPromotions,
  savePromotion,
  deletePromotion,
  getNavigation,
  saveNavigation,
  deleteNavigation,
  getForms,
  saveForm,
  deleteForm
} from '../services/dataService';
import {
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_PROPERTIES,
  INITIAL_PLOTS,
  INITIAL_POSTS,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_MEDIA,
  INITIAL_PAGES,
  INITIAL_SECTIONS,
  INITIAL_PROMOTIONS,
  INITIAL_NAVIGATION,
  INITIAL_FORMS
} from '../data/initialData';
import {
  ProjectEntity,
  PropertyItem,
  KavlingPlot,
  LeadItem,
  PostItem,
  MediaAsset,
  CompanySettings,
  FAQItem,
  TestimonialItem,
  UserProfile,
  PageItem,
  SectionItem,
  PromotionItem,
  NavigationItem,
  FormConfigItem,
  UserRole
} from '../types';

import { CMSToast } from '../components/cms/CMSUI';
import { DashboardOverview } from '../components/cms/modules/DashboardOverview';
import { ProjectsModule } from '../components/cms/modules/ProjectsModule';
import { PropertiesModule } from '../components/cms/modules/PropertiesModule';
import { InventoryModule } from '../components/cms/modules/InventoryModule';
import { PagesModule } from '../components/cms/modules/PagesModule';
import { SectionsModule } from '../components/cms/modules/SectionsModule';
import { BlogNewsModule } from '../components/cms/modules/BlogNewsModule';
import { PromotionsModule } from '../components/cms/modules/PromotionsModule';
import { TestimonialsModule } from '../components/cms/modules/TestimonialsModule';
import { FAQsModule } from '../components/cms/modules/FAQsModule';
import { LeadsModule } from '../components/cms/modules/LeadsModule';
import { FormsModule } from '../components/cms/modules/FormsModule';
import { SEOModule } from '../components/cms/modules/SEOModule';
import { NavigationModule } from '../components/cms/modules/NavigationModule';
import { SettingsModule } from '../components/cms/modules/SettingsModule';
import { UsersModule } from '../components/cms/modules/UsersModule';
import { MediaModule } from '../components/cms/modules/MediaModule';
import { GoogleWorkspaceModule } from '../components/cms/modules/GoogleWorkspaceModule';
import { GoogleMapsView } from '../components/maps/GoogleMapsView';

interface AdminDashboardProps {
  onNavigatePublic: (route: string) => void;
}

export type CMSActiveTab =
  | 'dashboard'
  | 'projects'
  | 'properties'
  | 'inventory'
  | 'pages'
  | 'sections'
  | 'blog'
  | 'news'
  | 'promotions'
  | 'testimonials'
  | 'faqs'
  | 'leads'
  | 'forms'
  | 'media'
  | 'navigation'
  | 'seo'
  | 'company'
  | 'whatsapp'
  | 'social'
  | 'users'
  | 'workspace'
  | 'maps';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigatePublic }) => {
  const { currentUser, userProfile, loading: authLoading, logout, login, resetPassword, loginWithGoogle, isAdmin, role } = useAuth();

  const [activeTab, setActiveTab] = useState<CMSActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data States
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [projects, setProjects] = useState<ProjectEntity[]>(INITIAL_PROJECTS);
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES);
  const [plots, setPlots] = useState<KavlingPlot[]>(INITIAL_PLOTS);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [media, setMedia] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [pages, setPages] = useState<PageItem[]>(INITIAL_PAGES);
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [promotions, setPromotions] = useState<PromotionItem[]>(INITIAL_PROMOTIONS);
  const [navigation, setNavigation] = useState<NavigationItem[]>(INITIAL_NAVIGATION);
  const [forms, setForms] = useState<FormConfigItem[]>(INITIAL_FORMS);

  // UI States
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');

  // Toast Trigger Helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load all CMS datasets
  const loadAllData = async () => {
    try {
      const [
        stgs,
        pjs,
        props,
        pls,
        lds,
        pts,
        med,
        fqs,
        tsts,
        usr,
        pgs,
        secs,
        prms,
        navs,
        frms
      ] = await Promise.all([
        getCompanySettings(),
        getProjects(),
        getProperties(),
        getKavlingPlots(),
        getLeads(),
        getPosts(),
        getMediaAssets(),
        getFAQs(),
        getTestimonials(),
        getUsers(),
        getPages(),
        getSections(),
        getPromotions(),
        getNavigation(),
        getForms()
      ]);

      if (stgs) setSettings(stgs);
      if (pjs.length) setProjects(pjs);
      if (props.length) setProperties(props);
      if (pls.length) setPlots(pls);
      if (lds) setLeads(lds);
      if (pts.length) setPosts(pts);
      if (med.length) setMedia(med);
      if (fqs.length) setFaqs(fqs);
      if (tsts.length) setTestimonials(tsts);
      if (usr.length) setUsersList(usr);
      if (pgs.length) setPages(pgs);
      if (secs.length) setSections(secs);
      if (prms.length) setPromotions(prms);
      if (navs.length) setNavigation(navs);
      if (frms.length) setForms(frms);
    } catch (e) {
      console.warn('Load CMS data fallback notice', e);
    }
  };

  useEffect(() => {
    if (currentUser && isAdmin && !authLoading) {
      loadAllData();
    }
  }, [currentUser, isAdmin, authLoading]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      setLoginNotice('');
      await login(loginEmail, loginPassword);
      setLoginPassword('');
    } catch (err: any) {
      const code = err?.code || '';
      const message = code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-login-credentials'
        ? 'Email atau kata sandi tidak cocok. Periksa kembali, atau gunakan Lupa Kata Sandi.'
        : code === 'auth/too-many-requests'
          ? 'Terlalu banyak percobaan masuk. Tunggu beberapa saat sebelum mencoba kembali.'
          : code === 'auth/network-request-failed'
            ? 'Koneksi internet bermasalah. Periksa jaringan lalu coba kembali.'
            : code === 'auth/unauthorized-domain'
              ? 'Domain website belum diizinkan pada Firebase Authentication.'
              : code === 'auth/operation-not-allowed'
                ? 'Metode Email/Kata Sandi belum diaktifkan pada Firebase Authentication.'
                : 'Login gagal. Periksa konfigurasi akun Firebase atau coba reset kata sandi.';
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!loginEmail.trim()) {
      setLoginError('Masukkan email administrator terlebih dahulu.');
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    setLoginNotice('');
    try {
      await resetPassword(loginEmail);
      setLoginNotice('Jika email terdaftar menggunakan metode Email/Kata Sandi, tautan reset akan dikirim. Periksa kotak masuk dan folder spam.');
    } catch (err: any) {
      const code = err?.code || '';
      setLoginError(
        code === 'auth/invalid-email'
          ? 'Format alamat email belum benar.'
          : code === 'auth/too-many-requests'
            ? 'Terlalu banyak permintaan reset. Coba kembali beberapa saat lagi.'
            : 'Permintaan reset kata sandi belum dapat dikirim. Periksa alamat email dan konfigurasi Firebase.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // Wait until Firebase restores the real authentication session.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 text-stone-300">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest">Memverifikasi sesi Firebase...</p>
        </div>
      </div>
    );
  }

  // A CMS session is valid only when Firebase Auth has a current user.
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-stone-950 font-sans">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-amber-400 text-stone-950 font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-4 border border-amber-300">
              Z
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Portal CMS Internal
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mt-1">
              PT ZIA Properti Indonesia
            </p>
          </div>

          {loginNotice && (
            <div className="mb-6 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-200 text-xs leading-relaxed" role="status">
              {loginNotice}
            </div>
          )}
          {loginError && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2" role="alert">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-stone-300 uppercase tracking-wider block mb-1.5 font-medium">
                Alamat Email Administrator
              </label>
              <input
                type="email"
                required
                placeholder="admin@ziaproperti.co.id"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-stone-300 uppercase tracking-wider block mb-1.5 font-medium">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-50 mt-2"
            >
              {loginLoading ? 'Memverifikasi...' : 'Masuk ke Portal CMS'}
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoginLoading(true);
                setLoginError('');
                setLoginNotice('');
                try {
                  await loginWithGoogle();
                } catch (err: any) {
                  const code = err?.code || '';
                  setLoginError(code === 'auth/unauthorized-domain'
                    ? 'Domain website belum diizinkan pada Firebase Authentication.'
                    : code === 'auth/operation-not-allowed'
                      ? 'Metode login Google belum diaktifkan pada Firebase Authentication.'
                      : code === 'auth/popup-blocked'
                        ? 'Browser memblokir jendela login Google. Izinkan pop-up lalu coba kembali.'
                        : code === 'auth/popup-closed-by-user'
                          ? 'Jendela login Google ditutup sebelum proses selesai.'
                          : 'Login Google gagal. Periksa provider Google dan domain yang diizinkan di Firebase.');
                } finally {
                  setLoginLoading(false);
                }
              }}
              disabled={loginLoading}
              className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Masuk dengan Akun Google
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={loginLoading}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-4 disabled:opacity-50"
            >
              Lupa kata sandi?
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigatePublic('/')}
              className="text-[11px] text-stone-500 hover:text-stone-300 uppercase tracking-widest"
            >
              ← Kembali ke Website Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated in Firebase Auth, but has no admin privileges (Unauthorized)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 selection:bg-amber-400 selection:text-stone-950 font-sans">
        <div className="w-full max-w-md bg-stone-900 border border-red-900/60 p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-950 border border-red-700 text-red-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-xl font-bold text-white tracking-tight">
              Akses Ditolak
            </h1>
            <p className="text-xs text-stone-400 mt-2">
              Akun Anda ({currentUser?.email}) terdaftar tetapi belum memiliki otorisasi administrator atau peran staf PT ZIA Properti Indonesia.
            </p>
          </div>
          <div className="p-3 bg-stone-950 border border-stone-800 text-[11px] font-mono text-stone-400 mb-6 space-y-1">
            <div>UID: <span className="text-stone-200">{currentUser?.uid}</span></div>
            <div>Status: <span className="text-red-400 font-semibold">Belum Diberikan Hak Akses</span></div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => logout()}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-widest font-bold transition-colors"
            >
              Keluar (Sign Out)
            </button>
            <button
              onClick={() => onNavigatePublic('/')}
              className="w-full py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              Kembali ke Beranda Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Menu Groupings
  const sidebarGroups = [
    {
      group: 'UTAMA',
      items: [
        { id: 'dashboard' as CMSActiveTab, label: 'Dasbor & Ikhtisar', icon: LayoutDashboard }
      ]
    },
    {
      group: 'PROPERTI & KAWASAN',
      items: [
        { id: 'projects' as CMSActiveTab, label: 'Kawasan Proyek', icon: Building },
        { id: 'properties' as CMSActiveTab, label: 'Tipe Unit Hunian', icon: Home },
        { id: 'inventory' as CMSActiveTab, label: 'Inventaris Kavling', icon: Layers }
      ]
    },
    {
      group: 'KONTEN & HALAMAN',
      items: [
        { id: 'pages' as CMSActiveTab, label: 'Halaman Website', icon: FileText },
        { id: 'sections' as CMSActiveTab, label: 'Bagian / Seksi Konten', icon: Bookmark },
        { id: 'blog' as CMSActiveTab, label: 'Artikel Blog', icon: BookOpen },
        { id: 'news' as CMSActiveTab, label: 'Kabar & Berita', icon: Newspaper },
        { id: 'promotions' as CMSActiveTab, label: 'Promo & Penawaran', icon: Tag }
      ]
    },
    {
      group: 'INTERAKSI & CRM',
      items: [
        { id: 'leads' as CMSActiveTab, label: 'Prospek CRM (Leads)', icon: Users, badge: leads.filter(l => l.status === 'New').length || undefined },
        { id: 'forms' as CMSActiveTab, label: 'Pengaturan Formulir', icon: FileCheck },
        { id: 'testimonials' as CMSActiveTab, label: 'Ulasan Konsumen', icon: Quote },
        { id: 'faqs' as CMSActiveTab, label: 'Tanya Jawab (FAQ)', icon: HelpCircle }
      ]
    },
    {
      group: 'MEDIA & TAMPILAN',
      items: [
        { id: 'media' as CMSActiveTab, label: 'Pustaka Media', icon: ImageIcon },
        { id: 'navigation' as CMSActiveTab, label: 'Menu Navigasi', icon: Compass },
        { id: 'seo' as CMSActiveTab, label: 'Optimasi SEO', icon: Globe }
      ]
    },
    {
      group: 'PENGATURAN KORPORAT',
      items: [
        { id: 'company' as CMSActiveTab, label: 'Profil Perusahaan', icon: Building2 },
        { id: 'whatsapp' as CMSActiveTab, label: 'Kanal WhatsApp', icon: MessageSquare },
        { id: 'social' as CMSActiveTab, label: 'Media Sosial', icon: Share2 },
        { id: 'users' as CMSActiveTab, label: 'Peran Pengguna (RBAC)', icon: Shield }
      ]
    },
    {
      group: 'GOOGLE SUITE & GIS',
      items: [
        { id: 'workspace' as CMSActiveTab, label: 'Google Workspace (Cal, Docs, Sheets)', icon: Calendar },
        { id: 'maps' as CMSActiveTab, label: 'Peta Lokasi & GIS (Google Maps)', icon: MapPin }
      ]
    }
  ];
  const canManageContent = ['super_admin', 'admin', 'editor'].includes(role || '');
  const staffAllowedTabs: CMSActiveTab[] = ['dashboard', 'leads', 'workspace', 'maps'];
  const visibleSidebarGroups = sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canManageContent || staffAllowedTabs.includes(item.id))
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    if (!canManageContent && !staffAllowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [canManageContent, activeTab]);


  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMessage && (
        <CMSToast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-stone-400 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-amber-400 text-stone-950 font-serif font-bold text-lg flex items-center justify-center border border-amber-300">
              Z
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-bold text-white leading-tight uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                PT ZIA Properti Indonesia
              </span>
              <span className="text-[9px] uppercase tracking-widest text-stone-400 font-mono">
                Content Management System
              </span>
            </div>
          </div>
        </div>

        {/* Right User Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigatePublic('/')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>Lihat Website</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-stone-800 text-xs">
            <div className="text-right">
              <div className="font-semibold text-white leading-tight">
                {userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Administrator'}
              </div>
              <span className="text-[10px] uppercase font-mono text-amber-300">
                {userProfile?.role || 'Super Admin'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Keluar dari CMS"
            className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-950 border-r border-stone-800 pt-16 lg:pt-0 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-0 hidden lg:block'
          }`}
        >
          <div className="h-full overflow-y-auto p-4 space-y-6 text-xs">
            {visibleSidebarGroups.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-500 px-3 block mb-1">
                  {grp.group}
                </span>

                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'text-stone-300 hover:text-white hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                            isActive
                              ? 'bg-stone-950 text-amber-300'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-900">
          <div className="max-w-7xl mx-auto">
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                projects={projects}
                properties={properties}
                plots={plots}
                leads={leads}
                posts={posts}
                promotions={promotions}
                pages={pages}
                onNavigateTab={(tab) => setActiveTab(tab as CMSActiveTab)}
                onNavigatePublic={onNavigatePublic}
              />
            )}

            {/* 2. PROJECTS MODULE */}
            {activeTab === 'projects' && (
              <ProjectsModule
                projects={projects}
                onSaveProject={async (pj) => {
                  await saveProject(pj);
                  await loadAllData();
                }}
                onDeleteProject={async (slug) => {
                  await deleteProject(slug);
                  await loadAllData();
                }}
                onNavigatePublic={onNavigatePublic}
                showToast={showToast}
              />
            )}

            {/* 3. PROPERTIES MODULE */}
            {activeTab === 'properties' && (
              <PropertiesModule
                properties={properties}
                projects={projects}
                onSaveProperty={async (prop) => {
                  await saveProperty(prop);
                  await loadAllData();
                }}
                onDeleteProperty={async (id) => {
                  await deleteProperty(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 4. INVENTORY / PLOTS MODULE */}
            {activeTab === 'inventory' && (
              <InventoryModule
                plots={plots}
                onSavePlot={async (plt) => {
                  await saveKavlingPlot(plt);
                  await loadAllData();
                }}
                onDeletePlot={async (id) => {
                  await deleteKavlingPlot(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 5. PAGES MODULE */}
            {activeTab === 'pages' && (
              <PagesModule
                pages={pages}
                onSavePage={async (pg) => {
                  await savePage(pg);
                  await loadAllData();
                }}
                onDeletePage={async (id) => {
                  await deletePage(id);
                  await loadAllData();
                }}
                onNavigatePublic={onNavigatePublic}
                showToast={showToast}
              />
            )}

            {/* 6. SECTIONS MODULE */}
            {activeTab === 'sections' && (
              <SectionsModule
                sections={sections}
                pages={pages}
                onSaveSection={async (sec) => {
                  await saveSection(sec);
                  await loadAllData();
                }}
                onDeleteSection={async (id) => {
                  await deleteSection(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 7. BLOG MODULE */}
            {activeTab === 'blog' && (
              <BlogNewsModule
                posts={posts}
                defaultType="blog"
                onSavePost={async (pt) => {
                  await savePost(pt);
                  await loadAllData();
                }}
                onDeletePost={async (id) => {
                  await deletePost(id);
                  await loadAllData();
                }}
                onNavigatePublic={onNavigatePublic}
                showToast={showToast}
              />
            )}

            {/* 8. NEWS MODULE */}
            {activeTab === 'news' && (
              <BlogNewsModule
                posts={posts}
                defaultType="news"
                onSavePost={async (pt) => {
                  await savePost(pt);
                  await loadAllData();
                }}
                onDeletePost={async (id) => {
                  await deletePost(id);
                  await loadAllData();
                }}
                onNavigatePublic={onNavigatePublic}
                showToast={showToast}
              />
            )}

            {/* 9. PROMOTIONS MODULE */}
            {activeTab === 'promotions' && (
              <PromotionsModule
                promotions={promotions}
                projects={projects}
                onSavePromotion={async (prm) => {
                  await savePromotion(prm);
                  await loadAllData();
                }}
                onDeletePromotion={async (id) => {
                  await deletePromotion(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 10. TESTIMONIALS MODULE */}
            {activeTab === 'testimonials' && (
              <TestimonialsModule
                testimonials={testimonials}
                projects={projects}
                onSaveTestimonial={async (tst) => {
                  await saveTestimonial(tst);
                  await loadAllData();
                }}
                onDeleteTestimonial={async (id) => {
                  await deleteTestimonial(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 11. FAQS MODULE */}
            {activeTab === 'faqs' && (
              <FAQsModule
                faqs={faqs}
                projects={projects}
                onSaveFAQ={async (fq) => {
                  await saveFAQ(fq);
                  await loadAllData();
                }}
                onDeleteFAQ={async (id) => {
                  await deleteFAQ(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 12. LEADS CRM MODULE */}
            {activeTab === 'leads' && (
              <LeadsModule
                leads={leads}
                projects={projects}
                onUpdateLeadStatus={async (id, status, notes) => {
                  await updateLeadStatus(id, status, notes);
                  await loadAllData();
                }}
                onDeleteLead={async (id) => {
                  await deleteLead(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 13. FORMS MODULE */}
            {activeTab === 'forms' && (
              <FormsModule
                forms={forms}
                projects={projects}
                onSaveForm={async (frm) => {
                  await saveForm(frm);
                  await loadAllData();
                }}
                onDeleteForm={async (id) => {
                  await deleteForm(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 14. MEDIA LIBRARY MODULE */}
            {activeTab === 'media' && (
              <MediaModule
                media={media}
                onAddMedia={async (asset) => {
                  await addMediaAsset(asset);
                  await loadAllData();
                }}
                onDeleteMedia={async (id) => {
                  await deleteMediaAsset(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 15. NAVIGATION MODULE */}
            {activeTab === 'navigation' && (
              <NavigationModule
                navigation={navigation}
                onSaveNavigation={async (nav) => {
                  await saveNavigation(nav);
                  await loadAllData();
                }}
                onDeleteNavigation={async (id) => {
                  await deleteNavigation(id);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 16. SEO MODULE */}
            {activeTab === 'seo' && (
              <SEOModule
                settings={settings}
                onSaveSettings={async (stgs) => {
                  await updateCompanySettings(stgs);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 17. COMPANY SETTINGS MODULE */}
            {activeTab === 'company' && (
              <SettingsModule
                settings={settings}
                defaultSubTab="company"
                onSaveSettings={async (stgs) => {
                  await updateCompanySettings(stgs);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 18. WHATSAPP SETTINGS MODULE */}
            {activeTab === 'whatsapp' && (
              <SettingsModule
                settings={settings}
                defaultSubTab="whatsapp"
                onSaveSettings={async (stgs) => {
                  await updateCompanySettings(stgs);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 19. SOCIAL MEDIA SETTINGS MODULE */}
            {activeTab === 'social' && (
              <SettingsModule
                settings={settings}
                defaultSubTab="social"
                onSaveSettings={async (stgs) => {
                  await updateCompanySettings(stgs);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 20. USERS MODULE (RBAC) */}
            {activeTab === 'users' && (
              <UsersModule
                users={usersList}
                currentUserId={currentUser?.uid}
                onSaveUser={async (usr) => {
                  await saveUser(usr);
                  await loadAllData();
                }}
                showToast={showToast}
              />
            )}

            {/* 21. GOOGLE WORKSPACE MODULE (CALENDAR, DOCS, SHEETS) */}
            {activeTab === 'workspace' && (
              <GoogleWorkspaceModule
                leads={leads}
                properties={properties}
                plots={plots}
                projects={projects}
                showToast={showToast}
              />
            )}

            {/* 22. GOOGLE MAPS & GIS EXPLORER MODULE */}
            {activeTab === 'maps' && (
              <div className="space-y-6">
                <div className="p-6 bg-white border border-stone-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                        Geographic Information System (GIS)
                      </span>
                      <h2 className="text-xl font-bold font-serif text-stone-900">
                        Google Maps Platform GIS & Location Hub
                      </h2>
                      <p className="text-xs text-stone-500 mt-1">
                        Peta interaktif seluruh aset, proyek residensial, kavling, peternakan, dan kantor pusat PT ZIA Properti Indonesia.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Buka Google Maps</span>
                      </a>
                    </div>
                  </div>

                  <GoogleMapsView heightClassName="h-[520px]" showDirectory={true} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

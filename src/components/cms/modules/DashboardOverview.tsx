import React from 'react';
import {
  TrendingUp,
  Users,
  Building,
  Home,
  Layers,
  FileText,
  Tag,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Send
} from 'lucide-react';
import {
  ProjectEntity,
  PropertyItem,
  KavlingPlot,
  LeadItem,
  PostItem,
  PromotionItem,
  PageItem
} from '../../../types';

interface DashboardOverviewProps {
  projects: ProjectEntity[];
  properties: PropertyItem[];
  plots: KavlingPlot[];
  leads: LeadItem[];
  posts: PostItem[];
  promotions: PromotionItem[];
  pages: PageItem[];
  onNavigateTab: (tab: string) => void;
  onNavigatePublic: (route: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  properties,
  plots,
  leads,
  posts,
  promotions,
  pages,
  onNavigateTab,
  onNavigatePublic
}) => {
  // Compute analytics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const availablePlots = plots.filter((p) => p.status === 'Available').length;
  const bookedPlots = plots.filter((p) => p.status === 'Reserved').length;
  const activePromos = promotions.filter((p) => p.status === 'published').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border border-stone-800 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3 h-3" />
            Portal Manajemen Konten Internal
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
            Selamat Datang di CMS PT ZIA Properti Indonesia
          </h1>
          <p className="text-xs text-stone-400 leading-relaxed mb-6">
            Kelola seluruh konten website, inventaris unit residensial, kavling matang, prospek konsumen, artikel, dan pengaturan operasional tanpa perlu menyentuh kode program.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('leads')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Kelola Prospek ({newLeads} Baru)
            </button>
            <button
              onClick={() => onNavigatePublic('/')}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs uppercase tracking-wider font-semibold border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              Lihat Website Publik
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200 via-stone-500 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('leads')}
          className="p-5 bg-stone-950 border border-stone-800 hover:border-amber-400/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Total Prospek (Leads)
            </span>
            <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-serif font-bold text-white mb-1">{totalLeads}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="font-semibold">{newLeads}</span> belum ditindaklanjuti
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('projects')}
          className="p-5 bg-stone-950 border border-stone-800 hover:border-amber-400/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Kawasan Proyek
            </span>
            <Building className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-serif font-bold text-white mb-1">{projects.length}</div>
          <div className="text-[11px] text-stone-400">
            {properties.length} tipe hunian terdaftar
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 bg-stone-950 border border-stone-800 hover:border-amber-400/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Stok Kavling
            </span>
            <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-serif font-bold text-white mb-1">{plots.length}</div>
          <div className="text-[11px] text-stone-400">
            <span className="text-emerald-400 font-semibold">{availablePlots}</span> Siap Jual • {bookedPlots} Terpesan
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('promotions')}
          className="p-5 bg-stone-950 border border-stone-800 hover:border-amber-400/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Promo Aktif
            </span>
            <Tag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-serif font-bold text-white mb-1">{activePromos}</div>
          <div className="text-[11px] text-stone-400">
            {posts.length} artikel & kabar publikasi
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-8 bg-stone-950 border border-stone-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                Prospek Konsumen Terbaru
              </h3>
              <p className="text-xs text-stone-500">
                Pesan formulir konsultasi yang masuk dari situs publik
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              Lihat Semua CRM →
            </button>
          </div>

          <div className="divide-y divide-stone-800/80">
            {leads.slice(0, 5).map((l) => (
              <div key={l.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white truncate">{l.name}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        l.status === 'New'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-stone-900 text-stone-400'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                  <div className="text-stone-400 text-[11px] truncate">
                    {l.projectName} • {l.phone}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
                    {new Date(l.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  <a
                    href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Bapak/Ibu ${l.name}, saya perwakilan PT ZIA Properti Indonesia menindaklanjuti pesan Anda mengenai ${l.projectName}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition-colors"
                    title="Follow-up via WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}

            {leads.length === 0 && (
              <div className="py-8 text-center text-xs text-stone-500">
                Belum ada kontak prospek masuk.
              </div>
            )}
          </div>
        </div>

        {/* Quick Operations Matrix */}
        <div className="lg:col-span-4 bg-stone-950 border border-stone-800 p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-white pb-3 border-b border-stone-800">
            Operasional Konten Cepat
          </h3>

          <div className="space-y-2.5 text-xs">
            <button
              onClick={() => onNavigateTab('properties')}
              className="w-full p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-white block">Tambah Tipe Unit Rumah</span>
                <span className="text-[11px] text-stone-400">Atur spesifikasi, harga, dan denah</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => onNavigateTab('promotions')}
              className="w-full p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-white block">Buat Promo & Penawaran</span>
                <span className="text-[11px] text-stone-400">Diskon DP, cashback, subsidi KPR</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => onNavigateTab('blog')}
              className="w-full p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-white block">Tulis Artikel / Wawasan</span>
                <span className="text-[11px] text-stone-400">Publikasi edukasi arsitektur & investasi</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>

            <button
              onClick={() => onNavigateTab('media')}
              className="w-full p-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-white block">Unggah Aset Visual</span>
                <span className="text-[11px] text-stone-400">Pustaka foto fasad, interior & video</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

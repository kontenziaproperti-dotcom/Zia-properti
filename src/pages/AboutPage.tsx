import React from 'react';
import { ShieldCheck, Compass, Target, Eye, Building2, MapPin, Award, CheckCircle } from 'lucide-react';
import { CompanySettings } from '../types';

interface AboutPageProps {
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Hero */}
      <section className="bg-stone-900 text-stone-100 py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-3">
            Profil Perusahaan
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mb-4">
            Tentang ZIA Corporate
          </h1>
          <p className="text-stone-400 text-sm max-w-2xl leading-relaxed">
            Membangun kawasan dan ekosistem bisnis dengan perencanaan arsitektur beretika, integritas hukum yang kokoh, dan komitmen keberlanjutan di Kabupaten Bekasi, Jawa Barat.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block">
                Fondasi & Pendekatan
              </span>
              <h2 className="text-3xl font-serif text-stone-900 leading-tight">
                "Building Better Places, Creating Long Term Value"
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                ZIA Corporate merupakan kelompok usaha yang berakar di Kabupaten Bekasi, Jawa Barat, dengan portofolio lintas sektor yang mencakup properti, kavling, agribisnis, perdagangan, ekspor, dan penjualan langsung. Kami memandang pembangunan bukan semata menumpuk bata atau memasarkan lahan, melainkan menciptakan ruang hidup dan peluang usaha yang memberi nilai jangka panjang bagi pelanggan, mitra, dan komunitas.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Melalui kurasi arsitektur American Classic yang abadi, kami memastikan setiap rumah memiliki sirkulasi udara optimal, pencahayaan alami, serta material berdaya tahan tinggi yang minim biaya perawatan jangka panjang.
              </p>
            </div>

            <div className="lg:col-span-6 bg-stone-50 p-8 border border-stone-200 space-y-6">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Pilar Pengembangan Terpadu
              </h3>
              <div className="space-y-4 text-xs text-stone-700">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">Kepastian Legalitas Mutlak</span>
                    <p className="text-stone-600">Seluruh status tanah dan persetujuan bangunan dipastikan bersih dan tuntas sebelum penawaran ke publik.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">Tata Ruang Berkelanjutan</span>
                    <p className="text-stone-600">Alokasi ruang terbuka hijau memadai, drainase tersembunyi, dan orientasi bukaan bangunan yang ramah iklim mikro tropis.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">Diversifikasi Ekosistem Usaha</span>
                    <p className="text-stone-600">Mengkombinasikan sektor properti hunian dengan ketahanan pangan melalui peternakan higienis (ZIA Farm) serta komoditas devisa ekspor (Altara ZIA).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-stone-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 border border-stone-200">
              <div className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">
                Visi Perusahaan
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menjadi pengembang properti dan pengelola ekosistem bisnis terpercaya di Jawa Barat yang diakui atas keunggulan kualitas arsitektur, kepatuhan legalitas terpercaya, dan penciptaan nilai tambah jangka panjang yang berkelanjutan bagi pemangku kepentingan.
              </p>
            </div>

            <div className="bg-white p-10 border border-stone-200">
              <div className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center mb-6">
                <Target className="w-6 h-6 stroke-1" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">
                Misi Perusahaan
              </h3>
              <ul className="space-y-2.5 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                  <span>Mengembangkan hunian berkualitas berarsitektur elegan dengan struktur bangunan kokoh dan tata ruang ramah keluarga.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                  <span>Menyediakan kavling tanah siap bangun berinfrastruktur matang sebagai sarana proteksi nilai kekayaan nasabah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
                  <span>Menerapkan tata kelola peternakan modern yang higienis serta menghubungkan petani vanilla Indonesia ke pasar internasional.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Office & Legal Disclaimer Note */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500 space-y-2">
          <p className="font-semibold text-stone-800">
            {settings.companyName} • Kantor Pusat Kabupaten Bekasi, Jawa Barat
          </p>
          <p>
            {settings.fullAddress}
          </p>
          <p className="pt-2 text-[11px] text-stone-400">
            Seluruh data portofolio, spesifikasi teknis bangunan, status ketersediaan unit, dan informasi legalitas dikelola secara dinamis melalui Content Management System resmi perusahaan.
          </p>
        </div>
      </section>
    </div>
  );
};

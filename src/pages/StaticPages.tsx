import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe } from 'lucide-react';
import { CompanySettings } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';
import { GoogleMapsView } from '../components/maps/GoogleMapsView';

export const ContactPage: React.FC<{ settings: CompanySettings }> = ({ settings }) => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <section className="bg-stone-900 text-white py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-2">
            Pusat Komunikasi & Layanan
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mb-4">
            Hubungi ZIA Corporate
          </h1>
          <p className="text-stone-400 text-sm max-w-2xl leading-relaxed">
            Representatif kami siap menyambut pertanyaan Anda mengenai unit hunian ZIA Emerald, kavling Kav Hillside, peternakan ZIA Farm, maupun ekspor vanilla Altara ZIA.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Kantor Pusat & Representatif
              </h2>
              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3 p-4 bg-white border border-stone-200">
                  <MapPin className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">Alamat Kantor</span>
                    <p className="leading-relaxed">{settings.fullAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-stone-200">
                  <Clock className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">Jam Operasional Kantor</span>
                    <p>{settings.officeHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-stone-200">
                  <Phone className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">Telepon & Email Resmi</span>
                    <p className="font-mono text-stone-900 font-semibold">{formatIndonesianPhone(settings.phone)}</p>
                    <p className="text-stone-500">{settings.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp channels */}
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-3">
                Layanan WhatsApp Cepat Per Unit Usaha
              </h3>
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.emeraldWhatsApp, '6281288889922')}?text=${encodeURIComponent('Halo Tim Sales ZIA Emerald, saya ingin informasi mengenai hunian American Classic.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <div>
                    <span className="block font-bold">WhatsApp ZIA Emerald (Residensial)</span>
                    <span className="text-[11px] font-mono text-emerald-700 font-normal">
                      {formatIndonesianPhone(settings.emeraldWhatsApp || '6281288889922')}
                    </span>
                  </div>
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.kavWhatsApp, '6281288889933')}?text=${encodeURIComponent('Halo Tim Kav Hillside, saya ingin informasi mengenai kavling hunian siap bangun.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 bg-stone-100 border border-stone-300 text-xs text-stone-900 font-semibold hover:bg-stone-200 transition-colors"
                >
                  <div>
                    <span className="block font-bold">WhatsApp Kav Hillside (Kavling)</span>
                    <span className="text-[11px] font-mono text-stone-600 font-normal">
                      {formatIndonesianPhone(settings.kavWhatsApp || '6281288889933')}
                    </span>
                  </div>
                  <MessageSquare className="w-4 h-4 text-stone-700" />
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.farmWhatsApp, '6281288889944')}?text=${encodeURIComponent('Halo Tim ZIA Farm, saya ingin informasi mengenai hewan ternak qurban dan agribisnis.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold hover:bg-amber-100 transition-colors"
                >
                  <div>
                    <span className="block font-bold">WhatsApp ZIA Farm (Peternakan)</span>
                    <span className="text-[11px] font-mono text-amber-800 font-normal">
                      {formatIndonesianPhone(settings.farmWhatsApp || '6281288889944')}
                    </span>
                  </div>
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.altaraWhatsApp, '6281288889955')}?text=${encodeURIComponent('Hello Altara ZIA International, I would like to inquire about premium Indonesian vanilla beans export.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 bg-stone-900 border border-stone-800 text-xs text-amber-300 font-semibold hover:bg-stone-800 transition-colors"
                >
                  <div>
                    <span className="block font-bold">WhatsApp Altara ZIA (Vanilla Export)</span>
                    <span className="text-[11px] font-mono text-amber-400/80 font-normal">
                      {formatIndonesianPhone(settings.altaraWhatsApp || '6281288889955')}
                    </span>
                  </div>
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <LeadCaptureForm
              projectSlug="contact-page-inquiry"
              projectName="ZIA Corporate"
              propertyOptions={[
                'Konsultasi Residensial ZIA Emerald',
                'Konsultasi Kavling Kav Hillside',
                'Layanan ZIA Farm (Qurban / Ternak)',
                'Ekspor Altara ZIA International',
                'Kemitraan Usaha & Investasi'
              ]}
              title="Kirim Pesan Resmi ke Manajemen"
              subtitle="Silakan sampaikan pertanyaan atau rencana survei lokasi Anda. Kami akan menindaklanjuti pesan Anda dalam waktu 1x24 jam kerja."
            />
          </div>
        </div>

        {/* Interactive Google Map Section */}
        <div className="mt-16 pt-16 border-t border-stone-200">
          <div className="mb-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-emerald-800 font-bold block mb-1">
              Navigasi & Jaringan Lokasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-bold">
              Peta Lokasi Kantor & Proyek ZIA Group
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Gunakan peta interaktif di bawah untuk melihat rute perjalanan menuju kantor pusat kami, kawasan hunian ZIA Emerald di Tarumajaya, kavling, maupun sentra peternakan ZIA Farm.
            </p>
          </div>
          <GoogleMapsView heightClassName="h-[480px]" showDirectory={true} />
        </div>
      </section>
    </div>
  );
};

export const BlogPage: React.FC<{
  posts: any[];
  onNavigate: (route: string) => void;
}> = ({ posts, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [activeArticle, setActiveArticle] = React.useState<any | null>(null);

  const categories = ['All', 'Arsitektur & Konsep', 'Pengembangan Kawasan', 'Agrikultur Modern', 'Komoditas Ekspor'];

  const filteredPosts = posts.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <section className="bg-stone-900 text-white py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-2">
            Wawasan Resmi & Publikasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mb-4">
            Kabar & Artikel ZIA Corporate
          </h1>
          <p className="text-stone-400 text-sm max-w-2xl leading-relaxed">
            Artikel seputar arsitektur American Classic, pertumbuhan koridor properti Bekasi, tata kelola peternakan modern, serta dinamika komoditas ekspor vanilla Indonesia.
          </p>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="bg-white border-b border-stone-200 py-4 sticky top-20 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat === 'All' ? 'Semua Topik' : cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari judul wawasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-stone-900">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-stone-900/90 text-stone-100 text-[10px] uppercase tracking-wider px-2 py-0.5">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-lg font-bold text-stone-900 mb-3 leading-snug group-hover:text-amber-800 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-50 flex items-center justify-between text-[11px] text-stone-400">
                <span>{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                <button
                  onClick={() => setActiveArticle(post)}
                  className="text-stone-900 font-semibold hover:underline uppercase tracking-wider text-[11px]"
                >
                  Baca Selengkapnya →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-stone-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64 md:h-80 bg-stone-900">
              <img
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveArticle(null)}
                aria-label="Tutup jendela artikel"
                className="absolute top-4 right-4 bg-stone-900/80 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-900"
              >
                ✕
              </button>
            </div>
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                <span className="uppercase tracking-widest text-[10px] font-bold text-stone-800">
                  {activeArticle.category}
                </span>
                <span>•</span>
                <span>Penulis: {activeArticle.author}</span>
                <span>•</span>
                <span>{new Date(activeArticle.createdAt).toLocaleDateString('id-ID')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-4">
                {activeArticle.title}
              </h2>
              <div className="p-4 bg-stone-50 border-l-2 border-stone-900 text-stone-700 italic text-sm mb-6">
                {activeArticle.summary}
              </div>
              <div className="text-sm text-stone-700 leading-relaxed space-y-4">
                {activeArticle.content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between items-center">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Tutup Artikel
                </button>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onNavigate('/contact');
                  }}
                  className="text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Hubungi Developer Terkait Wawasan Ini →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

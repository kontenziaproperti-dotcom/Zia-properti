import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Compass,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Trees,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { KavlingPlot, FAQItem, TestimonialItem, CompanySettings, ProjectEntity } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { GoogleMapsView } from '../components/maps/GoogleMapsView';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';

interface KavHillsideProps {
  plots: KavlingPlot[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  settings: CompanySettings;
  project?: ProjectEntity | null;
  onNavigate: (route: string) => void;
}

export const KavHillsidePage: React.FC<KavHillsideProps> = ({
  plots,
  faqs,
  testimonials,
  settings,
  project,
  onNavigate
}) => {
  const [filterBlock, setFilterBlock] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const kavFaqs = faqs.filter((f) => f.projectSlug === 'kav-hillside');
  const kavTestimonials = testimonials.filter((t) => t.projectSlug === 'kav-hillside');

  const filteredPlots = plots.filter((plot) => {
    const matchesBlock = filterBlock === 'All' || plot.block.includes(filterBlock);
    const matchesStatus = filterStatus === 'All' || plot.status === filterStatus;
    return matchesBlock && matchesStatus;
  });

  const getWaKavLink = (text?: string) => {
    const rawNum = settings.kavWhatsApp || '6281288889933';
    const cleanNum = cleanWhatsAppNumber(rawNum, '6281288889933');
    const msg = text || 'Halo Tim Sales Kav Hillside, saya tertarik dengan informasi kavling tanah siap bangun. Mohon informasi ketersediaan blok, luas tanah, dan skema pembayaran.';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* 1. HERO - Quiet Luxury & Land Investment */}
      <section className="relative min-h-[88vh] flex items-center bg-[#1c2417] text-stone-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85"
            alt="Kav Hillside Land Landscape"
            className="w-full h-full object-cover opacity-35 filter saturate-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141b10] via-[#1c2417]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141b10] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#304026] bg-[#1d2916]/80 text-emerald-300 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Kavling Siap Bangun Eksklusif • Kabupaten Bekasi
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-6">
              KAV HILLSIDE
              <span className="block text-xl sm:text-2xl font-light text-stone-300 font-serif italic mt-3">
                American Classic Premium Housing & Kavling Matang
              </span>
            </h1>

            <p className="text-base text-stone-300 font-light leading-relaxed mb-8 max-w-xl">
              Kepemilikan tanah siap bangun dengan infrastruktur tertata, ROW jalan lega, patok batas legalitas resmi, dan panduan desain arsitektur bernilai apresiasi tinggi.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#inventory"
                className="px-8 py-4 bg-stone-100 text-stone-900 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all text-center"
              >
                Lihat Ketersediaan Kavling
              </a>

              <a
                href={getWaKavLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-stone-500 text-stone-200 hover:text-white hover:border-white text-xs uppercase tracking-[0.2em] font-semibold transition-all text-center"
              >
                Konsultasi WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-stone-700/60 mt-12 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Infrastruktur</span>
                <span className="font-serif text-base text-white">Underground & Paving</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Ukuran Kavling</span>
                <span className="font-serif text-base text-white">84 m² - 120 m²</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Legalitas Dasar</span>
                <span className="font-serif text-base text-white">SHGB / SHM Pecah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROJECT CONCEPT: QUIET LUXURY & INVESTMENT PHILOSOPHY */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#365314] font-bold block">
                Filosofi Investasi Lahan
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight">
                Tanah Adalah Fondasi Kekayaan Riil Lintas Generasi
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Di tengah pesatnya ekspansi infrastruktur Jabodetabek timur, Kav Hillside dirancang untuk para pemilik tanah yang menginginkan fleksibilitas: membangun hunian American Classic sekarang, atau menyimpannya sebagai instrumen lindung nilai investasi properti.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Setiap bidang kavling telah dipadatkan, dipatok dengan akurat, dilengkapi jaringan air bersih, saluran gorong-gorong beton tersembunyi, dan koneksi listrik mandiri.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-stone-50 border border-stone-200">
                  <Trees className="w-5 h-5 text-[#365314] mb-2" />
                  <h4 className="font-serif text-sm font-bold text-stone-900 mb-1">Lingkungan Berkontur Asri</h4>
                  <p className="text-xs text-stone-600">Elevasi kawasan bebas banjir dengan tata lansekap pepohonan rindang.</p>
                </div>
                <div className="p-4 bg-stone-50 border border-stone-200">
                  <TrendingUp className="w-5 h-5 text-[#365314] mb-2" />
                  <h4 className="font-serif text-sm font-bold text-stone-900 mb-1">Apresiasi Nilai Lahan</h4>
                  <p className="text-xs text-stone-600">Pertumbuhan nilai tanah teruji seiring penyelesaian jaringan tol baru.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-stone-200 p-2 bg-stone-50 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                  alt="Kav Hillside Site Plan Perspective"
                  className="w-full h-[400px] object-cover"
                />
                <div className="p-4 bg-white text-xs text-stone-500 flex justify-between items-center">
                  <span>Ilustrasi Penataan Kawasan & Kavling Matang</span>
                  <span className="font-semibold text-stone-900">Kav Hillside Masterplan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC KAVLING INVENTORY & SITE TABLE (CMS CONTROLLED) */}
      <section id="inventory" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#365314] font-bold block mb-2">
                Inventori Kavling Real-Time
              </span>
              <h2 className="text-3xl font-serif text-stone-900">
                Tabel Ketersediaan Unit Kavling Siap Bangun
              </h2>
            </div>

            {/* Filter controls */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-stone-300 text-xs px-3 py-2 text-stone-700 focus:outline-none"
              >
                <option value="All">Semua Status</option>
                <option value="Available">Available (Tersedia)</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold (Terjual)</option>
              </select>
            </div>
          </div>

          {/* Interactive Plot Table */}
          <div className="bg-white border border-stone-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900 text-stone-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Kode Plot</th>
                  <th className="py-4 px-6 font-semibold">Zona / Blok</th>
                  <th className="py-4 px-6 font-semibold">Nomor Kavling</th>
                  <th className="py-4 px-6 font-semibold">Luas Tanah</th>
                  <th className="py-4 px-6 font-semibold">Lebar Depan</th>
                  <th className="py-4 px-6 font-semibold">Estimasi Harga</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredPlots.map((plot) => {
                  let statusBadgeClass = 'bg-emerald-100 text-emerald-800';
                  if (plot.status === 'Reserved') statusBadgeClass = 'bg-amber-100 text-amber-800';
                  if (plot.status === 'Sold') statusBadgeClass = 'bg-stone-200 text-stone-600';

                  return (
                    <tr key={plot.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-4 px-6 font-serif font-bold text-stone-900">{plot.plotId}</td>
                      <td className="py-4 px-6">{plot.block}</td>
                      <td className="py-4 px-6">{plot.lotNumber}</td>
                      <td className="py-4 px-6 font-semibold">{plot.landSize} m²</td>
                      <td className="py-4 px-6">{plot.frontage} m</td>
                      <td className="py-4 px-6 text-stone-900 font-medium">{plot.priceFormatted}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusBadgeClass}`}>
                          {plot.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {plot.status === 'Available' ? (
                          <a
                            href={getWaKavLink(`Halo ZIA, saya ingin mengonfirmasi kavling ${plot.plotId} (${plot.landSize}m²) di Kav Hillside.`)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block px-3 py-1.5 bg-[#365314] text-white text-[10px] uppercase tracking-wider font-semibold hover:bg-stone-900 transition-colors"
                          >
                            Pesan Plot
                          </a>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">Telah Terikat</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-stone-500 flex items-center justify-between">
            <span>* Status kavling diperbarui berkala melalui CMS resmi PT ZIA Properti Indonesia.</span>
            <span>Menampilkan {filteredPlots.length} dari {plots.length} kavling</span>
          </div>
        </div>
      </section>

      {/* 4. FAQS */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#365314] font-bold block mb-2">
              Pertanyaan yang Kerap Ditanyakan
            </span>
            <h2 className="text-3xl font-serif text-stone-900">
              Tanya Jawab Kepemilikan Kavling di Kav Hillside
            </h2>
          </div>

          <div className="space-y-4">
            {kavFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-stone-200 bg-stone-50 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-base text-stone-900 font-semibold"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? 'rotate-90 text-[#365314]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.5. LOCATION & GOOGLE MAPS SECTION */}
      <section className="py-20 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#365314] font-bold block mb-2">
              Orientasi Lahan & Koordinat GIS
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-bold">
              Lokasi Kawasan Kav Hillside
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
              Tinjau koordinat lahan, rute jalan utama beraspal, dan kemudahan aksesibilitas transportasi dari kawasan sekitar melalui peta Google Maps resmi.
            </p>
          </div>
          <GoogleMapsView
            initialSelectedId="hills"
            heightClassName="h-[460px]"
            showDirectory={true}
          />
        </div>
      </section>

      {/* 5. INQUIRY FORM */}
      <section id="project-visit-form" className="py-24 bg-[#141b10] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-emerald-300 font-semibold block">
                Konsultasi Kavling & Site Visit
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Pilih dan Amankan Posisi Kavling Terbaik Anda
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Jumlah kavling di kawasan boulevard dan sudut (hook) sangat terbatas. Konsultasikan denah patok dan skema pengikatan bersama tim spesialis Kav Hillside.
              </p>
              <div className="p-4 bg-[#1c2916] border border-stone-700 text-xs text-stone-300">
                <span className="font-semibold block mb-1 text-white">Panduan Pengukuran di Lokasi:</span>
                Kami menyediakan jadwal pendampingan survei fisik ke patok BPN di lokasi pada hari kerja maupun akhir pekan.
              </div>
            </div>

            <div className="lg:col-span-7">
              <LeadCaptureForm
                projectSlug="kav-hillside"
                projectName="Kav Hillside (Kavling Eksklusif)"
                propertyOptions={[
                  'Kavling Boulevard Utama (120 m²)',
                  'Kavling Standar Siap Bangun (96 m²)',
                  'Kavling Pocket Park View (84 m²)',
                  'Konsultasi Pembelian Multi-Kavling'
                ]}
                title="Permintaan Daftar Harga & Site Visit Kav Hillside"
                subtitle="Isi formulir di bawah ini untuk menerima peta kavling detail dan jadwal pendampingan ke lokasi."
                buttonColorClass="bg-stone-100 hover:bg-white text-stone-950 font-bold"
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

import React, { useState } from 'react';
import {
  Wheat,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  HeartHandshake,
  HelpCircle,
  Truck,
  FileBadge,
  ChevronRight
} from 'lucide-react';
import { FAQItem, CompanySettings } from '../types';
import { LeadCaptureForm } from '../components/LeadCaptureForm';
import { cleanWhatsAppNumber, formatIndonesianPhone } from '../lib/contactUtils';

interface ZiaFarmProps {
  faqs: FAQItem[];
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}

export const ZiaFarmPage: React.FC<ZiaFarmProps> = ({
  faqs,
  settings,
  onNavigate
}) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const farmFaqs = faqs.filter((f) => f.projectSlug === 'zia-farm');

  const getWaFarmLink = (text?: string) => {
    const rawNum = settings.farmWhatsApp || '6281288889944';
    const cleanNum = cleanWhatsAppNumber(rawNum, '6281288889944');
    const msg = text || 'Halo Tim ZIA Farm, saya ingin informasi mengenai sapi/domba/kambing kurban dan program kemitraan peternakan.';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* 1. HERO - Documentary Farm Photography & Agricultural Dignity */}
      <section className="relative min-h-[85vh] flex items-center bg-[#241c14] text-stone-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=2000&q=85"
            alt="Peternakan Modern ZIA Farm Bekasi"
            className="w-full h-full object-cover opacity-40 filter saturate-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17120c] via-[#241c14]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17120c] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#4a3a29] bg-[#292017]/90 text-amber-300 text-[11px] uppercase tracking-[0.25em] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Peternakan Berkelanjutan • Kabupaten Bekasi, Jawa Barat
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-6">
              ZIA FARM
              <span className="block text-xl sm:text-2xl font-light text-amber-200/90 font-serif italic mt-3">
                Ekosistem Peternakan Ruminansia & Agrikultur Terpadu
              </span>
            </h1>

            <p className="text-base text-stone-200 font-light leading-relaxed mb-8 max-w-xl">
              Dedikasi pada kebersihan kandang, formulasi nutrisi silase mandiri, seleksi bibit unggul, dan transparansi timbangan hidup untuk kebutuhan qurban, aqiqah, serta pasokan daging higienis.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#services"
                className="px-8 py-4 bg-amber-200 text-stone-900 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-amber-100 transition-all text-center"
              >
                Layanan & Kategori Ternak
              </a>

              <a
                href={getWaFarmLink()}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-stone-500 text-stone-200 hover:text-white hover:border-white text-xs uppercase tracking-[0.2em] font-semibold transition-all text-center"
              >
                Konsultasi WhatsApp ZIA Farm
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-stone-700/60 mt-12 text-xs">
              <div>
                <span className="text-amber-300 uppercase tracking-wider block text-[10px]">Standar Higienitas</span>
                <span className="font-serif text-base text-white">Bebas Residu & Probiotik</span>
              </div>
              <div>
                <span className="text-amber-300 uppercase tracking-wider block text-[10px]">Timbangan Hidup</span>
                <span className="font-serif text-base text-white">Digital Terbuka</span>
              </div>
              <div>
                <span className="text-amber-300 uppercase tracking-wider block text-[10px]">Tenaga Medis</span>
                <span className="font-serif text-base text-white">Dokter Hewan Berkala</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT ZIA FARM & BREEDING PHILOSOPHY */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#854d0e] font-bold block">
                Etika Peternakan Bernurani
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 leading-tight">
                Kesehatan Hewan, Kebersihan Kandang, dan Keberkahan Hasil
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                ZIA Farm lahir sebagai respons terhadap pentingnya rantai pasok protein hewani yang halal, higienis, dan terkelola secara profesional di Kabupaten Bekasi.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                Kami menerapkan manajemen kandang panggung modern dengan ventilasi silang optimal, jadwal pembersihan harian menggunakan dekomposer probiotik ramah lingkungan, serta penyediaan pakan hijauan fermentasi kaya serat dan mineral.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Pakan hijauan berkualitas diperkaya konsentrat bergizi seimbang tanpa pemicu hormon sintetis',
                  'Vaksinasi rutin dan pemantauan berkala bersama tenaga dokter hewan profesional',
                  'Kandang panggung kayu terangkat menjamin drainase kotoran higienis tanpa genangan amonia',
                  'Pengolahan limbah organik peternakan menjadi pupuk kompos hayati ramah lingkungan',
                  'Transparansi penimbangan berat hidup secara langsung di hadapan pembeli'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-stone-700">
                    <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"
                  alt="Kandang Sehat ZIA Farm"
                  className="w-full h-64 object-cover border border-stone-200 shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80"
                  alt="Ternak Domba Sehat ZIA Farm"
                  className="w-full h-64 object-cover border border-stone-200 shadow-md translate-y-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVESTOCK CATEGORIES & SERVICES */}
      <section id="services" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#854d0e] font-bold block mb-2">
              Layanan Utama
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
              Koleksi Hewan Ternak & Program Khusus
            </h2>
            <p className="text-sm text-stone-600">
              Setiap hewan ternak melalui seleksi ketat umur (cukup poel), bebas cacat fisik, dan sehat jasmani sesuai syariat Islam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Domba & Kambing Premium */}
            <div className="bg-white border border-stone-200 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-[#854d0e] flex items-center justify-center mb-6">
                  <Wheat className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                  Domba & Kambing Pedaging
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  Tersedia varietas domba Garut, Dorper silang, kambing Jawa Randu, dan PE (Peranakan Etawa) dengan bobot terpantau berkala mulai 25 kg hingga di atas 50 kg.
                </p>
                <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1 mb-6">
                  <p>• Perawatan sanitasi kuku & bulu terjadwal</p>
                  <p>• Siap antar Jabodetabek</p>
                  <p>• Layanan titip rawat gratis hingga hari H</p>
                </div>
              </div>
              <a
                href={getWaFarmLink('Halo ZIA Farm, saya ingin menanyakan daftar domba/kambing yang tersedia.')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 border border-stone-900 text-stone-900 text-xs uppercase tracking-widest font-semibold text-center hover:bg-stone-900 hover:text-white transition-colors"
              >
                Tanya Stok Domba
              </a>
            </div>

            {/* 2. Sapi Potong & Qurban */}
            <div className="bg-white border border-stone-200 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-[#854d0e] flex items-center justify-center mb-6">
                  <FileBadge className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                  Sapi Limousin & Simental
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  Penyediaan sapi potong sehat berbobot 300 kg hingga 800+ kg untuk keperluan hari raya qurban instansi, perusahaan, panitia masjid, maupun perorangan.
                </p>
                <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1 mb-6">
                  <p>• Disertai Surat Keterangan Kesehatan Hewan (SKKH)</p>
                  <p>• Pengiriman dengan armada truk khusus beratap</p>
                  <p>• Jaminan garansi hewan sehat hingga lokasi</p>
                </div>
              </div>
              <a
                href={getWaFarmLink('Halo ZIA Farm, saya ingin meminta katalog sapi qurban dan penawaran instansi.')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 border border-stone-900 text-stone-900 text-xs uppercase tracking-widest font-semibold text-center hover:bg-stone-900 hover:text-white transition-colors"
              >
                Katalog Sapi Qurban
              </a>
            </div>

            {/* 3. Paket Aqiqah & Olahan Siap Saji */}
            <div className="bg-white border border-stone-200 p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-[#854d0e] flex items-center justify-center mb-6">
                  <HeartHandshake className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">
                  Aqiqah Syar'i & Higienis
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-6">
                  Layanan terpadu penyembelihan syariat, dokumentasi video pemotongan berniat atas nama anak, hingga pengolahan masakan lezat (gulai, tongseng, sate) bebas bau prengus.
                </p>
                <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1 mb-6">
                  <p>• Dapur higienis berstandar kebersihan tinggi</p>
                  <p>• Kemasan bento box eksklusif ramah lingkungan</p>
                  <p>• Sertifikat aqiqah resmi ZIA Farm</p>
                </div>
              </div>
              <a
                href={getWaFarmLink('Halo ZIA Farm, saya ingin berkonsultasi mengenai paket aqiqah putra/putri saya.')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 border border-stone-900 text-stone-900 text-xs uppercase tracking-widest font-semibold text-center hover:bg-stone-900 hover:text-white transition-colors"
              >
                Pilihan Paket Aqiqah
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQS */}
      <section className="py-24 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#854d0e] font-bold block mb-2">
              Pertanyaan yang Kerap Ditanyakan
            </span>
            <h2 className="text-3xl font-serif text-stone-900">
              Tanya Jawab Seputar Layanan ZIA Farm
            </h2>
          </div>

          <div className="space-y-4">
            {farmFaqs.map((faq) => {
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
                        isOpen ? 'rotate-90 text-[#854d0e]' : ''
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

      {/* 5. INQUIRY FORM */}
      <section className="py-24 bg-[#1a140d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-amber-300 font-semibold block">
                Kunjungan Kandang & Pemesanan
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Pilih Langsung Ternak Anda di Peternakan ZIA Farm
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Kami menyambut kunjungan calon shohibul qurban atau keluarga untuk melihat langsung proses pemeliharaan ternak, mengukur bobot timbangan, dan menandai hewan pilihan Anda.
              </p>
              <div className="p-4 bg-[#292015] border border-amber-900/60 text-xs text-amber-200">
                <span className="font-semibold block mb-1">Jaminan Garansi Hewan Sehat:</span>
                Apabila hewan sakit atau wafat sebelum hari pengiriman, kami mengganti 100% dengan hewan setara bobot tanpa biaya tambahan.
              </div>
            </div>

            <div className="lg:col-span-7">
              <LeadCaptureForm
                projectSlug="zia-farm"
                projectName="ZIA Farm (Peternakan Bekasi)"
                propertyOptions={[
                  'Domba / Kambing Qurban',
                  'Sapi Qurban (Perorangan / Kolektif)',
                  'Paket Aqiqah Lengkap Siap Santap',
                  'Kemitraan Pasokan Daging Restoran / Katering'
                ]}
                title="Formulir Konsultasi & Kunjungan Kandang"
                subtitle="Isi kontak Anda agar staf peternakan kami dapat membagikan katalog bobot ternak dan panduan rute ke kandang."
                buttonColorClass="bg-amber-300 hover:bg-amber-200 text-stone-950 font-bold"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

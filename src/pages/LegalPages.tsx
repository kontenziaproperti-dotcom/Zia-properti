import React from 'react';

export const LegalPages: React.FC<{
  type: 'privacy' | 'terms';
  onNavigate: (route: string) => void;
}> = ({ type, onNavigate }) => {
  return (
    <div className="min-h-screen bg-stone-50 font-sans py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 border border-stone-200">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-2">
          Legal & Compliance PT ZIA Properti Indonesia
        </span>

        {type === 'privacy' ? (
          <div>
            <h1 className="text-3xl font-serif text-stone-900 mb-6">
              Kebijakan Privasi (Privacy Policy)
            </h1>
            <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <p>
                PT ZIA Properti Indonesia ("kami") berkomitmen untuk melindungi dan menghormati privasi data pribadi Anda sesuai regulasi perlindungan data yang berlaku di Republik Indonesia.
              </p>
              <h2 className="font-serif text-base font-bold text-stone-900 pt-2">
                1. Pengumpulan Informasi
              </h2>
              <p>
                Informasi yang dikumpulkan melalui formulir situs web kami (seperti nama lengkap, nomor WhatsApp, email, dan preferensi unit properti) digunakan semata-mata untuk merespons permintaan informasi resmi, penjadwalan survei ke lokasi perumahan/kavling, atau pengiriman sampel ekspor Altara ZIA.
              </p>
              <h2 className="font-serif text-base font-bold text-stone-900 pt-2">
                2. Kerahasiaan Data
              </h2>
              <p>
                Kami tidak pernah menjual, menyewakan, atau mendistribusikan data kontak pribadi Anda kepada pihak ketiga manapun untuk tujuan pemasaran di luar kepentingan resmi transaksi PT ZIA Properti Indonesia.
              </p>
              <h2 className="font-serif text-base font-bold text-stone-900 pt-2">
                3. Keamanan Informasi
              </h2>
              <p>
                Seluruh data prospek diamankan menggunakan enkripsi database Firestore berstandar internasional dengan pembatasan hak akses berbasis peran administrator (RBAC).
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-serif text-stone-900 mb-6">
              Syarat & Ketentuan (Terms of Service)
            </h1>
            <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <p>
                Selamat datang di platform resmi PT ZIA Properti Indonesia. Dengan mengakses situs web ini, Anda menyetujui ketentuan-ketentuan berikut.
              </p>
              <h2 className="font-serif text-base font-bold text-stone-900 pt-2">
                1. Informasi Properti & Penawaran
              </h2>
              <p>
                Ilustrasi visual arsitektur, denah, dan tata letak kawasan ditampilkan sebagai panduan visual konseptual. Segala rincian spesifikasi teknis definitif, harga, dan ketentuan kepemilikan mengacu pada Perjanjian Pengikatan Jual Beli (PPJB) resmi dan akta notaris yang sah.
              </p>
              <h2 className="font-serif text-base font-bold text-stone-900 pt-2">
                2. Hak Kekayaan Intelektual
              </h2>
              <p>
                Seluruh merek dagang ZIA Emerald, Kav Hillside, ZIA Farm, dan Altara ZIA International beserta logo, tata desain, dan teks merupakan kekayaan intelektual milik PT ZIA Properti Indonesia.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center text-xs">
          <button
            onClick={() => onNavigate('/')}
            className="text-stone-900 font-semibold uppercase tracking-wider hover:underline"
          >
            ← Kembali ke Beranda
          </button>
          <span className="text-stone-400">Terakhir diperbarui: September 2026</span>
        </div>
      </div>
    </div>
  );
};

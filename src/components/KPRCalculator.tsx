import React, { useMemo, useState } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import { PropertyItem } from '../types';

interface KPRCalculatorProps {
  properties: PropertyItem[];
}

const formatIDR = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export const KPRCalculator: React.FC<KPRCalculatorProps> = ({ properties }) => {
  const [selectedId, setSelectedId] = useState(properties[0]?.id || '');
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [annualInterestPercent, setAnnualInterestPercent] = useState(8.5);
  const [tenorYears, setTenorYears] = useState(20);

  const selected = properties.find((property) => property.id === selectedId) || properties[0];
  const price = Math.max(0, selected?.price || 0);

  const calculation = useMemo(() => {
    const downPayment = price * (downPaymentPercent / 100);
    const principal = Math.max(0, price - downPayment);
    const monthlyRate = annualInterestPercent / 100 / 12;
    const months = tenorYears * 12;
    const monthlyInstallment =
      months <= 0
        ? 0
        : monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return {
      downPayment,
      principal,
      monthlyInstallment,
      totalInstallments: monthlyInstallment * months,
      totalEstimatedOutlay: downPayment + monthlyInstallment * months
    };
  }, [price, downPaymentPercent, annualInterestPercent, tenorYears]);

  return (
    <section id="kalkulator-kpr" className="py-20 sm:py-24 bg-[#092b21] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-5">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-amber-200 font-semibold">
              <Calculator className="w-4 h-4" /> Perencanaan Pembiayaan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
              Kalkulator KPR <span className="italic text-amber-200">ZIA Emerald</span>
            </h2>
            <p className="text-sm leading-relaxed text-stone-300">
              Simulasikan uang muka, tenor, dan perkiraan cicilan bulanan untuk membantu menyiapkan konsultasi dengan tim sales dan bank.
            </p>
            <div className="border border-emerald-800 bg-[#0d3629] p-4 text-xs leading-relaxed text-emerald-50">
              <Info className="w-4 h-4 text-amber-200 mb-2" />
              Harga mengambil data unit yang tersedia pada sistem. Suku bunga adalah asumsi yang bisa Anda ubah, bukan penawaran bank atau jaminan persetujuan KPR.
            </div>
            <a
              href="#emerald-visit-form"
              className="inline-flex items-center gap-3 bg-amber-200 hover:bg-amber-100 text-[#092b21] px-6 py-3.5 text-xs uppercase tracking-[0.15em] font-bold transition-colors"
            >
              Konsultasi Hasil Simulasi <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="lg:col-span-8 bg-white text-stone-900 border border-amber-200/60 shadow-xl">
            <div className="p-6 sm:p-8 border-b border-stone-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#0f4c3a] font-bold block mb-2">Simulasi Indikatif</span>
                <h3 className="font-serif text-2xl sm:text-3xl">Rencana Cicilan Rumah</h3>
              </div>
              <div className="hidden sm:flex w-12 h-12 items-center justify-center bg-emerald-50 text-[#0f4c3a] border border-emerald-100">
                <Calculator className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="kpr-type" className="block text-xs font-semibold text-stone-600 mb-2">Tipe rumah</label>
                  <select
                    id="kpr-type"
                    value={selected?.id || ''}
                    onChange={(event) => setSelectedId(event.target.value)}
                    className="w-full border border-stone-300 bg-white px-3 py-3 text-sm focus:border-[#0f4c3a] focus:outline-none"
                  >
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>{property.name} · {property.type}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200">
                  <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Harga data unit</span>
                  <strong className="font-serif text-2xl text-[#0f4c3a]">{price > 0 ? formatIDR(price) : 'Konfirmasi ke sales'}</strong>
                  <p className="text-[11px] text-stone-500 mt-2">Nilai harga dapat diperbarui melalui modul Properti di CMS.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor="kpr-down-payment" className="text-xs font-semibold text-stone-600">Uang muka (DP)</label>
                    <strong className="text-sm text-[#0f4c3a]">{downPaymentPercent}%</strong>
                  </div>
                  <input
                    id="kpr-down-payment"
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(event) => setDownPaymentPercent(Number(event.target.value))}
                    className="w-full accent-emerald-800"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1"><span>5%</span><span>50%</span></div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor="kpr-interest" className="text-xs font-semibold text-stone-600">Asumsi bunga per tahun</label>
                    <strong className="text-sm text-[#0f4c3a]">{annualInterestPercent.toFixed(2).replace('.', ',')}%</strong>
                  </div>
                  <input
                    id="kpr-interest"
                    type="range"
                    min="0"
                    max="15"
                    step="0.25"
                    value={annualInterestPercent}
                    onChange={(event) => setAnnualInterestPercent(Number(event.target.value))}
                    className="w-full accent-emerald-800"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1"><span>0%</span><span>15%</span></div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-stone-600 mb-2">Tenor</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[10, 15, 20, 25, 30].map((years) => (
                      <button
                        key={years}
                        type="button"
                        onClick={() => setTenorYears(years)}
                        aria-pressed={tenorYears === years}
                        className={`border px-2 py-2 text-xs font-semibold transition-colors ${tenorYears === years ? 'bg-[#0f4c3a] border-[#0f4c3a] text-white' : 'border-stone-300 text-stone-600 hover:border-[#0f4c3a]'}`}
                      >
                        {years} th
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-[#0f4c3a] text-white p-5 sm:p-6">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-100 mb-2">Estimasi Cicilan Bulanan</span>
                  <strong className="font-serif text-3xl sm:text-4xl break-words">{price > 0 ? formatIDR(calculation.monthlyInstallment) : 'Konfirmasi ke sales'}</strong>
                  <span className="block text-xs text-emerald-100 mt-2">Perhitungan anuitas, belum termasuk asuransi, biaya bank, pajak, dan biaya transaksi.</span>
                </div>
                <div className="border border-stone-200 divide-y divide-stone-200">
                  <div className="p-4 flex justify-between items-start gap-3 text-sm">
                    <span className="text-stone-500">Uang muka estimasi</span>
                    <strong className="text-stone-900 text-right">{formatIDR(calculation.downPayment)}</strong>
                  </div>
                  <div className="p-4 flex justify-between items-start gap-3 text-sm">
                    <span className="text-stone-500">Pokok pinjaman</span>
                    <strong className="text-stone-900 text-right">{formatIDR(calculation.principal)}</strong>
                  </div>
                  <div className="p-4 flex justify-between items-start gap-3 text-sm">
                    <span className="text-stone-500">Total estimasi angsuran</span>
                    <strong className="text-stone-900 text-right">{formatIDR(calculation.totalInstallments)}</strong>
                  </div>
                  <div className="p-4 flex justify-between items-start gap-3 text-sm">
                    <span className="text-stone-500">DP + estimasi angsuran</span>
                    <strong className="text-[#0f4c3a] text-right">{formatIDR(calculation.totalEstimatedOutlay)}</strong>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-500">
                  Simulasi hanya untuk perencanaan. Cicilan aktual dipengaruhi kebijakan bank, profil pemohon, skema bunga fixed/floating, asuransi, appraisal, dan biaya lainnya. Minta simulasi resmi sebelum mengambil keputusan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

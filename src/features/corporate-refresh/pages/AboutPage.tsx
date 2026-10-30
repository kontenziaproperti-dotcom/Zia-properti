import React from 'react';
import { ArrowRight, Compass, Eye, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { CompanySettings } from '../../../types';
import { ADDITIONAL_BUSINESS_UNITS, CORPORATE_BUSINESS_LINKS } from '../businessUnits';
import { CorporateBusinessCard } from '../components/CorporateBusinessCard';
import { CorporatePageHero } from '../components/CorporatePageHero';

interface AboutPageProps {
  settings: CompanySettings;
  onNavigate: (route: string) => void;
}

const values = [
  {
    title: 'Integritas',
    description: 'Setiap langkah bisnis dilandasi kejujuran, tanggung jawab, dan komunikasi yang dapat dipertanggungjawabkan.',
    icon: ShieldCheck,
  },
  {
    title: 'Keunggulan',
    description: 'Standar kualitas dan layanan dikembangkan sesuai karakter serta kebutuhan setiap lini usaha.',
    icon: Target,
  },
  {
    title: 'Inovasi',
    description: 'Solusi dan cara kerja terus disesuaikan dengan kebutuhan pelanggan, mitra, dan perubahan pasar.',
    icon: Sparkles,
  },
];

const missions = [
  'Mengembangkan hunian dan kawasan yang dirancang dengan memperhatikan kualitas, fungsi, dan kenyamanan jangka panjang.',
  'Menghadirkan pilihan kavling dan peluang properti dengan informasi produk serta proses yang transparan.',
  'Mengembangkan agribisnis, peternakan, dan komoditas vanilla dengan tata kelola serta hubungan kemitraan yang bertanggung jawab.',
  'Mengembangkan lini retail, perdagangan, dan direct selling yang dekat dengan kebutuhan pelanggan dan komunitas.',
];

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const units = [...CORPORATE_BUSINESS_LINKS, ...ADDITIONAL_BUSINESS_UNITS];

  return (
    <div className="se-corporate-page se-about-page">
      <CorporatePageHero
        eyebrow="Profil · ZIA Corporate"
        title="Membangun Masa Depan Bersama, Melalui Enam Lini Bisnis"
        description="ZIA Corporate mengembangkan kelompok usaha lintas sektor dengan semangat integritas, kualitas, dan penciptaan nilai jangka panjang."
      />

      <section className="se-section">
        <div className="se-page-container se-about-intro">
          <div className="se-about-intro__copy">
            <p className="se-section-eyebrow">Tentang ZIA Corporate</p>
            <h2 className="se-section-title">Setiap ruang dan layanan membawa nilai.</h2>
            <p>
              Berangkat dari pengembangan properti dan kawasan, ekosistem ZIA bertumbuh ke sektor agribisnis, peternakan, perdagangan, retail, dan direct selling. Setiap unit memiliki fokus operasional sendiri, namun berada dalam satu ekosistem yang mengedepankan hubungan jangka panjang dengan pelanggan dan mitra.
            </p>
            <p>
              Materi identitas ZIA Corporate menempatkan Cikarang dan Bekasi sebagai basis aktivitas, dengan cakupan usaha yang menjangkau kebutuhan lokal hingga hubungan perdagangan internasional.
            </p>
            <button type="button" className="se-text-link" onClick={() => onNavigate('/projects')}>
              Lihat portofolio bisnis <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          <aside className="se-about-intro__panel">
            <p className="se-about-intro__panel-label">Ekosistem usaha</p>
            <strong>6</strong>
            <span>lini bisnis dalam satu identitas korporat</span>
            <div className="se-about-intro__panel-rule" />
            <p>Properti · Agribisnis · Ekspor · Retail · Direct Selling</p>
          </aside>
        </div>
      </section>

      <section className="se-section se-section--soft">
        <div className="se-page-container">
          <div className="se-section-heading">
            <p className="se-section-eyebrow">Nilai perusahaan</p>
            <h2 className="se-section-title">Prinsip yang menyatukan seluruh lini usaha</h2>
            <p className="se-section-description">Satu identitas korporat, dengan fokus dan karakter operasional yang tetap relevan pada setiap unit bisnis.</p>
          </div>
          <div className="se-value-grid">
            {values.map(({ title, description, icon: Icon }) => (
              <article className="se-value-card" key={title}>
                <span className="se-value-card__icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="se-section">
        <div className="se-page-container se-vision-grid">
          <article className="se-vision-card se-vision-card--vision">
            <span className="se-vision-card__icon"><Eye size={24} strokeWidth={1.4} aria-hidden="true" /></span>
            <p className="se-section-eyebrow">Visi</p>
            <h2>Menjadi kelompok usaha terpercaya di Asia Tenggara.</h2>
            <p>Dipercaya pelanggan, karyawan, masyarakat, dan para pemangku kepentingan melalui bisnis yang berintegritas dan berkelanjutan.</p>
          </article>
          <article className="se-vision-card">
            <span className="se-vision-card__icon"><Compass size={24} strokeWidth={1.4} aria-hidden="true" /></span>
            <p className="se-section-eyebrow">Misi</p>
            <h2>Mengembangkan usaha yang relevan dan bertanggung jawab.</h2>
            <ul>
              {missions.map((mission) => <li key={mission}>{mission}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="se-section se-section--soft">
        <div className="se-page-container">
          <div className="se-section-heading se-section-heading--split">
            <div>
              <p className="se-section-eyebrow">Portofolio usaha</p>
              <h2 className="se-section-title">Enam lini bisnis ZIA Corporate</h2>
            </div>
            <p className="se-section-description">Jelajahi setiap entitas untuk memahami layanan, fokus, dan karakter bisnisnya.</p>
          </div>
          <div className="se-business-grid">
            {units.map((unit) => (
              <CorporateBusinessCard key={unit.slug} item={unit} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      <section className="se-corporate-cta">
        <div className="se-page-container se-corporate-cta__inner">
          <div>
            <p className="se-section-eyebrow">Terhubung dengan ZIA</p>
            <h2>Mari mulai percakapan bisnis.</h2>
            <p>Hubungi tim korporat untuk pertanyaan, kemitraan, maupun informasi masing-masing unit usaha.</p>
          </div>
          <button type="button" className="se-button se-button--gold" onClick={() => onNavigate('/contact')}>
            Hubungi Kami <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      <div className="se-about-office">
        <div className="se-page-container">
          <strong>{settings.companyName}</strong>
          <span>{settings.fullAddress}</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, PackageCheck } from 'lucide-react';
import { ADDITIONAL_BUSINESS_UNITS, getAdditionalBusinessUnit } from '../businessUnits';
import { CorporatePageHero } from '../components/CorporatePageHero';

interface BusinessUnitPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const BusinessUnitPage: React.FC<BusinessUnitPageProps> = ({ slug, onNavigate }) => {
  const unit = getAdditionalBusinessUnit(slug);

  if (!unit) {
    return (
      <section className="se-corporate-page se-unit-not-found">
        <div className="se-page-container">
          <h1>Informasi unit bisnis belum tersedia.</h1>
          <button type="button" className="se-button se-button--primary" onClick={() => onNavigate('/projects')}>
            Kembali ke direktori bisnis
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className={`se-corporate-page se-business-unit-page se-business-unit-page--${unit.visual}`}>
      <CorporatePageHero
        eyebrow={unit.eyebrow}
        title={unit.name}
        description={unit.summary}
        compact
      />

      <section className="se-section se-section--intro">
        <div className="se-page-container se-unit-intro-grid">
          <div>
            <p className="se-section-eyebrow">Tentang lini bisnis</p>
            <h2 className="se-section-title">{unit.tagline}</h2>
          </div>
          <div className="se-unit-intro-copy">
            <p>{unit.intro}</p>
            <p className="se-unit-location">{unit.location}</p>
            <button type="button" className="se-text-link" onClick={() => onNavigate('/contact')}>
              Hubungi tim {unit.name} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="se-section se-section--soft">
        <div className="se-page-container">
          <div className="se-section-heading">
            <p className="se-section-eyebrow">Ruang lingkup layanan</p>
            <h2 className="se-section-title">
              {unit.slug === 'zia-direct' ? 'Produk untuk kebutuhan rumah' : 'Kategori yang kami tawarkan'}
            </h2>
            <p className="se-section-description">
              {unit.slug === 'zia-direct'
                ? 'Ragam kategori perlengkapan rumah tangga yang tercantum dalam materi ZIA Direct.'
                : 'Ragam kategori retail dan perdagangan yang tercantum dalam materi ZIA Raya.'}
            </p>
          </div>
          <div className="se-unit-category-grid">
            {unit.categories.map((category, index) => (
              <article className="se-unit-category-card" key={category.title}>
                <span className="se-unit-category-card__number">{String(index + 1).padStart(2, '0')}</span>
                <PackageCheck size={22} strokeWidth={1.4} aria-hidden="true" />
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {unit.process ? (
        <section className="se-section">
          <div className="se-page-container">
            <div className="se-section-heading">
              <p className="se-section-eyebrow">Program kemitraan</p>
              <h2 className="se-section-title">Langkah bergabung bersama ZIA Direct</h2>
            </div>
            <ol className="se-unit-process">
              {unit.process.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="se-section se-section--soft">
        <div className="se-page-container">
          <div className="se-section-heading">
            <p className="se-section-eyebrow">Komitmen layanan</p>
            <h2 className="se-section-title">Nilai yang kami jaga</h2>
          </div>
          <div className="se-unit-commitment-grid">
            {unit.commitments.map((item) => (
              <article className="se-unit-commitment" key={item.title}>
                <CheckCircle2 size={20} aria-hidden="true" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="se-unit-cta">
        <div className="se-page-container se-unit-cta__inner">
          <div>
            <p className="se-section-eyebrow">Informasi & kemitraan</p>
            <h2>Terhubung dengan {unit.name}</h2>
            <p>Hubungi tim ZIA Corporate untuk mendapatkan informasi produk, ketersediaan, dan ketentuan layanan yang berlaku.</p>
          </div>
          <button type="button" className="se-button se-button--gold" onClick={() => onNavigate('/contact')}>
            <MessageCircle size={16} aria-hidden="true" /> Hubungi Kami
          </button>
        </div>
      </section>
    </div>
  );
};

export { ADDITIONAL_BUSINESS_UNITS };

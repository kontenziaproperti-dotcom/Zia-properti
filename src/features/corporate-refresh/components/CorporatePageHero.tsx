import React from 'react';

interface CorporatePageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl?: string;
  compact?: boolean;
}

export const CorporatePageHero: React.FC<CorporatePageHeroProps> = ({
  eyebrow,
  title,
  description,
  imageUrl,
  compact = false,
}) => (
  <section className={`se-page-hero ${compact ? 'se-page-hero--compact' : ''}`}>
    {imageUrl ? (
      <div className="se-page-hero__image" style={{ backgroundImage: `url("${imageUrl}")` }} aria-hidden="true" />
    ) : null}
    <div className="se-page-hero__veil" aria-hidden="true" />
    <div className="se-page-hero__inner">
      <p className="se-page-hero__eyebrow">{eyebrow}</p>
      <h1 className="se-page-hero__title">{title}</h1>
      <p className="se-page-hero__description">{description}</p>
    </div>
    <div className="se-page-hero__rule" aria-hidden="true" />
  </section>
);

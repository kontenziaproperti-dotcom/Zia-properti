import React from 'react';
import { ArrowUpRight, Building2, Wheat, Sprout, Globe2, ShoppingBag, Users } from 'lucide-react';
import { BusinessDirectoryItem } from '../businessUnits';

interface CorporateBusinessCardProps {
  item: BusinessDirectoryItem;
  onNavigate: (route: string) => void;
  featured?: boolean;
}

const icons = {
  building: Building2,
  land: Sprout,
  farm: Wheat,
  globe: Globe2,
  shopping: ShoppingBag,
  network: Users,
};

export const CorporateBusinessCard: React.FC<CorporateBusinessCardProps> = ({
  item,
  onNavigate,
  featured = false,
}) => {
  const Icon = icons[item.icon];
  // Never present known stock photography as an official ZIA business asset.
  const hasApprovedImage = Boolean(item.heroImage?.trim() && !/images\\.unsplash\\.com/i.test(item.heroImage));

  return (
    <article className={`se-business-card se-business-card--${item.visual} ${featured ? 'se-business-card--featured' : ''}`}>
      <button
        type="button"
        className="se-business-card__visual"
        onClick={() => onNavigate(item.route)}
        aria-label={`Buka ${item.name}`}
      >
        {hasApprovedImage ? (
          <img src={item.heroImage} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="se-business-card__symbol" aria-hidden="true">
            <Icon size={42} strokeWidth={1.25} />
          </span>
        )}
        <span className="se-business-card__visual-caption">ZIA Corporate · Business Portfolio</span>
      </button>
      <div className="se-business-card__body">
        <div className="se-business-card__meta">
          <span>{item.sector}</span>
          <span>{item.location}</span>
        </div>
        <h3>{item.name}</h3>
        {item.tagline ? <p className="se-business-card__tagline">{item.tagline}</p> : null}
        <p className="se-business-card__summary">{item.summary}</p>
        <button type="button" className="se-business-card__link" onClick={() => onNavigate(item.route)}>
          Jelajahi lini bisnis <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

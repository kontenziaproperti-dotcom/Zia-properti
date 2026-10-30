import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProjectEntity, PropertyItem } from '../../../types';
import { BusinessCategory, getBusinessDirectoryItems } from '../businessUnits';
import { CorporateBusinessCard } from '../components/CorporateBusinessCard';
import { CorporatePageHero } from '../components/CorporatePageHero';

interface ProjectDirectoryProps {
  projects: ProjectEntity[];
  properties: PropertyItem[];
  onNavigate: (route: string) => void;
}

const filters: { label: string; value: 'all' | BusinessCategory }[] = [
  { label: 'Semua lini bisnis', value: 'all' },
  { label: 'Properti', value: 'property' },
  { label: 'Peternakan & Agribisnis', value: 'agriculture' },
  { label: 'Ekspor', value: 'export' },
  { label: 'Retail & Perdagangan', value: 'retail' },
  { label: 'Direct Selling', value: 'direct' },
];

export const ProjectDirectoryPage: React.FC<ProjectDirectoryProps> = ({
  projects,
  properties,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BusinessCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const items = useMemo(() => getBusinessDirectoryItems(projects), [projects]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const search = searchQuery.trim().toLowerCase();
    const matchesSearch = !search || [item.name, item.sector, item.location, item.summary]
      .some((value) => value.toLowerCase().includes(search));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="se-corporate-page se-directory-page">
      <CorporatePageHero
        eyebrow="Portofolio · ZIA Corporate"
        title="Enam lini bisnis, satu ekosistem."
        description="Jelajahi portofolio ZIA Corporate dari pengembangan properti hingga agribisnis, ekspor, retail, dan direct selling."
      />

      <section className="se-directory-toolbar">
        <div className="se-page-container">
          <div className="se-directory-toolbar__heading">
            <div>
              <p className="se-section-eyebrow">Direktori bisnis</p>
              <h2>Temukan unit usaha yang Anda cari</h2>
            </div>
            <span className="se-directory-count">{filteredItems.length} dari {items.length} lini</span>
          </div>
          <div className="se-directory-controls">
            <div className="se-directory-filters" role="group" aria-label="Filter kategori bisnis">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setSelectedCategory(filter.value)}
                  className={`se-filter-chip ${selectedCategory === filter.value ? 'is-active' : ''}`}
                  aria-pressed={selectedCategory === filter.value}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="se-search-field">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Cari lini bisnis atau lokasi</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari lini bisnis atau lokasi..."
              />
            </label>
          </div>
        </div>
      </section>

      <section className="se-section">
        <div className="se-page-container">
          {filteredItems.length ? (
            <div className="se-business-grid">
              {filteredItems.map((item) => (
                <CorporateBusinessCard
                  key={item.slug}
                  item={item}
                  onNavigate={onNavigate}
                  featured={properties.some((property) => property.projectSlug === item.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="se-empty-state">
              <SlidersHorizontal size={28} aria-hidden="true" />
              <h2>Tidak ada lini bisnis yang cocok.</h2>
              <p>Coba kata kunci atau kategori lain.</p>
              <button
                type="button"
                className="se-button se-button--outline"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              >
                Reset filter
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, Search, X } from 'lucide-react';
import { PostItem } from '../../../types';
import { CorporatePageHero } from '../components/CorporatePageHero';

interface BlogPageProps {
  posts: PostItem[];
  onNavigate: (route: string) => void;
}

const formatDate = (value?: string) => {
  if (!value) return 'Tanggal belum tersedia';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Tanggal belum tersedia' : date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

export const BlogPage: React.FC<BlogPageProps> = ({ posts, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua topik');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<PostItem | null>(null);

  // Never expose unpublished CMS drafts on the public corporate website.
  const publishedPosts = useMemo(() => posts.filter((post) => post.published === true && post.status !== 'draft'), [posts]);

  const categories = useMemo(() => [
    'Semua topik',
    ...Array.from(new Set(publishedPosts.map((post) => post.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id')),
  ], [publishedPosts]);

  const sortedPosts = useMemo(() => [...publishedPosts].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    return (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0);
  }), [publishedPosts]);

  const filteredPosts = sortedPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'Semua topik' || post.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [post.title, post.summary, post.content, post.category]
      .some((value) => (value || '').toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find((post) => post.featured) || filteredPosts[0] || null;
  const remainingPosts = featuredPost ? filteredPosts.filter((post) => post.id !== featuredPost.id) : filteredPosts;

  useEffect(() => {
    if (!activeArticle) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveArticle(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeArticle]);

  return (
    <div className="se-corporate-page se-blog-page">
      <CorporatePageHero
        eyebrow="Publikasi · ZIA Corporate"
        title="Wawasan, berita, dan cerita dari ekosistem ZIA."
        description="Ikuti informasi dan artikel resmi dari lini properti, agribisnis, perdagangan, retail, serta kemitraan ZIA Corporate."
        compact
      />

      <section className="se-blog-toolbar">
        <div className="se-page-container">
          <div className="se-blog-toolbar__top">
            <div>
              <p className="se-section-eyebrow">Pusat informasi</p>
              <h2>Berita & wawasan terbaru</h2>
            </div>
            <label className="se-search-field se-search-field--blog">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Cari berita atau artikel</span>
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari berita atau artikel..." />
            </label>
          </div>
          <div className="se-directory-filters" role="group" aria-label="Filter topik publikasi">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`se-filter-chip ${selectedCategory === category ? 'is-active' : ''}`}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="se-section">
        <div className="se-page-container">
          {featuredPost ? (
            <article className="se-blog-featured">
              <div className="se-blog-featured__image">
                {featuredPost.coverImage ? <img src={featuredPost.coverImage} alt="" loading="lazy" decoding="async" /> : null}
              </div>
              <div className="se-blog-featured__content">
                <p className="se-section-eyebrow">Sorotan publikasi</p>
                <span className="se-blog-category">{featuredPost.category}</span>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.summary}</p>
                <div className="se-blog-meta"><CalendarDays size={14} aria-hidden="true" /> {formatDate(featuredPost.createdAt)}</div>
                <button type="button" className="se-text-link" onClick={() => setActiveArticle(featuredPost)}>
                  Baca selengkapnya <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ) : null}

          <div className="se-blog-results-heading">
            <h2>{selectedCategory === 'Semua topik' ? 'Semua publikasi' : selectedCategory}</h2>
            <span>{filteredPosts.length} artikel</span>
          </div>

          {remainingPosts.length ? (
            <div className="se-blog-grid">
              {remainingPosts.map((post) => (
                <article className="se-blog-card" key={post.id}>
                  <button type="button" className="se-blog-card__image" onClick={() => setActiveArticle(post)} aria-label={`Baca ${post.title}`}>
                    {post.coverImage ? <img src={post.coverImage} alt="" loading="lazy" decoding="async" /> : <span>ZIA Corporate</span>}
                  </button>
                  <div className="se-blog-card__content">
                    <span className="se-blog-category">{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                    <div className="se-blog-card__footer">
                      <time>{formatDate(post.createdAt)}</time>
                      <button type="button" onClick={() => setActiveArticle(post)} aria-label={`Baca selengkapnya: ${post.title}`}>
                        Baca <ArrowUpRight size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : !featuredPost ? (
            <div className="se-empty-state">
              <h2>Belum ada publikasi untuk pencarian ini.</h2>
              <p>Konten yang tampil mengikuti artikel yang tersedia dan dipublikasikan melalui CMS.</p>
              <button type="button" className="se-button se-button--outline" onClick={() => { setSearchQuery(''); setSelectedCategory('Semua topik'); }}>
                Reset pencarian
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {activeArticle ? (
        <div className="se-article-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveArticle(null); }}>
          <article className="se-article-modal__panel" role="dialog" aria-modal="true" aria-labelledby="se-article-title">
            <button type="button" className="se-article-modal__close" aria-label="Tutup artikel" autoFocus onClick={() => setActiveArticle(null)}><X size={20} /></button>
            {activeArticle.coverImage ? <img className="se-article-modal__image" src={activeArticle.coverImage} alt="" /> : null}
            <div className="se-article-modal__body">
              <span className="se-blog-category">{activeArticle.category}</span>
              <div className="se-blog-meta"><CalendarDays size={14} aria-hidden="true" /> {formatDate(activeArticle.createdAt)} · {activeArticle.author}</div>
              <h2 id="se-article-title">{activeArticle.title}</h2>
              <p className="se-article-modal__summary">{activeArticle.summary}</p>
              <div className="se-article-content">
                {(activeArticle.content || '').split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
              <div className="se-article-modal__actions">
                <button type="button" className="se-button se-button--outline" onClick={() => setActiveArticle(null)}>Tutup artikel</button>
                <button type="button" className="se-button se-button--primary" onClick={() => { setActiveArticle(null); onNavigate('/contact'); }}>Hubungi ZIA Corporate</button>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
};

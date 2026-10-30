import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Filter,
  Check,
  Building,
  Trees,
  Wheat,
  Globe2,
  ExternalLink
} from 'lucide-react';
import { ProjectEntity, PropertyItem } from '../types';

interface ProjectDirectoryProps {
  projects: ProjectEntity[];
  properties: PropertyItem[];
  onNavigate: (route: string) => void;
}

export const ProjectDirectoryPage: React.FC<ProjectDirectoryProps> = ({
  projects,
  properties,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Residential', 'Kavling', 'Agricultural', 'Export'];

  const filteredProjects = projects.filter((proj) => {
    let matchesCat = true;
    if (selectedCategory === 'Residential') matchesCat = proj.category.includes('Residential');
    else if (selectedCategory === 'Kavling') matchesCat = proj.category.includes('Land') || proj.category.includes('Kavling');
    else if (selectedCategory === 'Agricultural') matchesCat = proj.category.includes('Agricultural');
    else if (selectedCategory === 'Export') matchesCat = proj.category.includes('Exporter') || proj.category.includes('Vanilla');

    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <section className="bg-stone-900 text-stone-100 py-16 sm:py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-semibold block mb-2">
            PT ZIA Properti Indonesia
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mb-4">
            Direktori Proyek & Ekosistem Usaha
          </h1>
          <p className="text-stone-400 text-sm max-w-2xl leading-relaxed">
            Eksplorasi portofolio perumahan American Classic, tanah kavling bernilai simpan, peternakan higienis, serta ekspor komoditas unggulan Indonesia.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white border-b border-stone-200 py-6 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {cat === 'All' ? 'Semua Proyek' : cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Cari proyek atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 px-4 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>
      </section>

      {/* Project Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => {
            const propCount = properties.filter((p) => p.projectSlug === proj.slug).length;

            return (
              <div
                key={proj.slug}
                className="bg-white border border-stone-200 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-950">
                  <img
                    src={proj.heroImage}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
                  <span className="absolute top-4 left-4 bg-white/95 text-stone-900 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 shadow-sm">
                    {proj.category}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-stone-900/90 text-stone-100 text-[10px] uppercase tracking-wider font-mono px-2.5 py-1">
                    Status: {proj.status}
                  </span>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block mb-1">
                      {proj.location}
                    </span>
                    <h2 className="text-2xl font-serif text-stone-900 font-bold mb-2 group-hover:text-stone-700 transition-colors">
                      {proj.name}
                    </h2>
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-medium italic mb-4">
                      {proj.tagline}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed mb-6">
                      {proj.longDescription}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      {propCount > 0 ? `${propCount} Tipe Unit Terdata` : 'Entitas Mandiri'}
                    </span>
                    <button
                      onClick={() => onNavigate(`/projects/${proj.slug}`)}
                      className="px-5 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors flex items-center gap-2"
                    >
                      Buka Laman Proyek
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

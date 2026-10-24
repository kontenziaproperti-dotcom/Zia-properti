import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Phone,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  ShieldCheck,
  ArrowUpRight,
  Info
} from 'lucide-react';

export interface LocationItem {
  id: string;
  name: string;
  category: 'Kantor Pusat' | 'Residensial' | 'Kavling' | 'Peternakan' | 'Ekspor Vanilla';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  badge: string;
  description: string;
  tagline: string;
  accessHighlights: string[];
  district: string;
}

export const ZIA_LOCATIONS: LocationItem[] = [
  {
    id: 'hq',
    name: 'Kantor Pusat PT ZIA Properti Indonesia',
    category: 'Kantor Pusat',
    address: 'Jl. Boulevard Raya Barat Kav. 8-9, Summarecon Bekasi, Jawa Barat 17143',
    district: 'Kota Bekasi, Jawa Barat',
    lat: -6.2238,
    lng: 106.9995,
    phone: '+62 21 8899 7654',
    badge: 'Headquarters',
    tagline: 'Pusat Manajemen Korporat & Konsultasi Investasi',
    description: 'Kantor operasional utama pelayanan terpadu properti, legalitas perizinan, dan kemitraan ekosistem ZIA Group.',
    accessHighlights: [
      '5 Menit dari Stasiun KA Summarecon Bekasi',
      'Akses Langsung Gerbang Tol Bekasi Barat & Becakayu',
      'Layanan Konsultasi Legalitas & Investasi Terpadu'
    ]
  },
  {
    id: 'emerald',
    name: 'ZIA Emerald Residence',
    category: 'Residensial',
    address: 'Kec. Tarumajaya, Kabupaten Bekasi, Jawa Barat 17215',
    district: 'Tarumajaya, Kabupaten Bekasi',
    lat: -6.1725,
    lng: 106.9855,
    phone: '6281288889922',
    badge: 'American Classic',
    tagline: 'Hunian Premium Bergaya American Classic di Tarumajaya',
    description: 'Kawasan hunian eksklusif dengan tipe 50/72, 80/72, dan mezzanine, dilengkapi row jalan 7 meter, one gate system, dan keamanan 24 jam.',
    accessHighlights: [
      '10 Menit dari Pintu Tol Cibitung - Cilincing (JTCC)',
      '15 Menit ke Kota Harapan Indah & Marunda Center',
      'Kawasan Bebas Banjir dengan Row Jalan 7 Meter'
    ]
  },
  {
    id: 'hills',
    name: 'Kavling Hills / Kav Hillside',
    category: 'Kavling',
    address: 'Kawasan Pengembangan Asri, Bekasi Timur, Jawa Barat',
    district: 'Bekasi Timur, Jawa Barat',
    lat: -6.2550,
    lng: 107.0350,
    phone: '6281288889933',
    badge: 'Kavling Siap Bangun',
    tagline: 'Lahan Hunian Strategis dengan Legalitas SHM Terjamin',
    description: 'Kavling hunian premium dengan kontur tanah matang, jalan lingkungan aspal lebar, dan nilai apresiasi investasi tinggi.',
    accessHighlights: [
      'Akses Jalan Aspal Lebar & Lingkungan Matang',
      '15 Menit dari Gerbang Tol Tambun / Grand Wisata',
      'Sertifikat Hak Milik (SHM) Aman & Jelas'
    ]
  },
  {
    id: 'farm',
    name: 'ZIA Farm | Kandang Ternak H. Bowo',
    category: 'Peternakan',
    address: 'Kawasan Agribisnis Terpadu Setu, Bekasi, Jawa Barat',
    district: 'Setu, Kabupaten Bekasi',
    lat: -6.3120,
    lng: 107.0120,
    phone: '6281288889944',
    badge: 'Sentra Peternakan',
    tagline: 'Pemasok Hewan Qurban, Sapi, Domba & Kambing Unggulan',
    description: 'Peternakan modern berstandar kesehatan hewan resmi, pemeliharaan higienis, pakan nutrisi terukur, dan layanan timbang transparan.',
    accessHighlights: [
      'Kawasan Agribisnis Bersih Berstandar Veteriner Resmi',
      'Akses Bongkar Muat Truk Ternak Luas',
      'Layanan Timbang Digital & Penitipan Hewan Aman'
    ]
  },
  {
    id: 'altara',
    name: 'ALTARA ZIA International Facility',
    category: 'Ekspor Vanilla',
    address: 'Sentra Ekspor Logistik Maritim Tanjung Priok, Jakarta Utara 14310',
    district: 'Tanjung Priok, DKI Jakarta',
    lat: -6.1250,
    lng: 106.8850,
    phone: '6281288889955',
    badge: 'Export Hub',
    tagline: 'Fasilitas Sortir & Pengemasan Gourmet Vanilla Beans Indonesia',
    description: 'Pusat quality control, curing evaluasi, dan packing berstandar ekspor global untuk pengiriman ke pasar internasional.',
    accessHighlights: [
      'Dekat Terminal Petikemas Pelabuhan Tanjung Priok',
      'Koneksi Cepat Tol Lingkar Luar ke Bandara Soekarno-Hatta',
      'Standar Fasilitas Curing & Sortir Higienis Internasional'
    ]
  }
];

// Helper to determine if a valid Google Maps API Key is provided
const isValidGoogleMapsKey = (key: string | undefined): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  if (!trimmed) return false;
  if (
    trimmed === 'MY_GOOGLE_MAPS_API_KEY' ||
    trimmed.includes('YOUR_') ||
    trimmed.startsWith('undefined') ||
    trimmed.length < 20
  ) {
    return false;
  }
  return true;
};

interface GoogleMapsViewProps {
  apiKey?: string;
  initialSelectedId?: string;
  heightClassName?: string;
  showDirectory?: boolean;
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  apiKey,
  initialSelectedId = 'hq',
  heightClassName = 'h-[460px] md:h-[540px]',
  showDirectory = true
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(() => {
    return ZIA_LOCATIONS.find((l) => l.id === initialSelectedId) || ZIA_LOCATIONS[0];
  });
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [infoOpen, setInfoOpen] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);

  const activeApiKey = (typeof apiKey === 'string' ? apiKey : '').trim();
  const hasValidKey = isValidGoogleMapsKey(activeApiKey) && !mapLoadError;

  const filteredLocations = ZIA_LOCATIONS.filter((l) => {
    if (activeCategory === 'Semua') return true;
    return l.category === activeCategory;
  });

  const categories = ['Semua', 'Kantor Pusat', 'Residensial', 'Kavling', 'Peternakan', 'Ekspor Vanilla'];

  const getPinColor = (category: LocationItem['category']) => {
    switch (category) {
      case 'Kantor Pusat':
        return '#0F3B2E'; // Deep Emerald
      case 'Residensial':
        return '#059669'; // Emerald
      case 'Kavling':
        return '#2563EB'; // Blue
      case 'Peternakan':
        return '#D97706'; // Amber
      case 'Ekspor Vanilla':
        return '#78350F'; // Warm Vanilla Earth
      default:
        return '#163A2F';
    }
  };

  const openDirections = (loc: LocationItem) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openSearchMaps = (loc: LocationItem) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyAddressToClipboard = (address: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    }
  };

  return (
    <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
      {/* Category Pills Header */}
      <div className="p-3.5 sm:p-4 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Peta Lokasi & Orientasi Ekosistem ZIA
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Directory + Map / Fallback */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Location Selector Sidebar */}
        {showDirectory && (
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-200 p-3.5 sm:p-4 max-h-[520px] overflow-y-auto space-y-2 bg-stone-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Titik Lokasi Terdaftar ({filteredLocations.length})
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Klik untuk rute</span>
            </div>

            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setInfoOpen(true);
                  }}
                  className={`p-3 border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-emerald-700 shadow-xs ring-1 ring-emerald-700/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-stone-900 block leading-tight">
                      {loc.name}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wide shrink-0"
                      style={{
                        backgroundColor: `${getPinColor(loc.category)}15`,
                        color: getPinColor(loc.category)
                      }}
                    >
                      {loc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mb-2 leading-relaxed">
                    {loc.address}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1.5 border-t border-stone-100">
                    <span className="font-mono text-stone-400">
                      {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDirections(loc);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:underline"
                    >
                      <Navigation className="w-3 h-3" />
                      Panduan Rute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Map Container: Interactive Map when API key exists, otherwise Elegant Fallback */}
        <div className={showDirectory ? 'lg:col-span-8 relative' : 'col-span-12 relative'}>
          {hasValidKey ? (
            <div className={`w-full ${heightClassName} relative`}>
              <APIProvider apiKey={activeApiKey} onError={() => setMapLoadError(true)}>
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  defaultZoom={12}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  className="w-full h-full"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  {filteredLocations.map((loc) => (
                    <AdvancedMarker
                      key={loc.id}
                      position={{ lat: loc.lat, lng: loc.lng }}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setInfoOpen(true);
                      }}
                    >
                      <Pin
                        background={getPinColor(loc.category)}
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                        scale={selectedLocation.id === loc.id ? 1.2 : 1.0}
                      />
                    </AdvancedMarker>
                  ))}

                  {infoOpen && (
                    <InfoWindow
                      position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                      onCloseClick={() => setInfoOpen(false)}
                      pixelOffset={[0, -36]}
                    >
                      <div className="p-2 max-w-[280px] font-sans">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5 text-emerald-800" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                            {selectedLocation.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 mb-1 leading-snug">
                          {selectedLocation.name}
                        </h4>
                        <p className="text-[11px] text-stone-600 mb-2 leading-relaxed">
                          {selectedLocation.address}
                        </p>
                        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => openDirections(selectedLocation)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-stone-900 hover:bg-stone-800 px-2.5 py-1 transition-colors"
                          >
                            <Navigation className="w-3 h-3" />
                            Petunjuk Arah
                          </button>
                          <button
                            onClick={() => openSearchMaps(selectedLocation)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 hover:text-stone-900"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Buka Maps
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>
          ) : (
            /* Refined Standalone Fallback View when Google Maps API Key is not configured */
            <div className={`w-full ${heightClassName} bg-[#0b1a15] text-white p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden`}>
              {/* Top Section: Header & Location Info */}
              <div className="space-y-4 z-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 border border-emerald-800/60">
                    {selectedLocation.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 bg-stone-900/80 px-2.5 py-0.5 border border-stone-800">
                    {selectedLocation.badge}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium ml-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Titik Terverifikasi
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-white font-bold tracking-tight">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                    {selectedLocation.tagline}
                  </p>
                </div>

                {/* Location Details Card */}
                <div className="p-3.5 sm:p-4 bg-stone-900/90 border border-stone-800 backdrop-blur-xs space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-200 font-medium leading-relaxed block">
                          {selectedLocation.address}
                        </span>
                        <span className="text-[11px] text-stone-400 mt-0.5 block">
                          Wilayah: {selectedLocation.district}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyAddressToClipboard(selectedLocation.address)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-semibold border border-stone-700 shrink-0 transition-colors"
                      title="Salin Alamat"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Alamat</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Coordinates & Access Highlights */}
                  <div className="pt-2 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-2 font-mono text-stone-400 bg-stone-950/60 px-2.5 py-1.5 border border-stone-800/60">
                      <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>GPS: {selectedLocation.lat}, {selectedLocation.lng}</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-300 bg-stone-950/60 px-2.5 py-1.5 border border-stone-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{selectedLocation.accessHighlights[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
                    Aksesibilitas & Keunggulan Lokasi:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-300">
                    {selectedLocation.accessHighlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 mt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Buka langsung di aplikasi atau peramban Google Maps</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => openSearchMaps(selectedLocation)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka di Google Maps
                  </button>

                  <button
                    onClick={() => openDirections(selectedLocation)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-98"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Panduan Rute
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Cartographic Grid Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-600/5 blur-3xl pointer-events-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

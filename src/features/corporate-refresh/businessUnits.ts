export type BusinessCategory = 'property' | 'agriculture' | 'export' | 'retail' | 'direct';

export interface BusinessDirectoryItem {
  slug: string;
  name: string;
  sector: string;
  category: BusinessCategory;
  location: string;
  summary: string;
  route: string;
  visual: 'emerald' | 'moss' | 'earth' | 'vanilla' | 'raya' | 'direct';
  icon: 'building' | 'land' | 'farm' | 'globe' | 'shopping' | 'network';
  heroImage?: string;
  tagline?: string;
}

export interface BusinessUnitContent extends BusinessDirectoryItem {
  eyebrow: string;
  intro: string;
  categories: { title: string; description: string }[];
  commitments: { title: string; description: string }[];
  process?: { title: string; description: string }[];
}

export const CORPORATE_BUSINESS_LINKS: BusinessDirectoryItem[] = [
  {
    slug: 'zia-emerald',
    name: 'ZIA Emerald',
    sector: 'Properti · Residensial',
    category: 'property',
    location: 'Tarumajaya, Kabupaten Bekasi',
    summary: 'Hunian berkarakter American Classic dengan penataan ruang yang dirancang untuk kehidupan keluarga.',
    route: '/projects/zia-emerald',
    visual: 'emerald',
    icon: 'building',
    tagline: 'American Classic × Modern Family Living',
  },
  {
    slug: 'kav-hillside',
    name: 'Kav Hillside',
    sector: 'Properti · Investasi Tanah',
    category: 'property',
    location: 'Kabupaten Bekasi',
    summary: 'Kavling siap bangun dengan konsep kawasan dan infrastruktur yang direncanakan.',
    route: '/projects/kav-hillside',
    visual: 'moss',
    icon: 'land',
    tagline: 'Land & Lifestyle Investment',
  },
  {
    slug: 'zia-farm',
    name: 'ZIA Farm',
    sector: 'Agribisnis · Peternakan',
    category: 'agriculture',
    location: 'Indonesia',
    summary: 'Lini peternakan dan agribisnis dengan fokus pada pengelolaan ternak serta layanan kebutuhan konsumen.',
    route: '/projects/zia-farm',
    visual: 'earth',
    icon: 'farm',
    tagline: 'Livestock & Agribusiness',
  },
  {
    slug: 'altara-zia-international',
    name: 'Altara ZIA International',
    sector: 'Agribisnis · Ekspor',
    category: 'export',
    location: 'Indonesia · Pasar Internasional',
    summary: 'Pemasok vanilla Indonesia untuk kebutuhan pembeli B2B dan pasar premium internasional.',
    route: '/projects/altara-zia-international',
    visual: 'vanilla',
    icon: 'globe',
    tagline: 'Premium Indonesian Vanilla',
  },
];

export const ADDITIONAL_BUSINESS_UNITS: BusinessUnitContent[] = [
  {
    slug: 'zia-raya',
    name: 'ZIA Raya',
    sector: 'Retail & Perdagangan',
    category: 'retail',
    location: 'Cikarang & Jakarta',
    summary: 'Lini retail dan perdagangan yang melayani kebutuhan gaya hidup, apparel, aksesori, serta produk pilihan.',
    route: '/business/zia-raya',
    visual: 'raya',
    icon: 'shopping',
    tagline: 'Retail · Trade · Lifestyle',
    eyebrow: 'Lini Bisnis ZIA · Retail & Perdagangan',
    intro: 'ZIA Raya merupakan lini perdagangan dan retail dalam ekosistem ZIA Corporate. Materi brand yang disampaikan menempatkan kualitas pilihan, keterjangkauan, dan layanan yang responsif sebagai dasar pengalaman pelanggan.',
    categories: [
      { title: 'Busana & Apparel', description: 'Koleksi pakaian pria dan wanita, termasuk kemeja, polo, dan busana kasual untuk berbagai kesempatan.' },
      { title: 'Aksesori & Tas', description: 'Tote bag, pouch, dan aksesori yang memadukan fungsi dengan estetika sehari-hari.' },
      { title: 'Produk Lifestyle', description: 'Produk pilihan untuk menemani aktivitas, termasuk tumbler dan perlengkapan rumah tangga.' },
      { title: 'Perdagangan Umum', description: 'Kebutuhan konsumsi harian, produk pilihan, dan distribusi barang untuk komunitas serta mitra usaha.' },
    ],
    commitments: [
      { title: 'Kualitas Terseleksi', description: 'Produk dikurasi berdasarkan fungsi, kualitas, dan kesesuaian dengan kebutuhan pelanggan.' },
      { title: 'Nilai yang Relevan', description: 'Menghadirkan pilihan produk dengan mempertimbangkan kualitas dan keterjangkauan.' },
      { title: 'Koleksi Berkembang', description: 'Kategori produk dapat berkembang mengikuti kebutuhan dan permintaan pasar.' },
      { title: 'Layanan Responsif', description: 'Tim ZIA Raya menjadi titik komunikasi untuk informasi koleksi, stok, dan pemesanan.' },
    ],
  },
  {
    slug: 'zia-direct',
    name: 'ZIA Direct',
    sector: 'Retail · Direct Selling',
    category: 'direct',
    location: 'Indonesia',
    summary: 'Lini penjualan langsung perlengkapan rumah tangga dengan jalur komunikasi konsumen dan program kemitraan.',
    route: '/business/zia-direct',
    visual: 'direct',
    icon: 'network',
    tagline: 'Household Essentials · Direct Selling · Partnership',
    eyebrow: 'Lini Bisnis ZIA · Direct Selling',
    intro: 'ZIA Direct merupakan unit direct selling dalam ekosistem ZIA Corporate yang berfokus pada distribusi perlengkapan rumah tangga. Materi brand menjelaskan model penjualan langsung kepada konsumen dan peluang kemitraan yang didukung orientasi produk serta katalog digital.',
    categories: [
      { title: 'Peralatan Dapur', description: 'Kompor, panci, blender, rice cooker, dan perlengkapan memasak untuk kebutuhan rumah.' },
      { title: 'Kebersihan Rumah', description: 'Vacuum cleaner, alat pel elektrik, pembersih lantai, dan perlengkapan kebersihan.' },
      { title: 'Perlengkapan Kamar', description: 'Bantal, selimut, tempat tidur lipat, lemari portable, dan aksesori kamar.' },
      { title: 'Elektronik Rumah', description: 'Kipas angin, setrika, pemanas air, serta pilihan elektronik rumah tangga.' },
      { title: 'Penyimpanan & Rak', description: 'Rak serbaguna, lemari plastik, container, dan solusi organisasi rumah.' },
      { title: 'Perlengkapan Kamar Mandi', description: 'Shower head, aksesori kamar mandi, keset, dan perlengkapan sanitasi.' },
    ],
    commitments: [
      { title: 'Informasi Produk', description: 'Konsumen dan mitra mendapatkan informasi kategori serta fungsi produk sebelum melakukan pemesanan.' },
      { title: 'Dukungan Katalog', description: 'Materi referensi menyebut katalog digital dan sarana pemasaran sebagai bagian dari dukungan mitra.' },
      { title: 'Orientasi Kemitraan', description: 'Program kemitraan dapat mencakup pengenalan produk, proses penjualan, dan pendampingan.' },
      { title: 'Komunikasi Langsung', description: 'Pertanyaan konsumen dan calon mitra diarahkan ke tim ZIA Direct melalui kanal resmi perusahaan.' },
    ],
    process: [
      { title: 'Pendaftaran', description: 'Sampaikan minat dan data awal melalui kanal komunikasi resmi ZIA.' },
      { title: 'Orientasi Produk', description: 'Pelajari kategori produk, informasi penggunaan, dan cara menyampaikan nilai produk kepada konsumen.' },
      { title: 'Mulai Berjualan', description: 'Gunakan katalog dan materi yang telah disediakan untuk memperkenalkan produk.' },
      { title: 'Pengembangan Jaringan', description: 'Bangun relasi pelanggan dan jaringan mitra sesuai ketentuan program resmi.' },
    ],
  },
];

export const getAdditionalBusinessUnit = (slug: string) =>
  ADDITIONAL_BUSINESS_UNITS.find((unit) => unit.slug === slug);

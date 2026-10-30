import {
  CompanySettings,
  ProjectEntity,
  PropertyItem,
  KavlingPlot,
  PostItem,
  FAQItem,
  TestimonialItem,
  MediaAsset,
  PageItem,
  SectionItem,
  PromotionItem,
  NavigationItem,
  FormConfigItem
} from '../types';

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'PT ZIA PROPERTI INDONESIA',
  tagline: 'Building Better Places, Creating Long Term Value',
  headquarters: 'Kabupaten Bekasi, Jawa Barat, Indonesia',
  fullAddress: 'Kawasan Bisnis & Residensial Terpadu, Jl. Raya Tarumajaya No. 88, Kabupaten Bekasi, Jawa Barat 17215',
  email: 'corporate@ziaproperti.co.id',
  phone: '+62 21 8899 7654',
  contactWhatsApp: '6281288889911',
  corporateWhatsApp: '6281288889911',
  emeraldWhatsApp: '6281288889922',
  kavWhatsApp: '6281288889933',
  farmWhatsApp: '6281288889944',
  altaraWhatsApp: '6281288889955',
  officeHours: 'Senin - Sabtu: 08:30 - 17:00 WIB',
  instagram: 'https://instagram.com/ziaproperti',
  linkedin: 'https://linkedin.com/company/zia-properti-indonesia',
  youtube: 'https://youtube.com/@ziaproperti',
  ga4Id: 'G-ZIAPROPERTI1',
  metaPixelId: '123456789012345',
};

export const INITIAL_PROJECTS: ProjectEntity[] = [
  {
    id: 'zia-emerald',
    slug: 'zia-emerald',
    name: 'ZIA Emerald',
    category: 'Premium Residential Development',
    tagline: 'American Classic × Modern Family Living',
    location: 'Tarumajaya, Kabupaten Bekasi, Jawa Barat',
    shortDescription: 'Hunian eksklusif berarsitektur American Classic dengan penataan lansekap asri dan fasilitas ramah keluarga di lokasi strategis Tarumajaya.',
    longDescription: 'ZIA Emerald menghadirkan perpaduan keindahan estetika American Classic yang abadi dengan kenyamanan tata ruang modern. Dirancang secara presisi untuk kenyamanan jangka panjang keluarga, dilengkapi sistem keamanan terintegrasi, taman komunal, dan aksesibilitas cepat ke koridor bisnis Jabodetabek.',
    status: 'Development',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    logoUrl: '',
    featured: true,
    order: 1,
    seoTitle: 'ZIA Emerald | Rumah American Classic di Tarumajaya Bekasi',
    seoDescription: 'ZIA Emerald - Hunian American Classic elegan di Tarumajaya Bekasi oleh PT ZIA Properti Indonesia. Type 50/72, 80/72, mezzanine opsional.',
    contactWhatsApp: '6281288889922',
    accentColor: '#0f4c3a', // Emerald
  },
  {
    id: 'kav-hillside',
    slug: 'kav-hillside',
    name: 'Kav Hillside',
    category: 'Land & Kavling Property Concept',
    tagline: 'American Classic Premium Housing & Kavling Eksklusif',
    location: 'Kabupaten Bekasi, Jawa Barat',
    shortDescription: 'Kavling siap bangun berkonsep American Classic dalam kawasan berkontur asri dengan kepemilikan bernilai investasi jangka panjang.',
    longDescription: 'Kav Hillside menawarkan peluang investasi tanah dan kavling eksklusif siap bangun dengan standar infrastruktur terencana rapi, drainase tertutup, ROW jalan lebar, serta panduan arsitektur American Classic yang harmonis.',
    status: 'Available',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80',
    featured: true,
    order: 2,
    seoTitle: 'Kav Hillside | Kavling Siap Bangun American Classic Bekasi',
    seoDescription: 'Kav Hillside oleh PT ZIA Properti Indonesia. Kavling tanah matang berinfrastruktur lengkap untuk investasi properti masa depan.',
    contactWhatsApp: '6281288889933',
    accentColor: '#365314', // Earth / Moss Green
  },
  {
    id: 'zia-farm',
    slug: 'zia-farm',
    name: 'ZIA Farm',
    category: 'Agricultural & Livestock Ecosystem',
    tagline: 'Peternakan Berkelanjutan & Ekosistem Agrikultur Terpadu',
    location: 'Kabupaten Bekasi, Jawa Barat',
    shortDescription: 'Fasilitas peternakan ruminansia terpadu, pembiakan selektif, pakan mandiri, dan layanan hewan qurban higienis berstandar dokter hewan.',
    longDescription: 'ZIA Farm merupakan pilar agribisnis PT ZIA Properti Indonesia yang fokus pada tata kelola peternakan modern yang ramah lingkungan, penyediaan ternak berkualitas tinggi, transparansi timbangan, dan ketahanan pangan berkelanjutan.',
    status: 'Active',
    heroImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1800&q=80',
    featured: true,
    order: 3,
    seoTitle: 'ZIA Farm | Peternakan & Agrikultur Terpadu Bekasi',
    seoDescription: 'ZIA Farm - Ekosistem peternakan domba, kambing, dan sapi modern berstandar kesehatan veteriner resmi di Kabupaten Bekasi.',
    contactWhatsApp: '6281288889944',
    accentColor: '#854d0e', // Warm Ochre / Earth
  },
  {
    id: 'altara-zia-international',
    slug: 'altara-zia-international',
    name: 'Altara ZIA International',
    category: 'Global Vanilla Bean Exporter',
    tagline: "From Indonesia's Finest Farms to The World's Premium Markets",
    location: 'Indonesia Origin • Global Export Headquarters Bekasi',
    shortDescription: 'Exporter of Gourmet & Extraction Grade Planifolia and Tahitensis vanilla beans with scientific moisture curing and full batch traceability.',
    longDescription: 'Altara ZIA International connects ethical Indonesian smallholder agroforestry directly to international artisanal extractors, high-end pastry chefs, fragrance houses, and food manufacturers across North America, Europe, and Asia.',
    status: 'Exporting',
    heroImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1800&q=80',
    featured: true,
    order: 4,
    seoTitle: 'Altara ZIA International | Premium Indonesian Vanilla Bean Exporter',
    seoDescription: 'Leading Indonesian vanilla bean exporter supplying Planifolia and Tahitensis gourmet grades worldwide with direct origin traceability.',
    contactWhatsApp: '6281288889955',
    accentColor: '#1c1917', // Midnight / Vanilla Dark Earth
  },
];

export const INITIAL_PROPERTIES: PropertyItem[] = [
  {
    id: 'prop-emerald-type50',
    projectSlug: 'zia-emerald',
    name: 'Type 50/72 - The Haven',
    type: 'Rumah 1 Lantai (High Ceiling)',
    code: 'ZE-50',
    block: 'A & B',
    lot: 'Blok A1 - A12',
    landArea: 72,
    buildingArea: 50,
    bedrooms: 2,
    bathrooms: 1,
    floors: 1,
    price: 650000000,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    bookingFee: 5000000,
    downPayment: 'DP Promo Mulai 0% (S&K Berlaku)',
    installmentEstimate: 'Mulai Rp 3.8 Jt / bln',
    promoBadge: 'Subsidi Biaya KPR & Free Kanopi',
    status: 'Available',
    mainImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    description: 'Tipe 50 dirancang bagi keluarga muda modern yang mengutamakan privasi dan efisiensi ruang. Plafon tinggi setinggi 4.2 meter menghadirkan sirkulasi udara alami optimal serta opsi mezzanine modular.',
    specifications: {
      'Pondasi': 'Batu Kali & Cakar Ayam Beton Bertulang',
      'Dinding': 'Bata Ringan Plester Aci Fin. Cat Weatherproof',
      'Kusen & Pintu': 'Aluminium Powder Coating & Daun Solid Engineering',
      'Lantai': 'Homogeneous Tile 60x60 cm Corak Marmer Lembut',
      'Sanitair': 'American Standard / Setara (Monoblok + Shower)',
      'Listrik': '2200 VA Bawah Tanah (Underground Cable)',
      'Air': 'Sumur Bor Jetpump + Toren Filter Air Terpasang'
    }
  },
  {
    id: 'prop-emerald-type80',
    projectSlug: 'zia-emerald',
    name: 'Type 80/72 - The Grand Manor',
    type: 'Rumah 2 Lantai Eksklusif',
    code: 'ZE-80',
    block: 'C & D',
    lot: 'Blok C1 - C16',
    landArea: 72,
    buildingArea: 80,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    price: 920000000,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    bookingFee: 5000000,
    downPayment: 'DP Promo Terbimbing',
    installmentEstimate: 'Mulai Rp 5.5 Jt / bln',
    promoBadge: 'Free BPHTB & Notaris',
    status: 'Available',
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    description: 'Unit 2 lantai prestisius dengan fasad American Classic seimbang, balkon pribadi di kamar utama, 3 kamar tidur lega, dan ruang keluarga lapang yang menghadap taman belakang.',
    specifications: {
      'Pondasi': 'Tiang Pancang Mini Pile & Beton Bertulang',
      'Rangka Atap': 'Baja Ringan Zincalume & Genteng Keramik Glazur',
      'Lantai': 'Granite Tile 60x60 cm & SPC Parquet pada Master Bedroom',
      'Kamar Mandi': 'Full Tile Dinding + Wastafel Vanity Marmer',
      'Carport': '2 Mobil Rabat Cor Rabat Pola Batu Andesit',
      'Listrik': '3500 VA Sistem Smart Breaker',
      'Keamanan': 'Smart Door Lock Biometrik & CCTV 2 Titik'
    }
  },
  {
    id: 'prop-emerald-mezzanine',
    projectSlug: 'zia-emerald',
    name: 'Type 65/72 - The Mezzanine Atelier',
    type: 'Rumah 1.5 Lantai (Mezzanine Loft)',
    code: 'ZE-65M',
    block: 'E',
    lot: 'Blok E1 - E8',
    landArea: 72,
    buildingArea: 65,
    bedrooms: 3,
    bathrooms: 1,
    floors: 1.5,
    price: 760000000,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    bookingFee: 5000000,
    downPayment: 'DP Sesuai Ketentuan Bank',
    installmentEstimate: 'Mulai Rp 4.4 Jt / bln',
    promoBadge: 'Limited Series Loft',
    status: 'Reserved',
    mainImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Konsep inovatif mezanin struktural besi hollow dan lantai kayu komposit yang dapat difungsikan sebagai ruang kerja pribadi (work from home) atau kamar santai anak.',
    specifications: {
      'Struktur Mezanin': 'Baja I-Beam Fin. Black Industrial & Lantai Solid Wood',
      'Void': 'Plafon Katedral 4.8 Meter dengan Skylight Alami',
      'Listrik': '2200 VA',
      'Status': 'Unit Terbatas'
    }
  }
];

export const INITIAL_PLOTS: KavlingPlot[] = [
  {
    id: 'plot-kh-a01',
    plotId: 'KH-A01',
    block: 'Blok A (Boulevard Utama)',
    lotNumber: '01 (Hook)',
    landSize: 120,
    frontage: 10,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    status: 'Available',
    notes: 'Posisi hook menghadap jalan boulevard utama 10 meter, orientasi utara.'
  },
  {
    id: 'plot-kh-a02',
    plotId: 'KH-A02',
    block: 'Blok A (Boulevard Utama)',
    lotNumber: '02',
    landSize: 96,
    frontage: 8,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    status: 'Available',
    notes: 'Bentuk persegi panjang presisi, kontur tanah matang siap pondasi.'
  },
  {
    id: 'plot-kh-b05',
    plotId: 'KH-B05',
    block: 'Blok B (Taman Dalam)',
    lotNumber: '05',
    landSize: 84,
    frontage: 7,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    status: 'Reserved',
    notes: 'Berhadapan langsung dengan pocket park kawasan hijau.'
  },
  {
    id: 'plot-kh-c08',
    plotId: 'KH-C08',
    block: 'Blok C (Green Valley View)',
    lotNumber: '08',
    landSize: 105,
    frontage: 8.5,
    priceFormatted: 'Hubungi Sales (CMS Terkendali)',
    status: 'Sold',
    notes: 'Sudah serah terima patok BPN dan akta pengikatan.'
  }
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    title: 'Filosofi Arsitektur American Classic dalam Tata Ruang Tropis Indonesia',
    slug: 'filosofi-arsitektur-american-classic-tata-ruang-tropis',
    category: 'Arsitektur & Konsep',
    summary: 'Bagaimana PT ZIA Properti Indonesia menyelaraskan keanggunan proporsi American Classic dengan kebutuhan iklim tropis berkelembapan tinggi di Jawa Barat.',
    content: 'Penerapan arsitektur American Classic bukan sekadar tentang moulding dan pilar simetris, melainkan tentang tata cahaya, cross-ventilation, dan ketahanan material terhadap cuaca tropis Bekasi. Di ZIA Emerald, kami memastikan teritisan atap cukup lebar, bukaan jendela berfilter radiasi UV, dan ketinggian void plafon yang menjaga kesejukan ruangan tanpa ketergantungan konstan pada pendingin udara.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    author: 'Tim Perencana Arsitektur ZIA',
    published: true,
    featured: true,
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'post-2',
    title: 'Peluang Ekspor Vanilla Organik Indonesia di Pasar Gourmet Dunia',
    slug: 'peluang-ekspor-vanilla-organik-indonesia-pasar-gourmet',
    category: 'Bisnis & Ekspor',
    summary: 'Langkah strategis Altara ZIA International dalam menghadirkan rantai pasok vanilla bean berkeadilan dan berstandar kelembaban prima untuk industri kuliner internasional.',
    content: 'Kepulauan Indonesia memiliki keunggulan agroklimat mikroskopis yang menghasilkan vanilla bean dengan profil aroma kompleks, vanilin tinggi, dan tekstur berminyak alami. Melalui kurasi ketat dan proses curing bertahap, Altara ZIA International menjamin konsistensi mutu yang dicari oleh para pastissier dan ekstraktor global.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    author: 'Direksi Altara ZIA International',
    published: true,
    featured: false,
    createdAt: '2026-08-28T14:30:00Z'
  },
  {
    id: 'post-3',
    title: 'Standar Manajemen Ternak Ramah Lingkungan di ZIA Farm',
    slug: 'standar-manajemen-ternak-ramah-lingkungan-zia-farm',
    category: 'Agrikultur & Keberlanjutan',
    summary: 'Mengenal pemanfaatan pakan fermentasi silase mandiri dan pengelolaan limbah organik menjadi pupuk hayati terpadu.',
    content: 'Peternakan modern harus mampu berdampingan harmonis dengan lingkungan pemukiman. ZIA Farm mengintegrasikan biokonversi kotoran ternak menjadi pupuk kompos berdaya guna tinggi serta sistem sanitasi kandang harian berbasis probiotik alami.',
    coverImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    author: 'Manajemen ZIA Farm',
    published: true,
    featured: false,
    createdAt: '2026-09-10T11:00:00Z'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    projectSlug: 'zia-emerald',
    category: 'Legalitas & Kepemilikan',
    question: 'Bagaimana status legalitas tanah dan perizinan di ZIA Emerald?',
    answer: 'Seluruh legalitas dasar proyek ZIA Emerald telah berlandaskan kepemilikan induk SHGB/SHM yang siap dipecah per kavling, izin tata ruang (PBG), serta izin tapak kawasan sesuai regulasi resmi Pemerintah Kabupaten Bekasi.'
  },
  {
    id: 'faq-2',
    projectSlug: 'zia-emerald',
    category: 'Pembiayaan & Bank',
    question: 'Apakah pembelian unit di ZIA Emerald didukung oleh KPR Bank rekanan?',
    answer: 'Ya, PT ZIA Properti Indonesia bekerjasama dengan bank-bank nasional terkemuka baik konvensional maupun syariah dengan skema cicilan terjangkau dan proses pendampingan berkas hingga akad kredit.'
  },
  {
    id: 'faq-3',
    projectSlug: 'kav-hillside',
    category: 'Kavling Siap Bangun',
    question: 'Apakah pembeli kavling di Kav Hillside diwajibkan membangun rumah langsung?',
    answer: 'Tidak ada tenggat waktu wajib bangun segera. Pemilik dapat mengalokasikannya sebagai portofolio investasi tanah matang atau membangun hunian impian saat siap, dengan mengikuti panduan fasad arsitektur kawasan.'
  },
  {
    id: 'faq-4',
    projectSlug: 'zia-farm',
    category: 'Layanan Hewan Qurban & Aqiqah',
    question: 'Apakah hewan ternak di ZIA Farm memiliki surat keterangan kesehatan hewan resmi?',
    answer: 'Seluruh ternak ruminansia di ZIA Farm berada di bawah pengawasan dokter hewan berkala, vaksinasi tuntas, bebas penyakit mulut kuku (PMK), dan disertai SKKH resmi.'
  },
  {
    id: 'faq-5',
    projectSlug: 'altara-zia-international',
    category: 'B2B Vanilla Export',
    question: 'What vanilla grades and minimum order quantities (MOQ) are available for international buyers?',
    answer: 'Altara ZIA International supplies Gourmet Grade A (16-22cm, 30-35% moisture) and Extraction Grade B beans. Standard export vacuum-packed cartons are available starting at 5kg sample orders up to metric-ton ocean and air freight shipments with Phytosanitary Certificates and Certificates of Origin.'
  }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testi-1',
    author: 'Hendra Setiawan & Keluarga',
    role: 'Pemilik Unit ZIA Emerald',
    projectSlug: 'zia-emerald',
    content: 'Fasad American Classic-nya sangat rapi dan berkelas di kawasan Tarumajaya. Ketinggian plafon membuat sirkulasi udara sangat sejuk. Komunikasi tim PT ZIA Properti Indonesia dari survei lokasi hingga akad sangat transparan.',
    rating: 5
  },
  {
    id: 'testi-2',
    author: 'Dra. Nurul Hidayati',
    role: 'Investor Kav Hillside',
    projectSlug: 'kav-hillside',
    content: 'Saya mencari kavling berinfrastruktur matang di Kabupaten Bekasi untuk aset jangka panjang anak-anak. Legalitasnya jelas, patok fisik rapi, dan drainase lingkungannya terencana dengan baik.',
    rating: 5
  },
  {
    id: 'testi-3',
    author: 'Jean-Luc Moreau',
    role: 'Artisanal Patisserie Director, Lyon - France',
    projectSlug: 'altara-zia-international',
    content: 'The aroma profile of Altara ZIA vanilla beans is remarkably balanced—deep floral notes with lingering caramel vanillin. Their batch consistency and phytosanitary packaging standard meet our demanding European culinary requirements.',
    rating: 5
  }
];

export const INITIAL_MEDIA: MediaAsset[] = [
  {
    id: 'med-1',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    title: 'Fasad American Classic ZIA Emerald',
    alt: 'Rumah bergaya American Classic ZIA Emerald Tarumajaya Bekasi',
    brand: 'ZIA Emerald',
    category: 'Exterior',
    fileType: 'image/jpeg',
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'med-2',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    title: 'Lansekap Terbuka Kav Hillside',
    alt: 'Masterplan kawasan perbukitan dan kavling Kav Hillside Bekasi',
    brand: 'Kav Hillside',
    category: 'Landscape',
    fileType: 'image/jpeg',
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'med-3',
    url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80',
    title: 'Padang Penggembalaan & Ternak ZIA Farm',
    alt: 'Fasilitas peternakan sehat dan bersih ZIA Farm Bekasi',
    brand: 'ZIA Farm',
    category: 'Livestock',
    fileType: 'image/jpeg',
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'med-4',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
    title: 'Vanilla Beans Premium Altara ZIA',
    alt: 'Biji vanilla Indonesia berkualitas tinggi untuk ekspor',
    brand: 'Altara ZIA International',
    category: 'Vanilla',
    fileType: 'image/jpeg',
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'med-5',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    title: 'Kantor Korporat PT ZIA Properti Indonesia',
    alt: 'Gedung korporat pengembang properti Bekasi',
    brand: 'Corporate',
    category: 'Corporate',
    fileType: 'image/jpeg',
    createdAt: '2026-08-01T00:00:00Z'
  }
];

export const INITIAL_PAGES: PageItem[] = [
  {
    id: 'page-home',
    title: 'Beranda Utama',
    slug: '/',
    summary: 'Gerbang utama korporat dan navigasi ke seluruh unit bisnis ZIA.',
    content: 'Halaman utama memuat nilai korporat, ringkasan proyek unggulan, dan wawasan terkini.',
    seoTitle: 'PT ZIA Properti Indonesia | Building Better Places, Creating Long Term Value',
    seoDescription: 'Platform korporat resmi dan ekosistem bisnis PT ZIA Properti Indonesia di Kabupaten Bekasi.',
    order: 1,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'page-about',
    title: 'Tentang Kami',
    slug: '/about',
    summary: 'Profil perusahaan, jajaran direksi, visi, misi, dan filosofi arsitektur.',
    content: 'Sejarah pembentukan ZIA, komitmen mutu konstruksi, dan tata kelola berintegritas.',
    seoTitle: 'Tentang PT ZIA Properti Indonesia | Profil & Filosofi',
    seoDescription: 'Mengenal visi, misi, komitmen ESG, dan manajemen PT ZIA Properti Indonesia.',
    order: 2,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'page-projects',
    title: 'Direktori Proyek',
    slug: '/projects',
    summary: 'Katalog terpadu kawasan hunian, kavling, agrikultur, dan ekspor.',
    content: 'Eksplorasi portofolio ZIA Emerald, Kav Hillside, ZIA Farm, dan Altara ZIA.',
    seoTitle: 'Direktori Proyek & Portofolio | PT ZIA Properti Indonesia',
    seoDescription: 'Katalog proyek perumahan, kavling, peternakan, dan vanilla ekspor ZIA Group.',
    order: 3,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'page-contact',
    title: 'Kontak & Representatif',
    slug: '/contact',
    summary: 'Informasi kantor pusat, jam layanan, dan kanal komunikasi langsung.',
    content: 'Hubungi kantor resmi PT ZIA Properti Indonesia di Kabupaten Bekasi.',
    seoTitle: 'Hubungi Kami | PT ZIA Properti Indonesia',
    seoDescription: 'Layanan pelanggan dan konsultasi survei lokasi PT ZIA Properti Indonesia.',
    order: 4,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'page-careers',
    title: 'Karir & Kemitraan',
    slug: '/careers',
    summary: 'Peluang bergabung bersama tim ZIA Group.',
    content: 'Informasi lowongan kerja arsitektur, teknik sipil, sales pemasaran, dan agribisnis.',
    seoTitle: 'Karir & Kemitraan | PT ZIA Properti Indonesia',
    seoDescription: 'Bergabung dengan tim profesional PT ZIA Properti Indonesia.',
    order: 5,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  }
];

export const INITIAL_SECTIONS: SectionItem[] = [
  {
    id: 'sec-hero-home',
    pageSlug: '/',
    sectionKey: 'hero',
    title: 'Building Better Places, Creating Long Term Value',
    subtitle: 'Pengembang Properti & Ekosistem Bisnis Terpadu di Kabupaten Bekasi',
    content: 'Menghadirkan kawasan residensial berstandar prima, kavling bernilai apresiasi tinggi, serta ekosistem agrikultur dan ekspor terpadu.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Jelajahi Ekosistem Proyek',
    ctaUrl: '/projects',
    order: 1,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'sec-about-philosophy',
    pageSlug: '/about',
    sectionKey: 'philosophy',
    title: 'Komitmen Kualitas & Integritas Tanpa Kompromi',
    subtitle: 'Fondasi Utama Setiap Jengkal Pembangunan ZIA Group',
    content: 'Setiap karya arsitektur dan ekosistem usaha kami dirancang dengan perhitungan matang untuk memberikan nilai apresiasi berkelanjutan bagi seluruh pemangku kepentingan.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    order: 2,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'sec-emerald-highlights',
    pageSlug: 'zia-emerald',
    sectionKey: 'architecture',
    title: 'Arsitektur American Classic Modern',
    subtitle: 'Fasad Berkarakter Megah dengan High Ceiling Sejuk',
    content: 'Kombinasi kusen berprofil rapi, ventilasi silang optimal, dan mezanin multifungsi menciptakan kenyamanan terbaik bagi keluarga modern.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Lihat Pilihan Tipe Rumah',
    ctaUrl: '#house-types',
    order: 3,
    status: 'published',
    updatedAt: '2026-09-01T00:00:00Z'
  }
];

export const INITIAL_PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-1',
    title: 'Promo Spesial Merdeka Hunian ZIA Emerald',
    projectSlug: 'zia-emerald',
    badge: 'Subsidi DP 0% + Free BPHTB',
    description: 'Dapatkan kemudahan kepemilikan hunian American Classic di ZIA Emerald Tarumajaya dengan program subsidi uang muka dan gratis seluruh biaya notaris & pajak pembeli.',
    discountValue: 'Hemat hingga Rp 45 Juta',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    terms: 'Berlaku untuk 10 akad pertama selama periode promo berjalan melalui bank rekanan terdaftar.',
    status: 'published',
    featured: true,
    updatedAt: '2026-08-15T00:00:00Z'
  },
  {
    id: 'promo-2',
    title: 'Early Bird Kavling Matang Kav Hillside',
    projectSlug: 'kav-hillside',
    badge: 'Diskon Tunai Rp 25 Juta',
    description: 'Penawaran khusus blok A dan B kavling siap bangun. Bonus sertifikat SHM langsung balik nama dan patok batas ukur bersertifikasi BPN.',
    discountValue: 'Potongan Langsung Rp 25 Jt',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    bannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    terms: 'Berlaku untuk skema pembayaran cash bertahap maupun tunai keras.',
    status: 'published',
    featured: true,
    updatedAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'promo-3',
    title: 'Paket Qurban & Aqiqah Higienis ZIA Farm',
    projectSlug: 'zia-farm',
    badge: 'Gratis Antar & Perawatan',
    description: 'Pemesanan domba sehat bobot pasti dengan penimbangan transparan di hadapan sohibul qurban atau live video.',
    discountValue: 'Gratis Perawatan Sampai H-1',
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    bannerImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    terms: 'Bebas biaya antar untuk area Bekasi, Jakarta Timur, dan sekitarnya.',
    status: 'published',
    featured: false,
    updatedAt: '2026-08-10T00:00:00Z'
  }
];

export const INITIAL_NAVIGATION: NavigationItem[] = [
  { id: 'nav-1', label: 'Beranda', url: '/', location: 'header', order: 1, status: 'published' },
  { id: 'nav-2', label: 'Tentang Kami', url: '/about', location: 'header', order: 2, status: 'published' },
  { id: 'nav-3', label: 'Portofolio & Proyek', url: '/projects', location: 'header', order: 3, status: 'published' },
  { id: 'nav-4', label: 'ZIA Emerald', url: '/projects/zia-emerald', location: 'dropdown', parentLabel: 'Portofolio & Proyek', order: 1, status: 'published' },
  { id: 'nav-5', label: 'Kav Hillside', url: '/projects/kav-hillside', location: 'dropdown', parentLabel: 'Portofolio & Proyek', order: 2, status: 'published' },
  { id: 'nav-6', label: 'ZIA Farm', url: '/projects/zia-farm', location: 'dropdown', parentLabel: 'Portofolio & Proyek', order: 3, status: 'published' },
  { id: 'nav-7', label: 'Altara ZIA', url: '/projects/altara-zia-international', location: 'dropdown', parentLabel: 'Portofolio & Proyek', order: 4, status: 'published' },
  { id: 'nav-8', label: 'Berita & Wawasan', url: '/blog', location: 'header', order: 4, status: 'published' },
  { id: 'nav-9', label: 'Hubungi Kami', url: '/contact', location: 'header', order: 5, status: 'published' },
  { id: 'nav-10', label: 'Kebijakan Privasi', url: '/privacy-policy', location: 'footer', order: 1, status: 'published' },
  { id: 'nav-11', label: 'Syarat & Ketentuan', url: '/terms', location: 'footer', order: 2, status: 'published' },
  { id: 'nav-12', label: 'Karir & Kemitraan', url: '/careers', location: 'footer', order: 3, status: 'published' }
];

export const INITIAL_FORMS: FormConfigItem[] = [
  {
    id: 'form-leads-general',
    name: 'Formulir Konsultasi Properti Utama',
    formKey: 'general-consultation',
    projectSlug: 'all',
    title: 'Konsultasi & Reservasi Jadwal Kunjungan',
    subtitle: 'Dapatkan e-brosur, price list terbaru, dan simulasi angsuran resmi dari representatif developer.',
    submitButtonText: 'Kirim Permintaan Konsultasi',
    successMessage: 'Terima kasih, representatif PT ZIA Properti Indonesia akan menghubungi Anda via WhatsApp dalam waktu 1x24 jam kerja.',
    notifyEmail: 'sales@ziaproperti.co.id',
    notifyWhatsApp: '6281288889911',
    status: 'published'
  },
  {
    id: 'form-emerald-brochure',
    name: 'Formulir Unduh Brosur ZIA Emerald',
    formKey: 'emerald-brochure',
    projectSlug: 'zia-emerald',
    title: 'Unduh Brosur & Spesifikasi Teknis ZIA Emerald',
    subtitle: 'Pelajari denah lantai lengkap Type 50/72, Type 80/72, dan paket mezanin eksklusif.',
    submitButtonText: 'Kirimkan Brosur ke WhatsApp Saya',
    successMessage: 'Brosur digital sedang kami kirimkan ke nomor WhatsApp Anda.',
    notifyEmail: 'emerald@ziaproperti.co.id',
    notifyWhatsApp: '6281288889922',
    status: 'published'
  }
];

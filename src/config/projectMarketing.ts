export interface ProjectMarketingProfile {
  /** Keywords used as editorial SEO guidance and optional metadata. Primary SEO remains useful titles, descriptions, content and links. */
  seoKeywords: string[];
  /** Hashtags intended for social posts and campaign copy, not as a substitute for web SEO. */
  socialHashtags: string[];
  visitDateLabel: string;
  visitTimeLabel: string;
  offerLabel: string;
  offerOptions: string[];
  submitButtonText: string;
  ctaLabel: string;
}

export const PROJECT_MARKETING: Record<string, ProjectMarketingProfile> = {
  'zia-emerald': {
    seoKeywords: [
      'rumah dijual Bekasi',
      'perumahan Tarumajaya',
      'rumah American Classic Bekasi',
      'rumah 1 lantai Bekasi',
      'rumah mezzanine Bekasi',
      'rumah 2 lantai Bekasi',
      'simulasi KPR rumah Bekasi',
      'ZIA Emerald'
    ],
    socialHashtags: [
      '#ZIAEmerald',
      '#RumahBekasi',
      '#RumahTarumajaya',
      '#PerumahanBekasi',
      '#RumahAmericanClassic',
      '#RumahMezzanine',
      '#KPRRumah',
      '#HunianKeluarga'
    ],
    visitDateLabel: 'Tanggal rencana kunjungan rumah contoh',
    visitTimeLabel: 'Waktu yang diinginkan',
    offerLabel: 'Promo atau benefit yang ingin ditanyakan',
    offerOptions: [
      'Informasi diskon atau promo yang sedang berlaku (S&K dikonfirmasi tim sales)',
      'DP dan pilihan cara bayar',
      'Simulasi KPR dan estimasi cicilan',
      'Promo biaya KPR atau legalitas',
      'Informasi tipe, harga, dan ketersediaan unit',
      'Konsultasi umum'
    ],
    submitButtonText: 'Jadwalkan Visit & Minta Promo',
    ctaLabel: 'Jadwalkan Kunjungan ZIA Emerald'
  },
  'kav-hillside': {
    seoKeywords: [
      'kavling dijual Bekasi',
      'tanah kavling Tarumajaya',
      'kavling siap bangun Bekasi',
      'investasi tanah Bekasi',
      'site plan kavling Bekasi',
      'Kav Hillside'
    ],
    socialHashtags: [
      '#KavHillside',
      '#KavlingBekasi',
      '#TanahKavling',
      '#KavlingSiapBangun',
      '#InvestasiProperti',
      '#PropertiBekasi'
    ],
    visitDateLabel: 'Tanggal rencana survei kavling',
    visitTimeLabel: 'Waktu yang diinginkan',
    offerLabel: 'Penawaran yang ingin ditanyakan',
    offerOptions: [
      'Informasi diskon atau penawaran survei jika tersedia (S&K dikonfirmasi tim)',
      'Daftar harga dan ketersediaan kavling',
      'Site plan dan nomor kavling',
      'Informasi legalitas dan proses transaksi',
      'Konsultasi pembelian beberapa kavling'
    ],
    submitButtonText: 'Jadwalkan Survei Kavling',
    ctaLabel: 'Jadwalkan Survei Kav Hillside'
  },
  'zia-farm': {
    seoKeywords: [
      'jual sapi qurban Bekasi',
      'jual domba qurban Bekasi',
      'jual kambing qurban',
      'peternakan Bekasi',
      'Kandang Ternak H. Bowo',
      'ZIA Farm',
      'layanan aqiqah Bekasi'
    ],
    socialHashtags: [
      '#ZIAFarm',
      '#KandangTernakHBowo',
      '#SapiQurban',
      '#DombaQurban',
      '#KambingQurban',
      '#PeternakanBekasi',
      '#AqiqahBekasi'
    ],
    visitDateLabel: 'Tanggal rencana kunjungan kandang',
    visitTimeLabel: 'Waktu yang diinginkan',
    offerLabel: 'Kebutuhan atau penawaran yang ingin ditanyakan',
    offerOptions: [
      'Informasi diskon atau penawaran ternak jika tersedia',
      'Penawaran sapi qurban',
      'Penawaran domba atau kambing',
      'Paket aqiqah',
      'Jadwal kunjungan dan pemilihan ternak',
      'Kemitraan pasokan atau pembelian partai',
      'Konsultasi umum'
    ],
    submitButtonText: 'Jadwalkan Kunjungan & Minta Penawaran',
    ctaLabel: 'Jadwalkan Kunjungan ZIA Farm'
  },
  'altara-zia-international': {
    seoKeywords: [
      'Indonesian vanilla bean exporter',
      'premium vanilla beans Indonesia',
      'vanilla planifolia supplier',
      'vanilla tahitensis exporter',
      'vanilla bean wholesale B2B',
      'Indonesian vanilla sourcing',
      'Altara ZIA International'
    ],
    socialHashtags: [
      '#AltaraZIAInternational',
      '#IndonesianVanilla',
      '#VanillaBeans',
      '#VanillaExporter',
      '#VanillaSourcing',
      '#B2BExport',
      '#IndonesianSpices'
    ],
    visitDateLabel: 'Tanggal konsultasi atau buyer meeting',
    visitTimeLabel: 'Waktu meeting yang diinginkan (WIB)',
    offerLabel: 'Kebutuhan komersial yang ingin dibahas',
    offerOptions: [
      'Request sample',
      'Informasi penawaran komersial atau diskon volume jika tersedia',
      'Quotation dan harga berdasarkan volume',
      'Spesifikasi produk dan dokumen mutu',
      'Kebutuhan ekspor dan logistik',
      'Buyer meeting atau konsultasi sourcing',
      'Contract farming atau kerja sama pasokan'
    ],
    submitButtonText: 'Jadwalkan Konsultasi & Minta Quotation',
    ctaLabel: 'Jadwalkan Konsultasi Altara'
  }
};

export const DEFAULT_SOCIAL_HASHTAGS = [
  '#ZIAPeropertiIndonesia',
  '#EkosistemZIA'
];

export function getProjectMarketing(slug: string): ProjectMarketingProfile | undefined {
  return PROJECT_MARKETING[slug];
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'sales' | 'marketing';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectEntity {
  id: string;
  slug: 'zia-emerald' | 'kav-hillside' | 'zia-farm' | 'altara-zia-international' | string;
  name: string;
  category: string;
  tagline: string;
  location: string;
  shortDescription: string;
  longDescription: string;
  status: 'Development' | 'Active' | 'Available' | 'Exporting' | 'Coming Soon';
  heroImage: string;
  logoUrl?: string;
  featured: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
  /** SEO keywords are editorial guidance; they do not replace useful page content. */
  seoKeywords?: string[];
  /** Social campaign hashtags, intended for social copy and internal CMS planning. */
  socialHashtags?: string[];
  /** Optional official site-plan image path, served from public/. */
  sitePlanImage?: string;
  contactWhatsApp: string;
  accentColor?: string;
  themeStyle?: 'emerald' | 'moss' | 'earth' | 'midnight' | 'classic';
  facilities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type PropertyStatus = 'Available' | 'Reserved' | 'Sold' | 'Unavailable' | 'Coming Soon';

export interface PropertyItem {
  id: string;
  projectSlug: string;
  name: string;
  type: string;
  code?: string;
  block?: string;
  lot?: string;
  landArea: number;
  buildingArea: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  price?: number;
  priceFormatted: string;
  bookingFee?: number;
  downPayment?: string;
  installmentEstimate?: string;
  promoBadge?: string;
  status: PropertyStatus;
  lifecycleStatus?: ContentStatus;
  mainImage: string;
  gallery: string[];
  floorPlanUrl?: string;
  description: string;
  specifications: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface KavlingPlot {
  id: string;
  plotId: string;
  block: string;
  lotNumber: string;
  landSize: number;
  frontage: number;
  price?: number;
  priceFormatted: string;
  status: PropertyStatus;
  lifecycleStatus?: ContentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Site Visit' | 'Follow Up' | 'Booked' | 'Closed' | 'Lost';

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectSlug: string;
  projectName: string;
  propertyType?: string;
  budgetRange?: string;
  source: string;
  message?: string;
  visitDate?: string;
  visitTime?: string;
  requestedOffer?: string;
  status: LeadStatus;
  assignedStaff?: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  featured: boolean;
  type?: 'blog' | 'news';
  status?: ContentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  title: string;
  alt: string;
  brand: 'Corporate' | 'ZIA Emerald' | 'Kav Hillside' | 'ZIA Farm' | 'Altara ZIA International';
  category: 'Architecture' | 'Interior' | 'Exterior' | 'Masterplan' | 'Landscape' | 'Livestock' | 'Vanilla' | 'Corporate';
  caption?: string;
  description?: string;
  copyright?: string;
  fileType: string;
  fileSize?: string;
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  headquarters: string;
  fullAddress: string;
  email: string;
  phone: string;
  contactWhatsApp?: string;
  corporateWhatsApp: string;
  emeraldWhatsApp: string;
  kavWhatsApp: string;
  farmWhatsApp: string;
  altaraWhatsApp: string;
  officeHours: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  ga4Id: string;
  metaPixelId: string;
  metaKeywords?: string;
  updatedAt?: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  projectSlug: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  status?: ContentStatus;
  createdAt?: string;
}

export interface FAQItem {
  id: string;
  projectSlug: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  status?: ContentStatus;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  order: number;
  status: ContentStatus;
  updatedAt?: string;
}

export interface SectionItem {
  id: string;
  pageSlug: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  order: number;
  status: ContentStatus;
  updatedAt?: string;
}

export interface PromotionItem {
  id: string;
  title: string;
  projectSlug: string;
  badge: string;
  description: string;
  discountValue?: string;
  startDate: string;
  endDate: string;
  bannerImage?: string;
  terms?: string;
  status: ContentStatus;
  featured?: boolean;
  updatedAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  location: 'header' | 'footer' | 'dropdown' | 'mobile';
  parentLabel?: string;
  isExternal?: boolean;
  order: number;
  status: ContentStatus;
  updatedAt?: string;
}

export interface FormConfigItem {
  id: string;
  name: string;
  formKey: string;
  projectSlug: string;
  title: string;
  subtitle: string;
  submitButtonText: string;
  successMessage: string;
  notifyEmail?: string;
  notifyWhatsApp?: string;
  status: ContentStatus;
  updatedAt?: string;
}


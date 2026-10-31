import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { cleanWhatsAppNumber } from '../lib/contactUtils';
import {
  INITIAL_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_PROPERTIES,
  INITIAL_PLOTS,
  INITIAL_POSTS,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_MEDIA,
  INITIAL_PAGES,
  INITIAL_SECTIONS,
  INITIAL_PROMOTIONS,
  INITIAL_NAVIGATION,
  INITIAL_FORMS
} from '../data/initialData';
import {
  CompanySettings,
  ProjectEntity,
  PropertyItem,
  KavlingPlot,
  LeadItem,
  PostItem,
  MediaAsset,
  FAQItem,
  TestimonialItem,
  UserProfile,
  PageItem,
  SectionItem,
  PromotionItem,
  NavigationItem,
  FormConfigItem,
  ContentStatus
} from '../types';

export async function initializeDatabaseIfEmpty() {
  // Public visitors must never bootstrap Firestore writes. A designated
  // administrator session triggers this initializer from AuthContext.
  if (!auth.currentUser) return;

  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'global'), {
        ...INITIAL_SETTINGS,
        updatedAt: new Date().toISOString()
      });

      for (const proj of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', proj.slug), {
          ...proj,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      for (const prop of INITIAL_PROPERTIES) {
        await setDoc(doc(db, 'properties', prop.id), {
          ...prop,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      for (const plot of INITIAL_PLOTS) {
        await setDoc(doc(db, 'plots', plot.id), {
          ...plot,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      for (const post of INITIAL_POSTS) {
        await setDoc(doc(db, 'posts', post.id), {
          ...post,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      for (const faq of INITIAL_FAQS) {
        await setDoc(doc(db, 'faqs', faq.id), faq);
      }

      for (const t of INITIAL_TESTIMONIALS) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }

      for (const m of INITIAL_MEDIA) {
        await setDoc(doc(db, 'media', m.id), m);
      }
    }
  } catch (err) {
    console.warn('Auto-init database skipped or running in fallback mode:', err);
  }
}

// Global Settings
export async function getCompanySettings(): Promise<CompanySettings> {
  let localData: Partial<CompanySettings> = {};
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('zia_cached_settings');
      if (cached) localData = JSON.parse(cached);
    } catch {}
  }

  try {
    const snap = await getDoc(doc(db, 'settings', 'global'));
    if (snap.exists()) {
      const data = snap.data() as CompanySettings;
      const merged: CompanySettings = {
        ...INITIAL_SETTINGS,
        ...localData,
        ...data,
        contactWhatsApp: data.contactWhatsApp || data.corporateWhatsApp || INITIAL_SETTINGS.contactWhatsApp,
        corporateWhatsApp: data.corporateWhatsApp || data.contactWhatsApp || INITIAL_SETTINGS.corporateWhatsApp
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('zia_cached_settings', JSON.stringify(merged));
        } catch {}
      }
      return merged;
    }
  } catch (err) {
    console.warn('Using local/cached settings due to Firestore access:', err);
  }

  return {
    ...INITIAL_SETTINGS,
    ...localData
  };
}

export async function updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
  // Normalize and sanitize WhatsApp numbers if provided.
  const sanitized: Partial<CompanySettings> = { ...data };
  if (sanitized.contactWhatsApp) {
    sanitized.contactWhatsApp = cleanWhatsAppNumber(sanitized.contactWhatsApp);
    sanitized.corporateWhatsApp = sanitized.contactWhatsApp;
  } else if (sanitized.corporateWhatsApp) {
    sanitized.corporateWhatsApp = cleanWhatsAppNumber(sanitized.corporateWhatsApp);
    sanitized.contactWhatsApp = sanitized.corporateWhatsApp;
  }
  if (sanitized.emeraldWhatsApp) {
    sanitized.emeraldWhatsApp = cleanWhatsAppNumber(sanitized.emeraldWhatsApp, '6281288889922');
  }
  if (sanitized.kavWhatsApp) {
    sanitized.kavWhatsApp = cleanWhatsAppNumber(sanitized.kavWhatsApp, '6281288889933');
  }
  if (sanitized.farmWhatsApp) {
    sanitized.farmWhatsApp = cleanWhatsAppNumber(sanitized.farmWhatsApp, '6281288889944');
  }
  if (sanitized.altaraWhatsApp) {
    sanitized.altaraWhatsApp = cleanWhatsAppNumber(sanitized.altaraWhatsApp, '6281288889955');
  }

  const updatedAt = new Date().toISOString();
  let merged: CompanySettings = { ...INITIAL_SETTINGS, ...sanitized, updatedAt };

  // Prepare the merged client value, but do not change cache or UI before the
  // authoritative Firestore write succeeds.
  if (typeof window !== 'undefined') {
    try {
      const current = localStorage.getItem('zia_cached_settings');
      const parsed = current ? JSON.parse(current) : INITIAL_SETTINGS;
      merged = { ...parsed, ...sanitized, updatedAt };
    } catch {
      // A malformed cache must not prevent saving the canonical Firestore data.
    }
  }

  const path = 'settings/global';
  try {
    await setDoc(doc(db, 'settings', 'global'), { ...sanitized, updatedAt }, { merge: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zia_cached_settings', JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('zia_settings_updated', { detail: merged }));
      } catch (cacheError) {
        console.warn('Settings saved to Firestore, but local cache refresh failed:', cacheError);
      }
    }

    return merged;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Projects
export async function getProjects(): Promise<ProjectEntity[]> {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as ProjectEntity));
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch (err) {
    console.warn('getProjects fallback to INITIAL_PROJECTS', err);
  }
  return INITIAL_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<ProjectEntity | null> {
  try {
    const snap = await getDoc(doc(db, 'projects', slug));
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id } as ProjectEntity;
    }
  } catch (err) {
    console.warn('getProjectBySlug fallback', err);
  }
  return INITIAL_PROJECTS.find(p => p.slug === slug) || null;
}

export async function updateProject(slug: string, data: Partial<ProjectEntity>) {
  const ref = doc(db, 'projects', slug);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

export async function saveProject(project: Partial<ProjectEntity>): Promise<string> {
  const slug = project.slug || `project-${Date.now()}`;
  const ref = doc(db, 'projects', slug);
  await setDoc(
    ref,
    {
      ...project,
      slug,
      updatedAt: new Date().toISOString(),
      createdAt: project.createdAt || new Date().toISOString()
    },
    { merge: true }
  );
  return slug;
}

export async function deleteProject(slug: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', slug));
}

// FAQs CRUD
export async function getFAQs(projectSlug?: string): Promise<FAQItem[]> {
  try {
    const coll = collection(db, 'faqs');
    const q = projectSlug ? query(coll, where('projectSlug', '==', projectSlug)) : coll;
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as FAQItem));
    }
  } catch (err) {
    console.warn('getFAQs fallback', err);
  }
  if (projectSlug) {
    return INITIAL_FAQS.filter(f => f.projectSlug === projectSlug);
  }
  return INITIAL_FAQS;
}

export async function saveFAQ(faq: Partial<FAQItem>): Promise<string> {
  if (faq.id) {
    await setDoc(doc(db, 'faqs', faq.id), faq, { merge: true });
    return faq.id;
  } else {
    const docRef = await addDoc(collection(db, 'faqs'), faq);
    return docRef.id;
  }
}

export async function deleteFAQ(id: string): Promise<void> {
  await deleteDoc(doc(db, 'faqs', id));
}

// Testimonials CRUD
export async function getTestimonials(projectSlug?: string): Promise<TestimonialItem[]> {
  try {
    const coll = collection(db, 'testimonials');
    const q = projectSlug ? query(coll, where('projectSlug', '==', projectSlug)) : coll;
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as TestimonialItem));
    }
  } catch (err) {
    console.warn('getTestimonials fallback', err);
  }
  if (projectSlug) {
    return INITIAL_TESTIMONIALS.filter(t => t.projectSlug === projectSlug);
  }
  return INITIAL_TESTIMONIALS;
}

export async function saveTestimonial(t: Partial<TestimonialItem>): Promise<string> {
  if (t.id) {
    await setDoc(doc(db, 'testimonials', t.id), { ...t, updatedAt: new Date().toISOString() }, { merge: true });
    return t.id;
  } else {
    const docRef = await addDoc(collection(db, 'testimonials'), {
      ...t,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id));
}

// Users Management
const INITIAL_CMS_USERS: UserProfile[] = [
  {
    uid: 'str6aMtNRzVF3ttdQtG0Z7pVUTX2',
    email: 'ziaproperti@corporate.co.id',
    displayName: 'Administrator ZIA Properti',
    role: 'super_admin',
    phone: '+6289699703304',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'jI2BH93v4JPWPZ6ULONFA9LaDdz1',
    email: 'konten.ziaproperti@gmail.com',
    displayName: 'Tim Konten ZIA Properti',
    role: 'admin',
    phone: '+6289699703304',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'user-superadmin',
    email: 'garenkdeathcore@gmail.com',
    displayName: 'Super Administrator',
    role: 'super_admin',
    phone: '+6289699703304',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

export async function getUsers(): Promise<UserProfile[]> {
  if (!auth.currentUser) {
    return INITIAL_CMS_USERS;
  }
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (!snap.empty) {
      const dbUsers = snap.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile));
      // Ensure designated administrators are present if not yet saved in Firestore collection
      const existingUids = new Set(dbUsers.map(u => u.uid));
      const missingDesignated = INITIAL_CMS_USERS.filter(u => !existingUids.has(u.uid));
      return [...dbUsers, ...missingDesignated];
    }
  } catch (err) {
    console.warn('getUsers fallback', err);
  }
  return INITIAL_CMS_USERS;
}

export async function saveUser(user: Partial<UserProfile>): Promise<string> {
  const uid = user.uid || `user-${Date.now()}`;
  await setDoc(
    doc(db, 'users', uid),
    {
      ...user,
      uid,
      updatedAt: new Date().toISOString(),
      createdAt: user.createdAt || new Date().toISOString()
    },
    { merge: true }
  );
  return uid;
}

// Properties
export async function getProperties(projectSlug?: string): Promise<PropertyItem[]> {
  try {
    const coll = collection(db, 'properties');
    const q = projectSlug ? query(coll, where('projectSlug', '==', projectSlug)) : coll;
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as PropertyItem));
    }
  } catch (err) {
    console.warn('getProperties fallback to INITIAL_PROPERTIES', err);
  }
  if (projectSlug) {
    return INITIAL_PROPERTIES.filter(p => p.projectSlug === projectSlug);
  }
  return INITIAL_PROPERTIES;
}

export async function saveProperty(item: Partial<PropertyItem>) {
  if (item.id) {
    const ref = doc(db, 'properties', item.id);
    await setDoc(ref, { ...item, updatedAt: new Date().toISOString() }, { merge: true });
    return item.id;
  } else {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deleteProperty(id: string) {
  await deleteDoc(doc(db, 'properties', id));
}

// Kavling Plots
export async function getKavlingPlots(): Promise<KavlingPlot[]> {
  try {
    const snap = await getDocs(collection(db, 'plots'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as KavlingPlot));
    }
  } catch (err) {
    console.warn('getKavlingPlots fallback', err);
  }
  return INITIAL_PLOTS;
}

export async function saveKavlingPlot(item: Partial<KavlingPlot>) {
  if (item.id) {
    const ref = doc(db, 'plots', item.id);
    await setDoc(ref, { ...item, updatedAt: new Date().toISOString() }, { merge: true });
    return item.id;
  } else {
    const docRef = await addDoc(collection(db, 'plots'), {
      ...item,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deleteKavlingPlot(id: string) {
  await deleteDoc(doc(db, 'plots', id));
}

// Leads / Inquiries
export async function createLead(lead: Omit<LeadItem, 'id' | 'createdAt'>): Promise<string> {
  const payload = {
    ...lead,
    createdAt: new Date().toISOString(),
    status: lead.status || 'New'
  };
  try {
    const ref = await addDoc(collection(db, 'leads'), payload);
    try {
      const existing = localStorage.getItem('zia_cached_leads');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift({ ...payload, id: ref.id });
      localStorage.setItem('zia_cached_leads', JSON.stringify(list));
    } catch {}
    return ref.id;
  } catch (err) {
    console.warn('Local lead mock storage on error:', err);
    const mockId = 'local-' + Date.now();
    try {
      const existing = localStorage.getItem('zia_cached_leads');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift({ ...payload, id: mockId });
      localStorage.setItem('zia_cached_leads', JSON.stringify(list));
    } catch {}
    return mockId;
  }
}

export async function getLeads(): Promise<LeadItem[]> {
  if (!auth.currentUser) {
    try {
      const cached = localStorage.getItem('zia_cached_leads');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }
  try {
    const snap = await getDocs(query(collection(db, 'leads'), orderBy('createdAt', 'desc')));
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as LeadItem));
      localStorage.setItem('zia_cached_leads', JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn('getLeads error or permission denied (sign in required)', err);
  }
  try {
    const cached = localStorage.getItem('zia_cached_leads');
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

export async function updateLeadStatus(id: string, status: LeadItem['status'], notes?: string) {
  const ref = doc(db, 'leads', id);
  await updateDoc(ref, {
    status,
    ...(notes ? { notes } : {}),
    updatedAt: new Date().toISOString()
  });
}

export async function deleteLead(id: string) {
  await deleteDoc(doc(db, 'leads', id));
}

// Media Assets
export async function getMediaAssets(brand?: string): Promise<MediaAsset[]> {
  try {
    const coll = collection(db, 'media');
    const q = brand ? query(coll, where('brand', '==', brand)) : coll;
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as MediaAsset));
    }
  } catch (err) {
    console.warn('getMediaAssets fallback to INITIAL_MEDIA', err);
  }
  if (brand) {
    return INITIAL_MEDIA.filter(m => m.brand === brand);
  }
  return INITIAL_MEDIA;
}

export async function addMediaAsset(asset: Omit<MediaAsset, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'media'), {
    ...asset,
    createdAt: new Date().toISOString()
  });
  return ref.id;
}

export async function deleteMediaAsset(id: string) {
  await deleteDoc(doc(db, 'media', id));
}

// Posts / News
export async function getPosts(): Promise<PostItem[]> {
  try {
    const snap = await getDocs(collection(db, 'posts'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as PostItem));
    }
  } catch (err) {
    console.warn('getPosts fallback to INITIAL_POSTS', err);
  }
  return INITIAL_POSTS;
}

export async function savePost(post: Partial<PostItem>) {
  if (post.id) {
    await setDoc(doc(db, 'posts', post.id), { ...post, updatedAt: new Date().toISOString() }, { merge: true });
    return post.id;
  } else {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...post,
      createdAt: new Date().toISOString(),
      published: post.published ?? true
    });
    return docRef.id;
  }
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, 'posts', id));
}

// Pages CRUD
export async function getPages(): Promise<PageItem[]> {
  try {
    const snap = await getDocs(query(collection(db, 'pages'), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as PageItem));
    }
  } catch (err) {
    console.warn('getPages fallback to INITIAL_PAGES', err);
  }
  return INITIAL_PAGES;
}

export async function savePage(page: Partial<PageItem>) {
  if (page.id) {
    await setDoc(doc(db, 'pages', page.id), { ...page, updatedAt: new Date().toISOString() }, { merge: true });
    return page.id;
  } else {
    const docRef = await addDoc(collection(db, 'pages'), {
      ...page,
      status: page.status || 'draft',
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deletePage(id: string) {
  await deleteDoc(doc(db, 'pages', id));
}

// Sections CRUD
export async function getSections(pageSlug?: string): Promise<SectionItem[]> {
  try {
    const coll = collection(db, 'sections');
    const q = pageSlug ? query(coll, where('pageSlug', '==', pageSlug)) : coll;
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as SectionItem));
    }
  } catch (err) {
    console.warn('getSections fallback', err);
  }
  if (pageSlug) {
    return INITIAL_SECTIONS.filter(s => s.pageSlug === pageSlug);
  }
  return INITIAL_SECTIONS;
}

export async function saveSection(section: Partial<SectionItem>) {
  if (section.id) {
    await setDoc(doc(db, 'sections', section.id), { ...section, updatedAt: new Date().toISOString() }, { merge: true });
    return section.id;
  } else {
    const docRef = await addDoc(collection(db, 'sections'), {
      ...section,
      status: section.status || 'draft',
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deleteSection(id: string) {
  await deleteDoc(doc(db, 'sections', id));
}

// Promotions CRUD
export async function getPromotions(): Promise<PromotionItem[]> {
  try {
    const snap = await getDocs(collection(db, 'promotions'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as PromotionItem));
    }
  } catch (err) {
    console.warn('getPromotions fallback', err);
  }
  return INITIAL_PROMOTIONS;
}

export async function savePromotion(promo: Partial<PromotionItem>) {
  if (promo.id) {
    await setDoc(doc(db, 'promotions', promo.id), { ...promo, updatedAt: new Date().toISOString() }, { merge: true });
    return promo.id;
  } else {
    const docRef = await addDoc(collection(db, 'promotions'), {
      ...promo,
      status: promo.status || 'draft',
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deletePromotion(id: string) {
  await deleteDoc(doc(db, 'promotions', id));
}

// Navigation CRUD
export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const snap = await getDocs(query(collection(db, 'navigation'), orderBy('order', 'asc')));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as NavigationItem));
    }
  } catch (err) {
    console.warn('getNavigation fallback', err);
  }
  return INITIAL_NAVIGATION;
}

export async function saveNavigation(nav: Partial<NavigationItem>) {
  if (nav.id) {
    await setDoc(doc(db, 'navigation', nav.id), { ...nav, updatedAt: new Date().toISOString() }, { merge: true });
    return nav.id;
  } else {
    const docRef = await addDoc(collection(db, 'navigation'), {
      ...nav,
      status: nav.status || 'published',
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deleteNavigation(id: string) {
  await deleteDoc(doc(db, 'navigation', id));
}

// Forms CRUD
export async function getForms(): Promise<FormConfigItem[]> {
  try {
    const snap = await getDocs(collection(db, 'forms'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as FormConfigItem));
    }
  } catch (err) {
    console.warn('getForms fallback', err);
  }
  return INITIAL_FORMS;
}

export async function saveForm(form: Partial<FormConfigItem>) {
  if (form.id) {
    await setDoc(doc(db, 'forms', form.id), { ...form, updatedAt: new Date().toISOString() }, { merge: true });
    return form.id;
  } else {
    const docRef = await addDoc(collection(db, 'forms'), {
      ...form,
      status: form.status || 'published',
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }
}

export async function deleteForm(id: string) {
  await deleteDoc(doc(db, 'forms', id));
}

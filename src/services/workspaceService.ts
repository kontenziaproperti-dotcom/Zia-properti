import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LeadItem, PropertyItem, KavlingPlot } from '../types';

export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets'
];

// In-memory token storage (never localStorage per security rules)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Clear on auth state change
onAuthStateChanged(auth, (user) => {
  if (!user) {
    cachedAccessToken = null;
  }
});

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const signInWithWorkspaceScopes = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();
    WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan Google Workspace Access Token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

// ==========================================
// GOOGLE CALENDAR APIS
// ==========================================

export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  htmlLink?: string;
}

export const fetchCalendarEvents = async (): Promise<CalendarEventItem[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Akses Google Calendar membutuhkan login akun Google.');

  const now = new Date().toISOString();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
      now
    )}&singleEvents=true&orderBy=startTime&maxResults=20`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || 'Gagal mengambil jadwal Google Calendar.');
  }

  const data = await res.json();
  return data.items || [];
};

export const createCalendarEvent = async (event: {
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
}): Promise<CalendarEventItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Akses Google Calendar membutuhkan login akun Google.');

  const body = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: { dateTime: new Date(event.startDateTime).toISOString() },
    end: { dateTime: new Date(event.endDateTime).toISOString() }
  };

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || 'Gagal menambahkan event ke Google Calendar.');
  }

  return await res.json();
};

export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Akses Google Calendar membutuhkan login akun Google.');

  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 404) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || 'Gagal menghapus event dari Google Calendar.');
  }
};

// ==========================================
// GOOGLE DOCS APIS
// ==========================================

export interface GeneratedDocResult {
  documentId: string;
  title: string;
  url: string;
}

export const createGoogleDoc = async (
  title: string,
  contentBody: string
): Promise<GeneratedDocResult> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Akses Google Docs membutuhkan login akun Google.');

  // Step 1: Create empty document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat file Google Docs baru.');
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // Step 2: Insert text into document via batchUpdate
  if (contentBody) {
    const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: contentBody
            }
          }
        ]
      })
    });

    if (!updateRes.ok) {
      console.warn('Google Docs text insertion warning:', await updateRes.text());
    }
  }

  return {
    documentId,
    title,
    url: `https://docs.google.com/document/d/${documentId}/edit`
  };
};

// ==========================================
// GOOGLE SHEETS APIS
// ==========================================

export interface GeneratedSheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  rowsExported: number;
}

export const exportLeadsToGoogleSheet = async (
  leads: LeadItem[],
  customTitle?: string
): Promise<GeneratedSheetResult> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Akses Google Sheets membutuhkan login akun Google.');

  const title = customTitle || `Export Leads PT ZIA Properti - ${new Date().toLocaleDateString('id-ID')}`;

  // 1. Create Spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Daftar Prospek',
            gridProperties: { rowCount: leads.length + 10, columnCount: 10 }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat file Google Sheets.');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // 2. Prepare headers and rows
  const headers = [
    'Tanggal Masuk',
    'Nama Lengkap',
    'Nomor WhatsApp',
    'Email Konsumen',
    'Proyek Diminati',
    'Unit / Tipe',
    'Estimasi Budget',
    'Status Tindak Lanjut',
    'Catatan / Pesan',
    'Sumber Kanal'
  ];

  const rows = leads.map((l) => [
    l.createdAt ? new Date(l.createdAt).toLocaleDateString('id-ID') : '-',
    l.name,
    l.phone,
    l.email || '-',
    l.projectName || '-',
    l.propertyType || '-',
    l.budgetRange || '-',
    l.status.toUpperCase(),
    l.message || l.notes || '-',
    l.source || 'Website'
  ]);

  const values = [headers, ...rows];

  // 3. Append data to sheet
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Daftar%20Prospek!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengisi data ke Google Sheets.');
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    title,
    rowsExported: leads.length
  };
};

export const exportInventoryToGoogleSheet = async (
  properties: PropertyItem[],
  plots: KavlingPlot[],
  customTitle?: string
): Promise<GeneratedSheetResult> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Akses Google Sheets membutuhkan login akun Google.');

  const title = customTitle || `Inventaris Unit & Kavling PT ZIA - ${new Date().toLocaleDateString('id-ID')}`;

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Unit Hunian & Kavling',
            gridProperties: { rowCount: properties.length + plots.length + 10, columnCount: 9 }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat file spreadsheet inventaris.');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  const headers = [
    'Kategori',
    'Kode / Nama Unit',
    'Proyek',
    'Tipe Spesifikasi',
    'Luas Tanah (m²)',
    'Luas Bangunan (m²)',
    'Harga (Rp)',
    'Status Ketersediaan',
    'Catatan / Badge'
  ];

  const propRows = properties.map((p) => [
    'Unit Hunian',
    p.name,
    p.projectSlug === 'zia-emerald' ? 'ZIA Emerald' : p.projectSlug,
    p.type,
    p.landArea,
    p.buildingArea,
    p.priceFormatted || p.price || '-',
    p.status.toUpperCase(),
    p.promoBadge || p.description?.slice(0, 50) || '-'
  ]);

  const plotRows = plots.map((pl) => [
    'Kavling Tanah',
    pl.plotId || `Blok ${pl.block} No. ${pl.lotNumber}`,
    'Kav Hillside',
    'Kavling Siap Bangun',
    pl.landSize,
    0,
    pl.priceFormatted || pl.price || '-',
    pl.status.toUpperCase(),
    pl.notes || 'Sertifikat SHM Terjamin'
  ]);

  const values = [headers, ...propRows, ...plotRows];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Unit%20Hunian%20%26%20Kavling!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal memasukkan baris inventaris ke spreadsheet.');
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    title,
    rowsExported: properties.length + plots.length
  };
};

import { CompanySettings } from '../types';

/**
 * Standard utility to clean and format any phone number into an international
 * WhatsApp format without '+', spaces, or hyphens (e.g. '081288889911' -> '6281288889911')
 */
export function cleanWhatsAppNumber(
  phone: string | undefined | null,
  fallback = '6281288889911'
): string {
  if (!phone) return fallback;
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (!cleaned) return fallback;

  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  } else if (cleaned.startsWith('021')) {
    cleaned = '6221' + cleaned.slice(3);
  }

  // Minimum sensible international length is 9 digits (e.g. 62812...)
  if (cleaned.length < 9) {
    return fallback;
  }

  return cleaned;
}

/**
 * Formats a clean Indonesian phone/WhatsApp number for elegant human reading
 * e.g. '6281288889911' -> '+62 812-8888-9911'
 * e.g. '+62 21 8899 7654' -> '+62 21 8899 7654'
 */
export function formatIndonesianPhone(
  phone: string | undefined | null,
  fallback = '+62 21 8899 7654'
): string {
  if (!phone) return fallback;
  const raw = String(phone).trim();
  const digits = raw.replace(/[^0-9]/g, '');

  if (digits.startsWith('628') && digits.length >= 11) {
    const operator = digits.slice(2, 5); // 812
    const mid = digits.slice(5, 9);      // 8888
    const rest = digits.slice(9);       // 9911
    return `+62 ${operator}-${mid}-${rest}`;
  }

  if (digits.startsWith('08') && digits.length >= 10) {
    const operator = digits.slice(1, 4);
    const mid = digits.slice(4, 8);
    const rest = digits.slice(8);
    return `+62 ${operator}-${mid}-${rest}`;
  }

  if (digits.startsWith('6221') || digits.startsWith('021')) {
    return raw.startsWith('+') ? raw : `+62 21 ${raw.replace(/^(021|\+?6221)/, '').trim()}`;
  }

  return raw || fallback;
}

/**
 * Builds a direct, valid WhatsApp URL with prefilled URL-encoded message
 */
export function buildWhatsAppUrl(
  phone: string | undefined | null,
  message: string,
  fallback = '6281288889911'
): string {
  const cleanNum = cleanWhatsAppNumber(phone, fallback);
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

/**
 * Validates Indonesian phone or WhatsApp input
 */
export function validatePhoneNumber(
  phone: string,
  type: 'phone' | 'whatsapp' = 'whatsapp'
): { valid: boolean; error?: string; formatted?: string } {
  if (!phone || !phone.trim()) {
    return { valid: false, error: 'Nomor tidak boleh kosong.' };
  }

  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 8) {
    return { valid: false, error: 'Nomor telepon terlalu pendek (minimal 8 digit).' };
  }
  if (digits.length > 16) {
    return { valid: false, error: 'Nomor telepon terlalu panjang (maksimal 16 digit).' };
  }

  if (type === 'whatsapp') {
    if (!digits.startsWith('62') && !digits.startsWith('08') && !digits.startsWith('8')) {
      return {
        valid: false,
        error: 'Nomor WhatsApp Indonesia harus diawali dengan 08, 62, atau 8.'
      };
    }
  }

  return { valid: true, formatted: cleanWhatsAppNumber(phone) };
}

/**
 * Returns project-specific WhatsApp configuration based on active route or slug
 */
export function getProjectContact(
  settings: CompanySettings,
  projectSlug?: string
): {
  number: string;
  cleanNumber: string;
  displayFormatted: string;
  channelName: string;
  defaultMessage: string;
} {
  switch (projectSlug) {
    case 'zia-emerald':
      return {
        number: settings.emeraldWhatsApp || '6281288889922',
        cleanNumber: cleanWhatsAppNumber(settings.emeraldWhatsApp, '6281288889922'),
        displayFormatted: formatIndonesianPhone(settings.emeraldWhatsApp || '6281288889922'),
        channelName: 'Sales ZIA Emerald (Residensial)',
        defaultMessage:
          'Halo Tim Sales ZIA Emerald, saya ingin informasi mengenai ketersediaan unit American Classic di Tarumajaya Bekasi dan jadwal survei.'
      };

    case 'kav-hillside':
      return {
        number: settings.kavWhatsApp || '6281288889933',
        cleanNumber: cleanWhatsAppNumber(settings.kavWhatsApp, '6281288889933'),
        displayFormatted: formatIndonesianPhone(settings.kavWhatsApp || '6281288889933'),
        channelName: 'Sales Kav Hillside (Kavling Tanah)',
        defaultMessage:
          'Halo Tim Sales Kav Hillside, saya ingin informasi ketersediaan blok kavling, luas tanah, dan skema pembayaran tunai/bertahap.'
      };

    case 'zia-farm':
      return {
        number: settings.farmWhatsApp || '6281288889944',
        cleanNumber: cleanWhatsAppNumber(settings.farmWhatsApp, '6281288889944'),
        displayFormatted: formatIndonesianPhone(settings.farmWhatsApp || '6281288889944'),
        channelName: 'Layanan ZIA Farm (Peternakan)',
        defaultMessage:
          'Halo Tim ZIA Farm, saya ingin informasi pemesanan hewan ternak qurban/aqiqah dan program kemitraan peternakan terpadu.'
      };

    case 'altara-zia-international':
      return {
        number: settings.altaraWhatsApp || '6281288889955',
        cleanNumber: cleanWhatsAppNumber(settings.altaraWhatsApp, '6281288889955'),
        displayFormatted: formatIndonesianPhone(settings.altaraWhatsApp || '6281288889955'),
        channelName: 'Altara ZIA International (Vanilla Export)',
        defaultMessage:
          'Hello Altara ZIA International, I would like to inquire about premium Indonesian vanilla beans export specifications and supply.'
      };

    default: {
      const mainNum = settings.contactWhatsApp || settings.corporateWhatsApp || '6281288889911';
      return {
        number: mainNum,
        cleanNumber: cleanWhatsAppNumber(mainNum, '6281288889911'),
        displayFormatted: formatIndonesianPhone(mainNum),
        channelName: 'Hotline Korporat PT ZIA Properti Indonesia',
        defaultMessage:
          'Halo Tim PT ZIA Properti Indonesia, saya ingin berkonsultasi mengenai proyek dan ekosistem bisnis ZIA.'
      };
    }
  }
}

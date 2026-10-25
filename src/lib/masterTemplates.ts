/**
 * @file src/lib/masterTemplates.ts
 * @description Immutable Master Template catalog and helper utilities for resolving
 * custom client invitation overrides (`customData`) while preserving 100% of each
 * master template's original showcase defaults when fields are omitted.
 */

import type { CustomInvitationData, TemplateSlug } from '@/types/zaria';

/**
 * Read-only specification for each of the 7 ZARIA master templates.
 */
export interface MasterTemplateDefinition {
  /** Unique template identifier. */
  id: TemplateSlug;
  /** Arabic display name of the template. */
  nameAr: string;
  /** English display name of the template. */
  nameEn: string;
  /** Occasion category label in Arabic. */
  categoryAr: string;
  /** Badge icon/emoji. */
  icon: string;
  /** Default showcase host/couple names. */
  defaultHostNames: string;
  /** Default showcase welcome/invitation wording. */
  defaultWelcomeMessage: string;
  /** Default showcase ISO date (YYYY-MM-DD). */
  defaultEventDate: string;
  /** Default showcase 24h time (HH:mm). */
  defaultEventTime: string;
  /** Default showcase Arabic date display string. */
  defaultArabicDate: string;
  /** Default showcase Arabic time display string. */
  defaultArabicTime: string;
  /** Default showcase venue name. */
  defaultVenueName: string;
  /** Default showcase Google Maps URL. */
  defaultLocationUrl: string;
  /** Default showcase YouTube video ID. */
  defaultYoutubeVideoId: string;
  /** Default showcase notes (newline-separated). */
  defaultCustomNote: string;
}

/**
 * Immutable catalog of the 7 master templates and their default showcase values.
 */
export const MASTER_TEMPLATES: readonly MasterTemplateDefinition[] = Object.freeze([
  {
    id: 'wedding-royal',
    nameAr: 'الملكي (زفاف فخم)',
    nameEn: 'Wedding Royal',
    categoryAr: 'حفل زفاف',
    icon: '♔',
    defaultHostNames: 'أحمد & سارة',
    defaultWelcomeMessage:
      'بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '21:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة التاسعة مساءً',
    defaultVenueName: 'فندق فور سيزونز',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman',
    defaultYoutubeVideoId: 'YCJET0fGGDU',
    defaultCustomNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة تشمل حاملها والعائلة الكريمة',
  },
  {
    id: 'wedding-classic',
    nameAr: 'كلاسيكي (أوف وايت وذهبي)',
    nameEn: 'Wedding Classic',
    categoryAr: 'حفل زفاف',
    icon: '🤍',
    defaultHostNames: 'عمر & آيات',
    defaultWelcomeMessage:
      'بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '21:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة التاسعة مساءً',
    defaultVenueName: 'فندق فور سيزونز',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman',
    defaultYoutubeVideoId: 'Hp8WTVqR_0U',
    defaultCustomNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة تشمل حاملها والعائلة الكريمة',
  },
  {
    id: 'engagement-floral',
    nameAr: 'خطوبة وردية (لافندر)',
    nameEn: 'Engagement Floral',
    categoryAr: 'حفل خطوبة',
    icon: '❀',
    defaultHostNames: 'عمر & آيات',
    defaultWelcomeMessage:
      'بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفل خطوبتنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '21:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة التاسعة مساءً',
    defaultVenueName: 'فندق فور سيزونز',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman',
    defaultYoutubeVideoId: '7oouSAlrzbY',
    defaultCustomNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة تشمل حاملها',
  },
  {
    id: 'graduation-modern',
    nameAr: 'تخرج عصري (كحلي ملكي)',
    nameEn: 'Graduation Modern',
    categoryAr: 'حفل تخرج',
    icon: '🎓',
    defaultHostNames: 'أحمد خالد',
    defaultWelcomeMessage:
      'بقلوبٍ مفعمةٍ بالفرح والسرور، وعطري الإنجاز والنجاح، أتشرف بدعوتكم لمشاركتي فرحة التخرج. حضوركم شرفٌ لي وتكتمل به فرحتي.',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '21:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة التاسعة مساءً',
    defaultVenueName: 'فندق فور سيزونز',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman',
    defaultYoutubeVideoId: '3AWAGo8NhfE',
    defaultCustomNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة تشمل حاملها العائلة الكريمة',
  },
  {
    id: 'graduation-notebook',
    nameAr: 'دفتر الذكريات (ثلاثي الأبعاد)',
    nameEn: 'Graduation Notebook',
    categoryAr: 'تخرج / ذكريات',
    icon: '📓',
    defaultHostNames: 'شهد الزوايدة',
    defaultWelcomeMessage:
      'في كتاب ذكريات تخرجي. وجودكم وكلماتكم تعني لي الكثير. تصفحوا الكتاب وشاركوني لحظاتكم وتهانيكم!',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '18:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة السادسة مساءً',
    defaultVenueName: 'الجامعة الأردنية',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=University+of+Jordan',
    defaultYoutubeVideoId: 'ZCg3kKN7VQs',
    defaultCustomNote: 'المحاسبة — CLASS OF 2026',
  },
  {
    id: 'birthday-fun',
    nameAr: 'ميلاد سينمائي (وردي)',
    nameEn: 'Birthday Fun',
    categoryAr: 'عيد ميلاد / مناسبة خاصة',
    icon: '🎈',
    defaultHostNames: 'الأميرة سارة',
    defaultWelcomeMessage:
      'بقلوبٍ مفعمةٍ بالفرح والسرور، نتشرّف بدعوتكم لمشاركتنا أجمل لحظات حياتنا في حفلنا. حضوركم شرفٌ لنا وبهجةٌ تكتمل بها فرحتنا.',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '21:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة التاسعة مساءً',
    defaultVenueName: 'فندق فور سيزونز',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Hotel+Amman',
    defaultYoutubeVideoId: 'UHP2ECjbTWM',
    defaultCustomNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة تشمل حاملها والعائلة الكريمة',
  },
  {
    id: 'newborn-cute',
    nameAr: 'استقبال مولود (سماوي)',
    nameEn: 'Newborn Cute',
    categoryAr: 'استقبال مولود',
    icon: '🍼',
    defaultHostNames: 'المولود زين',
    defaultWelcomeMessage:
      'بقلوبٍ يغمرها الحمدُ والشكرُ لله، وبفرحةٍ ازدانَ بها بيتُنا، نتشرّف بدعوتكم لمشاركتنا بهجة قدوم مولودنا الغالي في حفل استقباله. حضوركم يزيد فرحتنا نوراً وسروراً.',
    defaultEventDate: '2026-11-29',
    defaultEventTime: '18:00',
    defaultArabicDate: 'يوم الأحد، 29 تشرين الثاني 2026',
    defaultArabicTime: 'الساعة السادسة مساءً',
    defaultVenueName: 'بيت العائلة',
    defaultLocationUrl: 'https://www.google.com/maps/search/?api=1&query=31.9965,35.8335',
    defaultYoutubeVideoId: 'yl7a-5yxEAI',
    defaultCustomNote:
      'نتشرّف بحضوركم ومشاركتنا فرحة قدوم مولودنا زين\nوجودكم بيننا ودعواتكم الصالحة أجمل هدية لمولودنا\nالدعوة تشمل الأهل والأحبة الكرام',
  },
]);

/**
 * Valid template IDs array derived from `MASTER_TEMPLATES`.
 */
export const VALID_TEMPLATE_IDS: TemplateSlug[] = MASTER_TEMPLATES.map((t) => t.id);

/**
 * Looks up a master template definition by its `templateId`.
 *
 * @param {string} templateId - Template slug to look up.
 * @returns {MasterTemplateDefinition | undefined} Matching master template metadata.
 */
export function getMasterTemplate(templateId: string): MasterTemplateDefinition | undefined {
  return MASTER_TEMPLATES.find((t) => t.id === templateId);
}

/**
 * Splits a combined couple/host name string (e.g., "أحمد & سارة" or "أحمد و سارة")
 * into two separate names for couple templates, or falls back to the template's defaults.
 *
 * @param {string | undefined} rawNames - Custom host/couple names string.
 * @param {string} defaultFirst - Default groom/first name.
 * @param {string} defaultSecond - Default bride/second name.
 * @returns {[string, string]} Tuple of `[firstName, secondName]`.
 */
export function resolveCoupleNames(
  rawNames: string | undefined,
  defaultFirst: string,
  defaultSecond: string
): [string, string] {
  const trimmed = rawNames?.trim();
  if (!trimmed) return [defaultFirst, defaultSecond];

  const separators = [' & ', '&', ' و ', ' - ', ' / ', '،'];
  for (const sep of separators) {
    if (trimmed.includes(sep)) {
      const parts = trimmed.split(sep).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return [parts[0], parts.slice(1).join(' ')];
      }
    }
  }
  return [trimmed, defaultSecond];
}

/**
 * Resolves a single celebrant/host name from `customData`, falling back to `defaultName`.
 *
 * @param {CustomInvitationData | undefined} customData - Optional custom client data.
 * @param {string} defaultName - Default showcase name.
 * @returns {string} Resolved host/celebrant name.
 */
export function resolveSingleHostName(
  customData: CustomInvitationData | undefined,
  defaultName: string
): string {
  const raw = (customData?.hostNames || customData?.coupleNames || '').trim();
  return raw || defaultName;
}

/**
 * Resolves the custom welcome/invitation message or falls back to the master template's default.
 *
 * @param {CustomInvitationData | undefined} customData - Optional custom client data.
 * @param {string} defaultText - Default showcase invitation wording.
 * @returns {string} Resolved welcome message.
 */
export function resolveWelcomeMessage(
  customData: CustomInvitationData | undefined,
  defaultText: string
): string {
  const raw = (customData?.welcomeMessage || customData?.invitationText || '').trim();
  return raw || defaultText;
}

/**
 * Levant Arabic month names for formatting custom YYYY-MM-DD dates consistently with the showcase design.
 */
const LEVANT_MONTHS = [
  'كانون الثاني',
  'شباط',
  'آذار',
  'نيسان',
  'أيار',
  'حزيران',
  'تموز',
  'آب',
  'أيلول',
  'تشرين الأول',
  'تشرين الثاني',
  'كانون الأول',
];

const ARABIC_WEEKDAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

/**
 * Resolves all date, time, countdown target ISO string, and Save-the-Date calendar card values
 * from `customData`, falling back to the master template's original values when omitted.
 *
 * @param {CustomInvitationData | undefined} customData - Optional custom client data.
 * @param {Object} defaults - Template default date/time values.
 */
export function resolveEventDateTime(
  customData: CustomInvitationData | undefined,
  defaults: {
    isoTarget: string;
    arabicDate: string;
    arabicTime: string;
    calendarMonthYear: string;
    calendarDay: string;
    calendarWeekday: string;
  }
) {
  const customDate = customData?.eventDate?.trim();
  const customTime = customData?.eventTime?.trim();

  // Compute countdown ISO target string
  let isoTarget = defaults.isoTarget;
  if (customDate && /^\d{4}-\d{2}-\d{2}$/.test(customDate)) {
    const timePart =
      customTime && /^\d{2}:\d{2}$/.test(customTime) ? `${customTime}:00` : '21:00:00';
    isoTarget = `${customDate}T${timePart}`;
  }

  // Compute readable Arabic date and Save-the-Date calendar parts
  let arabicDate = defaults.arabicDate;
  let calendarMonthYear = defaults.calendarMonthYear;
  let calendarDay = defaults.calendarDay;
  let calendarWeekday = defaults.calendarWeekday;

  if (customDate) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(customDate)) {
      const [yearStr, monthStr, dayStr] = customDate.split('-');
      const year = Number(yearStr);
      const monthIndex = Number(monthStr) - 1;
      const day = Number(dayStr);
      const dateObj = new Date(year, monthIndex, day);
      if (!Number.isNaN(dateObj.getTime())) {
        const weekday = ARABIC_WEEKDAYS[dateObj.getDay()] || defaults.calendarWeekday;
        const monthName = LEVANT_MONTHS[monthIndex] || '';
        arabicDate = `يوم ${weekday}، ${day} ${monthName} ${year}`;
        calendarMonthYear = `${monthName} ${year}`;
        calendarDay = String(day);
        calendarWeekday = weekday;
      }
    } else {
      arabicDate = customDate;
    }
  }

  // Compute readable Arabic time
  let arabicTime = defaults.arabicTime;
  if (customTime) {
    if (/^\d{2}:\d{2}$/.test(customTime)) {
      const [hStr, mStr] = customTime.split(':');
      const h = Number(hStr);
      const period = h >= 12 ? 'مساءً' : 'صباحاً';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const minutePart = mStr === '00' ? '' : `:${mStr}`;
      arabicTime = `الساعة ${hour12}${minutePart} ${period}`;
    } else {
      arabicTime = customTime;
    }
  }

  return {
    isoTarget,
    arabicDate,
    arabicTime,
    calendarMonthYear,
    calendarDay,
    calendarWeekday,
  };
}

/**
 * Resolves the YouTube watch URL from an optional custom `youtubeVideoId` (or full URL),
 * falling back to the template's default YouTube URL when empty.
 *
 * @param {string | undefined} customYoutubeId - Custom YouTube video ID or URL.
 * @param {string} defaultYoutubeUrl - Default YouTube URL for the template.
 * @returns {string} Valid YouTube watch URL.
 */
export function resolveYoutubeUrl(
  customYoutubeId: string | undefined,
  defaultYoutubeUrl: string
): string {
  const trimmed = customYoutubeId?.trim();
  if (!trimmed) return defaultYoutubeUrl;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://www.youtube.com/watch?v=${trimmed}`;
}

/**
 * Resolves the list of event notes from `customData.customNote` (splitting on newlines),
 * or falls back to the master template's default notes array.
 *
 * @param {string | undefined} customNote - Optional newline-separated custom notes.
 * @param {string[]} defaultNotes - Default notes list for the template.
 * @returns {string[]} Array of note strings to render.
 */
export function resolveCustomNotes(
  customNote: string | undefined,
  defaultNotes: string[]
): string[] {
  const trimmed = customNote?.trim();
  if (!trimmed) return defaultNotes;

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : defaultNotes;
}

/**
 * Builds an embeddable Google Maps iframe URL for a given venue name or location URL.
 *
 * @param {string | undefined} customVenueName - Custom venue name.
 * @param {string} defaultEmbedUrl - Default Google Maps embed URL.
 * @returns {string} Safe Google Maps embed URL.
 */
export function resolveMapEmbedUrl(
  customVenueName: string | undefined,
  defaultEmbedUrl: string
): string {
  const trimmed = customVenueName?.trim();
  if (!trimmed) return defaultEmbedUrl;
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Encodes a `CustomInvitationData` payload into a compact URL-safe Base64 string (`?d=...`)
 * so custom invitations work across stateless serverless instances even without an external DB.
 */
export function encodeInvitationShareParam(inv: CustomInvitationData): string {
  try {
    const minimal: CustomInvitationData = {
      slug: inv.slug,
      templateId: inv.templateId,
      hostNames: inv.hostNames || inv.coupleNames || '',
      coupleNames: inv.coupleNames || inv.hostNames || '',
      welcomeMessage: inv.welcomeMessage || inv.invitationText || '',
      eventDate: inv.eventDate || '',
      eventTime: inv.eventTime || '',
      venueName: inv.venueName || '',
      locationUrl: inv.locationUrl || '',
      youtubeVideoId: inv.youtubeVideoId || '',
      customNote: inv.customNote || '',
    };
    const json = JSON.stringify(minimal);
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      return window
        .btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
    return Buffer.from(json, 'utf-8').toString('base64url');
  } catch {
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 `?d=...` parameter back into `CustomInvitationData`.
 */
export function decodeInvitationShareParam(
  encoded: string | undefined,
  fallbackSlug: string
): CustomInvitationData | null {
  if (!encoded || typeof encoded !== 'string') return null;
  try {
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    let json = '';
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const binary = window.atob(normalized);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      json = new TextDecoder().decode(bytes);
    } else {
      json = Buffer.from(normalized, 'base64').toString('utf-8');
    }
    const parsed = JSON.parse(json) as Partial<CustomInvitationData>;
    if (!parsed || !parsed.templateId || !VALID_TEMPLATE_IDS.includes(parsed.templateId)) {
      return null;
    }
    return {
      slug: parsed.slug || fallbackSlug,
      templateId: parsed.templateId,
      hostNames: parsed.hostNames || parsed.coupleNames || '',
      coupleNames: parsed.coupleNames || parsed.hostNames || '',
      welcomeMessage: parsed.welcomeMessage || parsed.invitationText || '',
      invitationText: parsed.invitationText || parsed.welcomeMessage || '',
      eventDate: parsed.eventDate || '',
      eventTime: parsed.eventTime || '',
      venueName: parsed.venueName || '',
      locationUrl: parsed.locationUrl || '',
      youtubeVideoId: parsed.youtubeVideoId || '',
      customNote: parsed.customNote || '',
    };
  } catch {
    return null;
  }
}

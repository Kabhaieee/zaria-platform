/**
 * @file src/data/clientInvitations.ts
 * @description ملف الدعوات الدائمة الخاصة بالعملاء (المصدر الأساسي والدائم للبيانات).
 *
 * - كل دعوة هنا مستقلة تماماً عن القوالب الأصلية المعروضة في الموقع الرئيسي (`/`) وفي `/preview/[templateId]`.
 * - تعديل أي قيمة هنا يؤثر فقط على رابط الدعوة `/invite/<slug>` ولا يمس القالب الأصلي أبداً.
 * - أي حقل تتركه فارغاً ('') يعود تلقائياً إلى القيمة الافتراضية للقالب.
 * - بعد التعديل: احفظ الملف ثم نفّذ commit و push وسيتحدّث الرابط على Vercel تلقائياً.
 */

import type { CustomInvitationData } from '@/types/zaria';

export const CLIENT_INVITATIONS: readonly CustomInvitationData[] = [
  {
    // معرف الرابط الدائم: يعمل على /invite/omar-ayat
    slug: 'omar-ayat',

    // القالب المستخدم كأساس للتصميم (القالب الكلاسيكي). القيم المتاحة:
    // wedding-classic | wedding-royal | engagement-floral | graduation-modern |
    // graduation-notebook | birthday-fun | newborn-cute
    templateId: 'wedding-classic',

    // أسماء العروسين (افصل بين الاسمين بعلامة &)
    hostNames: 'عمر & آيات',
    coupleNames: 'عمر & آيات',

    // نص الدعوة الترحيبي (اتركه '' لاستخدام نص القالب الافتراضي)
    welcomeMessage:
      'بقلوبٍ مفعمةٍ بالمحبة والمودة، يسرّنا دعوتكم لمشاركتنا فرحة العمر في حفل زفافنا. بحضوركم تكتمل سعادتنا.',

    // تاريخ الحفل بصيغة YYYY-MM-DD (يُستخدم أيضاً للعد التنازلي وبطاقة "احفظ الموعد")
    eventDate: '2026-12-15',

    // وقت الحفل بصيغة 24 ساعة HH:mm (مثال: 20:30 = الثامنة والنصف مساءً)
    eventTime: '20:30',

    // اسم القاعة أو الفندق
    venueName: 'فندق سانت ريجيس عمان',

    // رابط الموقع على خرائط جوجل
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=The+St.+Regis+Amman',

    // معرف فيديو يوتيوب لأغنية الخلفية (الجزء بعد v= في الرابط). '' = أغنية القالب الافتراضية
    youtubeVideoId: '',

    // ملاحظات الضيوف (كل سطر = ملاحظة مستقلة). '' = ملاحظات القالب الافتراضية
    customNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة تشمل حاملها والعائلة الكريمة',

    // (اختياري) فيديو أو صورة خلفية مخصصة من مجلد /public، مثال: '/omar-ayat/hero.mp4' أو '/omar-ayat/hero.jpg'
    // '' = فيديو القالب الافتراضي
    backgroundMedia: '',

    // (اختياري) صورة تظهر قبل تحميل فيديو الخلفية، مثال: '/omar-ayat/poster.jpg'
    backgroundPoster: '',

    // تهاني تجريبية دائمة تظهر في قسم "كلمات المهنئين" (أضف أو احذف أو عدّل كما تشاء)
    initialWishes: [
      { name: 'عائلة العمري', message: 'ألف مبروك لعمر وآيات، فرحتنا فيكم كبيرة والله يتمم على خير 🌹' },
      { name: 'أم خالد', message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير 🤍' },
      { name: 'سامر', message: 'مبارك الزفاف الجميل، أتمنى لكما حياة مليئة بالسعادة والحب ✨' },
    ],

    createdAt: '2026-10-21T15:30:00.000Z',
    updatedAt: '2026-10-25T00:00:00.000Z',
  },
];

/**
 * Looks up a permanent client invitation by slug (case-insensitive).
 */
export function getStaticInvitationBySlug(slug: string): CustomInvitationData | undefined {
  const clean = String(slug || '').trim().toLowerCase();
  return CLIENT_INVITATIONS.find((inv) => inv.slug === clean);
}

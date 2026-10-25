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

    // القالب المستخدم كأساس للتصميم (القالب الكلاسيكي)
    templateId: 'wedding-classic',

    // أسماء العروسين مع الألقاب (المهندس عمر & الدكتورة آيات)
    hostNames: 'المهندس عمر & الدكتورة آيات',
    coupleNames: 'المهندس عمر & الدكتورة آيات',

    // ثيم الألوان المخصص لدعوة عمر وآيات: Royal Burgundy & Warm Champagne
    theme: 'burgundy',

    // نص الدعوة الترحيبي
    welcomeMessage:
      'بقلوبٍ مفعمةٍ بالمحبة والمودة، يسرّنا دعوتكم لمشاركتنا فرحة العمر في حفل زفافنا. بحضوركم تكتمل سعادتنا وتزدان ليلتنا بهجةً وسروراً.',

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

    // ملاحظات الضيوف (كل سطر = ملاحظة مستقلة)
    customNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة خاصة وتُبرز عند الاستقبال\nجنة الأطفال منازلهم',

    // فيديو الخلفية الرئيسي في قسم البداية (من public/omar-ayat)
    backgroundMedia: '/omar-ayat/gemini_generated_video_6b8cbeb1.mp4',

    // بوستر فيديو الخلفية يمنع الوميض قبل بدء التشغيل
    backgroundPoster: '/omar-ayat/gemini_generated_video_6b8cbeb1_thumb.jpg',

    // فيديو شاشة الافتتاح / الستار الترحيبي عند فتح الدعوة (من public/omar-ayat)
    introMedia: '/omar-ayat/video.mp4',

    // بوستر شاشة الافتتاح
    introPoster: '/omar-ayat/video_thumb.jpg',

    // تهاني تجريبية دائمة تظهر في قسم "كلمات المهنئين"
    initialWishes: [
      {
        name: 'عائلة العمري',
        message: 'ألف مبروك للمهندس عمر والدكتورة آيات، فرحتنا فيكم كبيرة والله يتمم لكم على ألف خير 🌹',
      },
      {
        name: 'عائلة الخطيب',
        message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير وسعادة ومحبة دائمين 🤍',
      },
      {
        name: 'د. سامر الخطيب',
        message: 'أجمل التهاني والتبريكات بمناسبة الزفاف المبارك، متمنين لكما حياة زاخرة بالتوفيق والبركة ✨',
      },
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

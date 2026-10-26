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

    // إخفاء قسم تأكيد الحضور (RSVP) وقسم كلمات المهنئين وقسم الاستفسار والتأكيد
    hideRsvp: true,
    hideWishes: true,
    hideContact: true,

    // الآية الكريمة في أعلى بطاقة الدعوة
    quranVerse:
      '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ ﴾',

    // نص الدعوة الترحيبي بأسماء الداعين (والدي العروسين)
    welcomeMessage:
      'يتشرف الدكتور سهيل السخن والمهندس علي قبها بدعوتكم لحضور حفل زفاف ولديهما المهندس عمر والدكتورة آيات، ومشاركتنا فرحة العمر في حفل زفافهما المبارك. بحضوركم تكتمل سعادتنا وتزدان ليلتنا بهجةً وسروراً.',

    // أسماء والدي العروسين (الداعين)
    groomFather: 'الدكتور سهيل السخن',
    brideFather: 'المهندس علي قبها',

    // تاريخ الحفل بصيغة YYYY-MM-DD (يُستخدم أيضاً للعد التنازلي وبطاقة "احفظ الموعد")
    eventDate: '2026-11-16',

    // وقت الحفل بصيغة 24 ساعة HH:mm (مثال: 20:00 = الثامنة مساءً)
    eventTime: '20:00',

    // اسم القاعة أو الفندق
    venueName: 'قاعات النعمان - عمّان',

    // رابط الموقع على خرائط جوجل
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=قاعات+النعمان+عمان',

    // معرف فيديو يوتيوب لأغنية الخلفية: إليسا - ع بالي حبيبي (Elissa - Aa Bali Habibi)
    youtubeVideoId: 'ZT6YMK3t96Q',

    // نقطة بداية تشغيل الأغنية بالثواني (65 ثانية = 1:05 عند بداية المقطع الرئيسي)
    youtubeStartSeconds: 65,

    // أسماء العائلات الداعية في أسفل الدعوة (مصححة إملائياً)
    familyNames: 'عائلة السخن & عائلة قبها',

    // ملاحظات الضيوف (كل سطر = ملاحظة مستقلة)
    customNote:
      'يُرجى الحضور قبل الموعد بنصف ساعة\nنتشرّف بحضوركم بأبهى حلّة\nالدعوة خاصة وتُبرز عند الاستقبال\nجنة الأطفال منازلهم',

    // صور ألبوم الذكريات ("بداية الحكاية") الخاصة بالعروسين (من public/omar-ayat)
    galleryImages: [
      '/omar-ayat/photo-1.jpeg', // عقد القران (كتب الكتاب)
      '/omar-ayat/photo-2.jpeg', // العروسان
      '/omar-ayat/photo-3.jpeg', // نظرة المحبة
      '/omar-ayat/photo-4.jpeg', // أجمل اللحظات
    ],

    // فيديو الخلفية الرئيسي في قسم البداية (من public/omar-ayat)
    backgroundMedia: '/omar-ayat/video.mp4',

    // بوستر فيديو الخلفية يمنع الوميض قبل بدء التشغيل
    backgroundPoster: '/omar-ayat/video_thumb.jpg',

    // فيديو شاشة الافتتاح / الباب الترحيبي الملكي عند فتح الدعوة (من public/omar-ayat)
    introMedia: '/omar-ayat/gemini_generated_video_6b8cbeb1.mp4',

    // بوستر شاشة الباب عند الافتتاح
    introPoster: '/omar-ayat/gemini_generated_video_6b8cbeb1_thumb.jpg',

    // تهاني تجريبية دائمة تظهر في قسم "كلمات المهنئين"
    initialWishes: [
      {
        name: 'عائلة السخن',
        message: 'ألف مبروك للمهندس عمر والدكتورة آيات، فرحتنا فيكم كبيرة والله يتمم لكم على ألف خير 🌹',
      },
      {
        name: 'عائلة قبها',
        message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير وسعادة ومحبة دائمين 🤍',
      },
      {
        name: 'د. سامر',
        message: 'أجمل التهاني والتبريكات بمناسبة الزفاف المبارك، متمنين لكما حياة زاخرة بالتوفيق والبركة ✨',
      },
    ],

    createdAt: '2026-10-21T15:30:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z',
  },
];

/**
 * Looks up a permanent client invitation by slug (case-insensitive).
 */
export function getStaticInvitationBySlug(slug: string): CustomInvitationData | undefined {
  const clean = String(slug || '').trim().toLowerCase();
  return CLIENT_INVITATIONS.find((inv) => inv.slug === clean);
}

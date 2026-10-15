const fs = require('fs');
const path = 'src/components/templates/designs/GraduationModern.jsx';
let content = fs.readFileSync(path, 'utf-8');

// 1. Timeline Events
const oldTimeline = `[
                  { time: '9:00 – 9:20', event: 'استقبال الضيف', desc: 'استقبال ترحيب بالضيف مع مسيقى هادئة ضيافة خفيفة.' },
                  { time: '9:20 – 9:35', event: 'دخل العرسين 🤍', desc: 'دخل العرسين سط أجاء احتفالية مسيقى خاصة.' },
                  { time: '9:35 – 9:50', event: 'الرقصة الألى', desc: 'لحظة رمانسية خاصة للعرسين.' },
                  { time: '9:50 – 10:10', event: 'فرحة الأهل', desc: 'رقص احتفال مع الأهل المقرّبين.' },
                  { time: '10:10 – 10:40', event: 'أجاء الحفل 💃🏻🕺🏻', desc: 'مسيقى رقص احتفال مع جميع الحضر.' },
                  { time: '10:40 – 10:50', event: 'ضيافة مشربات ☕️', desc: 'تقديم الضيافة المشربات للضيف.' },
                  { time: '10:50 – 11:00', event: 'الختام 🤍', desc: 'آخر لحظات الاحتفال، صر جماعية، تديع الضيف.' },
                ]`;

const newTimeline = `[
                  { time: '9:00 – 9:20', event: 'استقبال الضيوف', desc: 'ترحيب بالضيوف مع موسيقى هادئة وضيافة خفيفة.' },
                  { time: '9:20 – 9:35', event: 'دخول الخريج 🎓', desc: 'دخول الخريج وسط أجواء احتفالية.' },
                  { time: '9:35 – 9:50', event: 'كلمة الخريج', desc: 'كلمة شكر وتقدير من الخريج.' },
                  { time: '9:50 – 10:10', event: 'فرحة الأهل', desc: 'احتفال مع الأهل والمقرّبين وتقطيع الكيك.' },
                  { time: '10:10 – 10:40', event: 'أجواء الحفل 🎵', desc: 'موسيقى واحتفال مع جميع الحضور.' },
                  { time: '10:40 – 10:50', event: 'ضيافة ومشروبات ☕️', desc: 'تقديم الضيافة والمشروبات.' },
                  { time: '10:50 – 11:00', event: 'الختام 🤍', desc: 'صور تذكارية وتوديع الضيوف.' },
                ]`;

content = content.replace(oldTimeline, newTimeline);

// 2. Misspelled words due to stripped 'و'
content = content.replace("المقع", "الموقع");
content = content.replace("يم الأحد", "يوم الأحد");
content = content.replace("فندق فر سيزنز عمان", "فندق فور سيزونز عمان");
content = content.replace("فندق فر سيزنز", "فندق فور سيزونز");
content = content.replace("يُرجى الحضر قبل المعد", "يُرجى الحضور قبل الموعد");
content = content.replace("نتشرّف بحضركم بأبهى حلّة", "نتشرّف بحضوركم بأبهى حلّة");
content = content.replace("حضركم يزيّن فرحتنا", "حضوركم يزيّن فرحتنا");

fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed Texts Part 2');

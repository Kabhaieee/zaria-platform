const fs = require('fs');
const path = 'src/components/templates/designs/GraduationModern.jsx';
let content = fs.readFileSync(path, 'utf-8');

// 1. Guestbook messages
content = content.replace(
  "مبارك الزاج، الله يجعل أيامكم كلها أفراح",
  "مبارك التخرج، الله يجعل أيامك كلها نجاح وتفوق"
);
content = content.replace(
  "بيت جديد عامر بالمحبة إن شاء الله، ألف مبرك",
  "منها للأعلى إن شاء الله، ألف مبروك"
);
content = content.replace(
  "الله يبارك لكما يبارك عليكما يجمع بينكما في خير",
  "ما شاء الله تبارك الرحمن، فخورين جداً بنجاحك"
);

// 2. Hero Section
const heroOld = `<h1 
            className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-4"
            
            
            
          >
            أحمد
          </h1>

          <div 
            className="text-2xl md:text-3xl font-light text-[#1E3A8A] mb-4 drop-shadow-md"
            
            
            
          >
            &
          </div>

          <h1 
            className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-12"
            
            
            
          >
            خالد
          </h1>

          <p 
            className="text-lg md:text-xl font-['Aref_Ruqaa'] opacity-90 mb-8 max-w-sm mx-auto drop-shadow-md text-[#fdf8f5]"
            
            
            
          >
            يتشرّفان بدعتكم لمشاركتهما فرحة الأحمد
          </p>`;

const heroNew = `<h1 
            className="text-5xl md:text-7xl font-['Aref_Ruqaa'] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] mb-12 mt-12"
          >
            الخريج أحمد
          </h1>

          <p 
            className="text-lg md:text-xl font-['Aref_Ruqaa'] opacity-90 mb-8 max-w-sm mx-auto drop-shadow-md text-[#fdf8f5]"
          >
            يتشرف بدعوتكم لمشاركته فرحة التخرج
          </p>`;

content = content.replace(heroOld, heroNew);

// 3. Duaa
content = content.replace(
  "اللّهُمَّ بارِكْ لهُما بارِكْ عليهِما اجمَعْ بينهُما في خَيْرٍ",
  "﴿ يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ﴾"
);

// 4. Invitation Text
content = content.replace(
  "بقلبٍ مفعمةٍ بالفرح السرر، نتشرّف بدعتكم لمشاركتنا أجمل لحظات حياتنا في حفل زفافنا. حضركم شرفٌ لنا بهجةٌ تكتمل بها فرحتنا.",
  "بقلوبٍ مفعمةٍ بالفرح والسرور، وعطري الإنجاز والنجاح، أتشرف بدعوتكم لمشاركتي فرحة التخرج. حضوركم شرفٌ لي وتكتمل به فرحتي."
);

// 5. Parents & Couple -> Just Graduate and Family
const parentsOld = `<div className="flex justify-between items-start text-[14px] font-bold w-full px-2 mb-12 mt-4">
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-[#475569] text-[11px] mb-3">الد العريس</p>
                <p className="leading-relaxed text-[#0F172A] mb-5">الدكتر سهيل أب أحمد<br/>عائلته الكريمة</p>
                <p className={\`text-[22px] text-[#1E3A8A] font-bold leading-tight \${aref.className}\`}>الخريج<br/>أحمد خالد</p>
              </div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A] mt-7 mx-2 opacity-60"></div>
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-[#475569] text-[11px] mb-3">الد العرس</p>
                <p className="leading-relaxed text-[#0F172A] mb-5">المهندس علي أب نضال<br/>عائلته الكريمة</p>
                <p className={\`text-[22px] text-[#1E3A8A] font-bold leading-tight \${aref.className}\`}></p>
              </div>
            </div>`;

const parentsNew = `<div className="flex flex-col items-center text-[14px] font-bold w-full px-2 mb-12 mt-4 text-center">
              <p className="text-[#475569] text-[12px] mb-3">الداعون</p>
              <p className="leading-relaxed text-[#0F172A] mb-8 text-[15px]">عائلة الخريج الكريمة<br/>وجميع الأهل والأصدقاء</p>
              
              <div className="w-1.5 h-1.5 rotate-45 bg-[#1E3A8A] mb-8 opacity-60"></div>
              
              <p className="text-[#475569] text-[12px] mb-3">الخريج</p>
              <p className={\`text-[26px] text-[#1E3A8A] font-bold leading-tight \${aref.className}\`}>أحمد خالد</p>
            </div>`;

content = content.replace(parentsOld, parentsNew);

// Write back
fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed Texts Part 1');

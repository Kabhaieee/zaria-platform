const fs = require('fs');
const path = 'src/components/templates/designs/GraduationModern.jsx';
let content = fs.readFileSync(path, 'utf-8');

// Replace Hero Background
const oldHero = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80";
const newHero = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80";
content = content.replace(oldHero, newHero);

// Replace Gallery images
const galleryUrls = [
  "https://images.unsplash.com/photo-1555009395-f12016335ebc?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1592285440263-c750c19623d3?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519452331525-419bcf8747f2?auto=format&fit=crop&q=80"
];

const galleryCodeOld = `{[1, 2, 3, 4].map((i, idx) => (
              <div 
                key={i}
                
                
                
                
                className={\`relative rounded-xl overflow-hidden shadow-sm border border-[#1E3A8A]/20 \${idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'}\`}
              >
                <Image 
                  src={\`/gallery-\${i}.jpg\`} 
                  alt={\`Memory \${i}\`} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            ))}`;

const galleryCodeNew = `{[
              "${galleryUrls[0]}",
              "${galleryUrls[1]}",
              "${galleryUrls[2]}",
              "${galleryUrls[3]}"
            ].map((src, idx) => (
              <div 
                key={idx}
                className={\`relative rounded-xl overflow-hidden shadow-sm border border-[#1E3A8A]/20 \${idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square'}\`}
              >
                <img 
                  src={src} 
                  alt={\`Graduation Memory \${idx+1}\`} 
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            ))}`;

content = content.replace(galleryCodeOld, galleryCodeNew);

fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed Gallery Images!');

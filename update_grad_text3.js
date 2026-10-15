const fs = require('fs');
const path = 'src/components/templates/designs/GraduationModern.jsx';
let content = fs.readFileSync(path, 'utf-8');

content = content.replace("ألف مبرك 🤍 بالرفاه البنين إن شاء الله، فرحتكم فرحتنا", "ألف مبروك 🤍 التخرج ومنها للمراتب العليا، فرحتكم فرحتنا");

fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed Texts Part 3');

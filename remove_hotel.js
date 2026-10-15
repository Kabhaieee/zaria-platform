const fs = require('fs');
const path = 'src/components/templates/designs/GraduationModern.jsx';
let content = fs.readFileSync(path, 'utf-8');

// Remove hotel image link
const regex = /<a href="https:\/\/www\.google\.com\/maps\/search[^>]+>\s*<img src="\/images\/hotel-cover\.png"[^>]+>\s*<div[^>]+><\/div>\s*<div[^>]+>\s*<MapPin[^>]+>\s*<\/div>\s*<\/a>/s;
content = content.replace(regex, '');

// Fix spelling
content = content.replace("فندق فر سيزنز", "فندق فور سيزونز");

fs.writeFileSync(path, content, 'utf-8');
console.log('Removed hotel image!');

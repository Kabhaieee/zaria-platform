const fs = require('fs');

const path = 'src/components/templates/designs/WeddingClassic.jsx';
let content = fs.readFileSync(path, 'utf-8');

// Use regex to remove the malformed FlowerBullet and replace it
const regex = /const FlowerBullet = \(\{.*?\}\) => \([\s\S]*?\);\s*<\/svg>\s*\);\s*/;

const newComponent = `const FlowerBullet = ({ className = "w-3.5 h-3.5", color = ZARIA_GOLD }) => (
  <svg viewBox="0 0 24 24" fill={color} stroke="none" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

`;

content = content.replace(regex, newComponent);

fs.writeFileSync(path, content, 'utf-8');
console.log("Fixed!");

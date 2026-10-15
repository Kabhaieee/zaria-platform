const fs = require('fs');

const path = 'src/components/templates/designs/WeddingClassic.jsx';
let content = fs.readFileSync(path, 'utf-8');

// The current bullet in WeddingClassic is the heart SVG
const regex = /const FlowerBullet = \(\{.*?\}\) => \([\s\S]*?\);\s*<\/svg>\s*\);\s*/;

const newComponent = `const FlowerBullet = ({ className = "w-3 h-3", color = ZARIA_GOLD }) => (
  <svg viewBox="0 0 24 24" fill={color} stroke="none" className={className}>
    <path d="M12 2L22 12L12 22L2 12Z" />
  </svg>
);

`;

content = content.replace(regex, newComponent);

fs.writeFileSync(path, content, 'utf-8');
console.log("Fixed!");

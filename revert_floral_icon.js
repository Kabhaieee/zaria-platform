const fs = require('fs');

const path = 'src/app/templates/TemplatesClient.jsx';
let content = fs.readFileSync(path, 'utf-8');

// The lines look like this:
//    {
//      id: 'engagement-floral',
//      ...
//      icon: '🤍'
//    }

// We can replace the specific block for engagement-floral
content = content.replace(/(id:\s*'engagement-floral'[\s\S]*?)icon:\s*'🤍'/, "$1icon: '❀'");

fs.writeFileSync(path, content, 'utf-8');
console.log("Fixed!");

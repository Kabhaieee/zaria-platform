const fs = require('fs');

const transcriptPath = 'c:\\Users\\aliKa\\.gemini\\antigravity\\brain\\77fc0886-db7d-46e8-bdc5-1134b167e2d4\\.system_generated\\logs\\transcript_full.jsonl';

try {
  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (!line) continue;
    try {
      const data = JSON.parse(line);
      if (data.tool_calls) {
        for (const call of data.tool_calls) {
          if (call.function.name === 'default_api:write_to_file' || call.function.name === 'default_api:replace_file_content') {
            const args = JSON.parse(call.function.arguments);
            if (args.TargetFile && args.TargetFile.endsWith('Features.jsx') && args.CodeContent) {
              fs.writeFileSync('c:\\Users\\aliKa\\Desktop\\zaria-platform\\src\\components\\Features.jsx', args.CodeContent);
              console.log('Restored Features.jsx from transcript.');
              process.exit(0);
            }
          }
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  console.log('Could not find original Features.jsx in transcript.');
} catch (e) {
  console.error(e);
}

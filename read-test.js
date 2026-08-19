const fs = require('fs');
const content = fs.readFileSync('test-output.txt', 'utf8');
const out = content.length + ' bytes:\n' + content;
fs.writeFileSync('test-output-readable.txt', out);

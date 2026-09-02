const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(__dirname, '..', 'frontend');

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const files = walkHtml(FRONTEND);
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('vv-final-offer-section')) {
    content = content.replace(/<section class="vv-final-offer-section[\s\S]*?<\/section>/gi, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Removed final offer section from ${path.relative(FRONTEND, file)}`);
    count++;
  }
}

console.log(`Finished removing final offer section from ${count} HTML files.`);

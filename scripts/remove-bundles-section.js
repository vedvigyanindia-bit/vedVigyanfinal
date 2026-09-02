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
  if (content.includes('vv-bundles-section') || content.includes('Save More Today') || content.includes('Offers &amp; Special Bundles')) {
    content = content.replace(/<!--\s*SECTION\s*\d*:\s*Offers[\s\S]*?-->/gi, '');
    content = content.replace(/<section class="vv-bundles-section[\s\S]*?<\/section>/gi, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Removed Offers & Special Bundles section from ${path.relative(FRONTEND, file)}`);
    count++;
  }
}

console.log(`Finished removing Offers & Special Bundles section from ${count} HTML files.`);

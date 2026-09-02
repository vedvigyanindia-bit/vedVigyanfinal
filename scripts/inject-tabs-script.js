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
  if (content.includes('product.js') && !content.includes('pdp-tabs-data.js')) {
    content = content.replace(/(<script\s+[^>]*src=["'][^"']*product\.js["'][^>]*>\s*<\/script>)/gi, '<script src="/public/js/pdp-tabs-data.js" defer></script>\n  $1');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected pdp-tabs-data.js script tag into ${path.relative(FRONTEND, file)}`);
    count++;
  }
}

console.log(`Finished injecting pdp-tabs-data.js into ${count} HTML files.`);

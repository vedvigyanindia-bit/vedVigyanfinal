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
  if (content.includes('product.js') && !content.includes('pdp-reviews-data.js')) {
    content = content.replace(/<script src="([^"]*\/)product\.js"><\/script>/gi, '<script src="$1pdp-reviews-data.js"></script>\n  <script src="$1product.js"></script>');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected pdp-reviews-data.js script tag into ${path.relative(FRONTEND, file)}`);
    count++;
  }
}

console.log(`Finished injecting pdp-reviews-data.js into ${count} HTML files.`);

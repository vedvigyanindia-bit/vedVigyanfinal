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

const htmlFiles = walkHtml(FRONTEND);
let count = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Regex to remove <details class="lux-pdp-faq" open> ... Product Details & Benefits ... </details>
  const detailsRegex = /<details\s+class="lux-pdp-faq"[^>]*>\s*<summary>Product Details &amp; Benefits<\/summary>[\s\S]*?<\/details>\s*/gi;

  if (detailsRegex.test(content)) {
    content = content.replace(detailsRegex, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Removed "Product Details & Benefits" accordion from ${path.relative(FRONTEND, file)}`);
    count++;
  }
});

console.log(`Successfully removed "Product Details & Benefits" section from ${count} HTML files.`);

const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const frontendDir = path.join(__dirname, '..', 'frontend');
const htmlFiles = walkDir(frontendDir);

let count = 0;
htmlFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Match details.lux-pdp-faq or container
  const fullBlockRegex = /<!--\s*SECTION 9:\s*Accordion FAQ\s*-->[\s\S]*?(?=<!--\s*SECTION 10:|\s*<!--\s*RELATED PRODUCTS)/gi;
  const standaloneDetailsRegex = /<details\s+class="lux-pdp-faq">[\s\S]*?<\/details>/gi;
  const leftoverContainerRegex = /<div\s+class="lux-pdp-tabs\s+lux-reveal">[\s\S]*?<\/div>/gi;

  let modified = false;

  if (fullBlockRegex.test(content)) {
    content = content.replace(fullBlockRegex, '');
    modified = true;
  }

  if (standaloneDetailsRegex.test(content)) {
    content = content.replace(standaloneDetailsRegex, '');
    modified = true;
  }

  if (leftoverContainerRegex.test(content)) {
    content = content.replace(leftoverContainerRegex, '');
    modified = true;
  }

  // Clean dangling </details> or empty containers
  content = content.replace(/<\/details>\s*<\/div>/gi, '');

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});

console.log(`Cleaned legacy accordion sections in ${count} HTML files`);

// Re-generate static product pages
require('./generate-static-product-pages.js');

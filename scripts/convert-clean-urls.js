const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(__dirname, '..', 'frontend');

// Load data.js products
global.window = {};
require('../frontend/public/js/data.js');
const products = global.window.VED_VIGYAN_DATA?.products || [];

const idToSlug = {};
products.forEach(p => {
  idToSlug[p.id] = p.slug || p.id;
});

function walkFiles(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, fileList);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const allFiles = walkFiles(FRONTEND);
let convertedCount = 0;

allFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace /product/detail.html?id=vv_pXX and /product/detail?id=vv_pXX
  content = content.replace(/\/product\/detail(?:\.html)?\?id=(vv_p\d+)/g, (match, pId) => {
    const slug = idToSlug[pId] || pId;
    modified = true;
    return `/products/${slug}`;
  });

  // Replace /shop.html?cat=XXX with /collections/XXX
  content = content.replace(/\/shop\.html\?cat=([a-zA-Z0-9_-]+)/g, (match, catId) => {
    modified = true;
    return `/collections/${catId}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Converted links in ${path.relative(FRONTEND, filePath)}`);
    convertedCount++;
  }
});

console.log(`Successfully converted legacy links to clean Shopify-style URLs in ${convertedCount} files.`);

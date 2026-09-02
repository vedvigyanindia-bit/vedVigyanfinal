const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const productsDir = path.join(frontendDir, 'products');
const collectionsDir = path.join(frontendDir, 'collections');

if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}
if (!fs.existsSync(collectionsDir)) {
  fs.mkdirSync(collectionsDir, { recursive: true });
}

// 1. Read product detail template and shop template
const detailTemplatePath = path.join(frontendDir, 'product', 'detail.html');
const detailTemplate = fs.readFileSync(detailTemplatePath, 'utf8');

const shopTemplatePath = path.join(frontendDir, 'shop.html');
const shopTemplate = fs.readFileSync(shopTemplatePath, 'utf8');

// Always write index.html fallbacks
fs.writeFileSync(path.join(productsDir, 'index.html'), detailTemplate, 'utf8');
fs.writeFileSync(path.join(collectionsDir, 'index.html'), shopTemplate, 'utf8');

// 2. Read products from data.js
global.window = {};
require('../frontend/public/js/data.js');

const products = global.window.VED_VIGYAN_DATA?.products || [];
console.log(`Found ${products.length} products in VED_VIGYAN_DATA`);

const slugsToCreate = new Set();

products.forEach((p) => {
  if (p.id) slugsToCreate.add(p.id);
  if (p.slug) slugsToCreate.add(p.slug);
  if (p.name) {
    const nameSlug = String(p.name)
      .toLowerCase()
      .trim()
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (nameSlug) slugsToCreate.add(nameSlug);
  }
});

// Also add any hardcoded product slugs used across HTML mega menus
const hardcodedSlugs = [
  "ganesh-rudraksh",
  "gold-rudraksh-bracelet",
  "gauri-sankar-rudraksh",
  "7-chakra-tree",
  "7-mukhi-rudraksh",
  "9-mukhi-rudraksh",
  "karungali-rudraksh-silver-cap-mala",
  "spatik-mala",
  "5-mukhi-nepali-rudraksha",
  "nepali-rudrakasha-mala-close-for-wearing",
  "5-mukhi-nepali-rudraksha-mala-108-beads",
  "10-mukhi-rudraksha-dasha-mukhi"
];

hardcodedSlugs.forEach((s) => slugsToCreate.add(s));

// Generate physical HTML files for every product slug
slugsToCreate.forEach((slug) => {
  const filePath = path.join(productsDir, `${slug}.html`);
  fs.writeFileSync(filePath, detailTemplate, 'utf8');
});

console.log(`Successfully generated ${slugsToCreate.size} static product HTML files in frontend/products/`);

// 3. Generate static collection HTML files
const collectionSlugs = [
  "zodiac-bracelet",
  "rudraksha",
  "crystal-bracelet",
  "mala",
  "gemstone-tree",
  "all"
];

collectionSlugs.forEach((cSlug) => {
  const filePath = path.join(collectionsDir, `${cSlug}.html`);
  fs.writeFileSync(filePath, shopTemplate, 'utf8');
});

console.log(`Successfully generated ${collectionSlugs.length} static collection HTML files in frontend/collections/`);

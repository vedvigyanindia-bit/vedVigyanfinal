const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'data.js');
let dataContent = fs.readFileSync(dataFilePath, 'utf8');

// Function to convert product name to clean URL slug
function nameToSlug(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Update deriveMerchandising in data.js to use product-name slug
const updatedDerive = `function deriveMerchandising(products) {
  return products.map((product, index) => {
    const customOriginal = product.originalPrice;
    const discountPercent = customOriginal && product.price
      ? Math.round(((customOriginal - product.price) / customOriginal) * 100)
      : (18 + ((index * 7) % 23));
    const ratingValue = 4.2 + (((index * 13) % 8) / 10);
    const rating = Math.min(5.0, Number(ratingValue.toFixed(1)));
    const originalPrice = customOriginal || (product.price > 0
      ? Math.round(product.price / (1 - discountPercent / 100))
      : 0);

    const nameSlug = product.name
      ? String(product.name).toLowerCase().trim().replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : (product.slug || product.id);

    const cleanUrl = \`/products/\${nameSlug}\`;

    return {
      ...product,
      slug: nameSlug,
      url: cleanUrl,
      discountPercent,
      originalPrice,
      rating
    };
  });
}`;

dataContent = dataContent.replace(/function deriveMerchandising[\s\S]*?\n\}/, updatedDerive);

// Also update static slug fields in raw product definitions inside data.js
global.window = {};
require('../frontend/public/js/data.js');
const rawProducts = global.window.VED_VIGYAN_DATA?.products || [];

rawProducts.forEach(p => {
  const newSlug = nameToSlug(p.name);
  // Replace "slug": "..." with "slug": "${newSlug}" for product ID p.id
  const idRegex = new RegExp(`("id"\\s*:\\s*"${p.id}"[\\s\\S]*?"slug"\\s*:\\s*)"[^"]+"`, 'g');
  dataContent = dataContent.replace(idRegex, `$1"${newSlug}"`);
});

fs.writeFileSync(dataFilePath, dataContent, 'utf8');
console.log(`Updated data.js with product-name-based slugs for all 43 products!`);

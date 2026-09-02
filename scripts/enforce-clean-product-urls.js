const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'data.js');
let dataContent = fs.readFileSync(dataFilePath, 'utf8');

// Function to convert product name or slug into clean slug
function nameToSlug(name, fallbackSlug) {
  if (fallbackSlug && fallbackSlug.length > 2) return fallbackSlug;
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Update deriveMerchandising in data.js
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

    const productSlug = product.slug || (product.name
      ? String(product.name).toLowerCase().trim().replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : product.id);

    const cleanUrl = \`/products/\${productSlug}\`;

    return {
      ...product,
      slug: productSlug,
      url: cleanUrl,
      discountPercent,
      originalPrice,
      rating
    };
  });
}`;

dataContent = dataContent.replace(/function deriveMerchandising[\s\S]*?\n\}/, updatedDerive);

// Load data.js into runtime
global.window = {};
require('../frontend/public/js/data.js');
const rawProducts = global.window.VED_VIGYAN_DATA?.products || [];

rawProducts.forEach((p) => {
  const cleanSlug = p.slug || nameToSlug(p.name, p.slug);
  const cleanUrl = `/products/${cleanSlug}`;

  // Replace "url": "/product/detail.html?id=..." with "url": "/products/${cleanSlug}" for product ID p.id
  const idRegex = new RegExp(`("id"\\s*:\\s*"${p.id}"[\\s\\S]*?)"url"\\s*:\\s*"[^"]+"`, 'g');
  dataContent = dataContent.replace(idRegex, `$1"url": "${cleanUrl}"`);
});

fs.writeFileSync(dataFilePath, dataContent, 'utf8');
console.log(`Successfully updated data.js with clean /products/<slug> URLs for all ${rawProducts.length} products`);

// Now run generate-static-product-pages.js to make sure all physical HTML files exist
require('./generate-static-product-pages.js');

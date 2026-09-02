const fs = require('fs');
const path = require('path');

// Mock window object to load data.js
global.window = {};
require('../frontend/public/js/data.js');

const catalog = global.window.VED_VIGYAN_DATA;
const products = catalog.products;

console.log(`TOTAL PRODUCTS: ${products.length}\n`);

const byCategory = {};
products.forEach(p => {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
});

Object.keys(byCategory).forEach(cat => {
  console.log(`=== CATEGORY: ${cat.toUpperCase()} (${byCategory[cat].length} Items) ===`);
  byCategory[cat].forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.id}] ${p.name} - ₹${p.price} (Original: ₹${p.originalPrice}) | Link: ${p.url}`);
  });
  console.log('\n');
});

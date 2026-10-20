const fs = require('fs');
const path = require('path');

// Load products from data.js
const dataContent = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'public', 'js', 'data.js'), 'utf8');
const vm = require('vm');
const sandbox = { window: {} };
vm.runInNewContext(dataContent, sandbox);
const products = sandbox.window.VED_VIGYAN_DATA.products;

const rudrakshaProductIds = new Set();
products.forEach(p => {
  const isRudraksha = p.category === 'rudraksha' || 
                      (p.tags && p.tags.includes('rudraksha')) || 
                      p.name.toLowerCase().includes('rudraksh');
  const isRudrakshaMala = p.category === 'mala' && p.name.toLowerCase().includes('rudraksh');
  if (isRudraksha || isRudrakshaMala) {
    rudrakshaProductIds.add(p.id);
  }
});

console.log('Rudraksha Product IDs:', Array.from(rudrakshaProductIds));

const productsDir = path.join(__dirname, '..', 'frontend', 'products');
const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.html') && f !== 'index.html');

const targetFiles = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(productsDir, f), 'utf8');
  // Look for addToCartBtn specifically
  const cartBtnMatch = content.match(/id="addToCartBtn"[^>]*data-add-to-cart="([^"]+)"/i) ||
                       content.match(/data-add-to-cart="([^"]+)"[^>]*id="addToCartBtn"/i) ||
                       content.match(/id="buyNowBtn"[^>]*data-buy-now="([^"]+)"/i);
  
  let pid = cartBtnMatch ? cartBtnMatch[1] : null;

  // If not found via button, check if filename is vv_pXX
  if (!pid) {
    const fnMatch = f.match(/^(vv_p\d+)\.html$/);
    if (fnMatch) pid = fnMatch[1];
  }

  // Also check productTitle
  const titleMatch = content.match(/<h1 class="pdp-title"[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : '';

  if ((pid && rudrakshaProductIds.has(pid)) || title.toLowerCase().includes('rudraksh')) {
    targetFiles.push({ file: path.join(productsDir, f), pid, title });
  }
});

// Also check frontend/rudraksha/ and frontend/rudraksha-mala/
const otherDirs = [
  path.join(__dirname, '..', 'frontend', 'rudraksha'),
  path.join(__dirname, '..', 'frontend', 'rudraksha-mala')
];

otherDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
      targetFiles.push({ file: path.join(dir, f), pid: 'folder', title: f });
    });
  }
});

console.log(`\nFound ${targetFiles.length} target files:`);
targetFiles.forEach(t => console.log(`${path.basename(t.file)} -> PID: ${t.pid} | Title: ${t.title}`));

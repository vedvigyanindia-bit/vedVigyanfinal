const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const INDEX_HTML = path.join(FRONTEND_DIR, 'index.html');

const ALL_PRODUCTS_CARD = `              <a class="vv-card-item" href="/shop.html">
                <div class="vv-card-item__img">
                  <img src="/public/images/banner/all-products.webp" alt="All Products" loading="lazy" />
                </div>
                <div class="vv-card-item__title">All Products</div>
                <div class="vv-card-item__sub">Entire sacred collection</div>
              </a>`;

// 1. Update index.html
let indexContent = fs.readFileSync(INDEX_HTML, 'utf8');

// Target the shopall vv-card-dropdown__grid
const shopallRegex = /(<div class="lux-mega-wrap" data-mega="shopall">[\s\S]*?<div class="vv-card-dropdown__grid">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>)/i;

const match = indexContent.match(shopallRegex);
if (!match) {
  console.error('Could not find shopall dropdown in index.html');
  process.exit(1);
}

const currentGridInner = match[2];
if (!currentGridInner.includes('href="/shop.html"')) {
  // Determine newline style (\r\n or \n)
  const isCrlf = indexContent.includes('\r\n');
  const nl = isCrlf ? '\r\n' : '\n';
  const cardFormatted = ALL_PRODUCTS_CARD.replace(/\r?\n/g, nl);

  const updatedGridInner = currentGridInner.trimEnd() + nl + cardFormatted + nl + '            ';
  indexContent = indexContent.replace(shopallRegex, `$1${updatedGridInner}$3`);
  fs.writeFileSync(INDEX_HTML, indexContent, 'utf8');
  console.log('Successfully added All Products card to frontend/index.html');
} else {
  console.log('All Products card already present in frontend/index.html');
}

// 2. Update scripts/sync-divine-megamenu.js
const SYNC_MEGAMENU = path.join(__dirname, 'sync-divine-megamenu.js');
if (fs.existsSync(SYNC_MEGAMENU)) {
  let syncContent = fs.readFileSync(SYNC_MEGAMENU, 'utf8');
  if (!syncContent.includes('alt="All Products"')) {
    const gemMatch = /(<a class="vv-card-item" href="\/gem-stone\.html">[\s\S]*?<\/a>)/;
    if (gemMatch.test(syncContent)) {
      syncContent = syncContent.replace(
        gemMatch,
        `$1\n              <a class="vv-card-item" href="/shop.html">\n                <div class="vv-card-item__img">\n                  <img src="/public/images/banner/all-products.webp" alt="All Products" loading="lazy" />\n                </div>\n                <div class="vv-card-item__title">All Products</div>\n                <div class="vv-card-item__sub">Entire sacred collection</div>\n              </a>`
      );
      fs.writeFileSync(SYNC_MEGAMENU, syncContent, 'utf8');
      console.log('Updated scripts/sync-divine-megamenu.js');
    }
  }
}

// 3. Update frontend/public/js/lux-shell.js
const LUX_SHELL = path.join(FRONTEND_DIR, 'public', 'js', 'lux-shell.js');
if (fs.existsSync(LUX_SHELL)) {
  let shellContent = fs.readFileSync(LUX_SHELL, 'utf8');
  if (!shellContent.includes('alt="All Products"')) {
    const shopallShellRegex = /(<div class="lux-mega-wrap" data-mega="shopall">[\s\S]*?<div class="lux-mega-grid">)([\s\S]*?)(<\/div>)/;
    const shellMatch = shellContent.match(shopallShellRegex);
    if (shellMatch && !shellMatch[2].includes('href="/shop.html"')) {
      const allItem = `\n                <a class="lux-mega-item" href="/shop.html">\n                  <div class="lux-mega-thumb"><img src="/public/images/banner/all-products.webp" alt="All Products" loading="lazy" /></div>\n                  <b>All Products</b><span>Entire sacred collection</span>\n                </a>`;
      shellContent = shellContent.replace(shopallShellRegex, `$1${allItem}$2$3`);
      fs.writeFileSync(LUX_SHELL, shellContent, 'utf8');
      console.log('Updated frontend/public/js/lux-shell.js');
    }
  }
}

// 4. Synchronize header to all pages using sync-home-header.js
console.log('Running sync-home-header.js across all pages...');
require('./sync-home-header.js');

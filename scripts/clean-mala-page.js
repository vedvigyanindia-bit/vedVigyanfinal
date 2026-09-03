const fs = require('fs');
const path = require('path');

// Read data.js
const dataFilePath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'data.js');
let dataContent = fs.readFileSync(dataFilePath, 'utf8');

global.window = {};
eval(dataContent);

const products = (global.window.VED_VIGYAN_DATA?.products || []).filter(
  p => p.category === 'mala' || p.category === 'rudraksha-mala'
);

function renderProductCardHtml(p) {
  const origPrice = p.originalPrice || Math.round(p.price * 1.8);
  const disc = p.discountPercent || Math.round(((origPrice - p.price) / origPrice) * 100);
  const stars = '★★★★★';
  const imgUrl = p.image || (p.images && p.images[0]) || '';
  const imgAlt = p.imageAlt || p.name || '';
  const prodUrl = p.url || `/products/${p.slug || p.id}`;

  return `
    <article class="lux-card" data-product-id="${p.id}">
      <a class="lux-card-media" href="${prodUrl}">
        <span class="lux-card-badge">${disc}% OFF</span>
        <img src="${imgUrl}" alt="${imgAlt}" loading="lazy" width="300" height="300">
      </a>
      <div class="lux-card-content">
        <div class="lux-card-rating">
          <span class="stars">${stars}</span>
          <span class="score">${p.rating || '5.0'}</span>
        </div>
        <h3 class="lux-card-title">
          <a href="${prodUrl}">${p.name}</a>
        </h3>
        <div class="lux-card-price-row">
          <span class="lux-price-now">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="lux-price-was">₹${origPrice.toLocaleString('en-IN')}</span>
        </div>
        <div class="lux-card-actions">
          <button class="lux-btn-primary" type="button" data-buy-now="${p.id}">BUY NOW</button>
          <button class="lux-btn-secondary" type="button" data-add-to-cart="${p.id}">ADD TO CART</button>
        </div>
      </div>
    </article>
  `;
}

const catalogHtml = products.map(renderProductCardHtml).join('\n');

// Read mala.html
const malaHtmlPath = path.join(__dirname, '..', 'frontend', 'mala.html');
let content = fs.readFileSync(malaHtmlPath, 'utf8');

// 1. Remove the top section containing "Sacred Jaap & Meditation Malas"
const topHeaderSectionRegex = /<section class="pagecard">\s*<div class="breadcrumbs">[\s\S]*?Sacred Jaap & Meditation Malas[\s\S]*?<\/section>/gi;
content = content.replace(topHeaderSectionRegex, '');

// 2. Remove bottom guidance section
const guidanceSectionRegex = /<!--\s*GUIDANCE & RECOMMENDATION FORM BELOW PRODUCTS\s*-->[\s\S]*?<\/section>/gi;
const guidanceCardsRegex = /<section class="grid" aria-label="Mala guidance">[\s\S]*?<\/section>/gi;
content = content.replace(guidanceSectionRegex, '');
content = content.replace(guidanceCardsRegex, '');

// 3. Pre-render product catalog grid
content = content.replace(
  /<div id="malaCatalog" class="grid">[\s\S]*?<\/div>/,
  `<div id="malaCatalog" class="lux-products-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">\n${catalogHtml}\n</div>`
);

fs.writeFileSync(malaHtmlPath, content, 'utf8');
console.log(`Successfully updated mala.html: removed target top banner section and pre-rendered ${products.length} product cards`);

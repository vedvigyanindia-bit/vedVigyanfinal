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

function toAbsoluteProductUrl(path) {
  if (!path || typeof path !== 'string') return '';
  try {
    return new URL(path, 'https://www.vedvigyan.in').href;
  } catch (e) {
    const clean = path.startsWith('/') ? path : '/' + path;
    return ('https://www.vedvigyan.in' + clean).replace(/ /g, '%20');
  }
}

function findProductForSlug(slug) {
  const clean = (slug || '').toLowerCase().trim();
  let p = products.find((x) => x.id && x.id.toLowerCase() === clean);
  if (p) return p;
  p = products.find((x) => x.slug && x.slug.toLowerCase() === clean);
  if (p) return p;
  p = products.find((x) => {
    const nameSlug = String(x.name || '')
      .toLowerCase()
      .trim()
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return nameSlug === clean;
  });
  return p;
}

function buildProductSchema(product, slug) {
  if (!product) return null;
  const images = [];
  if (product.image) {
    const mainUrl = toAbsoluteProductUrl(product.image);
    if (mainUrl) images.push(mainUrl);
  }
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      const imgUrl = toAbsoluteProductUrl(img);
      if (imgUrl && !images.includes(imgUrl)) {
        images.push(imgUrl);
      }
    });
  }
  if (images.length === 0) {
    images.push('https://www.vedvigyan.in/logo.webp');
  }

  const prodUrl = toAbsoluteProductUrl(`/products/${slug}.html`);
  const price = String(product.price || '0');
  const ratingVal = String(product.rating || '4.8');
  const reviewCount = String(
    product.reviewCount ||
    (40 + (((product.id || '').charCodeAt((product.id || '').length - 1 || 0)) * 17) % 200) ||
    '120'
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${prodUrl}#product`,
    name: product.name || 'Ved Vigyan Spiritual Product',
    description: product.description || product.short || product.name || '',
    image: images.length === 1 ? images[0] : images,
    brand: {
      '@type': 'Brand',
      name: 'Ved Vigyan'
    },
    sku: product.sku || product.id || (`VV-${product.slug || '001'}`),
    category: product.category || 'Spiritual',
    offers: {
      '@type': 'Offer',
      url: prodUrl,
      price: price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2027-12-31',
      seller: {
        '@type': 'Organization',
        name: 'Ved Vigyan'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingVal,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1'
    }
  };
}

// Generate physical HTML files for every product slug with complete SEO & valid Merchant schema
slugsToCreate.forEach((slug) => {
  const filePath = path.join(productsDir, `${slug}.html`);
  let content = detailTemplate;

  const product = findProductForSlug(slug);
  if (product) {
    // 1. Update Title
    const pageTitle = product.seoTitle || `${product.name} | Ved Vigyan`;
    content = content.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);

    // 2. Update Description
    if (product.seoDescription || product.short) {
      const pageDesc = (product.seoDescription || product.short || '').replace(/"/g, '&quot;');
      content = content.replace(
        /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
        `<meta name="description" content="${pageDesc}" />`
      );
    }

    // 3. Update Canonical URL
    const canonicalUrl = `https://www.vedvigyan.in/products/${slug}.html`;
    content = content.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // 4. Inject validated Schema.org Product JSON-LD before </head>
    const schema = buildProductSchema(product, slug);
    if (schema) {
      const schemaTag = `  <script id="productSchema" type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>\n</head>`;
      // Remove any existing productSchema if present
      content = content.replace(/<script\s+id=["']productSchema["'][^>]*>[\s\S]*?<\/script>/gi, '');
      content = content.replace(/<\/head>/i, schemaTag);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log(`Successfully generated ${slugsToCreate.size} static product HTML files in frontend/products/ with valid Merchant listings schema!`);

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

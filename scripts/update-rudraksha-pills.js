const fs = require('fs');
const path = require('path');

// 1. Load data.js
const dataContent = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'public', 'js', 'data.js'), 'utf8');
const vm = require('vm');
const sandbox = { window: {} };
vm.runInNewContext(dataContent, sandbox);
const products = sandbox.window.VED_VIGYAN_DATA.products;

// Function to resolve product by slug
function resolveProductBySlug(slug) {
  const cleanSlug = (slug || "").toLowerCase().trim();
  let product = products.find((p) => p.id.toLowerCase() === cleanSlug || (p.slug && p.slug.toLowerCase() === cleanSlug));
  if (!product && cleanSlug) {
    product = products.find((p) => {
      const normName = (p.name || "").toLowerCase().replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return normName === cleanSlug;
    });
  }
  if (!product && cleanSlug) {
    const searchTokens = cleanSlug.split("-").map(t => {
      if (t === "braclet") return "bracelet";
      if (t === "rudrakasha") return "rudraksha";
      if (t === "jap") return "jaap";
      return t;
    }).filter(t => t.length > 1);

    let maxScore = 0;
    let bestMatch = null;
    products.forEach((p) => {
      const pNameNorm = (p.name || "").toLowerCase();
      const pSlugNorm = (p.slug || "").toLowerCase();
      const pTagsNorm = (p.tags || []).join(" ").toLowerCase();
      const haystack = `${p.id.toLowerCase()} ${pNameNorm} ${pSlugNorm} ${pTagsNorm}`;
      let score = 0;
      searchTokens.forEach((token) => {
        if (haystack.includes(token)) score += (token.length >= 4 ? 3 : 1);
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = p;
      }
    });
    if (maxScore >= 3) product = bestMatch;
  }
  return product;
}

const rudrakshaProductIds = new Set([
  'vv_p01', 'vv_p02', 'vv_p03', 'vv_p04', 'vv_p05', 'vv_p06', 'vv_p07', 'vv_p08', 'vv_p09', 'vv_p10',
  'vv_p13', 'vv_p14', 'vv_p15', 'vv_p19', 'vv_p21', 'vv_p25', 'vv_p31', 'vv_p35'
]);

function isRudrakshaOrRudrakshaMala(filePath, product) {
  const norm = filePath.replace(/\\/g, '/').toLowerCase();
  
  // 1. Files inside rudraksha or rudraksha-mala directories
  if (norm.includes('/frontend/rudraksha/') || norm.includes('/frontend/rudraksha-mala/')) {
    return true;
  }

  // 2. Check product object if resolved
  if (product) {
    if (rudrakshaProductIds.has(product.id)) return true;
    const cat = (product.category || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    const tags = (product.tags || []).join(' ').toLowerCase();
    if (cat === 'rudraksha' || cat === 'rudraksha-mala') return true;
    if (name.includes('rudraksh') || name.includes('mukhi')) return true;
    if (tags.includes('rudraksha')) return true;
  }

  // 3. Check filename
  const fileName = path.basename(norm, '.html');
  if (rudrakshaProductIds.has(fileName)) return true;
  if (fileName.includes('rudraksh') || fileName.includes('rudrakasha')) return true;
  if (/^[0-9]+-mukhi/.test(fileName)) return true;
  if (fileName.includes('gauri-sankar') || fileName.includes('gauri-shankar')) return true;
  if (fileName.includes('ganesh-rudraksh') || fileName.includes('original-ganesh')) return true;

  // 4. Check HTML file content title
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (/<title>[^<]*(rudraksh|mukhi)[^<]*<\/title>/i.test(content)) {
      return true;
    }
  } catch {}

  return false;
}

// Find all HTML files across frontend directory
function walkDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (entry.endsWith('.html') && entry !== 'index.html') {
      files.push(fullPath);
    }
  }
  return files;
}

const frontendDir = path.join(__dirname, '..', 'frontend');
const allHtmlFiles = walkDir(frontendDir);

let updatedCount = 0;
const updatedList = [];

allHtmlFiles.forEach(filePath => {
  const fileName = path.basename(filePath, '.html');
  const product = resolveProductBySlug(fileName);

  if (isRudrakshaOrRudrakshaMala(filePath, product)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace "Natural Stone" with "Natural Fruit" in pdp-pill
    if (content.includes('Natural Stone')) {
      content = content.replace(/<span class="pdp-pill">\s*Natural Stone\s*<\/span>/gi, '<span class="pdp-pill">Natural Fruit</span>');
      modified = true;
    }

    // Replace "100% Made in India" or "Made in India" with "100% Natural" in pdp-pill
    if (content.includes('100% Made in India')) {
      content = content.replace(/<span class="pdp-pill">\s*100% Made in India\s*<\/span>/gi, '<span class="pdp-pill">100% Natural</span>');
      modified = true;
    } else if (content.includes('Made in India')) {
      content = content.replace(/<span class="pdp-pill">\s*Made in India\s*<\/span>/gi, '<span class="pdp-pill">100% Natural</span>');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      updatedList.push(`${path.relative(frontendDir, filePath)} ${product ? `(${product.id}: ${product.name})` : ''}`);
    }
  }
});

console.log(`Updated ${updatedCount} HTML files for Rudraksha and Rudraksha Mala:`);
updatedList.forEach(item => console.log('✓ ' + item));

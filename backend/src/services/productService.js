const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = process.cwd().endsWith('backend') 
  ? path.resolve(process.cwd(), '..') 
  : path.resolve(__dirname, '..', '..', '..');
const PRODUCTS_JSON_PATH = path.join(ROOT_DIR, 'backend', 'data', 'products.json');
const DATA_JS_PATH = path.join(ROOT_DIR, 'frontend', 'public', 'js', 'data.js');
const PRODUCTS_HTML_DIR = path.join(ROOT_DIR, 'frontend', 'products');
const IMAGES_BASE_DIR = path.join(ROOT_DIR, 'frontend', 'public', 'images', 'products');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. Get All Products
function getAllProducts() {
  if (fs.existsSync(PRODUCTS_JSON_PATH)) {
    try {
      const raw = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[ProductService] Error reading products.json:', err);
    }
  }

  // Fallback: extract from data.js
  if (fs.existsSync(DATA_JS_PATH)) {
    try {
      const content = fs.readFileSync(DATA_JS_PATH, 'utf8');
      const sandbox = { window: {} };
      vm.runInNewContext(content, sandbox);
      const prods = sandbox.window.VED_VIGYAN_DATA?.products || [];
      ensureDir(path.dirname(PRODUCTS_JSON_PATH));
      fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(prods, null, 2), 'utf8');
      return prods;
    } catch (err) {
      console.error('[ProductService] Error extracting from data.js:', err);
    }
  }

  return [];
}

// 2. Write products back to products.json AND sync to frontend/public/js/data.js
function saveProducts(products) {
  ensureDir(path.dirname(PRODUCTS_JSON_PATH));
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2), 'utf8');

  // Read current store and categories from data.js
  let store = {
    name: "Ved Vigyan",
    phone: "+91 7900811101",
    email: "Vedvigyanindia@gmail.com",
    address: "Dehradun, Uttarakhand, India - 248002"
  };

  let categories = [
    { id: "all", label: `All Products (${products.length})` },
    { id: "rudraksha", label: "Rudraksha Beads" },
    { id: "zodiac-bracelet", label: "Zodiac Rashi Bracelets" },
    { id: "crystal-bracelet", label: "Gemstone & Crystals" },
    { id: "mala", label: "Jaap Malas & Sacred Strings" },
    { id: "gemstone-tree", label: "Crystal & Gemstone Trees" },
    { id: "puja-items", label: "Sacred Puja Essentials" }
  ];

  if (fs.existsSync(DATA_JS_PATH)) {
    try {
      const content = fs.readFileSync(DATA_JS_PATH, 'utf8');
      const sandbox = { window: {} };
      vm.runInNewContext(content, sandbox);
      if (sandbox.window.VED_VIGYAN_DATA?.store) {
        store = sandbox.window.VED_VIGYAN_DATA.store;
      }
    } catch {}
  }

  // Update counts in categories
  categories.forEach(cat => {
    if (cat.id === 'all') {
      cat.label = `All Products (${products.length})`;
    } else {
      const count = products.filter(p => (p.category || '').toLowerCase() === cat.id.toLowerCase()).length;
      cat.label = cat.label.replace(/\(\d+\)/, '').trim() + (count > 0 ? ` (${count})` : '');
    }
  });

  const updatedDataJs = `// Auto-generated Ved Vigyan Catalog Data
function deriveMerchandising(products) {
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
}

window.VED_VIGYAN_DATA = {
  "store": ${JSON.stringify(store, null, 2)},
  "categories": ${JSON.stringify(categories, null, 2)},
  "products": ${JSON.stringify(products, null, 2)}
};
`;

  fs.writeFileSync(DATA_JS_PATH, updatedDataJs, 'utf8');
}

// 3. Helper to save base64 uploaded image
function saveBase64Image(slug, base64Data, index = 1) {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const mime = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    let ext = 'jpg';
    if (mime.includes('png')) ext = 'png';
    else if (mime.includes('webp')) ext = 'webp';
    else if (mime.includes('jpeg')) ext = 'jpg';

    const dir = path.join(IMAGES_BASE_DIR, slug);
    ensureDir(dir);

    const filename = `${index}.${ext}`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buffer);

    return `/public/images/products/${slug}/${filename}`;
  } catch (err) {
    console.error('[ProductService] Failed to save base64 image:', err);
    return null;
  }
}

// 4. Generate slug from product name
function generateSlug(name, existingProducts) {
  let base = String(name || 'product')
    .toLowerCase()
    .trim()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = base;
  let counter = 1;
  while (existingProducts.some(p => p.slug === slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

// 5. Generate next product ID
function generateNextId(existingProducts) {
  let maxNum = 0;
  existingProducts.forEach(p => {
    const match = (p.id || '').match(/vv_p(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const nextNum = maxNum + 1;
  return `vv_p${String(nextNum).padStart(2, '0')}`;
}

// 6. Generate Static HTML File for Product (Fallback & SEO)
function generateProductHtml(product) {
  try {
    ensureDir(PRODUCTS_HTML_DIR);
    const targetFile = path.join(PRODUCTS_HTML_DIR, `${product.slug}.html`);
    
    // Copy template from product/detail.html or create standard wrapper
    const detailTemplatePath = path.join(__dirname, '..', '..', '..', 'frontend', 'product', 'detail.html');
    if (fs.existsSync(detailTemplatePath)) {
      let template = fs.readFileSync(detailTemplatePath, 'utf8');

      // Replace page titles and meta
      template = template
        .replace(/<title>.*?<\/title>/i, `<title>${product.name} | Ved Vigyan</title>`)
        .replace(/<h1 class="pdp-title" id="productTitle">.*?<\/h1>/i, `<h1 class="pdp-title" id="productTitle">${product.name}</h1>`);

      // Adjust badge pills if Rudraksha
      const isRudraksha = (
        (product.category || '').toLowerCase().includes('rudraksha') ||
        /rudraksh|mukhi/i.test(product.name || '')
      );

      if (isRudraksha) {
        template = template
          .replace('<span class="pdp-pill">Natural Stone</span>', '<span class="pdp-pill">Natural Fruit</span>')
          .replace('<span class="pdp-pill">100% Made in India</span>', '<span class="pdp-pill">100% Natural</span>');
      }

      fs.writeFileSync(targetFile, template, 'utf8');
      console.log(`[ProductService] Generated HTML: ${product.slug}.html`);
    }
  } catch (err) {
    console.error('[ProductService] Error generating product HTML:', err);
  }
}

// 7. Add Product
function addProduct(data) {
  const products = getAllProducts();

  const name = String(data.name || '').trim();
  if (!name) throw new Error('Product name is required');

  const price = Number(data.price);
  if (isNaN(price) || price < 0) throw new Error('Valid product price is required');

  const originalPrice = Number(data.originalPrice) || Math.round(price * 1.5);
  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const slug = generateSlug(name, products);
  const id = generateNextId(products);

  // Handle uploaded images
  let savedImages = [];
  if (Array.isArray(data.uploadedImages) && data.uploadedImages.length > 0) {
    data.uploadedImages.forEach((imgBase64, idx) => {
      if (imgBase64.startsWith('data:image/')) {
        const url = saveBase64Image(slug, imgBase64, idx + 1);
        if (url) savedImages.push(url);
      } else if (imgBase64.startsWith('http') || imgBase64.startsWith('/')) {
        savedImages.push(imgBase64);
      }
    });
  }

  // Fallback to image URLs or placeholder
  if (savedImages.length === 0) {
    if (data.image) savedImages.push(data.image);
    else savedImages.push('/public/images/logo.jpg');
  }

  const primaryImage = savedImages[0];

  // Bullets
  let bullets = Array.isArray(data.bullets) ? data.bullets : [];
  if (typeof data.bullets === 'string') {
    bullets = data.bullets.split('\n').map(b => b.trim()).filter(Boolean);
  }
  if (bullets.length === 0) {
    bullets = [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ];
  }

  const category = (data.category || 'rudraksha').toLowerCase().trim();
  const tags = Array.isArray(data.tags) ? data.tags : [category, 'authentic', 'vedic'];

  const newProduct = {
    id,
    category,
    slug,
    name,
    price,
    originalPrice,
    discountPercent,
    rating: Number(data.rating) || 4.8,
    tags,
    image: primaryImage,
    imageAlt: `${name} - Authentic Ved Vigyan Original Product`,
    images: savedImages,
    certificate: savedImages[savedImages.length - 1] || primaryImage,
    short: data.short || `Authentic ${name} sourced and verified by Ved Vigyan.`,
    description: data.description || `${name} is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.`,
    bullets,
    seoTitle: `${name} - Buy Original Online | Ved Vigyan`,
    seoDescription: `Shop original ${name} online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.`,
    url: `/products/${slug}`,
    inStock: data.inStock !== false,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  saveProducts(products);
  generateProductHtml(newProduct);

  return newProduct;
}

// 8. Update Product
function updateProduct(id, updates) {
  const products = getAllProducts();
  const index = products.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) throw new Error(`Product not found with id: ${id}`);

  const product = products[index];

  if (updates.name) product.name = String(updates.name).trim();
  if (updates.category) product.category = String(updates.category).toLowerCase().trim();
  if (updates.price !== undefined) product.price = Number(updates.price);
  if (updates.originalPrice !== undefined) product.originalPrice = Number(updates.originalPrice);

  if (product.originalPrice && product.price) {
    product.discountPercent = Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100));
  }

  if (updates.short !== undefined) product.short = String(updates.short).trim();
  if (updates.description !== undefined) product.description = String(updates.description).trim();
  if (updates.inStock !== undefined) product.inStock = Boolean(updates.inStock);

  if (updates.bullets) {
    if (Array.isArray(updates.bullets)) product.bullets = updates.bullets;
    else if (typeof updates.bullets === 'string') {
      product.bullets = updates.bullets.split('\n').map(b => b.trim()).filter(Boolean);
    }
  }

  // Handle newly uploaded images if any
  if (Array.isArray(updates.uploadedImages) && updates.uploadedImages.length > 0) {
    const slug = product.slug;
    const newImages = [];
    updates.uploadedImages.forEach((imgBase64, idx) => {
      if (imgBase64.startsWith('data:image/')) {
        const url = saveBase64Image(slug, imgBase64, (product.images || []).length + idx + 1);
        if (url) newImages.push(url);
      } else if (imgBase64.startsWith('http') || imgBase64.startsWith('/')) {
        newImages.push(imgBase64);
      }
    });
    if (newImages.length > 0) {
      product.images = [...(product.images || []), ...newImages];
      product.image = product.images[0];
    }
  }

  product.updatedAt = new Date().toISOString();

  products[index] = product;
  saveProducts(products);
  generateProductHtml(product);

  return product;
}

// 9. Delete Product
function deleteProduct(id) {
  let products = getAllProducts();
  const initialLength = products.length;
  const productToDelete = products.find(p => p.id === id || p.slug === id);
  if (!productToDelete) throw new Error(`Product not found with id: ${id}`);

  products = products.filter(p => p.id !== productToDelete.id && p.slug !== productToDelete.slug);
  if (products.length === initialLength) throw new Error('Failed to remove product');

  saveProducts(products);

  // Remove static HTML file if exists
  const htmlPath = path.join(PRODUCTS_HTML_DIR, `${productToDelete.slug}.html`);
  if (fs.existsSync(htmlPath)) {
    try { fs.unlinkSync(htmlPath); } catch {}
  }

  return { success: true, deletedId: productToDelete.id, deletedName: productToDelete.name };
}

// 10. Toggle Stock
function toggleStock(id) {
  const products = getAllProducts();
  const product = products.find(p => p.id === id || p.slug === id);
  if (!product) throw new Error(`Product not found with id: ${id}`);

  product.inStock = product.inStock === false ? true : false;
  product.updatedAt = new Date().toISOString();

  saveProducts(products);
  return product;
}

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleStock
};

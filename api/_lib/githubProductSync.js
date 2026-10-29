const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'vedvigyanindia-bit';
const GITHUB_REPO = 'vedVigyanfinal';
const GITHUB_BRANCH = 'main';

async function ghFetch(endpoint, options = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is not configured. Please add it in Vercel Project Settings.');
  }
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'VedVigyan-Admin-Sync',
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`GitHub API Error [${res.status}]: ${errorBody}`);
  }
  return res.json();
}

// 1. Get raw content and SHA of a file from GitHub
async function getFileFromRepo(filePath) {
  try {
    const data = await ghFetch(`/contents/${filePath}?ref=${GITHUB_BRANCH}`);
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content, sha: data.sha };
  } catch (err) {
    console.warn(`[GitHubSync] File not found or error reading ${filePath}:`, err.message);
    return null;
  }
}

// 2. Get All Products from GitHub
async function getAllProducts() {
  const file = await getFileFromRepo('backend/data/products.json');
  if (file && file.content) {
    try {
      return JSON.parse(file.content);
    } catch (e) {
      console.error('[GitHubSync] Error parsing products.json:', e);
    }
  }
  return [];
}

// 3. Build data.js content string
function buildDataJs(products) {
  const categories = [
    { id: "all", label: `All Products (${products.length})` },
    { id: "rudraksha", label: "Original Nepal Rudraksha" },
    { id: "mala", label: "Jaap Malas & Sacred Strings" },
    { id: "gemstone-tree", label: "Vastu Gemstone Trees" },
    { id: "crystal-bracelet", label: "Healing Crystal Bracelets" },
    { id: "zodiac-bracelet", label: "Vedic Rashi (Zodiac) Bracelets" }
  ];

  categories.forEach(cat => {
    if (cat.id !== 'all') {
      const count = products.filter(p => (p.category || '').toLowerCase() === cat.id.toLowerCase()).length;
      if (count > 0) cat.label += ` (${count})`;
    }
  });

  const store = {
    name: "Ved Vigyan",
    tagline: "Divine Wisdom & Sacred Jewels",
    phone: "+91 7900811101",
    email: "vedvigyanindia@gmail.com",
    address: "Dehradun, Uttarakhand, India",
    instagram: "https://www.instagram.com/",
    youtube: "https://youtu.be/o9dREd5ZPhw?si=X2tbKalptHS0wmhD",
    shipping: {
      freeShippingThreshold: 999,
      standardShippingFee: 99,
      expressShippingFee: 149
    }
  };

  return `// Auto-generated Ved Vigyan Catalog Data
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
}

// 4. Commit multiple files atomically via GitHub Git Data API
async function commitFilesToRepo({ commitMessage, filesToUpdate = [], filesToDelete = [] }) {
  // 1. Get latest commit on main
  const refData = await ghFetch(`/git/ref/heads/${GITHUB_BRANCH}`);
  const latestCommitSha = refData.object.sha;

  // 2. Get tree of latest commit
  const commitData = await ghFetch(`/git/commits/${latestCommitSha}`);
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs for files to update
  const treeItems = [];

  for (const file of filesToUpdate) {
    const isBase64 = file.isBase64 || false;
    const blobData = await ghFetch(`/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content: isBase64 ? file.content : Buffer.from(file.content, 'utf8').toString('base64'),
        encoding: 'base64'
      })
    });

    treeItems.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blobData.sha
    });
  }

  // Files to delete: omit or set sha to null if supported, or build tree
  // For files to delete in Git Trees API, GitHub allows null sha to delete an entry
  for (const delPath of filesToDelete) {
    treeItems.push({
      path: delPath,
      mode: '100644',
      type: 'blob',
      sha: null
    });
  }

  // 4. Create new tree
  const newTreeData = await ghFetch(`/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems
    })
  });

  // 5. Create new commit
  const newCommitData = await ghFetch(`/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: commitMessage,
      tree: newTreeData.sha,
      parents: [latestCommitSha]
    })
  });

  // 6. Update main branch reference
  await ghFetch(`/git/refs/heads/${GITHUB_BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: newCommitData.sha,
      force: false
    })
  });

  return {
    success: true,
    commitSha: newCommitData.sha
  };
}

async function getProductDetailTemplate() {
  try {
    const fs = require('fs');
    const path = require('path');
    const localPath = path.join(process.cwd(), 'frontend', 'product', 'detail.html');
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath, 'utf8');
    }
  } catch (e) {
    // fallback to GitHub fetch
  }
  const file = await getFileFromRepo('frontend/product/detail.html');
  if (file && file.content) return file.content;
  return null;
}

function buildProductHtml(product, template) {
  if (!template || !product) return "";
  const slug = product.slug || product.id;
  const pageTitle = product.seoTitle || `${product.name} | Ved Vigyan`;
  const pageDesc = (product.seoDescription || product.short || product.name || '').replace(/"/g, '&quot;');
  const canonicalUrl = `https://www.vedvigyan.in/products/${slug}.html`;

  let content = template;
  content = content.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  content = content.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${pageDesc}" />`
  );
  content = content.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  const prodUrl = `https://www.vedvigyan.in/products/${slug}.html`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${prodUrl}#product`,
    name: product.name || 'Ved Vigyan Spiritual Product',
    description: product.description || product.short || product.name || '',
    image: Array.isArray(product.images) && product.images.length > 0
      ? product.images.map(img => img.startsWith('http') ? img : `https://www.vedvigyan.in${img.startsWith('/') ? img : '/' + img}`)
      : [`https://www.vedvigyan.in${product.image || '/public/images/logo.jpg'}`],
    brand: { '@type': 'Brand', name: 'Ved Vigyan' },
    sku: product.sku || product.id || `VV-${slug}`,
    mpn: product.sku || product.id || `VV-${slug}`,
    category: product.category || 'Spiritual',
    offers: {
      '@type': 'Offer',
      url: prodUrl,
      price: product.price || 0,
      priceCurrency: 'INR',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Ved Vigyan' }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating) || 4.8,
      reviewCount: 78,
      bestRating: '5',
      worstRating: '1'
    }
  };

  const schemaTag = `  <script id="productSchema" type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>\n</head>`;
  content = content.replace(/<script\s+id=["']productSchema["'][^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<\/head>/i, schemaTag);

  return content;
}

module.exports = {
  getAllProducts,
  buildDataJs,
  commitFilesToRepo,
  getFileFromRepo,
  getProductDetailTemplate,
  buildProductHtml
};


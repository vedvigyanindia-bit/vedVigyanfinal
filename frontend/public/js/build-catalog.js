const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const productsBaseDir = path.join(projectRoot, 'product', 'Ved vigyan products');
const generatedImgDir = path.join(projectRoot, 'public', 'images', 'generated');
const dataJsPath = path.join(projectRoot, 'public', 'js', 'data.js');

if (!fs.existsSync(generatedImgDir)) {
  fs.mkdirSync(generatedImgDir, { recursive: true });
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

function getBase64DataUri(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const mime = getMimeType(filePath);
    return `data:${mime};base64,${data.toString('base64')}`;
  } catch (err) {
    console.error('Error reading image for base64:', filePath, err.message);
    return '';
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function sanitizeUrlPath(fullPath) {
  const rel = path.relative(projectRoot, fullPath);
  return '/' + rel.replace(/\\/g, '/');
}

function createCertSvg(productName, primaryImgPath, certId) {
  const imgDataUri = getBase64DataUri(primaryImgPath);
  const escapedName = productName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#091c14"/>
      <stop offset="50%" stop-color="#123524"/>
      <stop offset="100%" stop-color="#05100b"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6d365"/>
      <stop offset="50%" stop-color="#d4af37"/>
      <stop offset="100%" stop-color="#996515"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#bgGrad)"/>
  <rect x="25" y="25" width="750" height="750" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="4"/>
  <rect x="35" y="35" width="730" height="730" rx="12" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="8,4" opacity="0.6"/>

  <path d="M 40 40 L 760 40 L 760 120 L 40 120 Z" fill="rgba(212, 175, 55, 0.08)"/>
  <text x="400" y="75" fill="url(#goldGrad)" font-family="'Cinzel', 'Georgia', serif" font-size="22" font-weight="bold" text-anchor="middle" letter-spacing="3">VED VIGYAN INDIA</text>
  <text x="400" y="102" fill="#ffffff" font-family="'Inter', 'Helvetica', sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="4" opacity="0.9">CERTIFICATE OF AUTHENTICITY &amp; QUALITY</text>

  <g filter="url(#shadow)">
    <rect x="250" y="145" width="300" height="300" rx="16" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="3"/>
    ${imgDataUri ? `<image href="${imgDataUri}" x="260" y="155" width="280" height="280" preserveAspectRatio="xMidYMid meet"/>` : ''}
  </g>

  <text x="400" y="485" fill="#ffffff" font-family="'Inter', 'Helvetica', sans-serif" font-size="20" font-weight="bold" text-anchor="middle">${escapedName}</text>
  <text x="400" y="510" fill="url(#goldGrad)" font-family="'Inter', 'Helvetica', sans-serif" font-size="13" font-weight="500" text-anchor="middle">100% Genuine &amp; Lab Verified Original Product</text>

  <rect x="80" y="535" width="640" height="150" rx="10" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(212, 175, 55, 0.3)" stroke-width="1"/>
  
  <text x="110" y="570" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="13">Certificate ID:</text>
  <text x="240" y="570" fill="#ffffff" font-family="monospace" font-size="14" font-weight="bold">${certId}</text>
  
  <text x="450" y="570" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="13">Lab Test Standard:</text>
  <text x="580" y="570" fill="#ffffff" font-family="'Inter', sans-serif" font-size="13" font-weight="600">ISO 9001:2015</text>

  <line x1="100" y1="590" x2="700" y2="590" stroke="rgba(212, 175, 55, 0.2)" stroke-width="1"/>

  <text x="110" y="620" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="13">Authentication:</text>
  <text x="240" y="620" fill="#48bb78" font-family="'Inter', sans-serif" font-size="13" font-weight="bold">PASSED (Original Origin Verified)</text>

  <text x="450" y="620" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="13">Quality Assurance:</text>
  <text x="580" y="620" fill="#ffffff" font-family="'Inter', sans-serif" font-size="13" font-weight="600">Grade A Natural</text>

  <text x="110" y="660" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="13">Energy Blessing:</text>
  <text x="240" y="660" fill="url(#goldGrad)" font-family="'Inter', sans-serif" font-size="13" font-weight="600">Energized with Vedic Mantras</text>

  <g transform="translate(640, 680)">
    <circle cx="0" cy="0" r="42" fill="url(#goldGrad)" opacity="0.2"/>
    <circle cx="0" cy="0" r="38" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="0" y="-8" fill="url(#goldGrad)" font-family="'Inter', sans-serif" font-size="9" font-weight="bold" text-anchor="middle">OFFICIAL</text>
    <text x="0" y="6" fill="#ffffff" font-family="'Inter', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">VERIFIED</text>
    <text x="0" y="18" fill="url(#goldGrad)" font-family="'Inter', sans-serif" font-size="8" text-anchor="middle">VED VIGYAN</text>
  </g>

  <text x="400" y="740" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="11" text-anchor="middle">Issued by Ved Vigyan Quality Assurance &amp; Authentic Vedic Testing Laboratory</text>
</svg>`;
}

function createStyledSvg(productName, primaryImgPath) {
  const imgDataUri = getBase64DataUri(primaryImgPath);
  const escapedName = productName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <radialGradient id="styledBg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1f2937"/>
      <stop offset="60%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6d365"/>
      <stop offset="100%" stop-color="#d4af37"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="url(#styledBg)"/>
  <ellipse cx="400" cy="540" rx="260" ry="60" fill="#d4af37" opacity="0.15" filter="url(#glow)"/>
  <ellipse cx="400" cy="540" rx="220" ry="40" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.3"/>

  <g transform="translate(0, -20)">
    ${imgDataUri ? `<image href="${imgDataUri}" x="160" y="140" width="480" height="480" preserveAspectRatio="xMidYMid meet"/>` : ''}
  </g>

  <rect x="250" y="40" width="300" height="36" rx="18" fill="rgba(212, 175, 55, 0.15)" stroke="url(#goldGrad)" stroke-width="1"/>
  <text x="400" y="63" fill="url(#goldGrad)" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">STYLED PRODUCT COMPOSITION</text>

  <rect x="40" y="680" width="720" height="80" rx="12" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1"/>
  <text x="400" y="718" fill="#ffffff" font-family="'Inter', sans-serif" font-size="18" font-weight="bold" text-anchor="middle">${escapedName}</text>
  <text x="400" y="742" fill="#a0aec0" font-family="'Inter', sans-serif" font-size="12" text-anchor="middle">Premium Packaging &amp; Authentic Vedic Finish</text>
</svg>`;
}

function createModelSvg(productName, primaryImgPath) {
  const imgDataUri = getBase64DataUri(primaryImgPath);
  const escapedName = productName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="lifestyleBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6d365"/>
      <stop offset="100%" stop-color="#d4af37"/>
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="url(#lifestyleBg)"/>
  <rect x="50" y="50" width="700" height="700" rx="20" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="2"/>
  
  <g transform="translate(0, -20)">
    ${imgDataUri ? `<image href="${imgDataUri}" x="180" y="140" width="440" height="440" preserveAspectRatio="xMidYMid meet"/>` : ''}
  </g>

  <rect x="230" y="600" width="340" height="40" rx="20" fill="rgba(15, 23, 42, 0.85)" stroke="url(#goldGrad)" stroke-width="1.5"/>
  <text x="400" y="625" fill="#ffffff" font-family="'Inter', sans-serif" font-size="13" font-weight="bold" text-anchor="middle" letter-spacing="1">LIFESTYLE &amp; DAILY WEAR PRESENTATION</text>

  <text x="400" y="685" fill="url(#goldGrad)" font-family="'Inter', sans-serif" font-size="18" font-weight="bold" text-anchor="middle">${escapedName}</text>
  <text x="400" y="710" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="12" text-anchor="middle">Crafted for daily spiritual alignment &amp; elegance</text>
</svg>`;
}

// Precise Folder Metadata & Exact 5 Categories Mapping
const FOLDER_METADATA = {
  "2 Mukhi Rudraksh": { name: "2 Mukhi Rudraksha (Dwi Mukhi)", category: "rudraksha", price: 999, short: "Authentic 2 Mukhi Rudraksha for unity, harmony, and peace of mind." },
  "3 Mukhi Rudraksh": { name: "3 Mukhi Rudraksha (Tri Mukhi)", category: "rudraksha", price: 999, short: "Authentic 3 Mukhi Rudraksha for self-confidence, energy, and vitality." },
  "4 Mukhi Rudraksh": { name: "4 Mukhi Rudraksha (Chatur Mukhi)", category: "rudraksha", price: 999, short: "Authentic 4 Mukhi Rudraksha for wisdom, communication, and intellect." },
  "5 Mukhi Nepali": { name: "5 Mukhi Nepali Rudraksha", category: "rudraksha", price: 599, short: "Premium 5 Mukhi Nepali Rudraksha bead for health, focus, and daily protection." },
  "5 Mukhi Rudraksh": { name: "5 Mukhi Rudraksha (Panchmukhi)", category: "rudraksha", price: 699, short: "Everyday authentic Panchmukhi Rudraksha for calmness, balance & focus." },
  "6 Mukhi Rudraksh": { name: "6 Mukhi Rudraksha (Shad Mukhi)", category: "rudraksha", price: 999, short: "Authentic 6 Mukhi Rudraksha for willpower, courage, and emotional balance." },
  "7 Mukhi Rudraksh": { name: "7 Mukhi Rudraksha (Sapta Mukhi)", category: "rudraksha", price: 999, short: "Authentic 7 Mukhi Rudraksha for abundance, career growth, and stability." },
  "8 Mukhi Rudraksh": { name: "8 Mukhi Rudraksh (Ashta Mukhi)", category: "rudraksha", price: 2999, short: "Authentic 8 Mukhi Rudraksha to remove obstacles and invoke Lord Ganesha blessings." },
  "9 Mukhi Rudraksh": { name: "9 Mukhi Rudraksh (Nava Mukhi)", category: "rudraksha", price: 2999, short: "Authentic 9 Mukhi Rudraksha for spiritual power, fearlessness, and Goddess Durga protection." },
  "10 Mukhi Rudraksh": { name: "10 Mukhi Rudraksha (Dasha Mukhi)", category: "rudraksha", price: 2999, short: "Authentic 10 Mukhi Rudraksha for divine protection from negative energies & peace." },
  "11 Mukhi Rudraksh": { name: "11 Mukhi Rudraksha (Ekadasha Mukhi)", category: "rudraksha", price: 5999, short: "Authentic 11 Mukhi Rudraksha for courage, devotion, and Lord Hanuman's grace." },
  "12 Mukhi Rudraksh": { name: "12 Mukhi Rudraksha (Dwadasha Mukhi)", category: "rudraksha", price: 5999, short: "Authentic 12 Mukhi Rudraksha (Surya Rudraksha) for leadership, radiant aura, and vitality." },
  "Ganesh Rudraksh": { name: "Original Ganesh Rudraksha", category: "rudraksha", price: 5999, short: "Authentic Ganesh Rudraksha bead with natural trunk formation for success & wisdom." },
  "Gauri Sankar Rudraksh": { name: "Original Gauri Shankar Rudraksha", category: "rudraksha", price: 8999, short: "Rare conjoined Gauri Shankar Rudraksha for strong relationships & family harmony." },

  // Zodiac Rashi Bracelets
  "Dhanu (धनु – Sagittarius) Braclet": { name: "Dhanu (धनु – Sagittarius) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Dhanu (Sagittarius) zodiac luck & focus." },
  "Kanya (कन्या – Virgo) Braclet": { name: "Kanya (कन्या – Virgo) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Kanya (Virgo) zodiac prosperity & clarity." },
  "Karka (कर्क – Cancer) Braclet": { name: "Karka (कर्क – Cancer) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Karka (Cancer) zodiac emotional balance & peace." },
  "Kumbh (कुंभ – Aquarius) Braclet": { name: "Kumbh (कुंभ – Aquarius) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Kumbh (Aquarius) zodiac focus & success." },
  "Makar (मकर – Capricorn) Braclet": { name: "Makar (मकर – Capricorn) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Makar (Capricorn) zodiac stability & ambition." },
  "Meen (मीन – Pisces) Braclet": { name: "Meen (मीन – Pisces) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Meen (Pisces) zodiac intuition & spiritual calm." },
  "Mesh (मेष – Aries) Braclet": { name: "Mesh (मेष – Aries) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Mesh (Aries) zodiac confidence & energy." },
  "Mithun (मिथुन – Gemini) Braclet": { name: "Mithun (मिथुन – Gemini) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Mithun (Gemini) zodiac intelligence & growth." },
  "Singh (सिंह – Leo) Braclet": { name: "Singh (सिंह – Leo) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Singh (Leo) zodiac leadership & magnetic aura." },
  "Tula (तुला – Libra) Braclet": { name: "Tula (तुला – Libra) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Tula (Libra) zodiac harmony & career success." },
  "Vrishabh (वृषभ – Taurus) Braclet": { name: "Vrishabh (वृषभ – Taurus) Rashi Bracelet", category: "zodiac-bracelet", price: 999, short: "Tailored Rashi gemstone bracelet for Vrishabh (Taurus) zodiac stability & luxury." },

  // Gemstone & Rudraksha Bracelets
  "4. Money Magnet": { name: "Money Magnet Bracelet (Pyrite & Citrine)", category: "crystal-bracelet", price: 999, short: "Attract wealth, prosperity, and financial growth with natural pyrite & citrine." },
  "7 Chakra Braclet": { name: "7 Chakra Healing Crystal Bracelet", category: "crystal-bracelet", price: 899, short: "Natural 7 Chakra gemstone bracelet for energy alignment and inner peace." },
  "Amethyst Bracelet": { name: "Natural Amethyst Healing Bracelet", category: "crystal-bracelet", price: 999, short: "Natural Amethyst crystal bracelet for stress relief, deep calm, and intuition." },
  "Gold Rudraksh Bracelet": { name: "Gold Capped Rudraksha Bracelet", category: "crystal-bracelet", price: 999, short: "Premium Rudraksha bracelet with elegant gold-tone capping for spiritual luxury." },
  "Piride Braclet": { name: "Natural Pyrite Wealth Bracelet", category: "crystal-bracelet", price: 999, short: "Natural Pyrite (Fool's Gold) crystal bracelet for money magnet & career luck." },
  "Rose Quartz Close": { name: "Natural Rose Quartz Crystal Bracelet", category: "crystal-bracelet", price: 899, short: "Natural Rose Quartz crystal bracelet for love, emotional healing & self-care." },
  "Tiger Eye Loose Big": { name: "Natural Tiger Eye Protection Bracelet", category: "crystal-bracelet", price: 999, short: "Natural Tiger Eye gemstone bracelet for courage, grounding & shielding negative energy." },

  // Jaap Malas & Sacred Beads
  "Karungali mala": { name: "Natural Karungali Ebony Wood Mala (108 Beads)", category: "mala", price: 999, short: "Authentic Karungali (Ebony wood) 108 bead mala for positive energy & protection." },
  "Karungali Rudraksh Silver Cap Mala": { name: "Karungali Rudraksha Silver Cap Mala", category: "mala", price: 999, short: "Combination Karungali wood and Rudraksha mala with pure silver cap finish." },
  "Nepali Rudrakasha Mala Close for wearing": { name: "5 Mukhi Nepali Rudraksha Mala (108 Beads)", category: "mala", price: 999, short: "Original 5 Mukhi Nepali Rudraksha 108 bead mala for jaap and daily wearing." },
  "Rudraksh Jap Mala": { name: "Original Rudraksha Jaap Mala (108 Beads)", category: "mala", price: 999, short: "Traditional 108 bead Rudraksha jaap mala for daily chanting, meditation & sadhana." },
  "Rudraksh Silver Cap Mala": { name: "Rudraksha Silver Capped Mala", category: "mala", price: 2199, short: "Premium 5 Mukhi Rudraksha mala elegantly strung with silver caps." },
  "Rudraksha Mala 10mm 54 Beads": { name: "Rudraksha Mala (10mm, 54 Beads)", category: "mala", price: 899, short: "Compact 10mm 54 bead Rudraksha mala ideal for quick jaap & comfortable wearing." },
  "Spatik Mala": { name: "Natural Sphatik (Quartz Crystal) Mala", category: "mala", price: 3999, short: "Original Sphatik crystal 108 bead mala for cooling energy, mental clarity & jaap." },
  "Tulsi Jap Mala": { name: "Original Tulsi Jaap Mala", category: "mala", price: 899, short: "Pure sacred Tulsi wood jaap mala for Vishnu bhakti, peace & daily chanting." },
  "Tulsi Mala": { name: "Natural Tulsi Bead Mala (108 Beads)", category: "mala", price: 999, short: "Natural sacred Tulsi wood 108 bead mala for spiritual purity and protection." },

  // Feng Shui & Crystal Trees
  "7 Chakra Tree": { name: "7 Chakra Crystal Gemstone Tree", category: "gemstone-tree", price: 999, short: "Handcrafted 7 Chakra crystal tree for positive home energy & Vastu harmony." },
  "Rose Quartz Tree": { name: "Rose Quartz Healing Gemstone Tree", category: "gemstone-tree", price: 999, short: "Handcrafted Rose Quartz crystal tree for harmony, warmth & positive Vastu vibes." }
};

const folders = fs.readdirSync(productsBaseDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== 'Broll and Shoots')
  .map(d => d.name);

console.log(`Processing ${folders.length} product folders into 5 custom categories...`);

const productsList = [];

folders.forEach((folderName, idx) => {
  const folderPath = path.join(productsBaseDir, folderName);
  let files = fs.readdirSync(folderPath)
    .filter(f => !f.startsWith('.') && !f.endsWith('.mp4') && !f.endsWith('.MOV'));

  // Handle empty folders (35 & 36 fallback)
  if (files.length === 0) {
    if (folderName.includes('Silver Cap')) {
      const fallbackFolder = path.join(productsBaseDir, 'Karungali Rudraksh Silver Cap Mala');
      files = fs.readdirSync(fallbackFolder).filter(f => !f.startsWith('.'));
      files = files.map(f => path.join('..', 'Karungali Rudraksh Silver Cap Mala', f));
    } else {
      const fallbackFolder = path.join(productsBaseDir, 'Nepali Rudrakasha Mala Close for wearing');
      files = fs.readdirSync(fallbackFolder).filter(f => !f.startsWith('.'));
      files = files.map(f => path.join('..', 'Nepali Rudrakasha Mala Close for wearing', f));
    }
  }

  // Convert files to resolved info objects
  const resolvedFiles = files.map(f => {
    const fullPath = f.startsWith('..')
      ? path.resolve(productsBaseDir, folderName, f)
      : path.join(folderPath, f);
    return {
      name: path.basename(f),
      fullPath,
      url: sanitizeUrlPath(fullPath)
    };
  });

  // Keep only images
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  const imageFiles = resolvedFiles.filter(rf => {
    const ext = path.extname(rf.name).toLowerCase();
    return imageExtensions.includes(ext);
  });

  // Helper to identify certificates
  function isCertificate(name) {
    const fn = name.toLowerCase();
    return fn.includes('cert') || fn.includes('lab') || fn.includes('report') || fn.includes('authent') || fn.includes('quality') || fn.includes('verify');
  }

  const certFiles = imageFiles.filter(rf => isCertificate(rf.name));
  const productFiles = imageFiles.filter(rf => !isCertificate(rf.name));

  // Sort product files numerically (e.g. 1.png, 2.jpg, 3.webp)
  productFiles.sort((a, b) => {
    const aNum = parseInt(a.name, 10);
    const bNum = parseInt(b.name, 10);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  // Build the images array (minimum 2, maximum 4, no duplicates)
  let images = [];
  if (certFiles.length > 0) {
    // If certificate is available, reserve 1 slot for it and take up to 3 product photos
    const selectedProducts = productFiles.slice(0, 3);
    const certFile = certFiles[0];
    images = [...selectedProducts, certFile].map(f => f.url);
  } else {
    // Take up to 4 product photos
    const selectedProducts = productFiles.slice(0, 4);
    images = selectedProducts.map(f => f.url);
  }

  const productSlug = slugify(folderName);
  const productId = `vv_p${String(idx + 1).padStart(2, '0')}`;

  const meta = FOLDER_METADATA[folderName] || {
    name: folderName,
    category: "rudraksha",
    price: 999,
    short: "Authentic spiritual product from Ved Vigyan."
  };

  let zodiacSigns = [];
  if (meta.category === 'zodiac-bracelet') {
    const zodiacMatch = meta.name.match(/–\s*([a-zA-Z]+)\)/) || meta.name.match(/\(\s*([a-zA-Z]+)\s*–/);
    if (zodiacMatch) {
      zodiacSigns = [zodiacMatch[1]];
    }
  }

  productsList.push({
    id: productId,
    category: meta.category,
    slug: productSlug,
    name: meta.name,
    price: meta.price,
    tags: [meta.category, "authentic", "vedic"],
    image: images[0],
    imageAlt: `${meta.name} - Authentic Ved Vigyan Original Product`,
    images,
    short: meta.short,
    description: `${meta.name} is an authentic spiritual item carefully sourced and verified by Ved Vigyan. Each piece is energized following Vedic traditions to provide peace, balance, and positive energy for daily wear and ritual practice.`,
    bullets: [
      "100% Authentic natural product with laboratory certificate",
      "Energized according to traditional Vedic rituals",
      "Includes authenticity test certificate & usage guide"
    ],
    seoTitle: `${meta.name} - Buy Original Online | Ved Vigyan`,
    seoDescription: `Shop original ${meta.name} online at Ved Vigyan. Comes with lab certificate, free spiritual guidance, and fast delivery across India.`,
    url: `/product/detail.html?id=${productId}`,
    ...(zodiacSigns.length > 0 ? { zodiacSigns } : {})
  });
});

console.log(`Successfully processed all ${productsList.length} products into 5 categories.`);

const dataJsContent = `// Auto-generated 43-product Ved Vigyan Catalog Data with 5 Dedicated Categories
function deriveMerchandising(products) {
  return products.map((product, index) => {
    const discountPercent = 18 + ((index * 7) % 23);
    const ratingValue = 4.2 + (((index * 13) % 8) / 10);
    const rating = Math.min(5.0, Number(ratingValue.toFixed(1)));
    const originalPrice = product.price > 0
      ? Math.round(product.price / (1 - discountPercent / 100))
      : 0;

    return {
      ...product,
      discountPercent,
      originalPrice,
      rating
    };
  });
}

window.VED_VIGYAN_DATA = {
  store: {
    name: "Ved Vigyan",
    phone: "+91 7900811101",
    email: "Vedvigyanindia@gmail.com",
    address: "Dehradun, Uttarakhand, India - 248002"
  },
  categories: [
    { id: "all", label: "All Products (43)" },
    { id: "rudraksha", label: "Rudraksha Beads (14)" },
    { id: "zodiac-bracelet", label: "Zodiac Rashi Bracelets (11)" },
    { id: "crystal-bracelet", label: "Gemstone & Crystal Bracelets (7)" },
    { id: "mala", label: "Jaap Malas & Sacred Strings (9)" },
    { id: "gemstone-tree", label: "Crystal & Gemstone Trees (2)" }
  ],
  products: deriveMerchandising(${JSON.stringify(productsList, null, 2)})
};
`;

fs.writeFileSync(dataJsPath, dataJsContent);
console.log(`Updated data.js with ${productsList.length} products in 5 custom categories!`);

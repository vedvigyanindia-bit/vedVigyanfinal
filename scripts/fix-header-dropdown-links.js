const fs = require('fs');
const path = require('path');

// Target HTML markup for mega menu dropdowns in index.html & static files
const headerDropdownMarkup = `
        <!-- 1. Rudraksha Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="rudraksha">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Rudraksha <svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/rudraksha.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="All Rudraksha" loading="lazy" />
                </div>
                <div class="vv-card-item__title">All Rudraksha</div>
                <div class="vv-card-item__sub">14 authentic mukhi beads</div>
              </a>
              <a class="vv-card-item" href="/products/5-mukhi-rudraksh">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="5 Mukhi" loading="lazy" />
                </div>
                <div class="vv-card-item__title">5 Mukhi</div>
                <div class="vv-card-item__sub">Bestseller for daily wear</div>
              </a>
              <a class="vv-card-item" href="/products/7-mukhi-rudraksh">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="7 Mukhi" loading="lazy" />
                </div>
                <div class="vv-card-item__title">7 Mukhi</div>
                <div class="vv-card-item__sub">Wealth &amp; abundance</div>
              </a>
              <a class="vv-card-item" href="/products/gauri-sankar-rudraksh">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Gauri Sankar Rudraksh/1.webp" alt="Gauri Shankar" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Gauri Shankar</div>
                <div class="vv-card-item__sub">Relationship harmony</div>
              </a>
            </div>
          </div>
        </div>

        <!-- 2. Bracelets Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="bracelets">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Bracelets <svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/products/gold-rudraksh-bracelet">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp" alt="Gold Rudraksha Bracelet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Gold Rudraksha</div>
                <div class="vv-card-item__sub">Original gold capped</div>
              </a>
              <a class="vv-card-item" href="/products/money-magnet-bracelet-pyrite-citrine">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Money Magnet</div>
                <div class="vv-card-item__sub">Wealth &amp; prosperity</div>
              </a>
              <a class="vv-card-item" href="/products/amethyst-bracelet">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Amethyst Bracelet/1.webp" alt="Amethyst Bracelet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Amethyst Bracelet</div>
                <div class="vv-card-item__sub">Peace &amp; mental calm</div>
              </a>
              <a class="vv-card-item" href="/products/tiger-eye-loose-big">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Tiger Eye Loose Big/1.webp" alt="Tiger Eye" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Tiger Eye</div>
                <div class="vv-card-item__sub">Courage &amp; confidence</div>
              </a>
            </div>
          </div>
        </div>

        <!-- 3. Crystals Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="crystals">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Crystals <svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/gem-stone.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Amethyst Bracelet/1.webp" alt="Crystal Bracelets" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Crystal Bracelets</div>
                <div class="vv-card-item__sub">Natural healing gems</div>
              </a>
              <a class="vv-card-item" href="/products/7-chakra-tree">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="7 Chakra Tree" loading="lazy" />
                </div>
                <div class="vv-card-item__title">7 Chakra Tree</div>
                <div class="vv-card-item__sub">Vastu energy balancer</div>
              </a>
              <a class="vv-card-item" href="/products/rose-quartz-tree">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Rose Quartz Tree/1.webp" alt="Rose Quartz Tree" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Rose Quartz Tree</div>
                <div class="vv-card-item__sub">Love &amp; emotional harmony</div>
              </a>
              <a class="vv-card-item" href="/products/piride-braclet">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Piride Braclet/1.webp" alt="Pyrite Bracelet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Pyrite Bracelet</div>
                <div class="vv-card-item__sub">Money &amp; protection</div>
              </a>
            </div>
          </div>
        </div>

        <!-- 4. Malas Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="malas">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Malas <svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/products/5-mukhi-nepali-rudraksha-mala-108-beads">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/1.webp" alt="5 Mukhi Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">5 Mukhi Mala</div>
                <div class="vv-card-item__sub">108 authentic beads</div>
              </a>
              <a class="vv-card-item" href="/products/karungali-rudraksh-silver-cap-mala">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Karungali Rudraksh Silver Cap Mala/1.webp" alt="Karungali Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Karungali Mala</div>
                <div class="vv-card-item__sub">Ebony wood protection</div>
              </a>
              <a class="vv-card-item" href="/products/tulsi-mala">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Tulsi Mala/1.webp" alt="Tulsi Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Tulsi Mala</div>
                <div class="vv-card-item__sub">Sacred Vishnu jaap mala</div>
              </a>
              <a class="vv-card-item" href="/products/spatik-mala">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Spatik Mala/1.webp" alt="Spatik Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Spatik Mala</div>
                <div class="vv-card-item__sub">Cooling crystal jaap mala</div>
              </a>
            </div>
          </div>
        </div>

        <!-- 5. Best Sellers Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="bestsellers">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Best Sellers <svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/products/5-mukhi-rudraksh">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="5 Mukhi Rudraksha" loading="lazy" />
                </div>
                <div class="vv-card-item__title">5 Mukhi Rudraksha</div>
                <div class="vv-card-item__sub">Top rated Nepali bead</div>
              </a>
              <a class="vv-card-item" href="/products/money-magnet-bracelet-pyrite-citrine">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Money Magnet</div>
                <div class="vv-card-item__sub">#1 selling bracelet</div>
              </a>
              <a class="vv-card-item" href="/products/7-chakra-tree">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="7 Chakra Tree" loading="lazy" />
                </div>
                <div class="vv-card-item__title">7 Chakra Tree</div>
                <div class="vv-card-item__sub">Vastu bestseller</div>
              </a>
              <a class="vv-card-item" href="/collections/zodiac-bracelet">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp" alt="Rashi Bracelets" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Rashi Bracelets</div>
                <div class="vv-card-item__sub">Personalized zodiac</div>
              </a>
            </div>
          </div>
        </div>

        <!-- 6. Shop All Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="shopall">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Shop All <svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/rudraksha.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="All Rudraksha" loading="lazy" />
                </div>
                <div class="vv-card-item__title">All Rudraksha</div>
                <div class="vv-card-item__sub">1 to 14 Mukhi beads</div>
              </a>
              <a class="vv-card-item" href="/mala.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/1.webp" alt="All Malas" loading="lazy" />
                </div>
                <div class="vv-card-item__title">All Malas</div>
                <div class="vv-card-item__sub">Sacred 108 jaap malas</div>
              </a>
              <a class="vv-card-item" href="/collections/zodiac-bracelet">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Amethyst Bracelet/1.webp" alt="All Bracelets" loading="lazy" />
                </div>
                <div class="vv-card-item__title">All Bracelets</div>
                <div class="vv-card-item__sub">Rudraksha &amp; Crystals</div>
              </a>
              <a class="vv-card-item" href="/gem-stone.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="All Crystals" loading="lazy" />
                </div>
                <div class="vv-card-item__title">All Crystals</div>
                <div class="vv-card-item__sub">Vastu trees &amp; gems</div>
              </a>
            </div>
          </div>
        </div>`;

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const frontendDir = path.join(__dirname, '..', 'frontend');
const htmlFiles = walkDir(frontendDir);

// 1. Update all HTML files that contain the mega menu nav
const megaRegex = /<!--\s*1\.\s*Rudraksha Card Dropdown\s*-->[\s\S]*?<!--\s*6\.\s*Shop All Card Dropdown\s*-->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;

let htmlCount = 0;
htmlFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('data-mega="rudraksha"')) {
    content = content.replace(megaRegex, headerDropdownMarkup.trim());
    fs.writeFileSync(file, content, 'utf8');
    htmlCount++;
  }
});

console.log(`Updated mega header dropdown links in ${htmlCount} HTML files`);

// 2. Also update lux-shell.js
const luxShellPath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'lux-shell.js');
let luxShellContent = fs.readFileSync(luxShellPath, 'utf8');

// Update lux-shell.js mega items
luxShellContent = luxShellContent.replace(
  /href="\/rudraksha\/5-mukhi\.html"/g,
  'href="/products/5-mukhi-rudraksh"'
).replace(
  /href="\/rudraksha\/7-mukhi\.html"/g,
  'href="/products/7-mukhi-rudraksh"'
).replace(
  /href="\/products\/gauri-sankar-rudraksh"\s+([^>]*>[\s\S]*?<b>Money Magnet<\/b>)/g,
  'href="/products/money-magnet-bracelet-pyrite-citrine" $1'
).replace(
  /href="\/gem-stone\/amethyst-bracelet\.html"/g,
  'href="/products/amethyst-bracelet"'
).replace(
  /href="\/gem-stone\/tiger-eye-bracelet\.html"/g,
  'href="/products/tiger-eye-loose-big"'
).replace(
  /href="\/rudraksha-mala\/5-mukhi-mala-108\.html"/g,
  'href="/products/5-mukhi-nepali-rudraksha-mala-108-beads"'
).replace(
  /href="\/products\/karka-cancer-braclet"/g,
  'href="/products/karungali-rudraksh-silver-cap-mala"'
).replace(
  /href="\/products\/tula-libra-braclet"/g,
  'href="/products/tulsi-mala"'
);

fs.writeFileSync(luxShellPath, luxShellContent, 'utf8');
console.log('Updated lux-shell.js header dropdown links');

// Re-generate static product pages so all frontend/products/*.html files get the exact updated header
require('./generate-static-product-pages.js');

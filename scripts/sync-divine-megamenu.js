const fs = require("fs");
const path = require("path");

const FRONTEND = path.join(__dirname, "..", "frontend");

const NAV_CHEVRON = `<svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" /></svg>`;

const DIVINE_MEGA_NAVLINKS = `
      <nav class="lux-navlinks" aria-label="Primary">
        <a class="lux-nav-link" href="/index.html">Home</a>

        <!-- 1. Rudraksha Card Dropdown -->
        <div class="lux-mega-wrap" data-mega="rudraksha">
          <button class="lux-mega-trigger" type="button" aria-expanded="false">
            Rudraksha ${NAV_CHEVRON}
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
              <a class="vv-card-item" href="/rudraksha/5-mukhi.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="5 Mukhi" loading="lazy" />
                </div>
                <div class="vv-card-item__title">5 Mukhi</div>
                <div class="vv-card-item__sub">Bestseller for daily wear</div>
              </a>
              <a class="vv-card-item" href="/rudraksha/7-mukhi.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="7 Mukhi" loading="lazy" />
                </div>
                <div class="vv-card-item__title">7 Mukhi</div>
                <div class="vv-card-item__sub">Wealth &amp; abundance</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p19">
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
            Bracelets ${NAV_CHEVRON}
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/product/detail.html?id=vv_p21">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp" alt="Gold Rudraksha Bracelet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Gold Rudraksha</div>
                <div class="vv-card-item__sub">Original gold capped</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p07">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Money Magnet</div>
                <div class="vv-card-item__sub">Wealth &amp; prosperity</div>
              </a>
              <a class="vv-card-item" href="/gem-stone/amethyst-bracelet.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Amethyst Bracelet/1.webp" alt="Amethyst Bracelet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Amethyst Bracelet</div>
                <div class="vv-card-item__sub">Peace &amp; mental calm</div>
              </a>
              <a class="vv-card-item" href="/gem-stone/tiger-eye-bracelet.html">
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
            Crystals ${NAV_CHEVRON}
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
              <a class="vv-card-item" href="/product/detail.html?id=vv_p12">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="7 Chakra Tree" loading="lazy" />
                </div>
                <div class="vv-card-item__title">7 Chakra Tree</div>
                <div class="vv-card-item__sub">Vastu energy balancer</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p13">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Rose Quartz Tree/1.webp" alt="Rose Quartz Tree" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Rose Quartz Tree</div>
                <div class="vv-card-item__sub">Love &amp; emotional harmony</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p15">
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
            Malas ${NAV_CHEVRON}
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/rudraksha-mala/5-mukhi-mala-108.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Nepali Rudrakasha Mala Close for wearing/1.webp" alt="5 Mukhi Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">5 Mukhi Mala</div>
                <div class="vv-card-item__sub">108 authentic beads</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p25">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Karungali Rudraksh Silver Cap Mala/1.webp" alt="Karungali Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Karungali Mala</div>
                <div class="vv-card-item__sub">Ebony wood protection</div>
              </a>
              <a class="vv-card-item" href="/mala/tulsi-mala.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/Tulsi Mala/1.webp" alt="Tulsi Mala" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Tulsi Mala</div>
                <div class="vv-card-item__sub">Sacred Vishnu jaap mala</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p38">
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
            Best Sellers ${NAV_CHEVRON}
          </button>
          <div class="vv-card-dropdown">
            <div class="vv-card-dropdown__grid">
              <a class="vv-card-item" href="/rudraksha/5-mukhi.html">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="5 Mukhi Rudraksha" loading="lazy" />
                </div>
                <div class="vv-card-item__title">5 Mukhi Rudraksha</div>
                <div class="vv-card-item__sub">Top rated Nepali bead</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p07">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet" loading="lazy" />
                </div>
                <div class="vv-card-item__title">Money Magnet</div>
                <div class="vv-card-item__sub">#1 selling bracelet</div>
              </a>
              <a class="vv-card-item" href="/product/detail.html?id=vv_p12">
                <div class="vv-card-item__img">
                  <img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="7 Chakra Tree" loading="lazy" />
                </div>
                <div class="vv-card-item__title">7 Chakra Tree</div>
                <div class="vv-card-item__sub">Vastu bestseller</div>
              </a>
              <a class="vv-card-item" href="/shop.html?cat=zodiac-bracelet">
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
            Shop All ${NAV_CHEVRON}
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
              <a class="vv-card-item" href="/shop.html?cat=zodiac-bracelet">
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
        </div>
      </nav>
`;

function replaceNavSection(html) {
  return html.replace(/<nav class="lux-navlinks" aria-label="Primary">[\s\S]*?<\/nav>/i, DIVINE_MEGA_NAVLINKS);
}

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html") && entry.name !== "_partials.html") files.push(full);
  }
  return files;
}

const files = walkHtml(FRONTEND);
let updatedCount = 0;

for (const file of files) {
  const rel = path.relative(FRONTEND, file).replace(/\\/g, "/");
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes('<nav class="lux-navlinks"')) continue;

  const updatedContent = replaceNavSection(content);
  if (updatedContent !== content) {
    fs.writeFileSync(file, updatedContent, "utf8");
    console.log(`Restored original Header Nav in: ${rel}`);
    updatedCount++;
  }
}

console.log(`Successfully restored original Header Nav in ${updatedCount} HTML files.`);

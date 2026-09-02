const fs = require('fs');
const path = require('path');

const pdpFiles = [
  'frontend/product/detail.html',
  'frontend/rudraksha/5-mukhi.html',
  'frontend/rudraksha/7-mukhi.html',
  'frontend/rudraksha/product.html',
  'frontend/rudraksha-mala/5-mukhi-mala-108.html',
  'frontend/gem-stone/amethyst-bracelet.html',
  'frontend/gem-stone/tiger-eye-bracelet.html',
  'frontend/mala/tulsi-mala.html',
  'frontend/bracelet/product.html',
  'frontend/bracelet/rudraksha-bracelet.html',
  'frontend/puja-items/gangajal.html',
  'frontend/puja-items/product.html'
];

const newGridHtml = `        <!-- Divine Hindu PDP Layout -->
        <div class="pdp-grid">
          <div>
            <div class="lux-pdp-gallery lux-reveal" id="pdpGallery">
              <img id="productImg" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect width='100%25' height='100%25' fill='%23f9f6f0'/%3E%3C/svg%3E" alt="Product" width="600" height="600" />
            </div>

            <!-- Download Certificate Box under Gallery -->
            <div class="pdp-cert-box">
              <div class="pdp-cert-left">
                <img src="https://cdn.shopify.com/s/files/1/0790/4988/3955/files/image_325.png?v=1771487474" alt="certified by DRGTL" width="40" height="22">
                <span>certified by DRGTL</span>
              </div>
              <a id="pdpCertDownloadBtn" href="/product/Ved vigyan products/5 Mukhi Rudraksh/3.webp" target="_blank" download class="pdp-cert-download-btn">Download Certificate</a>
            </div>
          </div>

          <div class="pdp-info lux-reveal">
            <h1 class="pdp-title" id="productTitle">Loading…</h1>

            <div class="pdp-feats-row">
              <div class="pdp-feats">
                <span class="pdp-pill">Natural Stone</span>
                <span class="pdp-pill">Lab Certified</span>
                <span class="pdp-pill">100% Made in India</span>
              </div>
            </div>

            <div class="pdp-rating" id="pdpRating">
              <!-- Rendered dynamically by JS -->
            </div>

            <div class="pdp-priceline">
              <div class="pdp-price" id="productPrice">
                <!-- Rendered dynamically by JS -->
              </div>
              <a class="pdp-viewoffers" href="#pdp-offers">View Offers</a>
            </div>
            <div class="pdp-tax">(Inclusive of all taxes)</div>

            <div class="pdp-count" id="pdpCountTimer">
              Offer ends in <span data-count-h>23</span> hr : <span data-count-m>26</span> min : <span data-count-s>55</span> sec
            </div>

            <div class="pdp-qtyrow">
              <span class="lbl">Quantity</span>
              <span class="pdp-qty">
                <button type="button" id="pdpQtyDec" aria-label="Decrease">-</button>
                <input type="number" id="pdpQtyInput" value="1" min="1" aria-label="Quantity">
                <button type="button" id="pdpQtyInc" aria-label="Increase">+</button>
              </span>
            </div>

            <div class="pdp-siddhi" id="pdpSiddhiBox">
              <label for="siddhiChk" style="display:flex; align-items:flex-start; gap:12px; cursor:pointer;">
                <input type="checkbox" id="siddhiChk" style="width:18px; height:18px; margin-top:2px; accent-color:#8a1a23;">
                <div>
                  <strong style="display:block; color:#1a1a1a; font-size:13.5px; font-weight:700;">Get Siddhi · Pran Pratishtha · Energised</strong>
                  <span style="display:block; color:#666; font-size:12px; margin-top:2px;">Sacred energization for your product — from ₹101</span>
                </div>
              </label>
            </div>

            <div class="pdp-review-slider-wrap" id="pdpReviewCardWidget">
              <button type="button" class="pdp-rev-nav prev" id="pdpRevPrevBtn" onclick="window.changePDPReview(-1)" aria-label="Previous review">&lsaquo;</button>
              <div class="pdp-review-card">
                <div class="pdp-rev-avatar" id="pdpRevAvatar">★</div>
                <div class="pdp-rev-body" style="width: 100%;">
                  <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div>
                      <strong id="pdpRevName">Verified Customer</strong>
                      <span class="v-badge">✓ Verified</span>
                    </div>
                    <span class="pdp-rev-counter" id="pdpRevCounter" style="font-size:11px; color:#6b46c1; font-weight:700;">1 / 8</span>
                  </div>
                  <div class="pdp-rev-stars" id="pdpRevStars">★★★★★</div>
                  <p class="pdp-rev-text" id="pdpRevText">Authentic product with official lab test certificate included.</p>
                </div>
              </div>
              <button type="button" class="pdp-rev-nav next" id="pdpRevNextBtn" onclick="window.changePDPReview(1)" aria-label="Next review">&rsaquo;</button>
            </div>

            <div class="pdp-main-btns">
              <button class="pdp-btn-atc" id="addToCartBtn" type="button">Add to Cart</button>
              <button class="pdp-btn-buynow" id="buyNowBtn" type="button">Buy Now</button>
            </div>

            <div class="pdp-trust-bar">
              <span>🔒 Secure UPI · Cards · COD</span>
              <span>🧪 Govt. Lab Certified</span>
              <span>🚚 Free Shipping</span>
            </div>
          </div>
        </div>`;

const scriptsHtml = `
  <!-- Scripts -->
  <script src="/public/js/cart.js"></script>
  <script src="/public/js/wishlist.js"></script>
  <script src="/public/js/lux.js"></script>
  <script src="/public/js/product.js"></script>
</body>`;

pdpFiles.forEach((relPath) => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace any existing product layout container (product-layout, grid detail-grid, lux-pdp-grid, pdp-grid, etc.)
  const regexes = [
    /<!-- SECTION 2 & 3: GALLERY \+ INTRO[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
    /<div class="product-layout"[\s\S]*?<\/div>\s*<\/div>/i,
    /<div class="(?:lux-pdp-grid|pdp-grid|grid detail-grid)"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
    /<div class="product-layout">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i
  ];

  let replaced = false;
  for (const reg of regexes) {
    if (reg.test(content)) {
      content = content.replace(reg, newGridHtml);
      replaced = true;
      break;
    }
  }

  // Ensure script tags at bottom
  if (!content.includes('src="/public/js/product.js"')) {
    content = content.replace(/<\/body>/i, scriptsHtml);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${relPath} (replaced: ${replaced})`);
});

const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const newCardsHtml = `<!-- Reel Card 3: Natural Karungali Ebony Wood Mala Reel -->
              <div class="vv-reel-card">
                <div class="vv-reel-video-wrap" data-vv-video="/public/videos/karungali-mala.mp4">
                  <img src="/product/Ved vigyan products/Karungali mala/1.webp" alt="Natural Karungali Ebony Wood Mala Reel Video" loading="lazy" />
                  <div class="vv-reel-play-overlay">
                    <div class="vv-reel-play-icon">▶</div>
                  </div>
                  <div class="vv-reel-meta-overlay">
                    <span class="vv-reel-views">👁 32.8K Views</span>
                    <button class="vv-reel-heart-btn" type="button" aria-label="Like reel">♥ 2.9K</button>
                  </div>
                </div>
                <div class="vv-reel-product-card">
                  <div class="vv-reel-prod-info">
                    <img src="/product/Ved vigyan products/Karungali mala/1.webp" alt="Natural Karungali Ebony Wood Mala" class="vv-reel-prod-thumb" />
                    <div class="vv-reel-prod-text">
                      <h4 class="vv-reel-prod-title">Natural Karungali Ebony Wood Mala</h4>
                      <div class="vv-reel-prod-price">
                        <span class="sale">₹999</span>
                        <span class="mrp">₹1,218</span>
                      </div>
                    </div>
                  </div>
                  <button class="vv-reel-buy-btn" type="button" data-buy-now="vv_p24">Buy Now</button>
                </div>
              </div>

              <!-- Reel Card 4: Money Magnet Bracelet Reel -->
              <div class="vv-reel-card">
                <div class="vv-reel-video-wrap" data-vv-video="/public/videos/money-magnet-bracelet.mp4">
                  <img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet Bracelet Reel Video" loading="lazy" />
                  <div class="vv-reel-play-overlay">
                    <div class="vv-reel-play-icon">▶</div>
                  </div>
                  <div class="vv-reel-meta-overlay">
                    <span class="vv-reel-views">👁 28.4K Views</span>
                    <button class="vv-reel-heart-btn" type="button" aria-label="Like reel">♥ 2.6K</button>
                  </div>
                </div>
                <div class="vv-reel-product-card">
                  <div class="vv-reel-prod-info">
                    <img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet Bracelet" class="vv-reel-prod-thumb" />
                    <div class="vv-reel-prod-text">
                      <h4 class="vv-reel-prod-title">Money Magnet Bracelet</h4>
                      <div class="vv-reel-prod-price">
                        <span class="sale">₹699</span>
                        <span class="mrp">₹1,799</span>
                      </div>
                    </div>
                  </div>
                  <button class="vv-reel-buy-btn" type="button" data-buy-now="vv_p20">Buy Now</button>
                </div>
              </div>

              <!-- Reel Card 5: Natural Tulsi Bead Mala (108 Beads) Reel -->
              <div class="vv-reel-card">
                <div class="vv-reel-video-wrap" data-vv-video="/public/videos/tulsi-mala-108.mp4">
                  <img src="/product/Ved vigyan products/Tulsi Mala/1.webp" alt="Natural Tulsi Bead Mala Reel Video" loading="lazy" />
                  <div class="vv-reel-play-overlay">
                    <div class="vv-reel-play-icon">▶</div>
                  </div>
                  <div class="vv-reel-meta-overlay">
                    <span class="vv-reel-views">👁 36.5K Views</span>
                    <button class="vv-reel-heart-btn" type="button" aria-label="Like reel">♥ 3.1K</button>
                  </div>
                </div>
                <div class="vv-reel-product-card">
                  <div class="vv-reel-prod-info">
                    <img src="/product/Ved vigyan products/Tulsi Mala/1.webp" alt="Natural Tulsi Bead Mala (108 Beads)" class="vv-reel-prod-thumb" />
                    <div class="vv-reel-prod-text">
                      <h4 class="vv-reel-prod-title">Natural Tulsi Bead Mala (108 Beads)</h4>
                      <div class="vv-reel-prod-price">
                        <span class="sale">₹999</span>
                        <span class="mrp">₹1,491</span>
                      </div>
                    </div>
                  </div>
                  <button class="vv-reel-buy-btn" type="button" data-buy-now="vv_p42">Buy Now</button>
                </div>
              </div>`;

const files = walk(path.join(__dirname, '..', 'frontend'));
let modifiedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('7 Chakra Tree Reel Video') && !content.includes('7 Chakra Tree')) {
    return;
  }

  // Find start of Card 3
  const card3Index = content.indexOf('<!-- Reel Card 3');
  if (card3Index === -1) {
    return;
  }

  // Find closing </div> of Card 5 which is right before \s*</div>\s*<button class="vv-reel-nav-btn next"
  const trackEndMatch = content.slice(card3Index).match(/<\/div>\s*\n\s*<\/div>\s*<button class="vv-reel-nav-btn next"/);
  if (!trackEndMatch) {
    console.log('Track end not found in:', filePath);
    return;
  }

  const replaceLength = trackEndMatch.index + 6; // consumes the closing </div> of Card 5
  const before = content.slice(0, card3Index);
  const after = content.slice(card3Index + replaceLength);

  const updated = before + newCardsHtml + after;
  fs.writeFileSync(filePath, updated, 'utf8');
  modifiedCount++;
});

console.log(`Successfully updated ${modifiedCount} HTML files!`);

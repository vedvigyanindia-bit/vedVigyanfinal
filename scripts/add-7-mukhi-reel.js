const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const cardHtml = `<!-- Reel Card: 7 Mukhi Nepali Rudraksha Reel -->
            <div class="vv-reel-card">
              <div class="vv-reel-video-wrap" data-vv-video="/public/videos/7-mukhi-nepali-rudraksha.mp4">
                <img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="7 Mukhi Nepali Rudraksha Reel Video" loading="lazy" />
                <div class="vv-reel-play-overlay">
                  <div class="vv-reel-play-icon">▶</div>
                </div>
                <div class="vv-reel-meta-overlay">
                  <span class="vv-reel-views">👁 21.8K Views</span>
                  <button class="vv-reel-heart-btn" type="button" aria-label="Like reel">♥ 2.1K</button>
                </div>
              </div>
              <div class="vv-reel-product-card">
                <div class="vv-reel-prod-info">
                  <img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="7 Mukhi Rudraksha (Sapta Mukhi)" class="vv-reel-prod-thumb" />
                  <div class="vv-reel-prod-text">
                    <h4 class="vv-reel-prod-title">7 Mukhi Rudraksha (Sapta Mukhi)</h4>
                    <div class="vv-reel-prod-price">
                      <span class="sale">₹999</span>
                      <span class="mrp">₹1,491</span>
                    </div>
                  </div>
                </div>
                <button class="vv-reel-buy-btn" type="button" data-buy-now="vv_p13">Buy Now</button>
              </div>
            </div>

            `;

const frontendDir = path.join(__dirname, '..', 'frontend');
const allHtmls = walk(frontendDir);
let updatedCount = 0;

allHtmls.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('vv-reel-track')) return;
  if (content.includes('7-mukhi-nepali-rudraksha.mp4')) return;

  const target = '<!-- Reel Card 2: Karungali Rudraksha Silver Cap Mala Reel -->';
  if (content.includes(target)) {
    content = content.replace(target, cardHtml + target);
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  } else {
    // If target not found, insert right after <div class="vv-reel-track">
    const match = content.match(/<div class="vv-reel-track">([\s\S]*?)<\/div>/i);
    if (match) {
      const idx = content.indexOf('<div class="vv-reel-track">') + '<div class="vv-reel-track">'.length;
      content = content.slice(0, idx) + '\n            ' + cardHtml + content.slice(idx);
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
    }
  }
});

console.log(`Successfully added 7 Mukhi Nepali Rudraksha reel to ${updatedCount} HTML files.`);

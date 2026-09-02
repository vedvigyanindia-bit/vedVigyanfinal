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

const journeySectionHtml = `
        <!-- SECTION 7: 3-Step Journey -->
        <section class="vv-journey-section lux-reveal">
          <div class="lux-section-head">
            <div class="lux-section-kicker">Transparent Sourcing</div>
            <h2 class="lux-section-title">The 3-Step Sacred Journey</h2>
          </div>
          <div class="vv-journey-grid">
            <div class="vv-journey-card">
              <div class="vv-journey-img-wrap">
                <img src="/public/images/himalayan-sourcing-step1.jpg"
                  alt="Himalayan Sourcing - Pure Origin Sacred Beginning" />
              </div>
              <span class="vv-journey-step-badge">STEP 1</span>
              <h4>1. Himalayan Sourcing</h4>
              <p>Harvested from sacred forests in high-altitude Himalayan regions.</p>
            </div>
            <div class="vv-journey-card">
              <div class="vv-journey-img-wrap">
                <img src="/public/images/crafting-process-step2.jpg"
                  alt="Artisan Crafting & Rituals - How Our Nepali Rudraksha Is Made" />
              </div>
              <span class="vv-journey-step-badge">STEP 2</span>
              <h4>2. Artisan Crafting &amp; Rituals</h4>
              <p>Hand-cleaned, inspected, and energized with sacred chants.</p>
            </div>
            <div class="vv-journey-card">
              <div class="vv-journey-img-wrap">
                <img src="/product/Ved vigyan products/5 Mukhi Rudraksh/3.webp" alt="Lab Test & Delivery" />
              </div>
              <span class="vv-journey-step-badge">STEP 3</span>
              <h4>3. Lab Check &amp; Fast Delivery</h4>
              <p>Certified by experts and delivered in tamper-proof luxury boxes.</p>
            </div>
          </div>
        </section>`;

let count = 0;
for (const relPath of pdpFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes('vv-journey-section')) {
    // Insert right before vv-reviews-section or relatedGrid section
    if (content.includes('vv-reviews-section')) {
      content = content.replace(/<section class="vv-reviews-section/i, `${journeySectionHtml}\n\n        <section class="vv-reviews-section`);
    } else if (content.includes('relatedGrid')) {
      content = content.replace(/<section class="lux-section" style="padding-bottom:48px;"/i, `${journeySectionHtml}\n\n        <section class="lux-section" style="padding-bottom:48px;"`);
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Added vv-journey-section to ${relPath}`);
    count++;
  }
}

console.log(`Finished syncing journey section to ${count} PDP files.`);

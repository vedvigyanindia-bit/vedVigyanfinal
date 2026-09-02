const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(__dirname, '..', 'frontend');

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

const tabsSectionHtml = `
        <!-- SECTION 5.5: PDP Description, Specification, Benefits, FAQs Tabbed Content Section -->
        <section class="pdp-tabs-section lux-reveal" style="max-width: 1200px; margin: 48px auto; padding: 32px;">
          <div class="pdp-tabs-header">
            <button class="pdp-tab-btn active" type="button" data-tab="tabDescription" onclick="window.switchPDPTab(this, event)">Description</button>
            <button class="pdp-tab-btn" type="button" data-tab="tabSpecification" onclick="window.switchPDPTab(this, event)">Specification</button>
            <button class="pdp-tab-btn" type="button" data-tab="tabBenefits" onclick="window.switchPDPTab(this, event)">Benefits</button>
            <button class="pdp-tab-btn" type="button" data-tab="tabFaqs" onclick="window.switchPDPTab(this, event)">FAQs</button>
          </div>

          <div class="pdp-tabs-body">
            <!-- 1. Description Tab Panel -->
            <div class="pdp-tab-panel active" id="tabDescription" style="display: block;">
              <div class="pdp-desc-text" id="productDesc" style="font-size: 16px; line-height: 1.85; color: #2d3748; max-width: 960px;">
                Loading authentic product description...
              </div>
            </div>

            <!-- 2. Specification Tab Panel -->
            <div class="pdp-tab-panel" id="tabSpecification" style="display: none;">
              <div class="pdp-spec-table-wrap">
                <table class="pdp-spec-table">
                  <tbody>
                    <tr>
                      <th>Authenticity &amp; Testing</th>
                      <td>100% Natural, Government Approved Lab Certified with QR Code Report</td>
                    </tr>
                    <tr>
                      <th>Ritual Energization</th>
                      <td>Pre-energized via Traditional Vedic Mantra Pran Pratishtha rituals</td>
                    </tr>
                    <tr>
                      <th>Origin &amp; Harvest</th>
                      <td>Ethically sourced directly from sacred Himalayan regions</td>
                    </tr>
                    <tr>
                      <th>Package Includes</th>
                      <td>Product + Physical Test Report Certificate + Usage Guide + Sacred Packaging Box</td>
                    </tr>
                    <tr>
                      <th>Care Instructions</th>
                      <td>Wipe gently with a clean dry cotton cloth. Keep away from perfumes and harsh chemicals.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 3. Benefits Tab Panel -->
            <div class="pdp-tab-panel" id="tabBenefits" style="display: none;">
              <div class="pdp-benefits-grid" id="pdpBenefitsGrid">
                <div class="pdp-benefit-card">
                  <div class="pdp-benefit-icon">🛡️</div>
                  <h4>Spiritual Protection</h4>
                  <p>Shields the wearer from negative energies, evil eye, and stressful environmental aura.</p>
                </div>
                <div class="pdp-benefit-card">
                  <div class="pdp-benefit-icon">🧘</div>
                  <h4>Mental Peace &amp; Focus</h4>
                  <p>Calms an overactive mind, enhances concentration during meditation and daily work.</p>
                </div>
                <div class="pdp-benefit-card">
                  <div class="pdp-benefit-icon">✨</div>
                  <h4>Chakra Harmonization</h4>
                  <p>Balances internal energy centers to promote emotional equilibrium and vitality.</p>
                </div>
                <div class="pdp-benefit-card">
                  <div class="pdp-benefit-icon">💼</div>
                  <h4>Confidence &amp; Growth</h4>
                  <p>Attracts positive cosmic vibrations, supporting personal growth, wealth, and clarity.</p>
                </div>
              </div>
            </div>

            <!-- 4. FAQs Tab Panel -->
            <div class="pdp-tab-panel" id="tabFaqs" style="display: none;">
              <div class="pdp-faqs-list" id="pdpFaqs">
                <div class="pdp-faq-item">
                  <strong>Q: Is this product 100% authentic and certified?</strong>
                  <p>A: Yes! Every single piece is individually lab tested and comes with a physical test report featuring a QR code for online verification.</p>
                </div>
                <div class="pdp-faq-item">
                  <strong>Q: How do I wear or use this spiritual item?</strong>
                  <p>A: All products are pre-energized with Vedic mantras. You can wear it on an auspicious morning after bathing while chanting sacred mantras.</p>
                </div>
                <div class="pdp-faq-item">
                  <strong>Q: Can anyone wear this regardless of age or gender?</strong>
                  <p>A: Absolutely! Authentic Rudraksha beads, gemstones, and malas can be worn by anyone irrespective of gender, age, or horoscope.</p>
                </div>
                <div class="pdp-faq-item">
                  <strong>Q: How long does delivery take?</strong>
                  <p>A: We dispatch within 24 hours. Express delivery across India takes 3 to 5 business days with full tracking updates via SMS/WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
`;

pdpFiles.forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove existing tabs-section if present to avoid duplication
  content = content.replace(/<!-- SECTION 5\.5: PDP Description[\s\S]*?<\/section>\s*/g, '');

  let injected = false;
  const markers = [
    /<!-- SECTION 6: Watch & Shop Video Section -->|<section class="vv-watch-shop-section/i,
    /<section class="vv-reviews-section"|<div id="dh-reviews"/i,
    /<footer/i
  ];

  for (const marker of markers) {
    if (marker.test(content)) {
      content = content.replace(marker, (match) => `${tabsSectionHtml}${match}`);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Successfully injected clean Tabbed Content Section into ${relPath}`);
      injected = true;
      break;
    }
  }

  if (!injected) {
    console.warn(`No suitable marker found in ${relPath}`);
  }
});

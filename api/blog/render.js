/**
 * Vercel Serverless Function: Render Dynamic Blog Post Page
 * Route: /api/blog/render?slug=...
 */

const fs = require("fs");
const path = require("path");

function getPageHtml(slug = "") {
  // Try reading physical file first
  try {
    const candidates = [
      path.join(process.cwd(), "frontend", "blog-post.html"),
      path.join(__dirname, "..", "..", "frontend", "blog-post.html"),
      path.join(__dirname, "blog-post.html")
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, "utf8");
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  // Pre-compiled full template fallback
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ved Vigyan Journal & Vedic Wisdom</title>
    <meta name="description" content="Authentic spiritual guides on sacred Rudraksha, energized malas, and healing gemstones." />
    <meta name="robots" content="index,follow" />
    <link rel="stylesheet" href="/public/css/style.css" />
    <link rel="stylesheet" href="/public/css/home-luxury.css?v=12" />
    <link rel="stylesheet" href="/public/css/blog.css" />

    <script src="/public/js/data.js" defer></script>
    <script src="/public/js/carousel.js" defer></script>
    <script src="/public/js/cart.js" defer></script>
    <script src="/public/js/wishlist.js" defer></script>
    <script src="/public/js/lux-shell.js" defer></script>
    <script src="/public/js/lux-cards.js" defer></script>
    <script src="/public/js/ui.js" defer></script>
    <script src="/public/js/blog-engine.js" defer></script>

    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  </head>
  <body class="lux-home" data-lux-shell-inject="true">
    <div class="lux-promo-bar" aria-live="polite">
      <div class="lux-promo-marquee-track">
        <div class="lux-promo-item">🙏 <b>FREE EXPRESS SHIPPING</b> On Orders Above ₹999</div>
        <div class="lux-promo-item">🧪 <b>100% LAB CERTIFIED &amp; ENERGIZED</b> Nepal Rudraksha</div>
        <div class="lux-promo-item">⭐ <b>TRUSTED BY 25,000+ DEVOTEES</b> Across India</div>
        <div class="lux-promo-item">✨ <b>VEDIC MANTRA PURIFIED</b> Before Dispatch</div>
      </div>
    </div>

    <header class="lux-nav" id="luxNav">
      <div class="lux-container lux-nav-inner">
        <a class="lux-brand" href="/index.html" aria-label="Ved Vigyan Home">
          <img src="/public/images/logo.jpg" alt="Ved Vigyan" width="44" height="44" style="border-radius:50%; object-fit:cover; border:1.5px solid #d4af37;" />
          <div class="lux-brand-text">
            <div class="lux-brand-name" style="font-size:20px; font-weight:700; color:#8a1a23;">Ved Vigyan</div>
            <div class="lux-brand-tag" style="font-size:9px; color:#d4af37; font-weight:600; text-transform:uppercase;">Ancient Wisdom · Modern Living</div>
          </div>
        </a>

        <nav class="lux-navlinks" aria-label="Primary">
          <a class="lux-nav-link" href="/index.html">Home</a>
          <a class="lux-nav-link" href="/rudraksha.html">Rudraksha</a>
          <a class="lux-nav-link" href="/mala.html">Malas</a>
          <a class="lux-nav-link" href="/gem-stone.html">Crystals</a>
          <a class="lux-nav-link" href="/shop.html">Shop All</a>
          <a class="lux-nav-link" href="/blog.html">Blog</a>
        </nav>

        <div class="lux-nav-actions">
          <button class="lux-icon-btn" id="searchOpen" type="button" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <a class="lux-icon-btn" href="/wishlist.html" aria-label="Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="lux-badge" data-wishlist-count>0</span>
          </a>
          <a class="lux-icon-btn" href="/cart.html" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="lux-badge" data-cart-count>0</span>
          </a>
          <button class="lux-icon-btn lux-hamburger" id="mobileMenuBtn" type="button" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </header>

    <main class="vv-article-page" style="min-height: 70vh; padding: 40px 16px 80px; background: #fffdf9;">
      <div class="container" style="max-width: 900px; margin: 0 auto;">
        <div id="articleDetailContainer"></div>
      </div>
    </main>

    <div id="toast" class="toast" role="status" aria-live="polite"></div>

    <footer class="lux-footer footer footer-luxury">
      <div class="lux-container">
        <div class="lux-footer-grid">
          <div class="lux-footer-brand">
            <h2 class="lux-brand-title">Ved Vigyan</h2>
            <p>Authentic Rudraksha, healing crystals and Vedic wellness products — crafted with integrity for your spiritual journey.</p>
          </div>
          <div class="lux-footer-col">
            <h4>Company</h4>
            <a href="/about.html">About Us</a>
            <a href="/contact.html">Contact</a>
            <a href="/blog.html">Blog</a>
            <a href="/shop.html">New Launches</a>
          </div>
          <div class="lux-footer-col">
            <h4>Collections</h4>
            <a href="/rudraksha.html">Rudraksha</a>
            <a href="/mala.html">Malas</a>
            <a href="/gem-stone.html">Healing Crystals</a>
            <a href="/shop.html">All Products</a>
          </div>
          <div class="lux-footer-col">
            <h4>Customer Care</h4>
            <a href="/faq.html">FAQ</a>
            <a href="/privacy-policy.html">Privacy Policy</a>
            <a href="/terms-and-conditions.html">Terms &amp; Conditions</a>
            <a href="https://wa.me/917900811101" target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
          </div>
        </div>
        <div class="lux-footer-bottom">
          <div class="lux-copyright">© 2026 Ved Vigyan India · Dehradun, Uttarakhand</div>
        </div>
      </div>
    </footer>
  </body>
</html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

  const slug = req.query.slug || "";
  const html = getPageHtml(slug);
  return res.status(200).send(html);
};

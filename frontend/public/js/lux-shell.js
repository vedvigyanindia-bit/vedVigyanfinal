/* Ved Vigyan — Shared Luxury Shell (nav, footer, micro-interactions) */
window.VedVigyanLux = window.VedVigyanLux || {};

(function (Lux) {
  "use strict";

  const ANNOUNCEMENTS = [
    { icon: "🙏", text: "Free Rudraksha Consultation" },
    { icon: "✓", text: "100% Authentic & Lab Verified Products" },
    { icon: "🚚", text: "Free Shipping Above ₹999" },
    { icon: "⭐", text: "Trusted by 25,000+ Customers" }
  ];

  let announceIndex = 0;
  let announceTimer = null;

  const NAV_CHEVRON = `<svg class="lux-nav-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5"/></svg>`;

  const SHELL_BEFORE_MAIN = `
    <div class="vv-top-marquee" id="vvTopMarquee">
      <div class="vv-marquee-track">
        <div class="vv-marquee-item"><span class="vv-badge">FIRST BUYER OFFER</span> Extra 10% OFF with Code <b>SHIVA10</b></div>
        <div class="vv-marquee-item">⚡ <b>LIMITED TIME DISCOUNT:</b> Up to 50% OFF on Original Nepal Rudraksha</div>
        <div class="vv-marquee-item">🚚 <b>FREE EXPRESS SHIPPING</b> Across India on Orders Above ₹999</div>
        <div class="vv-marquee-item">🧪 <b>100% LAB CERTIFIED & ENERGIZED</b> Before Dispatch</div>
        <div class="vv-marquee-item"><span class="vv-badge">FIRST BUYER OFFER</span> Extra 10% OFF with Code <b>SHIVA10</b></div>
        <div class="vv-marquee-item">⚡ <b>LIMITED TIME DISCOUNT:</b> Up to 50% OFF on Original Nepal Rudraksha</div>
        <div class="vv-marquee-item">🚚 <b>FREE EXPRESS SHIPPING</b> Across India on Orders Above ₹999</div>
        <div class="vv-marquee-item">🧪 <b>100% LAB CERTIFIED & ENERGIZED</b> Before Dispatch</div>
      </div>
    </div>
    <div class="lux-announce" id="announceBar" aria-live="polite">
      <div class="lux-announce-track" id="announceTrack"></div>
      <div class="lux-announce-dots" id="announceDots"></div>
    </div>
    <header class="lux-nav is-scrolled" id="luxNav">
      <div class="lux-container lux-nav-inner">
        <a class="lux-brand" href="/index.html" aria-label="Ved Vigyan Home">
          <img src="/public/images/logo.jpg" alt="Ved Vigyan" width="48" height="48" class="lux-logo-img" style="border-radius:50%; object-fit:cover; border:1.5px solid var(--gold,#d4af37);" />
          <div class="lux-brand-text">
            <div class="lux-brand-name">Ved Vigyan</div>
            <div class="lux-brand-tag">Divine Wisdom & Sacred Jewels</div>
          </div>
        </a>
        <nav class="lux-navlinks" aria-label="Primary">
          <a class="lux-nav-link" href="/index.html">Home</a>
          <div class="lux-mega-wrap" data-mega="rudraksha">
            <button class="lux-mega-trigger" type="button" aria-expanded="false">Rudraksha ${NAV_CHEVRON}</button>
            <div class="lux-mega-panel">
              <div class="lux-mega-grid">
                <a class="lux-mega-item" href="/rudraksha.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="All Rudraksha" loading="lazy" /></div>
                  <b>All Rudraksha</b><span>14 authentic mukhi beads</span>
                </a>
                <a class="lux-mega-item" href="/products/5-mukhi-rudraksh">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="5 Mukhi" loading="lazy" /></div>
                  <b>5 Mukhi</b><span>Bestseller for daily wear</span>
                </a>
                <a class="lux-mega-item" href="/products/7-mukhi-rudraksh">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="7 Mukhi" loading="lazy" /></div>
                  <b>7 Mukhi</b><span>Wealth & abundance</span>
                </a>
                <a class="lux-mega-item" href="/products/gauri-sankar-rudraksh">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Gauri Sankar Rudraksh/1.webp" alt="Gauri Shankar" loading="lazy" /></div>
                  <b>Gauri Shankar</b><span>Relationship harmony</span>
                </a>
              </div>
            </div>
          </div>
          <div class="lux-mega-wrap" data-mega="bracelets">
            <button class="lux-mega-trigger" type="button" aria-expanded="false">Bracelets ${NAV_CHEVRON}</button>
            <div class="lux-mega-panel">
              <div class="lux-mega-grid">
                <a class="lux-mega-item" href="/products/gold-rudraksh-bracelet">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp" alt="Rudraksha Bracelets" loading="lazy" /></div>
                  <b>Rudraksha Bracelets</b><span>Daily spiritual wear</span>
                </a>
                <a class="lux-mega-item" href="/gem-stone.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Crystal Bracelets" loading="lazy" /></div>
                  <b>Crystal Bracelets</b><span>Healing gemstones</span>
                </a>
                <a class="lux-mega-item" href="/collections/zodiac-bracelet">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp" alt="Zodiac" loading="lazy" /></div>
                  <b>Zodiac Collection</b><span>Rashi bracelets</span>
                </a>
              </div>
            </div>
          </div>
          <div class="lux-mega-wrap" data-mega="crystals">
            <button class="lux-mega-trigger" type="button" aria-expanded="false">Crystals ${NAV_CHEVRON}</button>
            <div class="lux-mega-panel">
              <div class="lux-mega-grid">
                <a class="lux-mega-item" href="/gem-stone.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="All Crystals" loading="lazy" /></div>
                  <b>All Crystals</b><span>Healing gemstone bracelets</span>
                </a>
                <a class="lux-mega-item" href="/collections/gemstone-tree">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="Gemstone Trees" loading="lazy" /></div>
                  <b>Crystal Trees</b><span>Vastu & energy trees</span>
                </a>
                <a class="lux-mega-item" href="/products/amethyst-bracelet">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Amethyst Bracelet/1.webp" alt="Amethyst" loading="lazy" /></div>
                  <b>Amethyst</b><span>Calmness & stress relief</span>
                </a>
              </div>
            </div>
          </div>
          <div class="lux-mega-wrap" data-mega="malas">
            <button class="lux-mega-trigger" type="button" aria-expanded="false">Malas ${NAV_CHEVRON}</button>
            <div class="lux-mega-panel">
              <div class="lux-mega-grid">
                <a class="lux-mega-item" href="/mala.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Rudraksh Jap Mala/1.webp" alt="All Malas" loading="lazy" /></div>
                  <b>All Malas</b><span>108 bead chanting strings</span>
                </a>
                <a class="lux-mega-item" href="/products/karungali-rudraksh-silver-cap-mala">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Karungali mala/1.webp" alt="Karungali Malas" loading="lazy" /></div>
                  <b>Karungali Malas</b><span>Ebony wood positive energy</span>
                </a>
                <a class="lux-mega-item" href="/products/tulsi-mala">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Tulsi Mala/1.webp" alt="Tulsi Malas" loading="lazy" /></div>
                  <b>Tulsi Malas</b><span>Sacred Vaishnav jaap malas</span>
                </a>
              </div>
            </div>
          </div>
          <div class="lux-mega-wrap" data-mega="bestsellers">
            <button class="lux-mega-trigger" type="button" aria-expanded="false">Best Sellers ${NAV_CHEVRON}</button>
            <div class="lux-mega-panel">
              <div class="lux-mega-grid">
                <a class="lux-mega-item" href="/shop.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="Top Sellers" loading="lazy" /></div>
                  <b>Top Sellers</b><span>Most trusted spiritual picks</span>
                </a>
                <a class="lux-mega-item" href="/products/gauri-sankar-rudraksh">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/4. Money Magnet/1.webp" alt="Money Magnet" loading="lazy" /></div>
                  <b>Money Magnet</b><span>Attract wealth & prosperity</span>
                </a>
                <a class="lux-mega-item" href="/products/7-chakra-tree">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/7 Chakra Tree/1.webp" alt="7 Chakra Tree" loading="lazy" /></div>
                  <b>7 Chakra Tree</b><span>Vastu & harmony balancer</span>
                </a>
              </div>
            </div>
          </div>
          <div class="lux-mega-wrap" data-mega="shopall">
            <button class="lux-mega-trigger" type="button" aria-expanded="false">Shop All ${NAV_CHEVRON}</button>
            <div class="lux-mega-panel">
              <div class="lux-mega-grid">
                <a class="lux-mega-item" href="/shop.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" alt="Complete Shop" loading="lazy" /></div>
                  <b>Complete Shop</b><span>Explore all 41 sacred items</span>
                </a>
                <a class="lux-mega-item" href="/collections/zodiac-bracelet">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp" alt="Zodiac Rashi" loading="lazy" /></div>
                  <b>Zodiac Rashi</b><span>Custom Rashi gemstones</span>
                </a>
                <a class="lux-mega-item" href="/rudraksha.html">
                  <div class="lux-mega-thumb"><img src="/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" alt="Rudraksha Beads" loading="lazy" /></div>
                  <b>Rudraksha Beads</b><span>1 to 12 Mukhi collections</span>
                </a>
              </div>
            </div>
          </div>
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
          <a class="lux-icon-btn" href="/contact.html" aria-label="Account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>
          <button class="lux-icon-btn lux-hamburger" id="mobileMenuBtn" type="button" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    </header>
    <div class="lux-search-modal" id="searchModal" role="dialog" aria-label="Search products" aria-hidden="true">
      <button class="lux-search-close" id="searchClose" type="button" aria-label="Close search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="lux-search-box">
        <h2>Find Your Sacred Piece</h2>
        <form class="lux-search-form" id="luxSearchForm" role="search">
          <input type="search" id="luxSearchInput" placeholder="Search Rudraksha, Malas, Crystals..." autocomplete="off" />
          <button class="lux-btn lux-btn-primary lux-btn-sm" type="submit">Search</button>
        </form>
      </div>
    </div>
    <div class="lux-mobile-menu" id="mobileMenu" aria-hidden="true">
      <div class="lux-mobile-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="/public/images/logo.jpg" alt="Ved Vigyan" width="36" height="36" style="border-radius:50%; object-fit:cover; border:1px solid var(--gold,#d4af37);" />
          <span class="lux-brand-name">Ved Vigyan</span>
        </div>
        <button class="lux-icon-btn" id="mobileMenuClose" type="button" aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="lux-mobile-links">
        <a href="/index.html">Home</a>
        <a href="/about.html">About Us</a>
        <a href="/rudraksha.html">Rudraksha</a>
        <a href="/bracelet/rudraksha-bracelet.html">Bracelets</a>
        <a href="/gem-stone.html">Healing Crystals</a>
        <a href="/mala.html">Malas</a>
        <a href="/shop.html">Shop All</a>
        <a href="/blog.html">Knowledge Centre</a>
        <a href="/contact.html">Contact</a>
      </nav>
    </div>
  `;

  const SHELL_AFTER_MAIN = `
    <footer class="lux-footer footer footer-luxury">
      <div class="lux-container">
        <div class="lux-footer-grid">
          <div class="lux-footer-brand">
            <h2 class="lux-brand-title">Ved Vigyan</h2>
            <p>Authentic Rudraksha, healing crystals and Vedic wellness products — crafted with integrity for your spiritual journey.</p>
            <form class="lux-newsletter" id="newsletterForm">
              <input type="email" placeholder="Your email address" aria-label="Email for newsletter" required />
              <button class="lux-subscribe-btn" type="submit">SUBSCRIBE</button>
            </form>
            <div class="lux-payment-icons">
              <span>UPI</span><span>VISA</span><span>Mastercard</span><span>RuPay</span><span>COD</span>
            </div>
          </div>
          <div class="lux-footer-col">
            <h4>Company</h4>
            <a href="/about.html">About Us</a>
            <a href="/contact.html">Contact</a>
            <a href="/blog.html">Blog</a>
            <a href="/shop.html">New Launches</a>
            <a href="/cashback-offer.html" class="lux-offer-link">Offers</a>
          </div>
          <div class="lux-footer-col">
            <h4>Collections</h4>
            <a href="/rudraksha.html">Rudraksha</a>
            <a href="/mala.html">Malas</a>
            <a href="/gem-stone.html">Healing Crystals</a>
            <a href="/bracelet/rudraksha-bracelet.html">Bracelets</a>
            <a href="/shop.html">All Products</a>
          </div>
          <div class="lux-footer-col lux-footer-care-col">
            <h4>Customer Care</h4>
            <a href="/faq.html">FAQ</a>
            <a href="/privacy-policy.html">Privacy Policy</a>
            <a href="/terms-and-conditions.html">Terms & Conditions</a>
            <a href="/refund-cancellation-policy.html">Returns & Refunds</a>
            <a href="https://wa.me/917900811101" target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
          </div>
          <div class="lux-footer-om-seal" aria-hidden="true">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="4 2" />
              <circle cx="50" cy="50" r="40" stroke="#d4af37" stroke-width="1" />
              <text x="50" y="60" font-size="34" fill="#d4af37" text-anchor="middle" font-weight="bold">ॐ</text>
            </svg>
          </div>
        </div>
        <div class="lux-footer-bottom">
          <div class="lux-copyright">
            © 2026 Ved Vigyan India · Dehradun, Uttarakhand · <a href="mailto:vedvigyanindia@gmail.com">vedvigyanindia@gmail.com</a> · <a href="tel:+917900811101">+91 7900811101</a>
          </div>
          <div class="lux-social-icons">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
            <a href="https://youtu.be/o9dREd5ZPhw?si=X2tbKalptHS0wmhD" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YT</a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
            <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">PT</a>
          </div>
        </div>
      </div>
    </footer>
    <a class="lux-whatsapp" href="https://wa.me/917900811101" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
    </a>
    <button class="lux-back-top" id="backToTop" type="button" aria-label="Back to top">
      <svg class="lux-back-top-ring" viewBox="0 0 54 54"><circle cx="27" cy="27" r="25" id="backTopRing"/></svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
    </button>
    <div class="lux-quickview" id="quickView" role="dialog" aria-label="Quick view" aria-hidden="true">
      <div class="lux-quickview-panel" id="quickViewPanel"></div>
    </div>
    <!-- Video Modal Lightbox -->
    <div class="vv-video-modal-backdrop" id="vvVideoModalBackdrop" role="dialog" aria-hidden="true">
      <div class="vv-video-modal-content">
        <button class="vv-video-modal-close" id="vvVideoModalClose" type="button" aria-label="Close video">&times;</button>
        <div class="vv-video-player-container" id="vvVideoPlayerContainer"></div>
      </div>
    </div>
  `;

  Lux.injectShell = function injectShell() {
    if (document.getElementById("luxNav")) return;
    const main = document.querySelector("main");
    if (main) {
      main.insertAdjacentHTML("beforebegin", SHELL_BEFORE_MAIN);
      main.insertAdjacentHTML("afterend", SHELL_AFTER_MAIN);
    } else {
      document.body.insertAdjacentHTML("afterbegin", SHELL_BEFORE_MAIN);
      document.body.insertAdjacentHTML("beforeend", SHELL_AFTER_MAIN);
    }
  };

  Lux.initAnnouncement = function initAnnouncement() {
    const track = document.getElementById("announceTrack");
    const dots = document.getElementById("announceDots");
    if (!track || track.children.length) return;

    track.innerHTML = ANNOUNCEMENTS.map((item) => `
      <div class="lux-announce-slide">
        <span aria-hidden="true">${item.icon}</span>
        <span>${item.text}</span>
      </div>
    `).join("");

    if (dots) {
      dots.innerHTML = ANNOUNCEMENTS.map((_, i) => `
        <button class="lux-announce-dot${i === 0 ? " active" : ""}" type="button" data-index="${i}" aria-label="Announcement ${i + 1}"></button>
      `).join("");
      dots.querySelectorAll(".lux-announce-dot").forEach((dot) => {
        dot.addEventListener("click", () => goToAnnounce(Number(dot.dataset.index)));
      });
    }

    function goToAnnounce(index) {
      announceIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots?.querySelectorAll(".lux-announce-dot").forEach((d, i) => {
        d.classList.toggle("active", i === index);
      });
    }

    function nextAnnounce() {
      goToAnnounce((announceIndex + 1) % ANNOUNCEMENTS.length);
    }

    announceTimer = setInterval(nextAnnounce, 4000);
    track.parentElement?.addEventListener("mouseenter", () => clearInterval(announceTimer));
    track.parentElement?.addEventListener("mouseleave", () => {
      announceTimer = setInterval(nextAnnounce, 4000);
    });
  };

  Lux.initNav = function initNav(options = {}) {
    const nav = document.getElementById("luxNav");
    if (!nav) return;

    const transparentOnTop = options.transparentOnTop === true;

    const onScroll = () => {
      const scrolled = window.scrollY > 60;
      nav.classList.toggle("is-scrolled", scrolled || !transparentOnTop);
      nav.classList.toggle("is-transparent", transparentOnTop && !scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.querySelectorAll(".lux-mega-wrap").forEach((wrap) => {
      const trigger = wrap.querySelector(".lux-mega-trigger");
      let closeTimeout = null;

      // Mouse Hover Enter (Desktop)
      wrap.addEventListener("mouseenter", () => {
        if (window.innerWidth > 1024) {
          clearTimeout(closeTimeout);
          document.querySelectorAll(".lux-mega-wrap").forEach((w) => {
            if (w !== wrap) {
              w.classList.remove("open");
              w.querySelector(".lux-mega-trigger")?.setAttribute("aria-expanded", "false");
            }
          });
          wrap.classList.add("open");
          trigger?.setAttribute("aria-expanded", "true");
        }
      });

      // Mouse Hover Leave (Desktop)
      wrap.addEventListener("mouseleave", () => {
        if (window.innerWidth > 1024) {
          closeTimeout = setTimeout(() => {
            wrap.classList.remove("open");
            trigger?.setAttribute("aria-expanded", "false");
          }, 150); // smooth 150ms delay
        }
      });

      // Click Trigger (Mobile Fallback)
      trigger?.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024) {
          e.stopPropagation();
          const isOpen = wrap.classList.contains("open");
          document.querySelectorAll(".lux-mega-wrap").forEach((w) => {
            w.classList.remove("open");
            w.querySelector(".lux-mega-trigger")?.setAttribute("aria-expanded", "false");
          });
          if (!isOpen) {
            wrap.classList.add("open");
            trigger.setAttribute("aria-expanded", "true");
          }
        }
      });
    });

    document.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        document.querySelectorAll(".lux-mega-wrap").forEach((w) => {
          w.classList.remove("open");
          w.querySelector(".lux-mega-trigger")?.setAttribute("aria-expanded", "false");
        });
      }
    });

    const searchModal = document.getElementById("searchModal");
    const searchOpen = document.getElementById("searchOpen");
    const searchClose = document.getElementById("searchClose");
    const searchForm = document.getElementById("luxSearchForm");

    searchOpen?.addEventListener("click", () => {
      searchModal?.classList.add("open");
      searchModal?.setAttribute("aria-hidden", "false");
      document.getElementById("luxSearchInput")?.focus();
    });

    const closeSearch = () => {
      searchModal?.classList.remove("open");
      searchModal?.setAttribute("aria-hidden", "true");
    };
    searchClose?.addEventListener("click", closeSearch);
    searchModal?.addEventListener("click", (e) => { if (e.target === searchModal) closeSearch(); });

    searchForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("luxSearchInput")?.value?.trim();
      window.location.href = q ? `/shop.html?q=${encodeURIComponent(q)}` : "/shop.html";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSearch();
    });

    const mobileMenu = document.getElementById("mobileMenu");
    document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
      mobileMenu?.classList.add("open");
      mobileMenu?.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
    document.getElementById("mobileMenuClose")?.addEventListener("click", () => {
      mobileMenu?.classList.remove("open");
      mobileMenu?.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });

    const path = window.location.pathname.replace(/\/+$/, "") || "/index.html";
    const isHome = path === "" || path === "/" || path === "/index.html";
    document.querySelectorAll('.lux-navlinks a[href="/index.html"]').forEach((link) => {
      link.setAttribute("aria-current", isHome ? "page" : "false");
    });

    if (window.VedVigyanCart && typeof window.VedVigyanCart.renderCartBadge === "function") {
      window.VedVigyanCart.renderCartBadge();
    }
    if (window.VedVigyanWishlist && typeof window.VedVigyanWishlist.renderWishlistBadge === "function") {
      window.VedVigyanWishlist.renderWishlistBadge();
    }
  };

  Lux.initBackToTop = function initBackToTop() {
    const btn = document.getElementById("backToTop");
    const ring = document.getElementById("backTopRing");
    if (!btn) return;

    const circumference = 157;
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      btn.classList.toggle("visible", scrollTop > 400);
      if (ring) ring.style.strokeDashoffset = `${circumference - progress * circumference}`;
    }, { passive: true });

    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  Lux.initScrollReveal = function initScrollReveal() {
    const reveals = document.querySelectorAll(".lux-reveal:not(.visible)");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 50);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => observer.observe(el));
  };

  Lux.initRipple = function initRipple() {
    if (document.body.dataset.luxRippleBound) return;
    document.body.dataset.luxRippleBound = "true";
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".lux-btn");
      if (!btn) return;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  };

  Lux.initNewsletter = function initNewsletter() {
    document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = "Thank you for subscribing!";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3500);
      }
      e.target.reset();
    });
  };

  Lux.initWatchShopCarousel = function initWatchShopCarousel() {
    document.querySelectorAll(".vv-watch-shop-section").forEach((section) => {
      const track = section.querySelector(".vv-reel-track");
      const prevBtn = section.querySelector(".vv-reel-nav-btn.prev");
      const nextBtn = section.querySelector(".vv-reel-nav-btn.next");
      if (!track) return;

      if (prevBtn && !prevBtn.__vv_bound) {
        prevBtn.__vv_bound = true;
        prevBtn.addEventListener("click", () => {
          track.scrollBy({ left: -280, behavior: "smooth" });
        });
      }
      if (nextBtn && !nextBtn.__vv_bound) {
        nextBtn.__vv_bound = true;
        nextBtn.addEventListener("click", () => {
          track.scrollBy({ left: 280, behavior: "smooth" });
        });
      }
    });

    const stopInlinePlayer = (wrapEl) => {
      wrapEl.classList.remove("is-playing");
      const inlinePlayer = wrapEl.querySelector(".vv-inline-player");
      if (inlinePlayer) {
        const v = inlinePlayer.querySelector("video");
        if (v) {
          try {
            v.pause();
            v.removeAttribute("src");
            v.load();
          } catch (e) { }
        }
        const iframe = inlinePlayer.querySelector("iframe");
        if (iframe) {
          try { iframe.src = "about:blank"; } catch (e) { }
        }
        inlinePlayer.remove();
      }
    };

    const videoCards = document.querySelectorAll("[data-vv-video]");
    videoCards.forEach((card) => {
      if (card.__vv_video_bound) return;
      card.__vv_video_bound = true;

      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        let src = card.getAttribute("data-vv-video") || "https://youtu.be/o9dREd5ZPhw?si=X2tbKalptHS0wmhD";
        if (!src) return;

        // If card is already playing, check click target for play/pause toggle
        if (card.classList.contains("is-playing")) {
          const v = card.querySelector("video");
          if (v && e.target !== v) {
            if (v.paused) {
              v.play();
            } else {
              v.pause();
            }
            return;
          }
          if (card.querySelector(".vv-inline-player")) return;
        }

        // Pause and stop all other inline reel videos on the page
        document.querySelectorAll(".vv-reel-video-wrap.is-playing").forEach((otherCard) => {
          if (otherCard !== card) {
            stopInlinePlayer(otherCard);
          }
        });

        card.classList.add("is-playing");

        // Create inline player container inside the reel video wrap frame
        let inlinePlayer = card.querySelector(".vv-inline-player");
        if (!inlinePlayer) {
          inlinePlayer = document.createElement("div");
          inlinePlayer.className = "vv-inline-player";

          if (src.includes("youtube.com") || src.includes("youtu.be")) {
            let embedSrc = src;
            if (src.includes("youtu.be/")) {
              const videoId = src.split("youtu.be/")[1].split("?")[0];
              embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            } else if (src.includes("youtube.com/embed/")) {
              embedSrc = src.includes("?") ? `${src}&autoplay=1` : `${src}?autoplay=1`;
            } else if (src.includes("youtube.com/watch")) {
              const videoId = new URLSearchParams(src.split("?")[1]).get("v");
              embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            }
            inlinePlayer.innerHTML = `<iframe src="${embedSrc}" width="100%" height="100%" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%; height:100%; object-fit:cover; border:none; z-index:10;"></iframe>`;
          } else {
            inlinePlayer.innerHTML = `<video src="${src}" autoplay controls playsinline style="width:100%; height:100%; object-fit:cover; display:block; z-index:10;"></video>`;
          }
          card.appendChild(inlinePlayer);
        }
      });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.querySelectorAll(".vv-reel-video-wrap.is-playing video").forEach((v) => {
          try { v.pause(); } catch (e) { }
        });
      }
    });

    const modalBackdrop = document.getElementById("vvVideoModalBackdrop");
    const modalClose = document.getElementById("vvVideoModalClose");
    const modalPlayer = document.getElementById("vvVideoPlayerContainer");

    const closeVideoModal = () => {
      if (modalBackdrop) {
        modalBackdrop.classList.remove("active");
        modalBackdrop.setAttribute("aria-hidden", "true");
      }
      if (modalPlayer) modalPlayer.innerHTML = "";
    };

    if (modalClose && !modalClose.__vv_bound) {
      modalClose.__vv_bound = true;
      modalClose.addEventListener("click", closeVideoModal);
    }
    if (modalBackdrop && !modalBackdrop.__vv_bound) {
      modalBackdrop.__vv_bound = true;
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeVideoModal();
      });
    }
  };

  Lux.initShell = function initShell(options = {}) {
    if (document.body.dataset.luxShellInject === "true") {
      Lux.injectShell();
    }
    Lux.initAnnouncement();
    Lux.initNav(options);
    Lux.initBackToTop();
    Lux.initRipple();
    Lux.initNewsletter();
    Lux.initScrollReveal();
    Lux.initWatchShopCarousel();
  };

  Lux.upgradeLegacyPage = function upgradeLegacyPage() {
    if (document.getElementById("luxNav")) return;

    document.body.classList.add("lux-home");
    if (!document.body.dataset.luxShellInject) {
      document.body.dataset.luxShellInject = "true";
    }

    document.querySelector(".topbar")?.remove();
    document.querySelector("header.nav:not(.lux-nav)")?.remove();
    document.querySelector("footer.footer:not(.footer-luxury)")?.remove();
    document.getElementById("toTop")?.remove();

    Lux.injectShell();
    Lux.initShell({ transparentOnTop: false });
  };

  // Helper to load script if missing
  function loadScript(src) {
    return new Promise((resolve) => {
      const cleanSrc = src.split("?")[0];
      const existing = Array.from(document.querySelectorAll("script")).find((s) => s.src && s.src.includes(cleanSrc));
      if (existing) {
        if (window.VED_VIGYAN_DATA && cleanSrc.includes("data.js")) { resolve(true); return; }
        if (window.VedVigyanCart && cleanSrc.includes("cart.js")) { resolve(true); return; }
        if (window.VedVigyanWishlist && cleanSrc.includes("wishlist.js")) { resolve(true); return; }
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
        setTimeout(() => resolve(true), 100);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  async function ensureGlobalScripts() {
    try {
      const promises = [];
      if (!window.VED_VIGYAN_DATA) promises.push(loadScript("/public/js/data.js"));
      if (!window.VedVigyanCart) promises.push(loadScript("/public/js/cart.js"));
      if (!window.VedVigyanWishlist) promises.push(loadScript("/public/js/wishlist.js"));

      if (promises.length > 0) {
        await Promise.all(promises);
      }
      if (window.VedVigyanCart && typeof window.VedVigyanCart.renderCartBadge === "function") {
        window.VedVigyanCart.renderCartBadge();
      }
      if (window.VedVigyanWishlist && typeof window.VedVigyanWishlist.renderWishlistBadge === "function") {
        window.VedVigyanWishlist.renderWishlistBadge();
      }
    } catch (e) {
      console.warn("Global script check notice:", e);
    }
  }

  function bootLuxShell() {
    if (document.querySelector(".topbar") || document.querySelector("header.nav:not(.lux-nav)")) {
      Lux.upgradeLegacyPage();
      ensureGlobalScripts();
      return;
    }

    if (!document.getElementById("luxNav")) {
      document.body.classList.add("lux-home");
      document.body.dataset.luxShellInject = "true";
      Lux.injectShell();
      Lux.initShell({ transparentOnTop: false });
    } else {
      document.body.classList.add("lux-home");
      Lux.initAnnouncement();
      Lux.initNav({ transparentOnTop: false });
      Lux.initBackToTop();
      Lux.initRipple();
      Lux.initNewsletter();
      Lux.initScrollReveal();
      Lux.initWatchShopCarousel();
    }

    ensureGlobalScripts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootLuxShell);
  } else {
    bootLuxShell();
  }
})(window.VedVigyanLux);

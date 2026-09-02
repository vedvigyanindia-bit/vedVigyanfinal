/* Ved Vigyan — Luxury Homepage Interactions */
(function () {
  "use strict";

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const ANNOUNCEMENTS = [
    { icon: "🙏", text: "Free Rudraksha Consultation" },
    { icon: "✓", text: "100% Authentic & Lab Verified Products" },
    { icon: "🚚", text: "Free Shipping Above ₹999" },
    { icon: "⭐", text: "Trusted by 25,000+ Customers" }
  ];

  const HERO_SLIDES = [
    {
      href: "/rudraksha/5-mukhi.html",
      img: "/public/images/banner/1.png",
      mobileImg: "/public/images/banner/1.png",
      alt: "Ved Vigyan 5 Mukhi Nepali Rudraksha - Connect With Divine Blessings"
    },
    {
      href: "/products/karungali-rudraksh-silver-cap-mala",
      img: "/public/images/banner/2.png",
      mobileImg: "/public/images/banner/2.png",
      alt: "Karungali Mala - Natural, Spiritual, Powerful"
    },
    {
      href: "/rudraksha-mala/5-mukhi-mala-108.html",
      img: "/public/images/banner/3.png",
      mobileImg: "/public/images/banner/3.png",
      alt: "Original 5 Mukhi Nepali Rudraksha Mala - Lab Certified"
    },
    {
      href: "/mala/tulsi-mala.html",
      img: "/public/images/banner/4.png",
      mobileImg: "/public/images/banner/4.png",
      alt: "Original Tulsi Mala - Pure, Sacred, Divine"
    }
  ];

  const COLLECTION_TABS = [
    { label: "Best Seller", filter: (p) => p.rating >= 4.8 },
    { label: "Rashi Bracelet", filter: (p) => p.category === "zodiac-bracelet" },
    { label: "Karungali", filter: (p) => p.category === "mala" || (p.name && p.name.includes("Karungali")) },
    { label: "Pyrite", filter: (p) => (p.name && p.name.toLowerCase().includes("pyrite")) || p.id === "vv_p07" },
    { label: "Gemstones", filter: (p) => p.category === "crystal-bracelet" || p.category === "gemstone-tree" },
    { label: "Rudraksha", filter: (p) => p.category === "rudraksha" }
  ];

  const CATEGORIES = [
    { title: "Rudraksha", desc: "Authentic mukhi beads", href: "/rudraksha.html", img: "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp", icon: "🔱" },
    { title: "Rudraksha Malas", desc: "108-bead sacred strings", href: "/mala.html", img: "/product/Ved vigyan products/Rudraksh Jap Mala/1.webp", icon: "📿" },
    { title: "Bracelets", desc: "Daily spiritual wear", href: "/bracelet/rudraksha-bracelet.html", img: "/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp", icon: "💫" },
    { title: "Healing Crystals", desc: "Natural gemstone power", href: "/gem-stone.html", img: "/product/Ved vigyan products/7 Chakra Tree/1.webp", icon: "💎" },
    { title: "Zodiac Collection", desc: "Rashi-aligned bracelets", href: "/collections/zodiac-bracelet", img: "/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp", icon: "♈" },
    { title: "Tulsi Collection", desc: "Sacred basil malas", href: "/mala/tulsi-mala.html", img: "/product/Ved vigyan products/Tulsi Mala/1.webp", icon: "🌿" },
    { title: "Meditation Essentials", desc: "Tools for inner peace", href: "/shop.html", img: "/product/Ved vigyan products/Spatik Mala/1.webp", icon: "🧘" },
    { title: "Prosperity Collection", desc: "Abundance & wealth", href: "/gem-stone/tiger-eye-bracelet.html", img: "/product/Ved vigyan products/4. Money Magnet/1.webp", icon: "💰" }
  ];

  const PURPOSES = [
    { label: "Health", img: "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp", href: "/rudraksha/5-mukhi.html" },
    { label: "Protection", img: "/product/Ved vigyan products/10 Mukhi Rudraksh/1.webp", href: "/rudraksha.html" },
    { label: "Love", img: "/product/Ved vigyan products/Rose Quartz Close/1.webp", href: "/gem-stone.html" },
    { label: "Meditation", img: "/product/Ved vigyan products/Tulsi Mala/1.webp", href: "/mala/tulsi-mala.html" },
    { label: "Career", img: "/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp", href: "/rudraksha/7-mukhi.html" },
    { label: "Wealth", img: "/product/Ved vigyan products/4. Money Magnet/1.webp", href: "/gem-stone/tiger-eye-bracelet.html" },
    { label: "Peace", img: "/product/Ved vigyan products/Amethyst Bracelet/1.webp", href: "/gem-stone/amethyst-bracelet.html" },
    { label: "Success", img: "/product/Ved vigyan products/Piride Braclet/1.webp", href: "/shop.html" },
    { label: "Spiritual Growth", img: "/product/Ved vigyan products/Gauri Sankar Rudraksh/1.webp", href: "/rudraksha.html" }
  ];

  const REVIEWS = [
    { name: "Arjun Mehta", location: "10 Mukhi Rudraksha", avatar: "/public/images/reviews/arjun-mehta.jpg", rating: 5, text: "Maine 10 Mukhi Rudraksha order kiya tha. Product quality achhi hai aur packaging bhi secure thi. Overall purchase experience bahut achha raha.", verified: true },
    { name: "Aditya Verma", location: "Nepali Rudraksha Mala", avatar: "/public/images/reviews/aditya-verma.jpg", rating: 5, text: "Maine Nepali Rudraksha Mala order ki thi aur quality dekhkar kaafi satisfied hoon. Mala bahut achhi finish ke saath mili aur packaging bhi proper thi. Overall, very good purchase experience.", verified: true },
    { name: "Rohan Kapoor", location: "Karungali Mala", avatar: "/public/images/reviews/rohan-kapoor.jpg", rating: 5, text: "Maine Karungli Mala purchase ki aur quality dekhkar kaafi satisfied hoon. Mala achhi finish ke saath mili. Overall, good experience.", verified: true },
    { name: "Vikram Joshi", location: "Rudraksha Jaap Mala", avatar: "/public/images/reviews/vikram-joshi.jpg", rating: 5, text: "Maine Rudraksha Jaap Mala order ki thi. Product achhe se packed tha aur quality bhi kaafi achhi lagi. Happy with my purchase.", verified: true },
    { name: "Sanjay Rawat", location: "2 Mukhi Rudraksha", avatar: "/public/images/reviews/sanjay-rawat.jpg", rating: 5, text: "Maine 2 Mukhi Rudraksha order kiya tha aur product exactly expected jaisa mila. Packaging aur overall quality dono achhe the.", verified: true },
    { name: "Mohan Sharma", location: "4 Rashi Bracelets", avatar: "/public/images/reviews/mohan-sharma.jpg", rating: 5, text: "Maine apni poori family ke liye 4 Rashi bracelets order kiye — 2 Dhanu Rashi bracelets mere aur meri daughter ke liye, aur Meen aur Singh Rashi bracelets meri wife aur son ke liye. Sabhi bracelets ki quality aur finishing bahut achhi lagi. Overall, very happy with the purchase!", verified: true }
  ];

  const BLOG_POSTS = [
    { title: "Benefits of Wearing Rudraksha", excerpt: "Discover the spiritual, mental and physical benefits of authentic Rudraksha beads.", tag: "Rudraksha", href: "/blog/benefits-of-wearing-rudraksha.html", img: "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp" },
    { title: "Healing Crystals Guide", excerpt: "A beginner's guide to choosing and using healing crystals for daily wellness.", tag: "Crystals", href: "/gem-stone.html", img: "/product/Ved vigyan products/7 Chakra Tree/1.webp" },
    { title: "How to Wear Rudraksha", excerpt: "Traditional guidelines for wearing Rudraksha — timing, mantras and care tips.", tag: "Guide", href: "/blog/how-to-identify-original-rudraksha.html", img: "/product/Ved vigyan products/7 Mukhi Rudraksh/1.webp" },
    { title: "Meditation Tips", excerpt: "Simple meditation practices using mala beads for beginners and advanced seekers.", tag: "Meditation", href: "/mala.html", img: "/product/Ved vigyan products/Tulsi Mala/1.webp" },
    { title: "Astrology Guide", excerpt: "Match your zodiac sign with the perfect Rudraksha mukhi and healing crystal.", tag: "Astrology", href: "/collections/zodiac-bracelet", img: "/product/Ved vigyan products/Mesh (मेष – Aries) Braclet/1.webp" }
  ];

  const INSTA_IMAGES = [
    "/product/Ved vigyan products/5 Mukhi Nepali/1.webp",
    "/product/Ved vigyan products/7 Chakra Tree/1.webp",
    "/product/Ved vigyan products/Amethyst Bracelet/1.webp",
    "/product/Ved vigyan products/Rose Quartz Close/1.webp",
    "/product/Ved vigyan products/Rudraksh Jap Mala/1.webp",
    "/product/Ved vigyan products/Gold Rudraksh Bracelet/1.webp",
    "/product/Ved vigyan products/Tiger Eye Loose Big/1.webp",
    "/product/Ved vigyan products/Tulsi Mala/1.webp"
  ];

  let announceIndex = 0;
  let announceTimer = null;

  /* ─── Announcement Carousel ─── */
  function initAnnouncement() {
    const track = document.getElementById("announceTrack");
    const dots = document.getElementById("announceDots");
    if (!track) return;

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
  }

  /* ─── Navigation ─── */
  function initNav() {
    const nav = document.getElementById("luxNav");
    if (!nav) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 60;
      nav.classList.toggle("is-scrolled", scrolled);
      nav.classList.toggle("is-transparent", !scrolled);
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
      if (e.key === "/" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        searchOpen?.click();
      }
    });

    const mobileMenu = document.getElementById("mobileMenu");
    let mobileBackdrop = document.getElementById("mobileMenuBackdrop");
    if (!mobileBackdrop) {
      mobileBackdrop = document.createElement("div");
      mobileBackdrop.id = "mobileMenuBackdrop";
      mobileBackdrop.className = "lux-mobile-backdrop";
      mobileBackdrop.setAttribute("aria-hidden", "true");
      document.body.appendChild(mobileBackdrop);
    }

    const openMobileMenu = () => {
      mobileMenu?.classList.add("open");
      mobileMenu?.setAttribute("aria-hidden", "false");
      mobileBackdrop.classList.add("open");
      mobileBackdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeMobileMenu = () => {
      mobileMenu?.classList.remove("open");
      mobileMenu?.setAttribute("aria-hidden", "true");
      mobileBackdrop.classList.remove("open");
      mobileBackdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.getElementById("mobileMenuBtn")?.addEventListener("click", openMobileMenu);
    document.getElementById("mobileMenuClose")?.addEventListener("click", closeMobileMenu);
    mobileBackdrop.addEventListener("click", closeMobileMenu);

    if (window.VedVigyanCart && typeof window.VedVigyanCart.renderCartBadge === "function") {
      window.VedVigyanCart.renderCartBadge();
    }
    if (window.VedVigyanWishlist && typeof window.VedVigyanWishlist.renderWishlistBadge === "function") {
      window.VedVigyanWishlist.renderWishlistBadge();
    }
  }

  /* ─── Hero Banner Carousel ─── */
  function initHeroCarousel() {
    const track = document.getElementById("heroTrack");
    const dotsWrap = document.getElementById("heroDots");
    if (!track) return;

    if (!track.children.length) {
      track.innerHTML = HERO_SLIDES.map((slide, i) => `
        <a class="hero__slide dh-hero-slide" href="${slide.href}">
          <picture>
            <source media="(max-width:767px)" srcset="${slide.mobileImg || slide.img}">
            <img class="hero__img" src="${slide.img}" alt="${slide.alt}" loading="${i === 0 ? "eager" : "lazy"}" fetchpriority="${i === 0 ? "high" : "low"}" width="1300" height="540" />
          </picture>
        </a>
      `).join("");
    }

    let index = 0;
    const slides = track.children;

    function goTo(n) {
      index = n;
      track.scrollTo({ left: track.clientWidth * n, behavior: "smooth" });
      dotsWrap?.querySelectorAll("button").forEach((d, i) => {
        if (i === n) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    }

    if (dotsWrap && slides.length) {
      dotsWrap.innerHTML = Array.from(slides).map((_, i) =>
        `<button type="button" aria-label="Slide ${i + 1}"${i === 0 ? ' aria-current="true"' : ""}></button>`
      ).join("");
      dotsWrap.querySelectorAll("button").forEach((btn, i) => {
        btn.addEventListener("click", () => goTo(i));
      });
    }

    if (slides.length > 1) {
      setInterval(() => goTo((index + 1) % slides.length), 5000);
    }
  }

  function renderLuxuryProductCard(p) {
    const price = window.VedVigyanCart?.formatINR(p.price) || `₹${p.price}`;
    const oldPrice = p.originalPrice > p.price
      ? window.VedVigyanCart?.formatINR(p.originalPrice)
      : "";
    const discount = p.discountPercent || (p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0);
    const reviewCount = 40 + (p.id.charCodeAt(p.id.length - 1) * 17) % 200;
    const ratingVal = p.rating ? p.rating.toFixed(1) : "5.0";

    const qty = window.VedVigyanCart?.getItemQty(p.id) || 0;
    const cartBtn = qty
      ? `<div class="qty qty-card" data-card-qty="${p.id}" style="width:100%; margin-top:8px;">
           <button type="button" data-card-dec="${p.id}" aria-label="Decrease">−</button>
           <span>${qty}</span>
           <button type="button" data-card-inc="${p.id}" aria-label="Increase">+</button>
         </div>`
      : `<button class="btn btn--sm btn--block dh-cart-btn" type="button" data-add-to-cart="${p.id}" style="background:#8a1a23; color:#ffffff; border-radius:10px; padding:9px 12px; width:100%; font-weight:700; font-size:12.5px; border:none; margin-top:8px; cursor:pointer;">Add to cart</button>`;

    return `
      <div class="product-card lux-product-card" data-product-id="${p.id}" style="background:#FDF9F1; border:1px solid #ead9bd; border-radius:12px; overflow:hidden;">
        <a class="product-card__media lux-product-media" href="${p.url}">
          <img src="${p.image}" alt="${p.imageAlt || p.name}" loading="lazy" width="400" height="400" />
        </a>
        <div class="product-card__body lux-product-body" style="padding:12px 10px 10px; text-align:center;">
          <a href="${p.url}"><div class="product-card__title" style="font-size:12px; font-weight:600; color:#1a1a1a; line-height:1.3; margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.name}</div></a>
          <div class="product-card__rating" style="display:flex; align-items:center; justify-content:center; gap:6px; margin:2px 0 6px;">
            <span style="color:#efe3d3; font-size:12px; letter-spacing:1px; position:relative; display:inline-block;">
              ★★★★★
              <span style="position:absolute; left:0; top:0; overflow:hidden; white-space:nowrap; color:#F76A00; width:100%">★★★★★</span>
            </span>
            <span style="font-size:11.5px; font-weight:700; color:#470601">${ratingVal}</span>
            <span style="font-size:11.5px; color:#8a8474">(${reviewCount})</span>
          </div>
          <div class="product-card__certs" style="display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:8px;">
            <img src="https://cdn.shopify.com/s/files/1/0790/4988/3955/files/image_325.png?v=1771487474" alt="Certified" width="36" height="20" style="height:20px; width:auto;" />
            <img src="https://cdn.shopify.com/s/files/1/0790/4988/3955/files/image_326.png?v=1771487540" alt="Govt Lab" width="36" height="20" style="height:20px; width:auto;" />
            <img src="https://cdn.shopify.com/s/files/1/0790/4988/3955/files/image_327.png?v=1771487541" alt="Original" width="36" height="20" style="height:20px; width:auto;" />
          </div>
          <div class="product-card__price" style="display:flex; justify-content:center; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:4px;">
            ${discount ? `<span class="off" style="background:#43A047; color:#fff; font-size:10px; font-weight:800; border-radius:999px; padding:3px 9px;">${discount}% OFF</span>` : ""}
            ${oldPrice ? `<span class="was" style="text-decoration:line-through; font-size:13px; color:#9b9b9b;">${oldPrice}</span>` : ""}
            <span class="now" style="font-size:15.5px; font-weight:800; color:#111;">${price}</span>
          </div>
          ${cartBtn}
        </div>
      </div>
    `;
  }

  /* ─── Shop by Collection Tabs ─── */
  let activeCollectionTabIdx = 0;

  function initCollectionTabs() {
    const tabsEl = document.getElementById("collectionTabs");
    const panelsEl = document.getElementById("collectionPanels");
    if (!tabsEl || !panelsEl) return;

    const products = window.VED_VIGYAN_DATA?.products || [];
    if (!products.length) return;

    tabsEl.innerHTML = COLLECTION_TABS.map((tab, i) =>
      `<button type="button" role="tab" class="${i === activeCollectionTabIdx ? "is-active" : ""}" data-pc-tab="${i}" aria-selected="${i === activeCollectionTabIdx}">${tab.label}</button>`
    ).join("");

    panelsEl.innerHTML = COLLECTION_TABS.map((tab, i) => {
      let items = products.filter(tab.filter);
      if (tab.label === "Best Seller") {
        const priorityIds = ["vv_p31", "vv_p13", "vv_p42"];
        const priorityProducts = priorityIds
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean);
        const otherBestSellers = items.filter((p) => !priorityIds.includes(p.id));
        const rest = products.filter((p) => !priorityIds.includes(p.id) && !otherBestSellers.includes(p));
        items = [...priorityProducts, ...otherBestSellers, ...rest].slice(0, 8);
      } else {
        items = items.slice(0, 8);
      }
      const fallback = products.slice(0, 8);
      const list = items.length ? items : fallback;
      const tabUrls = [
        "/shop.html",
        "/collections/zodiac-bracelet",
        "/mala.html",
        "/products/9-mukhi-rudraksh",
        "/gem-stone.html",
        "/rudraksha.html"
      ];
      const viewAllUrl = tabUrls[i] || "/shop.html";

      return `
        <div class="dh-pc-panel${i === activeCollectionTabIdx ? " is-active" : ""}" data-pc-panel="${i}" role="tabpanel">
          <div class="dh-ptrack">${list.map(renderLuxuryProductCard).join("")}</div>
          <div class="view-all-pill" style="text-align: center; margin: 24px 0 12px;">
            <a href="${viewAllUrl}" class="dh-view-all-btn" style="display: inline-flex; align-items: center; justify-content: center; background: #8a1a23; color: #ffffff; font-size: 13.5px; font-weight: 700; padding: 11px 32px; border-radius: 999px; text-decoration: none; box-shadow: 0 4px 14px rgba(138, 26, 35, 0.25); transition: background 0.2s, transform 0.2s;">View All ›</a>
          </div>
        </div>
      `;
    }).join("");

    tabsEl.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.pcTab);
        activeCollectionTabIdx = idx;
        tabsEl.querySelectorAll("button").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        panelsEl.querySelectorAll(".dh-pc-panel").forEach((p) => {
          p.classList.toggle("is-active", Number(p.dataset.pcPanel) === idx);
        });
      });
    });

    panelsEl.querySelectorAll(".dh-ptrack").forEach((grid) => {
      window.VedVigyanCarousel?.bindCarouselEvents(grid);
      window.VedVigyanCart?.wireAddToCartButtons(grid);
      window.VedVigyanWishlist?.wireWishlistButtons?.(grid);
      window.VedVigyanWishlist?.updateWishButtons?.(grid);
      wireProductGridEvents(grid);
    });
  }

  function wireProductGridEvents(grid) {
    grid.querySelectorAll("[data-card-inc]").forEach((b) => {
      b.addEventListener("click", () => window.VedVigyanCart.changeQty(b.getAttribute("data-card-inc"), 1));
    });
    grid.querySelectorAll("[data-card-dec]").forEach((b) => {
      b.addEventListener("click", () => window.VedVigyanCart.changeQty(b.getAttribute("data-card-dec"), -1));
    });
    grid.querySelectorAll("[data-quickview]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(btn.getAttribute("data-quickview"));
      });
    });
  }

  /* ─── Hero Particles & Parallax ─── */
  function initHero() {
    initHeroCarousel();
    const container = document.getElementById("heroParticles");
    if (container) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "lux-particle";
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        p.style.animationDuration = `${6 + Math.random() * 6}s`;
        p.style.width = p.style.height = `${2 + Math.random() * 4}px`;
        container.appendChild(p);
      }
    }

    const heroVisual = document.getElementById("heroVisual");
    if (heroVisual && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      window.addEventListener("mousemove", (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        heroVisual.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      }, { passive: true });
    }
  }

  /* ─── Animated Counters ─── */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const isDecimal = el.dataset.decimal === "true";
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = isDecimal
          ? current.toFixed(1) + suffix
          : Math.floor(current).toLocaleString("en-IN") + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
  }

  /* ─── Static Sections ─── */
  function renderCategories() {
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map((cat) => `
      <a class="lux-cat-card lux-reveal" href="${cat.href}">
        <img src="${cat.img}" alt="${cat.title}" loading="lazy" width="400" height="533" />
        <div class="lux-cat-overlay">
          <div class="lux-cat-icon" aria-hidden="true">${cat.icon}</div>
          <h3 class="lux-cat-title">${cat.title}</h3>
          <p class="lux-cat-desc">${cat.desc}</p>
        </div>
      </a>
    `).join("");
  }

  function renderPurpose() {
    const grid = document.getElementById("purposeGrid");
    if (!grid) return;
    grid.innerHTML = PURPOSES.map((p) => `
      <a class="lux-purpose-item lux-reveal" href="${p.href}">
        <div class="lux-purpose-circle">
          <img src="${p.img}" alt="${p.label}" loading="lazy" width="120" height="120" />
        </div>
        <span class="lux-purpose-label">${p.label}</span>
      </a>
    `).join("");
  }

  function renderReviews() {
    const grid = document.getElementById("reviewsGrid");
    if (!grid) return;

    const CHAR_LIMIT = 75;

    grid.innerHTML = REVIEWS.map((r, index) => {
      const isLong = r.text.length > CHAR_LIMIT;
      const snippet = isLong ? r.text.slice(0, CHAR_LIMIT) + "..." : r.text;

      return `
        <article class="lux-review-card lux-reveal" data-index="${index}">
          <div class="lux-review-header">
            <img class="lux-review-avatar" src="${r.avatar}" alt="${r.name}" width="48" height="48" loading="lazy" />
            <div class="lux-review-meta">
              <b>${r.name}</b>
              <span>${r.location}</span>
              ${r.verified ? '<span class="lux-verified">✓ Verified Purchase</span>' : ""}
            </div>
          </div>
          <div class="lux-review-stars" aria-label="${r.rating} out of 5 stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
          <div class="lux-review-body">
            <p class="lux-review-text" id="review-text-${index}">${snippet}</p>
            ${isLong ? `<button class="lux-read-more-btn" data-index="${index}" aria-expanded="false">...Read More</button>` : ""}
          </div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll(".lux-read-more-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(btn.dataset.index);
        const textElem = document.getElementById(`review-text-${idx}`);
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        const r = REVIEWS[idx];

        if (isExpanded) {
          textElem.textContent = r.text.slice(0, CHAR_LIMIT) + "...";
          btn.setAttribute("aria-expanded", "false");
          btn.textContent = "...Read More";
        } else {
          textElem.textContent = r.text;
          btn.setAttribute("aria-expanded", "true");
          btn.textContent = "Read Less";
        }
      });
    });

    initReviewsCarousel();
  }

  function initReviewsCarousel() {
    const container = document.getElementById("reviewsTrackContainer");
    const prevBtn = document.getElementById("reviewsPrev");
    const nextBtn = document.getElementById("reviewsNext");
    if (!container) return;

    let autoScrollTimer = null;
    let isHovered = false;

    function autoStep() {
      if (isHovered || !container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 1, behavior: "auto" });
      }
    }

    function startAutoScroll() {
      stopAutoScroll();
      autoScrollTimer = setInterval(autoStep, 25);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    const wrapper = container.parentElement;
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => { isHovered = true; });
      wrapper.addEventListener("mouseleave", () => { isHovered = false; });
      wrapper.addEventListener("touchstart", () => { isHovered = true; }, { passive: true });
      wrapper.addEventListener("touchend", () => { isHovered = false; }, { passive: true });
    }

    startAutoScroll();

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        container.scrollBy({ left: -320, behavior: "smooth" });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        container.scrollBy({ left: 320, behavior: "smooth" });
      });
    }
  }

  function renderBlog() {
    const grid = document.getElementById("blogGrid");
    if (!grid) return;
    grid.innerHTML = BLOG_POSTS.slice(0, 3).map((post) => `
      <a class="lux-blog-card lux-reveal" href="${post.href}">
        <div class="lux-blog-thumb">
          <img src="${post.img}" alt="${post.title}" loading="lazy" width="400" height="250" />
        </div>
        <div class="lux-blog-body">
          <div class="lux-blog-tag">${post.tag}</div>
          <h3 class="lux-blog-title">${post.title}</h3>
          <p class="lux-blog-excerpt">${post.excerpt}</p>
      </div>
      </a>
    `).join("");
  }

  function renderInstagram() {
    const grid = document.getElementById("instaGrid");
    if (!grid) return;
    grid.innerHTML = INSTA_IMAGES.map((src, i) => `
      <div class="lux-insta-item lux-reveal">
        <img src="${src}" alt="Ved Vigyan Instagram post ${i + 1}" loading="lazy" width="300" height="${200 + (i % 3) * 80}" />
        <div class="lux-insta-overlay" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </div>
      </div>
    `).join("");
  }

  /* ─── Product Cards ─── */
  function renderStars(rating) {
    const full = Math.round(rating || 0);
    return `${"★".repeat(full)}${"☆".repeat(Math.max(0, 5 - full))}`;
  }

  function renderLuxuryProductCard(p) {
    if (window.VedVigyanLux?.renderProductCard) {
      return window.VedVigyanLux.renderProductCard(p);
    }
    const reviewCount = 40 + (p.id.charCodeAt(p.id.length - 1) * 17) % 200;
    const price = window.VedVigyanCart?.formatINR(p.price) || `₹${p.price}`;
    const oldPrice = p.originalPrice > p.price
      ? window.VedVigyanCart?.formatINR(p.originalPrice)
      : "";

    const carouselHtml = window.VedVigyanCarousel
      ? window.VedVigyanCarousel.renderCarouselHtml(p)
      : `<img src="${p.image}" alt="${p.imageAlt || p.name}" loading="lazy" width="400" height="400" />`;

    const qty = window.VedVigyanCart?.getItemQty(p.id) || 0;
    const cartBtn = qty
      ? `<div class="qty qty-card" data-card-qty="${p.id}">
           <button type="button" data-card-dec="${p.id}" aria-label="Decrease">−</button>
           <span>${qty}</span>
           <button type="button" data-card-inc="${p.id}" aria-label="Increase">+</button>
         </div>`
      : `<button class="lux-btn lux-btn-secondary lux-btn-sm" type="button" data-add-to-cart="${p.id}">Add to Cart</button>`;

    const buyNowBtn = `<button class="lux-btn lux-btn-primary lux-btn-sm" type="button" data-buy-now="${p.id}">Buy Now</button>`;

    const discountFlag = p.discountPercent
      ? `<span class="lux-product-discount-flag">${p.discountPercent}% OFF</span>`
      : "";

    return `
      <article class="lux-product-card lux-reveal" data-product-id="${p.id}">
        <a class="lux-product-media" href="${p.url}">
          ${carouselHtml}
          ${discountFlag}
          <div class="lux-product-actions-float">
            <button class="lux-product-action-btn" type="button" data-wishlist="${p.id}" aria-label="Add to wishlist">♡</button>
          </div>
        </a>
        <div class="lux-product-body">
          <div class="lux-product-rating">
            <span class="stars" aria-hidden="true">${renderStars(p.rating)}</span>
            <span class="count">(${reviewCount})</span>
          </div>
          <h3 class="lux-product-name"><a href="${p.url}">${p.name}</a></h3>
          <div class="lux-product-price-row">
            ${oldPrice ? `<span class="lux-product-old-price">${oldPrice}</span>` : ""}
            <span class="lux-product-price">${price}</span>
            ${p.discountPercent ? `<span class="lux-product-discount">${p.discountPercent}% OFF</span>` : ""}
          </div>
          <div class="lux-product-footer">
            ${cartBtn}
            ${buyNowBtn}
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;

    const products = window.VED_VIGYAN_DATA?.products || [];

    const priorityIds = ["vv_p31", "vv_p13", "vv_p42"];
    const priorityProducts = priorityIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

    const remaining = products.filter(
      (p) =>
        !priorityIds.includes(p.id) &&
        !p.name.toLowerCase().includes("money magnet") &&
        !p.slug.toLowerCase().includes("money-magnet")
    );

    const featured = [...priorityProducts, ...remaining].slice(0, 8);

    grid.innerHTML = featured.map(renderLuxuryProductCard).join("");

    window.VedVigyanCarousel?.bindCarouselEvents(grid);
    window.VedVigyanCart?.wireAddToCartButtons(grid);
    window.VedVigyanWishlist?.wireWishlistButtons?.(grid);
    window.VedVigyanWishlist?.updateWishButtons?.(grid);

    grid.querySelectorAll("[data-card-inc]").forEach((b) => {
      b.addEventListener("click", () => window.VedVigyanCart.changeQty(b.getAttribute("data-card-inc"), 1));
    });
    grid.querySelectorAll("[data-card-dec]").forEach((b) => {
      b.addEventListener("click", () => window.VedVigyanCart.changeQty(b.getAttribute("data-card-dec"), -1));
    });

    grid.querySelectorAll("[data-quickview]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(btn.getAttribute("data-quickview"));
      });
    });
  }

  function openQuickView(productId) {
    const product = window.VED_VIGYAN_DATA?.products?.find((p) => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("quickView");
    const panel = document.getElementById("quickViewPanel");
    if (!modal || !panel) return;

    const price = window.VedVigyanCart?.formatINR(product.price) || `₹${product.price}`;
    const img = product.images?.[0] || product.image;

    panel.innerHTML = `
      <button class="lux-quickview-close" type="button" id="qvClose" aria-label="Close">×</button>
      <div style="background:var(--ivory);">
        <img src="${img}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;min-height:300px;" />
      </div>
      <div style="padding:32px;">
        <div class="lux-product-rating" style="margin-bottom:12px;">
          <span class="stars">${renderStars(product.rating)}</span>
          <span>${product.rating}/5</span>
        </div>
        <h2 style="font-family:var(--font-display);font-size:28px;color:var(--maroon);margin:0 0 12px;">${product.name}</h2>
        <p style="color:var(--muted);margin:0 0 20px;line-height:1.7;">${product.short}</p>
        <div class="lux-product-price" style="font-size:28px;margin-bottom:24px;">${price}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="lux-btn lux-btn-primary" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
          <a class="lux-btn lux-btn-secondary" href="${product.url}">Full Details</a>
        </div>
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    window.VedVigyanCart?.wireAddToCartButtons(panel);

    panel.querySelector("#qvClose")?.addEventListener("click", closeQuickView);
  }

  function closeQuickView() {
    const modal = document.getElementById("quickView");
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
  }

  document.getElementById("quickView")?.addEventListener("click", (e) => {
    if (e.target.id === "quickView") closeQuickView();
  });

  /* ─── Scroll Reveal ─── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".lux-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach((el) => observer.observe(el));
  }

  /* ─── Certifications Animation ─── */
  function initCerts() {
    const items = document.querySelectorAll("[data-cert]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 100);
        }
      });
    }, { threshold: 0.3 });
    items.forEach((item) => observer.observe(item));
  }

  /* ─── Magnetic Buttons ─── */
  function initMagneticButtons() {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ─── Ripple Effect ─── */
  function initRipple() {
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
  }

  /* ─── Back to Top with Progress ─── */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    const ring = document.getElementById("backTopRing");
    if (!btn) return;

    const circumference = 157;

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      btn.classList.toggle("visible", scrollTop > 400);
      if (ring) {
        ring.style.strokeDashoffset = `${circumference - progress * circumference}`;
      }
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─── GSAP Animations ─── */
  function initGSAP() {
    if (typeof gsap === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".lux-hero-compact > *", {
      y: 24,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2,
      clearProps: "transform"
    });

    if (typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".lux-section-title").forEach((title) => {
      if (title.closest(".lux-hero")) return;
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: "top 85%" },
        y: 24,
        duration: 0.7,
        ease: "power2.out",
        clearProps: "transform"
      });
    });
  }

  /* ─── Newsletter ─── */
  function initNewsletter() {
    document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = "Thank you for subscribing! Welcome to the Ved Vigyan family.";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3500);
      }
      e.target.reset();
    });
  }

  /* ─── Cart Re-render ─── */
  function initCartListener() {
    window.addEventListener("vedvigyan:cart-updated", () => {
      initCollectionTabs();
    });
  }

  /* ─── Init ─── */
  function init() {
    window.VedVigyanHome = {
      renderLuxuryProductCard: renderLuxuryProductCard
    };

    document.querySelectorAll(".lux-hero-compact > *").forEach((el) => {
      el.style.opacity = "1";
      el.style.visibility = "visible";
    });

    initAnnouncement();
    initNav();
    initHero();
    initCounters();
    renderCategories();
    renderProducts();
    renderPurpose();
    renderReviews();
    renderBlog();
    renderInstagram();
    initCollectionTabs();
    initScrollReveal();
    initCerts();
    initMagneticButtons();
    initRipple();
    initBackToTop();
    initNewsletter();
    initCartListener();

    if (document.readyState === "complete") {
      initGSAP();
    } else {
      window.addEventListener("load", initGSAP);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

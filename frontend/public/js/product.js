function getSlugFromPath() {
  const params = new URLSearchParams(window.location.search);
  const slugParam = params.get("slug");
  if (slugParam) return slugParam;
  const path = window.location.pathname.replace(/\/+$/, "");
  const file = path.split("/").pop() || "";
  return file.replace(/\.html$/i, "");
}

function getCategoryFromPath() {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  if (categoryParam) return categoryParam;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : "";
}

function saveRecentlyViewed(product) {
  const key = "ved_vigyan_recently_viewed_v1";
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const next = [product, ...existing.filter((item) => item.id !== product.id)].slice(0, 4);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // Ignore localStorage issues.
  }
}

function getRecentlyViewed(currentId) {
  const key = "ved_vigyan_recently_viewed_v1";
  try {
    return JSON.parse(localStorage.getItem(key) || "[]").filter((item) => item.id !== currentId);
  } catch {
    return [];
  }
}

function getRelatedProducts(product, products, limit = 12) {
  if (!product || !Array.isArray(products) || !products.length) return [];

  const currentId = product.id;
  const currentCat = (product.category || "").toLowerCase();
  const currentName = (product.name || "").toLowerCase();
  const currentTags = Array.isArray(product.tags) ? product.tags : [];

  let seed = 0;
  for (let i = 0; i < (currentId || "").length; i++) {
    seed = (seed * 31 + currentId.charCodeAt(i)) % 10007;
  }

  const scored = products
    .filter((candidate) => candidate.id !== currentId)
    .map((candidate) => {
      const candCat = (candidate.category || "").toLowerCase();
      const candName = (candidate.name || "").toLowerCase();
      const candTags = Array.isArray(candidate.tags) ? candidate.tags : [];

      let score = 0;

      // Category match
      if (candCat && candCat === currentCat) {
        score += 15;
      }

      // Keyword / Type match
      const types = ["mukhi", "mala", "bracelet", "tree", "zodiac", "pendant", "karungali", "tulsi", "sphatik"];
      for (const t of types) {
        if (currentName.includes(t) && candName.includes(t)) {
          score += 8;
        }
      }

      // Tag overlap
      const tagOverlap = candTags.filter((tag) => currentTags.includes(tag)).length;
      score += tagOverlap * 3;

      // Pseudo-random tie breaker per product ID
      let tieBreaker = 0;
      for (let i = 0; i < (candidate.id || "").length; i++) {
        tieBreaker = (tieBreaker * 17 + candidate.id.charCodeAt(i)) % 100;
      }
      const finalScore = score * 100 + ((seed + tieBreaker) % 90);

      return { product: candidate, score: finalScore };
    })
    .sort((a, b) => b.score - a.score);

  let result = scored.map((entry) => entry.product);

  if (result.length < limit) {
    const remaining = products.filter((c) => c.id !== currentId && !result.find((r) => r.id === c.id));
    result = [...result, ...remaining];
  }

  return result.slice(0, limit);
}

function createRecommendationCard(product, label) {
  if (window.VedVigyanLux?.renderProductCard) {
    return window.VedVigyanLux.renderProductCard(product, { reveal: false });
  }
  const fullStars = Math.round(product.rating || 0);
  const stars = `${"★".repeat(fullStars)}${"☆".repeat(Math.max(0, 5 - fullStars))}`;
  const thumbClass = product.imageLayout === "portrait" ? "thumb thumb-portrait" : "thumb";
  const thumbStyle = product.imageLayout === "portrait"
    ? ` style="--thumb-focus:${product.imageFocus || "center"}"`
    : "";
  const priceBlock = product.originalPrice && product.originalPrice > product.price
    ? `
        <div class="rating-row">
          <span class="stars" aria-hidden="true">${stars}</span>
          <span class="rating-text">${product.rating}/5</span>
        </div>
        <div class="price-stack">
          <div class="price">${window.VedVigyanCart.formatINR(product.price)}</div>
          <div class="price-meta">
            <span class="old-price">${window.VedVigyanCart.formatINR(product.originalPrice)}</span>
            <span class="discount-badge">${product.discountPercent}% OFF</span>
          </div>
        </div>
      `
    : `<div class="price">${window.VedVigyanCart.formatINR(product.price)}</div>`;

  return `
    <article class="recommend-card">
      <div class="${thumbClass}"${thumbStyle}>
        <img src="${product.image}" alt="${product.imageAlt}" width="240" height="180" loading="lazy">
      </div>
      <div class="body">
        <div class="eyebrow">${label}</div>
        <h3>${product.name}</h3>
        <p class="sub" style="margin:0">${product.short}</p>
        ${priceBlock}
        <div class="actions" style="display:flex;gap:6px;flex-wrap:wrap;">
          <a class="btn small" href="${product.url}">Open</a>
          <button class="btn small secondary" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
          <button class="btn small primary" type="button" data-buy-now="${product.id}">Buy Now</button>
        </div>
      </div>
    </article>
  `;
}

function renderDiscoveryRail(product, products) {
  const relatedGrid = document.getElementById("relatedGrid");
  if (relatedGrid) {
    const related = getRelatedProducts(product, products, 12);
    const recent = getRecentlyViewed(product.id).slice(0, 4);
    const combined = [
      ...related,
      ...recent.filter((item) => !related.find((r) => r.id === item.id))
    ].slice(0, 12);

    if (combined.length) {
      relatedGrid.innerHTML = combined
        .map((item) => window.VedVigyanLux?.renderProductCard(item) || createRecommendationCard(item, "Related"))
        .join("");
      window.VedVigyanLux?.wireProductGrid(relatedGrid);
    }
    return;
  }

  const host = document.querySelector(".pagecard");
  if (!host || document.getElementById("productDiscoveryRail")) return;

  const related = getRelatedProducts(product, products, 12);
  const recent = getRecentlyViewed(product.id).slice(0, 4);
  const combined = [
    ...related.map((item) => ({ item, label: "Related pick" })),
    ...recent.map((item) => ({ item, label: "Recently viewed" }))
  ].slice(0, 12);

  if (!combined.length) return;

  const section = document.createElement("section");
  section.id = "productDiscoveryRail";
  section.className = "discovery-rail";
  section.innerHTML = `
    <div class="section-head" style="margin-top:18px">
      <div>
        <h2 class="section-title">You May Also Like</h2>
        <p class="section-sub">Helpful picks based on this product and your recent browsing.</p>
      </div>
    </div>
    <div class="recommend-grid">
      ${combined.map(({ item, label }) => createRecommendationCard(item, label)).join("")}
    </div>
  `;

  host.appendChild(section);
  window.VedVigyanCart.wireAddToCartButtons(section);
}

let renderRetryCount = 0;
let isFetchingFallback = false;

function renderProductPage() {
  const data = window.VED_VIGYAN_DATA;
  const products = data?.products || [];
  if (!products.length) {
    renderRetryCount++;
    if (renderRetryCount < 30) {
      setTimeout(renderProductPage, 50);
      return;
    }
    if (!isFetchingFallback) {
      isFetchingFallback = true;
      fetch("/public/js/data.js")
        .then((res) => res.text())
        .then((code) => {
          try {
            new Function(code)();
            if (window.VED_VIGYAN_DATA?.products?.length) {
              renderProductPage();
            }
          } catch (e) {}
        })
        .catch(() => {});
    }
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  let slug = getSlugFromPath();
  const category = getCategoryFromPath();

  // If navigating to generic bracelet page without specific product ID, redirect to shop bracelet collection
  if (!idParam && (slug === "rudraksha-bracelet" || slug === "product") && window.location.pathname.includes("/bracelet/")) {
    window.location.href = "/collections/zodiac-bracelet";
    return;
  }

  let product = null;
  const cleanSlug = (slug || "").toLowerCase().trim();

  // 1. Direct ID Match (e.g. vv_p07, vv_p30)
  if (idParam) {
    product = products.find((p) => p.id === idParam);
  }

  // 2. Exact ID / Slug Match
  if (!product && cleanSlug) {
    product = products.find((p) => p.id.toLowerCase() === cleanSlug || (p.slug && p.slug.toLowerCase() === cleanSlug));
  }

  // 3. Exact Normalized Name Match
  if (!product && cleanSlug) {
    product = products.find((p) => {
      const normName = (p.name || "").toLowerCase().replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return normName === cleanSlug;
    });
  }

  // 4. Smart Token-Based Fuzzy Match (Handles typos like "braclet", "rudrakasha", "jap", missing words)
  if (!product && cleanSlug) {
    const searchTokens = cleanSlug.split("-").map(t => {
      if (t === "braclet") return "bracelet";
      if (t === "rudrakasha") return "rudraksha";
      if (t === "jap") return "jaap";
      return t;
    }).filter(t => t.length > 1);

    let maxScore = 0;
    let bestMatch = null;

    products.forEach((p) => {
      const pNameNorm = (p.name || "").toLowerCase();
      const pSlugNorm = (p.slug || "").toLowerCase();
      const pTagsNorm = (p.tags || []).join(" ").toLowerCase();
      const haystack = `${p.id.toLowerCase()} ${pNameNorm} ${pSlugNorm} ${pTagsNorm}`;

      let score = 0;
      searchTokens.forEach((token) => {
        if (haystack.includes(token)) {
          score += (token.length >= 4 ? 3 : 1);
        }
      });

      if (score > maxScore) {
        maxScore = score;
        bestMatch = p;
      }
    });

    if (maxScore >= 3 && bestMatch) {
      product = bestMatch;
    }
  }

  // 5. Category Fallback
  if (!product && category) {
    product = products.find((p) => p.category === category);
  }

  // 6. Default Catalog Item
  if (!product) {
    product = products[0];
  }
  if (!product) return;
  saveRecentlyViewed(product);

  try {
    initPDPReviewSlider(product);
  } catch (err) {
    console.warn("Review slider init failed:", err);
  }

  const isLuxPdp = document.body.dataset.luxPage === "product";

  const titleEl = document.getElementById("productTitle");
  const priceEl = document.getElementById("productPrice");
  const descEl = document.getElementById("productDesc");
  const imgEl = document.getElementById("productImg");
  const bulletsEl = document.getElementById("productBullets");
  const addBtn = document.getElementById("addToCartBtn");
  const buyBtn = document.getElementById("buyNowBtn");
  const wishBtn = document.querySelector("[data-wishlist]");

  if (addBtn) addBtn.setAttribute("data-add-to-cart", product.id);
  if (buyBtn) buyBtn.setAttribute("data-buy-now", product.id);
  window.VedVigyanCart.wireAddToCartButtons(document);

  const freeGiftBox = document.getElementById("freeGiftBox");
  const freeGiftSubtitle = document.getElementById("freeGiftSubtitle");
  const giftCheckbox = document.getElementById("claimFreeGift");

  if (freeGiftBox && freeGiftSubtitle) {
    const isClaimed = window.VedVigyanCart.isFreeGiftClaimed();
    if (isClaimed) {
      if (giftCheckbox) giftCheckbox.checked = true;
      freeGiftSubtitle.innerHTML = `<strong style="color:#27ae60; font-weight:700;">✓ Free gift already claimed in your cart!</strong> (Only 1 free gift per order)`;
    } else {
      if (giftCheckbox) giftCheckbox.checked = false;
      if (product.price >= 999) {
        freeGiftSubtitle.innerHTML = `<strong style="color:#8a1a23; font-weight:800;">Included FREE</strong> with this order (Applicable on orders ₹999 &amp; above)`;
      } else {
        freeGiftSubtitle.innerHTML = `FREE on orders ₹999 &amp; above (Add more items to reach ₹999 at checkout)`;
      }
    }

    if (giftCheckbox && !giftCheckbox.__vv_bound) {
      giftCheckbox.__vv_bound = true;
      giftCheckbox.addEventListener("change", () => {
        if (giftCheckbox.checked && window.VedVigyanCart.isFreeGiftClaimed()) {
          window.VedVigyanCart.toast("Only 1 free gift can be claimed per order!");
        }
      });
    }
  }
  const breadcrumbEl = document.getElementById("pdpBreadcrumb");
  const ratingEl = document.getElementById("pdpRating");
  const detailsEl = document.getElementById("pdpDetails");
  const galleryEl = document.getElementById("pdpGallery");

  if (breadcrumbEl) breadcrumbEl.textContent = product.name;
  if (titleEl) titleEl.textContent = product.name;

  const fullStars = Math.round(product.rating || 0);
  const stars = `${"★".repeat(fullStars)}${"☆".repeat(Math.max(0, 5 - fullStars))}`;
  const reviewCount = 40 + (product.id.charCodeAt(product.id.length - 1) * 17) % 200;

  if (ratingEl) {
    const unitsSold = (1100 + (reviewCount * 13) % 900).toLocaleString();
    ratingEl.innerHTML = `<span class="pdp-stars">${stars}</span><span class="pdp-rating-num">${product.rating || "5.0"}</span><a class="pdp-reviews" href="#dh-reviews">${reviewCount} Reviews</a><span class="pdp-sold">${unitsSold} units sold last week</span>`;
  }

  if (priceEl) {
    const origPrice = product.originalPrice || Math.round(product.price * 1.8);
    const disc = product.discountPercent || Math.round(((origPrice - product.price) / origPrice) * 100);
    priceEl.innerHTML = `
      <span class="now">${window.VedVigyanCart.formatINR(product.price)}</span>
      <span class="was">MRP ${window.VedVigyanCart.formatINR(origPrice)}</span>
      <span class="off">${disc}% + Extra 26% OFF</span>
    `;
  }

  // PDP Quantity Controls
  const qtyInput = document.getElementById("pdpQtyInput");
  const qtyInc = document.getElementById("pdpQtyInc");
  const qtyDec = document.getElementById("pdpQtyDec");
  if (qtyInput && qtyInc && qtyDec) {
    qtyInc.onclick = () => { qtyInput.value = Math.max(1, (parseInt(qtyInput.value) || 1) + 1); };
    qtyDec.onclick = () => { qtyInput.value = Math.max(1, (parseInt(qtyInput.value) || 1) - 1); };
  }

  if (detailsEl) {
    detailsEl.innerHTML = product.detailsHtml || `<p>${product.description}</p>`;
  }

  if (galleryEl && window.VedVigyanCarousel) {
    galleryEl.innerHTML = window.VedVigyanCarousel.renderCarouselHtml(product);
    window.VedVigyanCarousel.bindCarouselEvents(galleryEl);
  } else if (imgEl) {
    const parent = imgEl.parentElement;
    if (parent && window.VedVigyanCarousel) {
      parent.innerHTML = window.VedVigyanCarousel.renderCarouselHtml(product);
      window.VedVigyanCarousel.bindCarouselEvents(parent);
    } else {
      imgEl.src = product.image;
      imgEl.alt = product.imageAlt;
    }
  }

  const certImg = document.getElementById("productCertImg") || document.querySelector(".vv-cert-preview-box img");
  if (certImg) {
    const certSrc = product.certificate || (product.images && product.images.length >= 4 ? product.images[3] : "/product/Ved vigyan products/5 Mukhi Rudraksh/3.webp");
    certImg.src = certSrc;
    certImg.alt = `${product.name} Authenticity Certificate`;
  }

  // 3-Step Sacred Journey section: Show ONLY for Rudraksha & Mala related products
  const journeySection = document.querySelector(".vv-journey-section");
  if (journeySection) {
    const isRudraksha = (
      (product.category && (product.category === "rudraksha" || product.category === "mala" || product.category === "rudraksha-mala")) ||
      (product.name && /rudraksh|mala/i.test(product.name)) ||
      (product.tags && Array.isArray(product.tags) && product.tags.some(t => /rudraksh|mala/i.test(t))) ||
      (product.id && (product.id.includes("rud") || ["vv_p01","vv_p02","vv_p03","vv_p04","vv_p05","vv_p06","vv_p18","vv_p19","vv_p20","vv_p21","vv_p22","vv_p23","vv_p25","vv_p31"].includes(product.id)))
    );
    journeySection.style.display = isRudraksha ? "block" : "none";
  }

  // Update Description, Specification, Benefits, and FAQs tabs for this specific product
  try {
    updatePDPTabs(product);
  } catch (tabErr) {
    console.warn("PDP Tabs update error:", tabErr);
  }

  // Dynamic filesystem scanner fetch
  if (product && product.slug) {
    fetch(`/api/gallery?slug=${product.slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("API failed");
        return response.json();
      })
      .then((data) => {
        if (data && data.certificate) {
          product.certificate = data.certificate;
          if (certImg) certImg.src = data.certificate;
        }

        if (data && Array.isArray(data.images) && data.images.length > 0) {
          const currentImages = product.images || [];
          const isSame = currentImages.length === data.images.length &&
            currentImages.every((val, index) => val === data.images[index]);

          if (!isSame && data.images.length >= currentImages.length) {
            product.images = data.images;
            product.image = data.images[0];

            if (galleryEl && window.VedVigyanCarousel) {
              const oldCarousel = galleryEl.querySelector('.product-carousel');
              if (oldCarousel) delete oldCarousel.__vv_bound;

              galleryEl.innerHTML = window.VedVigyanCarousel.renderCarouselHtml(product);
              window.VedVigyanCarousel.bindCarouselEvents(galleryEl);
            } else if (imgEl) {
              const parent = imgEl.parentElement;
              if (parent && window.VedVigyanCarousel) {
                const oldCarousel = parent.querySelector('.product-carousel');
                if (oldCarousel) delete oldCarousel.__vv_bound;

                parent.innerHTML = window.VedVigyanCarousel.renderCarouselHtml(product);
                window.VedVigyanCarousel.bindCarouselEvents(parent);
              } else {
                imgEl.src = product.image;
              }
            }

            const stickyImg = document.getElementById("stickyImg");
            if (stickyImg) {
              stickyImg.src = product.image;
            }
          }
        }
      })
      .catch((err) => {
        console.warn("Dynamic gallery load failed, utilizing cached images:", err);
      });
  }

  if (bulletsEl && Array.isArray(product.bullets)) {
    bulletsEl.innerHTML = product.bullets.map((b) => `<li>${b}</li>`).join("");
  }

  if (wishBtn) {
    wishBtn.setAttribute("data-wishlist", product.id);
    window.VedVigyanWishlist?.wireWishlistButtons?.(document);
    window.VedVigyanWishlist?.updateWishButtons?.(document);
  }

  initStickyCart(product);

  if (product.seoTitle) document.title = product.seoTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && product.seoDescription) metaDesc.setAttribute("content", product.seoDescription);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", product.url);

  injectProductSchema(product);
  renderDiscoveryRail(product, products);
  initSectionInteractiveHandlers(product);
  initPDPReviewSlider(product);
  window.initPDPTabs?.(product);
  document.querySelectorAll(".lux-reveal").forEach((el) => el.classList.add("visible"));
  window.VedVigyanLux?.initScrollReveal?.();
}

function updatePDPTabs(product) {
  const tabsData = window.VED_VIGYAN_PRODUCT_TABS;
  if (!product) return;

  const data = tabsData ? (tabsData[product.id] || tabsData[product.slug] || tabsData[(product.name || "").toLowerCase().trim().replace(/[()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")]) : null;

  // 1. Description Tab
  const descEl = document.getElementById("productDesc");
  if (descEl) {
    descEl.textContent = (data && data.description) ? data.description : (product.description || product.short || "");
  }

  // 2. Specification Tab
  const specPanel = document.getElementById("tabSpecification");
  if (specPanel) {
    const specs = (data && Array.isArray(data.specs) && data.specs.length)
      ? data.specs
      : [
          { label: "Authenticity & Testing", value: "100% Natural, Government Approved Lab Certified with QR Code Report" },
          { label: "Ritual Energization", value: "Pre-energized via Traditional Vedic Mantra Pran Pratishtha rituals" },
          { label: "Origin & Harvest", value: "Ethically sourced directly from sacred Himalayan regions" },
          { label: "Package Includes", value: `${product.name} + Physical Test Report Certificate + Usage Guide + Sacred Packaging Box` },
          { label: "Care Instructions", value: "Wipe gently with a clean dry cotton cloth. Keep away from perfumes and harsh chemicals." }
        ];

    const rowsHtml = specs.map((s) => `
      <tr>
        <th>${s.label}</th>
        <td>${s.value}</td>
      </tr>
    `).join("");

    specPanel.innerHTML = `
      <div class="pdp-spec-table-wrap">
        <table class="pdp-spec-table">
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // 3. Benefits Tab
  const benefitsGrid = document.getElementById("pdpBenefitsGrid");
  if (benefitsGrid) {
    const benefits = (data && Array.isArray(data.benefits) && data.benefits.length)
      ? data.benefits
      : [
          { icon: "🛡️", title: "Spiritual Protection", desc: "Shields the wearer from negative energies, evil eye, and aura stress." },
          { icon: "🧘", title: "Mental Peace & Focus", desc: "Calms an overactive mind and enhances focus during meditation." },
          { icon: "✨", title: "Chakra Harmonization", desc: "Balances internal energy centers to promote emotional equilibrium." },
          { icon: "💼", title: "Confidence & Growth", desc: "Attracts positive cosmic vibrations, supporting clarity and growth." }
        ];

    benefitsGrid.innerHTML = benefits.map((b) => `
      <div class="pdp-benefit-card">
        <div class="pdp-benefit-icon">${b.icon || "✨"}</div>
        <h4>${b.title}</h4>
        <p>${b.desc}</p>
      </div>
    `).join("");
  }

  // 4. FAQs Tab
  const faqsList = document.getElementById("pdpFaqs");
  if (faqsList) {
    const faqs = (data && Array.isArray(data.faqs) && data.faqs.length)
      ? data.faqs
      : [
          { q: `Is ${product.name} 100% authentic and certified?`, a: "Yes! Every single piece is individually lab tested and comes with a physical test report featuring a QR code for online verification." },
          { q: "How do I wear or use this spiritual item?", a: "All products are pre-energized with Vedic mantras. You can wear it on an auspicious morning after bathing while chanting sacred mantras." },
          { q: "Can anyone wear this regardless of age or gender?", a: "Absolutely! Authentic Rudraksha beads, gemstones, and malas can be worn by anyone irrespective of gender, age, or horoscope." },
          { q: "How long does delivery take?", a: "We dispatch within 24 hours. Express delivery across India takes 3 to 5 business days with full tracking updates via SMS/WhatsApp." }
        ];

    faqsList.innerHTML = faqs.map((f) => `
      <div class="pdp-faq-item">
        <strong>Q: ${f.q || f.question}</strong>
        <p>A: ${f.a || f.answer}</p>
      </div>
    `).join("");
  }
}

window.__pdpReviewsList = [];
window.__pdpCurrentReviewIdx = 0;

function initPDPReviewSlider(product) {
  const pId = product ? product.id : "";
  const pSlug = product ? product.slug : "";
  const reviewsObj = window.VED_VIGYAN_PRODUCT_REVIEWS;
  const customReviews = reviewsObj ? (reviewsObj[pId] || (pSlug && reviewsObj[pSlug])) : null;

  if (customReviews && customReviews.length) {
    window.__pdpReviewsList = customReviews;
  } else {
    const pName = product ? product.name : "Product";
    window.__pdpReviewsList = [
      {
        name: "Aarav Sharma",
        avatar: "A",
        stars: "★★★★★",
        text: `Bohot dino se ${pName} dhoondh raha tha. Finally Ved Vigyan se mila. Government certified — no doubts on authenticity.`
      }
    ];
  }

  window.__pdpCurrentReviewIdx = 0;
  window.updatePDPReviewDisplay();
}

window.updatePDPReviewDisplay = function() {
  const reviews = window.__pdpReviewsList;
  if (!reviews || !reviews.length) return;

  const idx = window.__pdpCurrentReviewIdx;
  const rev = reviews[idx];

  const nameEl = document.getElementById("pdpRevName");
  const avatarEl = document.getElementById("pdpRevAvatar");
  const starsEl = document.getElementById("pdpRevStars");
  const textEl = document.getElementById("pdpRevText");
  const counterEl = document.getElementById("pdpRevCounter");

  if (nameEl) nameEl.textContent = rev.name;
  if (avatarEl) avatarEl.textContent = rev.avatar;
  if (starsEl) starsEl.textContent = rev.stars;
  if (textEl) textEl.textContent = rev.text;
  if (counterEl) counterEl.textContent = `${idx + 1} / ${reviews.length}`;
};

window.changePDPReview = function(delta) {
  const reviews = window.__pdpReviewsList;
  if (!reviews || !reviews.length) return;

  window.__pdpCurrentReviewIdx = (window.__pdpCurrentReviewIdx + delta + reviews.length) % reviews.length;
  window.updatePDPReviewDisplay();
};

window.switchPDPTab = function(btn, evt) {
  if (evt) {
    try { evt.preventDefault(); evt.stopPropagation(); } catch (e) {}
  }
  if (!btn) return;
  const container = btn.closest(".pdp-tabs-section") || document.querySelector(".pdp-tabs-section");
  if (!container) return;

  const targetId = btn.getAttribute("data-tab");
  if (!targetId) return;

  const btns = container.querySelectorAll(".pdp-tab-btn");
  const panels = container.querySelectorAll(".pdp-tab-panel");

  btns.forEach((b) => {
    b.classList.remove("active");
    b.style.color = "#718096";
  });

  panels.forEach((p) => {
    p.classList.remove("active");
    p.style.cssText = "display: none !important;";
  });

  btn.classList.add("active");
  btn.style.color = "#8a1a23";

  const targetPanel = document.getElementById(targetId);
  if (targetPanel) {
    targetPanel.classList.add("active");
    targetPanel.style.cssText = "display: block !important; animation: pdpTabFade 0.35s ease forwards;";
  }
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".pdp-tab-btn");
  if (btn) {
    window.switchPDPTab(btn, e);
  }
});

window.togglePDPFaq = function(headerEl) {
  if (!headerEl) return;
  const item = headerEl.closest(".pdp-faq-accordion-item");
  if (!item) return;

  const isOpen = item.classList.contains("active");
  const accordion = item.closest(".pdp-faq-accordion");

  if (accordion) {
    accordion.querySelectorAll(".pdp-faq-accordion-item").forEach(el => {
      el.classList.remove("active");
      const icon = el.querySelector(".pdp-faq-toggle-icon");
      if (icon) icon.textContent = "+";
    });
  }

  if (!isOpen) {
    item.classList.add("active");
    const icon = item.querySelector(".pdp-faq-toggle-icon");
    if (icon) icon.textContent = "−";
  }
};

window.initPDPTabs = function(product) {
  // Auto-resolve product if omitted
  if (!product && window.VED_VIGYAN_CURRENT_PRODUCT) {
    product = window.VED_VIGYAN_CURRENT_PRODUCT;
  }
  if (!product && window.VED_VIGYAN_DATA?.products) {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get("id");
    if (pId) {
      product = window.VED_VIGYAN_DATA.products.find(p => p.id === pId);
    }
  }

  const container = document.querySelector(".pdp-tabs-section");
  const descEl = document.getElementById("productDesc");

  if (!container || !descEl) {
    if (!window.__pdp_tabs_retry_count) window.__pdp_tabs_retry_count = 0;
    if (window.__pdp_tabs_retry_count < 10) {
      window.__pdp_tabs_retry_count++;
      setTimeout(() => window.initPDPTabs(product), 50);
    }
    return;
  }

  if (!product) return;

  const tabsObj = window.VED_VIGYAN_PRODUCT_TABS;
  const pData = tabsObj ? (tabsObj[product.id] || (product.slug && tabsObj[product.slug])) : null;

  // 1. Description
  if (descEl) {
    const finalDesc = (pData && pData.description) ? pData.description : (product.description || product.short || "Authentic spiritual item ethically sourced and pre-energized with traditional Vedic mantras.");
    descEl.textContent = finalDesc;
  }

  // 2. Specifications Table
  const specPanel = document.getElementById("tabSpecification");
  if (specPanel) {
    const specs = (pData && Array.isArray(pData.specs) && pData.specs.length) ? pData.specs : [
      { label: "Product Name", value: product.name || "Authentic Vedic Product" },
      { label: "Authenticity & Testing", value: "100% Natural, Govt. Approved Lab Certified with QR Report" },
      { label: "Ritual Energization", value: "Pre-energized via Traditional Vedic Mantra Pran Pratishtha" },
      { label: "Origin & Sourcing", value: "Ethically sourced directly from sacred Himalayan regions" },
      { label: "Package Includes", value: "Product + Physical Lab Test Certificate + Usage Guide + Box" },
      { label: "Care Instructions", value: "Wipe gently with clean dry cotton cloth. Keep away from perfumes." }
    ];

    specPanel.innerHTML = `
      <div class="pdp-spec-table-wrap">
        <table class="pdp-spec-table">
          <tbody>
            ${specs.map(s => `
              <tr>
                <th>${s.label}</th>
                <td>${s.value}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // 3. Benefits Grid
  const benefitsGrid = document.getElementById("pdpBenefitsGrid");
  if (benefitsGrid) {
    const benefits = (pData && Array.isArray(pData.benefits) && pData.benefits.length) ? pData.benefits : [
      { title: "Spiritual Protection", desc: "Shields the wearer from negative energies, evil eye, and stressful aura.", icon: "🛡️" },
      { title: "Mental Peace & Focus", desc: "Calms an overactive mind, enhances concentration during meditation.", icon: "🧘" },
      { title: "Chakra Harmonization", desc: "Balances internal energy centers to promote emotional equilibrium.", icon: "✨" },
      { title: "Confidence & Growth", desc: "Attracts positive cosmic vibrations, supporting personal growth & wealth.", icon: "💼" }
    ];

    benefitsGrid.innerHTML = benefits.map(b => `
      <div class="pdp-benefit-card">
        <div class="pdp-benefit-icon">${b.icon || "✨"}</div>
        <h4>${b.title}</h4>
        <p>${b.desc}</p>
      </div>
    `).join("");
  }

  // 4. FAQs List & Accordion
  const faqsEl = document.getElementById("pdpFaqs");
  if (faqsEl) {
    const faqList = (pData && Array.isArray(pData.faqs) && pData.faqs.length) ? pData.faqs : [
      { q: "Is this product 100% authentic and certified?", a: "Yes! Every single piece is individually lab tested and comes with a physical test report featuring a QR code for online verification." },
      { q: "How do I wear or use this spiritual item?", a: "All products are pre-energized with Vedic mantras. You can wear it on an auspicious morning after bathing while chanting sacred mantras." },
      { q: "Can anyone wear this regardless of age or gender?", a: "Absolutely! Authentic Rudraksha beads, gemstones, and malas can be worn by anyone irrespective of gender, age, or horoscope." },
      { q: "How long does delivery take?", a: "We dispatch within 24 hours. Express delivery across India takes 3 to 5 business days with full tracking updates via SMS/WhatsApp." }
    ];

    faqsEl.innerHTML = `
      <div class="pdp-faq-accordion">
        ${faqList.map((faq, idx) => `
          <div class="pdp-faq-accordion-item ${idx === 0 ? 'active' : ''}">
            <div class="pdp-faq-accordion-header" onclick="window.togglePDPFaq(this)">
              <span>Q: ${faq.q}</span>
              <span class="pdp-faq-toggle-icon">${idx === 0 ? '−' : '+'}</span>
            </div>
            <div class="pdp-faq-accordion-body">
              <p>A: ${faq.a}</p>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="pdp-faq-whatsapp-cta">
        <p>💬 Have additional questions about ritual energization or custom guidance?</p>
        <a href="https://wa.me/919876543210?text=Namaste!%20I%20have%20a%20question%20about%20${encodeURIComponent(product.name || 'Ved Vigyan Products')}" target="_blank" rel="noopener" class="pdp-faq-wa-btn">
          Ask on WhatsApp
        </a>
      </div>
    `;
  }
};

document.addEventListener("DOMContentLoaded", () => window.initPDPTabs());
window.addEventListener("load", () => window.initPDPTabs());

function initSectionInteractiveHandlers(product) {
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
        } catch (e) {}
      }
      const iframe = inlinePlayer.querySelector("iframe");
      if (iframe) {
        try { iframe.src = "about:blank"; } catch (e) {}
      }
      inlinePlayer.remove();
    }
  };

  // Inline Video Player for Reels
  const videoCards = document.querySelectorAll("[data-vv-video]");
  videoCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      let src = card.getAttribute("data-vv-video") || "https://youtu.be/o9dREd5ZPhw?si=X2tbKalptHS0wmhD";
      if (!src) return;

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

      document.querySelectorAll(".vv-reel-video-wrap.is-playing").forEach((otherCard) => {
        if (otherCard !== card) {
          stopInlinePlayer(otherCard);
        }
      });

      card.classList.add("is-playing");

      let inlinePlayer = card.querySelector(".vv-inline-player");
      if (!inlinePlayer) {
        inlinePlayer = document.createElement("div");
        inlinePlayer.className = "vv-inline-player";

        if (src.includes("youtube.com") || src.includes("youtu.be")) {
          let embedSrc = src;
          if (src.includes("youtu.be/")) {
            const videoId = src.split("youtu.be/")[1].split("?")[0];
            const urlParams = src.includes("?") ? src.split("?")[1] : "";
            embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1${urlParams ? "&" + urlParams : ""}`;
          } else if (src.includes("youtube.com/embed/")) {
            embedSrc = src.includes("?") ? `${src}&autoplay=1` : `${src}?autoplay=1`;
          } else if (src.includes("youtube.com/watch")) {
            const videoId = new URLSearchParams(src.split("?")[1]).get("v");
            embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
          }
          inlinePlayer.innerHTML = `<iframe src="${embedSrc}" width="100%" height="100%" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%; height:100%; object-fit:cover; border:none;"></iframe>`;
        } else {
          inlinePlayer.innerHTML = `<video src="${src}" autoplay controls playsinline style="width:100%; height:100%; object-fit:cover; display:block;"></video>`;
        }
        card.appendChild(inlinePlayer);
      }
    });
  });

  const closeVideoModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    if (modalPlayer) modalPlayer.innerHTML = "";
  };

  modalClose?.addEventListener("click", closeVideoModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeVideoModal();
  });

  // Bundle & Final Timers
  let endTime = Date.now() + 14 * 60 * 1000 + 32 * 1000;
  function updateTimers() {
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
    const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
    const secs = String(remaining % 60).padStart(2, "0");

    document.querySelectorAll("[data-vv-timer-unit]").forEach((el) => {
      const unit = el.getAttribute("data-vv-timer-unit");
      if (unit === "hours") el.textContent = hours;
      if (unit === "mins") el.textContent = mins;
      if (unit === "secs") el.textContent = secs;
    });

    document.querySelectorAll("[data-gift-timer-mins]").forEach((el) => el.textContent = mins);
    document.querySelectorAll("[data-gift-timer-secs]").forEach((el) => el.textContent = secs);
  }
  setInterval(updateTimers, 1000);
  updateTimers();

  // Wire bundle CTAs to add exact written bundle product to cart
  document.querySelectorAll("[data-vv-bundle-buy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".vv-bundle-card");
      const titleEl = card ? card.querySelector(".vv-bundle-title") : null;
      const priceEl = card ? card.querySelector(".vv-bundle-sale-price") : null;

      const bundleTitle = titleEl ? titleEl.textContent.trim() : "Special Offer Bundle";
      const rawPrice = priceEl ? priceEl.textContent.replace(/[^0-9]/g, "") : "";
      const bundlePrice = rawPrice ? Number(rawPrice) : (product ? product.price : 999);

      const customBundleItem = {
        id: `bundle_${product ? product.id : "vv"}_${bundleTitle.replace(/\W+/g, "_").toLowerCase()}`,
        name: `${product ? product.name : "Ved Vigyan"} (${bundleTitle})`,
        price: bundlePrice,
        image: product ? product.image : "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
        url: window.location.pathname,
        qty: 1
      };

      if (window.VedVigyanCart?.addCustomItemToCart) {
        window.VedVigyanCart.addCustomItemToCart(customBundleItem, true);
      } else if (window.VedVigyanCart?.addToCart) {
        window.VedVigyanCart.addToCart(product ? product.id : "p_rud_5m", 1);
      }

      setTimeout(() => {
        window.location.href = "/checkout.html";
      }, 500);
    });
  });
}

function initStickyCart(product) {
  if (!product) return;

  let wrapper = document.getElementById("pdpStickyWrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "pdpStickyWrapper";
    wrapper.className = "pdp-sticky-wrapper";
    document.body.appendChild(wrapper);
  }

  const origPrice = product.originalPrice || Math.round(product.price * 1.8);

  wrapper.innerHTML = `
    <div class="pdp-sticky-offer-bar">
      FREE 5 Mukhi Rudraksha of ₹499 on prepaid orders
    </div>
    <div class="pdp-sticky-bar">
      <div class="pdp-sticky-price" id="stickyPriceDisplay">
        <span class="now" style="font-size:22px; font-weight:800; color:#1a0809;">${window.VedVigyanCart.formatINR(product.price)}</span>
        <span class="was" style="font-size:13px; color:#888; text-decoration:line-through; margin-left:8px;">MRP ${window.VedVigyanCart.formatINR(origPrice)}</span>
      </div>
      <div class="pdp-sticky-actions">
        <button type="button" class="pdp-sticky-btn-atc" data-add-to-cart="${product.id}">Add to Cart</button>
        <button type="button" class="pdp-sticky-btn-buynow" data-buy-now="${product.id}">Buy Now</button>
      </div>
    </div>
  `;

  window.VedVigyanCart?.wireAddToCartButtons(wrapper);
}

function injectProductSchema(product) {
  if (document.getElementById("productSchema")) return;
  const script = document.createElement("script");
  script.id = "productSchema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 100
    }
  });
  document.head.appendChild(script);
}

function initPDPOfferTimer() {
  const STORAGE_KEY = "ved_vigyan_offer_end_time_v1";
  let targetTime = 0;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      targetTime = parseInt(saved, 10);
    }
  } catch (e) {}

  const now = Date.now();
  if (!targetTime || targetTime <= now) {
    const initialSeconds = (23 * 3600) + (26 * 60) + 55;
    targetTime = now + (initialSeconds * 1000);
    try {
      localStorage.setItem(STORAGE_KEY, targetTime.toString());
    } catch (e) {}
  }

  function updateTimer() {
    const current = Date.now();
    let diff = Math.max(0, Math.floor((targetTime - current) / 1000));

    if (diff <= 0) {
      const resetSeconds = (23 * 3600) + (26 * 60) + 55;
      targetTime = current + (resetSeconds * 1000);
      try {
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
      } catch (e) {}
      diff = resetSeconds;
    }

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const pad = (num) => String(num).padStart(2, "0");

    document.querySelectorAll("[data-count-h], .count-h").forEach(el => {
      el.textContent = pad(hours);
    });
    document.querySelectorAll("[data-count-m], .count-m").forEach(el => {
      el.textContent = pad(minutes);
    });
    document.querySelectorAll("[data-count-s], .count-s").forEach(el => {
      el.textContent = pad(seconds);
    });
  }

  updateTimer();
  if (window.__pdpOfferTimerInterval) {
    clearInterval(window.__pdpOfferTimerInterval);
  }
  window.__pdpOfferTimerInterval = setInterval(updateTimer, 1000);
}

window.initPDPOfferTimer = initPDPOfferTimer;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderProductPage();
    initPDPOfferTimer();
  });
} else {
  renderProductPage();
  initPDPOfferTimer();
}
window.addEventListener("load", initPDPOfferTimer);


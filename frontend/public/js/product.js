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
  if (slug === "rudraksha-bracelet") {
    slug = "gold-rudraksh-bracelet";
  }
  const category = getCategoryFromPath();

  let product = null;
  if (idParam) {
    product = products.find((p) => p.id === idParam);
  }
  if (!product && slug) {
    product = products.find((p) => (p.category === category || !category) && (p.slug === slug || p.slug.includes(slug) || slug.includes(p.slug)));
  }
  if (!product && slug) {
    product = products.find((p) => p.slug === slug || p.slug.includes(slug) || slug.includes(p.slug));
  }
  if (!product && category) {
    product = products.find((p) => p.category === category);
  }
  if (!product) {
    product = products[0];
  }
  if (!product) return;
  saveRecentlyViewed(product);

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
    ratingEl.innerHTML = `<span class="stars">${stars}</span><span>${product.rating}</span><span class="count">(${reviewCount} reviews)</span>`;
  }

  if (priceEl) {
    priceEl.innerHTML = product.originalPrice && product.originalPrice > product.price
      ? `
          <span class="lux-product-price">${window.VedVigyanCart.formatINR(product.price)}</span>
          <span class="lux-product-old-price">${window.VedVigyanCart.formatINR(product.originalPrice)}</span>
          <span class="lux-product-discount">${product.discountPercent}% OFF</span>
        `
      : `<span class="lux-product-price">${window.VedVigyanCart.formatINR(product.price)}</span>`;
  }

  if (descEl) descEl.textContent = isLuxPdp ? product.short : product.description;
  if (detailsEl) {
    detailsEl.innerHTML = product.detailsHtml || `<p>${product.description}</p>`;
  }

  const howToUseEl = document.getElementById("pdpHowToUse");
  if (howToUseEl && product.howToUseHtml) {
    howToUseEl.innerHTML = product.howToUseHtml;
  }

  const authEl = document.getElementById("pdpAuthenticity");
  if (authEl && product.authenticityHtml) {
    authEl.innerHTML = product.authenticityHtml;
  }

  const faqsEl = document.getElementById("pdpFaqs");
  if (faqsEl) {
    if (product.faqs && Array.isArray(product.faqs) && product.faqs.length > 0) {
      faqsEl.innerHTML = product.faqs.map(faq => `
        <div class="pdp-faq-item" style="margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px;">
          <strong style="display:block; color:var(--lux-gold, #d4af37); margin-bottom:4px; font-size:15px;">${faq.q}</strong>
          <p style="margin:0; font-size:14px; opacity:0.9; line-height:1.6;">${faq.a}</p>
        </div>
      `).join("");
    } else {
      faqsEl.innerHTML = `<p>Have questions about this product? Contact our spiritual guidance team on WhatsApp for prompt assistance.</p>`;
    }
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
  document.querySelectorAll(".lux-reveal").forEach((el) => el.classList.add("visible"));
  window.VedVigyanLux?.initScrollReveal?.();
}

function initSectionInteractiveHandlers(product) {
  // Inline Video Player for Reels
  const videoCards = document.querySelectorAll("[data-vv-video]");
  videoCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      let src = card.getAttribute("data-vv-video") || "https://youtu.be/o9dREd5ZPhw?si=X2tbKalptHS0wmhD";
      if (!src) return;

      if (card.classList.contains("is-playing") && card.querySelector(".vv-inline-player")) {
        return;
      }

      document.querySelectorAll(".vv-reel-video-wrap.is-playing").forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove("is-playing");
          const oldPlayer = otherCard.querySelector(".vv-inline-player");
          if (oldPlayer) oldPlayer.remove();
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
  const bar = document.getElementById("stickyCart");
  if (!bar) return;

  const stickyImg = document.getElementById("stickyImg");
  const stickyTitle = document.getElementById("stickyTitle");
  const stickyPrice = document.getElementById("stickyPrice");

  if (stickyImg) {
    stickyImg.src = product.image;
    stickyImg.alt = product.name;
  }
  if (stickyTitle) stickyTitle.textContent = product.name;
  if (stickyPrice) stickyPrice.textContent = window.VedVigyanCart.formatINR(product.price);

  let actionsContainer = bar.querySelector(".lux-sticky-cart-actions");
  if (!actionsContainer) {
    actionsContainer = document.createElement("div");
    actionsContainer.className = "lux-sticky-cart-actions";
    bar.querySelector(".lux-sticky-cart-inner")?.appendChild(actionsContainer);
  }

  const existingSingleBtn = document.getElementById("stickyAddBtn");
  if (existingSingleBtn) existingSingleBtn.remove();

  actionsContainer.innerHTML = `
    <button class="lux-btn lux-btn-secondary lux-btn-sm" type="button" data-add-to-cart="${product.id}">ADD TO CART</button>
    <button class="lux-btn lux-btn-primary lux-btn-sm" type="button" data-buy-now="${product.id}">BUY NOW</button>
  `;

  window.VedVigyanCart?.wireAddToCartButtons(actionsContainer);
  window.VedVigyanCart?.wireBuyNowButtons(actionsContainer);

  const pdpActions = document.querySelector(".lux-pdp-actions");
  if (!pdpActions) return;

  const observer = new IntersectionObserver(([entry]) => {
    const visible = !entry.isIntersecting;
    bar.classList.toggle("visible", visible);
    bar.setAttribute("aria-hidden", visible ? "false" : "true");
  }, { threshold: 0 });

  observer.observe(pdpActions);
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderProductPage);
} else {
  renderProductPage();
}


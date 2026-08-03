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

function getRelatedProducts(product, products) {
  const tags = product.tags || [];
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const overlap = (candidate.tags || []).filter((tag) => tags.includes(tag)).length;
      const sameCategory = candidate.category === product.category ? 2 : 0;
      return { product: candidate, score: overlap + sameCategory };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.product);
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
    const related = getRelatedProducts(product, products);
    const recent = getRecentlyViewed(product.id).slice(0, 2);
    const combined = [
      ...related.map((item) => item),
      ...recent.filter((item) => !related.find((r) => r.id === item.id))
    ].slice(0, 4);

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

  const related = getRelatedProducts(product, products);
  const recent = getRecentlyViewed(product.id).slice(0, 2);
  const combined = [
    ...related.map((item) => ({ item, label: "Related pick" })),
    ...recent.map((item) => ({ item, label: "Recently viewed" }))
  ].slice(0, 4);

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

function renderProductPage() {
  const data = window.VED_VIGYAN_DATA;
  const products = data?.products || [];
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
    if (giftCheckbox) giftCheckbox.checked = false;
    if (product.price >= 999) {
      freeGiftSubtitle.innerHTML = `<strong style="color:var(--gold,#d4af37);">Included FREE</strong> with this order (Applicable on orders ₹999 &amp; above)`;
    } else {
      freeGiftSubtitle.innerHTML = `FREE on orders ₹999 &amp; above (Add more items to reach ₹999 at checkout)`;
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

  // Dynamic filesystem scanner fetch
  if (product && product.slug) {
    fetch(`/api/gallery?slug=${product.slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("API failed");
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.images) && data.images.length > 0) {
          const currentImages = product.images || [];
          const isSame = currentImages.length === data.images.length &&
            currentImages.every((val, index) => val === data.images[index]);

          if (!isSame) {
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
  window.VedVigyanLux?.initScrollReveal?.();
}

function initStickyCart(product) {
  const bar = document.getElementById("stickyCart");
  if (!bar) return;

  const stickyImg = document.getElementById("stickyImg");
  const stickyTitle = document.getElementById("stickyTitle");
  const stickyPrice = document.getElementById("stickyPrice");
  const stickyAddBtn = document.getElementById("stickyAddBtn");

  if (stickyImg) {
    stickyImg.src = product.image;
    stickyImg.alt = product.name;
  }
  if (stickyTitle) stickyTitle.textContent = product.name;
  if (stickyPrice) stickyPrice.textContent = window.VedVigyanCart.formatINR(product.price);
  if (stickyAddBtn) {
    stickyAddBtn.setAttribute("data-add-to-cart", product.id);
    window.VedVigyanCart.wireAddToCartButtons(bar);
  }

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

document.addEventListener("DOMContentLoaded", renderProductPage);


function renderShop() {
  const grid = document.getElementById("productGrid");
  const categorySelect = document.getElementById("categorySelect");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const countEl = document.getElementById("resultCount");
  const advisorForm = document.getElementById("advisorForm");
  const advisorResult = document.getElementById("advisorResult");
  if (!grid) return;

  const data = window.VED_VIGYAN_DATA;
  const products = data?.products || [];
  const FILTERS_KEY = "ved_vigyan_shop_filters_v2";

  let active = "all";
  let query = "";
  let sort = "featured";
  let minPrice = "";
  let maxPrice = "";

  function renderStars(rating) {
    const fullStars = Math.round(rating || 0);
    return `${"★".repeat(fullStars)}${"☆".repeat(Math.max(0, 5 - fullStars))}`;
  }

  function renderThumb(product) {
    if (window.VedVigyanCarousel && window.VedVigyanCarousel.renderCarouselHtml) {
      return window.VedVigyanCarousel.renderCarouselHtml(product);
    }

    return `
      <div class="thumb">
        <img src="${product.image}" alt="${product.imageAlt}" width="420" height="260" loading="lazy">
      </div>
    `;
  }

  function renderPriceBlock(product, large = false) {
    const actualPrice = window.VedVigyanCart.formatINR(product.price);
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return `<div class="price${large ? ' price-large' : ''}">${actualPrice}</div>`;
    }

    return `
      <div class="rating-row">
        <span class="stars" aria-hidden="true">${renderStars(product.rating)}</span>
        <span class="rating-text">${product.rating}/5</span>
      </div>
      <div class="price-stack">
        <div class="price${large ? ' price-large' : ''}">${actualPrice}</div>
        <div class="price-meta">
          <span class="old-price">${window.VedVigyanCart.formatINR(product.originalPrice)}</span>
          <span class="discount-badge">${product.discountPercent}% OFF</span>
        </div>
      </div>
    `;
  }

  function renderCartControl(productId) {
    const qty = window.VedVigyanCart.getItemQty(productId);

    const cartBtn = !qty
      ? `<button class="btn small secondary" type="button" data-add-to-cart="${productId}">Add to Cart</button>`
      : `<div class="qty qty-card" data-card-qty="${productId}">
          <button type="button" data-card-dec="${productId}" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button type="button" data-card-inc="${productId}" aria-label="Increase quantity">+</button>
        </div>`;

    const buyNowBtn = `<button class="btn small primary" type="button" data-buy-now="${productId}">Buy Now</button>`;

    return `
      <div class="lux-product-footer">
        ${cartBtn}
        ${buyNowBtn}
      </div>
    `;
  }

  const categoryPillsEl = document.getElementById("categoryPills");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");

  function renderCategoryPills() {
    if (!categoryPillsEl || !data?.categories) return;
    categoryPillsEl.innerHTML = data.categories
      .map(
        (c) =>
          `<button type="button" class="lux-category-pill${active === c.id ? " is-active" : ""}" data-cat-pill="${c.id}">${c.label}</button>`
      )
      .join("");

    categoryPillsEl.querySelectorAll("[data-cat-pill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.getAttribute("data-cat-pill") || "all";
        syncInputs();
        apply();
      });
    });
  }

  function syncInputs() {
    if (categorySelect) categorySelect.value = active;
    if (searchInput) searchInput.value = query;
    if (sortSelect) sortSelect.value = sort;
    if (minPriceInput) minPriceInput.value = minPrice;
    if (maxPriceInput) maxPriceInput.value = maxPrice;

    if (categoryPillsEl) {
      categoryPillsEl.querySelectorAll("[data-cat-pill]").forEach((b) => {
        b.classList.toggle("is-active", b.getAttribute("data-cat-pill") === active);
      });
    }
  }

  function persistFilters() {
    localStorage.setItem(
      FILTERS_KEY,
      JSON.stringify({ active, query, sort, minPrice, maxPrice })
    );
  }

  function restoreFilters() {
    const params = new URLSearchParams(window.location.search);
    const qFromUrl = params.get("q");
    const catFromUrl = params.get("cat");
    const pathCat = window.location.pathname.startsWith("/collections/") 
      ? window.location.pathname.replace(/^\/collections\/?/, "").replace(/\.html$/, "").split("/")[0] 
      : "";

    if (!qFromUrl && !catFromUrl && !pathCat) {
      active = "all";
      query = "";
      minPrice = "";
      maxPrice = "";
      localStorage.removeItem(FILTERS_KEY);
      syncInputs();
      return;
    }

    if (pathCat) {
      active = pathCat;
      syncInputs();
    } else if (catFromUrl) {
      active = catFromUrl;
      syncInputs();
    }

    if (qFromUrl !== null) {
      query = qFromUrl;
      syncInputs();
    }
  }

  function scoreProduct(product, profile) {
    const tags = product.tags || [];
    let score = 0;

    if (profile.goal && tags.includes(profile.goal)) score += 4;
    if (profile.goal === "clarity" && tags.includes("focus")) score += 1;
    if (profile.goal === "prosperity" && tags.includes("guidance")) score += 1;
    if (profile.experience === "beginner" && tags.includes("beginner")) score += 3;
    if (profile.experience === "regular" && tags.includes("serious-practice")) score += 3;
    if (profile.wear === "daily" && tags.includes("daily-wear")) score += 3;
    if (profile.wear === "ritual" && tags.includes("ritual")) score += 3;
    if (profile.budget === "under-700" && product.price <= 700) score += 2;
    if (profile.budget === "700-1500" && product.price >= 700 && product.price <= 1500) score += 2;
    if (profile.budget === "1500-plus" && product.price >= 1500) score += 2;
    if (product.price === 0) score -= 1;

    return score;
  }

  function renderAdvisorResult(product, profile) {
    if (!advisorResult) return;
    if (!product) {
      advisorResult.innerHTML = '<p style="margin:0;color:var(--muted,#6b5a4b);">No close match yet. Try a wider budget or different goal.</p>';
      return;
    }

    const price = window.VedVigyanCart.formatINR(product.price);
    advisorResult.innerHTML = `
      <div class="lux-advisor-match">
        <div>
          <div class="lux-section-kicker">Recommended for you</div>
          <h3 style="font-family:var(--font-display,serif);font-size:22px;color:var(--maroon,#8a1a23);margin:0 0 8px;">${product.name}</h3>
          <p style="margin:0 0 12px;color:var(--muted,#6b5a4b);font-size:14px;">${product.short}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="lux-badge-pill lux-badge-auth">${profile.goal || "balanced"}</span>
            <span class="lux-badge-pill lux-badge-cert">${profile.experience || "beginner"}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="lux-product-price" style="margin-bottom:12px;">${price}</div>
          <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;">
            <a class="lux-btn lux-btn-secondary lux-btn-sm" href="${product.url}">View</a>
            <button class="lux-btn lux-btn-primary lux-btn-sm" type="button" data-advisor-apply="${product.category}">Show Similar</button>
          </div>
        </div>
      </div>
    `;

    advisorResult.querySelector("[data-advisor-apply]")?.addEventListener("click", () => {
      active = product.category;
      query = profile.goal === "clarity" ? "focus" : "";
      syncInputs();
      apply();
      window.scrollTo({ top: Math.max(0, grid.offsetTop - 120), behavior: "smooth" });
    });
  }

  function wireAdvisor() {
    if (!advisorForm) return;
    advisorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profile = Object.fromEntries(new FormData(advisorForm).entries());
      const [match] = [...products]
        .map((product) => ({ product, score: scoreProduct(product, profile) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.product);

      renderAdvisorResult(match, profile);
    });
  }

  function ensureQuickViewModal() {
    if (document.getElementById("quickViewOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "quickViewOverlay";
    overlay.className = "overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Quick view">
        <div class="modal-head">
          <b id="qvTitle">Quick view</b>
          <button class="modal-close" type="button" aria-label="Close">✕</button>
        </div>
        <div class="modal-body" id="qvBody"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => {
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    };
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".modal-close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("show")) close();
    });
    overlay.__vv_close = close;
  }

  function openQuickView(productId) {
    ensureQuickViewModal();
    const overlay = document.getElementById("quickViewOverlay");
    const p = products.find((x) => x.id === productId);
    if (!overlay || !p) return;

    const title = overlay.querySelector("#qvTitle");
    const body = overlay.querySelector("#qvBody");
    if (title) title.textContent = p.name;
    if (body) {
      body.innerHTML = `
        <div class="product-layout" style="grid-template-columns: 1fr 1fr; gap:14px">
          <div class="product-img" style="min-height:260px">
            ${renderThumb(p)}
          </div>
          <div>
            <div class="pillrow" style="padding:0; margin-bottom:10px">
              <span class="pill">${p.category.replace("-", " ")}</span>
              <span class="pill">Authenticity guidance</span>
            </div>
            <p class="sub" style="margin:0 0 12px">${p.short}</p>
            ${renderPriceBlock(p, true)}
            <div class="actions" style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
              <a class="btn small" href="${p.url}">View Full Details</a>
              <button class="btn small secondary" type="button" data-add-to-cart="${p.id}">Add to Cart</button>
              <button class="btn small primary" type="button" data-buy-now="${p.id}">Buy Now</button>
              <button class="btn small wishbtn" type="button" data-wishlist="${p.id}" aria-label="Add to wishlist">♡</button>
            </div>
            <div class="chakra" style="margin-top:12px">
              <b>Quick tip:</b> Choose comfort + consistency. If you want help selecting, use our category pages to request guidance.
            </div>
          </div>
        </div>
      `;
      window.VedVigyanCarousel?.bindCarouselEvents(body);
      window.VedVigyanCart.wireAddToCartButtons(body);
      window.VedVigyanWishlist?.wireWishlistButtons?.(body);
      window.VedVigyanWishlist?.updateWishButtons?.(body);
    }

    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function apply() {
    const q = query.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    let filtered = products.filter((p) => {
      const catOk = active === "all" ? true : p.category === active;
      const qOk = !q
        ? true
        : `${p.name} ${p.short} ${p.category} ${(p.tags || []).join(" ")}`
            .toLowerCase()
            .includes(q);
      const priceOk =
        (min === null || p.price >= min) && (max === null || p.price <= max);
      return catOk && qOk && priceOk;
    });

    if (sort === "price-asc") filtered = filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered = filtered.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));

    persistFilters();

    const renderCard = window.VedVigyanLux?.renderProductCard;
    grid.innerHTML = filtered.length
      ? filtered.map((p) => (renderCard ? renderCard(p) : "")).join("")
      : `<div class="lux-empty-state lux-reveal"><p>No products match your filters.</p><button class="lux-btn lux-btn-secondary lux-btn-sm" type="button" id="clearFilters">Clear Filters</button></div>`;

    if (window.VedVigyanLux?.wireProductGrid) {
      window.VedVigyanLux.wireProductGrid(grid);
    } else {
      window.VedVigyanCarousel?.bindCarouselEvents(grid);
      window.VedVigyanCart.wireAddToCartButtons(grid);
      window.VedVigyanWishlist?.wireWishlistButtons?.(grid);
      window.VedVigyanWishlist?.updateWishButtons?.(grid);
    }

    const resetHandler = () => {
      active = "all";
      query = "";
      sort = "featured";
      minPrice = "";
      maxPrice = "";
      syncInputs();
      apply();
    };
    document.getElementById("clearFilters")?.addEventListener("click", resetHandler);
    resetFiltersBtn?.addEventListener("click", resetHandler);

    if (countEl) countEl.textContent = ` · ${filtered.length} products`;
    window.VedVigyanLux?.initScrollReveal?.();
  }

  renderCategoryPills();

  if (categorySelect && data?.categories) {
    categorySelect.innerHTML = data.categories
      .map((c) => `<option value="${c.id}">${c.label}</option>`)
      .join("");
    categorySelect.addEventListener("change", (e) => {
      active = e.target.value || "all";
      syncInputs();
      apply();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value || "";
      apply();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sort = e.target.value || "featured";
      apply();
    });
  }

  const onPriceInput = () => {
    minPrice = minPriceInput?.value ?? "";
    maxPrice = maxPriceInput?.value ?? "";
    apply();
  };
  if (minPriceInput) minPriceInput.addEventListener("input", onPriceInput);
  if (maxPriceInput) maxPriceInput.addEventListener("input", onPriceInput);

  // Initialize from dropdown (if present)
  if (categorySelect) active = categorySelect.value || "all";

  restoreFilters();
  wireAdvisor();
  apply();
  window.addEventListener("vedvigyan:cart-updated", apply);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderShop);
} else {
  renderShop();
}


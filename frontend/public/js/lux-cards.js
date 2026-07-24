/* Ved Vigyan — Shared Luxury Product Cards */
window.VedVigyanLux = window.VedVigyanLux || {};

(function (Lux) {
  "use strict";

  function renderStars(rating) {
    const full = Math.round(rating || 0);
    return `${"★".repeat(full)}${"☆".repeat(Math.max(0, 5 - full))}`;
  }

  Lux.renderProductCard = function renderProductCard(p, options = {}) {
    const reveal = options.reveal !== false ? " lux-reveal" : "";
    const normalized = window.VedVigyanCarousel?.normalizeProductImages(p) || p.images || [p.image];
    const reviewCount = 40 + (p.id.charCodeAt(p.id.length - 1) * 17) % 200;
    const price = window.VedVigyanCart?.formatINR(p.price) || `₹${p.price}`;
    const oldPrice = p.originalPrice > p.price
      ? window.VedVigyanCart?.formatINR(p.originalPrice)
      : "";

    const carouselHtml = window.VedVigyanCarousel
      ? window.VedVigyanCarousel.renderCarouselHtml(p)
      : `<img src="${p.image}" alt="${p.imageAlt}" loading="lazy" width="400" height="400" />`;

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
      <article class="lux-product-card${reveal}" data-product-id="${p.id}">
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
  };

  Lux.wireProductGrid = function wireProductGrid(grid) {
    if (!grid) return;

    window.VedVigyanCarousel?.bindCarouselEvents(grid);
    window.VedVigyanCart?.wireAddToCartButtons(grid);
    window.VedVigyanCart?.wireBuyNowButtons?.(grid);
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
        Lux.openQuickView(btn.getAttribute("data-quickview"));
      });
    });
  };

  Lux.openQuickView = function openQuickView(productId) {
    const product = window.VED_VIGYAN_DATA?.products?.find((p) => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("quickView");
    const panel = document.getElementById("quickViewPanel");
    if (!modal || !panel) return;

    const price = window.VedVigyanCart?.formatINR(product.price) || `₹${product.price}`;
    const img = product.images?.[0] || product.image;

    panel.innerHTML = `
      <button class="lux-quickview-close" type="button" id="qvClose" aria-label="Close" style="position:absolute;top:16px;right:16px;z-index:10;width:40px;height:40px;border-radius:50%;border:none;background:#fff;cursor:pointer;box-shadow:0 4px 24px rgba(0,0,0,.1);font-size:20px;">×</button>
      <div style="background:var(--ivory,#faf6f0);">
        <img src="${img}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;min-height:300px;" />
      </div>
      <div style="padding:32px;">
        <div class="lux-product-rating" style="margin-bottom:12px;">
          <span class="stars">${renderStars(product.rating)}</span>
          <span>${product.rating}/5</span>
        </div>
        <h2 style="font-family:var(--font-display,'Cormorant Garamond',serif);font-size:28px;color:var(--maroon,#8a1a23);margin:0 0 12px;">${product.name}</h2>
        <p style="color:var(--muted,#6b5a4b);margin:0 0 20px;line-height:1.7;">${product.short}</p>
        <div class="lux-product-price" style="font-size:28px;margin-bottom:24px;">${price}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="lux-btn lux-btn-secondary" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
          <button class="lux-btn lux-btn-primary" type="button" data-buy-now="${product.id}">Buy Now</button>
          <a class="lux-btn lux-btn-secondary" href="${product.url}">Full Details</a>
        </div>
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    window.VedVigyanCart?.wireAddToCartButtons(panel);
    panel.querySelector("#qvClose")?.addEventListener("click", Lux.closeQuickView);
  };

  Lux.closeQuickView = function closeQuickView() {
    const modal = document.getElementById("quickView");
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
  };

  document.getElementById("quickView")?.addEventListener("click", (e) => {
    if (e.target.id === "quickView") Lux.closeQuickView();
  });
})(window.VedVigyanLux);

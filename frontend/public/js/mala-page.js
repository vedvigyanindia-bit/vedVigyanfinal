function renderMalaPage() {
  const host = document.getElementById('malaCatalog');
  if (!host) return;

  const data = window.VED_VIGYAN_DATA;
  const products = (data?.products || []).filter(p => p.category === 'mala' || p.category === 'rudraksha-mala');

  function renderStars(rating) {
    const fullStars = Math.round(rating || 0);
    return `${"★".repeat(fullStars)}${"☆".repeat(Math.max(0, 5 - fullStars))}`;
  }

  function renderPriceBlock(p) {
    const actualPrice = window.VedVigyanCart.formatINR(p.price);
    if (!p.originalPrice || p.originalPrice <= p.price) {
      return `<div class="price">${actualPrice}</div>`;
    }
    return `
      <div class="rating-row">
        <span class="stars" aria-hidden="true">${renderStars(p.rating)}</span>
        <span class="rating-text">${p.rating}/5</span>
      </div>
      <div class="price-stack">
        <div class="price">${actualPrice}</div>
        <div class="price-meta">
          <span class="old-price">${window.VedVigyanCart.formatINR(p.originalPrice)}</span>
          <span class="discount-badge">${p.discountPercent}% OFF</span>
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
      ${cartBtn}
      ${buyNowBtn}
    `;
  }

  function render() {
    host.innerHTML = products.map((p) => `
      <article class="card">
        ${window.VedVigyanCarousel ? window.VedVigyanCarousel.renderCarouselHtml(p) : `<div class="thumb"><img src="${p.image}" alt="${p.imageAlt}" loading="lazy"></div>`}
        <div class="pillrow">
          <span class="pill">Jaap Mala</span>
        </div>
        <div class="body">
          <h3>${p.name}</h3>
          <div class="muted">${p.short}</div>
          ${renderPriceBlock(p)}
          <div class="actions">
            <a class="btn small" href="${p.url}">View Details</a>
            ${renderCartControl(p.id)}
            <button class="btn small wishbtn" type="button" data-wishlist="${p.id}" aria-label="Add to wishlist">♡</button>
          </div>
        </div>
      </article>
    `).join('');

    window.VedVigyanCarousel?.bindCarouselEvents(host);
    window.VedVigyanCart.wireAddToCartButtons(host);
    host.querySelectorAll("[data-card-inc]").forEach((b) => {
      b.addEventListener("click", () => window.VedVigyanCart.changeQty(b.getAttribute("data-card-inc"), 1));
    });
    host.querySelectorAll("[data-card-dec]").forEach((b) => {
      b.addEventListener("click", () => window.VedVigyanCart.changeQty(b.getAttribute("data-card-dec"), -1));
    });
    window.VedVigyanWishlist?.wireWishlistButtons?.(host);
    window.VedVigyanWishlist?.updateWishButtons?.(host);
  }

  render();
  window.addEventListener("vedvigyan:cart-updated", render);
}

document.addEventListener('DOMContentLoaded', renderMalaPage);

function renderRudrakshaPage() {
  const catalogHost = document.getElementById("rudrakshaCatalog");
  const storiesHost = document.getElementById("rudrakshaStories");
  const products = (window.VED_VIGYAN_DATA?.products || []).filter(
    (product) => product.category === "rudraksha"
  );

  function renderStars(rating) {
    const fullStars = Math.round(rating || 0);
    return `${"★".repeat(fullStars)}${"☆".repeat(Math.max(0, 5 - fullStars))}`;
  }

  function renderPriceBlock(product) {
    const actualPrice = window.VedVigyanCart.formatINR(product.price);
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return `<div class="price">${actualPrice}</div>`;
    }

    return `
      <div class="rating-row">
        <span class="stars" aria-hidden="true">${renderStars(product.rating)}</span>
        <span class="rating-text">${product.rating}/5</span>
      </div>
      <div class="price-stack">
        <div class="price">${actualPrice}</div>
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
      ${cartBtn}
      ${buyNowBtn}
    `;
  }

  function renderCatalog() {
    if (!catalogHost) return;
    if (window.VedVigyanLux?.renderProductCard) {
      catalogHost.innerHTML = products.map((product) => window.VedVigyanLux.renderProductCard(product)).join("");
      window.VedVigyanLux.wireProductGrid(catalogHost);
    } else {
      catalogHost.innerHTML = products
        .map(
          (product) => `
            <article class="lux-product-card">
              <a class="lux-product-media" href="${product.url}">
                ${window.VedVigyanCarousel ? window.VedVigyanCarousel.renderCarouselHtml(product) : `<img src="${product.image}" alt="${product.imageAlt}" loading="lazy">`}
              </a>
              <div class="lux-product-body">
                <h3 class="lux-product-name"><a href="${product.url}">${product.name}</a></h3>
                <div class="lux-product-price-row">
                  <span class="lux-product-price">₹${product.price}</span>
                </div>
              </div>
            </article>
          `
        )
        .join("");
    }
  }
  renderCatalog();
  window.addEventListener("vedvigyan:cart-updated", renderCatalog);

  if (storiesHost) {
    storiesHost.innerHTML = `
      <article class="story-card">
        <img src="/public/images/products/rudraksha-benefits.png" alt="Rudraksha life change story banner" loading="lazy">
      </article>
      <article class="story-card">
        <img src="/public/images/products/rudraksha-benefits-men.png" alt="Rudraksha transformation banner for men" loading="lazy">
      </article>
      <article class="story-card">
        <img src="/public/images/products/rudraksha-10-mukhi-square.png" alt="10 Mukhi Rudraksha showcase image" loading="lazy">
      </article>
    `;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderRudrakshaPage);
} else {
  renderRudrakshaPage();
}

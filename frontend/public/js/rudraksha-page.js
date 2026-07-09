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
    if (!qty) {
      return `<button class="btn small primary" type="button" data-add-to-cart="${productId}">Add to Cart</button>`;
    }
    return `
      <div class="qty qty-card" data-card-qty="${productId}">
        <button type="button" data-card-dec="${productId}" aria-label="Decrease quantity">−</button>
        <span>${qty}</span>
        <button type="button" data-card-inc="${productId}" aria-label="Increase quantity">+</button>
      </div>
    `;
  }

  function renderCatalog() {
    if (!catalogHost) return;
    catalogHost.innerHTML = products
      .map(
        (product) => `
          <article class="card">
            ${window.VedVigyanCarousel ? window.VedVigyanCarousel.renderCarouselHtml(product) : `<div class="thumb"><img src="${product.image}" alt="${product.imageAlt}" width="420" height="260" loading="lazy"></div>`}
            <div class="pillrow">
              <span class="pill">Rudraksha</span>
              <span class="pill">${product.slug.replace(/-/g, " ")}</span>
            </div>
            <div class="body">
              <h3>${product.name}</h3>
              <div class="muted">${product.short}</div>
              ${renderPriceBlock(product)}
              <div class="actions">
                <a class="btn small" href="${product.url}">View Details</a>
                ${renderCartControl(product.id)}
              </div>
            </div>
          </article>
        `
      )
      .join("");

    window.VedVigyanCarousel?.bindCarouselEvents(catalogHost);
    window.VedVigyanCart.wireAddToCartButtons(catalogHost);
    catalogHost.querySelectorAll("[data-card-inc]").forEach((button) => {
      button.addEventListener("click", () => {
        window.VedVigyanCart.changeQty(button.getAttribute("data-card-inc"), 1);
      });
    });
    catalogHost.querySelectorAll("[data-card-dec]").forEach((button) => {
      button.addEventListener("click", () => {
        window.VedVigyanCart.changeQty(button.getAttribute("data-card-dec"), -1);
      });
    });
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

document.addEventListener("DOMContentLoaded", renderRudrakshaPage);

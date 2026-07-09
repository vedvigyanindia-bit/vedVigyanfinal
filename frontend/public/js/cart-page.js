function findCategoryForCartItem(productId) {
  const catalog = (window.VED_VIGYAN_DATA && window.VED_VIGYAN_DATA.products) || [];
  return catalog.find((product) => product.id === productId)?.category || "";
}

function createRecommendationMarkup(product, label) {
  if (window.VedVigyanLux?.renderProductCard) {
    return window.VedVigyanLux.renderProductCard(product);
  }
  const fullStars = Math.round(product.rating || 0);
  const stars = `${"★".repeat(fullStars)}${"☆".repeat(Math.max(0, 5 - fullStars))}`;
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
      <div class="thumb">
        <img src="${product.image}" alt="${product.imageAlt}" width="240" height="180" loading="lazy">
      </div>
      <div class="body">
        <div class="eyebrow">${label}</div>
        <h3>${product.name}</h3>
        <p class="sub" style="margin:0">${product.short}</p>
        ${priceBlock}
        <div class="actions">
          <a class="btn small" href="${product.url}">View Details</a>
          <button class="btn small primary" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function renderCartPage() {
  const tableBody = document.getElementById("cartBody");
  const subtotalEl = document.getElementById("cartSubtotal");
  const emptyEl = document.getElementById("cartEmpty");
  const actionsEl = document.getElementById("cartActions");
  const summaryHost = document.getElementById("cartSmartSummary");
  const recommendationHost = document.getElementById("cartRecommendations");
  if (!tableBody) return;

  const cart = window.VedVigyanCart.loadCart();
  const items = Object.values(cart.items);
  const subtotal = window.VedVigyanCart.cartSubtotal(cart);
  const freeShippingGap = Math.max(0, 999 - subtotal);
  const catalog = (window.VED_VIGYAN_DATA && window.VED_VIGYAN_DATA.products) || [];

  if (summaryHost) {
    summaryHost.innerHTML = `
      <div class="lux-cart-insight lux-reveal">
        <div>
          <div class="lux-section-kicker">Cart Summary</div>
          <h3 style="font-family:var(--font-display,serif);font-size:24px;color:var(--maroon,#8a1a23);margin:0 0 8px;">
            ${items.length ? "Your sacred selection" : "Begin your spiritual journey"}
          </h3>
          <p style="margin:0;color:var(--muted,#6b5a4b);font-size:14px;">
            ${
              items.length
                ? freeShippingGap > 0
                  ? `Add ${window.VedVigyanCart.formatINR(freeShippingGap)} more for free shipping.`
                  : "You've unlocked free shipping!"
                : "Explore our collection of authentic Rudraksha, malas and crystals."
            }
          </p>
        </div>
        <div class="lux-shipping-progress" aria-hidden="true">
          <span style="width:${Math.min(100, Math.round((subtotal / 999) * 100))}%"></span>
        </div>
      </div>
    `;
  }

  if (!items.length) {
    tableBody.innerHTML = "";
    if (subtotalEl) subtotalEl.textContent = window.VedVigyanCart.formatINR(0);
    if (emptyEl) emptyEl.style.display = "block";
    if (actionsEl) actionsEl.style.display = "none";
    if (recommendationHost) {
      recommendationHost.innerHTML = catalog
        .slice(0, 4)
        .map((product) => createRecommendationMarkup(product, "Starter pick"))
        .join("");
      window.VedVigyanLux?.wireProductGrid(recommendationHost);
      window.VedVigyanCart.wireAddToCartButtons(recommendationHost);
    }
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  if (actionsEl) actionsEl.style.display = "flex";

  tableBody.innerHTML = items
    .map((it) => {
      const line = (it.price || 0) * (it.qty || 0);
      return `
        <tr>
          <td>
            <div style="display:flex; gap:10px; align-items:flex-start">
              <img src="${it.image}" alt="${it.imageAlt}" width="64" height="64" style="border-radius:14px; border:1px solid var(--line); background:rgba(255,255,255,.7); padding:6px">
              <div>
                <div style="font-weight:900">${it.name}</div>
                <a class="muted" href="${it.url}">View product</a>
              </div>
            </div>
          </td>
          <td>${window.VedVigyanCart.formatINR(it.price)}</td>
          <td>
            <div class="qty" data-qty="${it.id}">
              <button type="button" data-dec="${it.id}" aria-label="Decrease quantity">−</button>
              <span>${it.qty}</span>
              <button type="button" data-inc="${it.id}" aria-label="Increase quantity">+</button>
            </div>
          </td>
          <td><b>${window.VedVigyanCart.formatINR(line)}</b></td>
          <td>
            <button class="btn small" type="button" data-remove="${it.id}">Remove</button>
          </td>
        </tr>
      `;
    })
    .join("");

  if (subtotalEl) subtotalEl.textContent = window.VedVigyanCart.formatINR(subtotal);

  if (recommendationHost) {
    const categories = new Set(items.map((item) => findCategoryForCartItem(item.id)));
    const recommendations = catalog
      .filter((product) => !cart.items[product.id] && categories.has(product.category))
      .slice(0, 3);

    recommendationHost.innerHTML = recommendations.length
      ? recommendations
          .map((product) => createRecommendationMarkup(product, "Pairs well with your cart"))
          .join("")
      : '<p class="lux-empty-note">Your cart covers this category well. Ready to checkout?</p>';

    window.VedVigyanLux?.wireProductGrid(recommendationHost);
    window.VedVigyanCart.wireAddToCartButtons(recommendationHost);
  }

  tableBody.querySelectorAll("[data-remove]").forEach((b) => {
    b.addEventListener("click", () => {
      window.VedVigyanCart.removeFromCart(b.getAttribute("data-remove"));
      renderCartPage();
      window.VedVigyanCart.toast("Removed");
    });
  });
  tableBody.querySelectorAll("[data-inc]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-inc");
      const c = window.VedVigyanCart.loadCart();
      const qty = (c.items[id]?.qty || 1) + 1;
      window.VedVigyanCart.setQty(id, qty);
      renderCartPage();
    });
  });
  tableBody.querySelectorAll("[data-dec]").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.getAttribute("data-dec");
      const c = window.VedVigyanCart.loadCart();
      const qty = Math.max(1, (c.items[id]?.qty || 1) - 1);
      window.VedVigyanCart.setQty(id, qty);
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  window.addEventListener("vedvigyan:cart-updated", renderCartPage);
});


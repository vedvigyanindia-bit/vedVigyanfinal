function renderWishlistPage() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");
  if (!grid) return;

  const products = window.VED_VIGYAN_DATA?.products || [];

  const render = () => {
    const wishedIds = window.VedVigyanWishlist?.loadWishlist()?.ids || [];
    const wished = wishedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);

    if (!wished.length) {
      if (empty) empty.style.display = "flex";
      grid.innerHTML = "";
      return;
    }

    if (empty) empty.style.display = "none";

    if (window.VedVigyanLux?.renderProductCard) {
      grid.innerHTML = wished.map((p) => window.VedVigyanLux.renderProductCard(p)).join("");
      window.VedVigyanLux.wireProductGrid(grid);
    } else {
      grid.innerHTML = wished.map((p) => `
        <article class="lux-product-card">
          <a href="${p.url}"><img src="${p.image}" alt="${p.imageAlt}" loading="lazy" /></a>
        </article>
      `).join("");
    }

    window.VedVigyanLux?.initScrollReveal?.();
  };

  render();
  window.addEventListener("vedvigyan:cart-updated", render);
  window.addEventListener("vedvigyan:wishlist-updated", render);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderWishlistPage);
} else {
  renderWishlistPage();
}

function renderMalaPage() {
  const host = document.getElementById('malaCatalog');
  if (!host) return;

  const data = window.VED_VIGYAN_DATA;
  const products = (data?.products || []).filter(p => p.category === 'mala' || p.category === 'rudraksha-mala');

  function render() {
    if (window.VedVigyanLux?.renderProductCard) {
      host.innerHTML = products.map(p => window.VedVigyanLux.renderProductCard(p)).join('');
      window.VedVigyanLux.wireProductGrid(host);
    } else {
      host.innerHTML = products.map(p => `
        <article class="lux-product-card">
          <a class="lux-product-media" href="${p.url}">
            ${window.VedVigyanCarousel ? window.VedVigyanCarousel.renderCarouselHtml(p) : `<img src="${p.image}" alt="${p.imageAlt}">`}
          </a>
          <div class="lux-product-body">
            <h3 class="lux-product-name"><a href="${p.url}">${p.name}</a></h3>
            <div class="lux-product-price-row">
              <span class="lux-product-price">₹${p.price}</span>
            </div>
          </div>
        </article>
      `).join('');
    }
  }

  render();
  window.addEventListener("vedvigyan:cart-updated", render);
}

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', renderMalaPage);
} else {
  renderMalaPage();
}

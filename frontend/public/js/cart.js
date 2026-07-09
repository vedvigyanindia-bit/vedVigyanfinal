const CART_KEY = "ved_vigyan_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: {} };
  } catch {
    return { items: {} };
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("vedvigyan:cart-updated"));
}

function getCartCount(cart) {
  return Object.values(cart.items).reduce((sum, it) => sum + (it.qty || 0), 0);
}

function getCartLineTotal(item) {
  return (item.price || 0) * (item.qty || 0);
}

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount || 0);
}

function getCatalog() {
  return (window.VED_VIGYAN_DATA && window.VED_VIGYAN_DATA.products) || [];
}

function findProductById(id) {
  return getCatalog().find((p) => p.id === id) || null;
}

function getItemQty(productId) {
  const cart = loadCart();
  return cart.items[productId]?.qty || 0;
}

function addToCart(productId, qty = 1) {
  const product = findProductById(productId);
  if (!product) return;
  const cart = loadCart();
  const existing = cart.items[productId];
  const nextQty = (existing?.qty || 0) + qty;
  cart.items[productId] = {
    id: product.id,
    name: product.name,
    price: product.price,
    url: product.url,
    image: product.image,
    imageAlt: product.imageAlt,
    qty: Math.max(1, nextQty),
    shopifyVariantId: product.shopifyVariantId || null,
    originalPrice: product.originalPrice || product.price
  };
  saveCart(cart);
  toast("Added to cart");
}

function removeFromCart(productId) {
  const cart = loadCart();
  delete cart.items[productId];
  saveCart(cart);
}

function setQty(productId, qty) {
  const cart = loadCart();
  if (!cart.items[productId]) return;
  const safeQty = Math.max(1, Number(qty || 1));
  cart.items[productId].qty = safeQty;
  saveCart(cart);
}

function changeQty(productId, delta) {
  const cart = loadCart();
  const currentQty = cart.items[productId]?.qty || 0;
  const nextQty = currentQty + Number(delta || 0);

  if (nextQty <= 0) {
    if (cart.items[productId]) {
      delete cart.items[productId];
      saveCart(cart);
    }
    return 0;
  }

  if (!cart.items[productId]) {
    addToCart(productId, nextQty);
    return getItemQty(productId);
  }

  cart.items[productId].qty = nextQty;
  saveCart(cart);
  return nextQty;
}

function clearCart() {
  saveCart({ items: {} });
}

function cartSubtotal(cart) {
  return Object.values(cart.items).reduce((sum, it) => sum + getCartLineTotal(it), 0);
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__vv_toast_timer);
  window.__vv_toast_timer = setTimeout(() => el.classList.remove("show"), 1400);
}

function wireAddToCartButtons(root = document) {
  root.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add-to-cart");
      addToCart(id, 1);
    });
  });
}

function renderCartBadge() {
  const badge = document.querySelector("[data-cart-count]");
  if (!badge) return;
  const cart = loadCart();
  badge.textContent = String(getCartCount(cart));
}

window.VedVigyanCart = {
  loadCart,
  saveCart,
  addToCart,
  removeFromCart,
  setQty,
  changeQty,
  getItemQty,
  clearCart,
  cartSubtotal,
  formatINR,
  wireAddToCartButtons,
  renderCartBadge,
  toast
};

window.addEventListener("vedvigyan:cart-updated", renderCartBadge);
document.addEventListener("DOMContentLoaded", renderCartBadge);


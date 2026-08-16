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

const FREE_GIFT_ID = "free_5_mukhi_rudraksha";

function isFreeGiftClaimed() {
  const cart = loadCart();
  return !!cart.items[FREE_GIFT_ID];
}

function addFreeGiftItem() {
  const cart = loadCart();
  if (cart.items[FREE_GIFT_ID]) return false;

  cart.items[FREE_GIFT_ID] = {
    id: FREE_GIFT_ID,
    name: "FREE 5 Mukhi Nepali Rudraksha Bead",
    price: 0,
    url: "/product/detail.html?id=vv_p31",
    image: "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
    imageAlt: "FREE 5 Mukhi Nepali Rudraksha Bead Gift",
    qty: 1,
    isFreeGift: true,
    originalPrice: 399
  };
  saveCart(cart);
  return true;
}

function removeFreeGiftItem() {
  const cart = loadCart();
  if (cart.items[FREE_GIFT_ID]) {
    delete cart.items[FREE_GIFT_ID];
    saveCart(cart);
  }
}

function addCustomItemToCart(item, forceFreeGift = true) {
  if (!item || !item.id || !item.name) return;
  const cart = loadCart();
  const id = item.id;
  const existing = cart.items[id];
  const nextQty = (existing?.qty || 0) + (item.qty || 1);
  cart.items[id] = {
    id: item.id,
    name: item.name,
    price: Number(item.price || 0),
    url: item.url || window.location.pathname,
    image: item.image || "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
    imageAlt: item.name,
    qty: Math.max(1, nextQty),
    originalPrice: Number(item.originalPrice || item.price || 0)
  };

  if (forceFreeGift && !isFreeGiftClaimed() && item.price >= 999) {
    cart.items[FREE_GIFT_ID] = {
      id: FREE_GIFT_ID,
      name: "FREE 5 Mukhi Nepali Rudraksha Bead",
      price: 0,
      url: "/product/detail.html?id=vv_p31",
      image: "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
      imageAlt: "FREE 5 Mukhi Nepali Rudraksha Bead Gift",
      qty: 1,
      isFreeGift: true,
      originalPrice: 399
    };
    saveCart(cart);
    toast(`Added "${item.name}" + FREE Gift to Cart!`);
  } else {
    saveCart(cart);
    toast(`Added "${item.name}" to Cart!`);
  }
}

function addToCart(productId, qty = 1, forceFreeGift = null) {
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

  const giftCheckbox = document.getElementById("claimFreeGift");
  const shouldClaimGift = forceFreeGift !== null ? forceFreeGift : (giftCheckbox ? giftCheckbox.checked : false);

  if (shouldClaimGift) {
    if (isFreeGiftClaimed()) {
      saveCart(cart);
      toast("Added to cart! (Only 1 free gift can be claimed per order)");
    } else {
      addFreeGiftItem();
      toast("Added to cart + FREE 5 Mukhi Rudraksha!");
    }
  } else {
    saveCart(cart);
    toast("Added to cart");
  }
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

function buyNow(productId) {
  if (getItemQty(productId) <= 0) {
    addToCart(productId, 1);
  }
  window.location.href = "/checkout.html";
}

function wireBuyNowButtons(root = document) {
  root.querySelectorAll("[data-buy-now]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-buy-now");
      buyNow(id);
    });
  });
}

function wireAddToCartButtons(root = document) {
  root.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-add-to-cart");
      addToCart(id, 1);
    });
  });
  wireBuyNowButtons(root);
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
  addCustomItemToCart,
  addFreeGiftItem,
  removeFreeGiftItem,
  isFreeGiftClaimed,
  buyNow,
  removeFromCart,
  setQty,
  changeQty,
  getItemQty,
  clearCart,
  cartSubtotal,
  formatINR,
  wireAddToCartButtons,
  wireBuyNowButtons,
  renderCartBadge,
  toast
};

window.addEventListener("vedvigyan:cart-updated", renderCartBadge);
document.addEventListener("DOMContentLoaded", renderCartBadge);


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
    url: "/products/nepali-rudrakasha-mala-close-for-wearing",
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
      url: "/products/nepali-rudrakasha-mala-close-for-wearing",
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
      toast(`Added "${product.name}" to cart!`);
    } else {
      addFreeGiftItem();
      toast(`Added "${product.name}" + FREE Gift to cart!`);
    }
  } else {
    saveCart(cart);
    toast(`Added "${product.name}" to cart`);
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
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }

  const cart = loadCart();
  const totalCount = Object.values(cart.items).reduce((sum, i) => sum + (i.qty || 1), 0);

  el.innerHTML = `
    <div class="vv-toast-inner">
      <div class="vv-toast-icon">✓</div>
      <div class="vv-toast-content">
        <div class="vv-toast-title">${message || "Added to Cart!"}</div>
        <div class="vv-toast-sub">Cart contains ${totalCount} item${totalCount > 1 ? "s" : ""}</div>
      </div>
      <a href="/cart.html" class="vv-toast-btn">VIEW CART</a>
    </div>
  `;

  const isMobile = window.innerWidth <= 600;
  const positionStyle = isMobile
    ? "top: 16px !important; left: 50% !important; right: auto !important; transform: translateX(-50%) !important;"
    : "top: 24px !important; right: 24px !important; left: auto !important; transform: none !important;";

  el.style.cssText = `
    position: fixed !important;
    ${positionStyle}
    z-index: 999999 !important;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    background: #ffffff !important;
    color: #1a0809 !important;
    padding: 0 !important;
    border-radius: 14px !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(138, 26, 35, 0.15) !important;
    border: 1.5px solid #d4af37 !important;
    max-width: 400px !important;
    width: calc(100vw - 32px) !important;
    transition: opacity 0.3s ease !important;
  `;

  el.classList.add("show");

  clearTimeout(window.__vv_toast_timer);
  window.__vv_toast_timer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.visibility = "hidden";
    setTimeout(() => {
      el.style.display = "none";
      el.classList.remove("show");
    }, 300);
  }, 3500);
}

function buyNow(productId) {
  if (getItemQty(productId) <= 0) {
    addToCart(productId, 1);
  }
  window.location.href = "/checkout.html";
}

function wireBuyNowButtons(root = document) {
  root.querySelectorAll("[data-buy-now]").forEach((btn) => {
    if (btn.__vv_buynow_bound) return;
    btn.__vv_buynow_bound = true;
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
    if (btn.__vv_addcart_bound) return;
    btn.__vv_addcart_bound = true;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-add-to-cart");
      addToCart(id, 1);
    });
  });
  wireBuyNowButtons(root);
}

function getCurrentPageProductId(btn) {
  if (btn) {
    const attrId = btn.getAttribute("data-add-to-cart") || btn.getAttribute("data-buy-now") || btn.getAttribute("data-product-id");
    if (attrId) return attrId;
  }
  const params = new URLSearchParams(window.location.search);
  const urlId = params.get("id");
  if (urlId) return urlId;
  if (window.currentProduct && window.currentProduct.id) return window.currentProduct.id;
  return "vv_p01";
}

// Global delegated click listener for 100% reliable Buy Now & Add to Cart clicks
document.addEventListener("click", (e) => {
  const buyBtn = e.target.closest("[data-buy-now], #buyNowBtn, .pdp-btn-buynow, .pdp-sticky-btn-buynow");
  if (buyBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = buyBtn.getAttribute("data-buy-now") || getCurrentPageProductId(buyBtn);
    if (id) {
      buyNow(id);
    }
    return;
  }

  const addBtn = e.target.closest("[data-add-to-cart], #addToCartBtn, .pdp-btn-atc, .pdp-sticky-btn-atc");
  if (addBtn) {
    e.preventDefault();
    e.stopPropagation();
    const id = addBtn.getAttribute("data-add-to-cart") || getCurrentPageProductId(addBtn);
    const qtyInput = document.getElementById("pdpQtyInput");
    const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
    if (id) {
      addToCart(id, qty);
    }
    return;
  }
});

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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderCartBadge);
} else {
  renderCartBadge();
}


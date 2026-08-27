const WISHLIST_KEY = "ved_vigyan_wishlist_v1";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : { ids: [] };
  } catch {
    return { ids: [] };
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  window.dispatchEvent(new Event("vedvigyan:wishlist-updated"));
}

function isWished(id) {
  const w = loadWishlist();
  return w.ids.includes(id);
}

function toggleWishlist(id) {
  const w = loadWishlist();
  const has = w.ids.includes(id);
  w.ids = has ? w.ids.filter((x) => x !== id) : [id, ...w.ids];
  saveWishlist(w);
  return !has;
}

function renderWishlistBadge() {
  const badge = document.querySelector("[data-wishlist-count]");
  if (!badge) return;
  const products = window.VED_VIGYAN_DATA?.products || [];
  const wishedIds = loadWishlist().ids || [];
  if (products.length > 0) {
    const validCount = wishedIds.filter((id) => products.some((p) => p.id === id)).length;
    badge.textContent = String(validCount);
  } else {
    badge.textContent = String(wishedIds.length);
  }
}

function updateWishButtons(root = document) {
  root.querySelectorAll("[data-wishlist]").forEach((btn) => {
    const id = btn.getAttribute("data-wishlist");
    const active = id ? isWished(id) : false;
    btn.setAttribute("aria-pressed", String(active));
    btn.classList.toggle("wish-active", active);
    btn.innerHTML = active ? "♥" : "♡";
  });
}

function wireWishlistButtons(root = document) {
  root.querySelectorAll("[data-wishlist]").forEach((btn) => {
    if (btn.dataset.vvWishlistBound === "true") return;
    btn.dataset.vvWishlistBound = "true";
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-wishlist");
      if (!id) return;
      const nowWished = toggleWishlist(id);
      updateWishButtons(document);
      renderWishlistBadge();
      window.VedVigyanCart?.toast?.(nowWished ? "Added to wishlist" : "Removed from wishlist");
    });
  });
}

window.VedVigyanWishlist = {
  loadWishlist,
  saveWishlist,
  isWished,
  toggleWishlist,
  renderWishlistBadge,
  updateWishButtons,
  wireWishlistButtons
};

window.addEventListener("vedvigyan:wishlist-updated", () => {
  renderWishlistBadge();
  updateWishButtons(document);
});
const initWishlistGlobal = () => {
  renderWishlistBadge();
  updateWishButtons(document);
  wireWishlistButtons(document);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWishlistGlobal);
} else {
  initWishlistGlobal();
}


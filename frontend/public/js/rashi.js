/* Ved Vigyan — Shop by Rashi Interactions */
(function () {
  "use strict";

  const ZODIACS = [
    { name: "Aries", hindi: "मेष", slug: "aries", svg: '<path d="M 5 6 A 4 4 0 0 1 12 10 A 4 4 0 0 1 19 6 M 12 10 L 12 21" />' },
    { name: "Taurus", hindi: "वृषभ", slug: "taurus", svg: '<path d="M 12 9 A 6 6 0 1 1 12 21 A 6 6 0 1 1 12 9 M 5 4 A 7 7 0 0 1 19 4" />' },
    { name: "Gemini", hindi: "मिथुन", slug: "gemini", svg: '<path d="M 8 4 L 16 4 M 8 20 L 16 20 M 10 4 L 10 20 M 14 4 L 14 20" />' },
    { name: "Cancer", hindi: "कर्क", slug: "cancer", svg: '<path d="M 16 9 A 3 3 0 1 0 16 3 M 8 15 A 3 3 0 1 0 8 21 M 8 9 C 14 9 16 15 16 15 M 16 15 C 10 15 8 9 8 9" />' },
    { name: "Leo", hindi: "सिंह", slug: "leo", svg: '<path d="M 6 17 A 2 2 0 1 0 8 19 A 2 2 0 1 0 6 17 M 7 18 C 11 13 13 5 18 10 C 21 13 18 20 18 20" />' },
    { name: "Virgo", hindi: "कन्या", slug: "virgo", svg: '<path d="M 6 6 L 6 18 M 6 8 C 8 4 10 8 10 12 M 10 8 C 12 4 14 8 14 14 M 14 8 C 16 4 18 8 18 14 C 18 17 15 20 13 18 L 17 21" />' },
    { name: "Libra", hindi: "तुला", slug: "libra", svg: '<path d="M 5 20 L 19 20 M 5 15 C 8 10 16 10 19 15 M 9 13 A 3 3 0 0 1 15 13" />' },
    { name: "Scorpio", hindi: "वृश्चिक", slug: "scorpio", svg: '<path d="M 6 6 L 6 16 M 6 8 C 8 4 10 8 10 12 M 10 8 C 12 4 14 8 14 12 M 14 8 C 16 4 18 8 18 16 L 16 14 L 20 14" />' },
    { name: "Sagittarius", hindi: "धनु", slug: "sagittarius", svg: '<path d="M 5 19 L 19 5 M 12 5 L 19 5 L 19 12 M 9 9 L 15 15" />' },
    { name: "Capricorn", hindi: "मकर", slug: "capricorn", svg: '<path d="M 6 5 L 10 15 C 12 19 14 15 14 12 M 14 12 C 16 8 18 12 18 15 A 2 2 0 1 1 14 16" />' },
    { name: "Aquarius", hindi: "कुंभ", slug: "aquarius", svg: '<path d="M 4 8 L 8 4 L 12 8 L 16 4 L 20 8 M 4 16 L 8 12 L 12 16 L 16 12 L 20 16" />' },
    { name: "Pisces", hindi: "मीन", slug: "pisces", svg: '<path d="M 6 4 C 10 8 10 16 6 20 M 18 4 C 14 8 14 16 18 20 M 4 12 L 20 12" />' }
  ];

  let activeIndex = 0;
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  function initRashi() {
    const track = document.getElementById("rashiCarouselTrack");
    if (!track) return;

    // 1. Detect default selected rashi from URL parameter
    const params = new URLSearchParams(window.location.search);
    const queryZodiac = params.get("zodiac")?.toLowerCase();
    if (queryZodiac) {
      const idx = ZODIACS.findIndex(z => z.slug === queryZodiac);
      if (idx !== -1) {
        activeIndex = idx;
      }
    }

    // 2. Render Zodiac Cards
    renderZodiacCards(track);

    // 3. Set Active Card & Filter Products
    updateActiveState(track);

    // 4. Bind Carousel Scroll Events
    bindCarouselScroll(track);

    // 5. Scroll Active Card into View on Load
    scrollActiveIntoView(track);

    // 6. Listen to Cart updates to sync button state
    window.addEventListener("vedvigyan:cart-updated", () => {
      renderRashiProducts();
    });
  }

  function renderZodiacCards(track) {
    track.innerHTML = ZODIACS.map((z, idx) => {
      const ariaLabel = `${z.name} (${z.hindi}) Zodiac Sign`;
      return `
        <div class="rashi-card" 
             role="button" 
             tabindex="0" 
             data-index="${idx}" 
             aria-label="${ariaLabel}" 
             aria-pressed="false">
          <div class="rashi-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              ${z.svg}
            </svg>
          </div>
          <span class="rashi-name">${z.name}</span>
          <span class="rashi-hindi">${z.hindi}</span>
        </div>
      `;
    }).join("");

    // Bind Card Click Events
    const cards = track.querySelectorAll(".rashi-card");
    cards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        navigateToZodiacProduct(idx);
      });

      // Keyboard Accessibility
      card.addEventListener("keydown", (e) => {
        handleKeyboardNavigation(e, idx, track);
      });
    });
  }

  function navigateToZodiacProduct(index) {
    const activeZodiac = ZODIACS[index];
    const products = window.VED_VIGYAN_DATA?.products || [];

    // Find the product matching category: "zodiac-bracelet" and the zodiac sign
    let foundProduct = products.find(p =>
      p.category === "zodiac-bracelet" &&
      p.zodiacSigns &&
      p.zodiacSigns.some(sign => sign.toLowerCase() === activeZodiac.name.toLowerCase())
    );
    if (!foundProduct) {
      // Fallback: any product matching the zodiac sign name
      foundProduct = products.find(p =>
        p.zodiacSigns &&
        p.zodiacSigns.some(sign => sign.toLowerCase() === activeZodiac.name.toLowerCase())
      );
    }

    if (foundProduct) {
      window.location.href = foundProduct.url;
    }
  }

  function selectZodiac(index, track) {
    activeIndex = index;
    updateActiveState(track);

    // Update URL parameter without reload
    const url = new URL(window.location.href);
    url.searchParams.set("zodiac", ZODIACS[index].slug);
    window.history.replaceState({}, "", url.toString());

    // Scroll selected card to center of carousel track if needed
    const card = track.querySelector(`.rashi-card[data-index="${index}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  function handleKeyboardNavigation(e, idx, track) {
    let targetIdx = -1;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      targetIdx = (idx + 1) % ZODIACS.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      targetIdx = (idx - 1 + ZODIACS.length) % ZODIACS.length;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateToZodiacProduct(idx);
      return;
    }

    if (targetIdx !== -1) {
      const targetCard = track.querySelector(`.rashi-card[data-index="${targetIdx}"]`);
      if (targetCard) {
        targetCard.focus();
        selectZodiac(targetIdx, track);
      }
    }
  }

  function updateActiveState(track) {
    const cards = track.querySelectorAll(".rashi-card");
    cards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add("is-active");
        card.setAttribute("aria-pressed", "true");
      } else {
        card.classList.remove("is-active");
        card.setAttribute("aria-pressed", "false");
      }
    });

    renderRashiProducts();
    updateViewAllButton();
  }

  function renderRashiProducts() {
    const grid = document.getElementById("rashiProductsGrid");
    if (!grid) return;

    const products = window.VED_VIGYAN_DATA?.products || [];
    const activeZodiac = ZODIACS[activeIndex];

    // Filter products matching active zodiac sign name
    const filtered = products.filter(p => {
      if (!p.zodiacSigns || !Array.isArray(p.zodiacSigns)) return false;
      return p.zodiacSigns.some(sign => sign.toLowerCase() === activeZodiac.name.toLowerCase());
    });

    // Display only up to 4 recommended bracelets
    const maxShow = filtered.slice(0, 4);

    if (maxShow.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 48px 0; font-weight: 500;">
        No bracelets currently found for ${activeZodiac.name}.
      </div>`;
      return;
    }

    // Render using the global luxury template function
    if (window.VedVigyanHome && typeof window.VedVigyanHome.renderLuxuryProductCard === "function") {
      grid.innerHTML = maxShow.map(window.VedVigyanHome.renderLuxuryProductCard).join("");
    } else {
      // Fallback renderer if home.js fails or is delayed
      grid.innerHTML = maxShow.map(p => `
        <article class="lux-product-card" data-product-id="${p.id}">
          <div class="lux-product-media">
            <img src="${p.image}" alt="${p.imageAlt}" loading="lazy" />
          </div>
          <div class="lux-product-body">
            <h3 class="lux-product-name">${p.name}</h3>
            <div class="lux-product-price-row">
              <span class="lux-product-price">₹${p.price}</span>
            </div>
            <div class="lux-product-footer" style="margin-top: 16px;">
              <a class="lux-btn lux-btn-secondary lux-btn-sm" href="${p.url}">View Details</a>
            </div>
          </div>
        </article>
      `).join("");
    }

    // Re-bind interactive carousel and cart/wishlist button actions to the newly rendered cards
    if (window.VedVigyanCarousel && typeof window.VedVigyanCarousel.bindCarouselEvents === "function") {
      window.VedVigyanCarousel.bindCarouselEvents(grid);
    }
    if (window.VedVigyanCart && typeof window.VedVigyanCart.wireAddToCartButtons === "function") {
      window.VedVigyanCart.wireAddToCartButtons(grid);
    }
    if (window.VedVigyanWishlist && typeof window.VedVigyanWishlist.wireWishlistButtons === "function") {
      window.VedVigyanWishlist.wireWishlistButtons(grid);
    }
  }

  function updateViewAllButton() {
    const btn = document.getElementById("rashiViewAllBtn");
    if (!btn) return;
    const activeZodiac = ZODIACS[activeIndex];
    btn.textContent = `View All ${activeZodiac.name} Bracelets`;
    btn.href = `/shop.html?zodiac=${activeZodiac.slug}`;
  }

  function scrollActiveIntoView(track) {
    setTimeout(() => {
      const activeCard = track.querySelector(`.rashi-card[data-index="${activeIndex}"]`);
      if (activeCard) {
        activeCard.scrollIntoView({ block: "nearest", inline: "center" });
      }
    }, 100);
  }

  function bindCarouselScroll(track) {
    // 1. Mouse wheel horizontal scrolling
    track.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        track.scrollLeft += e.deltaY * 0.8;
      }
    }, { passive: false });

    // 2. Drag-to-scroll interaction
    track.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    const stopDragging = () => {
      isDragging = false;
    };

    track.addEventListener("mouseup", stopDragging);
    track.addEventListener("mouseleave", stopDragging);
  }

  // Self initialize when ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRashi);
  } else {
    initRashi();
  }
})();

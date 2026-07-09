function normalizePath(pathname) {
  const path = (pathname || "/").replace(/\/+$/, "");
  return path || "/index.html";
}

function isLuxuryPage() {
  return document.body?.classList?.contains("lux-home")
    || document.body?.dataset?.page === "home-luxury"
    || document.body?.dataset?.luxPage
    || document.body?.dataset?.luxShellInject === "true"
    || Boolean(document.getElementById("luxNav"));
}

function isLuxuryHomepage() {
  return document.body?.dataset?.page === "home-luxury";
}

function initGlobalTopbar() {
  if (isLuxuryPage()) return;
  const topbar = document.querySelector(".topbar");
  const container = topbar?.querySelector(".container");
  if (!container) return;
  if (container.querySelector(".topbar-ticker")) return;

  container.classList.add("topbar-ticker-wrap");
  container.innerHTML = `
    <div class="topbar-ticker" aria-label="Current offers">
      <div class="promo-track">
        <span>Limited Time Offer: Up to 39% off on selected Rudraksha</span>
        <span>Free spiritual guidance on WhatsApp for beginners</span>
        <span>Bestseller Picks: 5 Mukhi, 7 Mukhi and Tulsi Mala</span>
        <span>New arrivals now live in Rudraksha, bracelets and puja essentials</span>
        <span>Trusted authenticity guidance included with every product</span>
        <span>Limited Time Offer: Up to 39% off on selected Rudraksha</span>
        <span>Free spiritual guidance on WhatsApp for beginners</span>
        <span>Bestseller Picks: 5 Mukhi, 7 Mukhi and Tulsi Mala</span>
      </div>
    </div>
  `;
}

function initGlobalFooterSocial() {
  const contactFoot = [...document.querySelectorAll(".footer .foot")].find((section) =>
    /Contact/i.test(section.querySelector("h4")?.textContent || "")
  );
  if (!contactFoot || contactFoot.querySelector(".social-footer")) return;

  const social = document.createElement("div");
  social.className = "social social-footer";
  social.setAttribute("aria-label", "Follow Ved Vigyan");
  social.innerHTML = `
    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">yt</a>
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">fb</a>
    <a href="https://in.pinterest.com/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">pt</a>
  `;
  contactFoot.appendChild(social);
}

function syncGlobalContactInfo() {
  const email = "Vedvigyanindia@gmail.com";
  const phoneDisplay = "+91 7900811101";
  const phoneHref = "tel:+917900811101";
  const whatsappHref = "https://wa.me/917900811101";
  const businessName = "Ved Vigyan India";
  const addressLine = "Dehradun, Uttarakhand, India - 248002";

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.href = `mailto:${email}`;
    link.textContent = email;
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = phoneHref;
    link.textContent = phoneDisplay;
  });

  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach((link) => {
    link.href = whatsappHref;
  });

  document.querySelectorAll("[data-store-email]").forEach((node) => {
    node.textContent = email;
  });

  document.querySelectorAll("[data-store-phone]").forEach((node) => {
    node.textContent = phoneDisplay;
  });

  document.querySelectorAll("[data-business-name]").forEach((node) => {
    node.textContent = businessName;
  });

  document.querySelectorAll("[data-store-address]").forEach((node) => {
    node.textContent = addressLine;
  });
}

function initFooterCompliance() {
  if (isLuxuryPage()) return;
  const footer = document.querySelector(".footer");
  const container = footer?.querySelector(".container");
  if (!container) return;

  const sections = [...container.querySelectorAll(".foot")];
  if (sections[0] && !sections[0].querySelector("[data-business-name]")) {
    sections[0].innerHTML = `
      <h4><span data-business-name>Ved Vigyan India</span></h4>
      <p>Authentic spiritual essentials with clear pricing, practical guidance, and direct customer support.</p>
      <p><b>Business Name:</b> <span data-business-name>Ved Vigyan India</span></p>
    `;
  }

  if (sections[1]) {
    sections[1].innerHTML = `
      <h4>Policies</h4>
      <p><a href="/privacy-policy.html">Privacy Policy</a></p>
      <p><a href="/terms-and-conditions.html">Terms & Conditions</a></p>
      <p><a href="/refund-cancellation-policy.html">Refund / Cancellation Policy</a></p>
      <p><a href="/contact.html">Contact Us</a></p>
    `;
  }

  const contactSection = sections[2] || document.createElement("div");
  if (!sections[2]) {
    contactSection.className = "foot";
    container.appendChild(contactSection);
  }

  contactSection.innerHTML = `
    <h4>Contact</h4>
    <p>Phone: <a href="tel:+917900811101" data-store-phone>+91 7900811101</a></p>
    <p>Email: <a href="mailto:Vedvigyanindia@gmail.com" data-store-email>Vedvigyanindia@gmail.com</a></p>
    <p>Address: <span data-store-address>Dehradun, Uttarakhand, India - 248002</span></p>
    <p>WhatsApp: <a href="https://wa.me/917900811101" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>
  `;

  // Remove previously injected trust strip if present.
  footer.querySelector(".footer-trust")?.remove();

  const copyright = footer.querySelector(".copyright");
  if (copyright) {
    copyright.innerHTML = `
      © 2026 Ved Vigyan • Created by Mahima Joshi •
      <a href="mailto:joshimahima798@gmail.com">joshimahima798@gmail.com</a>
    `;
  }
}

function setActiveNav() {
  const path = normalizePath(window.location.pathname);
  const sectionMatchers = [
    { selector: '.dropdown summary', label: "Rudraksha", match: /^\/rudraksha(\/|\.html|$)|^\/rudraksha-mala(\/|\.html|$)/ },
    { selector: '.dropdown summary', label: "Jaap Mala", match: /^\/mala(\/|\.html|$)|^\/rudraksha-mala(\/|\.html|$)/ },
    { selector: '.dropdown summary', label: "Astro Stone", match: /^\/gem-stone(\/|\.html|$)/ },
    { selector: '.dropdown summary', label: "Pooja Essentials", match: /^\/puja-items(\/|\.html|$)|^\/shop\.html$/ }
  ];

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = normalizePath(link.getAttribute("href") || "");
    const isActive = href === path;
    link.setAttribute("aria-current", isActive ? "page" : "false");
    link.classList.toggle("nav-active", isActive);
  });

  document.querySelectorAll(".dropdown summary").forEach((summary) => {
    summary.classList.remove("nav-active");
    summary.setAttribute("aria-current", "false");
  });

  sectionMatchers.forEach(({ selector, label, match }) => {
    if (!match.test(path)) return;
    const summary = [...document.querySelectorAll(selector)].find(
      (node) => node.textContent.trim() === label
    );
    if (!summary) return;
    summary.classList.add("nav-active");
    summary.setAttribute("aria-current", "page");
  });
}

function initDropdowns() {
  const dropdowns = [...document.querySelectorAll(".dropdown")];
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("toggle", () => {
      if (!dropdown.open) return;
      dropdowns.forEach((other) => {
        if (other !== dropdown) other.open = false;
      });
    });
  });

  document.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) dropdown.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    dropdowns.forEach((dropdown) => {
      dropdown.open = false;
    });
  });
}

function initCategorySummaryLinks() {
  const categoryRoutes = {
    Rudraksha: "/rudraksha.html",
    "Jaap Mala": "/mala.html",
    "Astro Stone": "/gem-stone.html",
    "Pooja Essentials": "/shop.html"
  };

  document.querySelectorAll(".dropdown summary").forEach((summary) => {
    const label = summary.textContent.trim();
    const targetHref = categoryRoutes[label];
    if (!targetHref) return;

    summary.style.cursor = "pointer";
    summary.setAttribute("role", "link");
    summary.setAttribute("data-category-link", targetHref);

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = targetHref;
    });

    summary.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.location.href = targetHref;
    });
  });
}

function initMobileMenu() {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    const open = menu.getAttribute("data-open") === "true";
    menu.setAttribute("data-open", open ? "false" : "true");
    menu.style.display = open ? "none" : "block";
  });
}

function initBackToTop() {
  if (isLuxuryPage() || document.getElementById("toTop") || document.getElementById("backToTop")) return;
  const btn = document.createElement("button");
  btn.id = "toTop";
  btn.className = "btn small primary toTop";
  btn.type = "button";
  btn.textContent = "Top";
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);

  const onScroll = () => {
    const show = window.scrollY > 500;
    btn.classList.toggle("show", show);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initGlobalSearch() {
  const searchButtons = [...document.querySelectorAll('a[aria-label="Search"]')];
  if (!searchButtons.length) return;

  const ensureSearchPopover = () => {
    let pop = document.getElementById("globalSearchPopover");
    if (pop) return pop;

    pop = document.createElement("div");
    pop.id = "globalSearchPopover";
    pop.className = "nav-search-pop";
    pop.innerHTML = `
      <form id="globalSearchForm" class="nav-search-form" role="search" aria-label="Search products">
        <input id="globalSearchInput" type="search" placeholder="Search products (e.g. 5 Mukhi, Tulsi mala)" />
        <button type="submit" class="btn small primary">Search</button>
      </form>
    `;
    document.body.appendChild(pop);
    return pop;
  };

  const closePopover = () => {
    const pop = document.getElementById("globalSearchPopover");
    if (!pop) return;
    pop.classList.remove("show");
  };

  const openPopover = (button) => {
    const pop = ensureSearchPopover();
    const rect = button.getBoundingClientRect();
    pop.style.top = `${Math.round(rect.bottom + window.scrollY + 10)}px`;
    pop.style.left = `${Math.max(10, Math.round(rect.left + window.scrollX - 190))}px`;
    pop.classList.add("show");

    const input = pop.querySelector("#globalSearchInput");
    if (input) input.focus();
  };

  searchButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      // On shop page, directly focus native search box.
      const shopInput = document.getElementById("searchInput");
      if (shopInput) {
        shopInput.focus();
        shopInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      openPopover(button);
    });
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== "globalSearchForm") return;
    event.preventDefault();
    const input = form.querySelector("#globalSearchInput");
    const query = (input?.value || "").trim();
    const url = query ? `/shop.html?q=${encodeURIComponent(query)}` : "/shop.html";
    window.location.href = url;
  });

  document.addEventListener("click", (event) => {
    const pop = document.getElementById("globalSearchPopover");
    if (!pop || !pop.classList.contains("show")) return;
    if (pop.contains(event.target)) return;
    if (searchButtons.some((btn) => btn.contains(event.target))) return;
    closePopover();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePopover();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initGlobalTopbar();
  syncGlobalContactInfo();
  initFooterCompliance();
  initGlobalFooterSocial();
  setActiveNav();
  initCategorySummaryLinks();
  initDropdowns();
  initGlobalSearch();
  initMobileMenu();
  initBackToTop();
});

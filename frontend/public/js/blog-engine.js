/**
 * Ved Vigyan - WordPress Dynamic Blog Engine
 * Handles dynamic fetching, caching, category filtering, search, and article rendering.
 */

(function () {
  "use strict";

  // Helpers
  function getSlugFromPath() {
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("slug");
    if (slugParam) return slugParam;
    const path = window.location.pathname.replace(/\/+$/, "");
    const file = path.split("/").pop() || "";
    return file.replace(/\.html$/i, "");
  }

  function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  // -------------------------------------------------------------
  // 1. BLOG LISTING PAGE LOGIC (/blog)
  // -------------------------------------------------------------
  const BlogListing = {
    currentPage: 1,
    currentCategory: "",
    searchQuery: "",
    totalPages: 1,
    isLoading: false,

    init() {
      const container = document.getElementById("blogPostsGrid");
      if (!container) return;

      this.bindEvents();
      this.fetchPosts(1);
    },

    bindEvents() {
      const searchInput = document.getElementById("blogSearchInput");
      if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener("input", (e) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.searchQuery = e.target.value.trim();
            this.currentPage = 1;
            this.fetchPosts(1);
          }, 350);
        });
      }

      const loadMoreBtn = document.getElementById("blogLoadMoreBtn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
          if (this.currentPage < this.totalPages && !this.isLoading) {
            this.fetchPosts(this.currentPage + 1, true);
          }
        });
      }
    },

    renderSkeletons(append = false) {
      const grid = document.getElementById("blogPostsGrid");
      if (!grid) return;

      const skeletonHtml = Array.from({ length: 6 })
        .map(
          () => `
          <div class="vv-skeleton-card">
            <div class="vv-skeleton vv-skeleton-thumb"></div>
            <div class="vv-skeleton-body">
              <div class="vv-skeleton" style="width: 30%; height: 16px;"></div>
              <div class="vv-skeleton" style="width: 85%; height: 24px; margin-top: 6px;"></div>
              <div class="vv-skeleton" style="width: 100%; height: 14px; margin-top: 8px;"></div>
              <div class="vv-skeleton" style="width: 90%; height: 14px;"></div>
              <div class="vv-skeleton" style="width: 40%; height: 18px; margin-top: auto;"></div>
            </div>
          </div>
        `
        )
        .join("");

      if (append) {
        grid.insertAdjacentHTML("beforeend", skeletonHtml);
      } else {
        grid.innerHTML = skeletonHtml;
      }
    },

    async fetchPosts(page = 1, append = false) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.renderSkeletons(append);

      const localBlogData = window.VED_VIGYAN_DATA?.blogPosts || [];

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "9",
        include_categories: page === 1 ? "true" : "false"
      });

      if (this.currentCategory) {
        params.append("category", this.currentCategory);
      }
      if (this.searchQuery) {
        params.append("search", this.searchQuery);
      }

      try {
        const res = await fetch(`/api/blog/posts?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            if (page === 1 && data.categories && data.categories.length) {
              this.renderCategories(data.categories);
            }
            this.currentPage = data.page || page;
            this.totalPages = data.totalPages || 1;
            this.renderPosts(data.posts, append, true);
            this.isLoading = false;
            this.updateLoadMoreButton();
            return;
          }
        }
      } catch (err) {
        console.warn("[Blog Engine] Live feed note:", err.message);
      }

      // Seamless fallback to curated local Vedic articles
      if (localBlogData.length > 0) {
        let list = localBlogData.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          link: `/blog/${p.slug}.html`,
          featuredImage: p.image || "/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp",
          featuredImageAlt: p.imageAlt || p.title,
          category: p.category || "Spiritual Wisdom",
          categorySlug: p.categorySlug || "spiritual-wisdom",
          dateFormatted: new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" }),
          readTime: p.readTime || 4,
          excerpt: p.excerpt || "",
          author: "Ved Vigyan Editorial"
        }));

        if (this.currentCategory) {
          const cat = this.currentCategory.toLowerCase();
          list = list.filter(p => p.category.toLowerCase() === cat || p.categorySlug.toLowerCase() === cat);
        }

        if (this.searchQuery) {
          const q = this.searchQuery.toLowerCase();
          list = list.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
        }

        this.currentPage = 1;
        this.totalPages = 1;
        this.renderPosts(list, append, true);
      } else {
        this.renderError();
      }

      this.isLoading = false;
      this.updateLoadMoreButton();
    },

    renderCategories(categories) {
      const catContainer = document.getElementById("blogCategoriesTrack");
      if (!catContainer) return;

      let html = `<button type="button" class="vv-cat-pill ${!this.currentCategory ? "active" : ""}" data-category="">All Wisdom</button>`;
      categories.forEach((cat) => {
        html += `<button type="button" class="vv-cat-pill ${this.currentCategory === cat.slug ? "active" : ""}" data-category="${cat.id}">${cat.name}</button>`;
      });

      catContainer.innerHTML = html;

      // Click listener for categories
      catContainer.querySelectorAll(".vv-cat-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
          catContainer.querySelectorAll(".vv-cat-pill").forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          this.currentCategory = pill.getAttribute("data-category");
          this.currentPage = 1;
          this.fetchPosts(1);
        });
      });
    },

    renderPosts(posts, append = false, isConfigured = true) {
      const grid = document.getElementById("blogPostsGrid");
      if (!grid) return;

      // Remove skeletons
      const skeletons = grid.querySelectorAll(".vv-skeleton-card");
      skeletons.forEach((s) => s.remove());

      if (!posts.length && !append) {
        if (!isConfigured) {
          grid.innerHTML = `
            <div class="vv-blog-state-box">
              <span class="vv-blog-state-icon">ॐ</span>
              <h3 class="vv-blog-state-title">WordPress Journal Ready</h3>
              <p class="vv-blog-state-desc">
                Your blog system is connected and ready to stream articles live from WordPress. 
                Configure <code>WORDPRESS_API_URL</code> in your Vercel project environment variables to display your live WordPress articles here.
              </p>
              <a href="/rudraksha.html" class="vv-blog-btn-gold">Explore Sacred Rudraksha</a>
            </div>
          `;
          return;
        }

        grid.innerHTML = `
          <div class="vv-blog-state-box">
            <span class="vv-blog-state-icon">📖</span>
            <h3 class="vv-blog-state-title">No Articles Found</h3>
            <p class="vv-blog-state-desc">We couldn't find any articles matching your search. Try another topic or explore our collections.</p>
            <button type="button" class="vv-blog-btn-gold" id="resetBlogFilter">View All Articles</button>
          </div>
        `;
        const resetBtn = document.getElementById("resetBlogFilter");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            this.currentCategory = "";
            this.searchQuery = "";
            const searchInput = document.getElementById("blogSearchInput");
            if (searchInput) searchInput.value = "";
            const pills = document.querySelectorAll(".vv-cat-pill");
            pills.forEach((p, idx) => p.classList.toggle("active", idx === 0));
            this.fetchPosts(1);
          });
        }
        return;
      }

      const cardsHtml = posts
        .map((p) => {
          const postLink = p.link || (p.slug ? `/blog/${p.slug}` : (p.id ? `/blog/${p.id}` : "#"));
          const authorName = (typeof p.author === "object" && p.author)
            ? (p.author.name || "Ved Vigyan")
            : (p.author || "Ved Vigyan");
          const categoryName = (typeof p.category === "object" && p.category)
            ? (p.category.name || "Blog")
            : (p.category || "Blog");
          const featuredImg = p.featuredImage || "/public/images/logo.jpg";
          const featuredAlt = p.featuredImageAlt || p.title || "Ved Vigyan Sacred Journal";
          const dateStr = p.dateFormatted || (p.date ? new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" }) : "");
          const readTimeStr = p.readTime || 5;

          return `
        <article class="vv-post-card">
          <a href="${postLink}" class="vv-card-thumb-wrap" aria-label="${p.title}">
            <img src="${featuredImg}" alt="${featuredAlt}" class="vv-card-thumb" loading="lazy" />
            <span class="vv-card-cat-badge">${categoryName}</span>
          </a>
          <div class="vv-card-body">
            <div class="vv-card-meta">
              <span class="vv-card-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${dateStr}
              </span>
              <span>•</span>
              <span class="vv-card-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${readTimeStr} min read
              </span>
            </div>
            <a href="${postLink}" style="text-decoration:none; color:inherit;">
              <h2 class="vv-card-title">${p.title}</h2>
            </a>
            <p class="vv-card-excerpt">${p.excerpt || ""}</p>
            <div class="vv-card-footer">
              <span style="font-size:12px; color:#888;">By ${authorName}</span>
              <a href="${postLink}" class="vv-card-read-link">
                Read Article
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>
      `;
        })
        .join("");

      if (append) {
        grid.insertAdjacentHTML("beforeend", cardsHtml);
      } else {
        grid.innerHTML = cardsHtml;
      }
    },

    renderError() {
      const grid = document.getElementById("blogPostsGrid");
      if (!grid) return;
      grid.innerHTML = `
        <div class="vv-blog-state-box">
          <span class="vv-blog-state-icon">⚠️</span>
          <h3 class="vv-blog-state-title">Unable to Load Articles</h3>
          <p class="vv-blog-state-desc">There was an issue connecting to the spiritual journal. Please check your internet connection or try again.</p>
          <button type="button" class="vv-blog-btn-gold" id="retryBlogBtn">Retry</button>
        </div>
      `;
      const retryBtn = document.getElementById("retryBlogBtn");
      if (retryBtn) {
        retryBtn.addEventListener("click", () => this.fetchPosts(1));
      }
    },

    updateLoadMoreButton() {
      const loadMoreWrap = document.getElementById("blogLoadMoreWrap");
      if (!loadMoreWrap) return;
      if (this.currentPage < this.totalPages) {
        loadMoreWrap.style.display = "block";
      } else {
        loadMoreWrap.style.display = "none";
      }
    }
  };

  // -------------------------------------------------------------
  // 2. SINGLE ARTICLE PAGE LOGIC (/blog/[slug])
  // -------------------------------------------------------------
  const SingleArticle = {
    async init() {
      const articleContainer = document.getElementById("articleDetailContainer");
      if (!articleContainer) return;

      const slug = getSlugFromPath();
      if (!slug || slug === "index" || slug === "blog") {
        window.location.replace("/blog");
        return;
      }

      this.renderSkeleton();

      try {
        const res = await fetch(`/api/blog/post?slug=${encodeURIComponent(slug)}`);
        if (res.status === 404) {
          this.render404(slug);
          return;
        }
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

        const data = await res.json();
        if (!data.post) {
          this.render404(slug);
          return;
        }

        this.renderPost(data.post, data.relatedPosts || []);
        this.updateSEO(data.post);
      } catch (err) {
        console.error("[Blog Engine] Failed to load post:", err);
        this.renderError();
      }
    },

    renderSkeleton() {
      const container = document.getElementById("articleDetailContainer");
      if (!container) return;
      container.innerHTML = `
        <div class="vv-article-wrap">
          <div class="vv-skeleton" style="width: 200px; height: 16px; margin-bottom: 24px;"></div>
          <div class="vv-skeleton" style="width: 120px; height: 26px; border-radius: 50px; margin-bottom: 16px;"></div>
          <div class="vv-skeleton" style="width: 90%; height: 42px; margin-bottom: 14px;"></div>
          <div class="vv-skeleton" style="width: 60%; height: 42px; margin-bottom: 24px;"></div>
          <div class="vv-skeleton" style="width: 100%; height: 40px; margin-bottom: 30px;"></div>
          <div class="vv-skeleton" style="width: 100%; height: 420px; border-radius: 14px; margin-bottom: 36px;"></div>
          <div class="vv-skeleton" style="width: 100%; height: 20px; margin-bottom: 16px;"></div>
          <div class="vv-skeleton" style="width: 95%; height: 20px; margin-bottom: 16px;"></div>
          <div class="vv-skeleton" style="width: 80%; height: 20px; margin-bottom: 16px;"></div>
        </div>
      `;
    },

    sanitizePostContent(html) {
      if (!html) return "";
      return html
        .replace(/href=["']https?:\/\/(?:[a-zA-Z0-9-]+\.)*hostingersite\.com(\/[^"']*)?["']/gi, (match, path) => `href="${path || '/'}"`)
        .replace(/href=["']https?:\/\/(?:www\.)?vedvigyan\.in(\/[^"']*)?["']/gi, (match, path) => `href="${path || '/'}"`);
    },

    renderPost(post, relatedPosts) {
      const container = document.getElementById("articleDetailContainer");
      if (!container) return;

      const currentUrl = encodeURIComponent(window.location.href);
      const postTitleEncoded = encodeURIComponent(post.title);

      const featuredImgHtml = post.featuredImage
        ? `<img src="${post.featuredImage}" alt="${post.featuredImageAlt || post.title}" class="vv-article-featured-img" />`
        : "";

      const authorAvatar = post.author?.avatar
        ? `<img src="${post.author.avatar}" alt="${post.author.name}" class="vv-author-avatar" />`
        : `<div class="vv-author-avatar" style="background:#8a1a23; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">ॐ</div>`;

      const cleanArticleContent = this.sanitizePostContent(post.content || "");

      container.innerHTML = `
        <article class="vv-article-wrap">
          <!-- Breadcrumbs -->
          <nav class="vv-breadcrumbs-row" aria-label="Breadcrumb">
            <a href="/">Home</a> <span>/</span>
            <a href="/blog">Blog</a> <span>/</span>
            <span style="color:#8a1a23; font-weight:600;">${post.title}</span>
          </nav>

          <!-- Article Header -->
          <header class="vv-article-header">
            <span class="vv-article-cat">${post.category}</span>
            <h1 class="vv-article-title">${post.title}</h1>

            <div class="vv-article-meta-row">
              <div class="vv-author-meta">
                ${authorAvatar}
                <div>
                  <div style="font-weight:700; color:#1a0809; font-size:14px;">${post.author?.name || "Ved Vigyan Editorial"}</div>
                  <div style="font-size:12px; color:#777;">Published on ${post.dateFormatted} · ${post.readTime} min read</div>
                </div>
              </div>

              <!-- Share Buttons -->
              <div class="vv-share-bar" aria-label="Share article">
                <span style="font-size:12px; font-weight:600; color:#888; margin-right:4px;">Share:</span>
                <a href="https://api.whatsapp.com/send?text=${postTitleEncoded}%20${currentUrl}" target="_blank" rel="noopener noreferrer" class="vv-share-btn" title="Share on WhatsApp" aria-label="WhatsApp">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${currentUrl}" target="_blank" rel="noopener noreferrer" class="vv-share-btn" title="Share on Facebook" aria-label="Facebook">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/></svg>
                </a>
                <a href="https://twitter.com/intent/tweet?text=${postTitleEncoded}&url=${currentUrl}" target="_blank" rel="noopener noreferrer" class="vv-share-btn" title="Share on X (Twitter)" aria-label="X">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <button type="button" class="vv-share-btn" id="copyArticleLinkBtn" title="Copy Link" aria-label="Copy link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </button>
              </div>
            </div>
          </header>

          <!-- Featured Image -->
          ${featuredImgHtml}

          <!-- Article Content Body -->
          <div class="vv-article-body">
            ${cleanArticleContent}
          </div>

          <!-- Sacred Product Recommendation Callout -->
          <div class="vv-sacred-callout">
            <div class="vv-sacred-callout-icon">✨</div>
            <div class="vv-sacred-callout-text">
              <h4>Experience Authentic Vedic Blessings</h4>
              <p>Explore our 100% lab certified, energized Nepali Rudraksha beads, Vedic malas, and natural healing crystals blessed with traditional Vedic rituals.</p>
              <div style="margin-top:14px;">
                <a href="/rudraksha.html" class="vv-blog-btn-gold">Explore Authentic Rudraksha &rarr;</a>
              </div>
            </div>
          </div>

          <!-- Bottom Navigation / Back to Blog -->
          <div style="margin: 40px 0; text-align: center; border-top: 1px solid #ead9bd; padding-top: 30px;">
            <a href="/blog" class="vv-blog-btn-gold" style="background: #ffffff; color: #8a1a23; border: 1.5px solid #8a1a23;">
              &larr; Back to All Articles
            </a>
          </div>
        </article>

        <!-- Related Articles -->
        ${this.renderRelatedSection(relatedPosts)}
      `;

      // Copy Link Button handler
      const copyBtn = document.getElementById("copyArticleLinkBtn");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(window.location.href).then(() => {
            showToast("Article link copied to clipboard!");
          });
        });
      }

      // Defensive link interceptor: ensure any links in article body go to store
      const articleBody = container.querySelector(".vv-article-body");
      if (articleBody) {
        articleBody.addEventListener("click", (e) => {
          const link = e.target.closest("a");
          if (!link) return;
          const href = link.getAttribute("href") || "";
          if (href.includes("hostingersite.com")) {
            e.preventDefault();
            try {
              const parsed = new URL(href, window.location.origin);
              window.location.href = parsed.pathname + parsed.search + parsed.hash;
            } catch (_) {
              window.location.href = "/";
            }
          }
        });
      }
    },

    renderRelatedSection(relatedPosts) {
      if (!relatedPosts || !relatedPosts.length) return "";

      const cardsHtml = relatedPosts
        .map((rp) => {
          const rpLink = rp.link || (rp.slug ? `/blog/${rp.slug}` : (rp.id ? `/blog/${rp.id}` : "#"));
          const rpCategory = (typeof rp.category === "object" && rp.category)
            ? (rp.category.name || "Blog")
            : (rp.category || "Blog");
          return `
        <article class="vv-post-card">
          <a href="${rpLink}" class="vv-card-thumb-wrap" aria-label="${rp.title}">
            <img src="${rp.featuredImage || "/public/images/logo.jpg"}" alt="${rp.title}" class="vv-card-thumb" loading="lazy" />
            <span class="vv-card-cat-badge">${rpCategory}</span>
          </a>
          <div class="vv-card-body">
            <div class="vv-card-meta">
              <span class="vv-card-meta-item">${rp.dateFormatted || ""}</span>
            </div>
            <a href="${rpLink}" style="text-decoration:none; color:inherit;">
              <h3 class="vv-card-title" style="font-size:17px;">${rp.title}</h3>
            </a>
            <p class="vv-card-excerpt" style="-webkit-line-clamp:2;">${rp.excerpt || ""}</p>
            <div class="vv-card-footer">
              <a href="${rpLink}" class="vv-card-read-link">Read Article &rarr;</a>
            </div>
          </div>
        </article>
      `;
        })
        .join("");

      return `
        <section class="vv-related-section">
          <h2 class="vv-related-title">More Spiritual Insights</h2>
          <div class="vv-blog-grid" style="margin-top:20px;">
            ${cardsHtml}
          </div>
        </section>
      `;
    },

    updateSEO(post) {
      if (post.seoTitle) document.title = post.seoTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = post.seoDescription;

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = post.canonicalUrl;

      // OpenGraph
      this.setMetaTag("property", "og:title", post.title);
      this.setMetaTag("property", "og:description", post.seoDescription);
      this.setMetaTag("property", "og:url", post.canonicalUrl);
      this.setMetaTag("property", "og:type", "article");
      if (post.featuredImage) {
        this.setMetaTag("property", "og:image", post.featuredImage);
      }
    },

    setMetaTag(attr, key, content) {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    },

    render404(slug) {
      const container = document.getElementById("articleDetailContainer");
      if (!container) return;
      container.innerHTML = `
        <div class="vv-blog-state-box" style="margin: 60px auto;">
          <span class="vv-blog-state-icon">ॐ</span>
          <h2 class="vv-blog-state-title">Article Not Found</h2>
          <p class="vv-blog-state-desc">The sacred article you are searching for ("${slug}") is not available or has been moved.</p>
          <a href="/blog" class="vv-blog-btn-gold">&larr; Return to Sacred Journal</a>
        </div>
      `;
    },

    renderError() {
      const container = document.getElementById("articleDetailContainer");
      if (!container) return;
      container.innerHTML = `
        <div class="vv-blog-state-box" style="margin: 60px auto;">
          <span class="vv-blog-state-icon">⚠️</span>
          <h2 class="vv-blog-state-title">Unable to Load Article</h2>
          <p class="vv-blog-state-desc">There was an issue fetching the full article content. Please check your connection and try again.</p>
          <button type="button" class="vv-blog-btn-gold" onclick="window.location.reload()">Reload Article</button>
        </div>
      `;
    }
  };

  // Init depending on page
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("blogPostsGrid")) {
      BlogListing.init();
    }
    if (document.getElementById("articleDetailContainer")) {
      SingleArticle.init();
    }
  });
})();

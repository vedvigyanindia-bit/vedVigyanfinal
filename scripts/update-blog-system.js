const fs = require('fs');
const path = require('path');

// 1. Update frontend/blog.html
const blogHtmlPath = path.join(__dirname, '..', 'frontend', 'blog.html');
let blogHtml = fs.readFileSync(blogHtmlPath, 'utf8');

const oldMainPattern = /<main class="page">[\s\S]*?<\/main>/;
const newMainContent = `<main class="page">
      <!-- Luxury Blog Hero Section -->
      <section class="vv-blog-hero">
        <div class="vv-blog-hero-content">
          <div class="vv-blog-badge">ॐ Sacred Journal &amp; Vedic Wisdom</div>
          <h1 class="vv-blog-hero-title">Ved Vigyan Knowledge Centre</h1>
          <p class="vv-blog-hero-sub">
            Ancient wisdom decoded for modern living. Authentic spiritual guides on sacred Rudraksha, energized malas, and healing gemstones.
          </p>
        </div>
      </section>

      <!-- Category Filter & Search Toolbar -->
      <div class="vv-blog-toolbar">
        <div class="vv-blog-filter-row">
          <div class="vv-blog-categories" id="blogCategoriesTrack">
            <button type="button" class="vv-cat-pill active" data-category="">All Wisdom</button>
            <button type="button" class="vv-cat-pill" data-category="Rudraksha">Rudraksha</button>
            <button type="button" class="vv-cat-pill" data-category="Guide">Guide</button>
            <button type="button" class="vv-cat-pill" data-category="Crystals">Crystals</button>
            <button type="button" class="vv-cat-pill" data-category="Meditation">Meditation</button>
            <button type="button" class="vv-cat-pill" data-category="Astrology">Astrology</button>
          </div>
          <div class="vv-blog-search-box">
            <input type="text" id="blogSearchInput" placeholder="Search wisdom &amp; guides..." aria-label="Search articles" />
            <span class="vv-blog-search-icon">🔍</span>
          </div>
        </div>
      </div>

      <!-- Luxury Posts Grid -->
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
        <section class="vv-blog-grid" id="blogPostsGrid" aria-label="Blog articles"></section>
        <section id="blogList" style="display:none;" aria-hidden="true"></section>
      </div>
    </main>`;

if (oldMainPattern.test(blogHtml)) {
  blogHtml = blogHtml.replace(oldMainPattern, newMainContent);
  fs.writeFileSync(blogHtmlPath, blogHtml, 'utf8');
  console.log('Successfully updated frontend/blog.html!');
} else {
  console.error('Could not find <main class="page"> in frontend/blog.html');
}

// 2. Update frontend/public/js/blog-engine.js
const blogEnginePath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'blog-engine.js');
let blogEngine = fs.readFileSync(blogEnginePath, 'utf8');

// Update fetchPosts in BlogListing
const oldFetchPattern = /async fetchPosts\(page = 1, append = false\) \{[\s\S]*?renderCategories\(categories\)/;
const newFetchContent = `async fetchPosts(page = 1, append = false) {
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
        const res = await fetch(\`/api/blog/posts?\${params.toString()}\`);
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
          link: \`/blog/\${p.slug}.html\`,
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

    renderCategories(categories)`;

if (oldFetchPattern.test(blogEngine)) {
  blogEngine = blogEngine.replace(oldFetchPattern, newFetchContent);
  fs.writeFileSync(blogEnginePath, blogEngine, 'utf8');
  console.log('Successfully updated BlogListing in frontend/public/js/blog-engine.js!');
} else {
  console.error('Could not match oldFetchPattern in blog-engine.js');
}

/**
 * Vercel Serverless Function: Fetch WordPress Posts List & Categories
 * Route: /api/blog/posts
 */

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, ""); // Strip any HTML tags from excerpts/titles
}

function extractFirstImage(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function calculateReadTime(text) {
  if (!text) return 3;
  const words = text.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatPost(post) {
  const embedded = post._embedded || {};
  const media = embedded["wp:featuredmedia"] && embedded["wp:featuredmedia"][0];
  const terms = (embedded["wp:term"] && embedded["wp:term"][0]) || [];
  const author = (embedded["author"] && embedded["author"][0]) || {};

  const featuredImage =
    media?.media_details?.sizes?.large?.source_url ||
    media?.source_url ||
    extractFirstImage(post.content?.rendered) ||
    "/public/images/logo.jpg";

  const imageAlt = media?.alt_text || post.title?.rendered || "Ved Vigyan Sacred Journal";

  const categories = terms.map((t) => ({
    id: t.id,
    name: decodeHtmlEntities(t.name),
    slug: t.slug
  }));

  const rawExcerpt = post.excerpt?.rendered || "";
  const cleanExcerpt = decodeHtmlEntities(rawExcerpt).trim();

  return {
    id: post.id,
    slug: post.slug,
    title: decodeHtmlEntities(post.title?.rendered || "Untitled Post"),
    excerpt: cleanExcerpt,
    featuredImage,
    featuredImageAlt: imageAlt,
    date: post.date,
    dateFormatted: new Date(post.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    categories,
    category: categories[0]?.name || "Spiritual Wisdom",
    categorySlug: categories[0]?.slug || "spiritual-wisdom",
    author: author.name || "Ved Vigyan Editorial",
    readTime: calculateReadTime(post.content?.rendered || cleanExcerpt),
    link: `/blog/${post.slug}`
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawWpUrl = (
    process.env.WORDPRESS_API_URL ||
    process.env.WORDPRESS_URL ||
    process.env.WP_API_URL ||
    process.env.WP_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    ""
  ).trim();

  const wpUrl = rawWpUrl
    .replace(/\/+$/, "")
    .replace(/\/wp-json\/wp\/v2\/?$/i, "")
    .replace(/\/wp-json\/?$/i, "");

  if (!wpUrl) {
    return res.status(200).json({
      configured: false,
      message: "WordPress URL not configured. Set WORDPRESS_API_URL in Vercel Environment Variables.",
      posts: [],
      categories: [],
      totalPages: 0,
      totalPosts: 0
    });
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = Math.min(Math.max(parseInt(req.query.per_page, 10) || 9, 1), 50);
    const category = req.query.category || "";
    const search = req.query.search || "";
    const fetchCategories = req.query.include_categories === "true";

    // 1. Build posts query URL
    const params = new URLSearchParams({
      _embed: "true",
      page: page.toString(),
      per_page: perPage.toString(),
      status: "publish"
    });

    if (category) {
      // If category is numeric ID
      if (/^\d+$/.test(category)) {
        params.append("categories", category);
      } else {
        // If category is a slug, we need to lookup category ID first or use tags
        params.append("category_slug", category);
      }
    }

    if (search) {
      params.append("search", search);
    }

    const postsUrl = `${wpUrl}/wp-json/wp/v2/posts?${params.toString()}`;
    const postsRes = await fetch(postsUrl, {
      headers: { "Accept": "application/json" }
    });

    if (!postsRes.ok) {
      const errorText = await postsRes.text().catch(() => "");
      return res.status(postsRes.status).json({
        error: `WordPress API responded with status ${postsRes.status}`,
        details: errorText.slice(0, 300)
      });
    }

    const totalPosts = parseInt(postsRes.headers.get("x-wp-total") || "0", 10);
    const totalPages = parseInt(postsRes.headers.get("x-wp-totalpages") || "1", 10);
    const rawPosts = await postsRes.json();
    const formattedPosts = Array.isArray(rawPosts) ? rawPosts.map(formatPost) : [];

    let categoriesList = [];
    if (fetchCategories) {
      try {
        const catRes = await fetch(`${wpUrl}/wp-json/wp/v2/categories?per_page=100&hide_empty=true`, {
          headers: { "Accept": "application/json" }
        });
        if (catRes.ok) {
          const rawCats = await catRes.json();
          categoriesList = Array.isArray(rawCats)
            ? rawCats.map((c) => ({
                id: c.id,
                name: decodeHtmlEntities(c.name),
                slug: c.slug,
                count: c.count
              }))
            : [];
        }
      } catch (catErr) {
        console.warn("[Blog API] Could not fetch categories:", catErr.message);
      }
    }

    return res.status(200).json({
      configured: true,
      posts: formattedPosts,
      categories: categoriesList,
      page,
      perPage,
      totalPosts,
      totalPages
    });
  } catch (error) {
    console.error("[Blog API Error]:", error);
    return res.status(500).json({
      error: "Failed to fetch posts from WordPress REST API",
      message: error.message
    });
  }
};

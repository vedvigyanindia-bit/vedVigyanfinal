/**
 * Vercel Serverless Function: Fetch WordPress Posts List or Single Post by Slug
 * Routes: /api/blog/posts OR /api/blog/post?slug=...
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
    .replace(/<[^>]+>/g, "");
}

function stripTags(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
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

function sanitizeContentUrls(html, wpHost) {
  if (!html) return "";
  let cleaned = html;
  cleaned = cleaned.replace(
    /href=["']https?:\/\/(?:[a-zA-Z0-9-]+\.)*hostingersite\.com(\/[^"']*)?["']/gi,
    (match, path) => `href="${path || '/'}"`
  );
  if (wpHost) {
    try {
      const parsed = new URL(wpHost.startsWith("http") ? wpHost : `https://${wpHost}`);
      const host = parsed.hostname;
      if (host && !host.includes("vedvigyan.in")) {
        const escapedHost = host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const wpRegex = new RegExp(`href=["']https?:\\/\\/(?:www\\.)?${escapedHost}(\\/[^"']*)?["']`, "gi");
        cleaned = cleaned.replace(wpRegex, (match, path) => `href="${path || '/'}"`);
      }
    } catch (_) {}
  }
  cleaned = cleaned.replace(
    /href=["']https?:\/\/(?:www\.)?vedvigyan\.in(\/[^"']*)?["']/gi,
    (match, path) => `href="${path || '/'}"`
  );
  return cleaned;
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
    link: `/blog/${post.slug}`,
    title: decodeHtmlEntities(post.title?.rendered || ""),
    excerpt: cleanExcerpt ? cleanExcerpt.slice(0, 160) + (cleanExcerpt.length > 160 ? "…" : "") : "",
    featuredImage,
    featuredImageAlt: decodeHtmlEntities(imageAlt),
    date: post.date,
    dateFormatted: new Date(post.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    categories,
    category: categories[0]?.name || "Spiritual Wisdom",
    author: {
      name: author.name || "Ved Vigyan",
      avatar: author.avatar_urls ? author.avatar_urls["96"] : null
    },
    authorName: author.name || "Ved Vigyan",
    readTime: calculateReadTime(post.content?.rendered || "")
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
    ""
  ).trim();

  const wpUrl = rawWpUrl
    .replace(/\/+$/, "")
    .replace(/\/wp-json\/wp\/v2\/?$/i, "")
    .replace(/\/wp-json\/?$/i, "");

  if (!wpUrl) {
    return res.status(200).json({
      configured: false,
      message: "WordPress URL not configured.",
      posts: [],
      post: null
    });
  }

  // 1. SINGLE POST BY SLUG
  const slug = (req.query.slug || "").trim().toLowerCase();
  if (slug) {
    try {
      const postUrl = `${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=true`;
      const postRes = await fetch(postUrl, { headers: { "Accept": "application/json" } });
      if (!postRes.ok) return res.status(postRes.status).json({ error: `WP API error: ${postRes.status}` });

      const posts = await postRes.json();
      if (!Array.isArray(posts) || posts.length === 0) return res.status(404).json({ error: "Article not found", slug });

      const post = posts[0];
      const embedded = post._embedded || {};
      const media = embedded["wp:featuredmedia"] && embedded["wp:featuredmedia"][0];
      const terms = (embedded["wp:term"] && embedded["wp:term"][0]) || [];
      const author = (embedded["author"] && embedded["author"][0]) || {};

      const featuredImage = media?.media_details?.sizes?.large?.source_url || media?.source_url || extractFirstImage(post.content?.rendered) || null;
      const cleanTitle = decodeHtmlEntities(stripTags(post.title?.rendered || ""));
      const rawContent = sanitizeContentUrls(post.content?.rendered || "", wpUrl);
      const cleanExcerpt = decodeHtmlEntities(stripTags(post.excerpt?.rendered || "")).slice(0, 200);

      const categories = terms.map((t) => ({ id: t.id, name: decodeHtmlEntities(t.name), slug: t.slug }));

      return res.status(200).json({
        configured: true,
        post: {
          id: post.id,
          slug: post.slug,
          link: `/blog/${post.slug}`,
          title: cleanTitle,
          content: rawContent,
          excerpt: cleanExcerpt,
          featuredImage,
          featuredImageAlt: media?.alt_text || cleanTitle,
          date: post.date,
          dateFormatted: new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
          categories,
          category: categories[0]?.name || "Spiritual Wisdom",
          author: { name: author.name || "Ved Vigyan Editorial", avatar: author.avatar_urls ? author.avatar_urls["96"] : null },
          authorName: author.name || "Ved Vigyan Editorial",
          readTime: calculateReadTime(rawContent),
          seoTitle: `${cleanTitle} | Ved Vigyan`,
          seoDescription: cleanExcerpt || `Read ${cleanTitle} on Ved Vigyan.`,
          canonicalUrl: `https://vedvigyan.in/blog/${post.slug}`
        },
        relatedPosts: []
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch post", message: err.message });
    }
  }

  // 2. LIST POSTS
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(req.query.per_page, 10) || 9));
    const category = req.query.category ? req.query.category.trim() : "";
    const search = req.query.search ? req.query.search.trim() : "";

    const params = new URLSearchParams({ page: String(page), per_page: String(perPage), _embed: "true" });
    if (category) params.set("categories", category);
    if (search) params.set("search", search);

    const wpApiUrl = `${wpUrl}/wp-json/wp/v2/posts?${params.toString()}`;
    const postsRes = await fetch(wpApiUrl, { headers: { "Accept": "application/json" } });

    if (!postsRes.ok) return res.status(postsRes.status).json({ error: `WP API error: ${postsRes.status}` });

    const totalPosts = parseInt(postsRes.headers.get("x-wp-total") || "0", 10);
    const totalPages = parseInt(postsRes.headers.get("x-wp-totalpages") || "1", 10);
    const rawPosts = await postsRes.json();
    const formattedPosts = Array.isArray(rawPosts) ? rawPosts.map(formatPost) : [];

    return res.status(200).json({
      configured: true,
      posts: formattedPosts,
      categories: [],
      page,
      perPage,
      totalPosts,
      totalPages
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch posts", message: error.message });
  }
};

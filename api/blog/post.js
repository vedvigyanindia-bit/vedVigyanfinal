/**
 * Vercel Serverless Function: Fetch Single WordPress Post by Slug
 * Route: /api/blog/post?slug=...
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
    .replace(/&nbsp;/g, " ");
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

function sanitizeContentUrls(html, wpHost) {
  if (!html) return "";
  let cleaned = html;

  // 1. Transform any href linking to hostingersite.com into site-relative links
  // E.g. href="https://www.darkseagreen-goshawk-417412.hostingersite.com/products/7-mukhi-rudraksh" -> href="/products/7-mukhi-rudraksh"
  cleaned = cleaned.replace(
    /href=["']https?:\/\/(?:[a-zA-Z0-9-]+\.)*hostingersite\.com(\/[^"']*)?["']/gi,
    (match, path) => `href="${path || '/'}"`
  );

  // 2. Transform any href linking to the configured WordPress host
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

  // 3. Transform any full vedvigyan.in hrefs into relative paths
  cleaned = cleaned.replace(
    /href=["']https?:\/\/(?:www\.)?vedvigyan\.in(\/[^"']*)?["']/gi,
    (match, path) => `href="${path || '/'}"`
  );

  return cleaned;
}

function calculateReadTime(text) {
  if (!text) return 3;
  const words = text.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slug = (req.query.slug || "").trim().toLowerCase();
  if (!slug) {
    return res.status(400).json({ error: "Slug parameter is required" });
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
      post: null
    });
  }

  try {
    const postUrl = `${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=true`;
    const postRes = await fetch(postUrl, {
      headers: { "Accept": "application/json" }
    });

    if (!postRes.ok) {
      return res.status(postRes.status).json({
        error: `WordPress API responded with status ${postRes.status}`
      });
    }

    const posts = await postRes.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(404).json({ error: "Article not found", slug });
    }

    const post = posts[0];
    const embedded = post._embedded || {};
    const media = embedded["wp:featuredmedia"] && embedded["wp:featuredmedia"][0];
    const terms = (embedded["wp:term"] && embedded["wp:term"][0]) || [];
    const author = (embedded["author"] && embedded["author"][0]) || {};

    const featuredImage =
      media?.media_details?.sizes?.large?.source_url ||
      media?.source_url ||
      extractFirstImage(post.content?.rendered) ||
      null;

    const featuredImageAlt = media?.alt_text || stripTags(post.title?.rendered) || "Ved Vigyan Sacred Journal";

    const categories = terms.map((t) => ({
      id: t.id,
      name: decodeHtmlEntities(t.name),
      slug: t.slug
    }));

    const cleanTitle = decodeHtmlEntities(stripTags(post.title?.rendered || ""));
    const rawContent = sanitizeContentUrls(post.content?.rendered || "", wpUrl);
    const cleanExcerpt = decodeHtmlEntities(stripTags(post.excerpt?.rendered || "")).slice(0, 200);

    // Fetch up to 3 related posts
    let relatedPosts = [];
    try {
      const categoryId = categories[0]?.id;
      const relatedQuery = categoryId
        ? `categories=${categoryId}&exclude=${post.id}&per_page=3&_embed=true`
        : `exclude=${post.id}&per_page=3&_embed=true`;

      const relatedRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts?${relatedQuery}`, {
        headers: { "Accept": "application/json" }
      });

      if (relatedRes.ok) {
        const rawRelated = await relatedRes.json();
        if (Array.isArray(rawRelated)) {
          relatedPosts = rawRelated.map((rp) => {
            const rEmbedded = rp._embedded || {};
            const rMedia = rEmbedded["wp:featuredmedia"] && rEmbedded["wp:featuredmedia"][0];
            const rTerms = (rEmbedded["wp:term"] && rEmbedded["wp:term"][0]) || [];
            return {
              id: rp.id,
              slug: rp.slug,
              title: decodeHtmlEntities(stripTags(rp.title?.rendered || "")),
              excerpt: decodeHtmlEntities(stripTags(rp.excerpt?.rendered || "")).slice(0, 120),
              featuredImage:
                rMedia?.media_details?.sizes?.medium_large?.source_url ||
                rMedia?.source_url ||
                extractFirstImage(rp.content?.rendered) ||
                "/public/images/logo.jpg",
              category: rTerms[0]?.name || "Spiritual Wisdom",
              dateFormatted: new Date(rp.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })
            };
          });
        }
      }
    } catch (relErr) {
      console.warn("[Blog API] Could not fetch related posts:", relErr.message);
    }

    return res.status(200).json({
      configured: true,
      post: {
        id: post.id,
        slug: post.slug,
        title: cleanTitle,
        content: rawContent,
        excerpt: cleanExcerpt,
        featuredImage,
        featuredImageAlt,
        date: post.date,
        dateFormatted: new Date(post.date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        modified: post.modified,
        categories,
        category: categories[0]?.name || "Spiritual Wisdom",
        author: {
          name: author.name || "Ved Vigyan Editorial",
          avatar: author.avatar_urls ? author.avatar_urls["96"] : null,
          description: author.description || "Ancient Vedic Wisdom Practitioner"
        },
        readTime: calculateReadTime(rawContent),
        seoTitle: `${cleanTitle} | Ved Vigyan`,
        seoDescription: cleanExcerpt || `Read ${cleanTitle} on Ved Vigyan - Ancient Wisdom for Modern Living.`,
        canonicalUrl: `https://vedvigyan.in/blog/${post.slug}`
      },
      relatedPosts
    });
  } catch (error) {
    console.error("[Blog Post API Error]:", error);
    return res.status(500).json({
      error: "Failed to fetch post from WordPress REST API",
      message: error.message
    });
  }
};

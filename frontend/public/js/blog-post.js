function getPostSlug() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const file = path.split("/").pop() || "";
  return file.replace(/\.html$/i, "");
}

function renderBlogPost() {
  const slug = getPostSlug();
  const post = (window.VED_VIGYAN_DATA?.blogPosts || []).find((p) => p.slug === slug);
  if (!post) return;

  const titleEl = document.getElementById("postTitle");
  const dateEl = document.getElementById("postDate");
  const bodyEl = document.getElementById("postBody");

  if (titleEl) titleEl.textContent = post.title;
  if (dateEl) {
    dateEl.textContent = new Date(post.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    });
  }
  if (bodyEl) {
    bodyEl.innerHTML = (post.content || []).map((p) => `<p class="sub" style="margin:0 0 14px">${p}</p>`).join("");
  }

  if (post.seoTitle) document.title = post.seoTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && post.seoDescription) metaDesc.setAttribute("content", post.seoDescription);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", `/blog/${post.slug}.html`);
}

document.addEventListener("DOMContentLoaded", renderBlogPost);


function renderBlog() {
  const list = document.getElementById("blogList");
  if (!list) return;
  const posts = window.VED_VIGYAN_DATA?.blogPosts || [];

  list.innerHTML = posts
    .map((p) => {
      return `
        <article class="pagecard" style="margin-bottom:14px">
          <div class="breadcrumbs">${new Date(p.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit"
          })}</div>
          <h2 class="section-title" style="margin:0 0 8px">${p.title}</h2>
          <p class="section-sub" style="margin:0 0 14px">${p.excerpt}</p>
          <a class="btn small" href="/blog/${p.slug}.html">Read Blog</a>
        </article>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", renderBlog);


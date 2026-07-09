/**
 * Applies luxury header assets to all frontend HTML pages.
 * Run: node scripts/apply-lux-header.js
 */
const fs = require("fs");
const path = require("path");

const FRONTEND = path.join(__dirname, "..", "frontend");

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html") && entry.name !== "_partials.html") files.push(full);
  }
  return files;
}

function removeBalancedBlock(html, openTagPattern) {
  const match = html.match(openTagPattern);
  if (!match || match.index === undefined) return html;

  const start = match.index;
  let pos = start;
  let depth = 0;

  while (pos < html.length) {
    const slice = html.slice(pos);
    if (/^<div[\s>]/i.test(slice)) {
      depth += 1;
      pos += slice.match(/^<div[\s>]/i)[0].length;
      continue;
    }
    if (/^<\/div>/i.test(slice)) {
      pos += 6;
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, start) + html.slice(pos);
      }
      continue;
    }
    if (/^<header[\s>]/i.test(slice)) {
      depth += 1;
      pos += slice.match(/^<header[\s>]/i)[0].length;
      continue;
    }
    if (/^<\/header>/i.test(slice)) {
      pos += 9;
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, start) + html.slice(pos);
      }
      continue;
    }
    if (/^<footer[\s>]/i.test(slice)) {
      depth += 1;
      pos += slice.match(/^<footer[\s>]/i)[0].length;
      continue;
    }
    if (/^<\/footer>/i.test(slice)) {
      pos += 9;
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, start) + html.slice(pos);
      }
      continue;
    }
    pos += 1;
  }

  return html;
}

function stripLegacyChrome(html) {
  let out = html;
  while (/class="topbar"/i.test(out)) {
    out = removeBalancedBlock(out, /<div class="topbar">/i);
  }
  while (/<header class="nav">/i.test(out)) {
    out = removeBalancedBlock(out, /<header class="nav">/i);
  }
  while (/<footer class="footer">/i.test(out)) {
    out = removeBalancedBlock(out, /<footer class="footer">/i);
  }
  return out;
}

function ensureHeadAssets(html) {
  let out = html;
  if (!out.includes("home-luxury.css")) {
    out = out.replace(
      /<link rel="stylesheet" href="\/public\/css\/style\.css"\s*\/?>/i,
      '<link rel="stylesheet" href="/public/css/style.css" />\n    <link rel="stylesheet" href="/public/css/home-luxury.css" />'
    );
  }
  if (!out.includes("lux-shell.js")) {
    const insertBefore = out.includes('src="/public/js/ui.js"')
      ? '<script src="/public/js/ui.js"'
      : '<script src="/public/js/cart.js"';
    out = out.replace(
      insertBefore,
      '<script src="/public/js/lux-shell.js" defer></script>\n    <script src="/public/js/lux-cards.js" defer></script>\n    ' + insertBefore
    );
  }
  return out;
}

function ensureBodyAttrs(html, isHomepage) {
  let out = html;
  if (isHomepage) {
    if (!out.includes('class="lux-home"')) {
      out = out.replace(/<body([^>]*)>/i, '<body class="lux-home"$1>');
    }
    return out;
  }

  out = out.replace(/<body([^>]*)>/i, (match, attrs) => {
    let next = attrs || "";
    if (!/class="/i.test(next)) {
      next = ` class="lux-home"${next}`;
    } else if (!next.includes("lux-home")) {
      next = next.replace(/class="([^"]*)"/i, 'class="$1 lux-home"');
    }
    if (!/data-lux-shell-inject/i.test(next)) {
      next += ' data-lux-shell-inject="true"';
    }
    return `<body${next}>`;
  });
  return out;
}

const files = walkHtml(FRONTEND);
let updated = 0;

for (const file of files) {
  const rel = path.relative(FRONTEND, file).replace(/\\/g, "/");
  const isHomepage = rel === "index.html";
  let html = fs.readFileSync(file, "utf8");

  if (html.includes("_partials")) continue;

  const before = html;
  html = ensureHeadAssets(html);
  if (!isHomepage) html = stripLegacyChrome(html);
  html = ensureBodyAttrs(html, isHomepage);

  if (html !== before) {
    fs.writeFileSync(file, html, "utf8");
    updated += 1;
    console.log("Updated:", rel);
  }
}

console.log(`Done. ${updated} file(s) updated.`);

const fs = require("fs");
const path = require("path");

const FRONTEND = path.join(__dirname, "..", "frontend");
const INDEX_HTML_PATH = path.join(FRONTEND, "index.html");

function extractHeaderSection(html) {
  // Matches from top promo bar or top marquee or header tag down to </header>
  const startMatch = html.match(/(?:<div class="lux-promo-bar"|<div class="vv-top-marquee"|<header class="lux-nav")/i);
  if (!startMatch || startMatch.index === undefined) return null;

  const startPos = startMatch.index;
  const headerEndMatch = html.match(/<\/header>/i);
  if (!headerEndMatch || headerEndMatch.index === undefined) return null;

  const endPos = headerEndMatch.index + 9;
  return html.slice(startPos, endPos);
}

function replaceHeaderSection(html, newHeader) {
  const startMatch = html.match(/(?:<div class="lux-promo-bar"|<div class="vv-top-marquee"|<header class="lux-nav"|<div class="topbar")/i);
  if (!startMatch || startMatch.index === undefined) return html;

  const startPos = startMatch.index;
  const headerEndMatch = html.match(/<\/header>/i);
  if (!headerEndMatch || headerEndMatch.index === undefined) return html;

  const endPos = headerEndMatch.index + 9;
  return html.slice(0, startPos) + newHeader + html.slice(endPos);
}

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html") && entry.name !== "_partials.html") files.push(full);
  }
  return files;
}

// Read header from index.html
const indexHtml = fs.readFileSync(INDEX_HTML_PATH, "utf8");
let homeHeader = extractHeaderSection(indexHtml);

if (!homeHeader) {
  console.error("Could not extract header from index.html");
  process.exit(1);
}

// Make subpage header default to is-scrolled (white solid navbar)
homeHeader = homeHeader.replace('class="lux-nav is-transparent"', 'class="lux-nav is-scrolled"');

// Ensure home link in subpages doesn't have aria-current="page" by default
const homeHeaderSubpage = homeHeader.replace('<a class="lux-nav-link" href="/index.html" aria-current="page">', '<a class="lux-nav-link" href="/index.html">');

console.log("Extracted home header successfully.");

const files = walkHtml(FRONTEND);
let updatedCount = 0;

for (const file of files) {
  const rel = path.relative(FRONTEND, file).replace(/\\/g, "/");
  if (rel === "index.html") continue;

  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("<header")) continue;

  const updatedContent = replaceHeaderSection(content, homeHeaderSubpage);
  if (updatedContent !== content) {
    fs.writeFileSync(file, updatedContent, "utf8");
    console.log(`Updated header in: ${rel}`);
    updatedCount++;
  }
}

console.log(`Successfully updated header in ${updatedCount} file(s).`);

const fs = require("fs");
const path = require("path");

const FRONTEND = path.join(__dirname, "..", "frontend");
const INDEX_HTML_PATH = path.join(FRONTEND, "index.html");

function extractFooter(html) {
  const match = html.match(/<footer[\s>]/i);
  if (!match || match.index === undefined) return null;

  const start = match.index;
  let pos = start;
  let depth = 0;

  while (pos < html.length) {
    const slice = html.slice(pos);
    if (/^<footer[\s>]/i.test(slice)) {
      depth += 1;
      pos += slice.match(/^<footer[\s>]/i)[0].length;
      continue;
    }
    if (/^<\/footer>/i.test(slice)) {
      pos += 9;
      depth -= 1;
      if (depth === 0) {
        return html.slice(start, pos);
      }
      continue;
    }
    pos += 1;
  }
  return null;
}

function replaceFooter(html, newFooter) {
  const match = html.match(/<footer[\s>]/i);
  if (!match || match.index === undefined) return html;

  const start = match.index;
  let pos = start;
  let depth = 0;

  while (pos < html.length) {
    const slice = html.slice(pos);
    if (/^<footer[\s>]/i.test(slice)) {
      depth += 1;
      pos += slice.match(/^<footer[\s>]/i)[0].length;
      continue;
    }
    if (/^<\/footer>/i.test(slice)) {
      pos += 9;
      depth -= 1;
      if (depth === 0) {
        return html.slice(0, start) + newFooter + html.slice(pos);
      }
      continue;
    }
    pos += 1;
  }
  return html;
}

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith(".html") && entry.name !== "_partials.html") files.push(full);
  }
  return files;
}

// 1. Read home page footer from index.html
const indexHtml = fs.readFileSync(INDEX_HTML_PATH, "utf8");
const homeFooter = extractFooter(indexHtml);

if (!homeFooter) {
  console.error("Could not find footer in index.html!");
  process.exit(1);
}

console.log("Extracted home page footer successfully.");

// 2. Sync footer across all HTML files
const files = walkHtml(FRONTEND);
let updatedCount = 0;

for (const file of files) {
  const rel = path.relative(FRONTEND, file).replace(/\\/g, "/");
  if (rel === "index.html") continue;

  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("<footer")) continue;

  const updatedContent = replaceFooter(content, homeFooter);
  if (updatedContent !== content) {
    fs.writeFileSync(file, updatedContent, "utf8");
    console.log(`Updated footer in: ${rel}`);
    updatedCount++;
  }
}

console.log(`Successfully updated ${updatedCount} file(s) with the Home page footer.`);

/**
 * Removes orphaned topbar fragments left between <body> and <main>.
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

function cleanupBodyPrefix(html) {
  if (html.includes('data-page="home-luxury"') || html.includes('id="luxNav"')) {
    return html;
  }

  return html.replace(/(<body[^>]*>)[\s\S]*?(?=\s*<main\b)/i, "$1\n\n    ");
}

const files = walkHtml(FRONTEND);
let fixed = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const next = cleanupBodyPrefix(html);
  if (next !== html) {
    fs.writeFileSync(file, next, "utf8");
    fixed += 1;
    console.log("Fixed:", path.relative(FRONTEND, file).replace(/\\/g, "/"));
  }
}

console.log(`Cleaned ${fixed} file(s).`);

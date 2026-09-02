const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(__dirname, '..', 'frontend');

// 1. Delete new-launches.html and new-launches.js
const fileToDelete1 = path.join(FRONTEND, 'new-launches.html');
const fileToDelete2 = path.join(FRONTEND, 'public', 'js', 'new-launches.js');

if (fs.existsSync(fileToDelete1)) {
  fs.unlinkSync(fileToDelete1);
  console.log(`Deleted frontend/new-launches.html`);
}

if (fs.existsSync(fileToDelete2)) {
  fs.unlinkSync(fileToDelete2);
  console.log(`Deleted frontend/public/js/new-launches.js`);
}

// 2. Replace all href="/new-launches.html" with href="/shop.html" across all files
function walkFiles(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, fileList);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const allFiles = walkFiles(FRONTEND);
let replacedCount = 0;

allFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('/new-launches.html')) {
    content = content.replace(/\/new-launches\.html/g, '/shop.html');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated links in ${path.relative(FRONTEND, filePath)}`);
    replacedCount++;
  }
});

console.log(`Successfully removed new-launches and updated ${replacedCount} files.`);

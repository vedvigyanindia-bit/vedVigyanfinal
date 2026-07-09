const fs = require('fs');
const path = require('path');

const pageScripts = {
  'index.html': '/public/js/home.js',
  'shop.html': '/public/js/shop.js',
  'rudraksha.html': '/public/js/rudraksha-page.js',
  'mala.html': '/public/js/mala-page.js',
  'gem-stone.html': '/public/js/gemstone-page.js',
  'new-launches.html': '/public/js/new-launches.js',
  'wishlist.html': '/public/js/wishlist-page.js'
};

const frontendDir = path.join(__dirname, 'frontend');

Object.entries(pageScripts).forEach(([filename, pageScript]) => {
  const filePath = path.join(frontendDir, filename);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure head scripts block is clean and ordered
  const headScripts = `
    <script src="/public/js/data.js" defer></script>
    <script src="/public/js/carousel.js" defer></script>
    <script src="/public/js/cart.js" defer></script>
    <script src="/public/js/wishlist.js" defer></script>
    <script src="/public/js/ui.js" defer></script>
    <script src="${pageScript}" defer></script>
  `;

  // Replace existing head scripts or inject before </head>
  content = content.replace(/<script src="\/public\/js\/data\.js" defer><\/script>[\s\S]*?(?=<\/head>)/i, headScripts.trim() + '\n  ');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated head scripts for ${filename}`);
});

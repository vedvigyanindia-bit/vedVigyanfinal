const fs = require('fs');
const path = require('path');

const userUploadedPath = 'C:\\Users\\mahima joshi\\.gemini\\antigravity-ide\\brain\\62b8b3ca-0a5e-454d-b2c4-593f43cf1c48\\.user_uploaded\\media_1788337303955.jpg';
const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images');

const targetPng = path.join(imagesDir, 'banner-5-mukhi-rudraksha.png');
const targetJpg = path.join(imagesDir, 'banner-5-mukhi-rudraksha.jpg');
const targetHero1 = path.join(imagesDir, 'hero-1-5mukhi.png');
const target5mJpg = path.join(imagesDir, '5-mukhi-banner.jpg');
const target5mWebp = path.join(imagesDir, '5-mukhi-banner.webp');

if (fs.existsSync(userUploadedPath)) {
  const bytes = fs.readFileSync(userUploadedPath);
  fs.writeFileSync(targetPng, bytes);
  fs.writeFileSync(targetJpg, bytes);
  fs.writeFileSync(targetHero1, bytes);
  fs.writeFileSync(target5mJpg, bytes);
  fs.writeFileSync(target5mWebp, bytes);
  console.log(`Successfully written ${bytes.length} bytes to banner images in ${imagesDir}`);
} else {
  console.error(`User uploaded file not found at ${userUploadedPath}`);
}


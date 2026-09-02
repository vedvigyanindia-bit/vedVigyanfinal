const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\mahima joshi\\.gemini\\antigravity-ide\\brain\\f9ba6bf1-cdfe-4088-b51b-718174bc185b\\.user_uploaded\\media_1788264593794.png';
const destDir = path.join(__dirname, '..', 'frontend', 'public', 'images');
const destPath = path.join(destDir, 'banner-5-mukhi-rudraksha.png');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(srcPath, destPath);
console.log(`Successfully copied user banner image to ${destPath}`);

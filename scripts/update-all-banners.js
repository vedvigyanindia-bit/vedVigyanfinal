const fs = require('fs');
const path = require('path');

const srcBannerDir = path.join(__dirname, '..', 'frontend', 'banner');
const destPublicImages = path.join(__dirname, '..', 'frontend', 'public', 'images');
const destPublicBanner = path.join(destPublicImages, 'banner');

if (!fs.existsSync(destPublicBanner)) {
  fs.mkdirSync(destPublicBanner, { recursive: true });
}

// Banner 1: 5 Mukhi Nepali Rudraksha
if (fs.existsSync(path.join(srcBannerDir, '1.png'))) {
  fs.copyFileSync(path.join(srcBannerDir, '1.png'), path.join(destPublicBanner, '1.png'));
  fs.copyFileSync(path.join(srcBannerDir, '1.png'), path.join(destPublicImages, 'banner-5-mukhi-rudraksha.png'));
  fs.copyFileSync(path.join(srcBannerDir, '1.png'), path.join(destPublicImages, 'banner-5-mukhi-rudraksha.jpg'));
  fs.copyFileSync(path.join(srcBannerDir, '1.png'), path.join(destPublicImages, 'hero-1-5mukhi.png'));
  console.log('Successfully copied Banner 1');
}

// Banner 2: Karungali Mala
if (fs.existsSync(path.join(srcBannerDir, '2.png'))) {
  fs.copyFileSync(path.join(srcBannerDir, '2.png'), path.join(destPublicBanner, '2.png'));
  fs.copyFileSync(path.join(srcBannerDir, '2.png'), path.join(destPublicImages, 'banner-karungali-mala.png'));
  console.log('Successfully copied Banner 2');
}

// Banner 3: Original 5 Mukhi Rudraksha Mala
if (fs.existsSync(path.join(srcBannerDir, '3.png'))) {
  fs.copyFileSync(path.join(srcBannerDir, '3.png'), path.join(destPublicBanner, '3.png'));
  fs.copyFileSync(path.join(srcBannerDir, '3.png'), path.join(destPublicImages, 'banner-5-mukhi-mala.png'));
  console.log('Successfully copied Banner 3');
}

// Banner 4: Original Tulsi Mala
if (fs.existsSync(path.join(srcBannerDir, '4.png'))) {
  fs.copyFileSync(path.join(srcBannerDir, '4.png'), path.join(destPublicBanner, '4.png'));
  fs.copyFileSync(path.join(srcBannerDir, '4.png'), path.join(destPublicImages, 'banner-tulsi-mala.png'));
  console.log('Successfully copied Banner 4');
}

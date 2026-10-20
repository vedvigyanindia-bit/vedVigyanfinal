const fs = require('fs');
const path = require('path');

// 1. Update index.html
const indexPath = path.join(__dirname, '..', 'frontend', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

const oldTrackPattern = /<div class="dh-hero-track" id="heroTrack">[\s\S]*?<\/div>[\r\n\s]*<div class="dh-hero-dots" id="heroDots">/i;

const newTrackHtml = `<div class="dh-hero-track" id="heroTrack">
          <a class="hero__slide dh-hero-slide" href="/shop.html">
            <picture>
              <source media="(max-width:767px)" srcset="/public/images/banner/1.png">
              <img class="hero__img" src="/public/images/banner/1.png" alt="The Great Dharma Festival - Free 5 Mukhi Rudraksha on Every Prepaid Purchase" loading="eager" fetchpriority="high" width="1300" height="540" />
            </picture>
          </a>
          <a class="hero__slide dh-hero-slide" href="/rudraksha/5-mukhi.html">
            <picture>
              <source media="(max-width:767px)" srcset="/public/images/banner/2.png">
              <img class="hero__img" src="/public/images/banner/2.png" alt="Free 5 Mukhi Rudraksha on Every Prepaid Purchase - Ye Diwali Ram Rajya Wali" loading="lazy" fetchpriority="low" width="1300" height="540" />
            </picture>
          </a>
          <a class="hero__slide dh-hero-slide" href="/shop.html">
            <picture>
              <source media="(max-width:767px)" srcset="/public/images/banner/3.png">
              <img class="hero__img" src="/public/images/banner/3.png" alt="Flat 30% Off on Every Product - Diwali Festive Offer" loading="lazy" fetchpriority="low" width="1300" height="540" />
            </picture>
          </a>
        </div>
        <div class="dh-hero-dots" id="heroDots">`;

if (oldTrackPattern.test(indexHtml)) {
  indexHtml = indexHtml.replace(oldTrackPattern, newTrackHtml);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log('Successfully updated frontend/index.html');
} else {
  console.error('Pattern not found in index.html');
}

// 2. Update home.js HERO_SLIDES
const homeJsPath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'home.js');
let homeJs = fs.readFileSync(homeJsPath, 'utf8');

const oldHeroSlidesPattern = /const HERO_SLIDES = \[[\s\S]*?\];/;
const newHeroSlides = `const HERO_SLIDES = [
    {
      href: "/shop.html",
      img: "/public/images/banner/1.png",
      mobileImg: "/public/images/banner/1.png",
      alt: "The Great Dharma Festival - Free 5 Mukhi Rudraksha on Every Prepaid Purchase"
    },
    {
      href: "/rudraksha/5-mukhi.html",
      img: "/public/images/banner/2.png",
      mobileImg: "/public/images/banner/2.png",
      alt: "Free 5 Mukhi Rudraksha on Every Prepaid Purchase - Ye Diwali Ram Rajya Wali"
    },
    {
      href: "/shop.html",
      img: "/public/images/banner/3.png",
      mobileImg: "/public/images/banner/3.png",
      alt: "Flat 30% Off on Every Product - Diwali Festive Offer"
    }
  ];`;

if (oldHeroSlidesPattern.test(homeJs)) {
  homeJs = homeJs.replace(oldHeroSlidesPattern, newHeroSlides);
  fs.writeFileSync(homeJsPath, homeJs, 'utf8');
  console.log('Successfully updated frontend/public/js/home.js');
} else {
  console.error('Pattern not found in home.js');
}

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'frontend', 'blog', 'benefits-of-wearing-rudraksha.html');
const template = fs.readFileSync(templatePath, 'utf8');

const pages = [
  {
    slug: 'healing-crystals-guide',
    title: 'Healing Crystals & Gemstones: A Guide to Energy, Prosperity & Balance | Ved Vigyan Blog',
    desc: 'Learn how natural healing crystals help balance your chakras and invite prosperity, emotional balance, and clarity into your life.',
    canonical: '/blog/healing-crystals-guide.html',
    h1: 'Healing Crystals & Gemstones Guide',
    suggestion: 'Start with 7 Chakra Tree or Pyrite Bracelet for prosperity and emotional balance.'
  },
  {
    slug: 'sacred-jaap-mala-meditation',
    title: 'The Sacred 108: How to Meditate with a Jaap Mala for Transformation | Ved Vigyan Blog',
    desc: 'A comprehensive guide on how to hold, chant, and maintain a 108-bead Jaap Mala for mantra meditation.',
    canonical: '/blog/sacred-jaap-mala-meditation.html',
    h1: 'The Sacred 108: Jaap Mala Meditation',
    suggestion: 'Start with a certified 108-bead 5 Mukhi Nepali Rudraksha Mala or pure Tulsi Mala for daily jaap.'
  },
  {
    slug: 'astrology-rashi-rudraksha-guide',
    title: 'Vedic Astrology: Aligning Your Rashi with the Right Rudraksha & Gems | Ved Vigyan Blog',
    desc: 'Match your zodiac sign with the perfect Rudraksha mukhi and gemstone bracelet for planetary harmony.',
    canonical: '/blog/astrology-rashi-rudraksha-guide.html',
    h1: 'Vedic Astrology: Rashi & Rudraksha Guide',
    suggestion: 'Explore tailored Rashi bracelets energized according to your Janma Rashi moon sign.'
  }
];

pages.forEach(p => {
  let content = template;
  content = content.replace(/<title>[\s\S]*?<\/title>/, `<title>${p.title}</title>`);
  content = content.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${p.desc}" />`);
  content = content.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/, `<link rel="canonical" href="${p.canonical}" />`);
  content = content.replace(/<h1 class="section-title" id="postTitle"[\s\S]*?<\/h1>/, `<h1 class="section-title" id="postTitle" style="margin:0 0 8px">${p.h1}</h1>`);
  content = content.replace(/<b>Shop suggestion:<\/b>[\s\S]*?<\/div>/, `<b>Shop suggestion:</b> ${p.suggestion}</div>`);

  const destPath = path.join(__dirname, '..', 'frontend', 'blog', `${p.slug}.html`);
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`Created: ${p.slug}.html`);
});
